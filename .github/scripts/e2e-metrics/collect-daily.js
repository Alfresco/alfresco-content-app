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
 * Collects the `e2e-metrics-<browser>-<suite>` artifacts (Playwright JSON reports) uploaded by the
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

/** Read every suite-attempt JSON report found in an extracted artifact directory. */
function readArtifactMetrics(artifactDir, suite) {
  const metrics = [];
  for (const file of fs
    .readdirSync(artifactDir)
    .filter((name) => name.endsWith('.json'))
    .sort()) {
    try {
      const report = JSON.parse(fs.readFileSync(path.join(artifactDir, file), 'utf8'));
      metrics.push(...extractTestMetrics(report, suite));
    } catch (error) {
      console.warn(`Skipping unreadable report ${artifactDir}/${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return metrics;
}

async function collectRun(github, run, workDir) {
  const artifacts = (await github.paginate(`/actions/runs/${run.id}/artifacts`, 'artifacts')).filter(
    (artifact) => !artifact.expired && parseRunArtifactName(artifact.name)
  );
  const metrics = [];
  for (const artifact of artifacts) {
    const { suite } = parseRunArtifactName(artifact.name);
    const artifactDir = path.join(workDir, String(run.id), artifact.name);
    try {
      await github.downloadArtifact(artifact.id, artifactDir);
      metrics.push(...readArtifactMetrics(artifactDir, suite));
    } catch (error) {
      console.warn(`Skipping artifact ${artifact.name} of run ${run.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return { artifactCount: artifacts.length, metrics };
}

function toRunSummary(run, workflow, artifactCount) {
  return {
    id: run.id,
    workflow,
    title: run.display_title,
    branch: run.head_branch,
    event: run.event,
    conclusion: run.conclusion,
    createdAt: run.created_at,
    url: run.html_url,
    artifacts: artifactCount
  };
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
  try {
    for (const { run, workflow } of await listRuns(github, { sourceWorkflows, date, branch, includeRunId })) {
      const { artifactCount, metrics } = await collectRun(github, run, workDir);
      console.log(`${workflow} run ${run.id} (${run.display_title}): ${artifactCount} metrics artifact(s), ${metrics.length} test run(s)`);
      if (artifactCount > 0) {
        runs.push(toRunSummary(run, workflow, artifactCount));
        perRunMetrics.push(metrics);
      }
    }
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }

  const tests = mergeTests(perRunMetrics).sort((a, b) => a.key.localeCompare(b.key));
  writeJson(outputFile, { schemaVersion: SCHEMA_VERSION, date, generatedAt: new Date().toISOString(), runs, tests });
  console.log(`Wrote ${outputFile}: ${runs.length} run(s), ${tests.length} test(s).`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { readArtifactMetrics };
