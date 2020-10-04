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

import { ParamType } from './params';
import { CommanderOptionParams, BaseParam } from './base-param';

export class BooleanParam extends BaseParam {
  protected type = ParamType.confirm;

  get commanderOption(): CommanderOptionParams {
    const optionParams: CommanderOptionParams = [`-${this.options.alias}, --${this.options.name}`, this.options.title];

    if (this.options.processor !== undefined) {
      optionParams.push(this.options.processor);
    } else {
      optionParams.push((value, previousValue) => {
        return value !== undefined ? !!value : previousValue;
      });
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
      message: this.options.title
    };
  }
}
