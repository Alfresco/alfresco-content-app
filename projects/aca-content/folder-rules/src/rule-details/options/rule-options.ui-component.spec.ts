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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, SimpleChange } from '@angular/core';
import { RuleOptionsUiComponent } from './rule-options.ui-component';
import { NoopTranslateModule, UnitTestingUtils } from '@alfresco/adf-core';
import { errorScriptConstraintMock } from '../../mock/actions.mock';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';

describe('RuleOptionsUiComponent', () => {
  let fixture: ComponentFixture<RuleOptionsUiComponent>;
  let component: RuleOptionsUiComponent;
  let loader: HarnessLoader;
  let unitTestingUtils: UnitTestingUtils;

  const errorScriptSelectAutomationId = 'rule-option-select-errorScript';
  const asynchronousCheckboxAutomationId = 'rule-option-checkbox-asynchronous';

  const getErrorScriptSelect = (): DebugElement => unitTestingUtils.getByDataAutomationId(errorScriptSelectAutomationId);
  const getAsynchronousCheckbox = (): DebugElement => unitTestingUtils.getByDataAutomationId(asynchronousCheckboxAutomationId);
  const getErrorScriptFormField = (): DebugElement => unitTestingUtils.getByDataAutomationId('rule-option-form-field-errorScript');
  const getInheritableCheckbox = (): DebugElement => unitTestingUtils.getByDataAutomationId('rule-option-checkbox-inheritable');
  const getDisabledCheckbox = (): DebugElement => unitTestingUtils.getByDataAutomationId('rule-option-checkbox-disabled');
  const getEnabledCheckbox = (): DebugElement => unitTestingUtils.getByDataAutomationId('rule-option-checkbox-enabled');

  const toggleMatCheckbox = (dataAutomationId: string) => {
    (unitTestingUtils.getByDataAutomationId(dataAutomationId).nativeElement as HTMLElement).querySelector('input').click();
  };

  const testErrorScriptFormFieldVisibility = (isVisible: boolean) => {
    if (isVisible) {
      expect((getErrorScriptFormField().nativeElement as HTMLElement).classList).not.toContain('aca-hide-error-script-dropdown');
    } else {
      expect((getErrorScriptFormField().nativeElement as HTMLElement).classList).toContain('aca-hide-error-script-dropdown');
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, RuleOptionsUiComponent],
      providers: [{ provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }]
    });

    fixture = TestBed.createComponent(RuleOptionsUiComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement, loader);

    component.writeValue({
      isEnabled: true,
      isInheritable: false,
      isAsynchronous: false,
      errorScript: ''
    });
  });

  it('should be able to write to the component', () => {
    fixture.detectChanges();

    expect(getAsynchronousCheckbox().componentInstance.checked).toBeFalsy();
    expect(getInheritableCheckbox().componentInstance.checked).toBeFalsy();
    expect(getDisabledCheckbox().componentInstance.checked).toBeFalsy();
    testErrorScriptFormFieldVisibility(false);

    component.writeValue({
      isEnabled: false,
      isInheritable: true,
      isAsynchronous: true,
      errorScript: ''
    });
    fixture.detectChanges();

    expect(getAsynchronousCheckbox().componentInstance.checked).toBeTruthy();
    expect(getInheritableCheckbox().componentInstance.checked).toBeTruthy();
    expect(getDisabledCheckbox().componentInstance.checked).toBeTruthy();
    testErrorScriptFormFieldVisibility(true);
  });

  it('should enable selector when async checkbox is truthy', () => {
    fixture.detectChanges();
    toggleMatCheckbox(asynchronousCheckboxAutomationId);
    fixture.detectChanges();

    expect(getAsynchronousCheckbox().componentInstance.checked).toBeTruthy();
    expect(getErrorScriptSelect().componentInstance.disabled).toBeFalsy();
  });

  it('should hide disabled checkbox and unselected checkboxes in read-only mode', () => {
    component.readOnly = true;
    fixture.detectChanges();

    expect(getAsynchronousCheckbox()).toBeFalsy();
    expect(getInheritableCheckbox()).toBeFalsy();
    expect(getEnabledCheckbox()).toBeFalsy();
    expect(getErrorScriptSelect()).toBeFalsy();

    component.writeValue({
      isEnabled: false,
      isInheritable: true,
      isAsynchronous: true,
      errorScript: ''
    });
    fixture.detectChanges();

    expect(getAsynchronousCheckbox()).toBeTruthy();
    expect(getInheritableCheckbox()).toBeTruthy();
    expect(getEnabledCheckbox()).toBeFalsy();
    expect(getErrorScriptSelect()).toBeTruthy();
  });

  it('should populate the error script dropdown with scripts', async () => {
    component.writeValue({
      isEnabled: true,
      isInheritable: false,
      isAsynchronous: true,
      errorScript: ''
    });
    component.errorScriptConstraint = errorScriptConstraintMock;
    component.ngOnChanges({ errorScriptConstraint: {} as SimpleChange });
    fixture.detectChanges();

    unitTestingUtils.clickByDataAutomationId(errorScriptSelectAutomationId);
    fixture.detectChanges();

    const selection = await loader.getHarness(MatSelectHarness);
    const matOptions = await selection.getOptions();
    expect(matOptions.length).toBe(3);
    expect((await matOptions[0].getText()).trim()).toBe('ACA_FOLDER_RULES.RULE_DETAILS.OPTIONS.NO_SCRIPT');
    expect((await matOptions[1].getText()).trim()).toBe('Script 1');
    expect((await matOptions[2].getText()).trim()).toBe('Script 2');
  });

  it('should always show a label for the error script dropdown', () => {
    component.writeValue({
      isEnabled: true,
      isInheritable: false,
      isAsynchronous: true,
      errorScript: ''
    });
    component.errorScriptConstraint = errorScriptConstraintMock;
    fixture.detectChanges();

    const matFormField = getErrorScriptFormField();
    fixture.detectChanges();
    expect(matFormField).not.toBeNull();
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

    expect(getAsynchronousCheckbox().componentInstance.checked).toBeTrue();
    expect(getInheritableCheckbox().componentInstance.checked).toBeTrue();
    expect(getDisabledCheckbox().componentInstance.checked).toBeTrue();
    expect(getErrorScriptSelect().componentInstance.value).toEqual('1234');

    component.writeValue({
      isEnabled: false,
      isInheritable: true,
      isAsynchronous: false,
      errorScript: ''
    });
    fixture.detectChanges();

    expect(getAsynchronousCheckbox().componentInstance.checked).toBeFalse();
    expect(getInheritableCheckbox().componentInstance.checked).toBeTrue();
    expect(getDisabledCheckbox().componentInstance.checked).toBeTrue();
    testErrorScriptFormFieldVisibility(false);
  });
});
