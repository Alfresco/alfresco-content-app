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

import { AppStore, NavigateLibraryAction } from '@alfresco/aca-shared/store';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { ContentApiService } from '@alfresco/aca-shared';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '@alfresco/adf-core';
import { provideEffects } from '@ngrx/effects';
import { LibraryEffects } from './library.effects';
import { AppTestingModule } from '../../testing/app-testing.module';
import { NodeEntry } from '@alfresco/js-api';

describe('LibraryEffects', () => {
  let store: Store<AppStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [provideEffects([LibraryEffects])]
    });
    store = TestBed.inject(Store);
  });

  describe('navigateLibrary$', () => {
    let notificationService: NotificationService;
    let node$: Subject<NodeEntry>;

    beforeEach(() => {
      node$ = new Subject<NodeEntry>();
      spyOn(TestBed.inject(ContentApiService), 'getNode').and.returnValue(node$);
      notificationService = TestBed.inject(NotificationService);
      spyOn(notificationService, 'showError');
    });

    it('should display library no permission warning if user does not have permission', () => {
      spyOn(notificationService, 'showWarning');
      store.dispatch(new NavigateLibraryAction('libraryId'));
      node$.error(new HttpErrorResponse({ status: 403 }));
      expect(notificationService.showWarning).toHaveBeenCalledWith('APP.BROWSE.LIBRARIES.LIBRARY_NO_PERMISSIONS_WARNING');
    });

    it('should display library not found error if library does not exist', () => {
      store.dispatch(new NavigateLibraryAction('libraryId'));
      node$.error(new HttpErrorResponse({ status: 404 }));
      expect(notificationService.showError).toHaveBeenCalledWith('APP.BROWSE.LIBRARIES.ERRORS.LIBRARY_NOT_FOUND');
    });

    it('should display generic library loading error if there is different problem than missing permissions or absence of library', () => {
      store.dispatch(new NavigateLibraryAction('libraryId'));
      node$.error(new HttpErrorResponse({ status: 500 }));
      expect(notificationService.showError).toHaveBeenCalledWith('APP.BROWSE.LIBRARIES.ERRORS.LIBRARY_LOADING_ERROR');
    });
  });
});
