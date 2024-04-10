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

import { RuleTriggersUiComponent } from './rule-triggers.ui-component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '@alfresco/adf-core';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('RuleTriggerUiComponent', () => {
  let fixture: ComponentFixture<RuleTriggersUiComponent>;
  let component: RuleTriggersUiComponent;

  const getByDataAutomationId = (dataAutomationId: string): DebugElement =>
    fixture.debugElement.query(By.css(`[data-automation-id="${dataAutomationId}"]`));

  const toggleMatCheckbox = (dataAutomationId: string) => {
    (getByDataAutomationId(dataAutomationId).nativeElement as HTMLElement).querySelector('input').click();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule, RuleTriggersUiComponent]
    });

    fixture = TestBed.createComponent(RuleTriggersUiComponent);
    component = fixture.componentInstance;
  });

  it('should default to only the inbound checkbox', () => {
    fixture.detectChanges();

    expect(component.value).toEqual(['inbound']);
    expect(getByDataAutomationId('rule-trigger-checkbox-inbound').componentInstance.checked).toBeTruthy();
    expect(getByDataAutomationId('rule-trigger-checkbox-update').componentInstance.checked).toBeFalsy();
    expect(getByDataAutomationId('rule-trigger-checkbox-outbound').componentInstance.checked).toBeFalsy();
  });

  it('should change the checked boxes when the value is written to', () => {
    fixture.detectChanges();
    component.writeValue(['update', 'outbound']);
    fixture.detectChanges();

    expect(component.value).toEqual(['update', 'outbound']);
    expect(getByDataAutomationId('rule-trigger-checkbox-inbound').componentInstance.checked).toBeFalsy();
    expect(getByDataAutomationId('rule-trigger-checkbox-update').componentInstance.checked).toBeTruthy();
    expect(getByDataAutomationId('rule-trigger-checkbox-outbound').componentInstance.checked).toBeTruthy();
  });

  it('should update the value when a checkbox is checked', () => {
    const onChangeSpy = spyOn(component, 'onChange');
    fixture.detectChanges();
    toggleMatCheckbox('rule-trigger-checkbox-update');
    fixture.detectChanges();

    expect(component.value).toEqual(['inbound', 'update']);
    expect(onChangeSpy).toHaveBeenCalledWith(['inbound', 'update']);
  });

  it('should update the value when a checkbox is unchecked', () => {
    const onChangeSpy = spyOn(component, 'onChange');
    fixture.detectChanges();
    toggleMatCheckbox('rule-trigger-checkbox-inbound');
    fixture.detectChanges();

    expect(component.value).toEqual([]);
    expect(onChangeSpy).toHaveBeenCalledWith([]);
  });

  it('should only show the correct triggers in read only mode', () => {
    component.setDisabledState(true);
    component.writeValue(['update', 'outbound']);
    fixture.detectChanges();

    expect(getByDataAutomationId('rule-trigger-checkbox-inbound')).toBeNull();
    expect(getByDataAutomationId('rule-trigger-checkbox-update')).toBeNull();
    expect(getByDataAutomationId('rule-trigger-checkbox-outbound')).toBeNull();

    expect(getByDataAutomationId('rule-trigger-value-inbound')).toBeNull();
    expect(getByDataAutomationId('rule-trigger-value-update')).not.toBeNull();
    expect(getByDataAutomationId('rule-trigger-value-outbound')).not.toBeNull();
  });
});
