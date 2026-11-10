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

const { DAILY_ARTIFACT_PREFIX } = require('./daily-metrics');

const RUN_ARTIFACT_PREFIX = 'e2e-metrics-';
const WEEKLY_ARTIFACT_PREFIX = 'e2e-metrics-weekly-';
const E2E_METRICS_REPORTER_FORMAT = 'aca-e2e-metrics';
const E2E_METRICS_REPORTER_FORMAT_INTRODUCED_ON = '2026-10-28';
const MIN_FLAKY_RUNS_BEFORE_FIX = 5;
const MIN_CLEAN_RUNS_TO_COUNT_AS_FIXED = 3;
const MIN_AFFECTED_TESTS_FOR_INCIDENT = 4;
const MIN_AFFECTED_SHARE_FOR_INCIDENT = 0.5;
const ENVIRONMENT_ERROR_PATTERN = new RegExp(
  [
    String.raw`net::ERR_(?!ABORTED)[A-Z_]+`,
    String.raw`\b(?:ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|EPIPE)\b`,
    'socket hang up',
    'Bad Gateway|Service Unavailable|Gateway Time-?out',
    String.raw`status(?:Code)?\W{0,3}(?:5\d\d|40[13])\b`,
    String.raw`\b40[13] (?:Unauthorized|Forbidden)\b`,
    String.raw`not found after \d+ retries`,
    String.raw`but found \d+ after \d+ retries`,
    String.raw`not indexed for .+ after \d+ retries`,
    'not found in search results',
    'waitForNodes: Timed out waiting'
  ].join('|'),
  'i'
);
const ENVIRONMENT_METRIC_FIELDS = [
  ['runs', 'environmentRuns'],
  ['retries', 'environmentRetries'],
  ['flakyRuns', 'environmentFlakyRuns'],
  ['failures', 'environmentFailures']
];

