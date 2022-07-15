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

describe('RuleDetailsUiComponent', () => {
  let fixture: ComponentFixture<RuleDetailsUiComponent>;
  let component: RuleDetailsUiComponent;

  const initialValue: Partial<Rule> = {
    id: 'rule-id',
    name: 'Rule name',
    description: 'This is the description of the rule'
  };

  const getHtmlElement = <T>(dataAutomationId: string) =>
    fixture.debugElement.query(By.css(`[data-automation-id="${dataAutomationId}"]`)).nativeElement as T;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule],
      declarations: [RuleDetailsUiComponent]
    });

    fixture = TestBed.createComponent(RuleDetailsUiComponent);
    component = fixture.componentInstance;
  });

  it('should fill the form out with initial values', () => {
    component.initialValue = initialValue;
    fixture.detectChanges();

    const nameInput = getHtmlElement<HTMLInputElement>('rule-details-name-input');
    const descriptionTextarea = getHtmlElement<HTMLTextAreaElement>('rule-details-description-textarea');

    expect(nameInput.value).toBe(initialValue.name);
    expect(descriptionTextarea.value).toBe(initialValue.description);
  });

  it('should be editable if not read-only', () => {
    component.readOnly = false;
    fixture.detectChanges();

    const nameInput = getHtmlElement<HTMLInputElement>('rule-details-name-input');
    const descriptionTextarea = getHtmlElement<HTMLTextAreaElement>('rule-details-description-textarea');

    expect(nameInput.disabled).toBeFalsy();
    expect(descriptionTextarea.disabled).toBeFalsy();
  });

  it('should not be editable if read-only', () => {
    component.readOnly = true;
    fixture.detectChanges();

    const nameInput = getHtmlElement<HTMLInputElement>('rule-details-name-input');
    const descriptionTextarea = getHtmlElement<HTMLTextAreaElement>('rule-details-description-textarea');

    expect(nameInput.disabled).toBeTruthy();
    expect(descriptionTextarea.disabled).toBeTruthy();
  });
});
