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

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { RuleTrigger } from '../../model/rule.model';

@Component({
  selector: 'aca-rule-triggers',
  templateUrl: './rule-triggers.ui-component.html',
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
  readonly triggerOptions: RuleTrigger[] = ['inbound', 'update', 'outbound'];

  value: RuleTrigger[] = ['inbound'];
  readOnly = false;

  onChange: (triggers: RuleTrigger[]) => void = () => undefined;
  onTouch: () => void = () => undefined;

  writeValue(triggers: RuleTrigger[]) {
    this.value = triggers;
  }

  registerOnChange(fn: () => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.readOnly = isDisabled;
  }

  isTriggerChecked(trigger: RuleTrigger): boolean {
    return this.value.includes(trigger);
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
    this.onTouch();
    this.onChange([...this.value]);
  }

  isTriggerSelected(trigger: RuleTrigger): boolean {
    return this.value.includes(trigger);
  }
}
