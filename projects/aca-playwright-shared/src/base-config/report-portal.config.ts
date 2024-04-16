/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { ReporterDescription } from '@playwright/test';
import { paths, timeouts } from '../utils';

const { env } = process;

export const getReportPortalConfig = () => {
    const attributes = [
        { key: 'Job', value: `${env.GITHUB_JOB}` },
        { key: 'Build_type', value: `${env.GITHUB_EVENT_NAME}` },
        { key: 'Repository', value: `${env.GITHUB_REPOSITORY}` },
        { key: 'Branch', value: `${env.GITHUB_HEAD_REF || env.GITHUB_REF}` }
    ];

    const launch = `GitHub Actions - ACA`;

    return {
        endpoint: env.REPORT_PORTAL_URL,
        apiKey: env.REPORT_PORTAL_TOKEN,
        project: 'alfresco-content-app',
        launch,
        includeTestSteps: true,
        restClientConfig: {
            timeout: timeouts.extendedTest
        },
        attributes,
        description: `[Run on GitHub Actions ${env.GITHUB_RUN_ID}](${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID})`
    };
};

export const getReporter = (): ReporterDescription[] =>
    env.CI
        ? [['@reportportal/agent-js-playwright', getReportPortalConfig()], ['github']]
        : [['html', { outputFolder: paths.report, open: 'on-failure' }]];
