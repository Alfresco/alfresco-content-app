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

import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  forwardRef,
  HostBinding,
  inject,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RuleCompositeCondition } from '../../model/rule-composite-condition.model';
import { ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { RuleSimpleCondition } from '../../model/rule-simple-condition.model';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RuleSimpleConditionUiComponent } from './rule-simple-condition.ui-component';
import { FocusTrapFactory } from '@angular/cdk/a11y';

@Component({
  imports: [
    CommonModule,
    TranslatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RuleSimpleConditionUiComponent
  ],
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
export class RuleCompositeConditionUiComponent implements ControlValueAccessor, OnChanges, AfterViewInit {
  @HostBinding('class.aca-secondaryBackground')
  @Input()
  secondaryBackground = false;

  @HostBinding('class.aca-childCompositeCondition')
  @Input()
  childCondition = false;

  @Input()
  readOnly = false;

  @ViewChildren('conditionRow', { read: ElementRef })
  private readonly conditionRows: QueryList<ElementRef<HTMLElement>>;

  readonly isOrImplemented = false;

  form = new FormGroup({
    inverted: new FormControl(),
    booleanMode: new FormControl({ value: 'and', disabled: !this.isOrImplemented || this.readOnly }),
    compositeConditions: new FormArray([]),
    simpleConditions: new FormArray([])
  });

  public invertedControl = this.form.get('inverted') as FormControl;
  public booleanModeControl = this.form.get('booleanMode') as FormControl;

  private readonly destroyRef = inject(DestroyRef);
  private readonly focusTrapFactory = inject(FocusTrapFactory);

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe((value: RuleCompositeCondition) => {
      this.onChange(value);
      this.onTouch();
    });
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

  ngAfterViewInit(): void {
    this.conditionRows.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.focusLastCondition();
    });
  }

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

  isFormControlSimpleCondition(control: FormControl): boolean {
    // eslint-disable-next-line no-prototype-builtins
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

  ngOnChanges(changes: SimpleChanges) {
    const readOnly = changes['readOnly']?.currentValue;

    if (readOnly !== undefined && readOnly !== null) {
      if (this.readOnly) {
        this.readOnly = true;
        this.form.disable();
      } else {
        this.readOnly = false;
        this.form.enable();
      }
    }
  }

  private focusLastCondition(): void {
    const rows = this.conditionRows.toArray();
    const lastRow = rows[rows.length - 1]?.nativeElement;

    if (!lastRow) {
      return;
    }

    setTimeout(() => {
      const focusTrap = this.focusTrapFactory.create(lastRow);
      focusTrap.focusFirstTabbableElement();
      focusTrap.destroy();
    });
  }
}
