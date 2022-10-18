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

import { Component, EventEmitter, Inject, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rule } from '../model/rule.model';
import { ActionsService } from '../services/actions.service';

export interface EditRuleDialogOptions {
  model?: Partial<Rule>;
}

@Component({
  selector: 'aca-edit-rule-dialog',
  templateUrl: './edit-rule-dialog.smart-component.html',
  styleUrls: ['./edit-rule-dialog.smart-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-edit-rule-dialog' }
})
export class EditRuleDialogSmartComponent implements OnInit {
  formValid = false;
  model: Partial<Rule>;
  formValue: Partial<Rule>;
  @Output() submitted = new EventEmitter<Partial<Rule>>();
  actionDefinitions$ = this.actionsService.actionDefinitionsListing$;
  loading$ = this.actionsService.loading$;
  aspects$ = this.actionsService.aspects$;

  constructor(@Inject(MAT_DIALOG_DATA) public data: EditRuleDialogOptions, private actionsService: ActionsService) {
    this.model = this.data?.model || {};
  }

  get isUpdateMode(): boolean {
    return !!this.data?.model?.id;
  }

  get title(): string {
    return 'ACA_FOLDER_RULES.EDIT_RULE_DIALOG.' + (this.isUpdateMode ? 'UPDATE_TITLE' : 'CREATE_TITLE');
  }

  get submitLabel(): string {
    return 'ACA_FOLDER_RULES.EDIT_RULE_DIALOG.' + (this.isUpdateMode ? 'UPDATE' : 'CREATE');
  }

  onSubmit() {
    this.submitted.emit(this.formValue);
  }

  ngOnInit() {
    this.actionsService.loadAspects();
    this.actionsService.loadActionDefinitions();
  }
}
