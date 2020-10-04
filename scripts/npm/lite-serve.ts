/*
 * Copyright 2005-2019 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { getApps } from './helpers/project-selectors';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { spawn } from 'child_process';
import { yellow, green, red } from 'chalk';
import { ListParam, ComplexListChoice } from 'clireader/list-param';
import { CheckboxParam } from '../clireader/checkbox-param';
import { CliReader, CliParam } from 'clireader/cli-reader';
import * as logger from '../../tools/helpers/logger';
import * as ora from 'ora';

require('dotenv').config({ path: process.env.ENV_FILE });
const API_HOST = process.env.API_HOST;
const API_CONTENT_HOST = process.env.API_CONTENT_HOST;
const OAUTH_HOST = process.env.OAUTH_HOST;
const IDENTITY_HOST = process.env.IDENTITY_HOST;
const NOTIFICATION_LAST = process.env.NOTIFICATION_LAST;

interface LiteServeRunnerInputs {
  app: string;
  configRewrite: string[];
}

export default class LiteServeRunner {
  private cliReader: CliReader;
  private inputParams: CliParam[];

  constructor(private cliArgs: any[]) {
    this.cliReader = new CliReader('lite-serve', '[options]', 'Start lite-serve for previously built app', '0.0.1');

    this.inputParams = [
      new ListParam({
        name: 'app',
        alias: 'a',
        title: `Which ${yellow('prebuilt')} application to serve with lite-serve?`,
        required: true,
        choices: this.getAppList.bind(this),
        pageSize: 30
      }),
      new CheckboxParam({
        name: 'configRewrite',
        alias: 'c',
        title: 'Rewrite app.config.json with the following environment vars?',
        required: false,
        choices: this.getEnvVarChoices.bind(this)
      })
    ];
  }

  run() {
    const readerGenerator = this.cliReader.getReader(this.inputParams, this.cliArgs);
    readerGenerator.next();

    const builtApps = this.getAppList().filter((app) => !app.disabled);
    if (!builtApps.length) {
      logger.error('No prebuilt app found.');
      process.exit(0);
    }

    const inputInquirer = readerGenerator.next().value as Promise<Object>;

    return inputInquirer.then(this.appConfigReplace.bind(this)).then(this.spawnLiteServer.bind(this)).catch(logger.error.bind(logger));
  }

  private appConfigReplace(inputParams: LiteServeRunnerInputs) {
    return new Promise((resolvePromise, reject) => {
      if (!inputParams['configRewrite'] || !inputParams['configRewrite'].length) {
        logger.verbose(green('No rewrite has been made'));
        resolvePromise(inputParams);
        return;
      }

      let appPath = getApps()
        .filter((app) => app.name === inputParams.app)
        .map((project) => this.getOutputPath(project))[0];
      appPath = resolve(appPath, 'app.config.json');
      const rewriteFlags = `-${inputParams['configRewrite'].join('')}`;

      const spinner = ora(`Rewriting ${appPath} with flags: ${rewriteFlags}`).start();
      const replace = spawn(process.cwd() + '/scripts/app-config-replace.js', [`--config=${appPath}`, rewriteFlags]);

      replace.stdout.on('data', (data) => logger.verbose(data.toString()));
      replace.stderr.on('data', (data) => {
        logger.error(data.toString());
        reject();
      });
      replace.on('exit', () => {
        spinner.succeed();
        logger.verbose(green(`Rewrite ${appPath} succeeded!`));
        resolvePromise(inputParams);
      });
    });
  }

  private spawnLiteServer(inputParams: LiteServeRunnerInputs) {
    const spinner = ora(`Starting lite-serve, please wait and don't move!`).start();

    return new Promise((resolvePromise, reject) => {
      const liteServe = spawn('npm', ['run', '--quiet', 'ng', 'run', `${inputParams.app}:lite-serve:standalone`]);
      process.on('SIGINT', () => {
        liteServe.kill('SIGINT');
        spinner.text = red('Lite-serve terminated.');
        spinner.fail();
      });

      liteServe.stdout.on('data', (data) => {
        if (data.toString().includes(`lite-serve serving folder`)) {
          spinner.text = green('Lite-serve is running.');
        }
        logger.verbose(data.toString());
      });
      liteServe.stderr.on('data', (data) => {
        logger.error(data.toString());
        reject();
      });
      liteServe.on('exit', (code) => {
        logger.verbose('Lite-serve process exited with code ' + code.toString());
        resolvePromise();
      });
    });
  }

  private getOutputPath(project) {
    return resolve(process.cwd(), project.architect.build.options.outputPath);
  }

  private getAppList(): ComplexListChoice[] {
    return getApps().map((project) => {
      if (existsSync(this.getOutputPath(project))) {
        return {
          name: project.name,
          disabled: false
        };
      }
      return {
        name: `${project.name} (not built)`,
        disabled: true
      };
    });
  }

  private getEnvVarChoices() {
    const choices = [];

    if (API_HOST !== undefined || API_CONTENT_HOST !== undefined) {
      choices.push({
        name: `API_HOST=${API_HOST} && API_CONTENT_HOST=${API_CONTENT_HOST || API_HOST}`,
        value: 'a',
        short: 'API_HOST',
        checked: true
      });
    }

    if (OAUTH_HOST !== undefined) {
      choices.push({
        name: `OAUTH_HOST=${OAUTH_HOST} ${red('+ authType=OAUTH also!!!')}`,
        value: 'o',
        short: 'OAUTH_HOST',
        checked: true
      });
    }

    if (IDENTITY_HOST !== undefined) {
      choices.push({
        name: `IDENTITY_HOST=${IDENTITY_HOST} ${red('+ authType=OAUTH also!!!')}`,
        value: 'i',
        short: 'IDENTITY_HOST',
        checked: true
      });
    }

    if (NOTIFICATION_LAST !== undefined) {
      choices.push({
        name: `NOTIFICATION_LAST=${NOTIFICATION_LAST}`,
        value: 'n',
        short: 'NOTIFICATION_LAST',
        checked: true
      });
    }

    return choices;
  }
}
