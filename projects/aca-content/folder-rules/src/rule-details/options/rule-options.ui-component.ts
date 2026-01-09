/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, forwardRef, HostBinding, Input, OnChanges, OnDestroy, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { RuleOptions } from '../../model/rule.model';
import { ActionParameterConstraint, ConstraintValue } from '../../model/action-parameter-constraint.model';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  imports: [CommonModule, TranslatePipe, ReactiveFormsModule, MatCheckboxModule, MatFormFieldModule, MatSelectModule],
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
export class RuleOptionsUiComponent implements ControlValueAccessor, OnChanges, OnDestroy {
  form = new FormGroup({
    isDisabled: new FormControl(),
    isInheritable: new FormControl(),
    isAsynchronous: new FormControl(),
    errorScript: new FormControl()
  });

  formSubscription = this.form.valueChanges.subscribe((value: any) => {
    const formValue = { ...this.form.value, ...value };
    this.isAsynchronousChecked = value.isAsynchronous;
    this.isInheritableChecked = value.isInheritable;
    this.onChange({
      isEnabled: !formValue.isDisabled,
      isInheritable: formValue.isInheritable,
      isAsynchronous: formValue.isAsynchronous,
      errorScript: formValue.errorScript ?? ''
    });
    this.onTouch();
  });

  hideErrorScriptDropdown = true;

  @Input() ariaLabelledBy = 'rule-options-label';

  @Input()
  errorScriptConstraint: ActionParameterConstraint;

  @HostBinding('class.aca-read-only')
  readOnly = false;

  onChange: (options: RuleOptions) => void = () => undefined;
  onTouch: () => void = () => undefined;

  isAsynchronousChecked = false;
  isInheritableChecked = false;

  errorScriptOptions: ConstraintValue[] = [];

  writeValue(options: RuleOptions) {
    this.form.setValue(
      {
        isDisabled: !options.isEnabled,
        isAsynchronous: options.isAsynchronous,
        isInheritable: options.isInheritable,
        errorScript: options.errorScript ?? ''
      },
      { emitEvent: false }
    );
    this.isAsynchronousChecked = options.isAsynchronous;
    this.isInheritableChecked = options.isInheritable;
    this.hideErrorScriptDropdown = !this.isAsynchronousChecked;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['errorScriptConstraint']) {
      this.errorScriptOptions = this.errorScriptConstraint?.constraints ?? [];
    }
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  toggleErrorScriptDropdown(value: MatCheckboxChange) {
    this.hideErrorScriptDropdown = !value.checked;
  }
}
