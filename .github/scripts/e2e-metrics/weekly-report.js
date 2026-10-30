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
 * Builds the E2E report (weekly by default) from the daily metrics files produced by `collect-daily.js`:
 *  - flaky tests: retries per number of runs (sorted by retries),
 *  - slowest tests: average duration of passed attempts including the beforeAll/beforeEach hooks of the test
 *    (sorted from longest to shortest),
 *  - recently flaky / fixed tests compared with the previous period of the same length (see lib.compareFlaky).
 * Writes the full report as JSON and Markdown (also to the job summary) and a short Teams card (period, top 3 flaky
 * and slowest tests, an "Open report" button), which is posted when TEAMS_WEBHOOK_URL is set.
 *
 * Env:
 *  - REPORT_END_DATE: last UTC day included in the report (YYYY-MM-DD), defaults to yesterday
 *  - REPORT_DAYS: number of days in the report window (default 7)
 *  - REPORT_TITLE: card/summary title (defaults to "ACA E2E weekly report" or "ACA E2E report - last <n> days")
 *  - DAILY_DIR, REMOTE_DATA, GITHUB_TOKEN, GITHUB_REPOSITORY: where the daily metrics come from (see lib.loadDailies)
 *  - DASHBOARD_PUBLISHED: `true` when the dashboard was deployed with this data; "Open report" then opens the dashboard
 *    (DASHBOARD_URL, see lib.dashboardUrl), otherwise the workflow run with the report in its summary
 *  - OUTPUT_DIR: where to write the report files (default `e2e-metrics-weekly`)
 *  - TEAMS_WEBHOOK_URL: Teams webhook; posting is skipped when not set (see also post-teams.js)
 */

const fs = require('fs');
const path = require('path');
const {
  SCHEMA_VERSION,
  assertDate,
  shiftDate,
  yesterdayUtc,
  mergeTests,
  compareFlaky,
  FIXED_MIN_RUNS,
  averageDuration,
  averageSetup,
  formatDuration,
  runUrl,
  dashboardUrl,
  loadDailies,
  dateRange,
  postToTeams,
  writeJson
} = require('./lib');

function buildReport(dates, dailies, title, previousDailies = []) {
  const available = dailies.filter(Boolean);
  const runs = available.flatMap((daily) => daily.runs);
  const tests = mergeTests(available.map((daily) => daily.tests)).map((test) => ({
    ...test,
    durationAvg: Math.round(averageDuration(test)),
    setupAvg: Math.round(averageSetup(test))
  }));
  const previousAvailable = previousDailies.filter(Boolean);
  const comparison = compareFlaky(tests, mergeTests(previousAvailable.map((daily) => daily.tests)));

  const flaky = tests
    .filter((test) => test.retries > 0 || test.failures > 0)
    .sort((a, b) => b.retries - a.retries || b.failures - a.failures || a.runs - b.runs || a.key.localeCompare(b.key));
  // Tests that never passed have no duration and are only listed as flaky.
  const slowest = tests.filter((test) => test.durationCount > 0).sort((a, b) => b.durationAvg - a.durationAvg || a.key.localeCompare(b.key));

  const runsByWorkflow = {};
  for (const run of runs) {
    runsByWorkflow[run.workflow] = (runsByWorkflow[run.workflow] || 0) + 1;
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    title,
    startDate: dates[0],
    endDate: dates[dates.length - 1],
    generatedAt: new Date().toISOString(),
    missingDays: dates.filter((_, index) => !dailies[index]),
    daysCollected: available.length,
    runs,
    runsByWorkflow,
    totals: {
      tests: tests.length,
      testRuns: tests.reduce((sum, test) => sum + test.runs, 0),
      retries: tests.reduce((sum, test) => sum + test.retries, 0),
      flakyTests: flaky.length
    },
    flaky,
    slowest,
    // Recently flaky / fixed tests compared with the previous period of the same length; null without data for it.
    comparison: comparison && {
      days: dates.length,
      recentlyFlaky: comparison.recentlyFlaky.map(({ key, suite, title: testTitle }) => ({ key, suite, title: testTitle })),
      fixed: comparison.fixed.map(({ key, suite, title: testTitle }) => ({ key, suite, title: testTitle }))
    }
  };
}

