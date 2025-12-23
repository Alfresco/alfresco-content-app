/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ReporterDescription } from '@playwright/test';
import { timeouts } from '../utils';

const { env } = process;

export const getReportPortalConfig = () => {
  const browser = (env.PLAYWRIGHT_BROWSER || 'chrome').toLowerCase();
  const attributes = [
    { key: 'Job', value: `${env.GITHUB_JOB}` },
    { key: 'Build_type', value: `${env.GITHUB_EVENT_NAME}` },
    { key: 'Repository', value: `${env.GITHUB_REPOSITORY}` },
    { key: 'Branch', value: `${env.GITHUB_HEAD_REF || env.GITHUB_REF}` },
    { key: 'Browser', value: browser }
  ];

  const launch = `GitHub Actions - ACA - ${browser}`;

  return {
    endpoint: env.REPORT_PORTAL_URL,
    apiKey: env.REPORT_PORTAL_TOKEN,
    project: 'alfresco-content-app',
    launch,
    includeTestSteps: true,
    skipPassed: true,
    restClientConfig: {
      timeout: timeouts.extendedTest
    },
    attributes,
    description: `[Run ${env.GITHUB_RUN_ID}](${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}) - ${browser} - Failures only`
  };
};

export const getReporter = (): ReporterDescription[] => {
  if (!env.CI) {
    return [['html']];
  }

  return [['@reportportal/agent-js-playwright', getReportPortalConfig()], ['github']];
};
