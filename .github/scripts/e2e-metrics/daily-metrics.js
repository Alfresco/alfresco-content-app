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
const os = require('os');
const path = require('path');
const { createGithubClient, requireEnv } = require('./github-api');

const SCHEMA_VERSION = 1;
const DAILY_ARTIFACT_PREFIX = 'e2e-metrics-daily-';

function readDailyFile(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (data.schemaVersion !== SCHEMA_VERSION) {
    throw new Error(`Unsupported schemaVersion ${data.schemaVersion} in ${file}`);
  }
  return data;
}

async function downloadLatestDaily(github, date, workDir) {
  const name = `${DAILY_ARTIFACT_PREFIX}${date}`;
  const newestFirst = (a, b) => b.created_at.localeCompare(a.created_at);
  const artifacts = (await github.paginate(`/actions/artifacts?name=${encodeURIComponent(name)}`, 'artifacts'))
    .filter((artifact) => !artifact.expired)
    .sort(newestFirst);
  if (artifacts.length === 0) {
    return null;
  }
  const targetDir = path.join(workDir, name);
  await github.downloadAndExtractArtifact(artifacts[0].id, targetDir);
  const file = fs.readdirSync(targetDir).find((entry) => entry.endsWith('.json'));
  return file ? readDailyFile(path.join(targetDir, file)) : null;
}

function createDailyArtifactsClient() {
  const remoteDataAllowed = process.env.REMOTE_DATA !== 'false' && !!process.env.GITHUB_TOKEN;
  return remoteDataAllowed
    ? createGithubClient({ token: process.env.GITHUB_TOKEN, repository: requireEnv('GITHUB_REPOSITORY'), apiUrl: process.env.GITHUB_API_URL })
    : null;
}

async function loadDailies(dates, issueLog) {
  const localDailyFile = (date) => (process.env.DAILY_DIR ? path.join(process.env.DAILY_DIR, `${date}.json`) : null);
  const github = createDailyArtifactsClient();
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-metrics-dailies-'));
  const loadDaily = async (date) => {
    const localFile = localDailyFile(date);
    if (localFile && fs.existsSync(localFile)) {
      return readDailyFile(localFile);
    }
    return github ? downloadLatestDaily(github, date, workDir) : null;
  };
  try {
    const dailies = [];
    for (const date of dates) {
      try {
        dailies.push(await loadDaily(date));
      } catch (error) {
        issueLog.add({ operation: 'load-daily', date, effect: "The day's data could not be loaded", error });
        dailies.push(null);
      }
    }
    return dailies;
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

module.exports = {
  SCHEMA_VERSION,
  DAILY_ARTIFACT_PREFIX,
  loadDailies,
  writeJson
};
