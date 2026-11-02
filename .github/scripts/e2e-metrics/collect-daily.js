/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { requireEnv, createGithubClient } = require('./github-api');
const { assertDate, yesterdayUtc } = require('./dates');
const { SCHEMA_VERSION, writeJson } = require('./daily-metrics');
const { parseRunArtifactName, isE2eMetricsReport, extractTestMetrics, mergeTests } = require('./test-metrics');
const { createDataIssueLog, appendIssuesToStepSummary } = require('./data-issues');

const DEFAULT_SOURCE_WORKFLOWS = 'cron-e2e-chrome.yml,populate-e2e-reports.yml';
const DEFAULT_SOURCE_BRANCH = 'develop';
const RUN_CONCLUSIONS_BY_SEVERITY = ['failure', 'timed_out', 'cancelled'];
const FAILED_CONCLUSIONS = new Set(['failure', 'timed_out']);
const TIMED_OUT_JOB_STEP_CONCLUSION = 'cancelled';
const FAILED_STEP_CONCLUSIONS = new Set([...FAILED_CONCLUSIONS, TIMED_OUT_JOB_STEP_CONCLUSION]);
const RUN_TESTS_STEP_NAME = 'Run e2e playwright';
const SUITE_JOB_NAME_PATTERN = /(?:^|\/ )E2E \| (\S+) \| (.+) \| Playwright$/;

const suiteAttemptFromFileName = (fileName) => Number(/attempt-(\d+)/.exec(fileName)?.[1]) || 1;

function readArtifactMetrics(artifactDir, suite, reportUnreadableFile) {
  const metrics = [];
  for (const file of fs
    .readdirSync(artifactDir)
    .filter((name) => name.endsWith('.json'))
    .sort()) {
    try {
      const report = JSON.parse(fs.readFileSync(path.join(artifactDir, file), 'utf8'));
      if (!isE2eMetricsReport(report)) {
        console.log(`Skipping ${path.basename(artifactDir)}/${file}: written before the aca-e2e-metrics format existed.`);
        continue;
      }
      const suiteAttempt = suiteAttemptFromFileName(file);
      metrics.push(...extractTestMetrics(report, suite).map((metric) => ({ ...metric, suiteAttempt })));
    } catch (error) {
      reportUnreadableFile(file, error);
    }
  }
  return metrics;
}

function parseSuiteJobName(name) {
  const match = SUITE_JOB_NAME_PATTERN.exec(name || '');
  return match ? { browser: match[1], suite: match[2] } : null;
}

async function listLatestAttemptJobs(github, run, issueLog) {
  try {
    return await github.paginate(`/actions/runs/${run.id}/jobs?filter=latest`, 'jobs');
  } catch (error) {
    issueLog.add({
      operation: 'list-jobs',
      runId: run.id,
      runUrl: run.html_url,
      effect: `Job links, CI timing and failure causes of run ${run.id} are missing`,
      error
    });
    return null;
  }
}

const secondsBetween = (from, to) => (from && to ? Math.max(0, Math.round((Date.parse(to) - Date.parse(from)) / 1000)) : null);

function metricSuitesOfJob(parsedJobName, metricSuitesByArtifact) {
  return [...((parsedJobName && metricSuitesByArtifact.get(`${parsedJobName.browser}-${parsedJobName.suite}`)) || [])];
}

function jobTimingByMetricSuite(jobs, metricSuitesByArtifact) {
  const timingBySuite = {};
  for (const job of jobs) {
    const metricSuites = metricSuitesOfJob(parseSuiteJobName(job.name), metricSuitesByArtifact);
    if (!metricSuites.length) {
      continue;
    }
    const runTestsStep = (job.steps || []).find((step) => step.name === RUN_TESTS_STEP_NAME);
    const timing = {
      job: job.id,
      step: runTestsStep?.number ?? null,
      setup: runTestsStep ? secondsBetween(job.started_at, runTestsStep.started_at) : null,
      tests: runTestsStep ? secondsBetween(runTestsStep.started_at, runTestsStep.completed_at) : null,
      total: secondsBetween(job.started_at, job.completed_at)
    };
    metricSuites.forEach((suite) => (timingBySuite[suite] = timing));
  }
  return timingBySuite;
}

