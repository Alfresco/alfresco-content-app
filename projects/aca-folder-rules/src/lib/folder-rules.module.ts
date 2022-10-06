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

import { CoreModule, TranslationService } from '@alfresco/adf-core';
import { ExtensionService, ExtensionsModule, provideExtensionConfig } from '@alfresco/adf-extensions';
import { NgModule } from '@angular/core';
import * as rules from './folder-rules.rules';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EditRuleDialogSmartComponent } from './rule-details/edit-rule-dialog.smart-component';
import { ManageRulesSmartComponent } from './manage-rules/manage-rules.smart-component';
import { RuleCompositeConditionUiComponent } from './rule-details/conditions/rule-composite-condition.ui-component';
import { RuleDetailsUiComponent } from './rule-details/rule-details.ui-component';
import { RuleSimpleConditionUiComponent } from './rule-details/conditions/rule-simple-condition.ui-component';
import { GenericErrorModule, PageLayoutModule } from '@alfresco/aca-shared';
import { BreadcrumbModule, DocumentListModule } from '@alfresco/adf-content-services';
import { RuleListItemUiComponent } from './rules-list/rule/rule-list-item.ui-component';
import { RulesListUiComponent } from './rules-list/rules-list.ui-component';
import { RuleTriggersUiComponent } from './rule-details/triggers/rule-triggers.ui-component';
import { RuleOptionsUiComponent } from './rule-details/options/rule-options.ui-component';
import { RuleActionListUiComponent } from './rule-details/actions/rule-action-list.ui-component';
import { RuleActionUiComponent } from './rule-details/actions/rule-action.ui-component';

const routes: Routes = [
  {
    path: 'rules',
    component: ManageRulesSmartComponent
  }
];

@NgModule({
  providers: [provideExtensionConfig(['folder-rules.plugin.json'])],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule.forChild(),
    PageLayoutModule,
    BreadcrumbModule,
    DocumentListModule,
    ExtensionsModule,
    GenericErrorModule
  ],
  declarations: [
    EditRuleDialogSmartComponent,
    ManageRulesSmartComponent,
    RuleActionListUiComponent,
    RuleActionUiComponent,
    RuleCompositeConditionUiComponent,
    RuleDetailsUiComponent,
    RuleSimpleConditionUiComponent,
    RulesListUiComponent,
    RuleListItemUiComponent,
    RuleTriggersUiComponent,
    RuleOptionsUiComponent
  ]
})
export class AcaFolderRulesModule {
  constructor(translation: TranslationService, extensions: ExtensionService) {
    translation.addTranslationFolder('aca-folder-rules', 'assets/aca-folder-rules');

    extensions.setEvaluators({
      'rules.canManageFolderRules': rules.canManageFolderRules
    });
  }
}
