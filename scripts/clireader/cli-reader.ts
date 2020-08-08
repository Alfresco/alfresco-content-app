/*
 * Copyright 2005-2019 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
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
