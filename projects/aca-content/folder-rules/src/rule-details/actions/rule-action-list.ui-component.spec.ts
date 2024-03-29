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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '@alfresco/adf-core';
import { RuleActionListUiComponent } from './rule-action-list.ui-component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RuleActionUiComponent } from './rule-action.ui-component';

describe('RuleActionListUiComponent', () => {
  let fixture: ComponentFixture<RuleActionListUiComponent>;
  let component: RuleActionListUiComponent;

  const getByDataAutomationId = (dataAutomationId: string, index = 0): DebugElement =>
    fixture.debugElement.queryAll(By.css(`[data-automation-id="${dataAutomationId}"]`))[index];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule]
    });

    fixture = TestBed.createComponent(RuleActionListUiComponent);
    component = fixture.componentInstance;

    component.writeValue([]);
    fixture.detectChanges();
  });

  it('should default to 1 empty action when an empty array of actions is written', () => {
    const acaRuleActions = fixture.debugElement.queryAll(By.directive(RuleActionUiComponent));
    expect(acaRuleActions.length).toBe(1);
  });

  it('should add a new action when the "add action" button is clicked', () => {
    const addActionButton = getByDataAutomationId('rule-action-list-add-action-button').nativeElement as HTMLButtonElement;
    addActionButton.click();
    fixture.detectChanges();

    const acaRuleActions = fixture.debugElement.queryAll(By.directive(RuleActionUiComponent));
    expect(acaRuleActions.length).toBe(2);
  });

  it('should disable the remove button if there is only one action', () => {
    const menuButton = getByDataAutomationId('rule-action-list-action-menu', 0).nativeElement as HTMLButtonElement;
    menuButton.click();
    fixture.detectChanges();

    const removeActionButton = getByDataAutomationId('rule-action-list-remove-action-button').nativeElement as HTMLButtonElement;
    expect(removeActionButton.disabled).toBeTrue();
  });

  it('should enable the remove button if there is more than one action', () => {
    const addActionButton = getByDataAutomationId('rule-action-list-add-action-button').nativeElement as HTMLButtonElement;
    addActionButton.click();
    fixture.detectChanges();

    const menuButton = getByDataAutomationId('rule-action-list-action-menu', 0).nativeElement as HTMLButtonElement;
    menuButton.click();
    fixture.detectChanges();

    const removeActionButton = getByDataAutomationId('rule-action-list-remove-action-button').nativeElement as HTMLButtonElement;
    expect(removeActionButton.disabled).toBeFalse();
  });

  it('should remove an action when the remove action button is clicked', () => {
    const addActionButton = getByDataAutomationId('rule-action-list-add-action-button').nativeElement as HTMLButtonElement;
    addActionButton.click();
    fixture.detectChanges();

    const menuButton = getByDataAutomationId('rule-action-list-action-menu', 0).nativeElement as HTMLButtonElement;
    menuButton.click();
    fixture.detectChanges();

    const removeActionButton = getByDataAutomationId('rule-action-list-remove-action-button').nativeElement as HTMLButtonElement;
    removeActionButton.click();
    fixture.detectChanges();

    const acaRuleActions = fixture.debugElement.queryAll(By.directive(RuleActionUiComponent));
    expect(acaRuleActions.length).toBe(1);
  });
});
