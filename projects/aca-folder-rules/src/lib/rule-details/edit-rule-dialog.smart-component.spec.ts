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
import { EditRuleDialogOptions, EditRuleDialogSmartComponent } from './edit-rule-dialog.smart-component';
import { By } from '@angular/platform-browser';
import { RuleDetailsUiComponent } from './rule-details.ui-component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreTestingModule } from '@alfresco/adf-core';
import { RuleCompositeConditionUiComponent } from './conditions/rule-composite-condition.ui-component';
import { RuleTriggersUiComponent } from './triggers/rule-triggers.ui-component';
import { RuleActionListUiComponent } from './actions/rule-action-list.ui-component';
import { RuleActionUiComponent } from './actions/rule-action.ui-component';
import { ActionsService } from '../services/actions.service';
import { RuleOptionsUiComponent } from './options/rule-options.ui-component';
import { timer } from 'rxjs';

describe('EditRuleDialogSmartComponent', () => {
  let fixture: ComponentFixture<EditRuleDialogSmartComponent>;

  const dialogRef = {
    close: jasmine.createSpy('close'),
    open: jasmine.createSpy('open')
  };

  const setupBeforeEach = (dialogOptions: EditRuleDialogOptions = {}) => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule],
      declarations: [
        EditRuleDialogSmartComponent,
        RuleCompositeConditionUiComponent,
        RuleDetailsUiComponent,
        RuleTriggersUiComponent,
        RuleActionListUiComponent,
        RuleActionUiComponent,
        RuleOptionsUiComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogOptions }
      ]
    });

    spyOn(ActionsService.prototype, 'loadActionDefinitions').and.stub();
    spyOn(ActionsService.prototype, 'getParameterConstraints').and.stub();

    fixture = TestBed.createComponent(EditRuleDialogSmartComponent);
    fixture.detectChanges();
  };

  describe('No dialog options passed / indifferent', () => {
    beforeEach(() => {
      setupBeforeEach();
    });

    it('should activate the submit button only when a valid state is received', async () => {
      const submitButton = fixture.debugElement.query(By.css('[data-automation-id="edit-rule-dialog-submit"]')).nativeElement as HTMLButtonElement;
      const ruleDetails = fixture.debugElement.query(By.directive(RuleDetailsUiComponent)).componentInstance as RuleDetailsUiComponent;
      ruleDetails.formValidationChanged.emit(true);

      fixture.detectChanges();
      // timer needed to wait for the next tick to avoid ExpressionChangedAfterItHasBeenCheckedError
      await timer(1).toPromise();
      fixture.detectChanges();
      expect(submitButton.disabled).toBeFalsy();
      ruleDetails.formValidationChanged.emit(false);

      fixture.detectChanges();
      await timer(1).toPromise();
      fixture.detectChanges();
      expect(submitButton.disabled).toBeTruthy();
    });

    it('should show a "create" label in the title', () => {
      const titleElement = fixture.debugElement.query(By.css('[data-automation-id="edit-rule-dialog-title"]')).nativeElement as HTMLDivElement;

      expect(titleElement.innerText.trim()).toBe('ACA_FOLDER_RULES.EDIT_RULE_DIALOG.CREATE_TITLE');
    });

    it('should show a "create" label in the submit button', () => {
      const titleElement = fixture.debugElement.query(By.css('[data-automation-id="edit-rule-dialog-submit"]')).nativeElement as HTMLButtonElement;

      expect(titleElement.innerText.trim()).toBe('ACA_FOLDER_RULES.EDIT_RULE_DIALOG.CREATE');
    });
  });

  describe('With dialog options passed', () => {
    const dialogOptions: EditRuleDialogOptions = {
      model: {
        id: 'rule-id'
      }
    };

    beforeEach(() => {
      setupBeforeEach(dialogOptions);
    });

    it('should show an "update" label in the title', () => {
      const titleElement = fixture.debugElement.query(By.css('[data-automation-id="edit-rule-dialog-title"]')).nativeElement as HTMLDivElement;

      expect(titleElement.innerText.trim()).toBe('ACA_FOLDER_RULES.EDIT_RULE_DIALOG.UPDATE_TITLE');
    });

    it('should show an "update" label in the submit button', () => {
      const titleElement = fixture.debugElement.query(By.css('[data-automation-id="edit-rule-dialog-submit"]')).nativeElement as HTMLButtonElement;

      expect(titleElement.innerText.trim()).toBe('ACA_FOLDER_RULES.EDIT_RULE_DIALOG.UPDATE');
    });
  });
});
