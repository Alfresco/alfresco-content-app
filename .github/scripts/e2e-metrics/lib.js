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
 * Shared helpers for the E2E metrics pipeline:
 *  - GitHub REST API access (listing runs/artifacts, downloading artifact zips),
 *  - extracting per-test retry/duration metrics from the e2e-metrics reporter output,
 *  - merging those metrics across runs and days,
 *  - loading daily metrics files (local or from `e2e-metrics-daily-<date>` artifacts).
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SCHEMA_VERSION = 1;
const RUN_ARTIFACT_PREFIX = 'e2e-metrics-';
const DAILY_ARTIFACT_PREFIX = 'e2e-metrics-daily-';
const WEEKLY_ARTIFACT_PREFIX = 'e2e-metrics-weekly-';
// Written by projects/aca-playwright-shared/src/base-config/e2e-metrics.reporter.ts
const METRICS_REPORT_FORMAT = 'aca-e2e-metrics';
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 24 * 60 * 60 * 1000;
const PAGE_SIZE = 100;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required.`);
  }
  return value;
}

function assertDate(value, name) {
  if (!DATE_PATTERN.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw new Error(`${name} must be a date in YYYY-MM-DD format, got "${value}".`);
  }
  return value;
}

function shiftDate(date, days) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}

function yesterdayUtc() {
  return shiftDate(new Date().toISOString().slice(0, 10), -1);
}

function createGithubClient({ token, repository, apiUrl = 'https://api.github.com' }) {
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28'
  };

  async function request(urlPath) {
    const url = `${apiUrl}/repos/${repository}${urlPath}`;
    const response = await fetch(url, { headers });
    if (!response.ok) {
      const error = new Error(`GitHub API ${url} returned ${response.status}: ${await response.text()}`);
      error.status = response.status;
      throw error;
    }
    return response;
  }

  /** Fetch every page of a list endpoint; `itemsKey` is the array property in the response body. */
  async function paginate(urlPath, itemsKey) {
    const items = [];
    const separator = urlPath.includes('?') ? '&' : '?';
    for (let page = 1; ; page++) {
      const body = await (await request(`${urlPath}${separator}per_page=${PAGE_SIZE}&page=${page}`)).json();
      const pageItems = body[itemsKey] || [];
      items.push(...pageItems);
      if (pageItems.length < PAGE_SIZE) {
        return items;
      }
    }
  }

  /** Download an artifact zip and extract it into `targetDir`. */
  async function downloadArtifact(artifactId, targetDir) {
    const response = await request(`/actions/artifacts/${artifactId}/zip`);
    const zipFile = path.join(os.tmpdir(), `artifact-${artifactId}-${process.pid}.zip`);
    try {
      fs.writeFileSync(zipFile, Buffer.from(await response.arrayBuffer()));
      fs.mkdirSync(targetDir, { recursive: true });
      execFileSync('unzip', ['-o', '-q', zipFile, '-d', targetDir], { stdio: 'inherit' });
    } finally {
      fs.rmSync(zipFile, { force: true });
    }
  }

  async function getJson(urlPath) {
    return (await request(urlPath)).json();
  }

  return { getJson, paginate, downloadArtifact };
}

/** Parse `e2e-metrics-<browser>-<suite>` per-run artifact names (daily/weekly aggregates are ignored). */
function parseRunArtifactName(name) {
  if (!name.startsWith(RUN_ARTIFACT_PREFIX) || name.startsWith(DAILY_ARTIFACT_PREFIX) || name.startsWith(WEEKLY_ARTIFACT_PREFIX)) {
    return null;
  }
  const match = /^([^-]+)-(.+)$/.exec(name.slice(RUN_ARTIFACT_PREFIX.length));
  return match ? { browser: match[1], suite: match[2] } : null;
}

function emptyTestMetrics({ key, suite, file, title, path: filePath = null, line = null }) {
  return {
    key,
    suite,
    file,
    title,
    path: filePath,
    line,
    runs: 0,
    retries: 0,
    flakyRuns: 0,
    failures: 0,
    durationSum: 0,
    durationCount: 0,
    durationMax: 0,
    setupSum: 0
  };
}

function addTestMetrics(target, source) {
  target.path = target.path || source.path || null;
  target.line = target.line || source.line || null;
  target.runs += source.runs;
  target.retries += source.retries;
  target.flakyRuns += source.flakyRuns;
  target.failures += source.failures;
  target.durationSum += source.durationSum;
  target.durationCount += source.durationCount;
  target.durationMax = Math.max(target.durationMax, source.durationMax);
  target.setupSum += source.setupSum || 0;
}

/**
 * Per-test metrics of one suite attempt. Each non-skipped test counts as one run and every result with
 * `retry > 0` as one retry. Durations are tracked for passed attempts only, so failures and timeouts do not skew
 * them, and include the beforeAll hooks the test depends on. `setupSum` is the beforeAll + beforeEach part of the
 * durations. `detail` describes this single run (outcome, retries, duration and every attempt) for the per-run view.
 */
function testMetrics({ suite, file, title, path: filePath, line, outcome, results }) {
  const executed = results.filter((result) => result.status !== 'skipped');
  if (outcome === 'skipped' || executed.length === 0) {
    return null;
  }
  const entry = emptyTestMetrics({ key: `${suite} › ${file} › ${title}`, suite, file, title, path: filePath, line });
  entry.runs = 1;
  entry.retries = executed.filter((result) => result.retry > 0).length;
  entry.flakyRuns = outcome === 'flaky' ? 1 : 0;
  entry.failures = outcome === 'unexpected' ? 1 : 0;
  const attemptDuration = (result) => (result.duration || 0) + (result.beforeAll || 0);
  const attemptSetup = (result) => (result.beforeAll || 0) + (result.beforeEach || 0);
  for (const result of executed.filter(({ status }) => status === 'passed')) {
    const duration = attemptDuration(result);
    entry.durationSum += duration;
    entry.durationCount += 1;
    entry.durationMax = Math.max(entry.durationMax, duration);
    entry.setupSum += attemptSetup(result);
  }
  const passed = executed.find(({ status }) => status === 'passed');
  entry.detail = {
    outcome,
    retries: entry.retries,
    duration: passed ? attemptDuration(passed) : null,
    setup: passed ? attemptSetup(passed) : null,
    attempts: executed.map((result) => ({ status: result.status, duration: attemptDuration(result) }))
  };
  return entry;
}

/**
 * Convert one suite attempt report written by the e2e-metrics reporter into per-test metrics. Other formats (e.g. a
 * plain Playwright JSON report) are rejected: they lack beforeAll hook timings and name test files differently, so
 * mixing them in would split every test into two entries, one of them without durations.
 */
function extractTestMetrics(report, fallbackSuite) {
  if (report.format !== METRICS_REPORT_FORMAT) {
    throw new Error(`not an ${METRICS_REPORT_FORMAT} report`);
  }
  const metrics = report.tests.map((test) =>
    testMetrics({
      suite: test.project || fallbackSuite,
      file: test.file,
      title: test.title,
      path: test.path || null,
      line: test.line || null,
      outcome: test.outcome,
      results: test.results || []
    })
  );
  return metrics.filter(Boolean);
}

/** Merge lists of test metrics by test key. */
function mergeTests(lists) {
  const byKey = new Map();
  for (const list of lists) {
    for (const test of list) {
      if (!byKey.has(test.key)) {
        byKey.set(test.key, emptyTestMetrics(test));
      }
      addTestMetrics(byKey.get(test.key), test);
    }
  }
  return [...byKey.values()];
}

function averageDuration(test) {
  return test.durationCount > 0 ? test.durationSum / test.durationCount : 0;
}

function averageSetup(test) {
  return test.durationCount > 0 ? (test.setupSum || 0) / test.durationCount : 0;
}

function formatDuration(ms) {
  const totalSeconds = Math.round(ms / 100) / 10;
  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(1)}s`;
  }
  // Round to whole seconds before splitting, so 119.6s becomes 2m 00s and not 1m 60s.
  const wholeSeconds = Math.round(ms / 1000);
  return `${Math.floor(wholeSeconds / 60)}m ${String(wholeSeconds % 60).padStart(2, '0')}s`;
}

