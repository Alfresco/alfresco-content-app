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

/**
 * Collects the `e2e-metrics-<browser>-<suite>` artifacts (e2e-metrics reporter output) uploaded by the
 * E2E workflow runs created on a given UTC day on the source branch and compacts them into a single
 * daily metrics file with per-test runs, retries, failures and durations.
 *
 * Env:
 *  - GITHUB_TOKEN, GITHUB_REPOSITORY (required)
 *  - METRICS_DATE: UTC day to collect (YYYY-MM-DD), defaults to yesterday
 *  - SOURCE_WORKFLOWS: comma-separated workflow file names to collect from
 *  - SOURCE_BRANCH: only runs on this branch are collected (default `develop`)
 *  - INCLUDE_RUN_ID: also collect this run even if it is still in progress (e.g. the current run)
 *  - OUTPUT_FILE: where to write the daily metrics JSON
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  SCHEMA_VERSION,
  requireEnv,
  assertDate,
  yesterdayUtc,
  createGithubClient,
  parseRunArtifactName,
  extractTestMetrics,
  mergeTests,
  writeJson
} = require('./lib');

const DEFAULT_SOURCE_WORKFLOWS = 'cron-e2e-chrome.yml,populate-e2e-reports.yml';
const DEFAULT_SOURCE_BRANCH = 'develop';
// The jobs API intermittently returns 502; one retry is enough in practice.
const JOBS_REQUEST_ATTEMPTS = 2;
// Result of a run derived from its E2E suite jobs: the first conclusion found in this order, otherwise success.
const E2E_CONCLUSION_PRIORITY = ['failure', 'timed_out', 'cancelled'];
const FAILED_CONCLUSIONS = new Set(['failure', 'timed_out']);
// A timed-out job reports its interrupted step as cancelled.
const FAILED_STEP_CONCLUSIONS = new Set(['failure', 'timed_out', 'cancelled']);
// Step of the E2E suite jobs (e2e-playwright-reusable.yml) that runs the tests.
const RUN_TESTS_STEP = 'Run e2e playwright';

/** Read every suite-attempt report found in an extracted artifact directory. */
function readArtifactMetrics(artifactDir, suite) {
  const metrics = [];
  for (const file of fs
    .readdirSync(artifactDir)
    .filter((name) => name.endsWith('.json'))
    .sort()) {
    try {
      const report = JSON.parse(fs.readFileSync(path.join(artifactDir, file), 'utf8'));
      // attempt-<n>.json: n-th run of the whole suite within the workflow run.
      const suiteAttempt = Number(/attempt-(\d+)/.exec(file)?.[1]) || 1;
      metrics.push(...extractTestMetrics(report, suite).map((metric) => ({ ...metric, suiteAttempt })));
    } catch (error) {
      console.warn(`Skipping unreadable report ${artifactDir}/${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return metrics;
}

/** Parse `E2E | <browser> | <suite> | Playwright` job names, optionally prefixed by the caller job (`chrome / E2E | ...`). */
function parseSuiteJobName(name) {
  const match = /(?:^|\/ )E2E \| (\S+) \| (.+) \| Playwright$/.exec(name || '');
  return match ? { browser: match[1], suite: match[2] } : null;
}

/** Jobs of the latest attempt of a run (its metrics artifacts overwrite those of earlier attempts), or null if unavailable. */
async function listRunJobs(github, run) {
  for (let attempt = 1; attempt <= JOBS_REQUEST_ATTEMPTS; attempt++) {
    try {
      return await github.paginate(`/actions/runs/${run.id}/jobs?filter=latest`, 'jobs');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (attempt === JOBS_REQUEST_ATTEMPTS) {
        console.warn(`Could not list jobs of run ${run.id}, its results link to the run and have no job timing: ${message}`);
      }
    }
  }
  return null;
}

const seconds = (from, to) => (from && to ? Math.max(0, Math.round((Date.parse(to) - Date.parse(from)) / 1000)) : null);

/**
 * Per collected suite: its job, the number of the step that runs the tests (so links open it directly) and how the job
 * time splits into setup before the tests (ACS deploy, installs...) and the tests themselves, in seconds. Keyed by the
 * suite names used in the metrics (the Playwright project name, e.g. `Viewer`), which differ from the job/artifact
 * suite (`viewer`).
 */
function suiteJobs(jobs, metricSuitesByArtifact) {
  const suites = {};
  for (const job of jobs) {
    const parsed = parseSuiteJobName(job.name);
    const metricSuites = [...((parsed && metricSuitesByArtifact.get(`${parsed.browser}-${parsed.suite}`)) || [])];
    if (!metricSuites.length) {
      continue;
    }
    const testStep = (job.steps || []).find((step) => step.name === RUN_TESTS_STEP);
    const info = {
      job: job.id,
      step: testStep?.number ?? null,
      setup: testStep ? seconds(job.started_at, testStep.started_at) : null,
      tests: testStep ? seconds(testStep.started_at, testStep.completed_at) : null,
      total: seconds(job.started_at, job.completed_at)
    };
    metricSuites.forEach((suite) => (suites[suite] = info));
  }
  return suites;
}

/**
 * Why a run failed, one entry per failed job: `tests` when the step running the tests failed, otherwise `infra` with the
 * step that failed (build, ACS deploy, browser install...). Suites are named like in the metrics when known.
 */
function failureCause(jobs, metricSuitesByArtifact) {
  const cause = [];
  for (const job of jobs.filter((candidate) => FAILED_CONCLUSIONS.has(candidate.conclusion))) {
    const parsed = parseSuiteJobName(job.name);
    const failedStep = (job.steps || []).find((step) => FAILED_STEP_CONCLUSIONS.has(step.conclusion));
    const metricSuites = [...((parsed && metricSuitesByArtifact.get(`${parsed.browser}-${parsed.suite}`)) || [])];
    cause.push({
      kind: parsed && failedStep?.name === RUN_TESTS_STEP ? 'tests' : 'infra',
      name: metricSuites[0] || parsed?.suite || job.name.split(' / ').pop(),
      job: job.id,
      step: failedStep?.number ?? null,
      stepName: failedStep?.name ?? null
    });
  }
  return cause;
}

/**
 * Result of the E2E suite jobs of a run, for runs still in progress when collected (the run that publishes the report
 * cannot know its own result). Null while a suite job is still running or when the run has no suite jobs.
 */
function e2eJobsConclusion(jobs) {
  const suiteJobs = jobs.filter((job) => parseSuiteJobName(job.name));
  if (!suiteJobs.length || suiteJobs.some((job) => job.status !== 'completed')) {
    return null;
  }
  const conclusions = new Set(suiteJobs.map((job) => job.conclusion));
  return E2E_CONCLUSION_PRIORITY.find((conclusion) => conclusions.has(conclusion)) || 'success';
}

async function collectRun(github, run, workDir) {
  const artifacts = (await github.paginate(`/actions/runs/${run.id}/artifacts`, 'artifacts')).filter(
    (artifact) => !artifact.expired && parseRunArtifactName(artifact.name)
  );
  const metrics = [];
  const metricSuitesByArtifact = new Map();
  for (const artifact of artifacts) {
    const { browser, suite } = parseRunArtifactName(artifact.name);
    const artifactDir = path.join(workDir, String(run.id), artifact.name);
    try {
      await github.downloadArtifact(artifact.id, artifactDir);
      const artifactMetrics = readArtifactMetrics(artifactDir, suite);
      metrics.push(...artifactMetrics);
      metricSuitesByArtifact.set(`${browser}-${suite}`, new Set(artifactMetrics.map((metric) => metric.suite)));
    } catch (error) {
      console.warn(`Skipping artifact ${artifact.name} of run ${run.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  // Failed runs are looked at even without test results: their failure (e.g. a broken ACS deploy) is worth showing.
  const runJobs = metricSuitesByArtifact.size || FAILED_CONCLUSIONS.has(run.conclusion) ? await listRunJobs(github, run) : null;
  const conclusion = run.conclusion || (runJobs ? e2eJobsConclusion(runJobs) : null);
  return {
    artifactCount: artifacts.length,
    metrics,
    conclusion,
    suites: runJobs ? suiteJobs(runJobs, metricSuitesByArtifact) : {},
    failure: runJobs && FAILED_CONCLUSIONS.has(conclusion) ? failureCause(runJobs, metricSuitesByArtifact) : []
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
  if (!run.conclusion && conclusion) {
    // The workflow was still running (e.g. publishing this report); the result is that of its E2E jobs.
    summary.conclusionFrom = 'e2e-jobs';
  }
  if (failure.length) {
    summary.failure = failure;
  }
  return summary;
}

/** Completed runs of the source workflows created on `date` on `branch`, plus the optional in-progress run `includeRunId`. */
async function listRuns(github, { sourceWorkflows, date, branch, includeRunId }) {
  const runs = [];
  for (const workflow of sourceWorkflows) {
    try {
      const workflowRuns = await github.paginate(
        `/actions/workflows/${encodeURIComponent(workflow)}/runs?status=completed&branch=${encodeURIComponent(branch)}&created=${date}`,
        'workflow_runs'
      );
      runs.push(...workflowRuns.map((run) => ({ run, workflow })));
    } catch (error) {
      // GitHub only knows workflows that are on the default branch or have run at least once.
      if (error.status !== 404) {
        throw error;
      }
      console.warn(`Workflow ${workflow} not found (not on the default branch and never run), skipping.`);
    }
  }

  if (includeRunId && !runs.some(({ run }) => String(run.id) === includeRunId)) {
    const run = await github.getJson(`/actions/runs/${encodeURIComponent(includeRunId)}`);
    if (run.head_branch === branch) {
      runs.push({ run, workflow: path.basename(run.path || run.name) });
    } else {
      console.warn(`Run ${includeRunId} is on branch "${run.head_branch}", only "${branch}" runs are counted.`);
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
  // One entry per test and suite attempt of each run, for the per-run view of the dashboard.
  const results = [];
  try {
    for (const { run, workflow } of await listRuns(github, { sourceWorkflows, date, branch, includeRunId })) {
      const collected = await collectRun(github, run, workDir);
      const { artifactCount, metrics } = collected;
      console.log(`${workflow} run ${run.id} (${run.display_title}): ${artifactCount} metrics artifact(s), ${metrics.length} test run(s)`);
      // Runs without usable reports (e.g. only legacy-format artifacts) would show up as empty runs, so they are left
      // out, unless they failed: a run that broke before any test ran (build, ACS deploy) is listed with its cause.
      if (metrics.length > 0 || collected.failure.length > 0) {
        runs.push(toRunSummary(run, workflow, collected));
        perRunMetrics.push(metrics);
        results.push(...metrics.map(({ key, suiteAttempt, detail }) => ({ key, runId: run.id, suiteAttempt, ...detail })));
      }
    }
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }

  const tests = mergeTests(perRunMetrics).sort((a, b) => a.key.localeCompare(b.key));
  writeJson(outputFile, { schemaVersion: SCHEMA_VERSION, date, generatedAt: new Date().toISOString(), runs, tests, results });
  console.log(`Wrote ${outputFile}: ${runs.length} run(s), ${tests.length} test(s).`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { readArtifactMetrics, parseSuiteJobName };
