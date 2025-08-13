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
import { NoopTranslateModule, UnitTestingUtils } from '@alfresco/adf-core';
import { RuleActionListUiComponent } from './rule-action-list.ui-component';
import { DebugElement } from '@angular/core';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';

describe('RuleActionListUiComponent', () => {
  let fixture: ComponentFixture<RuleActionListUiComponent>;
  let component: RuleActionListUiComponent;
  let unitTestingUtils: UnitTestingUtils;

  const getByDataAutomationId = (dataAutomationId: string, index = 0): DebugElement =>
    unitTestingUtils.getAllByCSS(`[data-automation-id="${dataAutomationId}"]`)[index];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, RuleActionListUiComponent],
      providers: [{ provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }]
    });

    fixture = TestBed.createComponent(RuleActionListUiComponent);
    component = fixture.componentInstance;
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);

    component.writeValue([]);
    fixture.detectChanges();
  });

  function countRuleActions(): number {
    const acaRuleActions = fixture.nativeElement.querySelectorAll('aca-rule-action');
    return acaRuleActions.length;
  }

  function clickButton(selector: string) {
    const button = getByDataAutomationId(selector).nativeElement as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
  }

  it('should default to 1 empty action when an empty array of actions is written', () => {
    expect(countRuleActions()).toBe(1);
  });

  it('should add a new action when the "add action" button is clicked', () => {
    clickButton('rule-action-list-add-action-button');
    expect(countRuleActions()).toBe(2);
  });

  it('should disable the remove button if there is only one action', () => {
    clickButton('rule-action-list-action-menu');

    const removeActionButton = getByDataAutomationId('rule-action-list-remove-action-button').nativeElement as HTMLButtonElement;
    expect(removeActionButton.disabled).toBeTrue();
  });

  it('should enable the remove button if there is more than one action', () => {
    clickButton('rule-action-list-add-action-button');
    clickButton('rule-action-list-action-menu');

    const removeActionButton = getByDataAutomationId('rule-action-list-remove-action-button').nativeElement as HTMLButtonElement;
    expect(removeActionButton.disabled).toBeFalse();
  });

  it('should remove an action when the remove action button is clicked', () => {
    clickButton('rule-action-list-add-action-button');
    clickButton('rule-action-list-action-menu');

    const removeActionButton = getByDataAutomationId('rule-action-list-remove-action-button').nativeElement as HTMLButtonElement;
    removeActionButton.click();
    fixture.detectChanges();

    expect(countRuleActions()).toBe(1);
  });
});
