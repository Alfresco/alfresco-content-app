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
 * Aggregates Playwright blob reports produced by the cron multibrowser E2E run and posts a
 * per-suite summary (passed / failed / skipped / excluded) as an Adaptive Card to a Teams channel.
 *
 * Expects blob artifacts downloaded under `all-blobs/blob-<browser>-<suite>/` (each containing a
 * Playwright blob `report.zip`) and the Teams webhook URL in `TEAMS_WEBHOOK_URL`.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const BROWSERS = ['chrome', 'firefox', 'webkit', 'msedge'];
const BLOBS_DIR = 'all-blobs';
const EXCLUDE_ROOT = path.join('e2e', 'playwright');
// Matrix suite name -> test folder, for the single suite whose folder name differs.
const SUITE_TO_FOLDER = { 'special-permissions': 'special-permissions-actions-available' };

const PLAYWRIGHT_BIN = path.join('node_modules', '.bin', 'playwright');

function emptyCounts() {
  return { run: 0, passed: 0, failed: 0, skipped: 0, excluded: 0 };
}

function addCounts(target, source) {
  target.run += source.run;
  target.passed += source.passed;
  target.failed += source.failed;
  target.skipped += source.skipped;
  target.excluded += source.excluded;
}

/** Parse `blob-<browser>-<suite>` artifact directory names. */
function parseArtifactName(dirName) {
  const match = /^blob-([^-]+)-(.+)$/.exec(dirName);
  if (!match) {
    return null;
  }
  const [, browser, suite] = match;
  if (!BROWSERS.includes(browser)) {
    return null;
  }
  return { browser, suite };
}

