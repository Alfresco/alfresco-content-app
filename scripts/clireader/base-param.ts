/*
 * Copyright 2005-2019 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { ParamType } from './params';

export type CommanderProcessor = (arg1: any, arg2: any) => void;
export type CommanderOptionParams = [string, string, CommanderProcessor?, any?];

export interface BaseParamOptions {
  name: string;
  alias: string;
  title: string;
  required: boolean;
  processor?: CommanderProcessor;
  default?: any;
}

export abstract class BaseParam {
  protected type: ParamType;
  constructor(protected options: BaseParamOptions) {}

  abstract get commanderOption(): CommanderOptionParams;

  abstract get inquirerOption(): any;

  get isRequired() {
    return this.options.required;
  }

  get name() {
    return this.options.name;
  }
}
