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

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { mapOneAtATime, requireEnv, createGithubClient } = require('./github-api');
const { assertDate, yesterdayUtc } = require('./dates');
const { SCHEMA_VERSION, writeJson } = require('./daily-metrics');
const {
  parseRunArtifactName,
  isE2eMetricsReport,
  E2E_METRICS_REPORTER_FORMAT_INTRODUCED_ON,
  extractTestMetrics,
  markEnvironmentProblems,
  mergeTests
} = require('./test-metrics');
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

function toExcludedTests(report, fallbackSuite) {
  return {
    suite: report.suite || fallbackSuite,
    tests: report.tests.map(({ file, title, path: filePath, line, id, reason, scope }) => ({ file, title, path: filePath, line, id, reason, scope }))
  };
}

function readArtifactMetrics(artifactDir, suite, reportUnreadableFile) {
  const excludedTestsReportKind = 'excluded';
  const metrics = [];
  let reported = false;
  let excluded = null;
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
      if (report.kind === excludedTestsReportKind) {
        excluded = toExcludedTests(report, suite);
        continue;
      }
      reported = true;
      const suiteAttempt = suiteAttemptFromFileName(file);
      const countScheduledTestsOfSuite = (metricSuite) => report.tests.filter((test) => (test.project || suite) === metricSuite).length;
      metrics.push(
        ...extractTestMetrics(report, suite).map((metric) => ({ ...metric, suiteAttempt, scheduledTests: countScheduledTestsOfSuite(metric.suite) }))
      );
    } catch (error) {
      reportUnreadableFile(file, error);
    }
  }
  return { metrics, reported, excluded };
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

const getJobNameWithoutCallerPrefix = (job) => job.name.split(' / ').pop();
const findFailedStep = (job) => (job.steps || []).find((step) => FAILED_STEP_CONCLUSIONS.has(step.conclusion));
function isEnvironmentCheckFailure(failedStep) {
  const environmentCheckStepNames = new Set(['Deploy local ACS', 'Before e2e']);
  return environmentCheckStepNames.has(failedStep?.name);
}

function findEnvironmentCheckFailures(jobs, metricSuitesByArtifact) {
  return jobs
    .filter((job) => FAILED_CONCLUSIONS.has(job.conclusion))
    .map((job) => ({ job, failedStep: findFailedStep(job) }))
    .filter(({ failedStep }) => isEnvironmentCheckFailure(failedStep))
    .map(({ job, failedStep }) => {
      const parsedJobName = parseSuiteJobName(job.name);
      return {
        name: metricSuitesOfJob(parsedJobName, metricSuitesByArtifact)[0] || parsedJobName?.suite || getJobNameWithoutCallerPrefix(job),
        job: job.id,
        step: failedStep.number ?? null,
        stepName: failedStep.name
      };
    });
}

function getFailureKind(parsedJobName, failedStep) {
  if (parsedJobName && failedStep?.name === RUN_TESTS_STEP_NAME) {
    return 'tests';
  }
  return isEnvironmentCheckFailure(failedStep) ? 'environment' : 'infra';
}

function failureCauses(jobs, metricSuitesByArtifact) {
  const causes = [];
  for (const job of jobs.filter((candidate) => FAILED_CONCLUSIONS.has(candidate.conclusion))) {
    const parsedJobName = parseSuiteJobName(job.name);
    const failedStep = findFailedStep(job);
    causes.push({
      kind: getFailureKind(parsedJobName, failedStep),
      name: metricSuitesOfJob(parsedJobName, metricSuitesByArtifact)[0] || parsedJobName?.suite || getJobNameWithoutCallerPrefix(job),
      job: job.id,
      step: failedStep?.number ?? null,
      stepName: failedStep?.name ?? null,
      suiteJob: Boolean(parsedJobName)
    });
  }
  return causes;
}

