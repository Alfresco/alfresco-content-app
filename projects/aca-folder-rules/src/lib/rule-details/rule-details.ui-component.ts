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

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Rule } from '../model/rule.model';
import { ruleCompositeConditionValidator } from './validators/rule-composite-condition.validator';
import { FolderRulesService } from '../services/folder-rules.service';
import { ActionDefinitionTransformed } from '../model/rule-action.model';
import { ruleActionsValidator } from './validators/rule-actions.validator';
import { Aspect } from '../model/aspect.model';

@Component({
  selector: 'aca-rule-details',
  templateUrl: './rule-details.ui-component.html',
  styleUrls: ['./rule-details.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-details' }
})
export class RuleDetailsUiComponent implements OnInit, OnDestroy {
  private _readOnly = false;
  @Input()
  get readOnly(): boolean {
    return this._readOnly;
  }
  set readOnly(value: boolean) {
    this._readOnly = value;
    if (this.form?.disable) {
      if (value) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }
  }
  private _initialValue: Partial<Rule> = FolderRulesService.emptyRule;
  @Input()
  get value(): Partial<Rule> {
    return this.form ? this.form.value : this._initialValue;
  }
  set value(newValue: Partial<Rule>) {
    newValue = {
      id: newValue.id || FolderRulesService.emptyRule.id,
      name: newValue.name || FolderRulesService.emptyRule.name,
      description: newValue.description || FolderRulesService.emptyRule.description,
      triggers: newValue.triggers || FolderRulesService.emptyRule.triggers,
      conditions: newValue.conditions || FolderRulesService.emptyRule.conditions,
      isAsynchronous: newValue.isAsynchronous || FolderRulesService.emptyRule.isAsynchronous,
      errorScript: newValue.errorScript || FolderRulesService.emptyRule.errorScript,
      isInheritable: newValue.isInheritable || FolderRulesService.emptyRule.isInheritable,
      isEnabled: typeof newValue.isInheritable == 'boolean' ? newValue.isEnabled : FolderRulesService.emptyRule.isEnabled,
      actions: newValue.actions || FolderRulesService.emptyRule.actions
    };
    if (this.form) {
      this.form.setValue(newValue);
    } else {
      this._initialValue = newValue;
    }
  }
  @Input()
  preview: boolean;
  @Input()
  actionDefinitions: ActionDefinitionTransformed[] = [];
  @Input()
  aspects: Aspect[] = [];

  @Output()
  formValidationChanged = new EventEmitter<boolean>();
  @Output()
  formValueChanged = new EventEmitter<Partial<Rule>>();

  private onDestroy$ = new Subject();
  form: UntypedFormGroup;

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
  get isAsynchronous(): UntypedFormControl {
    return this.form.get('isAsynchronous') as UntypedFormControl;
  }
  get errorScript(): UntypedFormControl {
    return this.form.get('errorScript') as UntypedFormControl;
  }
  get isInheritable(): UntypedFormControl {
    return this.form.get('isInheritable') as UntypedFormControl;
  }
  get isEnabled(): UntypedFormControl {
    return this.form.get('isEnabled') as UntypedFormControl;
  }

  ngOnInit() {
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
      isAsynchronous: new UntypedFormControl(this.value.isAsynchronous),
      errorScript: new UntypedFormControl(this.value.errorScript),
      isInheritable: new UntypedFormControl(this.value.isInheritable),
      isEnabled: new UntypedFormControl(this.value.isEnabled),
      actions: new UntypedFormControl(this.value.actions, [Validators.required, ruleActionsValidator(this.actionDefinitions)])
    });
    this.readOnly = this._readOnly;

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

    this.form.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((newFormValue: any) => {
      this.formValueChanged.emit(newFormValue);
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  getErrorMessage(control: AbstractControl): string {
    if (this.readOnly) {
      return '';
    }
    if (control.hasError('required')) {
      return control === this.triggers
        ? 'ACA_FOLDER_RULES.RULE_DETAILS.ERROR.INSUFFICIENT_TRIGGERS_SELECTED'
        : 'ACA_FOLDER_RULES.RULE_DETAILS.ERROR.REQUIRED';
    } else if (control.hasError('ruleCompositeConditionInvalid')) {
      return 'ACA_FOLDER_RULES.RULE_DETAILS.ERROR.RULE_COMPOSITE_CONDITION_INVALID';
    }
    return '';
  }

  getPlaceholder(fieldName: string): string {
    let str = 'ACA_FOLDER_RULES.RULE_DETAILS.PLACEHOLDER.';
    switch (fieldName) {
      case 'name':
        str += 'NAME';
        break;
      case 'description':
        str += this.readOnly ? 'NO_DESCRIPTION' : 'DESCRIPTION';
        break;
      default:
        return '';
    }
    return str;
  }
}
