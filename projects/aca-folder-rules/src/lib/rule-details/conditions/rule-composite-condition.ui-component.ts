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

import { Component, forwardRef, HostBinding, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { RuleCompositeCondition } from '../../model/rule-composite-condition.model';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RuleSimpleCondition } from '../../model/rule-simple-condition.model';

@Component({
  selector: 'aca-rule-composite-condition',
  templateUrl: './rule-composite-condition.ui-component.html',
  styleUrls: ['./rule-composite-condition.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-composite-condition' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => RuleCompositeConditionUiComponent)
    }
  ]
})
export class RuleCompositeConditionUiComponent implements ControlValueAccessor, OnDestroy {
  @HostBinding('class.secondaryBackground')
  @Input()
  secondaryBackground = false;
  @HostBinding('class.childCompositeCondition')
  @Input()
  childCondition = false;

  form = new FormGroup({
    inverted: new FormControl(),
    booleanMode: new FormControl(),
    compositeConditions: new FormArray([]),
    simpleConditions: new FormArray([])
  });

  private _readOnly = false;
  @Input()
  get readOnly(): boolean {
    return this._readOnly;
  }
  set readOnly(isReadOnly: boolean) {
    this.setDisabledState(isReadOnly);
  }

  private formSubscription = this.form.valueChanges.subscribe((value: any) => {
    this.onChange(value);
    this.onTouch();
  });

  get invertedControl(): FormControl {
    return this.form.get('inverted') as FormControl;
  }
  get booleanModeControl(): FormControl {
    return this.form.get('booleanMode') as FormControl;
  }
  get compositeConditionsFormArray(): FormArray {
    return this.form.get('compositeConditions') as FormArray;
  }
  get simpleConditionsFormArray(): FormArray {
    return this.form.get('simpleConditions') as FormArray;
  }
  get conditionFormControls(): FormControl[] {
    return [...(this.compositeConditionsFormArray.controls as FormControl[]), ...(this.simpleConditionsFormArray.controls as FormControl[])];
  }
  get hasNoConditions(): boolean {
    return this.conditionFormControls.length === 0;
  }

  onChange: (condition: RuleCompositeCondition) => void = () => undefined;
  onTouch: () => void = () => undefined;

  writeValue(value: RuleCompositeCondition) {
    this.form.get('inverted').setValue(value.inverted);
    this.form.get('booleanMode').setValue(value.booleanMode);
    this.form.setControl('compositeConditions', new FormArray(value.compositeConditions.map((condition) => new FormControl(condition))));
    this.form.setControl('simpleConditions', new FormArray(value.simpleConditions.map((condition) => new FormControl(condition))));
  }

  registerOnChange(fn: () => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this._readOnly = true;
      this.form.disable();
    } else {
      this._readOnly = false;
      this.form.enable();
    }
  }

  setInverted(value: boolean) {
    this.invertedControl.setValue(value);
  }

  setBooleanMode(value: 'and' | 'or') {
    this.booleanModeControl.setValue(value);
  }

  isFormControlSimpleCondition(control: FormControl): boolean {
    return control.value.hasOwnProperty('field');
  }

  removeCondition(control: FormControl) {
    const formArray = this.isFormControlSimpleCondition(control) ? this.simpleConditionsFormArray : this.compositeConditionsFormArray;
    const index = (formArray.value as FormControl[]).indexOf(control.value);
    formArray.removeAt(index);
  }

  addSimpleCondition() {
    const newCondition: RuleSimpleCondition = {
      field: 'cm:name',
      comparator: 'equals',
      parameter: ''
    };
    this.simpleConditionsFormArray.push(new FormControl(newCondition));
  }

  addCompositeCondition() {
    const newCondition: RuleCompositeCondition = {
      inverted: false,
      booleanMode: 'and',
      compositeConditions: [],
      simpleConditions: []
    };
    this.compositeConditionsFormArray.push(new FormControl(newCondition));
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }
}
