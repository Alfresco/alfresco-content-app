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
import { RuleSetPickerOptions, RuleSetPickerSmartComponent } from './rule-set-picker.smart-component';
import { CoreTestingModule } from '@alfresco/adf-core';
import { folderToLinkMock } from '../mock/node.mock';
import { FolderRuleSetsService } from '../services/folder-rule-sets.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('RuleSetPickerSmartComponent', () => {
  let fixture: ComponentFixture<RuleSetPickerSmartComponent>;
  let component: RuleSetPickerSmartComponent;

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
      imports: [CoreTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogOptions }
      ]
    });

    fixture = TestBed.createComponent(RuleSetPickerSmartComponent);
    component = fixture.componentInstance;
  });

  it('should load the rule sets of a node once it has been selected', () => {
    const loadRuleSetsSpy = spyOn(FolderRuleSetsService.prototype, 'loadRuleSets');
    component.onNodeSelect([folderToLinkMock]);
    expect(loadRuleSetsSpy).toHaveBeenCalledWith(folderToLinkMock.id, false);
  });
});
