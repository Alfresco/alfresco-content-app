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
import { RulesListUiComponent } from './rules-list.ui-component';
import { dummyRules } from '../mock/rules.mock';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CoreTestingModule } from '@alfresco/adf-core';
import { AcaFolderRulesModule } from '@alfresco/aca-folder-rules';

describe('RulesListComponent', () => {
  let component: RulesListUiComponent;
  let fixture: ComponentFixture<RulesListUiComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule, AcaFolderRulesModule],
      declarations: [RulesListUiComponent]
    });

    fixture = TestBed.createComponent(RulesListUiComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should display the list of rules', () => {
    expect(component).toBeTruthy();

    component.rules = dummyRules;

    fixture.detectChanges();

    const rules = debugElement.queryAll(By.css('.aca-rule'));

    expect(rules).toBeTruthy('Could not find rules');
    expect(rules.length).toBe(2, 'Unexpected number of rules');

    const rule = debugElement.query(By.css('.aca-rule:first-child'));
    const title = rule.query(By.css('.rule-info__header__title'));
    const description = rule.query(By.css('p'));
    const toggleBtn = rule.query(By.css('mat-slide-toggle'));

    expect(title.nativeElement.textContent).toBe(dummyRules[0].name);
    expect(toggleBtn).toBeTruthy();
    expect(description.nativeElement.textContent).toBe(dummyRules[0].description);
  });
});
