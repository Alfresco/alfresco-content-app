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
const { runUrl, dashboardUrl } = require('./github-api');
const { assertDate, shiftDate, yesterdayUtc, datesEndingOn } = require('./dates');
const { SCHEMA_VERSION, loadDailies, writeJson } = require('./daily-metrics');
const {
  mergeTests,
  compareFlaky,
  MIN_FLAKY_RUNS_BEFORE_FIX,
  MIN_CLEAN_RUNS_TO_COUNT_AS_FIXED,
  withoutEnvironmentProblems,
  averageDuration,
  averageSetup,
  formatDuration
} = require('./test-metrics');
const { postToTeams } = require('./post-teams');
const { createDataIssueLog } = require('./data-issues');

function periodTotals(tests) {
  const testRuns = tests.reduce((sum, test) => sum + test.runs, 0);
  const retriedTestRuns = tests.reduce((sum, test) => sum + test.flakyRuns + test.failures, 0);
  return {
    flakyTests: tests.filter((test) => test.retries > 0 || test.failures > 0).length,
    failedTestRuns: tests.reduce((sum, test) => sum + test.failures, 0),
    retriedShare: testRuns ? retriedTestRuns / testRuns : 0
  };
}

const countedTestsOfPeriod = (dailies) =>
  mergeTests(dailies.map((daily) => daily.tests))
    .map(withoutEnvironmentProblems)
    .filter((test) => test.runs > 0);

const withAverages = (test) => ({ ...test, durationAvg: Math.round(averageDuration(test)), setupAvg: Math.round(averageSetup(test)) });

function buildReport(dates, dailies, title, previousDailies = [], loadIssues = []) {
  const available = dailies.filter(Boolean);
  const dataIssues = [...available.flatMap((daily) => daily.issues || []), ...loadIssues];
  const runs = available.flatMap((daily) => daily.runs);
  const allTests = mergeTests(available.map((daily) => daily.tests));
  const tests = countedTestsOfPeriod(available).map(withAverages);
  const previousAvailable = previousDailies.filter(Boolean);
  const previousTests = countedTestsOfPeriod(previousAvailable);
  const comparison = compareFlaky(tests, previousTests);

  const flaky = tests
    .filter((test) => test.retries > 0 || test.failures > 0)
    .sort(
      (first, second) =>
        second.retries - first.retries || second.failures - first.failures || first.runs - second.runs || first.key.localeCompare(second.key)
    );
  const hasPassedAttempt = (test) => test.durationCount > 0;
  const slowest = allTests
    .map(withAverages)
    .filter(hasPassedAttempt)
    .sort((first, second) => second.durationAvg - first.durationAvg || first.key.localeCompare(second.key));

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
    ...(dataIssues.length ? { dataIssues } : {}),
    daysCollected: available.length,
    runs,
    runsByWorkflow,
    totals: {
      tests: tests.length,
      testRuns: tests.reduce((sum, test) => sum + test.runs, 0),
      retries: tests.reduce((sum, test) => sum + test.retries, 0),
      flakyTests: flaky.length,
      environmentTestRuns: allTests.reduce((sum, test) => sum + test.environmentRuns, 0)
    },
    flaky,
    slowest,
    weekOverWeek: previousTests.length ? { days: dates.length, current: periodTotals(tests), previous: periodTotals(previousTests) } : null,
    comparison: comparison && {
      days: dates.length,
      recentlyFlaky: comparison.recentlyFlaky.map(({ key, suite, title: testTitle }) => ({ key, suite, title: testTitle })),
      fixed: comparison.fixed.map(({ key, suite, title: testTitle }) => ({ key, suite, title: testTitle }))
    }
  };
}

const WORKFLOW_NAMES = { 'cron-e2e-chrome.yml': 'daily chrome', 'populate-e2e-reports.yml': 'populate' };
const CARD_TESTS_PER_SECTION = 3;
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

function formatPeriod(report) {
  return report.startDate === report.endDate
    ? formatDay(report.endDate, true)
    : `${formatDay(report.startDate)} – ${formatDay(report.endDate, true)}`;
}

function describeRuns(report) {
  const parts = Object.entries(report.runsByWorkflow).map(([workflow, runs]) => `${runs} ${WORKFLOW_NAMES[workflow] || workflow}`);
  const runsBreakdown = parts.length ? ` (${parts.join(', ')})` : '';
  return `${count(report.runs.length, 'workflow run')}${runsBreakdown}`;
}

