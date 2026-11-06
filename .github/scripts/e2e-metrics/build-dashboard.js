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
const path = require('node:path');
const { dashboardUrl } = require('./github-api');
const { assertDate, shiftDate, yesterdayUtc, datesEndingOn } = require('./dates');
const { SCHEMA_VERSION, loadDailies } = require('./daily-metrics');
const { createDataIssueLog, appendIssuesToStepSummary } = require('./data-issues');

const DASHBOARD_PAGE_DIR = path.join(__dirname, 'dashboard');
const LONGEST_REPORT_DAYS = 14;
const DEFAULT_HISTORY_DAYS = 2 * LONGEST_REPORT_DAYS;
const DEFAULT_DETAIL_DAYS = LONGEST_REPORT_DAYS;
const DAILY_ARTIFACT_RETENTION_DAYS = 28;
const DEFAULT_TEST_CASE_URL = 'https://hyland.atlassian.net/browse/{id}';
const COMPACT_TEST_METRIC_FIELDS = ['runs', 'retries', 'flakyRuns', 'failures', 'durationSum', 'durationCount', 'durationMax', 'setupSum'];
const COMPACT_SUITE_JOB_FIELDS = ['job', 'step', 'setup', 'tests', 'total'];
const COMPACT_FAILURE_CAUSE_FIELDS = ['kind', 'name', 'job', 'step', 'stepName'];
const DASHBOARD_OUTCOME_BY_PLAYWRIGHT_OUTCOME = { expected: 'passed', flaky: 'retried', unexpected: 'failed' };
const PLAYWRIGHT_OUTCOME_BY_DASHBOARD_OUTCOME = Object.fromEntries(
  Object.entries(DASHBOARD_OUTCOME_BY_PLAYWRIGHT_OUTCOME).map(([playwrightOutcome, dashboardOutcome]) => [dashboardOutcome, playwrightOutcome])
);

async function fetchPublishedHistory(siteUrl) {
  const url = `${siteUrl}data/history.json`;
  const response = await fetch(url, { cache: 'no-store' });
  if (response.status === 404) {
    console.log(`No published history at ${url}, starting a new one.`);
    return null;
  }
  if (!response.ok) {
    throw new Error(`Could not read the published history ${url}: HTTP ${response.status}. Not publishing, to keep the history.`);
  }
  const history = await response.json();
  if (history.schemaVersion !== SCHEMA_VERSION) {
    throw new Error(`Unsupported published history schemaVersion ${history.schemaVersion}`);
  }
  return history;
}

const testKey = ([suite, file, title]) => `${suite} › ${file} › ${title}`;
const toFields = (fields, object) => fields.map((field) => object[field] ?? null);
const fromFields = (fields, values) => Object.fromEntries(fields.map((field, position) => [field, values[position] ?? null]));
const mapValues = (object, transform) => Object.fromEntries(Object.entries(object || {}).map(([key, value]) => [key, transform(value)]));

function expandRun(run) {
  const { suites, failure, ...rest } = run;
  const expanded = { ...rest, suites: mapValues(suites, (values) => fromFields(COMPACT_SUITE_JOB_FIELDS, values)) };
  if (failure) {
    expanded.failure = failure.map((values) => fromFields(COMPACT_FAILURE_CAUSE_FIELDS, values));
  }
  return expanded;
}

function expandHistory(history) {
  const days = new Map();
  for (const day of history?.days || []) {
    const tests = day.tests.map(([index, ...values]) => {
      const [suite, file, title, filePath, line] = history.tests[index];
      const test = { key: testKey(history.tests[index]), suite, file, title, path: filePath, line };
      COMPACT_TEST_METRIC_FIELDS.forEach((field, position) => (test[field] = values[position] ?? 0));
      return test;
    });
    const runs = day.runs.map(expandRun);
    const results = (day.results || []).map(([index, runIndex, suiteAttempt, outcome, retries, duration, setup, attempts]) => ({
      key: testKey(history.tests[index]),
      runId: runs[runIndex]?.id,
      suiteAttempt,
      outcome: PLAYWRIGHT_OUTCOME_BY_DASHBOARD_OUTCOME[outcome],
      retries,
      duration,
      setup,
      attempts: (attempts || []).map(([status, attemptDuration, errorIndex]) => ({
        status,
        duration: attemptDuration,
        ...(errorIndex != null && day.errors?.[errorIndex] ? { error: day.errors[errorIndex] } : {})
      }))
    }));
    days.set(day.date, { date: day.date, runs, tests, results, ...(day.issues ? { issues: day.issues } : {}) });
  }
  return days;
}

function compactRun(run) {
  const compact = { id: run.id, workflow: run.workflow, title: run.title, conclusion: run.conclusion, createdAt: run.createdAt, url: run.url };
  if (run.suites && Object.keys(run.suites).length) {
    compact.suites = mapValues(run.suites, (suite) => toFields(COMPACT_SUITE_JOB_FIELDS, suite));
  }
  if (run.conclusionFrom) {
    compact.conclusionFrom = run.conclusionFrom;
  }
  if (run.failure?.length) {
    compact.failure = run.failure.map((entry) => toFields(COMPACT_FAILURE_CAUSE_FIELDS, entry));
  }
  return compact;
}

