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

import { Component, forwardRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RuleSimpleCondition } from '../../model/rule-simple-condition.model';
import { RuleConditionField, ruleConditionFields } from './rule-condition-fields';
import { RuleConditionComparator, ruleConditionComparators } from './rule-condition-comparators';

@Component({
  selector: 'aca-rule-simple-condition',
  templateUrl: './rule-simple-condition.ui-component.html',
  styleUrls: ['./rule-simple-condition.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-simple-condition' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => RuleSimpleConditionUiComponent)
    }
  ]
})
export class RuleSimpleConditionUiComponent implements ControlValueAccessor, OnDestroy {
  readonly fields = ruleConditionFields;

  form = new FormGroup({
    field: new FormControl('cm:name'),
    comparator: new FormControl('equals'),
    parameter: new FormControl()
  });

  private formSubscription = this.form.valueChanges.subscribe((value) => {
    this.onChange(value);
    this.onTouch();
  });

  get selectedField(): RuleConditionField {
    return this.fields.find((field) => field.name === this.form.get('field').value);
  }
  get selectedFieldComparators(): RuleConditionComparator[] {
    return ruleConditionComparators.filter((comparator) => Object.keys(comparator.labels).includes(this.selectedField.type));
  }
  get isComparatorHidden(): boolean {
    return this.selectedField?.type === 'special';
  }
  get comparatorControl(): AbstractControl {
    return this.form.get('comparator');
  }

  onChange: (condition: RuleSimpleCondition) => void = () => undefined;
  onTouch: () => void = () => undefined;

  writeValue(value: RuleSimpleCondition) {
    this.form.setValue(value);
  }

  registerOnChange(fn: () => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  onChangeField() {
    if (!this.selectedFieldComparators.find((comparator) => comparator.name === this.comparatorControl.value)) {
      this.comparatorControl.setValue('equals');
    }
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }
}