function describeTotals(report) {
  const { tests, testRuns, retries, flakyTests } = report.totals;
  const failures = report.flaky.reduce((sum, test) => sum + test.failures, 0);
  const retriedText = flakyTests
    ? `${numberFormat.format(flakyTests)} of ${count(tests, 'test')} needed a retry, with ${count(retries, 'retry', 'retries')} in ${count(testRuns, 'test run')}.`
    : `None of the ${count(tests, 'test')} needed a retry in ${count(testRuns, 'test run')}.`;
  return failures ? `${retriedText} ${count(failures, 'test run')} failed after all retries.` : retriedText;
}

function describeLeftOutTestRuns(report) {
  const { environmentTestRuns } = report.totals;
  return environmentTestRuns
    ? `${count(environmentTestRuns, 'test run')} affected by environment problems ${environmentTestRuns === 1 ? 'is' : 'are'} left out of these numbers.`
    : null;
}

function describeEnvironmentProblems(report) {
  const runsWithFailedChecks = report.runs.filter((run) => run.environment?.length).length;
  const incidents = report.runs.reduce((sum, run) => sum + (run.incidents?.length || 0), 0);
  if (!runsWithFailedChecks && !incidents) {
    return null;
  }
  return `Environment problems: ${count(runsWithFailedChecks, 'run')} with failed environment checks, ${count(incidents, 'suite incident')} (at least 4 and at least half of a suite's tests needed a retry or failed in one suite attempt).`;
}

const PERCENT_POINTS = 100;

function describeChange(difference, format = (value) => numberFormat.format(value)) {
  if (difference > 0) {
    return `↑${format(difference)}`;
  }
  return difference < 0 ? `↓${format(-difference)}` : 'no change';
}

function describeWeekOverWeek(report) {
  const { weekOverWeek } = report;
  if (!weekOverWeek) {
    return null;
  }
  const { current, previous, days } = weekOverWeek;
  const formatPoints = (share) => (share * PERCENT_POINTS).toFixed(1);
  const parts = [
    `${count(current.flakyTests, 'flaky test')} (${describeChange(current.flakyTests - previous.flakyTests)})`,
    `${count(current.failedTestRuns, 'failed test run')} (${describeChange(current.failedTestRuns - previous.failedTestRuns)})`,
    `${formatPoints(current.retriedShare)}% of test runs needed a retry (${describeChange(
      Number(formatPoints(current.retriedShare)) - Number(formatPoints(previous.retriedShare)),
      (value) => `${value.toFixed(1)} pts`
    )})`
  ];
  return `Change since the previous ${count(days, 'day')}: ${parts.join(', ')}.`;
}

function describeComparison(report) {
  const { comparison } = report;
  if (!comparison) {
    return null;
  }
  return `Compared with the previous ${count(comparison.days, 'day')}: ${count(comparison.recentlyFlaky.length, 'recently flaky test')}, ${numberFormat.format(comparison.fixed.length)} fixed.`;
}

function titleWithoutDescribeBlocks(test) {
  return test.title.split(' › ').pop();
}

function topTestsSection(heading, tests, metric) {
  return [
    { type: 'TextBlock', text: heading, weight: 'Bolder', spacing: 'Medium', wrap: true },
    {
      type: 'FactSet',
      spacing: 'Small',
      facts: tests.slice(0, CARD_TESTS_PER_SECTION).map((test) => ({ title: metric(test), value: titleWithoutDescribeBlocks(test) }))
    }
  ];
}

function describeDataIssues(report) {
  const issuesInPeriod = (report.dataIssues || []).filter((issue) => !issue.date || (issue.date >= report.startDate && issue.date <= report.endDate));
  if (!issuesInPeriod.length) {
    return null;
  }
  const affectedDays = new Set(issuesInPeriod.map((issue) => issue.date).filter(Boolean)).size;
  const affectedDaysText = affectedDays ? ` on ${count(affectedDays, 'day')}` : '';
  return `⚠️ Data incomplete: ${count(issuesInPeriod.length, 'problem')}${affectedDaysText}. Details in the report.`;
}

function buildCard(report, { dashboardLink, runLink }) {
  const body = [
    { type: 'TextBlock', size: 'Large', weight: 'Bolder', text: report.title, wrap: true },
    { type: 'TextBlock', text: formatPeriod(report), isSubtle: true, spacing: 'None', wrap: true }
  ];
  const dataIssuesLine = describeDataIssues(report);
  if (dataIssuesLine) {
    body.push({ type: 'TextBlock', text: dataIssuesLine, wrap: true, color: 'Warning' });
  }

  const weekOverWeek = describeWeekOverWeek(report);
  if (weekOverWeek) {
    body.push({ type: 'TextBlock', text: `📊 ${weekOverWeek}`, spacing: 'Small', wrap: true });
  }
  const leftOut = describeLeftOutTestRuns(report);
  if (leftOut) {
    body.push({ type: 'TextBlock', text: leftOut, isSubtle: true, spacing: 'Small', wrap: true });
  }

  if (report.totals.tests === 0 && report.slowest.length === 0) {
    const noResults = leftOut ? 'No other E2E results were collected for this period.' : 'No E2E results were collected for this period.';
    body.push({ type: 'TextBlock', text: noResults, wrap: true, color: 'Warning' });
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
    version: '1.5',
    msteams: { width: 'Full' },
    body,
    actions
  };
}