function parseRunArtifactName(name) {
  const isAggregateArtifact = name.startsWith(DAILY_ARTIFACT_PREFIX) || name.startsWith(WEEKLY_ARTIFACT_PREFIX);
  if (!name.startsWith(RUN_ARTIFACT_PREFIX) || isAggregateArtifact) {
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
    setupSum: 0,
    environmentRuns: 0,
    environmentRetries: 0,
    environmentFlakyRuns: 0,
    environmentFailures: 0
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
  for (const [, environmentField] of ENVIRONMENT_METRIC_FIELDS) {
    target[environmentField] += source[environmentField] || 0;
  }
}

const durationIncludingBeforeAll = (attempt) => (attempt.duration || 0) + (attempt.beforeAll || 0);

const setupDuration = (attempt) => (attempt.beforeAll || 0) + (attempt.beforeEach || 0);

function testMetrics({ suite, file, title, path: filePath, line, outcome, results }) {
  const executedAttempts = results.filter((result) => result.status !== 'skipped');
  if (outcome === 'skipped' || executedAttempts.length === 0) {
    return null;
  }
  const passedAttempts = executedAttempts.filter(({ status }) => status === 'passed');
  const entry = emptyTestMetrics({ key: `${suite} › ${file} › ${title}`, suite, file, title, path: filePath, line });
  entry.runs = 1;
  entry.retries = executedAttempts.filter((attempt) => attempt.retry > 0).length;
  const passedAfterSerialGroupRetry = outcome === 'expected' && entry.retries > 0;
  entry.flakyRuns = outcome === 'flaky' || passedAfterSerialGroupRetry ? 1 : 0;
  entry.failures = outcome === 'unexpected' ? 1 : 0;
  for (const attempt of passedAttempts) {
    const duration = durationIncludingBeforeAll(attempt);
    entry.durationSum += duration;
    entry.durationCount += 1;
    entry.durationMax = Math.max(entry.durationMax, duration);
    entry.setupSum += setupDuration(attempt);
  }
  const firstPassedAttempt = passedAttempts[0];
  entry.detail = {
    outcome,
    retries: entry.retries,
    duration: firstPassedAttempt ? durationIncludingBeforeAll(firstPassedAttempt) : null,
    setup: firstPassedAttempt ? setupDuration(firstPassedAttempt) : null,
    attempts: executedAttempts.map((attempt) => ({
      status: attempt.status,
      duration: durationIncludingBeforeAll(attempt),
      ...(attempt.error ? { error: attempt.error } : {})
    }))
  };
  return entry;
}

const isE2eMetricsReport = (report) => report?.format === E2E_METRICS_REPORTER_FORMAT;

function extractTestMetrics(report, fallbackSuite) {
  if (!isE2eMetricsReport(report)) {
    throw new Error(`not an ${E2E_METRICS_REPORTER_FORMAT} report`);
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

const neededRetryOrFailed = (metric) => metric.retries > 0 || metric.failures > 0;
const suiteAttemptKey = (metric) => `${metric.suite}#${metric.suiteAttempt || 1}`;

function findSuiteIncidents(metrics) {
  const testsBySuiteAttempt = new Map();
  for (const metric of metrics) {
    const key = suiteAttemptKey(metric);
    testsBySuiteAttempt.set(key, [...(testsBySuiteAttempt.get(key) || []), metric]);
  }
  const incidents = [];
  for (const suiteMetrics of testsBySuiteAttempt.values()) {
    const affected = suiteMetrics.filter(neededRetryOrFailed).length;
    const isIncident = affected >= MIN_AFFECTED_TESTS_FOR_INCIDENT && affected / suiteMetrics.length >= MIN_AFFECTED_SHARE_FOR_INCIDENT;
    if (isIncident) {
      incidents.push({ suite: suiteMetrics[0].suite, suiteAttempt: suiteMetrics[0].suiteAttempt || 1, affected, tests: suiteMetrics.length });
    }
  }
  return incidents;
}

const isEnvironmentError = (error) => Boolean(error) && ENVIRONMENT_ERROR_PATTERN.test(error);

function failedOnlyWithEnvironmentErrors(detail) {
  const failedAttempts = (detail?.attempts || []).filter((attempt) => attempt.status !== 'passed');
  return failedAttempts.length > 0 && failedAttempts.every((attempt) => isEnvironmentError(attempt.error));
}

function environmentReason(metric, incidentSuiteAttempts) {
  if (incidentSuiteAttempts.has(suiteAttemptKey(metric))) {
    return 'incident';
  }
  return failedOnlyWithEnvironmentErrors(metric.detail) ? 'error' : null;
}

function markEnvironmentProblems(metrics) {
  const incidents = findSuiteIncidents(metrics);
  const incidentSuiteAttempts = new Set(incidents.map(suiteAttemptKey));
  const markedMetrics = metrics.map((metric) => {
    const environment = environmentReason(metric, incidentSuiteAttempts);
    if (!environment) {
      return metric;
    }
    const environmentCounts = Object.fromEntries(ENVIRONMENT_METRIC_FIELDS.map(([field, environmentField]) => [environmentField, metric[field]]));
    return { ...metric, ...environmentCounts, detail: { ...metric.detail, environment } };
  });
  return { metrics: markedMetrics, incidents };
}

function withoutEnvironmentProblems(test) {
  const counted = { ...test };
  for (const [field, environmentField] of ENVIRONMENT_METRIC_FIELDS) {
    counted[field] = test[field] - (test[environmentField] || 0);
  }
  return counted;
}

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

const isFlaky = (test) => test.retries > 0 || test.failures > 0;
const flakyRunCount = (test) => test.flakyRuns + test.failures;

function compareFlaky(tests, previousTests) {
  const hasPreviousPeriodData = previousTests.length > 0;
  if (!hasPreviousPeriodData) {
    return null;
  }
  const previousByKey = new Map(previousTests.map((test) => [test.key, test]));
  const currentByKey = new Map(tests.map((test) => [test.key, test]));
  const wasFlakyInPreviousPeriod = (test) => previousByKey.has(test.key) && isFlaky(previousByKey.get(test.key));
  const wasFlakyEnoughToCountAsFixed = (test) => flakyRunCount(test) >= MIN_FLAKY_RUNS_BEFORE_FIX;
  const ranOnlyCleanEnoughInCurrentPeriod = (test) => {
    const current = currentByKey.get(test.key);
    return current?.runs >= MIN_CLEAN_RUNS_TO_COUNT_AS_FIXED && !isFlaky(current);
  };
  return {
    recentlyFlaky: tests.filter((test) => isFlaky(test) && !wasFlakyInPreviousPeriod(test)),
    fixed: previousTests.filter((test) => wasFlakyEnoughToCountAsFixed(test) && ranOnlyCleanEnoughInCurrentPeriod(test))
  };
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
  const wholeSeconds = Math.round(ms / 1000);
  return `${Math.floor(wholeSeconds / 60)}m ${String(wholeSeconds % 60).padStart(2, '0')}s`;
}

module.exports = {
  parseRunArtifactName,
  isE2eMetricsReport,
  E2E_METRICS_REPORTER_FORMAT_INTRODUCED_ON,
  extractTestMetrics,
  ENVIRONMENT_ERROR_PATTERN,
  markEnvironmentProblems,
  withoutEnvironmentProblems,
  mergeTests,
  compareFlaky,
  MIN_FLAKY_RUNS_BEFORE_FIX,
  MIN_CLEAN_RUNS_TO_COUNT_AS_FIXED,
  averageDuration,
  averageSetup,
  formatDuration
};
