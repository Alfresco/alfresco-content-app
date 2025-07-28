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
import { ManageRulesSmartComponent } from './manage-rules.smart-component';
import { FolderRulesService } from '../services/folder-rules.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';
import {
  inheritedRuleSetMock,
  inheritedRuleSetWithEmptyRulesMock,
  inheritedRuleSetWithOnlyDisabledRulesMock,
  ownedRuleSetMock,
  ruleSetWithLinkMock
} from '../mock/rule-sets.mock';
import { owningFolderIdMock, owningFolderMock } from '../mock/node.mock';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActionsService } from '../services/actions.service';
import { FolderRuleSetsService } from '../services/folder-rule-sets.service';
import { ruleMock, ruleSettingsMock } from '../mock/rules.mock';
import { AppService } from '@alfresco/aca-shared';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatProgressBarHarness } from '@angular/material/progress-bar/testing';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';
import { provideHttpClient } from '@angular/common/http';
import { NoopTranslateModule, NotificationService, UnitTestingUtils } from '@alfresco/adf-core';
import { provideMockStore } from '@ngrx/store/testing';
import { Location } from '@angular/common';
import { DebugElement } from '@angular/core';
import { EditRuleDialogUiComponent } from '../rule-details/edit-rule-dialog.ui-component';
import { Rule } from '../model/rule.model';