function escapeMarkdown(text) {
  return String(text)
    .replaceAll('\\', String.raw`\\`)
    .replaceAll('|', String.raw`\|`)
    .replace(/\r?\n/g, ' ');
}

function markdownIssueLine(issue) {
  const dayPrefix = issue.date ? `${formatDay(issue.date)}: ` : '';
  const message = escapeMarkdown(issue.message).replaceAll('`', "'");
  return `- ${dayPrefix}${escapeMarkdown(issue.effect)}. \`${message}\``;
}

function buildMarkdown(report, dashboardLink) {
  const lines = [`# ${report.title}, ${formatPeriod(report)}`, '', `${describeTotals(report)} Data from ${describeRuns(report)}.`];
  const weekOverWeek = describeWeekOverWeek(report);
  if (weekOverWeek) {
    lines.push('', weekOverWeek);
  }
  const leftOut = describeLeftOutTestRuns(report);
  if (leftOut) {
    lines.push('', leftOut);
  }
  const environmentProblems = describeEnvironmentProblems(report);
  if (environmentProblems) {
    lines.push('', environmentProblems);
  }
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

  if (report.dataIssues) {
    lines.push(
      '',
      `## ⚠️ Data problems (${report.dataIssues.length})`,
      '',
      'Some data could not be collected or loaded, so the numbers below may be incomplete.',
      '',
      ...report.dataIssues.map(markdownIssueLine)
    );
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
    const testList = (tests) => (tests.length ? tests.map((test) => `- ${escapeMarkdown(test.title)} (${escapeMarkdown(test.suite)})`) : ['None.']);
    lines.push(
      '',
      `## 📈 Recently flaky tests (${report.comparison.recentlyFlaky.length})`,
      '',
      ...testList(report.comparison.recentlyFlaky),
      '',
      `## ✅ Fixed (${report.comparison.fixed.length})`,
      '',
      `At least ${MIN_FLAKY_RUNS_BEFORE_FIX} flaky runs in the previous period, then at least ${MIN_CLEAN_RUNS_TO_COUNT_AS_FIXED} runs in this one, all without a retry.`,
      '',
      ...testList(report.comparison.fixed)
    );
  }

  lines.push(
    '',
    `## 🐢 Slowest tests (${report.slowest.length})`,
    '',
    'Average of passed attempts. Setup is the time spent in beforeAll and beforeEach hooks and is included in the average.',
    '',
    '| # | Test | Suite | File | Average | Setup | Longest | Runs |',
    '|--:|---|---|---|--:|--:|--:|--:|',
    ...report.slowest.map(
      (test, index) =>
        `| ${index + 1} | ${escapeMarkdown(test.title)} | ${escapeMarkdown(test.suite)} | ${escapeMarkdown(test.file)} | ${formatDuration(test.durationAvg)} | ${formatDuration(test.setupAvg)} | ${formatDuration(test.durationMax)} | ${test.runs} |`
    )
  );

  return `${lines.join('\n')}\n`;
}

async function main() {
  const endDate = assertDate(process.env.REPORT_END_DATE || yesterdayUtc(), 'REPORT_END_DATE');
  const days = Number(process.env.REPORT_DAYS) || 7;
  const title = process.env.REPORT_TITLE || (days === 7 ? 'ACA E2E weekly report' : `ACA E2E report - last ${days} days`);
  const outputDir = process.env.OUTPUT_DIR || 'e2e-metrics-weekly';
  const dates = datesEndingOn(endDate, days);
  const previousPeriodDates = datesEndingOn(shiftDate(endDate, -days), days);
  const dashboardLink = process.env.DASHBOARD_PUBLISHED === 'true' && dashboardUrl() ? `${dashboardUrl()}#days=${days}&end=${endDate}` : null;

  const loadIssueLog = createDataIssueLog('load');
  const allDailies = await loadDailies([...previousPeriodDates, ...dates], loadIssueLog);
  const previousPeriodDailies = allDailies.slice(0, days);
  const currentPeriodDailies = allDailies.slice(days);
  const loadIssues = loadIssueLog.issues.map((issue) =>
    previousPeriodDates.includes(issue.date)
      ? { ...issue, effect: `${issue.effect} (previous period, used for recently flaky and fixed tests)` }
      : issue
  );
  const report = buildReport(dates, currentPeriodDailies, title, previousPeriodDailies, loadIssues);
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

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
