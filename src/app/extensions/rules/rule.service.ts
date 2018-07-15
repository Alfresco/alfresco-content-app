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
import { RuleContext } from './rule-context';
import { RuleRef } from './rule-ref';
import { createSelector, Store } from '@ngrx/store';
import {
    appSelection,
    appNavigation
} from '../../store/selectors/app.selectors';
import { AppStore, SelectionState } from '../../store/states';
import { NavigationState } from '../../store/states/navigation.state';
import { canCreateFolder, hasFolderSelected, canUpdateSelectedFolder, hasFileSelected } from './app.evaluators';

export type RuleEvaluator = (context: RuleContext, ...args: any[]) => boolean;

export const selectionWithFolder = createSelector(
    appSelection,
    appNavigation,
    (selection, navigation) => {
        return {
            selection,
            navigation
        };
    }
);

@Injectable()
export class RuleService implements RuleContext {
    rules: Array<RuleRef> = [];
    evaluators: { [key: string]: RuleEvaluator } = {};
    selection: SelectionState;
    navigation: NavigationState;

    constructor(
        private config: AppConfigService,
        private store: Store<AppStore>
    ) {
        this.evaluators['core.every'] = every;
        this.evaluators['core.some'] = some;
        this.evaluators['app.selection.file'] = hasFileSelected;
        this.evaluators['app.selection.folder'] = hasFolderSelected;
        this.evaluators['app.selection.folder.canUpdate'] = canUpdateSelectedFolder;
        this.evaluators['app.navigation.folder.canCreate'] = canCreateFolder;

        this.store
            .select(selectionWithFolder)
            .subscribe(result => {
                this.selection = result.selection;
                this.navigation = result.navigation;
            });
    }

    init() {
        this.rules = this.config
            .get<Array<RuleRef>>('extensions.core.rules', [])
            .map(rule => {
                rule.evaluator = this.evaluators[rule.type];
                return rule;
            });
    }

    evaluateRule(ruleId: string): boolean {
        const ruleRef = this.rules.find(ref => ref.id === ruleId);

        if (ruleRef.evaluator) {
            return ruleRef.evaluator(this, ...ruleRef.parameters);
        }
        return false;
    }
}
