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
import { AcaFolderRulesModule, ManageRulesSmartComponent } from '@alfresco/aca-folder-rules';
import { DebugElement } from '@angular/core';
import { CoreTestingModule } from '@alfresco/adf-core';
import { FolderRulesService } from '../services/folder-rules.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ruleSetsMock } from '../mock/rule-sets.mock';
import { By } from '@angular/platform-browser';
import { owningFolderIdMock, owningFolderMock } from '../mock/node.mock';
import { MatDialog } from '@angular/material/dialog';
import { ActionsService } from '../services/actions.service';
import { FolderRuleSetsService } from '../services/folder-rule-sets.service';
import { ruleMock } from '../mock/rules.mock';
import { Store } from '@ngrx/store';

describe('ManageRulesSmartComponent', () => {
  let fixture: ComponentFixture<ManageRulesSmartComponent>;
  let component: ManageRulesSmartComponent;
  let debugElement: DebugElement;

  let folderRuleSetsService: FolderRuleSetsService;
  let folderRulesService: FolderRulesService;
  let actionsService: ActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule, AcaFolderRulesModule],
      providers: [
        FolderRuleSetsService,
        FolderRulesService,
        { provide: Store, useValue: { dispatch: () => {} } },
        // { provide: FolderRulesService, useValue: folderRulesServiceSpy },
        { provide: ActivatedRoute, useValue: { params: of({ nodeId: owningFolderIdMock }) } }
      ]
    });

    fixture = TestBed.createComponent(ManageRulesSmartComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    folderRuleSetsService = TestBed.inject(FolderRuleSetsService);
    folderRulesService = TestBed.inject(FolderRulesService);
    actionsService = TestBed.inject(ActionsService);

    spyOn(actionsService, 'loadActionDefinitions').and.stub();
  });

  it('should show a list of rule sets and rules', () => {
    const loadRuleSetsSpy = spyOn(folderRuleSetsService, 'loadRuleSets').and.stub();

    folderRuleSetsService.folderInfo$ = of(owningFolderMock);
    folderRuleSetsService.ruleSetListing$ = of(ruleSetsMock);
    folderRuleSetsService.isLoading$ = of(false);
    folderRulesService.selectedRule$ = of(ruleMock('owned-rule-1'));
    actionsService.loading$ = of(false);

    fixture.detectChanges();

    expect(component).toBeTruthy();

    expect(loadRuleSetsSpy).toHaveBeenCalledOnceWith(component.nodeId);

    const ruleSets = debugElement.queryAll(By.css(`[data-automation-id="rule-set-list-item"]`));
    const rules = debugElement.queryAll(By.css('.aca-rule-list-item'));
    const ruleDetails = debugElement.query(By.css('aca-rule-details'));
    const deleteRuleBtn = debugElement.query(By.css('#delete-rule-btn'));

    expect(ruleSets.length).toBe(3, 'unexpected number of rule sets');
    expect(rules.length).toBe(6, 'unexpected number of aca-rule-list-item');
    expect(ruleDetails).toBeTruthy('aca-rule-details was not rendered');
    expect(deleteRuleBtn).toBeTruthy('no delete rule button');
  });

  it('should only show adf-empty-content if node has no rules defined yet', () => {
    folderRuleSetsService.folderInfo$ = of(owningFolderMock);
    folderRuleSetsService.ruleSetListing$ = of([]);
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
    folderRuleSetsService.ruleSetListing$ = of([]);
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
    folderRuleSetsService.ruleSetListing$ = of([]);
    folderRuleSetsService.isLoading$ = of(true);
    actionsService.loading$ = of(true);

    fixture.detectChanges();

    expect(component).toBeTruthy();

    const matProgressBar = debugElement.query(By.css('mat-progress-bar'));
    const rules = debugElement.query(By.css('.aca-rule-list-item'));
    const ruleDetails = debugElement.query(By.css('aca-rule-details'));

    expect(matProgressBar).toBeTruthy();
    expect(rules).toBeFalsy();
    expect(ruleDetails).toBeFalsy();
  });

  it('should call deleteRule() if confirmation dialog returns true', () => {
    const dialog = TestBed.inject(MatDialog);
    folderRuleSetsService.folderInfo$ = of(owningFolderMock);
    folderRuleSetsService.ruleSetListing$ = of(ruleSetsMock);
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
});
