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

const MAX_MESSAGE_LENGTH = 300;

const errorMessage = (error) => (error instanceof Error ? error.message : String(error));
const escapeAnnotation = (text) => text.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A');
const datePrefix = (issue) => (issue.date ? `${issue.date}: ` : '');

function createDataIssueLog(stage, defaults = {}) {
  const issues = [];

  function add({ effect, error, ...context }) {
    const issue = {
      stage,
      ...defaults,
      ...context,
      effect,
      status: error?.status ?? null,
      message: errorMessage(error).slice(0, MAX_MESSAGE_LENGTH)
    };
    issues.push(issue);
    if (process.env.GITHUB_ACTIONS === 'true') {
      const annotationText = escapeAnnotation(`${effect}. ${issue.message}`);
      console.log(`::warning title=E2E metrics data problem::${annotationText}`);
    } else {
      console.warn(`Data problem: ${effect}. ${issue.message}`);
    }
    return issue;
  }

  return { add, issues };
}

function appendIssuesToStepSummary(issues, heading) {
  if (!issues.length || !process.env.GITHUB_STEP_SUMMARY) {
    return;
  }
  const lines = [
    `### ⚠️ ${heading} (${issues.length})`,
    '',
    ...issues.map((issue) => `- ${datePrefix(issue)}${issue.effect}. \`${issue.message}\``),
    ''
  ];
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join('\n')}\n`);
}

module.exports = {
  createDataIssueLog,
  appendIssuesToStepSummary
};
