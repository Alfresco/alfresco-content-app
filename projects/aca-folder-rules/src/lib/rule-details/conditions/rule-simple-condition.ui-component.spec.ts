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
import { RuleSimpleConditionUiComponent } from './rule-simple-condition.ui-component';
import { CoreTestingModule } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { simpleConditionUnknownFieldMock } from '../../mock/conditions.mock';

describe('RuleSimpleConditionUiComponent', () => {
  let fixture: ComponentFixture<RuleSimpleConditionUiComponent>;

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
      imports: [CoreTestingModule],
      declarations: [RuleSimpleConditionUiComponent]
    });

    fixture = TestBed.createComponent(RuleSimpleConditionUiComponent);
  });

  it('should default the field to the name, the comparator to equals and the value empty', () => {
    fixture.detectChanges();

    expect(getByDataAutomationId('field-select').componentInstance.value).toBe('cm:name');
    expect(getByDataAutomationId('comparator-select').componentInstance.value).toBe('equals');
    expect(getByDataAutomationId('value-input').nativeElement.value).toBe('');
  });

  it('should hide the comparator select box if the type of the field is special', () => {
    fixture.detectChanges();
    const comparatorFormField = getByDataAutomationId('comparator-form-field').nativeElement;

    expect(fixture.componentInstance.isComparatorHidden).toBeFalsy();
    expect(getComputedStyle(comparatorFormField).display).not.toBe('none');

    changeMatSelectValue('field-select', 'category');

    expect(fixture.componentInstance.isComparatorHidden).toBeTruthy();
    expect(getComputedStyle(comparatorFormField).display).toBe('none');
  });

  it('should set the comparator to equals if the field is set to a type with different comparators', () => {
    const onChangeFieldSpy = spyOn(fixture.componentInstance, 'onChangeField').and.callThrough();
    fixture.detectChanges();
    changeMatSelectValue('comparator-select', 'contains');

    expect(getByDataAutomationId('comparator-select').componentInstance.value).toBe('contains');
    changeMatSelectValue('field-select', 'mimetype');

    expect(onChangeFieldSpy).toHaveBeenCalledTimes(1);
    expect(getByDataAutomationId('comparator-select').componentInstance.value).toBe('contains');
    changeMatSelectValue('field-select', 'size');

    expect(onChangeFieldSpy).toHaveBeenCalledTimes(2);
    expect(getByDataAutomationId('comparator-select').componentInstance.value).toBe('equals');
  });

  it('should display an additional option for a currently selected unknown field', () => {
    fixture.componentInstance.writeValue(simpleConditionUnknownFieldMock);
    fixture.detectChanges();

    expect(getByDataAutomationId('field-select').componentInstance.value).toBe(simpleConditionUnknownFieldMock.field);
    const matSelect = getByDataAutomationId('field-select').nativeElement;
    matSelect.click();
    fixture.detectChanges();

    const unknownOptionMatOption = getByDataAutomationId('unknown-field-option');
    expect(unknownOptionMatOption).not.toBeNull();
    expect((unknownOptionMatOption.nativeElement as HTMLElement).innerText.trim()).toBe(simpleConditionUnknownFieldMock.field);
  });

  it('should remove the option for the unknown field as soon as another option is selected', () => {
    fixture.componentInstance.writeValue(simpleConditionUnknownFieldMock);
    fixture.detectChanges();
    changeMatSelectValue('field-select', 'cm:name');
    const matSelect = getByDataAutomationId('field-select').nativeElement;
    matSelect.click();
    fixture.detectChanges();

    const unknownOptionMatOption = getByDataAutomationId('unknown-field-option');
    expect(unknownOptionMatOption).toBeNull();
  });
});
