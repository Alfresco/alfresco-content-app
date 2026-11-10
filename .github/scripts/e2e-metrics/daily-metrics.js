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
const os = require('node:os');
const path = require('node:path');
const { createGithubClient, mapOneAtATime, requireEnv } = require('./github-api');

const SCHEMA_VERSION = 1;
const DAILY_ARTIFACT_PREFIX = 'e2e-metrics-daily-';

function readDailyFile(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (data.schemaVersion !== SCHEMA_VERSION) {
    throw new Error(`Unsupported schemaVersion ${data.schemaVersion} in ${file}`);
  }
  return data;
}

const isFromTrustedRun = (artifact) => {
  const run = artifact.workflow_run;
  return run?.head_branch === (process.env.SOURCE_BRANCH || 'develop') && run.head_repository_id === run.repository_id;
};

async function downloadLatestTrustedArtifact(github, name, targetDir) {
  const newestFirst = (first, second) => second.created_at.localeCompare(first.created_at);
  const artifacts = (await github.paginate(`/actions/artifacts?name=${encodeURIComponent(name)}`, 'artifacts'))
    .filter((artifact) => !artifact.expired && isFromTrustedRun(artifact))
    .sort(newestFirst);
  if (artifacts.length === 0) {
    return null;
  }
  await github.downloadAndExtractArtifact(artifacts[0].id, targetDir);
  const file = fs.readdirSync(targetDir).find((entry) => entry.endsWith('.json'));
  return file ? path.join(targetDir, file) : null;
}

async function downloadLatestDaily(github, date, workDir) {
  const name = `${DAILY_ARTIFACT_PREFIX}${date}`;
  const file = await downloadLatestTrustedArtifact(github, name, path.join(workDir, name));
  return file ? readDailyFile(file) : null;
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
  const loadDailyOrRecordIssue = async (date) => {
    try {
      return await loadDaily(date);
    } catch (error) {
      issueLog.add({ operation: 'load-daily', date, effect: "The day's data could not be loaded", error });
      return null;
    }
  };
  try {
    return await mapOneAtATime(dates, loadDailyOrRecordIssue);
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
  createDailyArtifactsClient,
  downloadLatestTrustedArtifact,
  loadDailies,
  writeJson
};