function failureCauses(jobs, metricSuitesByArtifact) {
  const causes = [];
  for (const job of jobs.filter((candidate) => FAILED_CONCLUSIONS.has(candidate.conclusion))) {
    const parsedJobName = parseSuiteJobName(job.name);
    const failedStep = (job.steps || []).find((step) => FAILED_STEP_CONCLUSIONS.has(step.conclusion));
    const testsFailed = parsedJobName && failedStep?.name === RUN_TESTS_STEP_NAME;
    const jobNameWithoutCallerPrefix = job.name.split(' / ').pop();
    causes.push({
      kind: testsFailed ? 'tests' : 'infra',
      name: metricSuitesOfJob(parsedJobName, metricSuitesByArtifact)[0] || parsedJobName?.suite || jobNameWithoutCallerPrefix,
      job: job.id,
      step: failedStep?.number ?? null,
      stepName: failedStep?.name ?? null
    });
  }
  return causes;
}

function conclusionFromSuiteJobs(jobs) {
  const suiteJobs = jobs.filter((job) => parseSuiteJobName(job.name));
  if (!suiteJobs.length || suiteJobs.some((job) => job.status !== 'completed')) {
    return null;
  }
  const conclusions = new Set(suiteJobs.map((job) => job.conclusion));
  return RUN_CONCLUSIONS_BY_SEVERITY.find((conclusion) => conclusions.has(conclusion)) || 'success';
}

async function listRunArtifacts(github, run, issueLog) {
  try {
    return (await github.paginate(`/actions/runs/${run.id}/artifacts`, 'artifacts')).filter(
      (artifact) => !artifact.expired && parseRunArtifactName(artifact.name)
    );
  } catch (error) {
    issueLog.add({ operation: 'list-artifacts', runId: run.id, runUrl: run.html_url, effect: `Test results of run ${run.id} are missing`, error });
    return [];
  }
}

async function collectRun(github, run, workDir, issueLog) {
  const artifacts = await listRunArtifacts(github, run, issueLog);
  const metrics = [];
  const metricSuitesByArtifact = new Map();
  for (const artifact of artifacts) {
    const { browser, suite } = parseRunArtifactName(artifact.name);
    const artifactDir = path.join(workDir, String(run.id), artifact.name);
    const issueContext = { runId: run.id, runUrl: run.html_url, artifact: artifact.name };
    try {
      await github.downloadAndExtractArtifact(artifact.id, artifactDir);
      const artifactMetrics = readArtifactMetrics(artifactDir, suite, (file, error) =>
        issueLog.add({ ...issueContext, operation: 'read-report', effect: `Results of suite ${suite} (${file}) in run ${run.id} are missing`, error })
      );
      metrics.push(...artifactMetrics);
      metricSuitesByArtifact.set(`${browser}-${suite}`, new Set(artifactMetrics.map((metric) => metric.suite)));
    } catch (error) {
      issueLog.add({ ...issueContext, operation: 'download-artifact', effect: `Results of suite ${suite} in run ${run.id} are missing`, error });
    }
  }
  const hasTestResults = metricSuitesByArtifact.size > 0;
  const runFailed = FAILED_CONCLUSIONS.has(run.conclusion);
  const runJobs = hasTestResults || runFailed ? await listLatestAttemptJobs(github, run, issueLog) : null;
  const conclusion = run.conclusion || (runJobs ? conclusionFromSuiteJobs(runJobs) : null);
  return {
    artifactCount: artifacts.length,
    metrics,
    conclusion,
    suites: runJobs ? jobTimingByMetricSuite(runJobs, metricSuitesByArtifact) : {},
    failure: runJobs && FAILED_CONCLUSIONS.has(conclusion) ? failureCauses(runJobs, metricSuitesByArtifact) : []
  };
}

function toRunSummary(run, workflow, { artifactCount, conclusion, suites, failure }) {
  const summary = {
    id: run.id,
    workflow,
    title: run.display_title,
    branch: run.head_branch,
    event: run.event,
    conclusion,
    createdAt: run.created_at,
    url: run.html_url,
    artifacts: artifactCount,
    suites
  };
  const runWasStillInProgress = !run.conclusion && conclusion;
  if (runWasStillInProgress) {
    summary.conclusionFrom = 'e2e-jobs';
  }
  if (failure.length) {
    summary.failure = failure;
  }
  return summary;
}