function conclusionFromFinishedJobs(jobs) {
  const finishedConclusions = new Set(jobs.filter((job) => job.status === 'completed').map((job) => job.conclusion));
  const worstConclusion = RUN_CONCLUSIONS_BY_SEVERITY.find((conclusion) => finishedConclusions.has(conclusion));
  if (worstConclusion) {
    return worstConclusion;
  }
  const suiteJobs = jobs.filter((job) => parseSuiteJobName(job.name));
  const allSuitesFinished = suiteJobs.length > 0 && suiteJobs.every((job) => job.status === 'completed');
  const anySuitePassed = suiteJobs.some((job) => job.conclusion === 'success');
  return allSuitesFinished && anySuitePassed ? 'success' : null;
}

function recordExpiredArtifacts(expiredArtifacts, run, issueLog) {
  const runPredatesReporterFormat = run.created_at?.slice(0, 10) < E2E_METRICS_REPORTER_FORMAT_INTRODUCED_ON;
  if (runPredatesReporterFormat) {
    return;
  }
  for (const artifact of expiredArtifacts) {
    issueLog.add({
      operation: 'artifact-expired',
      runId: run.id,
      runUrl: run.html_url,
      artifact: artifact.name,
      effect: `Results of suite ${parseRunArtifactName(artifact.name).suite} in run ${run.id} are missing: the test reports have expired`,
      error: new Error(`Artifact ${artifact.name} expired on ${artifact.expires_at}`)
    });
  }
}

async function listRunArtifacts(github, run, issueLog) {
  try {
    const metricsArtifacts = (await github.paginate(`/actions/runs/${run.id}/artifacts`, 'artifacts')).filter((artifact) =>
      parseRunArtifactName(artifact.name)
    );
    recordExpiredArtifacts(
      metricsArtifacts.filter((artifact) => artifact.expired),
      run,
      issueLog
    );
    return metricsArtifacts.filter((artifact) => !artifact.expired);
  } catch (error) {
    issueLog.add({ operation: 'list-artifacts', runId: run.id, runUrl: run.html_url, effect: `Test results of run ${run.id} are missing`, error });
    return [];
  }
}

async function collectArtifact(github, run, artifact, workDir, issueLog) {
  const { browser, suite } = parseRunArtifactName(artifact.name);
  const artifactDir = path.join(workDir, String(run.id), artifact.name);
  const issueContext = { runId: run.id, runUrl: run.html_url, artifact: artifact.name };
  try {
    await github.downloadAndExtractArtifact(artifact.id, artifactDir);
    const artifactMetrics = readArtifactMetrics(artifactDir, suite, (file, error) =>
      issueLog.add({ ...issueContext, operation: 'read-report', effect: `Results of suite ${suite} (${file}) in run ${run.id} are missing`, error })
    );
    return { artifactKey: `${browser}-${suite}`, ...artifactMetrics };
  } catch (error) {
    issueLog.add({ ...issueContext, operation: 'download-artifact', effect: `Results of suite ${suite} in run ${run.id} are missing`, error });
    return null;
  }
}

function recordSuitesWithoutMetrics(runJobs, reportedArtifactKeys, run, issueLog) {
  const testsRanStepConclusions = new Set(['success', 'failure']);
  const artifactIssueOperations = new Set(['download-artifact', 'read-report', 'artifact-expired']);
  const runPredatesReporterFormat = run.created_at?.slice(0, 10) < E2E_METRICS_REPORTER_FORMAT_INTRODUCED_ON;
  const runIssues = issueLog.issues.filter((issue) => issue.runId === run.id);
  const artifactsNotListed = runIssues.some((issue) => issue.operation === 'list-artifacts');
  if (runPredatesReporterFormat || artifactsNotListed) {
    return;
  }
  const artifactsWithReportedProblems = new Set(
    runIssues.filter((issue) => artifactIssueOperations.has(issue.operation)).map((issue) => issue.artifact)
  );
  for (const job of runJobs) {
    const parsedJobName = parseSuiteJobName(job.name);
    const runTestsStep = (job.steps || []).find((step) => step.name === RUN_TESTS_STEP_NAME);
    const timedOutWhileRunningTests = runTestsStep?.conclusion === TIMED_OUT_JOB_STEP_CONCLUSION && FAILED_CONCLUSIONS.has(job.conclusion);
    const testsRan = testsRanStepConclusions.has(runTestsStep?.conclusion) || timedOutWhileRunningTests;
    const artifactKey = parsedJobName && `${parsedJobName.browser}-${parsedJobName.suite}`;
    const artifactProblemReported = artifactsWithReportedProblems.has(`e2e-metrics-${artifactKey}`);
    if (parsedJobName && testsRan && !reportedArtifactKeys.has(artifactKey) && !artifactProblemReported) {
      issueLog.add({
        operation: 'missing-metrics',
        runId: run.id,
        runUrl: run.html_url,
        effect: `Suite "${parsedJobName.suite}" ran its tests in run ${run.id} but no E2E metrics report of it was found, so its results are missing. Check that its job passes metrics-dir to the run-e2e-playwright action and uploads the e2e-metrics-${artifactKey} artifact`,
        error: new Error(`No e2e-metrics report in artifact e2e-metrics-${artifactKey}`)
      });
    }
  }
}