/** Merge a single artifact's blob report into JSON and return Playwright `stats`. */
function readStats(artifactDir) {
  const outFile = path.join(os.tmpdir(), `pw-json-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
  try {
    execFileSync(PLAYWRIGHT_BIN, ['merge-reports', artifactDir, '--reporter', 'json'], {
      stdio: ['ignore', 'ignore', 'inherit'],
      maxBuffer: 1 << 28,
      env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: outFile }
    });
    const report = JSON.parse(fs.readFileSync(outFile, 'utf8'));
    const stats = report.stats || {};
    const passed = (stats.expected || 0) + (stats.flaky || 0);
    const failed = stats.unexpected || 0;
    const skipped = stats.skipped || 0;
    return { run: passed + failed + skipped, passed, failed, skipped, excluded: 0 };
  } catch (error) {
    console.warn(`Could not read blob report in ${artifactDir}: ${error.message}`);
    return null;
  } finally {
    fs.rmSync(outFile, { force: true });
  }
}

/** Count excluded test cases for a suite/browser, mirroring getExcludedTestsRegExpArray. */
function excludedForBrowser(excludeJson, browser) {
  const ids = new Set();
  const browserKeys = ['all', 'firefox', 'chromium', 'webkit', 'msedge'];
  if (excludeJson.all && typeof excludeJson.all === 'object') {
    Object.keys(excludeJson.all).forEach((id) => ids.add(id));
  }
  const key = browserKeys.find((k) => k.toLowerCase() === browser.toLowerCase());
  if (key && excludeJson[key] && typeof excludeJson[key] === 'object') {
    Object.keys(excludeJson[key]).forEach((id) => ids.add(id));
  }
  return ids.size;
}

function readExcludeJson(suite) {
  const folder = SUITE_TO_FOLDER[suite] || suite;
  const file = path.join(EXCLUDE_ROOT, folder, 'exclude.tests.json');
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function collect() {
  const suiteStats = new Map();
  const browserStats = new Map(BROWSERS.map((b) => [b, emptyCounts()]));
  const suiteBrowsers = new Map();

  if (!fs.existsSync(BLOBS_DIR)) {
    return { suiteStats, browserStats };
  }

  for (const dirName of fs.readdirSync(BLOBS_DIR)) {
    const parsed = parseArtifactName(dirName);
    if (!parsed) {
      continue;
    }
    const { browser, suite } = parsed;
    const stats = readStats(path.join(BLOBS_DIR, dirName));
    if (!stats) {
      continue;
    }

    if (!suiteStats.has(suite)) {
      suiteStats.set(suite, emptyCounts());
      suiteBrowsers.set(suite, new Set());
    }
    suiteBrowsers.get(suite).add(browser);
    addCounts(suiteStats.get(suite), stats);
    addCounts(browserStats.get(browser), stats);
  }

  // Excluded tests never reach the blob report, so add them from the exclude.tests.json files.
  for (const [suite, browsers] of suiteBrowsers) {
    const excludeJson = readExcludeJson(suite);
    if (!excludeJson) {
      continue;
    }
    let suiteExcluded = 0;
    for (const browser of browsers) {
      const count = excludedForBrowser(excludeJson, browser);
      suiteExcluded += count;
      browserStats.get(browser).excluded += count;
    }
    suiteStats.get(suite).excluded += suiteExcluded;
  }

  return { suiteStats, browserStats };
}

function textCell(text, opts = {}) {
  return {
    type: 'TextBlock',
    text: String(text),
    wrap: true,
    spacing: 'None',
    ...opts
  };
}

function row(cells, weights = [3, 1, 1, 1, 1, 1]) {
  return {
    type: 'ColumnSet',
    columns: cells.map((cell, index) => ({
      type: 'Column',
      width: String(weights[index]),
      items: [cell]
    }))
  };
}

function buildDetailsRows(suiteStats) {
  const rows = [
    row([
      textCell('Suite', { weight: 'Bolder' }),
      textCell('Run', { weight: 'Bolder' }),
      textCell('Pass', { weight: 'Bolder' }),
      textCell('Fail', { weight: 'Bolder' }),
      textCell('Skip', { weight: 'Bolder' }),
      textCell('Excl', { weight: 'Bolder' })
    ])
  ];

  for (const suite of [...suiteStats.keys()].sort()) {
    const c = suiteStats.get(suite);
    rows.push(
      row([
        textCell(suite),
        textCell(c.run),
        textCell(c.passed, { color: 'Good' }),
        textCell(c.failed, { color: c.failed > 0 ? 'Attention' : 'Default' }),
        textCell(c.skipped, { color: 'Warning' }),
        textCell(c.excluded)
      ])
    );
  }

  return rows;
}

function buildCard({ suiteStats, browserStats }) {
  const total = emptyCounts();
  for (const c of suiteStats.values()) {
    addCounts(total, c);
  }

  const date = new Date().toISOString().slice(0, 10);
  const runUrl = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;

  const browserFacts = BROWSERS.map((browser) => {
    const c = browserStats.get(browser);
    return { title: browser, value: `run ${c.run} · ✅ ${c.passed} · ❌ ${c.failed} · ⏭️ ${c.skipped} · 🚫 ${c.excluded}` };
  });

  return {
    type: 'AdaptiveCard',
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.5',
    body: [
      { type: 'TextBlock', size: 'Large', weight: 'Bolder', text: `Nightly E2E — ${date}` },
      {
        type: 'FactSet',
        facts: [
          { title: 'Total run', value: String(total.run) },
          { title: 'Passed ✅', value: String(total.passed) },
          { title: 'Failed ❌', value: String(total.failed) },
          { title: 'Skipped ⏭️', value: String(total.skipped) },
          { title: 'Excluded 🚫', value: String(total.excluded) }
        ]
      },
      { type: 'TextBlock', weight: 'Bolder', text: 'Per browser', separator: true },
      { type: 'FactSet', facts: browserFacts },
      {
        type: 'Container',
        id: 'suiteDetails',
        isVisible: false,
        separator: true,
        items: [{ type: 'TextBlock', weight: 'Bolder', text: 'Per suite' }, ...buildDetailsRows(suiteStats)]
      }
    ],
    actions: [
      { type: 'Action.ToggleVisibility', title: 'Show per-suite details', targetElements: ['suiteDetails'] },
      { type: 'Action.OpenUrl', title: 'Open workflow run', url: runUrl }
    ]
  };
}

async function postToTeams(card) {
  const webhook = process.env.TEAMS_WEBHOOK_URL;
  if (!webhook) {
    console.warn('TEAMS_WEBHOOK_URL is not set, skipping Teams notification.');
    return;
  }

  const payload = {
    type: 'message',
    attachments: [{ contentType: 'application/vnd.microsoft.card.adaptive', content: card }]
  };

  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Teams webhook returned ${response.status}: ${await response.text()}`);
  }
  console.log(`Posted E2E report to Teams (HTTP ${response.status}).`);
}

async function main() {
  const results = collect();
  const card = buildCard(results);
  await postToTeams(card);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