describe('ManageRulesSmartComponent', () => {
  let fixture: ComponentFixture<ManageRulesSmartComponent>;
  let component: ManageRulesSmartComponent;
  let loader: HarnessLoader;
  let dialog: MatDialog;
  let unitTestingUtils: UnitTestingUtils;

  let folderRuleSetsService: FolderRuleSetsService;
  let folderRulesService: FolderRulesService;
  let actionsService: ActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, ManageRulesSmartComponent],
      providers: [
        provideHttpClient(),
        {
          provide: AppService,
          useValue: {
            appNavNarMode$: new BehaviorSubject('expanded'),
            toggleAppNavBar$: new Subject()
          }
        },
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        provideMockStore({}),
        { provide: ActivatedRoute, useValue: { params: of({ nodeId: owningFolderIdMock }) } }
      ]
    });

    fixture = TestBed.createComponent(ManageRulesSmartComponent);
    dialog = TestBed.inject(MatDialog);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement, loader);

    folderRuleSetsService = TestBed.inject(FolderRuleSetsService);
    folderRulesService = TestBed.inject(FolderRulesService);
    actionsService = TestBed.inject(ActionsService);

    spyOn(actionsService, 'loadActionDefinitions').and.stub();
    spyOn(folderRulesService, 'getRuleSettings').and.returnValue(Promise.resolve(ruleSettingsMock));
    spyOn(folderRuleSetsService, 'loadRuleSets');
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });

  it('should call location.back() when goBack is called', () => {
    const locationService = TestBed.inject(Location);
    spyOn(locationService, 'back');
    component.goBack();

    expect(locationService.back).toHaveBeenCalled();
  });

  it('should call folderRulesService.selectRule with provided rule on rule select', () => {
    const testRule = ruleMock('test-rule-1');
    spyOn(folderRulesService, 'selectRule');

    component.onSelectRule(testRule);

    expect(folderRulesService.selectRule).toHaveBeenCalledWith(testRule);
  });

  it('should call loadMoreInheritedRuleSets on load more rule sets', () => {
    spyOn(folderRuleSetsService, 'loadMoreInheritedRuleSets');
    component.onLoadMoreRuleSets();
    expect(folderRuleSetsService.loadMoreInheritedRuleSets).toHaveBeenCalled();
  });

  it('should load rules for the given rule set', () => {
    spyOn(folderRulesService, 'loadRules');
    const ruleSet = inheritedRuleSetMock;
    component.onLoadMoreRules(ruleSet);
    expect(folderRulesService.loadRules).toHaveBeenCalledWith(ruleSet);
  });

  it('should show a list of rule sets and rules', () => {
    folderRuleSetsService.folderInfo$ = of(owningFolderMock);
    folderRuleSetsService.mainRuleSet$ = of(ownedRuleSetMock);
    folderRuleSetsService.inheritedRuleSets$ = of([inheritedRuleSetMock]);
    folderRuleSetsService.isLoading$ = of(false);
    folderRulesService.selectedRule$ = of(ruleMock('owned-rule-1'));
    actionsService.loading$ = of(false);

    fixture.detectChanges();

    expect(component).toBeTruthy();

    expect(folderRuleSetsService.loadRuleSets).toHaveBeenCalledOnceWith(component.nodeId);

    const ruleGroupingSections = unitTestingUtils.getAllByCSS(`[data-automation-id="rule-list-item"]`);
    const rules = unitTestingUtils.getAllByCSS('.aca-rule-list-item');
    const ruleDetails = unitTestingUtils.getByCSS('aca-rule-details');
    const deleteRuleBtn = unitTestingUtils.getByCSS('#delete-rule-btn');

    expect(ruleGroupingSections.length).toBe(2, 'unexpected number of rule sections');
    expect(rules.length).toBe(4, 'unexpected number of aca-rule-list-item');
    expect(ruleDetails).toBeTruthy('aca-rule-details was not rendered');
    expect(deleteRuleBtn).toBeTruthy('no delete rule button');
  });

  it('should show adf-empty-content if node has no rules defined yet', () => {
    folderRuleSetsService.folderInfo$ = of(owningFolderMock);
    folderRuleSetsService.mainRuleSet$ = of(null);
    folderRuleSetsService.inheritedRuleSets$ = of([inheritedRuleSetWithEmptyRulesMock]);
    folderRuleSetsService.isLoading$ = of(false);
    actionsService.loading$ = of(false);

    fixture.detectChanges();

    expect(component).toBeTruthy();

    const adfEmptyContent = unitTestingUtils.getByCSS('adf-empty-content');
    const ruleSets = unitTestingUtils.getAllByCSS(`[data-automation-id="rule-set-list-item"]`);
    const ruleDetails = unitTestingUtils.getByCSS('aca-rule-details');

    expect(adfEmptyContent).toBeTruthy();
    expect(ruleSets.length).toBe(0);
    expect(ruleDetails).toBeFalsy();
  });

  it('should show adf-empty-content if there are only inherited disabled rules', () => {
    folderRuleSetsService.folderInfo$ = of(owningFolderMock);
    folderRuleSetsService.mainRuleSet$ = of(null);
    folderRuleSetsService.inheritedRuleSets$ = of([inheritedRuleSetWithOnlyDisabledRulesMock]);
    folderRuleSetsService.isLoading$ = of(false);
    actionsService.loading$ = of(false);

    fixture.detectChanges();

    expect(component).toBeTruthy();

    const adfEmptyContent = unitTestingUtils.getByCSS('adf-empty-content');
    const ruleSets = unitTestingUtils.getAllByCSS(`[data-automation-id="rule-set-list-item"]`);
    const ruleDetails = unitTestingUtils.getByCSS('aca-rule-details');

    expect(adfEmptyContent).toBeTruthy();
    expect(ruleSets.length).toBe(0);
    expect(ruleDetails).toBeFalsy();
  });

  it('should only show aca-generic-error if the non-existing node was provided', () => {
    folderRuleSetsService.folderInfo$ = of(null);
    folderRuleSetsService.mainRuleSet$ = of(null);
    folderRuleSetsService.inheritedRuleSets$ = of([]);
    folderRuleSetsService.isLoading$ = of(false);
    actionsService.loading$ = of(false);

    fixture.detectChanges();

    expect(component).toBeTruthy();

    const acaGenericError = unitTestingUtils.getByCSS('aca-generic-error');
    const rules = unitTestingUtils.getByCSS('.aca-rule-list-item');
    const ruleDetails = unitTestingUtils.getByCSS('aca-rule-details');

    expect(acaGenericError).toBeTruthy();
    expect(rules).toBeFalsy();
    expect(ruleDetails).toBeFalsy();
  });

  it('should only show progress bar while loading', async () => {
    folderRuleSetsService.folderInfo$ = of(null);
    folderRuleSetsService.mainRuleSet$ = of(null);
    folderRuleSetsService.inheritedRuleSets$ = of([]);
    folderRuleSetsService.isLoading$ = of(true);
    actionsService.loading$ = of(true);

    fixture.detectChanges();

    expect(component).toBeTruthy();

    const matProgressBar = loader.getHarness(MatProgressBarHarness);
    const rules = unitTestingUtils.getByCSS('.aca-rule-list-item');
    const ruleDetails = unitTestingUtils.getByCSS('aca-rule-details');

    expect(matProgressBar).toBeTruthy();
    expect(rules).toBeFalsy();
    expect(ruleDetails).toBeFalsy();
  });

  it('should call deleteRule() if confirmation dialog returns true', () => {
    folderRuleSetsService.folderInfo$ = of(owningFolderMock);
    folderRuleSetsService.mainRuleSet$ = of(ownedRuleSetMock);
    folderRuleSetsService.inheritedRuleSets$ = of([inheritedRuleSetMock]);
    folderRuleSetsService.isLoading$ = of(false);
    folderRulesService.selectedRule$ = of(ruleMock('owned-rule-1'));
    folderRulesService.deletedRuleId$ = of(null);
    actionsService.loading$ = of(false);

    fixture.detectChanges();

    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<boolean>);
    const deleteRuleSpy = spyOn(folderRulesService, 'deleteRule');

    fixture.detectChanges();
    expect(component).toBeTruthy('expected component');

    const rules = unitTestingUtils.getAllByCSS('.aca-rule-list-item');
    const ruleDetails = unitTestingUtils.getByCSS('aca-rule-details');

    component.onRuleDeleteButtonClicked(ruleMock('owned-rule-1'));

    fixture.detectChanges();
    folderRulesService.deletedRuleId$ = of('owned-rule-1-id');

    expect(dialog.open).toHaveBeenCalled();
    expect(deleteRuleSpy).toHaveBeenCalled();
    expect(rules).toBeTruthy('expected rules');
    expect(ruleDetails).toBeTruthy('expected ruleDetails');
  });

  it('should refresh main rule set', () => {
    folderRuleSetsService.folderInfo$ = of(owningFolderMock);
    folderRuleSetsService.mainRuleSet$ = of(ownedRuleSetMock);
    folderRuleSetsService.inheritedRuleSets$ = of([inheritedRuleSetMock]);
    folderRuleSetsService.isLoading$ = of(false);
    folderRulesService.selectedRule$ = of(ruleMock('owned-rule-1'));
    folderRulesService.deletedRuleId$ = of(null);
    actionsService.loading$ = of(false);

    fixture.detectChanges();

    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<boolean>);
    const refreshMainRuleSetSpy = spyOn(folderRuleSetsService, 'refreshMainRuleSet');

    fixture.detectChanges();
    expect(component).toBeTruthy('expected component');

    const rules = unitTestingUtils.getAllByCSS('.aca-rule-list-item');
    const ruleDetails = unitTestingUtils.getByCSS('aca-rule-details');

    component.openLinkRulesDialog();

    fixture.detectChanges();
    folderRulesService.deletedRuleId$ = of('owned-rule-1-id');

    expect(dialog.open).toHaveBeenCalled();
    expect(refreshMainRuleSetSpy).toHaveBeenCalled();
    expect(rules).toBeTruthy('expected rules');
    expect(ruleDetails).toBeTruthy('expected ruleDetails');
  });

  it('should onRuleSetUnlinkClicked', () => {
    folderRuleSetsService.folderInfo$ = of(owningFolderMock);
    folderRuleSetsService.mainRuleSet$ = of(ownedRuleSetMock);
    folderRuleSetsService.inheritedRuleSets$ = of([inheritedRuleSetMock]);
    folderRuleSetsService.isLoading$ = of(false);
    folderRulesService.selectedRule$ = of(ruleMock('owned-rule-1'));
    folderRulesService.deletedRuleId$ = of(null);
    actionsService.loading$ = of(false);

    fixture.detectChanges();

    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<boolean>);
    const deleteRuleSetLinkSpy = spyOn(folderRuleSetsService, 'deleteRuleSetLink');

    fixture.detectChanges();
    expect(component).toBeTruthy('expected component');

    const rules = unitTestingUtils.getAllByCSS('.aca-rule-list-item');
    const ruleDetails = unitTestingUtils.getByCSS('aca-rule-details');

    component.onRuleSetUnlinkClicked(ruleSetWithLinkMock);

    fixture.detectChanges();
    folderRulesService.deletedRuleId$ = of('owned-rule-1-id');

    expect(dialog.open).toHaveBeenCalled();
    expect(deleteRuleSetLinkSpy).toHaveBeenCalled();
    expect(rules).toBeTruthy('expected rules');
    expect(ruleDetails).toBeTruthy('expected ruleDetails');
  });

  describe('EditRuleDialog launching and submission', () => {
    let submit$: Subject<Partial<Rule>>;
    let dialogRefMock: { componentInstance: { submitted: Subject<Partial<Rule>> }; close: jasmine.Spy };

    beforeEach(() => {
      submit$ = new Subject<any>();
      dialogRefMock = {
        componentInstance: { submitted: submit$ },
        close: jasmine.createSpy('close')
      };
      spyOn(dialog, 'open').and.returnValue(dialogRefMock as unknown as MatDialogRef<EditRuleDialogUiComponent, boolean>);
    });

    it('should open EditRuleDialogUiComponent with correct config', () => {
      const model = { name: 'bar' } as Rule;
      component.openCreateUpdateRuleDialog(model);

      expect(dialog.open).toHaveBeenCalled();
    });

    it('should create a new rule and close dialog when submitted without id', async () => {
      const newRuleParams = { name: 'NewRule' } as Rule;
      const createdRule = ruleMock('new-id');
      spyOn(folderRulesService, 'createRule').and.returnValue(Promise.resolve(createdRule));
      const addOrUpdateSpy = spyOn(folderRuleSetsService, 'addOrUpdateRuleInMainRuleSet');

      component.openCreateUpdateRuleDialog();
      submit$.next(newRuleParams);
      await Promise.resolve();

      expect(folderRulesService.createRule).toHaveBeenCalledWith(component.nodeId, newRuleParams);
      expect(addOrUpdateSpy).toHaveBeenCalledWith(createdRule);
    });

    it('should update existing rule when submitted with id', async () => {
      const updatedRuleParams = { id: '123', name: 'Test' } as Rule;
      const updatedRule = ruleMock('123');
      spyOn(folderRulesService, 'updateRule').and.returnValue(Promise.resolve(updatedRule));
      const addOrUpdateSpy = spyOn(folderRuleSetsService, 'addOrUpdateRuleInMainRuleSet');

      component.openCreateUpdateRuleDialog();
      submit$.next(updatedRuleParams);
      await Promise.resolve();

      expect(folderRulesService.updateRule).toHaveBeenCalled();
      expect(addOrUpdateSpy).toHaveBeenCalledWith(updatedRule);
    });

    it('should show error notification if submission fails', fakeAsync(() => {
      const notificationService = TestBed.inject(NotificationService);
      const params = { name: 'Bad' } as Rule;
      const error = { response: { body: { error: { errorKey: 'ERROR_KEY' } } } };
      spyOn(folderRulesService, 'createRule').and.returnValue(Promise.reject(error));
      spyOn(notificationService, 'showError');

      component.openCreateUpdateRuleDialog();
      submit$.next(params);
      tick();

      expect(notificationService.showError).toHaveBeenCalledWith('ERROR_KEY');
      expect(dialogRefMock.close).not.toHaveBeenCalled();
    }));
  });

  describe('Create rule & link rules buttons visibility', () => {
    const getCreateButton = (): DebugElement => unitTestingUtils.getByDataAutomationId('manage-rules-create-button');
    const getLinkButton = (): DebugElement => unitTestingUtils.getByDataAutomationId('manage-rules-link-button');

    beforeEach(() => {
      folderRuleSetsService.folderInfo$ = of(owningFolderMock);
      folderRuleSetsService.inheritedRuleSets$ = of([]);
      folderRuleSetsService.isLoading$ = of(false);
      actionsService.loading$ = of(false);
    });

    it('should show the create rule button if there is no main rule set', () => {
      folderRuleSetsService.mainRuleSet$ = of(null);
      fixture.detectChanges();

      expect(getCreateButton()).toBeTruthy();
    });

    it('should show the link rules button if there is no main rule set', () => {
      folderRuleSetsService.mainRuleSet$ = of(null);
      fixture.detectChanges();

      expect(getLinkButton()).toBeTruthy();
    });

    it('should show the create rule button if the main rule set is owned', () => {
      folderRuleSetsService.mainRuleSet$ = of(ownedRuleSetMock);
      fixture.detectChanges();

      expect(getCreateButton()).toBeTruthy();
    });

    it('should not show the create rule button if the main rule set is linked', () => {
      folderRuleSetsService.mainRuleSet$ = of(ruleSetWithLinkMock);
      fixture.detectChanges();

      expect(getCreateButton()).toBeFalsy();
    });

    it('should not show the link rules button if the folder has a main rule set', () => {
      folderRuleSetsService.mainRuleSet$ = of(ownedRuleSetMock);
      fixture.detectChanges();

      expect(getLinkButton()).toBeFalsy();
    });
  });

  describe('Rule inheritance toggle button', () => {
    beforeEach(() => {
      folderRuleSetsService.folderInfo$ = of(owningFolderMock);
      folderRuleSetsService.inheritedRuleSets$ = of([]);
      folderRuleSetsService.isLoading$ = of(false);
      actionsService.loading$ = of(false);
    });

    it('should show inherit rules toggle button, and disable it when isInheritanceToggleDisabled = true', async () => {
      fixture.detectChanges();

      const createButton = await loader.getHarness(
        MatSlideToggleHarness.with({ selector: `[data-automation-id="manage-rules-inheritance-toggle-button"]` })
      );
      expect(createButton).toBeTruthy();

      component.isInheritanceToggleDisabled = true;
      fixture.detectChanges();

      expect(await createButton.isDisabled()).toBeTrue();
    });

    it('should call onInheritanceToggleChange() on change', fakeAsync(() => {
      const updateRuleSettingsSpy = spyOn(folderRulesService, 'updateRuleSettings').and.returnValue(Promise.resolve(ruleSettingsMock));

      fixture.detectChanges();

      const inheritanceToggleBtn = unitTestingUtils.getByDataAutomationId('manage-rules-inheritance-toggle-button');

      inheritanceToggleBtn.nativeElement.dispatchEvent(new Event('change'));

      tick();
      fixture.detectChanges();

      expect(updateRuleSettingsSpy).toHaveBeenCalled();
      expect(folderRuleSetsService.loadRuleSets).toHaveBeenCalled();
      expect(folderRuleSetsService.loadRuleSets).toHaveBeenCalledWith(component.nodeId);
      expect(component.isInheritanceToggleDisabled).toBeFalse();
    }));

    it('should update rule enabled state and add or update it in main rule set', fakeAsync(() => {
      const original = ruleMock('test');
      const toggled: Rule = { ...original, isEnabled: !original.isEnabled };
      spyOn(folderRulesService, 'updateRule').and.returnValue(Promise.resolve(toggled));
      const addOrUpdateSpy = spyOn(folderRuleSetsService, 'addOrUpdateRuleInMainRuleSet');
      component.nodeId = 'node-123';

      component.onRuleEnabledToggle(original, toggled.isEnabled);
      tick();

      expect(folderRulesService.updateRule).toHaveBeenCalledWith('node-123', original.id, { ...original, isEnabled: toggled.isEnabled });
      expect(addOrUpdateSpy).toHaveBeenCalledWith(toggled);
    }));
  });
});
