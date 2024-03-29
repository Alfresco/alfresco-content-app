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

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Rule, RuleForForm } from '../model/rule.model';
import { ruleCompositeConditionValidator } from './validators/rule-composite-condition.validator';
import { FolderRulesService } from '../services/folder-rules.service';
import { ActionDefinitionTransformed } from '../model/rule-action.model';
import { ruleActionsValidator } from './validators/rule-actions.validator';
import { ActionParameterConstraint } from '../model/action-parameter-constraint.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RuleTriggersUiComponent } from './triggers/rule-triggers.ui-component';
import { RuleCompositeConditionUiComponent } from './conditions/rule-composite-condition.ui-component';
import { RuleActionListUiComponent } from './actions/rule-action-list.ui-component';
import { RuleOptionsUiComponent } from './options/rule-options.ui-component';
import { CategoryService } from '@alfresco/adf-content-services';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RuleTriggersUiComponent,
    RuleCompositeConditionUiComponent,
    RuleActionListUiComponent,
    RuleOptionsUiComponent
  ],
  selector: 'aca-rule-details',
  templateUrl: './rule-details.ui-component.html',
  styleUrls: ['./rule-details.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-details' }
})
export class RuleDetailsUiComponent implements OnInit, OnDestroy {
  @Input()
  readOnly: boolean;

  descriptionPlaceHolder: string;

  private _initialValue: RuleForForm = FolderRulesService.emptyRuleForForm;
  @Input()
  get value(): Partial<Rule> {
    let value = this.form ? this.form.value : this._initialValue;
    if (value.options) {
      value = {
        ...value,
        ...(value.options ?? FolderRulesService.emptyRuleOptions)
      };
      delete value.options;
    }
    return value;
  }
  set value(newValue: Partial<Rule>) {
    const newValueForForm: RuleForForm = {
      id: newValue.id || FolderRulesService.emptyRule.id,
      name: newValue.name || FolderRulesService.emptyRule.name,
      description: newValue.description || FolderRulesService.emptyRule.description,
      triggers: newValue.triggers || FolderRulesService.emptyRule.triggers,
      conditions: newValue.conditions || FolderRulesService.emptyRule.conditions,
      actions: newValue.actions || FolderRulesService.emptyRule.actions,
      options: {
        isEnabled: typeof newValue.isInheritable == 'boolean' ? newValue.isEnabled : FolderRulesService.emptyRule.isEnabled,
        isInheritable: newValue.isInheritable || FolderRulesService.emptyRule.isInheritable,
        isAsynchronous: newValue.isAsynchronous || FolderRulesService.emptyRule.isAsynchronous,
        errorScript: newValue.errorScript || FolderRulesService.emptyRule.errorScript
      }
    };
    if (this.form) {
      this.form.setValue(newValueForForm);
    } else {
      this._initialValue = newValueForForm;
    }
  }
  @Input()
  preview: boolean;
  @Input()
  actionDefinitions: ActionDefinitionTransformed[] = [];
  @Input()
  parameterConstraints: ActionParameterConstraint[] = [];
  @Input()
  nodeId = '';

  @Output()
  formValidationChanged = new EventEmitter<boolean>();
  @Output()
  formValueChanged = new EventEmitter<Partial<Rule>>();

  private onDestroy$ = new Subject();
  form: UntypedFormGroup;

  errorScriptConstraint: ActionParameterConstraint;
  get name(): UntypedFormControl {
    return this.form.get('name') as UntypedFormControl;
  }
  get description(): UntypedFormControl {
    return this.form.get('description') as UntypedFormControl;
  }
  get triggers(): UntypedFormControl {
    return this.form.get('triggers') as UntypedFormControl;
  }

  get conditions(): UntypedFormControl {
    return this.form.get('conditions') as UntypedFormControl;
  }

  get showOptionsSection(): boolean {
    return !this.readOnly || this.value.isAsynchronous || this.value.isInheritable;
  }

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    const disabledCategory = !this.categoryService.areCategoriesEnabled();
    this.actionDefinitions = this.actionDefinitions.filter((action) => !(disabledCategory && action.id === 'link-category'));
    this.form = new UntypedFormGroup({
      id: new UntypedFormControl(this.value.id),
      name: new UntypedFormControl(this.value.name || '', Validators.required),
      description: new UntypedFormControl(this.value.description || ''),
      triggers: new UntypedFormControl(this.value.triggers || ['inbound'], Validators.required),
      conditions: new UntypedFormControl(
        this.value.conditions || {
          inverted: false,
          booleanMode: 'and',
          compositeConditions: [],
          simpleConditions: []
        },
        ruleCompositeConditionValidator()
      ),
      actions: new UntypedFormControl(this.value.actions, [Validators.required, ruleActionsValidator(this.actionDefinitions)]),
      options: new UntypedFormControl({
        isEnabled: this.value.isEnabled,
        isInheritable: this.value.isInheritable,
        isAsynchronous: this.value.isAsynchronous,
        errorScript: this.value.errorScript
      })
    });

    this.form.statusChanges
      .pipe(
        map(() => this.form.valid),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$)
      )
      .subscribe((value: boolean) => {
        this.formValidationChanged.emit(value);
      });
    this.formValidationChanged.emit(this.form.valid);

    this.form.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.formValueChanged.emit(this.value);
    });

    if (this.readOnly) {
      this.form.disable();
    } else {
      this.form.enable();
    }

    this.descriptionPlaceHolder = this.readOnly
      ? 'ACA_FOLDER_RULES.RULE_DETAILS.PLACEHOLDER.NO_DESCRIPTION'
      : 'ACA_FOLDER_RULES.RULE_DETAILS.PLACEHOLDER.DESCRIPTION';

    this.errorScriptConstraint = this.parameterConstraints.find(
      (parameterConstraint: ActionParameterConstraint) => parameterConstraint.name === 'script-ref'
    );
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
