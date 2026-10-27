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
 * Posts a top-N summary to Teams and writes the full report as JSON and Markdown.
 *
 * Env:
 *  - REPORT_END_DATE: last UTC day included in the report (YYYY-MM-DD), defaults to yesterday
 *  - REPORT_DAYS: number of days in the report window (default 7)
 *  - REPORT_TITLE: card/summary title (defaults to "ACA E2E weekly report" or "ACA E2E report - last <n> days")
 *  - DAILY_DIR: daily metrics files (`<date>.json`) in this directory take precedence over downloaded ones
 *  - GITHUB_TOKEN, GITHUB_REPOSITORY: used to download the `e2e-metrics-daily-<date>` artifacts; when not set,
 *    only DAILY_DIR is used
 *  - OUTPUT_DIR: where to write the weekly report files (default `e2e-metrics-weekly`)
 *  - TOP_N: number of tests listed per section in Teams (default 15)
 *  - TEAMS_WEBHOOK_URL: Teams webhook; posting is skipped when not set
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  SCHEMA_VERSION,
  DAILY_ARTIFACT_PREFIX,
  requireEnv,
  assertDate,
  shiftDate,
  yesterdayUtc,
  createGithubClient,
  mergeTests,
  averageDuration,
  formatDuration,
  writeJson
} = require('./lib');

const DEFAULT_TOP_N = 15;
const MIN_TOP_N = 5;
// Teams rejects Adaptive Cards above ~28 KB.
const MAX_CARD_BYTES = 26 * 1024;

function readDailyFile(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (data.schemaVersion !== SCHEMA_VERSION) {
    throw new Error(`Unsupported schemaVersion ${data.schemaVersion} in ${file}`);
  }
  return data;
}

