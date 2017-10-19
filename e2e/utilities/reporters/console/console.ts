/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
        log.dedent();
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
