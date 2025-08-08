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
import { RuleSetPickerOptions, RuleSetPickerSmartComponent } from './rule-set-picker.smart-component';
import { NoopTranslateModule, NotificationService, provideCoreAuthTesting, UnitTestingUtils } from '@alfresco/adf-core';
import { folderToLinkMock, otherFolderMock } from '../mock/node.mock';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ruleSetWithLinkMock, ruleSetWithNoRulesToLinkMock, ruleSetWithOwnedRulesToLinkMock } from '../mock/rule-sets.mock';
import { ContentApiService } from '@alfresco/aca-shared';
import {
  AlfrescoApiService,
  AlfrescoApiServiceMock,
  ContentNodeSelectorPanelComponent,
  NodeEntryEvent,
  SitesService
} from '@alfresco/adf-content-services';
import { provideRouter } from '@angular/router';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { RuleSet } from '../model/rule-set.model';

@Component({
  selector: 'adf-content-node-selector-panel',
  template: '<div data-automation-id="mock-content-node-selector"></div>',
  standalone: true
})
class MockContentNodeSelectorPanelComponent {
  @Input() currentFolderId: string;
  @Output() folderLoaded = new EventEmitter<void>();
  @Output() navigationChange = new EventEmitter<NodeEntryEvent>();
  @Output() siteChange = new EventEmitter<string>();
}

describe('RuleSetPickerSmartComponent', () => {
  let fixture: ComponentFixture<RuleSetPickerSmartComponent>;
  let component: RuleSetPickerSmartComponent;

  let loadRuleSetsSpy: jasmine.Spy;
  let sitesService: SitesService;
  let unitTestingUtils: UnitTestingUtils;

  const dialogRef = {
    close: jasmine.createSpy('close'),
    open: jasmine.createSpy('open')
  };

  const dialogOptions: RuleSetPickerOptions = {
    nodeId: 'folder-1-id',
    defaultNodeId: 'folder-1-id'
  };

  const getItems = (): DebugElement[] => unitTestingUtils.getAllByCSS('.aca-rule-set-picker__content__rule-list aca-rule-list-item');
  const getEmptyList = (): DebugElement => unitTestingUtils.getByCSS('adf-empty-content');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, RuleSetPickerSmartComponent],
      providers: [
        provideRouter([]),
        provideCoreAuthTesting(),
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
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
    }).overrideComponent(RuleSetPickerSmartComponent, {
      remove: {
        imports: [ContentNodeSelectorPanelComponent]
      },
      add: {
        imports: [MockContentNodeSelectorPanelComponent]
      }
    });

    fixture = TestBed.createComponent(RuleSetPickerSmartComponent);
    component = fixture.componentInstance;
    sitesService = TestBed.inject(SitesService);
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);

    loadRuleSetsSpy = spyOn(component.folderRuleSetsService, 'loadRuleSets');
    spyOn(sitesService, 'getSites');
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set true to rulesLoading$ when rulesLoading or folderLoading is true', (done) => {
    component.setFolderLoading(true);

    component.rulesLoading$.subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
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

    expect(getItems().length).toBe(0);
    expect(getEmptyList()).not.toBeNull();
  });

  it('should show an empty list message if a selected folder has linked rules', () => {
    component.mainRuleSet$ = of(ruleSetWithLinkMock);
    component.rulesLoading$ = of(false);
    component.onNodeSelect([folderToLinkMock]);
    fixture.detectChanges();

    expect(getItems().length).toBe(0);
    expect(getEmptyList()).not.toBeNull();
  });

  it('should show a list of items if a selected folder has owned rules', () => {
    component.mainRuleSet$ = of(ruleSetWithOwnedRulesToLinkMock);
    component.rulesLoading$ = of(false);
    component.onNodeSelect([folderToLinkMock]);
    fixture.detectChanges();

    expect(getItems().length).toBe(2);
    expect(getEmptyList()).toBeNull();
  });

  describe('onSubmit', () => {
    let deleteRuleSetLinkSpy: jasmine.Spy<(nodeId: string, ruleSetId: string) => Promise<void>>;
    let createRuleSetLinkSpy: jasmine.Spy<(nodeId: string, linkedNodeId: string) => Promise<void>>;

    beforeEach(() => {
      deleteRuleSetLinkSpy = spyOn(component.folderRuleSetsService, 'deleteRuleSetLink').and.returnValue(Promise.resolve());
      createRuleSetLinkSpy = spyOn(component.folderRuleSetsService, 'createRuleSetLink').and.returnValue(Promise.resolve());
      component['selectedNodeId'] = 'selected-node-id';
    });

    it('should set isBusy to true and create rule set link when no existing rule set', fakeAsync(() => {
      component.existingRuleSet = null;

      component.onSubmit();

      expect(component.isBusy).toBe(true);
      expect(deleteRuleSetLinkSpy).not.toHaveBeenCalled();

      tick();

      expect(createRuleSetLinkSpy).toHaveBeenCalledWith(component.nodeId, 'selected-node-id');
      expect(dialogRef.close).toHaveBeenCalledWith(true);
      expect(component.isBusy).toBe(false);
    }));

    it('should delete existing rule set link then create new one when existing rule set provided', fakeAsync(() => {
      component.existingRuleSet = { id: 'existing-rule-set-id' } as RuleSet;

      component.onSubmit();

      expect(component.isBusy).toBe(true);
      expect(deleteRuleSetLinkSpy).toHaveBeenCalledWith(component.nodeId, 'existing-rule-set-id');

      tick();

      expect(createRuleSetLinkSpy).toHaveBeenCalledWith(component.nodeId, 'selected-node-id');
      expect(dialogRef.close).toHaveBeenCalledWith(true);
      expect(component.isBusy).toBe(false);
    }));

    it('should handle error and call handleError when deleteRuleSetLink fails', fakeAsync(() => {
      const notificationService = TestBed.inject(NotificationService);
      spyOn(notificationService, 'showError');

      deleteRuleSetLinkSpy.and.returnValue(Promise.reject(new Error('delete error')));
      component.existingRuleSet = { id: 'existing-rule-set-id' } as RuleSet;

      component.onSubmit();
      tick();

      expect(component.isBusy).toBe(false);
      expect(notificationService.showError).toHaveBeenCalledWith('ACA_FOLDER_RULES.LINK_RULES_DIALOG.ERRORS.REQUEST_FAILED');
    }));
  });
});
