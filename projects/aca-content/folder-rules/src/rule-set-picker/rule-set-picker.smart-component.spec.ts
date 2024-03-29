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
import { RuleSetPickerOptions, RuleSetPickerSmartComponent } from './rule-set-picker.smart-component';
import { CoreTestingModule } from '@alfresco/adf-core';
import { folderToLinkMock, otherFolderMock } from '../mock/node.mock';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FolderRuleSetsService } from '../services/folder-rule-sets.service';
import { of } from 'rxjs';
import { ownedRuleSetMock, ruleSetWithLinkMock, ruleSetWithNoRulesToLinkMock, ruleSetWithOwnedRulesToLinkMock } from '../mock/rule-sets.mock';
import { ContentApiService } from '@alfresco/aca-shared';
import { By } from '@angular/platform-browser';

describe('RuleSetPickerSmartComponent', () => {
  let fixture: ComponentFixture<RuleSetPickerSmartComponent>;
  let component: RuleSetPickerSmartComponent;
  let folderRuleSetsService: FolderRuleSetsService;

  let loadRuleSetsSpy: jasmine.Spy;
  let callApiSpy: jasmine.Spy;

  const dialogRef = {
    close: jasmine.createSpy('close'),
    open: jasmine.createSpy('open')
  };

  const dialogOptions: RuleSetPickerOptions = {
    nodeId: 'folder-1-id',
    defaultNodeId: 'folder-1-id'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule, RuleSetPickerSmartComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogOptions },
        {
          provide: ContentApiService,
          useValue: {
            getNode: () => {
              return of({ entry: folderToLinkMock });
            },
            getNodeInfo: () => {
              return of(otherFolderMock);
            }
          }
        }
      ]
    });

    folderRuleSetsService = TestBed.inject(FolderRuleSetsService);
    fixture = TestBed.createComponent(RuleSetPickerSmartComponent);
    component = fixture.componentInstance;
    component['folderRuleSetsService'] = folderRuleSetsService;

    loadRuleSetsSpy = spyOn(folderRuleSetsService, 'loadRuleSets').and.callThrough();
    callApiSpy = spyOn<any>(folderRuleSetsService, 'callApi');
    callApiSpy
      .withArgs(`/nodes/${dialogOptions.nodeId}/rule-sets?include=isLinkedTo,owningFolder,linkedToBy&skipCount=0&maxItems=100`, 'GET')
      .and.returnValue(Promise.resolve(ownedRuleSetMock))
      .withArgs(`/nodes/${dialogOptions.nodeId}/rule-sets/-default-?include=isLinkedTo,owningFolder,linkedToBy`, 'GET')
      .and.returnValue(Promise.resolve(ownedRuleSetMock))
      .withArgs(`/nodes/${folderToLinkMock.id}?include=path%2Cproperties%2CallowableOperations%2Cpermissions`, 'GET')
      .and.returnValue(Promise.resolve({ entry: folderToLinkMock }));
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should load the rule sets of a node once it has been selected', () => {
    expect(loadRuleSetsSpy).not.toHaveBeenCalled();
    component.onNodeSelect([folderToLinkMock]);
    expect(loadRuleSetsSpy).toHaveBeenCalledWith(folderToLinkMock.id, false);
    component.onNodeSelect([folderToLinkMock]);
    expect(loadRuleSetsSpy).toHaveBeenCalledTimes(1);
  });

  it('should show an empty list message if a selected folder has no rules', () => {
    component.mainRuleSet$ = of(ruleSetWithNoRulesToLinkMock);
    component.rulesLoading$ = of(false);
    component.onNodeSelect([folderToLinkMock]);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.aca-rule-set-picker__content__rule-list aca-rule-list-item'));
    expect(items.length).toBe(0);

    const emptyList = fixture.debugElement.query(By.css('adf-empty-content'));
    expect(emptyList).not.toBeNull();
  });

  it('should show an empty list message if a selected folder has linked rules', () => {
    component.mainRuleSet$ = of(ruleSetWithLinkMock);
    component.rulesLoading$ = of(false);
    component.onNodeSelect([folderToLinkMock]);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.aca-rule-set-picker__content__rule-list aca-rule-list-item'));
    expect(items.length).toBe(0);

    const emptyList = fixture.debugElement.query(By.css('adf-empty-content'));
    expect(emptyList).not.toBeNull();
  });

  it('should show a list of items if a selected folder has owned rules', () => {
    component.mainRuleSet$ = of(ruleSetWithOwnedRulesToLinkMock);
    component.rulesLoading$ = of(false);
    component.onNodeSelect([folderToLinkMock]);
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.aca-rule-set-picker__content__rule-list aca-rule-list-item'));
    expect(items.length).toBe(2);

    const emptyList = fixture.debugElement.query(By.css('adf-empty-content'));
    expect(emptyList).toBeNull();
  });
});