const WORKFLOW_NAMES = { 'cron-e2e-chrome.yml': 'daily chrome', 'populate-e2e-reports.yml': 'populate' };
// Tests listed per section in the Teams card; the full lists are in the report.
const CARD_TOP_TESTS = 3;
const numberFormat = new Intl.NumberFormat('en-GB');

function count(value, singular, pluralForm = `${singular}s`) {
  return `${numberFormat.format(value)} ${value === 1 ? singular : pluralForm}`;
}

function formatDay(date, withYear = false) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {}),
    timeZone: 'UTC'
  });
}

/** e.g. "14 Oct – 20 Oct 2026" */
function formatPeriod(report) {
  return report.startDate === report.endDate
    ? formatDay(report.endDate, true)
    : `${formatDay(report.startDate)} – ${formatDay(report.endDate, true)}`;
}

function describeRuns(report) {
  const parts = Object.entries(report.runsByWorkflow).map(([workflow, runs]) => `${runs} ${WORKFLOW_NAMES[workflow] || workflow}`);
  return `${count(report.runs.length, 'workflow run')}${parts.length ? ` (${parts.join(', ')})` : ''}`;
}

/** One or two plain sentences with the headline numbers. */
function describeTotals(report) {
  const { tests, testRuns, retries, flakyTests } = report.totals;
  const failures = report.flaky.reduce((sum, test) => sum + test.failures, 0);
  const retriedText = flakyTests
    ? `${numberFormat.format(flakyTests)} of ${count(tests, 'test')} needed a retry, with ${count(retries, 'retry', 'retries')} in ${count(testRuns, 'test run')}.`
    : `None of the ${count(tests, 'test')} needed a retry in ${count(testRuns, 'test run')}.`;
  return failures ? `${retriedText} ${count(failures, 'test run')} failed after all retries.` : retriedText;
}

/** e.g. "Compared with the previous 7 days: 2 recently flaky tests, 1 fixed." or null without data to compare. */
function describeComparison(report) {
  const { comparison } = report;
  if (!comparison) {
    return null;
  }
  return `Compared with the previous ${count(comparison.days, 'day')}: ${count(comparison.recentlyFlaky.length, 'recently flaky test')}, ${numberFormat.format(comparison.fixed.length)} fixed.`;
}

/** The test's own title, without its describe blocks. */
function testName(test) {
  return test.title.split(' › ').pop();
}

/** A heading and up to CARD_TOP_TESTS tests, each as "metric  test name". */
function topTestsSection(heading, tests, metric) {
  return [
    { type: 'TextBlock', text: heading, weight: 'Bolder', spacing: 'Medium', wrap: true },
    {
      type: 'FactSet',
      spacing: 'Small',
      facts: tests.slice(0, CARD_TOP_TESTS).map((test) => ({ title: metric(test), value: testName(test) }))
    }
  ];
}

/**
 * Short Teams card: period, the top flaky and slowest tests and one button to the full report. The button opens the
 * dashboard when it was published with this data, otherwise the workflow run (its summary has the full report).
 */
function buildCard(report, { dashboardLink, runLink }) {
  const body = [
    { type: 'TextBlock', size: 'Large', weight: 'Bolder', text: report.title, wrap: true },
    { type: 'TextBlock', text: formatPeriod(report), isSubtle: true, spacing: 'None', wrap: true }
  ];

  if (report.totals.tests === 0) {
    body.push({ type: 'TextBlock', text: 'No E2E results were collected for this period.', wrap: true, color: 'Warning' });
  } else {
    if (report.flaky.length) {
      body.push(
        ...topTestsSection('🔁 Most flaky', report.flaky, (test) => `${count(test.retries, 'retry', 'retries')} in ${count(test.runs, 'run')}`)
      );
    }
    if (report.slowest.length) {
      body.push(...topTestsSection('🐢 Slowest', report.slowest, (test) => formatDuration(test.durationAvg)));
    }
  }

  const reportLink = dashboardLink || runLink;
  const actions = reportLink ? [{ type: 'Action.OpenUrl', title: 'Open report', url: reportLink }] : [];

  return {
    type: 'AdaptiveCard',
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.5',
    msteams: { width: 'Full' },
    body,
    actions
  };
}

