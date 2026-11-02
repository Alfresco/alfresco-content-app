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
const { execFileSync } = require('child_process');

const PAGE_SIZE = 100;
const MAX_REQUEST_ATTEMPTS = 4;
const RETRY_BASE_DELAY_MS = Number(process.env.GITHUB_API_RETRY_BASE_DELAY_MS) || 2000;
const MAX_RETRY_WAIT_MS = 60 * 1000;
const MAX_ERROR_BODY_LENGTH = 200;
const UNZIP_PATH = '/usr/bin/unzip';
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

class GithubApiError extends Error {
  constructor(message, { status, urlPath }) {
    super(message);
    this.name = 'GithubApiError';
    this.status = status;
    this.urlPath = urlPath;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const backoffMs = (attempt) => RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
const isRateLimited = (response) =>
  response.status === 429 ||
  (response.status === 403 && (response.headers.get('x-ratelimit-remaining') === '0' || response.headers.has('retry-after')));
const isRetryable = (response) => RETRYABLE_STATUSES.has(response.status) || isRateLimited(response);

function retryWaitMs(response, attempt) {
  const retryAfterSeconds = Number(response.headers.get('retry-after'));
  if (retryAfterSeconds > 0) {
    return retryAfterSeconds * 1000;
  }
  const rateLimitResetSeconds = Number(response.headers.get('x-ratelimit-reset'));
  if (isRateLimited(response) && rateLimitResetSeconds > 0) {
    return Math.max(0, rateLimitResetSeconds * 1000 - Date.now()) + 1000;
  }
  return backoffMs(attempt);
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required.`);
  }
  return value;
}

function createGithubClient({ token, repository, apiUrl = 'https://api.github.com' }) {
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28'
  };

  async function request(urlPath) {
    const url = `${apiUrl}/repos/${repository}${urlPath}`;
    for (let attempt = 1; ; attempt++) {
      const isLastAttempt = attempt === MAX_REQUEST_ATTEMPTS;
      let response;
      try {
        response = await fetch(url, { headers });
      } catch (error) {
        if (isLastAttempt) {
          throw new GithubApiError(`GitHub API ${urlPath}: network error after ${attempt} attempts (${error.message})`, { status: null, urlPath });
        }
        await sleep(backoffMs(attempt));
        continue;
      }
      if (response.ok) {
        return response;
      }
      const waitMs = retryWaitMs(response, attempt);
      if (isRetryable(response) && !isLastAttempt && waitMs <= MAX_RETRY_WAIT_MS) {
        await sleep(waitMs);
        continue;
      }
      const body = (await response.text()).slice(0, MAX_ERROR_BODY_LENGTH);
      throw new GithubApiError(`GitHub API ${urlPath} returned HTTP ${response.status} after ${attempt} attempt(s): ${body}`, {
        status: response.status,
        urlPath
      });
    }
  }

  async function paginate(urlPath, itemsKey) {
    const items = [];
    const separator = urlPath.includes('?') ? '&' : '?';
    for (let page = 1; ; page++) {
      const body = await (await request(`${urlPath}${separator}per_page=${PAGE_SIZE}&page=${page}`)).json();
      const pageItems = body[itemsKey] || [];
      items.push(...pageItems);
      if (pageItems.length < PAGE_SIZE) {
        return items;
      }
    }
  }

  async function downloadAndExtractArtifact(artifactId, targetDir) {
    const response = await request(`/actions/artifacts/${artifactId}/zip`);
    const zipFile = path.join(os.tmpdir(), `artifact-${artifactId}-${process.pid}.zip`);
    try {
      fs.writeFileSync(zipFile, Buffer.from(await response.arrayBuffer()));
      fs.mkdirSync(targetDir, { recursive: true });
      execFileSync(UNZIP_PATH, ['-o', '-q', zipFile, '-d', targetDir], { stdio: 'inherit' });
    } finally {
      fs.rmSync(zipFile, { force: true });
    }
  }

  async function getJson(urlPath) {
    return (await request(urlPath)).json();
  }

  return { getJson, paginate, downloadAndExtractArtifact };
}

function runUrl() {
  const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;
  return GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_RUN_ID ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}` : null;
}

function defaultGithubPagesUrl() {
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
  return owner && repo ? `https://${owner.toLowerCase()}.github.io/${repo}/` : null;
}

function dashboardUrl() {
  const withTrailingSlash = (url) => url.replace(/\/?$/, '/');
  return process.env.DASHBOARD_URL ? withTrailingSlash(process.env.DASHBOARD_URL) : defaultGithubPagesUrl();
}

module.exports = {
  requireEnv,
  createGithubClient,
  runUrl,
  dashboardUrl
};
