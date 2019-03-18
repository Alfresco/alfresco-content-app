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

    unindent() {
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
