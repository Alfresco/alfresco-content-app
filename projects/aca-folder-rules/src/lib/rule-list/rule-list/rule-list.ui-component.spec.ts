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
import { RuleListUiComponent } from './rule-list.ui-component';
import { dummyRules } from '../../mock/rules.mock';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CoreTestingModule } from '@alfresco/adf-core';
import { AcaFolderRulesModule } from '@alfresco/aca-folder-rules';

describe('RuleListComponent', () => {
  let component: RuleListUiComponent;
  let fixture: ComponentFixture<RuleListUiComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule, AcaFolderRulesModule],
      declarations: [RuleListUiComponent]
    });

    fixture = TestBed.createComponent(RuleListUiComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should display the list of rules', () => {
    expect(component).toBeTruthy();

    component.rules = dummyRules;

    fixture.detectChanges();

    const rules = debugElement.queryAll(By.css('.aca-rule-list-item'));

    expect(rules).toBeTruthy('Could not find rules');
    expect(rules.length).toBe(2, 'Unexpected number of rules');

    const rule = debugElement.query(By.css('.aca-rule-list-item:first-child'));
    const name = rule.query(By.css('.aca-rule-list-item__header__name'));
    const description = rule.query(By.css('.aca-rule-list-item__description'));
    const toggleBtn = rule.query(By.css('mat-slide-toggle'));

    expect(name.nativeElement.textContent).toBe(dummyRules[0].name);
    expect(toggleBtn).toBeTruthy();
    expect(description.nativeElement.textContent).toBe(dummyRules[0].description);
  });
});
