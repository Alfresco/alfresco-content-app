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

import { RuleTriggersUiComponent } from './rule-triggers.ui-component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopTranslateModule, UnitTestingUtils } from '@alfresco/adf-core';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DebugElement } from '@angular/core';

describe('RuleTriggerUiComponent', () => {
  let fixture: ComponentFixture<RuleTriggersUiComponent>;
  let component: RuleTriggersUiComponent;
  let unitTestingUtils: UnitTestingUtils;
  let loader: HarnessLoader;

  const checkboxUpdateAutomationId = 'rule-trigger-checkbox-update';
  const checkboxInboundAutomationId = 'rule-trigger-checkbox-inbound';
  const getCheckboxInbound = (): DebugElement => unitTestingUtils.getByDataAutomationId(checkboxInboundAutomationId);
  const getCheckboxUpdate = (): DebugElement => unitTestingUtils.getByDataAutomationId(checkboxUpdateAutomationId);
  const getCheckboxOutbound = (): DebugElement => unitTestingUtils.getByDataAutomationId('rule-trigger-checkbox-outbound');

  const toggleMatCheckbox = async (dataAutomationId: string) => {
    const checkbox = await unitTestingUtils.getMatCheckboxByDataAutomationId(dataAutomationId);
    await checkbox.toggle();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, RuleTriggersUiComponent],
      providers: [{ provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }]
    });

    fixture = TestBed.createComponent(RuleTriggersUiComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement, loader);
  });

  it('should default to only the inbound checkbox', () => {
    fixture.detectChanges();

    expect(component.value).toEqual(['inbound']);
    expect(getCheckboxInbound().componentInstance.checked).toBeTruthy();
    expect(getCheckboxUpdate().componentInstance.checked).toBeFalsy();
    expect(getCheckboxOutbound().componentInstance.checked).toBeFalsy();
  });

  it('should change the checked boxes when the value is written to', () => {
    fixture.detectChanges();
    component.writeValue(['update', 'outbound']);
    fixture.detectChanges();

    expect(component.value).toEqual(['update', 'outbound']);
    expect(getCheckboxInbound().componentInstance.checked).toBeFalsy();
    expect(getCheckboxUpdate().componentInstance.checked).toBeTruthy();
    expect(getCheckboxOutbound().componentInstance.checked).toBeTruthy();
  });

  it('should update the value when a checkbox is checked', async () => {
    const onChangeSpy = spyOn(component, 'onChange');
    fixture.detectChanges();
    await toggleMatCheckbox(checkboxUpdateAutomationId);
    fixture.detectChanges();

    expect(component.value).toEqual(['inbound', 'update']);
    expect(onChangeSpy).toHaveBeenCalledWith(['inbound', 'update']);
  });

  it('should update the value when a checkbox is unchecked', async () => {
    const onChangeSpy = spyOn(component, 'onChange');
    fixture.detectChanges();
    await toggleMatCheckbox(checkboxInboundAutomationId);
    fixture.detectChanges();

    expect(component.value).toEqual([]);
    expect(onChangeSpy).toHaveBeenCalledWith([]);
  });

  it('should only show the correct triggers in read only mode', () => {
    component.setDisabledState(true);
    component.writeValue(['update', 'outbound']);
    fixture.detectChanges();

    expect(getCheckboxInbound()).toBeNull();
    expect(getCheckboxUpdate()).toBeNull();
    expect(getCheckboxOutbound()).toBeNull();

    expect(unitTestingUtils.getByDataAutomationId('rule-trigger-value-inbound')).toBeNull();
    expect(unitTestingUtils.getByDataAutomationId('rule-trigger-value-update')).not.toBeNull();
    expect(unitTestingUtils.getByDataAutomationId('rule-trigger-value-outbound')).not.toBeNull();
  });
});
