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

import { RuleListUiComponent } from './rule-list.ui-component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '@alfresco/adf-core';
import { ownedRuleSetMock, ruleSetsMock, ruleSetWithLinkMock } from '../../mock/rule-sets.mock';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { owningFolderIdMock } from '../../mock/node.mock';
import { of } from 'rxjs';

describe('RuleListUiComponent', () => {
  let fixture: ComponentFixture<RuleListUiComponent>;
  let component: RuleListUiComponent;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule, RuleListUiComponent]
    });

    fixture = TestBed.createComponent(RuleListUiComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    component.folderId = owningFolderIdMock;
    component.inheritedRuleSets = ruleSetsMock;
  });

  it('should show "Rules from current folder" as a title if the main rule set is owned', () => {
    component.mainRuleSet$ = of(ownedRuleSetMock);
    fixture.detectChanges();

    const mainRuleSetTitleElement = debugElement.query(By.css(`[data-automation-id="main-rule-set-title"]`));
    expect((mainRuleSetTitleElement.nativeElement as HTMLDivElement).innerText.trim()).toBe('ACA_FOLDER_RULES.RULE_LIST.OWNED_RULES');
  });

  it('should show "Rules from linked folder" as a title if the main rule set is linked', () => {
    component.mainRuleSet$ = of(ruleSetWithLinkMock);
    fixture.detectChanges();

    const mainRuleSetTitleElement = debugElement.query(By.css(`[data-automation-id="main-rule-set-title"]`));
    expect((mainRuleSetTitleElement.nativeElement as HTMLDivElement).innerText.trim()).toBe('ACA_FOLDER_RULES.RULE_LIST.LINKED_RULES');
  });
});
