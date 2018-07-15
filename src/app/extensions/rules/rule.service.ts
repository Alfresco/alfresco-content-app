/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { Injectable } from '@angular/core';
import { AppConfigService } from '@alfresco/adf-core';
import { every, some } from './core.evaluators';
import {
    nodeIsFolder,
    nodeHasPermission,
    canUpdateNode
} from './node.evaluators';
import { RuleContext } from './rule-context';
import { RuleRef } from './rule-ref';

export type RuleEvaluator = (context: RuleContext, ...args: any[]) => boolean;

@Injectable()
export class RuleService {
    rules: Array<RuleRef> = [];
    evaluators: { [key: string]: RuleEvaluator } = {};

    constructor(private config: AppConfigService) {
        this.evaluators['core.rules/every'] = every;
        this.evaluators['core.rules/some'] = some;
        this.evaluators['core.rules/nodes.isFolder'] = nodeIsFolder;
        this.evaluators['core.rules/nodes.hasPermission'] = nodeHasPermission;
        this.evaluators['core.rules/nodes.canUpdate'] = canUpdateNode;
    }

    init() {
        this.rules = this.config
            .get<Array<RuleRef>>('extensions.core.rules', [])
            .map(rule => {
                rule.evaluator = this.evaluators[rule.type];
                return rule;
            });
    }

    evaluateRule(ruleId: string, context?: RuleContext): boolean {
        const ruleRef = this.rules.find(ref => ref.id === ruleId);

        if (ruleRef.evaluator) {
            context = Object.assign({
                selection: null,
                evaluators: this.evaluators
            }, context || {});
            return ruleRef.evaluator(context, ...ruleRef.parameters);
        }
        return false;
    }
}
