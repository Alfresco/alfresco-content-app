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

import { Component, forwardRef, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActionDefinitionTransformed, RuleAction } from '../../model/rule-action.model';
import { Subscription } from 'rxjs';
import { ruleActionValidator } from '../validators/rule-actions.validator';
import { ActionParameterConstraint } from '../../model/action-parameter-constraint.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RuleActionUiComponent } from './rule-action.ui-component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, RuleActionUiComponent, ReactiveFormsModule, MatButtonModule, MatMenuModule, MatIconModule],
  selector: 'aca-rule-action-list',
  templateUrl: './rule-action-list.ui-component.html',
  styleUrls: ['./rule-action-list.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-action-list' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => RuleActionListUiComponent)
    }
  ]
})
export class RuleActionListUiComponent implements ControlValueAccessor, OnDestroy {
  @Input()
  actionDefinitions: ActionDefinitionTransformed[] = [];
  @Input()
  readOnly = false;
  @Input()
  parameterConstraints: ActionParameterConstraint[] = [];
  @Input()
  nodeId = '';

  formArray = new FormArray([]);
  private formArraySubscription: Subscription;

  formControls: FormControl[] = [];

  onChange: (actions: RuleAction[]) => void = () => undefined;
  onTouch: () => void = () => undefined;

  writeValue(actions: RuleAction[]) {
    if (actions.length === 0) {
      actions = [
        {
          actionDefinitionId: null,
          params: {}
        }
      ];
    }
    this.formArray = new FormArray(actions.map((action: RuleAction) => new FormControl(action)));
    this.formControls = this.formArray.controls as FormControl[];
    this.formArraySubscription?.unsubscribe();
    this.formArraySubscription = this.formArray.valueChanges.subscribe((value: any) => {
      this.onChange(value);
      this.onTouch();
    });
  }

  registerOnChange(fn: (actions: RuleAction[]) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouch = fn;
  }

  addAction() {
    const newAction: RuleAction = {
      actionDefinitionId: null,
      params: {}
    };
    this.formArray.push(new FormControl(newAction, [Validators.required, ruleActionValidator(this.actionDefinitions)]));
    this.formControls = this.formArray.controls as FormControl[];
  }

  ngOnDestroy() {
    this.formArraySubscription?.unsubscribe();
  }

  removeAction(control: FormControl) {
    const index = this.formArray.value.indexOf(control.value);
    this.formArray.removeAt(index);
    this.formControls = this.formArray.controls as FormControl[];
  }
}
