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

import { RuleSetListUiComponent } from './rule-set-list.ui-component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '@alfresco/adf-core';
import { RuleListUiComponent } from '../rule-list/rule-list.ui-component';
import { RuleListItemUiComponent } from '../rule-list-item/rule-list-item.ui-component';
import { ruleSetsMock } from '../../mock/rule-sets.mock';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { owningFolderIdMock } from '../../mock/node.mock';

describe('RuleSetListUiComponent', () => {
  let fixture: ComponentFixture<RuleSetListUiComponent>;
  let component: RuleSetListUiComponent;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule],
      declarations: [RuleSetListUiComponent, RuleListUiComponent, RuleListItemUiComponent]
    });

    fixture = TestBed.createComponent(RuleSetListUiComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    component.folderId = owningFolderIdMock;
    component.ruleSets = ruleSetsMock;
    fixture.detectChanges();
  });

  it('should display a list of rule sets', () => {
    const ruleSetElements = debugElement.queryAll(By.css(`[data-automation-id="rule-set-list-item"]`));

    expect(ruleSetElements.length).toBe(3);
  });

  it('should show the right message for the right sort of rule set', () => {
    const ruleSetTitleElements = debugElement.queryAll(By.css(`[data-automation-id="rule-set-item-title"]`));

    const innerTextWithoutIcon = (element: HTMLDivElement): string => element.innerText.replace(/(expand_more|chevron_right)$/, '').trim();

    expect(ruleSetTitleElements.length).toBe(3);
    expect(innerTextWithoutIcon(ruleSetTitleElements[0].nativeElement as HTMLDivElement)).toBe(
      'ACA_FOLDER_RULES.RULE_LIST.INHERITED_FROM other-folder-name'
    );
    expect(innerTextWithoutIcon(ruleSetTitleElements[1].nativeElement as HTMLDivElement)).toBe('ACA_FOLDER_RULES.RULE_LIST.OWNED_BY_THIS_FOLDER');
    expect(innerTextWithoutIcon(ruleSetTitleElements[2].nativeElement as HTMLDivElement)).toBe(
      'ACA_FOLDER_RULES.RULE_LIST.LINKED_FROM other-folder-name'
    );
  });
});
