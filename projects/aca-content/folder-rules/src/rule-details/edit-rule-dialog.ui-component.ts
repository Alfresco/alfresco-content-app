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

import { Component, EventEmitter, Inject, Output, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Rule } from '../model/rule.model';
import { Observable } from 'rxjs';
import { ActionDefinitionTransformed } from '../model/rule-action.model';
import { ActionParameterConstraint } from '../model/action-parameter-constraint.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RuleDetailsUiComponent } from './rule-details.ui-component';

export interface EditRuleDialogOptions {
  model?: Partial<Rule>;
  nodeId?: string;
  actionDefinitions$?: Observable<ActionDefinitionTransformed[]>;
  parameterConstraints$?: Observable<ActionParameterConstraint[]>;
}

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, MatDialogModule, MatButtonModule, MatIconModule, RuleDetailsUiComponent],
  selector: 'aca-edit-rule-dialog',
  templateUrl: './edit-rule-dialog.ui-component.html',
  styleUrls: ['./edit-rule-dialog.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-edit-rule-dialog' }
})
export class EditRuleDialogUiComponent {
  formValid = false;
  model: Partial<Rule>;
  nodeId = '';
  actionDefinitions$;
  parameterConstraints$;
  formValue: Partial<Rule>;
  @Output() submitted = new EventEmitter<Partial<Rule>>();

  title = 'ACA_FOLDER_RULES.EDIT_RULE_DIALOG.' + (this.isUpdateMode ? 'UPDATE_TITLE' : 'CREATE_TITLE');
  submitLabel = 'ACA_FOLDER_RULES.EDIT_RULE_DIALOG.' + (this.isUpdateMode ? 'UPDATE' : 'CREATE');

  constructor(@Inject(MAT_DIALOG_DATA) public data: EditRuleDialogOptions) {
    this.model = this.data?.model || {};
    this.nodeId = this.data?.nodeId;
    this.actionDefinitions$ = this.data?.actionDefinitions$;
    this.parameterConstraints$ = this.data?.parameterConstraints$;
  }

  get isUpdateMode(): boolean {
    return !!this.data?.model?.id;
  }
  onSubmit() {
    this.submitted.emit(this.formValue);
  }

  onFormValidChange(isValid: boolean) {
    // setTimeout needed to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.formValid = isValid;
    }, 0);
  }
}