async function collectRun(github, run, workDir, issueLog) {
  const artifacts = await listRunArtifacts(github, run, issueLog);
  const collectedArtifacts = (await mapOneAtATime(artifacts, (artifact) => collectArtifact(github, run, artifact, workDir, issueLog))).filter(
    Boolean
  );
  const metrics = collectedArtifacts.flatMap((collected) => collected.metrics);
  const metricSuitesByArtifact = new Map(
    collectedArtifacts.map(({ artifactKey, metrics: artifactMetrics }) => [artifactKey, new Set(artifactMetrics.map((metric) => metric.suite))])
  );
  const runJobs = await listLatestAttemptJobs(github, run, issueLog);
  const conclusion = run.conclusion || (runJobs ? conclusionFromFinishedJobs(runJobs) : null);
  if (runJobs) {
    const reportedArtifactKeys = new Set(collectedArtifacts.filter((collected) => collected.reported).map((collected) => collected.artifactKey));
    recordSuitesWithoutMetrics(runJobs, reportedArtifactKeys, run, issueLog);
  }
  const marked = markEnvironmentProblems(metrics);
  return {
    artifactCount: artifacts.length,
    metrics: marked.metrics,
    excluded: collectedArtifacts.map((collected) => collected.excluded).filter(Boolean),
    environment: runJobs ? findEnvironmentCheckFailures(runJobs, metricSuitesByArtifact) : [],
    incidents: marked.incidents,
    conclusion,
    suites: runJobs ? jobTimingByMetricSuite(runJobs, metricSuitesByArtifact) : {},
    failure: runJobs && FAILED_CONCLUSIONS.has(conclusion) ? failureCauses(runJobs, metricSuitesByArtifact) : []
  };
}

async function collectRunOrRecordIssue(github, run, workflow, workDir, issueLog) {
  try {
    return await collectRun(github, run, workDir, issueLog);
  } catch (error) {
    issueLog.add({ operation: 'collect-run', runId: run.id, runUrl: run.html_url, workflow, effect: `Results of run ${run.id} are missing`, error });
    return null;
  }
}

function toRunSummary(run, workflow, { artifactCount, conclusion, suites, failure, environment, incidents }) {
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
  if (environment.length) {
    summary.environment = environment;
  }
  if (incidents.length) {
    summary.incidents = incidents;
  }
  return summary;
}

async function listWorkflowRuns(github, workflow, { date, branch }, issueLog) {
  try {
    const workflowRuns = await github.paginate(
      `/actions/workflows/${encodeURIComponent(workflow)}/runs?status=completed&branch=${encodeURIComponent(branch)}&created=${date}`,
      'workflow_runs'
    );
    return workflowRuns.map((run) => ({ run, workflow }));
  } catch (error) {
    if (error.status === 404) {
      console.warn(`Workflow ${workflow} not found (not on the default branch and never run), skipping.`);
    } else {
      issueLog.add({ operation: 'list-runs', workflow, effect: `Runs of ${workflow} are missing`, error });
    }
    return [];
  }
}