async function listRuns(github, { sourceWorkflows, date, branch, includeRunId }, issueLog) {
  const runs = [];
  for (const workflow of sourceWorkflows) {
    try {
      const workflowRuns = await github.paginate(
        `/actions/workflows/${encodeURIComponent(workflow)}/runs?status=completed&branch=${encodeURIComponent(branch)}&created=${date}`,
        'workflow_runs'
      );
      runs.push(...workflowRuns.map((run) => ({ run, workflow })));
    } catch (error) {
      if (error.status === 404) {
        console.warn(`Workflow ${workflow} not found (not on the default branch and never run), skipping.`);
      } else {
        issueLog.add({ operation: 'list-runs', workflow, effect: `Runs of ${workflow} are missing`, error });
      }
    }
  }

  if (includeRunId && !runs.some(({ run }) => String(run.id) === includeRunId)) {
    try {
      const run = await github.getJson(`/actions/runs/${encodeURIComponent(includeRunId)}`);
      if (run.head_branch === branch) {
        runs.push({ run, workflow: path.basename(run.path || run.name) });
      } else {
        console.warn(`Run ${includeRunId} is on branch "${run.head_branch}", only "${branch}" runs are counted.`);
      }
    } catch (error) {
      issueLog.add({ operation: 'get-run', runId: Number(includeRunId), effect: `Results of the current run ${includeRunId} are missing`, error });
    }
  }
  return runs;
}

async function main() {
  const repository = requireEnv('GITHUB_REPOSITORY');
  const date = assertDate(process.env.METRICS_DATE || yesterdayUtc(), 'METRICS_DATE');
  const sourceWorkflows = (process.env.SOURCE_WORKFLOWS || DEFAULT_SOURCE_WORKFLOWS)
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
  const branch = process.env.SOURCE_BRANCH || DEFAULT_SOURCE_BRANCH;
  const includeRunId = process.env.INCLUDE_RUN_ID;
  const outputFile = process.env.OUTPUT_FILE || path.join('e2e-metrics-daily', `${date}.json`);
  const github = createGithubClient({ token: requireEnv('GITHUB_TOKEN'), repository, apiUrl: process.env.GITHUB_API_URL });
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-metrics-'));

  const runs = [];
  const perRunMetrics = [];
  const perRunTestResults = [];
  const issueLog = createDataIssueLog('collect', { date });
  try {
    for (const { run, workflow } of await listRuns(github, { sourceWorkflows, date, branch, includeRunId }, issueLog)) {
      let collected;
      try {
        collected = await collectRun(github, run, workDir, issueLog);
      } catch (error) {
        issueLog.add({
          operation: 'collect-run',
          runId: run.id,
          runUrl: run.html_url,
          workflow,
          effect: `Results of run ${run.id} are missing`,
          error
        });
        continue;
      }
      const { artifactCount, metrics } = collected;
      console.log(`${workflow} run ${run.id} (${run.display_title}): ${artifactCount} metrics artifact(s), ${metrics.length} test run(s)`);
      const hasTestResults = metrics.length > 0;
      const hasFailureCause = collected.failure.length > 0;
      const hasDataIssue = issueLog.issues.some((issue) => issue.runId === run.id);
      if (hasTestResults || hasFailureCause || hasDataIssue) {
        runs.push(toRunSummary(run, workflow, collected));
        perRunMetrics.push(metrics);
        perRunTestResults.push(...metrics.map(({ key, suiteAttempt, detail }) => ({ key, runId: run.id, suiteAttempt, ...detail })));
      }
    }
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }

  const tests = mergeTests(perRunMetrics).sort((a, b) => a.key.localeCompare(b.key));
  const daily = { schemaVersion: SCHEMA_VERSION, date, generatedAt: new Date().toISOString(), runs, tests, results: perRunTestResults };
  if (issueLog.issues.length) {
    daily.issues = issueLog.issues;
  }
  writeJson(outputFile, daily);
  appendIssuesToStepSummary(issueLog.issues, `E2E metrics collection problems for ${date}`);
  console.log(`Wrote ${outputFile}: ${runs.length} run(s), ${tests.length} test(s), ${issueLog.issues.length} data problem(s).`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { readArtifactMetrics, parseSuiteJobName };
