/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import commander, { program } from 'commander';
import * as inquirer from 'inquirer';
import { BooleanParam } from './boolean-param';
import { InputParam } from './input-param';
import { ListParam } from './list-param';
import { CheckboxParam } from './checkbox-param';
import * as logger from '../../tools/helpers/logger';

export type CliParam = ListParam | InputParam | BooleanParam | CheckboxParam;

export class CliReader {
  private program: commander.Command;

  constructor(name: string, usage: string, description: string, version: string) {
    this.program = program;

    this.program
      .name(name)
      .usage(usage)
      .description(description)
      .version(version)
      .option('-d, --debug <level>', 'Set the output information level (silly, debug, verbose, info, warn, error)', 'info');
  }

  *getReader(params: CliParam[], cliArgs: string[]): Generator {
    params.forEach((param) => {
      program.option.apply(this.program, param.commanderOption);
    });
    this.program.parse(cliArgs);
    logger.level = this.program.debug;

    const commanderParams = params
      .filter((param) => this.program[param.name] !== undefined)
      .reduce((paramsAcc, param) => ({ ...paramsAcc, [param.name]: this.program[param.name] }), {});

    yield commanderParams;

    let unsetRequiredParams;
    if (Object.keys(commanderParams).length) {
      unsetRequiredParams = params.filter((param) => param.isRequired && this.program[param.name] === undefined).map((param) => param.inquirerOption);
    } else {
      unsetRequiredParams = params.map((param) => param.inquirerOption);
    }

    return yield inquirer.prompt(unsetRequiredParams).then((inquiredParams) => ({ ...commanderParams, ...inquiredParams }));
  }
}
