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
import { ManageRulesSmartComponent } from './manage-rules.smart-component';
import { DebugElement, Predicate } from '@angular/core';
import { CoreTestingModule } from '@alfresco/adf-core';
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
import { By } from '@angular/platform-browser';
import { getOwningFolderEntryMock, owningFolderIdMock, owningFolderMock } from '../mock/node.mock';
import { MatDialog } from '@angular/material/dialog';
import { ActionsService } from '../services/actions.service';
import { FolderRuleSetsService } from '../services/folder-rule-sets.service';
import { ruleMock, ruleSettingsMock } from '../mock/rules.mock';
import { Store } from '@ngrx/store';
import { AppService } from '@alfresco/aca-shared';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatProgressBarHarness } from '@angular/material/progress-bar/testing';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';

describe('ManageRulesSmartComponent', () => {
  let fixture: ComponentFixture<ManageRulesSmartComponent>;
  let component: ManageRulesSmartComponent;
  let debugElement: DebugElement;
  let loader: HarnessLoader;

  let folderRuleSetsService: FolderRuleSetsService;
  let folderRulesService: FolderRulesService;
  let actionsService: ActionsService;
  let callApiSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule, ManageRulesSmartComponent],
      providers: [
        {
          provide: AppService,
          useValue: {
            appNavNarMode$: new BehaviorSubject('expanded'),
            toggleAppNavBar$: new Subject()
          }
        },
        { provide: Store, useValue: { dispatch: () => {} } },
        { provide: ActivatedRoute, useValue: { params: of({ nodeId: owningFolderIdMock }) } }
      ]
    });

    fixture = TestBed.createComponent(ManageRulesSmartComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    loader = TestbedHarnessEnvironment.loader(fixture);

    folderRuleSetsService = TestBed.inject(FolderRuleSetsService);
    folderRulesService = TestBed.inject(FolderRulesService);
    actionsService = TestBed.inject(ActionsService);

    spyOn(actionsService, 'loadActionDefinitions').and.stub();
    spyOn(folderRulesService, 'getRuleSettings').and.returnValue(Promise.resolve(ruleSettingsMock));
    callApiSpy = spyOn<any>(folderRuleSetsService, 'callApi');
    callApiSpy
      .withArgs(`/nodes/${owningFolderIdMock}/rule-sets?include=isLinkedTo,owningFolder,linkedToBy&skipCount=0&maxItems=100`, 'GET')
      .and.returnValue(Promise.resolve(ownedRuleSetMock))
      .withArgs(`/nodes/${owningFolderIdMock}/rule-sets/-default-?include=isLinkedTo,owningFolder,linkedToBy`, 'GET')
      .and.returnValue(Promise.resolve(ownedRuleSetMock))
      .withArgs(`/nodes/${owningFolderIdMock}?include=path%2Cproperties%2CallowableOperations%2Cpermissions`, 'GET')
      .and.returnValue(Promise.resolve(getOwningFolderEntryMock));
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should show a list of rule sets and rules', () => {
    const loadRuleSetsSpy = spyOn(folderRuleSetsService, 'loadRuleSets').and.stub();

    folderRuleSetsService.folderInfo$ = of(owningFolderMock);
    folderRuleSetsService.mainRuleSet$ = of(ownedRuleSetMock);
    folderRuleSetsService.inheritedRuleSets$ = of([inheritedRuleSetMock]);
    folderRuleSetsService.isLoading$ = of(false);
    folderRulesService.selectedRule$ = of(ruleMock('owned-rule-1'));
    actionsService.loading$ = of(false);

    fixture.detectChanges();

    expect(component).toBeTruthy();

    expect(loadRuleSetsSpy).toHaveBeenCalledOnceWith(component.nodeId);

    const ruleGroupingSections = debugElement.queryAll(By.css(`[data-automation-id="rule-list-item"]`));
    const rules = debugElement.queryAll(By.css('.aca-rule-list-item'));
    const ruleDetails = debugElement.query(By.css('aca-rule-details'));
    const deleteRuleBtn = debugElement.query(By.css('#delete-rule-btn'));

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

    const adfEmptyContent = debugElement.query(By.css('adf-empty-content'));
    const ruleSets = debugElement.queryAll(By.css(`[data-automation-id="rule-set-list-item"]`));
    const ruleDetails = debugElement.query(By.css('aca-rule-details'));

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

    const adfEmptyContent = debugElement.query(By.css('adf-empty-content'));
    const ruleSets = debugElement.queryAll(By.css(`[data-automation-id="rule-set-list-item"]`));
    const ruleDetails = debugElement.query(By.css('aca-rule-details'));

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

    const acaGenericError = debugElement.query(By.css('aca-generic-error'));
    const rules = debugElement.query(By.css('.aca-rule-list-item'));
    const ruleDetails = debugElement.query(By.css('aca-rule-details'));

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
    const rules = debugElement.query(By.css('.aca-rule-list-item'));
    const ruleDetails = debugElement.query(By.css('aca-rule-details'));

    expect(matProgressBar).toBeTruthy();
    expect(rules).toBeFalsy();
    expect(ruleDetails).toBeFalsy();
  });

  // TODO: flaky test that needs review
  // eslint-disable-next-line ban/ban
  xit('should call deleteRule() if confirmation dialog returns true', () => {
    const dialog = TestBed.inject(MatDialog);
    folderRuleSetsService.folderInfo$ = of(owningFolderMock);
    folderRuleSetsService.mainRuleSet$ = of(ownedRuleSetMock);
    folderRuleSetsService.inheritedRuleSets$ = of([inheritedRuleSetMock]);
    folderRuleSetsService.isLoading$ = of(false);
    folderRulesService.selectedRule$ = of(ruleMock('owned-rule-1'));
    folderRulesService.deletedRuleId$ = of(null);
    actionsService.loading$ = of(false);

    const onRuleDeleteButtonClickedSpy = spyOn(component, 'onRuleDeleteButtonClicked').and.callThrough();

    const dialogResult: any = {
      afterClosed: () => of(true)
    };
    const dialogOpenSpy = spyOn(dialog, 'open').and.returnValue(dialogResult);
    const deleteRuleSpy = spyOn(folderRulesService, 'deleteRule');
    const onRuleDeleteSpy = spyOn(component, 'onRuleDelete').and.callThrough();

    fixture.detectChanges();
    expect(component).toBeTruthy('expected component');

    const rules = debugElement.queryAll(By.css('.aca-rule-list-item'));
    const ruleDetails = debugElement.query(By.css('aca-rule-details'));
    const deleteRuleBtn = fixture.debugElement.nativeElement.querySelector('#delete-rule-btn');

    deleteRuleBtn.click();

    fixture.detectChanges();
    folderRulesService.deletedRuleId$ = of('owned-rule-1-id');

    expect(onRuleDeleteButtonClickedSpy).toHaveBeenCalled();
    expect(dialogOpenSpy).toHaveBeenCalled();
    expect(deleteRuleSpy).toHaveBeenCalled();
    expect(onRuleDeleteSpy).toHaveBeenCalledTimes(1);
    expect(rules).toBeTruthy('expected rules');
    expect(ruleDetails).toBeTruthy('expected ruleDetails');
    expect(deleteRuleBtn).toBeTruthy();
  });

  describe('Create rule & link rules buttons visibility', () => {
    let createButtonPredicate: Predicate<DebugElement>;
    let linkButtonPredicate: Predicate<DebugElement>;

    beforeEach(() => {
      folderRuleSetsService.folderInfo$ = of(owningFolderMock);
      folderRuleSetsService.inheritedRuleSets$ = of([]);
      folderRuleSetsService.isLoading$ = of(false);
      actionsService.loading$ = of(false);

      createButtonPredicate = By.css(`[data-automation-id="manage-rules-create-button"]`);
      linkButtonPredicate = By.css(`[data-automation-id="manage-rules-link-button"]`);
    });

    it('should show the create rule button if there is no main rule set', () => {
      folderRuleSetsService.mainRuleSet$ = of(null);
      fixture.detectChanges();

      const createButton = debugElement.query(createButtonPredicate);
      expect(createButton).toBeTruthy();
    });

    it('should show the link rules button if there is no main rule set', () => {
      folderRuleSetsService.mainRuleSet$ = of(null);
      fixture.detectChanges();

      const linkButton = debugElement.query(linkButtonPredicate);
      expect(linkButton).toBeTruthy();
    });

    it('should show the create rule button if the main rule set is owned', () => {
      folderRuleSetsService.mainRuleSet$ = of(ownedRuleSetMock);
      fixture.detectChanges();

      const createButton = debugElement.query(createButtonPredicate);
      expect(createButton).toBeTruthy();
    });

    it('should not show the create rule button if the main rule set is linked', () => {
      folderRuleSetsService.mainRuleSet$ = of(ruleSetWithLinkMock);
      fixture.detectChanges();

      const createButton = debugElement.query(createButtonPredicate);
      expect(createButton).toBeFalsy();
    });

    it('should not show the link rules button if the folder has a main rule set', () => {
      folderRuleSetsService.mainRuleSet$ = of(ownedRuleSetMock);
      fixture.detectChanges();

      const linkButton = debugElement.query(linkButtonPredicate);
      expect(linkButton).toBeFalsy();
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

    it('should call onInheritanceToggleChange() on change', () => {
      const onInheritanceToggleChangeSpy = spyOn(component, 'onInheritanceToggleChange').and.callThrough();
      const updateRuleSettingsSpy = spyOn(folderRulesService, 'updateRuleSettings').and.returnValue(Promise.resolve(ruleSettingsMock));
      const loadRuleSetsSpy = spyOn(folderRuleSetsService, 'loadRuleSets').and.callThrough();

      fixture.detectChanges();

      const inheritanceToggleBtn = fixture.debugElement.query(By.css(`[data-automation-id="manage-rules-inheritance-toggle-button"]`));

      inheritanceToggleBtn.nativeElement.dispatchEvent(new Event('change'));

      fixture.detectChanges();

      expect(onInheritanceToggleChangeSpy).toHaveBeenCalled();
      expect(updateRuleSettingsSpy).toHaveBeenCalledTimes(1);
      expect(loadRuleSetsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
