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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { SavedSearchDeleteDialogComponent } from './saved-search-delete-dialog.component';
import { SavedSearch } from '@alfresco/adf-content-services';
import { NotificationService } from '@alfresco/adf-core';
import { AppTestingModule } from '../../../../../testing/app-testing.module';
import { SavedSearchesContextService } from '../../../../../services/saved-searches-context.service';

describe('SaveSearchDeleteDialogComponent', () => {
  let fixture: ComponentFixture<SavedSearchDeleteDialogComponent>;
  let notificationService: NotificationService;
  let savedSearchesService: SavedSearchesContextService;
  let submitButton: HTMLButtonElement;
  let cancelButton: HTMLButtonElement;

  const savedSearchToDelete: SavedSearch = {
    name: 'test',
    encodedUrl: '1234',
    order: 0
  };

  const dialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, SavedSearchDeleteDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: SavedSearchesContextService, useValue: { deleteSavedSearch: () => of({}) } },
        { provide: MAT_DIALOG_DATA, useValue: savedSearchToDelete }
      ]
    });
    dialogRef.close.calls.reset();
    fixture = TestBed.createComponent(SavedSearchDeleteDialogComponent);
    savedSearchesService = TestBed.inject(SavedSearchesContextService);
    notificationService = TestBed.inject(NotificationService);

    submitButton = fixture.nativeElement.querySelector('#aca-save-search-delete-dialog-submit-button');
    cancelButton = fixture.nativeElement.querySelector('#aca-save-search-delete-dialog-cancel-button');
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should not delete and close dialog window if cancel button clicked', () => {
    spyOn(savedSearchesService, 'deleteSavedSearch').and.callThrough();
    cancelButton.click();
    expect(savedSearchesService.deleteSavedSearch).not.toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should delete search, show snackbar message and close modal if submit button clicked', fakeAsync(() => {
    spyOn(savedSearchesService, 'deleteSavedSearch').and.callThrough();
    spyOn(notificationService, 'showInfo');
    clickSubmitButton();
    expect(notificationService.showInfo).toHaveBeenCalledWith('APP.BROWSE.SEARCH.SAVE_SEARCH.DELETE_DIALOG.SUCCESS_MESSAGE');
    expect(dialogRef.close).toHaveBeenCalled();
  }));

  it('should show snackbar error if there is delete error', fakeAsync(() => {
    spyOn(savedSearchesService, 'deleteSavedSearch').and.returnValue(throwError(() => new Error('Error')));
    spyOn(notificationService, 'showError');
    clickSubmitButton();
    expect(notificationService.showError).toHaveBeenCalledWith('APP.BROWSE.SEARCH.SAVE_SEARCH.DELETE_DIALOG.ERROR_MESSAGE');
    expect(dialogRef.close).not.toHaveBeenCalled();
  }));

  function clickSubmitButton() {
    submitButton.click();
    tick();
    expect(savedSearchesService.deleteSavedSearch).toHaveBeenCalledWith(savedSearchToDelete);
  }
});
