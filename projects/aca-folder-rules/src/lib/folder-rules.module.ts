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
import { ExtensionService, provideExtensionConfig } from '@alfresco/adf-extensions';
import { NgModule } from '@angular/core';
import * as rules from './folder-rules.rules';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { EditRuleDialogSmartComponent } from './rule-details/edit-rule-dialog.smart-component';
import { ManageRulesSmartComponent } from './manage-rules/manage-rules.smart-component';
import { RuleDetailsUiComponent } from './rule-details/rule-details.ui-component';

const routes: Routes = [
  {
    path: '',
    component: ManageRulesSmartComponent
  }
]

@NgModule({
  providers: [provideExtensionConfig(['folder-rules.plugin.json'])],
  imports: [
    CommonModule,
    CoreModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [EditRuleDialogSmartComponent, ManageRulesSmartComponent, RuleDetailsUiComponent]
})
export class AcaFolderRulesModule {
  constructor(translation: TranslationService, extensions: ExtensionService) {
    translation.addTranslationFolder('aca-folder-rules', 'assets/aca-folder-rules');

    extensions.setEvaluators({
      'rules.canManageFolderRules': rules.canManageFolderRules
    });
  }
}
