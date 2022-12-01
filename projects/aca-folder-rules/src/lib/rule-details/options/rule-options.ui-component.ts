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
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { RuleOptions } from '../../model/rule.model';
import { ActionParameterConstraint, ConstraintValue } from '../../model/action-parameter-constraint.model';

@Component({
  selector: 'aca-rule-options',
  templateUrl: 'rule-options.ui-component.html',
  styleUrls: ['rule-options.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-options' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => RuleOptionsUiComponent)
    }
  ]
})
export class RuleOptionsUiComponent implements ControlValueAccessor, OnDestroy {
  form = new FormGroup({
    isDisabled: new FormControl(),
    isInheritable: new FormControl(),
    isAsynchronous: new FormControl(),
    errorScript: new FormControl()
  });

  formSubscription = this.form.valueChanges.subscribe((value: any) => {
    this.onChange({
      isEnabled: !value.isDisabled,
      isInheritable: value.isInheritable,
      isAsynchronous: value.isAsynchronous,
      errorScript: value.errorScript ?? ''
    });
    this.onTouch();
  });

  hideErrorScriptDropdown = true;

  @Input()
  errorScriptConstraint: ActionParameterConstraint;

  @HostBinding('class.read-only')
  readOnly = false;

  onChange: (options: RuleOptions) => void = () => undefined;
  onTouch: () => void = () => undefined;

  get isAsynchronousChecked(): boolean {
    return this.form.get('isAsynchronous').value;
  }
  get isInheritableChecked(): boolean {
    return this.form.get('isInheritable').value;
  }

  get errorScriptOptions(): ConstraintValue[] {
    return this.errorScriptConstraint?.constraints ?? [];
  }

  writeValue(options: RuleOptions) {
    const isAsynchronousFormControl = this.form.get('isAsynchronous');
    const errorScriptFormControl = this.form.get('errorScript');
    this.form.get('isDisabled').setValue(!options.isEnabled);
    this.form.get('isInheritable').setValue(options.isInheritable);
    this.form.get('isAsynchronous').setValue(options.isAsynchronous);
    errorScriptFormControl.setValue(options.errorScript ?? '');
    if (isAsynchronousFormControl.value) {
      this.hideErrorScriptDropdown = false;
      errorScriptFormControl.enable();
    } else {
      this.hideErrorScriptDropdown = true;
      errorScriptFormControl.disable();
    }
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
      this.readOnly = true;
    } else {
      this.form.enable();
      this.readOnly = false;
    }
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  toggleErrorScriptDropdown(value: MatCheckboxChange) {
    const formControl: AbstractControl = this.form.get('errorScript');
    if (value.checked) {
      this.hideErrorScriptDropdown = false;
      formControl.enable();
    } else {
      this.hideErrorScriptDropdown = true;
      formControl.disable();
    }
  }
}