function compactResults(day, indexByKey, dedupedErrors) {
  const runIndex = new Map(day.runs.map((run, index) => [run.id, index]));
  const dedupedErrorIndex = new Map();
  const indexOfDedupedError = (error) => {
    if (!dedupedErrorIndex.has(error)) {
      dedupedErrorIndex.set(error, dedupedErrors.length);
      dedupedErrors.push(error);
    }
    return dedupedErrorIndex.get(error);
  };
  const compactAttempt = ({ status, duration, error }) => {
    const statusAndDuration = [status, duration ?? null];
    return error ? [...statusAndDuration, indexOfDedupedError(error)] : statusAndDuration;
  };
  return (day.results || [])
    .filter((result) => indexByKey.has(result.key) && runIndex.has(result.runId))
    .map((result) => {
      const row = [
        indexByKey.get(result.key),
        runIndex.get(result.runId),
        result.suiteAttempt || 1,
        DASHBOARD_OUTCOME_BY_PLAYWRIGHT_OUTCOME[result.outcome] || 'failed',
        result.retries,
        result.duration ?? null,
        result.setup ?? null
      ];
      const neededRetryOrFailed = result.outcome !== 'expected' || result.retries > 0;
      if (neededRetryOrFailed) {
        row.push(result.attempts.map(compactAttempt));
      }
      return row;
    });
}

function useLatestSourceLocation(catalogEntry, test) {
  catalogEntry[3] = test.path || catalogEntry[3];
  catalogEntry[4] = test.line || catalogEntry[4];
}

function compactHistory(days, meta, detailFrom) {
  const catalog = [];
  const indexByKey = new Map();
  const compactDays = [...days.values()]
    .sort((firstDay, secondDay) => firstDay.date.localeCompare(secondDay.date))
    .map((day) => {
      const tests = day.tests.map((test) => {
        if (!indexByKey.has(test.key)) {
          indexByKey.set(test.key, catalog.length);
          catalog.push([test.suite, test.file, test.title, test.path || null, test.line || null]);
        } else {
          useLatestSourceLocation(catalog[indexByKey.get(test.key)], test);
        }
        return [indexByKey.get(test.key), ...COMPACT_TEST_METRIC_FIELDS.map((field) => test[field])];
      });
      const compactDay = { date: day.date, runs: day.runs.map(compactRun), tests };
      if (day.date >= detailFrom && day.results?.length) {
        const dedupedErrors = [];
        compactDay.results = compactResults(day, indexByKey, dedupedErrors);
        if (dedupedErrors.length) {
          compactDay.errors = dedupedErrors;
        }
      }
      if (day.issues?.length) {
        compactDay.issues = day.issues;
      }
      return compactDay;
    });
  return { schemaVersion: SCHEMA_VERSION, ...meta, tests: catalog, days: compactDays };
}

function isIncompleteRefreshOfPublishedDay(refreshed, published) {
  const refreshHasProblems = Boolean(refreshed.issues?.length);
  const publishedKnowsAtLeastAsManyRuns = Boolean(published) && published.runs.length >= refreshed.runs.length;
  return refreshHasProblems && publishedKnowsAtLeastAsManyRuns;
}

async function main() {
  const endDate = assertDate(process.env.END_DATE || yesterdayUtc(), 'END_DATE');
  const historyDays = Number(process.env.HISTORY_DAYS) || DEFAULT_HISTORY_DAYS;
  const detailDays = Number(process.env.DETAIL_DAYS) || DEFAULT_DETAIL_DAYS;
  const siteDir = process.env.SITE_DIR || 'e2e-dashboard';
  const siteUrl = dashboardUrl();
  const remote = process.env.REMOTE_DATA !== 'false';

  const published = remote && siteUrl ? await fetchPublishedHistory(siteUrl) : null;
  const days = expandHistory(published);

  const refreshDates = datesEndingOn(endDate, DAILY_ARTIFACT_RETENTION_DAYS);
  const loadIssueLog = createDataIssueLog('load');
  const dailies = await loadDailies(refreshDates, loadIssueLog);
  dailies.forEach((daily, index) => {
    const date = refreshDates[index];
    if (!daily) {
      return;
    }
    if (isIncompleteRefreshOfPublishedDay(daily, days.get(date))) {
      loadIssueLog.add({
        operation: 'refresh-incomplete',
        date,
        effect: `The latest collection of this day had ${daily.issues.length} data problem(s) and found no more runs than before, so the previously published data is kept`,
        error: daily.issues[0].message
      });
      return;
    }
    days.set(date, daily);
  });
  const loadIssues = loadIssueLog.issues.map((issue) =>
    issue.operation === 'load-daily' && days.has(issue.date)
      ? { ...issue, effect: `${issue.effect}, the previously published data for that day is shown` }
      : issue
  );
  appendIssuesToStepSummary(loadIssues, 'E2E dashboard data problems');

  const oldestKept = shiftDate(endDate, 1 - historyDays);
  for (const date of days.keys()) {
    if (date < oldestKept) {
      days.delete(date);
    }
  }

  const history = compactHistory(
    days,
    {
      generatedAt: new Date().toISOString(),
      repository: process.env.GITHUB_REPOSITORY || null,
      serverUrl: process.env.GITHUB_SERVER_URL || 'https://github.com',
      branch: process.env.SOURCE_BRANCH || 'develop',
      testCaseUrl: process.env.TEST_CASE_URL || DEFAULT_TEST_CASE_URL,
      historyDays,
      detailDays,
      ...(loadIssues.length ? { loadIssues } : {})
    },
    shiftDate(endDate, 1 - detailDays)
  );

  fs.mkdirSync(siteDir, { recursive: true });
  fs.cpSync(DASHBOARD_PAGE_DIR, siteDir, { recursive: true });
  const json = JSON.stringify(history);
  fs.mkdirSync(path.join(siteDir, 'data'), { recursive: true });
  fs.writeFileSync(path.join(siteDir, 'data', 'history.json'), json);
  fs.writeFileSync(path.join(siteDir, 'data', 'history.js'), `window.E2E_HISTORY = ${json};\n`);
  console.log(
    `Built dashboard in ${siteDir}: ${history.days.length} day(s), ${history.tests.length} test(s), ${(json.length / 1024).toFixed(0)} KB.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
