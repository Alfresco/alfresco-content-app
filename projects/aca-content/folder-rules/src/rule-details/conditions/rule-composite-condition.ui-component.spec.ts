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

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RuleCompositeConditionUiComponent } from './rule-composite-condition.ui-component';
import { NoopTranslateModule, UnitTestingUtils } from '@alfresco/adf-core';
import { DebugElement } from '@angular/core';
import {
  compositeConditionWithNestedGroupsMock,
  compositeConditionWithOneGroupMock,
  compositeConditionWithThreeConditionMock
} from '../../mock/conditions.mock';
import { RuleSimpleConditionUiComponent } from './rule-simple-condition.ui-component';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';
import { FocusTrapFactory } from '@angular/cdk/a11y';

describe('RuleCompositeConditionUiComponent', () => {
  let fixture: ComponentFixture<RuleCompositeConditionUiComponent>;
  let unitTestingUtils: UnitTestingUtils;

  const getSimpleConditionComponents = (): DebugElement[] => unitTestingUtils.getAllByCSS(`.aca-rule-simple-condition`);
  const getCompositeConditionComponents = (): DebugElement[] => unitTestingUtils.getAllByCSS(`.aca-rule-composite-condition`);
  const getLabelWithConditionsElementInnerText = (): string => unitTestingUtils.getInnerTextByDataAutomationId('label-with-conditions');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, RuleCompositeConditionUiComponent, RuleSimpleConditionUiComponent],
      providers: [{ provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }]
    });

    fixture = TestBed.createComponent(RuleCompositeConditionUiComponent);
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
  });

  describe('No conditions', () => {
    const getNoConditionsElementInnerText = (): string => unitTestingUtils.getInnerTextByDataAutomationId('no-conditions');

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should default to no conditions', () => {
      const rowElements = unitTestingUtils.getAllByCSS(`.aca-rule-composite-condition__form__row`);

      expect(rowElements.length).toBe(0);
    });

    it('should show a message if there are no conditions', () => {
      fixture.componentInstance.childCondition = false;
      fixture.detectChanges();

      expect(getNoConditionsElementInnerText()).toBe('ACA_FOLDER_RULES.RULE_DETAILS.NO_CONDITIONS');
    });

    it('should show a different message if the component is not a root condition group', () => {
      fixture.componentInstance.childCondition = true;
      fixture.detectChanges();

      expect(getNoConditionsElementInnerText()).toBe('ACA_FOLDER_RULES.RULE_DETAILS.NO_CONDITIONS_IN_GROUP');
    });
  });

  describe('Read only mode', () => {
    it('should hide the add buttons in read only mode', () => {
      fixture.componentInstance.readOnly = true;
      fixture.detectChanges();

      expect(unitTestingUtils.getByDataAutomationId('add-actions')).toBeNull();
    });

    it('should hide the more actions button on the right side of the condition', () => {
      fixture.componentInstance.writeValue(compositeConditionWithOneGroupMock);
      fixture.componentInstance.readOnly = true;
      fixture.detectChanges();

      expect(unitTestingUtils.getAllByCSS(`[data-automation-id="condition-actions-button"]`).length).toBe(0);
    });
  });

  it('should have as many simple condition components as defined in the simpleConditions array', () => {
    fixture.componentInstance.writeValue(compositeConditionWithThreeConditionMock);
    fixture.detectChanges();

    expect(getSimpleConditionComponents().length).toBe(3);
  });

  it('should have as many composite condition components as defined in the compositeConditions array, including nested', () => {
    fixture.componentInstance.writeValue(compositeConditionWithNestedGroupsMock);
    fixture.detectChanges();

    expect(getCompositeConditionComponents().length).toBe(3);
  });

  it('should add a simple condition component on click of add condition button', () => {
    fixture.detectChanges();

    expect(getSimpleConditionComponents().length).toBe(0);

    unitTestingUtils.clickByDataAutomationId('add-condition-button');
    fixture.detectChanges();

    expect(getSimpleConditionComponents().length).toBe(1);
  });

  it('should add a composite condition component on click of add group button', () => {
    fixture.detectChanges();

    expect(getCompositeConditionComponents().length).toBe(0);

    unitTestingUtils.clickByDataAutomationId('add-group-button');
    fixture.detectChanges();

    expect(getCompositeConditionComponents().length).toBe(1);
  });

  describe('When hasNoConditions is false', () => {
    beforeEach(() => {
      fixture.componentInstance.writeValue(compositeConditionWithThreeConditionMock);
    });

    it('should display "CONDITIONS" label when childCondition is false', () => {
      fixture.componentInstance.childCondition = false;
      fixture.detectChanges();

      expect(getLabelWithConditionsElementInnerText()).toBe('ACA_FOLDER_RULES.RULE_DETAILS.LABEL.CONDITIONS');
    });

    it('should display "GROUP_CONDITIONS" label when childCondition is true', () => {
      fixture.componentInstance.childCondition = true;
      fixture.detectChanges();

      expect(getLabelWithConditionsElementInnerText()).toBe('ACA_FOLDER_RULES.RULE_DETAILS.LABEL.GROUP_CONDITIONS');
    });

    it('should set correct id attribute when childCondition is false', () => {
      fixture.componentInstance.childCondition = false;
      fixture.detectChanges();

      expect(unitTestingUtils.getAllByCSS('[conditions-group-label-main]')).toBeTruthy();
    });

    it('should set correct id attribute when childCondition is true', () => {
      fixture.componentInstance.childCondition = true;
      fixture.detectChanges();

      expect(unitTestingUtils.getAllByCSS('[conditions-group-label-nested]')).toBeTruthy();
    });
  });

  describe('Focus management', () => {
    it('should focus the newly added simple condition', fakeAsync(() => {
      fixture.detectChanges();
      const focusTrapFactory = TestBed.inject(FocusTrapFactory);
      const focusTrapSpy = jasmine.createSpyObj('FocusTrap', ['focusFirstTabbableElement', 'destroy']);
      spyOn(focusTrapFactory, 'create').and.returnValue(focusTrapSpy);

      unitTestingUtils.clickByDataAutomationId('add-condition-button');
      fixture.detectChanges();
      tick();

      expect(focusTrapFactory.create).toHaveBeenCalled();
      expect(focusTrapSpy.focusFirstTabbableElement).toHaveBeenCalled();
      expect(focusTrapSpy.destroy).toHaveBeenCalled();
    }));

    it('should focus the newly added composite condition', fakeAsync(() => {
      fixture.detectChanges();
      const focusTrapFactory = TestBed.inject(FocusTrapFactory);
      const focusTrapSpy = jasmine.createSpyObj('FocusTrap', ['focusFirstTabbableElement', 'destroy']);
      spyOn(focusTrapFactory, 'create').and.returnValue(focusTrapSpy);

      unitTestingUtils.clickByDataAutomationId('add-group-button');
      fixture.detectChanges();
      tick();

      expect(focusTrapFactory.create).toHaveBeenCalled();
      expect(focusTrapSpy.focusFirstTabbableElement).toHaveBeenCalled();
      expect(focusTrapSpy.destroy).toHaveBeenCalled();
    }));
  });
});
