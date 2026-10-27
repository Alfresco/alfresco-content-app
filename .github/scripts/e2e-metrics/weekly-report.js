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
 *  - slowest tests: average duration of passed attempts (sorted from longest to shortest).
 * Writes the full report as JSON and Markdown (also to the job summary) and a compact Teams card with the
 * headline numbers and a link to the E2E dashboard, which is posted when TEAMS_WEBHOOK_URL is set.
 *
 * Env:
 *  - REPORT_END_DATE: last UTC day included in the report (YYYY-MM-DD), defaults to yesterday
 *  - REPORT_DAYS: number of days in the report window (default 7)
 *  - REPORT_TITLE: card/summary title (defaults to "ACA E2E weekly report" or "ACA E2E report - last <n> days")
 *  - DAILY_DIR, REMOTE_DATA, GITHUB_TOKEN, GITHUB_REPOSITORY: where the daily metrics come from (see lib.loadDailies)
 *  - SOURCE_BRANCH: branch the runs were collected from, shown in the report (default `develop`)
 *  - DASHBOARD_PUBLISHED: `true` when the dashboard was deployed with this data, adds an "Open dashboard" button
 *  - OUTPUT_DIR: where to write the report files (default `e2e-metrics-weekly`)
 *  - TEAMS_WEBHOOK_URL: Teams webhook; posting is skipped when not set (see also post-teams.js)
 */

const fs = require('fs');
const path = require('path');
const {
  SCHEMA_VERSION,
  assertDate,
  yesterdayUtc,
  mergeTests,
  averageDuration,
  formatDuration,
  runUrl,
  dashboardUrl,
  loadDailies,
  dateRange,
  postToTeams,
  writeJson
} = require('./lib');

function buildReport(dates, dailies, title) {
  const available = dailies.filter(Boolean);
  const runs = available.flatMap((daily) => daily.runs);
  const tests = mergeTests(available.map((daily) => daily.tests)).map((test) => ({ ...test, durationAvg: Math.round(averageDuration(test)) }));

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
    slowest
  };
}

function testLabel(test) {
  return `${test.title} (${test.suite})`;
}

function buildCard(report, { dashboardLink, runLink, sourceBranch }) {
  const workflowSummary = Object.entries(report.runsByWorkflow)
    .map(([workflow, count]) => `${workflow}: ${count}`)
    .join(', ');
  const daysTotal = report.missingDays.length + report.daysCollected;
  const facts = [
    { title: 'Workflow runs', value: `${report.runs.length}${workflowSummary ? ` (${workflowSummary})` : ''}` },
    { title: 'Tests / test runs', value: `${report.totals.tests} / ${report.totals.testRuns}` },
    { title: 'Tests with retries', value: String(report.totals.flakyTests) },
    { title: 'Total retries', value: String(report.totals.retries) },
    { title: report.missingDays.length ? '⚠️ Days collected' : 'Days collected', value: `${report.daysCollected} / ${daysTotal}` }
  ];
  const [mostRetried] = report.flaky;
  if (mostRetried) {
    facts.push({ title: '🔁 Most retried', value: `${testLabel(mostRetried)}: ${mostRetried.retries} / ${mostRetried.runs}` });
  }
  const [slowest] = report.slowest;
  if (slowest) {
    facts.push({ title: '🐢 Slowest (avg)', value: `${testLabel(slowest)}: ${formatDuration(slowest.durationAvg)}` });
  }

  const body = [
    { type: 'TextBlock', size: 'Large', weight: 'Bolder', text: report.title, wrap: true },
    { type: 'TextBlock', text: `${report.startDate} → ${report.endDate} (UTC), ${sourceBranch}`, isSubtle: true, spacing: 'None' },
    { type: 'FactSet', facts }
  ];
  if (report.totals.tests === 0) {
    body.push({ type: 'TextBlock', text: 'No E2E metrics were collected for this period.', wrap: true, color: 'Warning', weight: 'Bolder' });
  }

  const actions = [];
  if (dashboardLink) {
    actions.push({ type: 'Action.OpenUrl', title: 'Open dashboard', url: dashboardLink });
  }
  if (runLink) {
    actions.push({ type: 'Action.OpenUrl', title: dashboardLink ? 'Open run' : 'Open run (full report)', url: runLink });
  }

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
  const lines = [
    `# ${report.title}: ${report.startDate} → ${report.endDate} (UTC)`,
    '',
    `- Workflow runs: ${report.runs.length} ${JSON.stringify(report.runsByWorkflow)}`,
    `- Tests tracked: ${report.totals.tests}, test runs: ${report.totals.testRuns}`,
    `- Tests with retries: ${report.totals.flakyTests}, total retries: ${report.totals.retries}`
  ];
  if (report.missingDays.length) {
    lines.push(`- ⚠️ Missing daily data: ${report.missingDays.join(', ')}`);
  }
  if (dashboardLink) {
    lines.push(`- 📊 [E2E dashboard](${dashboardLink})`);
  }

  lines.push('', `## 🔁 Flaky tests (${report.flaky.length})`, '');
  if (report.flaky.length) {
    lines.push('| # | Suite | Test | File | Retries / runs | Flaky runs | Failed runs |', '|---|---|---|---|---|---|---|');
    report.flaky.forEach((test, index) => {
      lines.push(
        `| ${index + 1} | ${escapeMarkdown(test.suite)} | ${escapeMarkdown(test.title)} | ${escapeMarkdown(test.file)} | ${test.retries} / ${test.runs} | ${test.flakyRuns} | ${test.failures} |`
      );
    });
  } else {
    lines.push('No test needed a retry.');
  }

  lines.push('', `## 🐢 Tests by average duration of passed attempts (${report.slowest.length})`, '');
  lines.push('| # | Suite | Test | File | Avg | Max | Runs |', '|---|---|---|---|---|---|---|');
  report.slowest.forEach((test, index) => {
    lines.push(
      `| ${index + 1} | ${escapeMarkdown(test.suite)} | ${escapeMarkdown(test.title)} | ${escapeMarkdown(test.file)} | ${formatDuration(test.durationAvg)} | ${formatDuration(test.durationMax)} | ${test.runs} |`
    );
  });

  return `${lines.join('\n')}\n`;
}

async function main() {
  const endDate = assertDate(process.env.REPORT_END_DATE || yesterdayUtc(), 'REPORT_END_DATE');
  const days = Number(process.env.REPORT_DAYS) || 7;
  const title = process.env.REPORT_TITLE || (days === 7 ? 'ACA E2E weekly report' : `ACA E2E report - last ${days} days`);
  const sourceBranch = process.env.SOURCE_BRANCH || 'develop';
  const outputDir = process.env.OUTPUT_DIR || 'e2e-metrics-weekly';
  const dates = dateRange(endDate, days);
  const dashboardLink = process.env.DASHBOARD_PUBLISHED === 'true' && dashboardUrl() ? `${dashboardUrl()}#days=${days}&end=${endDate}` : null;

  const report = buildReport(dates, await loadDailies(dates), title);
  const markdown = buildMarkdown(report, dashboardLink);
  const card = buildCard(report, { dashboardLink, runLink: runUrl(), sourceBranch });

  writeJson(path.join(outputDir, 'report.json'), report);
  writeJson(path.join(outputDir, 'teams-card.json'), card);
  fs.writeFileSync(path.join(outputDir, 'report.md'), markdown);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
  }
  console.log(`${report.title} ${report.startDate} → ${report.endDate}: ${report.totals.tests} test(s), ${report.flaky.length} with retries.`);

  await postToTeams(card);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { buildReport, buildCard, buildMarkdown };
