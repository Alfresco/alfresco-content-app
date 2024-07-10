/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { TranslationService } from '@alfresco/adf-core';
import { ExtensionService, provideExtensionConfig } from '@alfresco/adf-extensions';
import { NgModule } from '@angular/core';
import * as rules from './folder-rules.rules';
import { RouterModule, Routes } from '@angular/router';
import { EditRuleDialogUiComponent } from './rule-details/edit-rule-dialog.ui-component';
import { ManageRulesSmartComponent } from './manage-rules/manage-rules.smart-component';
import { RuleCompositeConditionUiComponent } from './rule-details/conditions/rule-composite-condition.ui-component';
import { RuleDetailsUiComponent } from './rule-details/rule-details.ui-component';
import { RuleSimpleConditionUiComponent } from './rule-details/conditions/rule-simple-condition.ui-component';
import { RuleListItemUiComponent } from './rule-list/rule-list-item/rule-list-item.ui-component';
import { RuleListGroupingUiComponent } from './rule-list/rule-list-grouping/rule-list-grouping.ui-component';
import { RuleTriggersUiComponent } from './rule-details/triggers/rule-triggers.ui-component';
import { RuleOptionsUiComponent } from './rule-details/options/rule-options.ui-component';
import { RuleActionListUiComponent } from './rule-details/actions/rule-action-list.ui-component';
import { RuleActionUiComponent } from './rule-details/actions/rule-action.ui-component';
import { RuleListUiComponent } from './rule-list/rule-list/rule-list.ui-component';
import { RuleSetPickerSmartComponent } from './rule-set-picker/rule-set-picker.smart-component';
import { PluginEnabledGuard } from '@alfresco/aca-shared';

const routes: Routes = [
  {
    path: 'rules',
    component: ManageRulesSmartComponent,
    canActivate: [PluginEnabledGuard],
    data: {
      plugin: 'plugins.folderRules'
    }
  }
];

@NgModule({
  providers: [provideExtensionConfig(['folder-rules.plugin.json'])],
  imports: [
    RouterModule.forChild(routes),
    RuleListItemUiComponent,
    RuleListGroupingUiComponent,
    RuleListUiComponent,
    ManageRulesSmartComponent,
    RuleSetPickerSmartComponent,
    RuleActionListUiComponent,
    RuleActionUiComponent,
    RuleCompositeConditionUiComponent,
    RuleSimpleConditionUiComponent,
    RuleOptionsUiComponent,
    RuleTriggersUiComponent,
    RuleDetailsUiComponent,
    EditRuleDialogUiComponent
  ]
})
export class AcaFolderRulesModule {
  constructor(translation: TranslationService, extensions: ExtensionService) {
    translation.addTranslationFolder('folder-rules', 'assets/folder-rules');

    extensions.setEvaluators({
      'rules.canManageFolderRules': rules.canManageFolderRules
    });
  }
}
