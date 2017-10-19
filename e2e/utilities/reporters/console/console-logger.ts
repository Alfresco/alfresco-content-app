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

/* tslint:disable */
const chalk = require('chalk');
/* tslint:enable */

export const log = {
    i: 0,

    get indentation(): string {
        return new Array(this.i).fill('   ').join('');
    },

    indent() {
        this.i++;
        return this;
    },

    dedent() {
        this.i--;
        return this;
    },

    log(message: string = '', options: any = { ignoreIndentation: false }) {
        const indentation = (!options.ignoreIndentation)
            ? this.indentation
            : '';

        console.log(`${indentation}${message}`);

        return this;
    },

    blank() {
        return this.log();
    },

    info(message: string = '', options: any = { bold: false, title: false }) {
        const { bold } = options;
        const style = (bold ? chalk.bold : chalk).gray;

        return this.log(style(message), options);
    },

    success(message: string = '', options: any = { bold: false }) {
        const style = options.bold ? chalk.bold.green : chalk.green;

        return this.log(style(message), options);
    },

    error(message: string = '', options: any = { bold: false }) {
        const style = options.bold ? chalk.bold.red : chalk.red;

        return this.log(style(message), options);
    }
};
