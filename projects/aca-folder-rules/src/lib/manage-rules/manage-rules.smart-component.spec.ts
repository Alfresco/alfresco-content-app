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

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AcaFolderRulesModule, ManageRulesSmartComponent } from '@alfresco/aca-folder-rules';
import { DebugElement } from '@angular/core';
import { CoreTestingModule } from '@alfresco/adf-core';
import { FolderRulesService } from '../services/folder-rules.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { dummyRules } from '../mock/rules.mock';
import { By } from '@angular/platform-browser';
import { dummyNodeInfo } from '../mock/node.mock';
import { MatDialog } from '@angular/material/dialog';
import { ActionsService } from '../services/actions.service';
import { dummyAspects } from '../mock/aspects.mock';

describe('ManageRulesSmartComponent', () => {
  let fixture: ComponentFixture<ManageRulesSmartComponent>;
  let component: ManageRulesSmartComponent;
  let debugElement: DebugElement;
  let folderRulesService: FolderRulesService;
  let actionsService: ActionsService;

  beforeEach(
    waitForAsync(() => {
      const folderRulesServiceSpy = jasmine.createSpyObj('FolderRulesService', ['loadRules', 'deleteRule']);
      TestBed.configureTestingModule({
        imports: [CoreTestingModule, AcaFolderRulesModule],
        providers: [
          { provide: FolderRulesService, useValue: folderRulesServiceSpy },
          { provide: ActivatedRoute, useValue: { params: of({ nodeId: 1 }) } }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ManageRulesSmartComponent);
          component = fixture.componentInstance;
          debugElement = fixture.debugElement;
          folderRulesService = TestBed.inject<FolderRulesService>(FolderRulesService);
          actionsService = TestBed.inject<ActionsService>(ActionsService);
          actionsService.aspects$ = of(dummyAspects);
        });
    })
  );

  it('should display aca-rules-list and aca-rule-details', () => {
    folderRulesService.deletedRuleId$ = of(null);
    folderRulesService.folderInfo$ = of(dummyNodeInfo);
    folderRulesService.rulesListing$ = of(dummyRules);
    folderRulesService.loading$ = of(false);
    actionsService.loading$ = of(false);

    fixture.detectChanges();

    expect(component).toBeTruthy();

    expect(folderRulesService.loadRules).toHaveBeenCalledOnceWith(component.nodeId);

    const rules = debugElement.queryAll(By.css('.aca-rule'));
    const ruleDetails = debugElement.queryAll(By.css('aca-rule-details'));
    const deleteRuleBtn = debugElement.query(By.css('#delete-rule-btn'));

    expect(rules.length).toBe(2, 'unexpected number of aca-rule');
    expect(ruleDetails.length).toBeTruthy('aca-rule-details was not rendered');
    expect(deleteRuleBtn).toBeTruthy('no delete rule button');
  });

  it('should only show adf-empty-content if provided node has no rules defined yet', () => {
    folderRulesService.folderInfo$ = of(dummyNodeInfo);
    folderRulesService.rulesListing$ = of([]);
    folderRulesService.loading$ = of(false);
    folderRulesService.deletedRuleId$ = of(null);
    actionsService.loading$ = of(false);

    fixture.detectChanges();

    expect(component).toBeTruthy();

    const adfEmptyContent = debugElement.query(By.css('adf-empty-content'));
    const rules = debugElement.query(By.css('.aca-rule'));
    const ruleDetails = debugElement.query(By.css('aca-rule-details'));

    expect(adfEmptyContent).toBeTruthy();
    expect(rules).toBeFalsy();
    expect(ruleDetails).toBeFalsy();
  });

  it('should only show aca-generic-error if the non-existing node was provided', () => {
    folderRulesService.folderInfo$ = of(null);
    folderRulesService.deletedRuleId$ = of(null);
    folderRulesService.rulesListing$ = of([]);
    folderRulesService.loading$ = of(false);
    actionsService.loading$ = of(false);

    fixture.detectChanges();

    expect(component).toBeTruthy();

    const acaGenericError = debugElement.query(By.css('aca-generic-error'));
    const rules = debugElement.query(By.css('.aca-rule'));
    const ruleDetails = debugElement.query(By.css('aca-rule-details'));

    expect(acaGenericError).toBeTruthy();
    expect(rules).toBeFalsy();
    expect(ruleDetails).toBeFalsy();
  });

  it('should only show progress bar while loading', async () => {
    folderRulesService.folderInfo$ = of(null);
    folderRulesService.deletedRuleId$ = of(null);
    folderRulesService.rulesListing$ = of([]);
    folderRulesService.loading$ = of(true);
    actionsService.loading$ = of(true);

    fixture.detectChanges();

    expect(component).toBeTruthy();

    const matProgressBar = debugElement.query(By.css('mat-progress-bar'));
    const rules = debugElement.query(By.css('.aca-rule'));
    const ruleDetails = debugElement.query(By.css('aca-rule-details'));

    expect(matProgressBar).toBeTruthy();
    expect(rules).toBeFalsy();
    expect(ruleDetails).toBeFalsy();
  });

  it('should call deleteRule() if confirmation dialog returns true', () => {
    const dialog = TestBed.inject(MatDialog);
    folderRulesService.deletedRuleId$ = of(null);
    folderRulesService.folderInfo$ = of(dummyNodeInfo);
    folderRulesService.rulesListing$ = of(dummyRules);
    folderRulesService.loading$ = of(false);
    actionsService.loading$ = of(false);

    spyOn(component, 'onRuleDelete').and.callThrough();

    const dialogResult: any = {
      afterClosed: () =>
        of(true).subscribe((res) => {
          if (res === true) {
            folderRulesService.deleteRule(component.nodeId, component.selectedRule.id);
          }
        })
    };
    spyOn(dialog, 'open').and.returnValue(dialogResult);

    fixture.detectChanges();
    expect(component).toBeTruthy('expected component');

    const rules = debugElement.queryAll(By.css('.aca-rule'));
    const ruleDetails = debugElement.query(By.css('aca-rule-details'));
    const deleteRuleBtn = fixture.debugElement.nativeElement.querySelector('#delete-rule-btn');

    deleteRuleBtn.click();

    fixture.detectChanges();
    folderRulesService.deletedRuleId$ = of(component.selectedRule.id);

    expect(component.onRuleDelete).toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalled();
    expect(folderRulesService.deleteRule).toHaveBeenCalled();
    expect(folderRulesService.loadRules).toHaveBeenCalledTimes(1);
    expect(rules).toBeTruthy('expected rules');
    expect(ruleDetails).toBeTruthy('expected ruleDetails');
    expect(deleteRuleBtn).toBeTruthy();
  });

  it('should run loadRules() when deletedRuleId$ emits new value', () => {
    folderRulesService.deletedRuleId$ = of('new-value');
    folderRulesService.folderInfo$ = of(dummyNodeInfo);
    folderRulesService.rulesListing$ = of(dummyRules);
    folderRulesService.loading$ = of(false);

    fixture.detectChanges();

    expect(component).toBeTruthy();

    expect(folderRulesService.loadRules).toHaveBeenCalledTimes(2);
  });
});
