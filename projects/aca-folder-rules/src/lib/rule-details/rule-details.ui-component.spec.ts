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
import { CoreTestingModule } from '@alfresco/adf-core';
import { RuleDetailsUiComponent } from './rule-details.ui-component';
import { Rule } from '../model/rule.model';
import { By } from '@angular/platform-browser';
import { RuleCompositeConditionUiComponent } from './conditions/rule-composite-condition.ui-component';
import { RuleTriggersUiComponent } from './triggers/rule-triggers.ui-component';
import { RuleOptionsUiComponent } from './options/rule-options.ui-component';
import { RuleActionListUiComponent } from './actions/rule-action-list.ui-component';
import { RuleActionUiComponent } from './actions/rule-action.ui-component';

describe('RuleDetailsUiComponent', () => {
  let fixture: ComponentFixture<RuleDetailsUiComponent>;
  let component: RuleDetailsUiComponent;

  const testValue: Partial<Rule> = {
    id: 'rule-id',
    name: 'Rule name',
    description: 'This is the description of the rule',
    triggers: ['update', 'outbound'],
    isAsynchronous: true,
    isInheritable: true,
    isEnabled: true,
    errorScript: ''
  };

  const getHtmlElement = <T>(dataAutomationId: string) =>
    fixture.debugElement.query(By.css(`[data-automation-id="${dataAutomationId}"]`))?.nativeElement as T;

  const getComponentInstance = <T>(dataAutomationId: string) =>
    fixture.debugElement.query(By.css(`[data-automation-id="${dataAutomationId}"]`))?.componentInstance as T;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule],
      declarations: [
        RuleCompositeConditionUiComponent,
        RuleDetailsUiComponent,
        RuleTriggersUiComponent,
        RuleOptionsUiComponent,
        RuleActionListUiComponent,
        RuleActionUiComponent
      ]
    });

    fixture = TestBed.createComponent(RuleDetailsUiComponent);
    component = fixture.componentInstance;
  });

  it('should fill the form out with initial values', () => {
    component.value = testValue;
    fixture.detectChanges();

    const nameInput = getHtmlElement<HTMLInputElement>('rule-details-name-input');
    const descriptionTextarea = getHtmlElement<HTMLTextAreaElement>('rule-details-description-textarea');
    const ruleTriggersComponent = getComponentInstance<RuleTriggersUiComponent>('rule-details-triggers-component');
    const ruleOptionsComponent = getComponentInstance<RuleOptionsUiComponent>('rule-details-options-component');

    expect(nameInput.value).toBe(testValue.name);
    expect(descriptionTextarea.value).toBe(testValue.description);
    expect(ruleTriggersComponent.value).toEqual(testValue.triggers);
    expect(ruleOptionsComponent.form.value).toEqual({
      isDisabled: !testValue.isEnabled,
      isInheritable: testValue.isInheritable,
      isAsynchronous: testValue.isAsynchronous,
      errorScript: testValue.errorScript
    });
  });

  it('should modify the form if the value input property is modified', () => {
    fixture.detectChanges();
    const nameInput = getHtmlElement<HTMLInputElement>('rule-details-name-input');
    const descriptionTextarea = getHtmlElement<HTMLTextAreaElement>('rule-details-description-textarea');
    const ruleTriggersComponent = getComponentInstance<RuleTriggersUiComponent>('rule-details-triggers-component');

    expect(nameInput.value).toBe('');
    expect(descriptionTextarea.value).toBe('');
    expect(ruleTriggersComponent.value).toEqual(['inbound']);
    component.value = testValue;
    fixture.detectChanges();

    expect(nameInput.value).toBe(testValue.name);
    expect(descriptionTextarea.value).toBe(testValue.description);
    expect(ruleTriggersComponent.value).toEqual(testValue.triggers);
  });

  it('should be editable if not read-only', () => {
    component.value = testValue;
    component.readOnly = false;
    fixture.detectChanges();

    const nameInput = getHtmlElement<HTMLInputElement>('rule-details-name-input');
    const descriptionTextarea = getHtmlElement<HTMLTextAreaElement>('rule-details-description-textarea');
    const ruleTriggersComponent = getComponentInstance<RuleTriggersUiComponent>('rule-details-triggers-component');
    const ruleOptionsComponent = getComponentInstance<RuleOptionsUiComponent>('rule-details-options-component');

    expect(nameInput.disabled).toBeFalsy();
    expect(descriptionTextarea.disabled).toBeFalsy();
    expect(ruleTriggersComponent.readOnly).toBeFalsy();
    expect(ruleOptionsComponent.readOnly).toBeFalsy();
  });

  it('should not be editable if read-only', () => {
    component.value = testValue;
    component.readOnly = true;
    fixture.detectChanges();

    const nameInput = getHtmlElement<HTMLInputElement>('rule-details-name-input');
    const descriptionTextarea = getHtmlElement<HTMLTextAreaElement>('rule-details-description-textarea');
    const ruleTriggersComponent = getComponentInstance<RuleTriggersUiComponent>('rule-details-triggers-component');
    const ruleOptionsComponent = getComponentInstance<RuleOptionsUiComponent>('rule-details-options-component');

    expect(nameInput.disabled).toBeTruthy();
    expect(descriptionTextarea.disabled).toBeTruthy();
    expect(ruleTriggersComponent.readOnly).toBeTruthy();
    expect(ruleOptionsComponent.readOnly).toBeTruthy();
  });

  it('should hide the options section entirely in read-only mode if it has no selected options', () => {
    component.value = {
      ...testValue,
      isInheritable: false,
      isAsynchronous: false
    };
    component.readOnly = true;
    fixture.detectChanges();

    expect(getComponentInstance<RuleOptionsUiComponent>('rule-details-options-component')).toBeFalsy();
  });
});
