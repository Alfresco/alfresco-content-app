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
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Rule } from '../model/rule.model';

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
  @Input()
  initialValue: Partial<Rule> = {};

  @Output()
  formValidationChanged = new EventEmitter<boolean>();
  @Output()
  formValueChanged = new EventEmitter<Partial<Rule>>();

  private onDestroy$ = new Subject();
  form: FormGroup;

  get name(): AbstractControl {
    return this.form.get('name');
  }

  get description(): AbstractControl {
    return this.form.get('description');
  }

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [this.initialValue.name || '', Validators.required],
      description: [this.initialValue.description || '']
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
    if (control.hasError('required')) {
      return 'ACA_FOLDER_RULES.RULE_DETAILS.ERROR.REQUIRED';
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