async function getIncludedRun(github, { includeRunId, branch, date }, issueLog) {
  try {
    const run = await github.getJson(`/actions/runs/${encodeURIComponent(includeRunId)}`);
    const createdOn = run.created_at?.slice(0, 10);
    if (run.head_branch !== branch) {
      console.warn(`Run ${includeRunId} is on branch "${run.head_branch}", only "${branch}" runs are counted.`);
    } else if (createdOn !== date) {
      console.warn(`Run ${includeRunId} started on ${createdOn}, so it is collected with that day, not ${date}.`);
    } else {
      return { run, workflow: path.basename(run.path || run.name) };
    }
  } catch (error) {
    issueLog.add({ operation: 'get-run', runId: Number(includeRunId), effect: `Results of the current run ${includeRunId} are missing`, error });
  }
  return null;
}

async function listRuns(github, { sourceWorkflows, date, branch, includeRunId }, issueLog) {
  const runs = (await mapOneAtATime(sourceWorkflows, (workflow) => listWorkflowRuns(github, workflow, { date, branch }, issueLog))).flat();
  if (includeRunId && !runs.some(({ run }) => String(run.id) === includeRunId)) {
    const includedRun = await getIncludedRun(github, { includeRunId, branch, date }, issueLog);
    if (includedRun) {
      runs.push(includedRun);
    }
  }
  return runs;
}

function getLatestExcludedTestsBySuite(listedRuns, collectedRuns) {
  const excludedBySuite = {};
  const runsOldestFirst = listedRuns
    .map(({ run }, index) => ({ createdAt: run.created_at || '', collected: collectedRuns[index] }))
    .sort((first, second) => first.createdAt.localeCompare(second.createdAt));
  for (const { collected } of runsOldestFirst) {
    for (const { suite, tests } of collected?.excluded || []) {
      excludedBySuite[suite] = { tests };
    }
  }
  return excludedBySuite;
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
  let excludedBySuite = {};
  const perRunMetrics = [];
  const perRunTestResults = [];
  const issueLog = createDataIssueLog('collect', { date });
  try {
    const listedRuns = await listRuns(github, { sourceWorkflows, date, branch, includeRunId }, issueLog);
    const collectedRuns = await mapOneAtATime(listedRuns, ({ run, workflow }) => collectRunOrRecordIssue(github, run, workflow, workDir, issueLog));
    listedRuns.forEach(({ run, workflow }, index) => {
      const collected = collectedRuns[index];
      if (!collected) {
        return;
      }
      const { artifactCount, metrics } = collected;
      console.log(`${workflow} run ${run.id} (${run.display_title}): ${artifactCount} metrics artifact(s), ${metrics.length} test run(s)`);
      const hasTestResults = metrics.length > 0;
      const hasFailureCause = collected.failure.length > 0 || collected.environment.length > 0;
      const hasDataIssue = issueLog.issues.some((issue) => issue.runId === run.id);
      if (hasTestResults || hasFailureCause || hasDataIssue) {
        runs.push(toRunSummary(run, workflow, collected));
        perRunMetrics.push(metrics);
        perRunTestResults.push(...metrics.map(({ key, suiteAttempt, detail }) => ({ key, runId: run.id, suiteAttempt, ...detail })));
      }
    });
    excludedBySuite = getLatestExcludedTestsBySuite(listedRuns, collectedRuns);
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }

  const tests = mergeTests(perRunMetrics).sort((first, second) => first.key.localeCompare(second.key));
  const daily = { schemaVersion: SCHEMA_VERSION, date, generatedAt: new Date().toISOString(), runs, tests, results: perRunTestResults };
  if (Object.keys(excludedBySuite).length) {
    daily.excluded = excludedBySuite;
  }
  if (issueLog.issues.length) {
    daily.issues = issueLog.issues;
  }
  writeJson(outputFile, daily);
  appendIssuesToStepSummary(issueLog.issues, `E2E metrics collection problems for ${date}`);
  console.log(`Wrote ${outputFile}: ${runs.length} run(s), ${tests.length} test(s), ${issueLog.issues.length} data problem(s).`);
  if (runs.length === 0) {
    console.log(`::warning::No completed ${sourceWorkflows.join(' or ')} runs on ${branch} were found for ${date}, so this day has no E2E data.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