function escapeMarkdown(text) {
  return String(text).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function buildMarkdown(report, dashboardLink) {
  const lines = [`# ${report.title}, ${formatPeriod(report)}`, '', `${describeTotals(report)} Data from ${describeRuns(report)}.`];
  const comparison = describeComparison(report);
  if (comparison) {
    lines.push('', comparison);
  }
  if (report.missingDays.length) {
    lines.push('', `Data is missing for ${report.missingDays.map((date) => formatDay(date)).join(', ')}.`);
  }
  if (dashboardLink) {
    lines.push('', `[Open the E2E dashboard](${dashboardLink}) to filter, sort and see the numbers by day.`);
  }

  lines.push('', `## 🔁 Flaky tests (${report.flaky.length})`, '');
  if (report.flaky.length) {
    lines.push('| # | Test | Suite | File | Retries | Runs | Flaky runs | Failed runs |', '|--:|---|---|---|--:|--:|--:|--:|');
    report.flaky.forEach((test, index) => {
      lines.push(
        `| ${index + 1} | ${escapeMarkdown(test.title)} | ${escapeMarkdown(test.suite)} | ${escapeMarkdown(test.file)} | ${test.retries} | ${test.runs} | ${test.flakyRuns} | ${test.failures} |`
      );
    });
  } else {
    lines.push('No test needed a retry.');
  }

  if (report.comparison) {
    const testList = (tests) => tests.map((test) => `- ${escapeMarkdown(test.title)} (${escapeMarkdown(test.suite)})`);
    lines.push('', `## 📈 Recently flaky tests (${report.comparison.recentlyFlaky.length})`, '');
    lines.push(...(report.comparison.recentlyFlaky.length ? testList(report.comparison.recentlyFlaky) : ['None.']));
    lines.push(
      '',
      `## ✅ Fixed (${report.comparison.fixed.length})`,
      '',
      `Flaky in the previous period, no retry in at least ${FIXED_MIN_RUNS} runs in this one.`,
      ''
    );
    lines.push(...(report.comparison.fixed.length ? testList(report.comparison.fixed) : ['None.']));
  }

  lines.push(
    '',
    `## 🐢 Slowest tests (${report.slowest.length})`,
    '',
    'Average of passed attempts. Setup is the time spent in beforeAll and beforeEach hooks and is included in the average.',
    ''
  );
  lines.push('| # | Test | Suite | File | Average | Setup | Longest | Runs |', '|--:|---|---|---|--:|--:|--:|--:|');
  report.slowest.forEach((test, index) => {
    lines.push(
      `| ${index + 1} | ${escapeMarkdown(test.title)} | ${escapeMarkdown(test.suite)} | ${escapeMarkdown(test.file)} | ${formatDuration(test.durationAvg)} | ${formatDuration(test.setupAvg)} | ${formatDuration(test.durationMax)} | ${test.runs} |`
    );
  });

  return `${lines.join('\n')}\n`;
}

async function main() {
  const endDate = assertDate(process.env.REPORT_END_DATE || yesterdayUtc(), 'REPORT_END_DATE');
  const days = Number(process.env.REPORT_DAYS) || 7;
  const title = process.env.REPORT_TITLE || (days === 7 ? 'ACA E2E weekly report' : `ACA E2E report - last ${days} days`);
  const outputDir = process.env.OUTPUT_DIR || 'e2e-metrics-weekly';
  const dates = dateRange(endDate, days);
  // The period before, for recently flaky / fixed tests.
  const previousDates = dateRange(shiftDate(endDate, -days), days);
  const dashboardLink = process.env.DASHBOARD_PUBLISHED === 'true' && dashboardUrl() ? `${dashboardUrl()}#days=${days}&end=${endDate}` : null;

  const allDailies = await loadDailies([...previousDates, ...dates]);
  const report = buildReport(dates, allDailies.slice(days), title, allDailies.slice(0, days));
  const markdown = buildMarkdown(report, dashboardLink);
  const card = buildCard(report, { dashboardLink, runLink: runUrl() });

  writeJson(path.join(outputDir, 'report.json'), report);
  writeJson(path.join(outputDir, 'teams-card.json'), card);
  fs.writeFileSync(path.join(outputDir, 'report.md'), markdown);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
  }
  console.log(`${report.title} ${report.startDate} to ${report.endDate}: ${report.totals.tests} test(s), ${report.flaky.length} with retries.`);

  await postToTeams(card);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { buildReport, buildCard, buildMarkdown };