function runUrl() {
  const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;
  return GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_RUN_ID ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}` : null;
}

/** GitHub Pages URL of the E2E dashboard: DASHBOARD_URL, or the default project site of the repository. */
function dashboardUrl() {
  if (process.env.DASHBOARD_URL) {
    return process.env.DASHBOARD_URL.replace(/\/?$/, '/');
  }
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
  return owner && repo ? `https://${owner.toLowerCase()}.github.io/${repo}/` : null;
}

function readDailyFile(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (data.schemaVersion !== SCHEMA_VERSION) {
    throw new Error(`Unsupported schemaVersion ${data.schemaVersion} in ${file}`);
  }
  return data;
}

async function downloadDaily(github, date, workDir) {
  const name = `${DAILY_ARTIFACT_PREFIX}${date}`;
  const artifacts = (await github.paginate(`/actions/artifacts?name=${encodeURIComponent(name)}`, 'artifacts'))
    .filter((artifact) => !artifact.expired)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  if (artifacts.length === 0) {
    return null;
  }
  const targetDir = path.join(workDir, name);
  await github.downloadArtifact(artifacts[0].id, targetDir);
  const file = fs.readdirSync(targetDir).find((entry) => entry.endsWith('.json'));
  return file ? readDailyFile(path.join(targetDir, file)) : null;
}