function readLocalDaily(dailyDir, date) {
  const file = path.join(dailyDir, `${date}.json`);
  return fs.existsSync(file) ? readDailyFile(file) : null;
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

async function loadDailies(dates) {
  const dailyDir = process.env.DAILY_DIR;
  const github = process.env.GITHUB_TOKEN
    ? createGithubClient({ token: process.env.GITHUB_TOKEN, repository: requireEnv('GITHUB_REPOSITORY'), apiUrl: process.env.GITHUB_API_URL })
    : null;
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-metrics-weekly-'));
  try {
    const dailies = [];
    for (const date of dates) {
      const local = dailyDir ? readLocalDaily(dailyDir, date) : null;
      dailies.push(local || (github ? await downloadDaily(github, date, workDir) : null));
    }
    return dailies;
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }
}

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

function runUrl() {
  const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;
  return GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_RUN_ID ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}` : null;
}

function textCell(text, opts = {}) {
  return {
    type: 'TableCell',
    verticalContentAlignment: 'Center',
    items: [{ type: 'TextBlock', text: String(text), wrap: true, horizontalAlignment: 'Center', ...opts }]
  };
}

function testCell(test) {
  return {
    type: 'TableCell',
    verticalContentAlignment: 'Center',
    items: [
      { type: 'TextBlock', text: test.suite, wrap: true, size: 'Small', isSubtle: true, spacing: 'None' },
      { type: 'TextBlock', text: test.title, wrap: true, spacing: 'None' }
    ]
  };
}

function buildTable(headers, widths, rows) {
  return {
    type: 'Table',
    gridStyle: 'accent',
    firstRowAsHeader: true,
    columns: widths.map((width) => ({ width })),
    rows: [
      {
        type: 'TableRow',
        cells: headers.map((header, index) => textCell(header, { weight: 'Bolder', horizontalAlignment: index === 0 ? 'Left' : 'Center' }))
      },
      ...rows.map((cells) => ({ type: 'TableRow', cells }))
    ]
  };
}

function sectionTitle(text) {
  return { type: 'TextBlock', weight: 'Bolder', size: 'Medium', text, separator: true, spacing: 'Large', wrap: true };
}

function buildCard(report, topN) {
  const body = [
    { type: 'TextBlock', size: 'Large', weight: 'Bolder', text: report.title, wrap: true },
    { type: 'TextBlock', text: `${report.startDate} → ${report.endDate} (UTC)`, isSubtle: true, spacing: 'None' }
  ];

  const workflowSummary = Object.entries(report.runsByWorkflow)
    .map(([workflow, count]) => `${workflow}: ${count}`)
    .join(', ');
  const facts = [
    { title: 'Workflow runs', value: `${report.runs.length}${workflowSummary ? ` (${workflowSummary})` : ''}` },
    { title: 'Tests tracked', value: String(report.totals.tests) },
    { title: 'Test runs', value: String(report.totals.testRuns) },
    { title: 'Tests with retries', value: String(report.totals.flakyTests) },
    { title: 'Total retries', value: String(report.totals.retries) }
  ];
  const daysTotal = report.missingDays.length + report.daysCollected;
  facts.push({ title: report.missingDays.length ? '⚠️ Days collected' : 'Days collected', value: `${report.daysCollected} / ${daysTotal}` });
  body.push({ type: 'FactSet', facts });

  if (report.totals.tests === 0) {
    body.push({ type: 'TextBlock', text: 'No E2E metrics were collected for this period.', wrap: true, color: 'Warning', weight: 'Bolder' });
  } else {
    const flaky = report.flaky.slice(0, topN);
    body.push(sectionTitle(`🔁 Flaky tests (top ${flaky.length} of ${report.flaky.length})`));
    if (flaky.length) {
      body.push(
        buildTable(
          ['Test', 'Retries / runs', 'Failed runs'],
          [6, 2, 2],
          flaky.map((test) => [
            testCell(test),
            textCell(`${test.retries} / ${test.runs}`, { color: 'Warning' }),
            textCell(test.failures, { color: test.failures > 0 ? 'Attention' : 'Default' })
          ])
        )
      );
    } else {
      body.push({ type: 'TextBlock', text: 'No test needed a retry this week 🎉', wrap: true, color: 'Good' });
    }

    const slowest = report.slowest.slice(0, topN);
    body.push(sectionTitle(`🐢 Slowest tests by average duration (top ${slowest.length} of ${report.slowest.length})`));
    body.push(
      buildTable(
        ['Test', 'Avg', 'Max', 'Runs'],
        [6, 2, 2, 1],
        slowest.map((test) => [
          testCell(test),
          textCell(formatDuration(test.durationAvg)),
          textCell(formatDuration(test.durationMax)),
          textCell(test.runs)
        ])
      )
    );
  }

  body.push({
    type: 'TextBlock',
    text: 'Retries / runs: retries over all runs of a test (daily chrome cron and populate E2E reports runs on develop). Durations are averages of passed attempts only. The full lists are in the workflow run summary.',
    wrap: true,
    size: 'Small',
    isSubtle: true,
    separator: true
  });

  const url = runUrl();
  return {
    type: 'AdaptiveCard',
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.5',
    msteams: { width: 'Full' },
    body,
    actions: url ? [{ type: 'Action.OpenUrl', title: 'Open full report', url }] : []
  };
}

/** Build the card with as many rows as fit within the Teams payload limit. */
function buildCardWithinLimit(report, topN) {
  let rows = topN;
  let card = buildCard(report, rows);
  while (Buffer.byteLength(JSON.stringify(card)) > MAX_CARD_BYTES && rows > MIN_TOP_N) {
    rows = Math.max(MIN_TOP_N, rows - MIN_TOP_N);
    card = buildCard(report, rows);
  }
  return card;
}

function escapeMarkdown(text) {
  return String(text).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function buildMarkdown(report) {
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

async function main() {
  const endDate = assertDate(process.env.REPORT_END_DATE || yesterdayUtc(), 'REPORT_END_DATE');
  const days = Number(process.env.REPORT_DAYS) || 7;
  const title = process.env.REPORT_TITLE || (days === 7 ? 'ACA E2E weekly report' : `ACA E2E report - last ${days} days`);
  const topN = Number(process.env.TOP_N) || DEFAULT_TOP_N;
  const outputDir = process.env.OUTPUT_DIR || 'e2e-metrics-weekly';
  const dates = Array.from({ length: days }, (_, index) => shiftDate(endDate, index - days + 1));

  const report = buildReport(dates, await loadDailies(dates), title);
  const markdown = buildMarkdown(report);
  const card = buildCardWithinLimit(report, topN);

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
