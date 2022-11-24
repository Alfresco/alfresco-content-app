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
import { CardViewBoolItemModel, CardViewComponent, CardViewSelectItemModel, CardViewTextItemModel, CoreTestingModule } from '@alfresco/adf-core';
import { RuleActionUiComponent } from './rule-action.ui-component';
import { actionsTransformedListMock } from '../../mock/actions.mock';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { dummyConstraints } from '../../mock/action-parameter-constraints.mock';

describe('RuleActionUiComponent', () => {
  let fixture: ComponentFixture<RuleActionUiComponent>;
  let component: RuleActionUiComponent;

  const getByDataAutomationId = (dataAutomationId: string): DebugElement =>
    fixture.debugElement.query(By.css(`[data-automation-id="${dataAutomationId}"]`));

  const changeMatSelectValue = (dataAutomationId: string, value: string) => {
    const matSelect = getByDataAutomationId(dataAutomationId).nativeElement;
    matSelect.click();
    fixture.detectChanges();
    const matOption = fixture.debugElement.query(By.css(`.mat-option[ng-reflect-value="${value}"]`)).nativeElement;
    matOption.click();
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule]
    });

    fixture = TestBed.createComponent(RuleActionUiComponent);
    component = fixture.componentInstance;
  });

  it('should populate the dropdown selector with the action definitions', () => {
    component.actionDefinitions = actionsTransformedListMock;
    fixture.detectChanges();

    const matSelect = getByDataAutomationId('rule-action-select').nativeElement;
    matSelect.click();
    fixture.detectChanges();

    const matOptions = fixture.debugElement.queryAll(By.css(`mat-option`));
    expect(matOptions.length).toBe(2);
    expect(matOptions[0].nativeElement.innerText).toBe('Action 1 title');
    expect(matOptions[1].nativeElement.innerText).toBe('mock-action-2-definition');
  });

  it('should populate the card view with parameters when an action is selected', () => {
    component.actionDefinitions = actionsTransformedListMock;
    component.parameterConstraints = dummyConstraints;
    fixture.detectChanges();

    const cardView = getByDataAutomationId('rule-action-card-view').componentInstance as CardViewComponent;
    expect(cardView.properties.length).toBe(0);

    changeMatSelectValue('rule-action-select', 'mock-action-1-definition');

    expect(cardView.properties.length).toBe(5);
    expect(cardView.properties[0]).toBeInstanceOf(CardViewTextItemModel);
    expect(cardView.properties[1]).toBeInstanceOf(CardViewBoolItemModel);
    expect(cardView.properties[2]).toBeInstanceOf(CardViewSelectItemModel);
    expect(cardView.properties[3]).toBeInstanceOf(CardViewTextItemModel);
    expect(cardView.properties[4]).toBeInstanceOf(CardViewSelectItemModel);

    changeMatSelectValue('rule-action-select', 'mock-action-2-definition');
    expect(cardView.properties.length).toBe(0);
  });
});
