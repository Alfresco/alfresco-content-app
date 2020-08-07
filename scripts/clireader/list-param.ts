/*
 * Copyright 2005-2019 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { ParamType } from './params';
import { BaseParamOptions, CommanderOptionParams, BaseParam } from './base-param';

export interface ListParamOptions extends BaseParamOptions {
  choices: string[];
  pageSize?: number;
}

export class ListParam extends BaseParam {
  protected type = ParamType.list;

  constructor(protected options: ListParamOptions) {
    super(options);
  }

  get commanderOption(): CommanderOptionParams {
    const optionParams: CommanderOptionParams = [`-${this.options.alias}, --${this.options.name} <${this.options.name}>`, this.options.title];

    if (this.options.processor !== undefined) {
      optionParams.push(this.options.processor);
    }

    if (this.options.default !== undefined) {
      optionParams.push(this.options.default);
    }

    return optionParams;
  }

  get inquirerOption() {
    return {
      type: this.type,
      name: this.options.name,
      message: this.options.title,
      choices: this.options.choices,
      pageSize: this.options.pageSize
    };
  }
}
