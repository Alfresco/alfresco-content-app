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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RuleOptionsUiComponent } from './rule-options.ui-component';
import { CoreTestingModule } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';

describe('RuleOptionsUiComponent', () => {
  let fixture: ComponentFixture<RuleOptionsUiComponent>;
  let component: RuleOptionsUiComponent;

  const getByDataAutomationId = (dataAutomationId: string): DebugElement =>
    fixture.debugElement.query(By.css(`[data-automation-id="${dataAutomationId}"]`));

  const toggleMatCheckbox = (dataAutomationId: string) => {
    ((getByDataAutomationId(dataAutomationId).nativeElement as HTMLElement).children[0] as HTMLElement).click();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, ReactiveFormsModule, CoreTestingModule],
      declarations: [RuleOptionsUiComponent]
    });

    fixture = TestBed.createComponent(RuleOptionsUiComponent);
    component = fixture.componentInstance;

    component.writeValue({
      isEnabled: true,
      isInheritable: false,
      isAsynchronous: false,
      errorScript: ''
    });
  });

  it('should be able to write to the component', () => {
    fixture.detectChanges();

    expect(getByDataAutomationId('rule-option-checkbox-asynchronous').componentInstance.checked).toBeFalsy();
    expect(getByDataAutomationId('rule-option-checkbox-inheritable').componentInstance.checked).toBeFalsy();
    expect(getByDataAutomationId('rule-option-checkbox-disabled').componentInstance.checked).toBeFalsy();
    expect(getByDataAutomationId('rule-option-select-errorScript').componentInstance.disabled).toBeTruthy();

    component.writeValue({
      isEnabled: false,
      isInheritable: true,
      isAsynchronous: true,
      errorScript: ''
    });
    fixture.detectChanges();

    expect(getByDataAutomationId('rule-option-checkbox-asynchronous').componentInstance.checked).toBeTruthy();
    expect(getByDataAutomationId('rule-option-checkbox-inheritable').componentInstance.checked).toBeTruthy();
    expect(getByDataAutomationId('rule-option-checkbox-disabled').componentInstance.checked).toBeTruthy();
    expect(getByDataAutomationId('rule-option-select-errorScript').componentInstance.disabled).toBeFalsy();
  });

  it('should enable selector when async checkbox is truthy', () => {
    fixture.detectChanges();
    toggleMatCheckbox('rule-option-checkbox-asynchronous');
    fixture.detectChanges();

    expect(getByDataAutomationId('rule-option-checkbox-asynchronous').componentInstance.checked).toBeTruthy();
    expect(getByDataAutomationId('rule-option-select-errorScript').componentInstance.disabled).toBeFalsy();
  });

  it('should hide disabled checkbox and unselected checkboxes in read-only mode', () => {
    component.readOnly = true;
    fixture.detectChanges();

    expect(getByDataAutomationId('rule-option-checkbox-asynchronous')).toBeFalsy();
    expect(getByDataAutomationId('rule-option-checkbox-inheritable')).toBeFalsy();
    expect(getByDataAutomationId('rule-option-checkbox-enabled')).toBeFalsy();
    expect(getByDataAutomationId('rule-option-select-errorScript')).toBeFalsy();

    component.writeValue({
      isEnabled: false,
      isInheritable: true,
      isAsynchronous: true,
      errorScript: ''
    });
    fixture.detectChanges();

    expect(getByDataAutomationId('rule-option-checkbox-asynchronous')).toBeTruthy();
    expect(getByDataAutomationId('rule-option-checkbox-inheritable')).toBeTruthy();
    expect(getByDataAutomationId('rule-option-checkbox-enabled')).toBeFalsy();
    expect(getByDataAutomationId('rule-option-select-errorScript')).toBeTruthy();
  });
});