/**
 * Load the daily metrics of `dates` (null for days without data). Files `<date>.json` in DAILY_DIR take precedence;
 * other days are downloaded from `e2e-metrics-daily-<date>` artifacts unless REMOTE_DATA is `false` or GITHUB_TOKEN is not set.
 */
async function loadDailies(dates) {
  const dailyDir = process.env.DAILY_DIR;
  const remote = process.env.REMOTE_DATA !== 'false' && !!process.env.GITHUB_TOKEN;
  const github = remote
    ? createGithubClient({ token: process.env.GITHUB_TOKEN, repository: requireEnv('GITHUB_REPOSITORY'), apiUrl: process.env.GITHUB_API_URL })
    : null;
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-metrics-dailies-'));
  try {
    const dailies = [];
    for (const date of dates) {
      const localFile = dailyDir ? path.join(dailyDir, `${date}.json`) : null;
      if (localFile && fs.existsSync(localFile)) {
        dailies.push(readDailyFile(localFile));
      } else {
        dailies.push(github ? await downloadDaily(github, date, workDir) : null);
      }
    }
    return dailies;
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }
}

/** The `days` consecutive dates ending with `endDate`. */
function dateRange(endDate, days) {
  return Array.from({ length: days }, (_, index) => shiftDate(endDate, index - days + 1));
}

async function postToTeams(card) {
  const webhook = process.env.TEAMS_WEBHOOK_URL;
  if (!webhook) {
    console.warn('TEAMS_WEBHOOK_URL is not set, skipping Teams notification.');
    return;
  }

  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'message', attachments: [{ contentType: 'application/vnd.microsoft.card.adaptive', content: card }] })
  });
  if (!response.ok) {
    throw new Error(`Teams webhook returned ${response.status}: ${await response.text()}`);
  }
  console.log(`Posted E2E report to Teams (HTTP ${response.status}).`);
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

module.exports = {
  SCHEMA_VERSION,
  DAILY_ARTIFACT_PREFIX,
  WEEKLY_ARTIFACT_PREFIX,
  requireEnv,
  assertDate,
  shiftDate,
  yesterdayUtc,
  createGithubClient,
  parseRunArtifactName,
  extractTestMetrics,
  mergeTests,
  averageDuration,
  averageSetup,
  formatDuration,
  runUrl,
  dashboardUrl,
  loadDailies,
  dateRange,
  postToTeams,
  writeJson
};
