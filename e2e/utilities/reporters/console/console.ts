/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { log } from './console-logger';

const errors = [];

export const consoleReporter = {
    jasmineStarted(suiteInfo) {
        log.blank().info(
            `Running ${suiteInfo.totalSpecsDefined} tests`,
            { bold: true, title: true }
        ).blank();
    },

    suiteStarted(suite) {
        log.info(suite.description).indent();
    },

    specDone: (spec) => {
        const {
            status,
            description,
            failedExpectations
        } = spec;

        if (status === 'passed') {
            log.success(`∙ ${description}`);
        }

        if (status === 'failed') {
            log.error(`✕ ${description}`, { bold: true });

            errors.push(spec);

            failedExpectations.forEach((failed) => {
                log.error(`  ${failed.message}`);
            });
        }
    },

    suiteDone: (result) => {
        log.unindent();
    },

    jasmineDone: (result) => {
        if (!!errors.length) {
            log .blank()
                .blank()
                .info(`${errors.length} failing tests`, { bold: true, title: true });

            errors.forEach(error => {
                log .blank()
                    .error(`✕ ${error.fullName}`, { bold: true });

                error.failedExpectations.forEach(failed => {
                    log .info(`${failed.message}`)
                        .blank()
                        .error(`${failed.stack}`);
                });
            });
        } else {
            log.success(`All tests passed!`, { bold: true });
        }

        log.blank().blank();
    }
};
