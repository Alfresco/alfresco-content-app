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

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { RuleTrigger } from '../../model/rule.model';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  imports: [CommonModule, TranslatePipe, MatCheckboxModule],
  selector: 'aca-rule-triggers',
  templateUrl: './rule-triggers.ui-component.html',
  styleUrls: ['./rule-triggers.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-triggers' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => RuleTriggersUiComponent)
    }
  ]
})
export class RuleTriggersUiComponent implements ControlValueAccessor {
  @Input() ariaLabelledBy = 'rule-triggers-label';

  readonly triggerOptions: RuleTrigger[] = ['inbound', 'update', 'outbound'];

  public selectedTriggers: { [key: string]: boolean } = {
    inbound: true
  };

  value: RuleTrigger[] = ['inbound'];
  readOnly = false;

  onChange: (triggers: RuleTrigger[]) => void = () => undefined;
  onTouch: () => void = () => undefined;

  writeValue(triggers: RuleTrigger[]) {
    this.value = triggers;
    this.selectedTriggers = {};
    this.value.forEach((trigger) => (this.selectedTriggers[trigger] = true));
  }

  registerOnChange(fn: () => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.readOnly = isDisabled;
  }

  onTriggerChange(trigger: RuleTrigger, checked: boolean) {
    if (checked) {
      this.value.push(trigger);
    } else {
      this.value.splice(
        this.value.findIndex((t) => t === trigger),
        1
      );
    }
    this.selectedTriggers[trigger] = checked;
    this.onTouch();
    this.onChange([...this.value]);
  }
}
