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
 * Builds the static E2E dashboard site (GitHub Pages): copies `dashboard/index.html` and writes the metrics history
 * as `data/history.json` (read back by the next build) and `data/history.js` (loaded by the page, works from file:// too).
 *
 * History sources, later ones win for the same day:
 *  1. the history of the currently published dashboard (keeps more days than the artifact retention),
 *  2. `e2e-metrics-daily-<date>` artifacts of the last REFRESH_DAYS days (ARTIFACT_DAYS when there is no published history),
 *  3. `<date>.json` files in DAILY_DIR (e.g. today's runs collected by populate-e2e-reports).
 * Sources 1 and 2 are skipped when REMOTE_DATA is `false` (branch previews).
 *
 * Env:
 *  - END_DATE: last UTC day to refresh (YYYY-MM-DD), defaults to yesterday
 *  - DAILY_DIR, REMOTE_DATA, GITHUB_TOKEN, GITHUB_REPOSITORY: see lib.loadDailies
 *  - DASHBOARD_URL: published dashboard URL (defaults to the repository's GitHub Pages URL)
 *  - SOURCE_BRANCH: branch the runs were collected from (default `develop`)
 *  - HISTORY_DAYS: days of history kept (default 365)
 *  - SITE_DIR: output directory (default `e2e-dashboard`)
 */

const fs = require('fs');
const path = require('path');
const { SCHEMA_VERSION, assertDate, shiftDate, yesterdayUtc, dashboardUrl, loadDailies, dateRange } = require('./lib');

const TEMPLATE = path.join(__dirname, 'dashboard', 'index.html');
const DEFAULT_HISTORY_DAYS = 365;
const REFRESH_DAYS = 14;
const ARTIFACT_DAYS = 90;
// Positions of the per-day test metrics in the compact history format.
const METRIC_FIELDS = ['runs', 'retries', 'flakyRuns', 'failures', 'durationSum', 'durationCount', 'durationMax', 'setupSum'];

/** Fetch the history of the published dashboard; null when nothing is published yet. */
async function fetchPublishedHistory(siteUrl) {
  const url = `${siteUrl}data/history.json`;
  const response = await fetch(url, { cache: 'no-store' });
  if (response.status === 404) {
    console.log(`No published history at ${url}, starting a new one.`);
    return null;
  }
  if (!response.ok) {
    // Failing is safer than publishing a dashboard that silently lost its history.
    throw new Error(`Could not read the published history ${url}: HTTP ${response.status}`);
  }
  const history = await response.json();
  if (history.schemaVersion !== SCHEMA_VERSION) {
    throw new Error(`Unsupported published history schemaVersion ${history.schemaVersion}`);
  }
  return history;
}

/** Expand the compact history format into daily metrics objects keyed by date. */
function expandHistory(history) {
  const days = new Map();
  for (const day of history?.days || []) {
    const tests = day.tests.map(([index, ...values]) => {
      const [suite, file, title, filePath, line] = history.tests[index];
      const test = { key: `${suite} › ${file} › ${title}`, suite, file, title, path: filePath, line };
      METRIC_FIELDS.forEach((field, position) => (test[field] = values[position] ?? 0));
      return test;
    });
    days.set(day.date, { date: day.date, runs: day.runs, tests });
  }
  return days;
}

function compactRun(run) {
  return { id: run.id, workflow: run.workflow, title: run.title, conclusion: run.conclusion, createdAt: run.createdAt, url: run.url };
}

/** Compact history: a test catalog plus per-day `[testIndex, ...METRIC_FIELDS]` rows. */
function compactHistory(days, meta) {
  const catalog = [];
  const indexByKey = new Map();
  const compactDays = [...days.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((day) => ({
      date: day.date,
      runs: day.runs.map(compactRun),
      tests: day.tests.map((test) => {
        if (!indexByKey.has(test.key)) {
          indexByKey.set(test.key, catalog.length);
          catalog.push([test.suite, test.file, test.title, test.path || null, test.line || null]);
        }
        return [indexByKey.get(test.key), ...METRIC_FIELDS.map((field) => test[field])];
      })
    }));
  return { schemaVersion: SCHEMA_VERSION, ...meta, tests: catalog, days: compactDays };
}

async function main() {
  const endDate = assertDate(process.env.END_DATE || yesterdayUtc(), 'END_DATE');
  const historyDays = Number(process.env.HISTORY_DAYS) || DEFAULT_HISTORY_DAYS;
  const siteDir = process.env.SITE_DIR || 'e2e-dashboard';
  const siteUrl = dashboardUrl();
  const remote = process.env.REMOTE_DATA !== 'false';

  const published = remote && siteUrl ? await fetchPublishedHistory(siteUrl) : null;
  const days = expandHistory(published);

  const refreshDates = dateRange(endDate, published ? REFRESH_DAYS : ARTIFACT_DAYS);
  const dailies = await loadDailies(refreshDates);
  dailies.forEach((daily, index) => daily && days.set(refreshDates[index], daily));

  const oldestKept = shiftDate(endDate, 1 - historyDays);
  for (const date of days.keys()) {
    if (date < oldestKept) {
      days.delete(date);
    }
  }

  const history = compactHistory(days, {
    generatedAt: new Date().toISOString(),
    repository: process.env.GITHUB_REPOSITORY || null,
    serverUrl: process.env.GITHUB_SERVER_URL || 'https://github.com',
    branch: process.env.SOURCE_BRANCH || 'develop'
  });

  fs.mkdirSync(siteDir, { recursive: true });
  fs.copyFileSync(TEMPLATE, path.join(siteDir, 'index.html'));
  const json = JSON.stringify(history);
  fs.mkdirSync(path.join(siteDir, 'data'), { recursive: true });
  fs.writeFileSync(path.join(siteDir, 'data', 'history.json'), json);
  fs.writeFileSync(path.join(siteDir, 'data', 'history.js'), `window.E2E_HISTORY = ${json};\n`);
  console.log(
    `Built dashboard in ${siteDir}: ${history.days.length} day(s), ${history.tests.length} test(s), ${(json.length / 1024).toFixed(0)} KB.`
  );
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { expandHistory, compactHistory };
