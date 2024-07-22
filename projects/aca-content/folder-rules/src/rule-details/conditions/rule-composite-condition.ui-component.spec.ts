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
import { RuleCompositeConditionUiComponent } from './rule-composite-condition.ui-component';
import { CoreTestingModule } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import {
  compositeConditionWithNestedGroupsMock,
  compositeConditionWithOneGroupMock,
  compositeConditionWithThreeConditionMock
} from '../../mock/conditions.mock';
import { RuleSimpleConditionUiComponent } from './rule-simple-condition.ui-component';

describe('RuleCompositeConditionUiComponent', () => {
  let fixture: ComponentFixture<RuleCompositeConditionUiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule, RuleCompositeConditionUiComponent, RuleSimpleConditionUiComponent]
    });

    fixture = TestBed.createComponent(RuleCompositeConditionUiComponent);
  });

  describe('No conditions', () => {
    let noConditionsElement: DebugElement;

    beforeEach(() => {
      fixture.detectChanges();
      noConditionsElement = fixture.debugElement.query(By.css(`[data-automation-id="no-conditions"]`));
    });

    it('should default to no conditions', () => {
      const rowElements = fixture.debugElement.queryAll(By.css(`.aca-rule-composite-condition__form__row`));

      expect(rowElements.length).toBe(0);
    });

    it('should show a message if there are no conditions', () => {
      fixture.componentInstance.childCondition = false;
      fixture.detectChanges();

      expect((noConditionsElement.nativeElement as HTMLElement).innerText.trim()).toBe('ACA_FOLDER_RULES.RULE_DETAILS.NO_CONDITIONS');
    });

    it('should show a different message if the component is not a root condition group', () => {
      fixture.componentInstance.childCondition = true;
      fixture.detectChanges();

      expect((noConditionsElement.nativeElement as HTMLElement).innerText.trim()).toBe('ACA_FOLDER_RULES.RULE_DETAILS.NO_CONDITIONS_IN_GROUP');
    });
  });

  describe('Read only mode', () => {
    it('should hide the add buttons in read only mode', () => {
      fixture.componentInstance.readOnly = true;
      fixture.detectChanges();
      const actionsElement = fixture.debugElement.query(By.css(`[data-automation-id="add-actions"]`));

      expect(actionsElement).toBeNull();
    });

    it('should hide the more actions button on the right side of the condition', () => {
      fixture.componentInstance.writeValue(compositeConditionWithOneGroupMock);
      fixture.componentInstance.readOnly = true;
      fixture.detectChanges();
      const actionsButtonElements = fixture.debugElement.queryAll(By.css(`[data-automation-id="condition-actions-button"]`));

      expect(actionsButtonElements.length).toBe(0);
    });
  });

  it('should have as many simple condition components as defined in the simpleConditions array', () => {
    fixture.componentInstance.writeValue(compositeConditionWithThreeConditionMock);
    fixture.detectChanges();
    const simpleConditionComponents = fixture.debugElement.queryAll(By.css(`.aca-rule-simple-condition`));

    expect(simpleConditionComponents.length).toBe(3);
  });

  it('should have as many composite condition components as defined in the compositeConditions array, including nested', () => {
    fixture.componentInstance.writeValue(compositeConditionWithNestedGroupsMock);
    fixture.detectChanges();
    const compositeConditionComponents = fixture.debugElement.queryAll(By.css(`.aca-rule-composite-condition`));

    expect(compositeConditionComponents.length).toBe(3);
  });

  it('should add a simple condition component on click of add condition button', () => {
    fixture.detectChanges();
    const predicate = By.css(`.aca-rule-simple-condition`);
    const simpleConditionComponentsBeforeClick = fixture.debugElement.queryAll(predicate);

    expect(simpleConditionComponentsBeforeClick.length).toBe(0);

    const addConditionButton = fixture.debugElement.query(By.css(`[data-automation-id="add-condition-button"]`));
    (addConditionButton.nativeElement as HTMLButtonElement).click();
    fixture.detectChanges();
    const simpleConditionComponentsAfterClick = fixture.debugElement.queryAll(predicate);

    expect(simpleConditionComponentsAfterClick.length).toBe(1);
  });

  it('should add a composite condition component on click of add group button', () => {
    fixture.detectChanges();
    const predicate = By.css(`.aca-rule-composite-condition`);
    const compositeConditionComponentsBeforeClick = fixture.debugElement.queryAll(predicate);

    expect(compositeConditionComponentsBeforeClick.length).toBe(0);

    const addGroupButton = fixture.debugElement.query(By.css(`[data-automation-id="add-group-button"]`));
    (addGroupButton.nativeElement as HTMLButtonElement).click();
    fixture.detectChanges();
    const compositeConditionComponentsAfterClick = fixture.debugElement.queryAll(predicate);

    expect(compositeConditionComponentsAfterClick.length).toBe(1);
  });
});
