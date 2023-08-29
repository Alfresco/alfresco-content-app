/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, SimpleChange } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RuleOptionsUiComponent } from './rule-options.ui-component';
import { CoreTestingModule } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { errorScriptConstraintMock } from '../../mock/actions.mock';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

describe('RuleOptionsUiComponent', () => {
  let fixture: ComponentFixture<RuleOptionsUiComponent>;
  let component: RuleOptionsUiComponent;

  const getByDataAutomationId = (dataAutomationId: string): DebugElement =>
    fixture.debugElement.query(By.css(`[data-automation-id="${dataAutomationId}"]`));

  const toggleMatCheckbox = (dataAutomationId: string) => {
    ((getByDataAutomationId(dataAutomationId).nativeElement as HTMLElement).children[0] as HTMLElement).click();
  };

  const testErrorScriptFormFieldVisibility = (isVisible: boolean) => {
    if (isVisible) {
      expect((getByDataAutomationId('rule-option-form-field-errorScript').nativeElement as HTMLElement).classList).not.toContain(
        'hide-error-script-dropdown'
      );
    } else {
      expect((getByDataAutomationId('rule-option-form-field-errorScript').nativeElement as HTMLElement).classList).toContain(
        'hide-error-script-dropdown'
      );
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, ReactiveFormsModule, CoreTestingModule, RuleOptionsUiComponent],
      providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'never' } }]
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
    testErrorScriptFormFieldVisibility(false);

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
    testErrorScriptFormFieldVisibility(true);
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

  it('should populate the error script dropdown with scripts', () => {
    component.writeValue({
      isEnabled: true,
      isInheritable: false,
      isAsynchronous: true,
      errorScript: ''
    });
    component.errorScriptConstraint = errorScriptConstraintMock;
    component.ngOnChanges({ errorScriptConstraint: {} as SimpleChange });
    fixture.detectChanges();

    (getByDataAutomationId('rule-option-select-errorScript').nativeElement as HTMLElement).click();
    fixture.detectChanges();

    const matOptions = fixture.debugElement.queryAll(By.css(`.mat-option`));
    expect(matOptions.length).toBe(3);
    expect((matOptions[0].nativeElement as HTMLElement).innerText.trim()).toBe('ACA_FOLDER_RULES.RULE_DETAILS.OPTIONS.NO_SCRIPT');
    expect((matOptions[1].nativeElement as HTMLElement).innerText.trim()).toBe('Script 1');
    expect((matOptions[2].nativeElement as HTMLElement).innerText.trim()).toBe('Script 2');
  });

  it('should always show a label for the error script dropdown even when MAT_FORM_FIELD_DEFAULT_OPTIONS sets floatLabel to never', () => {
    component.writeValue({
      isEnabled: true,
      isInheritable: false,
      isAsynchronous: true,
      errorScript: ''
    });
    component.errorScriptConstraint = errorScriptConstraintMock;
    fixture.detectChanges();

    const matFormField = fixture.debugElement.query(By.css(`[data-automation-id="rule-option-form-field-errorScript"] .mat-form-field-label`));
    fixture.detectChanges();
    expect(matFormField).not.toBeNull();
    expect(matFormField.componentInstance['floatLabel']).toBe('always');
  });

  it('should properly update formFields on only isAsynchronous and errorScript changes', () => {
    fixture.detectChanges();
    component.writeValue({
      isEnabled: false,
      isInheritable: true,
      isAsynchronous: true,
      errorScript: '1234'
    });
    fixture.detectChanges();

    expect(getByDataAutomationId('rule-option-checkbox-asynchronous').componentInstance.checked).toBeTrue();
    expect(getByDataAutomationId('rule-option-checkbox-inheritable').componentInstance.checked).toBeTrue();
    expect(getByDataAutomationId('rule-option-checkbox-disabled').componentInstance.checked).toBeTrue();
    expect(getByDataAutomationId('rule-option-select-errorScript').componentInstance.value).toEqual('1234');

    component.writeValue({
      isEnabled: false,
      isInheritable: true,
      isAsynchronous: false,
      errorScript: ''
    });
    fixture.detectChanges();

    expect(getByDataAutomationId('rule-option-checkbox-asynchronous').componentInstance.checked).toBeFalse();
    expect(getByDataAutomationId('rule-option-checkbox-inheritable').componentInstance.checked).toBeTrue();
    expect(getByDataAutomationId('rule-option-checkbox-disabled').componentInstance.checked).toBeTrue();
    testErrorScriptFormFieldVisibility(false);
  });
});
