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
const path = require('path');
const { runUrl, dashboardUrl } = require('./github-api');
const { assertDate, shiftDate, yesterdayUtc, datesEndingOn } = require('./dates');
const { SCHEMA_VERSION, loadDailies, writeJson } = require('./daily-metrics');
const {
  mergeTests,
  compareFlaky,
  MIN_FLAKY_RUNS_BEFORE_FIX,
  MIN_CLEAN_RUNS_TO_COUNT_AS_FIXED,
  averageDuration,
  averageSetup,
  formatDuration
} = require('./test-metrics');
const { postToTeams } = require('./post-teams');
const { createDataIssueLog } = require('./data-issues');

function buildReport(dates, dailies, title, previousDailies = [], loadIssues = []) {
  const available = dailies.filter(Boolean);
  const dataIssues = [...available.flatMap((daily) => daily.issues || []), ...loadIssues];
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
  const hasPassedAttempt = (test) => test.durationCount > 0;
  const slowest = tests.filter(hasPassedAttempt).sort((a, b) => b.durationAvg - a.durationAvg || a.key.localeCompare(b.key));

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
      flakyTests: flaky.length
    },
    flaky,
    slowest,
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
  return `${count(report.runs.length, 'workflow run')}${parts.length ? ` (${parts.join(', ')})` : ''}`;
}

function describeTotals(report) {
  const { tests, testRuns, retries, flakyTests } = report.totals;
  const failures = report.flaky.reduce((sum, test) => sum + test.failures, 0);
  const retriedText = flakyTests
    ? `${numberFormat.format(flakyTests)} of ${count(tests, 'test')} needed a retry, with ${count(retries, 'retry', 'retries')} in ${count(testRuns, 'test run')}.`
    : `None of the ${count(tests, 'test')} needed a retry in ${count(testRuns, 'test run')}.`;
  return failures ? `${retriedText} ${count(failures, 'test run')} failed after all retries.` : retriedText;
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
  return `⚠️ Data incomplete: ${count(issuesInPeriod.length, 'problem')}${affectedDays ? ` on ${count(affectedDays, 'day')}` : ''}. Details in the report.`;
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

  if (report.dataIssues) {
    lines.push(
      '',
      `## ⚠️ Data problems (${report.dataIssues.length})`,
      '',
      'Some data could not be collected or loaded, so the numbers below may be incomplete.',
      ''
    );
    lines.push(
      ...report.dataIssues.map(
        (issue) =>
          `- ${issue.date ? `${formatDay(issue.date)}: ` : ''}${escapeMarkdown(issue.effect)}. \`${escapeMarkdown(issue.message).replace(/`/g, "'")}\``
      )
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
    const testList = (tests) => tests.map((test) => `- ${escapeMarkdown(test.title)} (${escapeMarkdown(test.suite)})`);
    lines.push('', `## 📈 Recently flaky tests (${report.comparison.recentlyFlaky.length})`, '');
    lines.push(...(report.comparison.recentlyFlaky.length ? testList(report.comparison.recentlyFlaky) : ['None.']));
    lines.push(
      '',
      `## ✅ Fixed (${report.comparison.fixed.length})`,
      '',
      `At least ${MIN_FLAKY_RUNS_BEFORE_FIX} flaky runs in the previous period, then at least ${MIN_CLEAN_RUNS_TO_COUNT_AS_FIXED} runs in this one, all without a retry.`,
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

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { buildReport, buildCard, buildMarkdown };
