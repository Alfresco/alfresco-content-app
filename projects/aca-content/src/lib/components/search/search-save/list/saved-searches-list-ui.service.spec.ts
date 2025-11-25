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

import { fakeAsync, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SavedSearchesListUiService } from './saved-searches-list-ui.service';
import { SavedSearch } from '@alfresco/adf-content-services';
import { SavedSearchEditDialogComponent } from '../dialog/edit/saved-search-edit-dialog.component';
import { SavedSearchDeleteDialogComponent } from '../dialog/delete/saved-search-delete-dialog.component';
import { of } from 'rxjs';

describe('NodeTemplateService', () => {
  let dialog: MatDialog;
  let savedSearchesListUiService: SavedSearchesListUiService;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<any>>;

  const mockedSearch: SavedSearch = { name: 'test', encodedUrl: 'test', order: 1 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule]
    });

    dialog = TestBed.inject(MatDialog);
    savedSearchesListUiService = TestBed.inject(SavedSearchesListUiService);

    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(null));
    spyOn(dialog, 'open').and.returnValue(dialogRefSpy);
  });

  it('should open edit save search dialog with proper params', fakeAsync(() => {
    savedSearchesListUiService.openEditSavedSearch(mockedSearch);

    expect(dialog.open).toHaveBeenCalledWith(SavedSearchEditDialogComponent, { data: mockedSearch, width: '600px' });
  }));

  it('should open delete save search dialog with proper params', fakeAsync(() => {
    savedSearchesListUiService.confirmDeleteSavedSearch(mockedSearch);

    expect(dialog.open).toHaveBeenCalledWith(SavedSearchDeleteDialogComponent, { data: mockedSearch, minWidth: '500px' });
  }));
});
