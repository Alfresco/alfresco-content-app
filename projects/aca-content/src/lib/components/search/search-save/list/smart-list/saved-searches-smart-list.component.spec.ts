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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopTranslateModule, provideCoreAuthTesting } from '@alfresco/adf-core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { SavedSearch } from '@alfresco/adf-content-services';
import { SavedSearchesSmartListComponent } from './saved-searches-smart-list.component';
import { AppService, DocumentBasePageService, DocumentBasePageServiceMock } from '@alfresco/aca-shared';
import { AppState } from '@alfresco/aca-shared/store';
import { provideMockStore } from '@ngrx/store/testing';
import { SavedSearchesContextService } from '../../../../../services/saved-searches-context.service';

const appServiceMock = {
  appNavNarMode$: new BehaviorSubject('collapsed'),
  setAppNavbarMode: jasmine.createSpy('setAppNavbarMode'),
  toggleAppNavBar$: new Subject()
};

describe('SavedSearchesSmartListComponent', () => {
  let fixture: ComponentFixture<SavedSearchesSmartListComponent>;
  let fakeSavedSearches$: ReplaySubject<SavedSearch[]>;
  let appState: Partial<AppState> = {};

  beforeEach(() => {
    fakeSavedSearches$ = new ReplaySubject<SavedSearch[]>(1);
    appState = {
      selection: {
        count: 0,
        isEmpty: false,
        libraries: [],
        nodes: []
      },
      navigation: {},
      infoDrawerOpened: false
    };
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, SavedSearchesSmartListComponent],
      providers: [
        provideCoreAuthTesting(),
        provideMockStore({
          initialState: { app: appState }
        }),
        { provide: DocumentBasePageService, useClass: DocumentBasePageServiceMock },
        { provide: SavedSearchesContextService, useValue: { savedSearches$: fakeSavedSearches$ } },
        { provide: AppService, useValue: appServiceMock }
      ]
    });

    fixture = TestBed.createComponent(SavedSearchesSmartListComponent);
  });

  it('should show the list of searches', async () => {
    const mockSavedSearches: SavedSearch[] = [
      { name: '1', order: 0, encodedUrl: '' },
      { name: '2', order: 1, encodedUrl: '' }
    ];
    fakeSavedSearches$.next(mockSavedSearches);
    fixture.detectChanges();
    const listComponent = fixture.nativeElement.querySelector('aca-saved-searches-ui-list');
    expect(listComponent).toBeDefined();
  });

  it('should show the no content template when no saved searches are found', async () => {
    const mockSavedSearches: SavedSearch[] = [];
    fakeSavedSearches$.next(mockSavedSearches);
    fixture.detectChanges();

    const emptyContent = fixture.nativeElement.querySelector('.adf-empty-content');
    expect(emptyContent).toBeDefined();
  });

  it('should show the spinner while saved searches is loading', async () => {
    fixture.detectChanges();
    const matSpinnerElement = fixture.debugElement.query(By.css(`[data-automation-id="'saved-search-list-spinner'"]`));

    expect(matSpinnerElement).not.toBeNull();
  });
});
