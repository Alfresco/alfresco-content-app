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
import { UserPreferencesService } from '@alfresco/adf-core';
import { FavoriteLibrariesComponent } from './favorite-libraries.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { AppExtensionService, AppHookService, ContentApiService } from '@alfresco/aca-shared';
import { provideEffects } from '@ngrx/effects';
import { of, throwError } from 'rxjs';
import { LibraryEffects } from '../../store/effects';
import { NodeEntry } from '@alfresco/js-api';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { libraryColumnsPresetMock, favoriteLibrariesMock, libraryPaginationMock } from '../../mock/libraries-mock';

describe('FavoriteLibrariesComponent', () => {
  let fixture: ComponentFixture<FavoriteLibrariesComponent>;
  let component: FavoriteLibrariesComponent;
  let userPreference: UserPreferencesService;
  let contentApiService: ContentApiService;
  let appHookService: AppHookService;
  let appExtensionService: AppExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, FavoriteLibrariesComponent, MatSnackBarModule],
      providers: [provideEffects([LibraryEffects])]
    });

    fixture = TestBed.createComponent(FavoriteLibrariesComponent);
    component = fixture.componentInstance;

    contentApiService = TestBed.inject(ContentApiService);
    userPreference = TestBed.inject(UserPreferencesService);
    appHookService = TestBed.inject(AppHookService);
    appExtensionService = TestBed.inject(AppExtensionService);

    spyOn(contentApiService, 'getNode').and.returnValue(of({ entry: { id: 'libraryId' } } as NodeEntry));
  });

  it('should set data', () => {
    spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(of(favoriteLibrariesMock));
    fixture.detectChanges();

    expect(component.list).toBe(favoriteLibrariesMock);
    expect(component.pagination).toBe(favoriteLibrariesMock.list.pagination);
  });

  it('should get data with user preference pagination size', () => {
    userPreference.paginationSize = 1;
    spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(of(favoriteLibrariesMock));

    fixture.detectChanges();

    expect(contentApiService.getFavoriteLibraries).toHaveBeenCalledWith('-me-', {
      maxItems: userPreference.paginationSize
    });
  });

  it('should set data on error', () => {
    spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(throwError(() => 'error'));
    fixture.detectChanges();

    expect(component.list).toBe(null);
    expect(component.pagination).toBe(null);
    expect(component.isLoading).toBe(false);
  });

  it('should set columns from extensions on init', () => {
    appExtensionService.documentListPresets.libraries = libraryColumnsPresetMock;
    fixture.detectChanges();
    expect(component.columns).toEqual(appExtensionService.documentListPresets.favoriteLibraries);
  });

  it('should handle no columns preset in extensions', () => {
    appExtensionService.documentListPresets.favoriteLibraries = undefined;
    component.ngOnInit();
    expect(component.columns.length).toBe(0);
  });

  describe('Library hooks', () => {
    beforeEach(() => {
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(of(favoriteLibrariesMock));
      fixture.detectChanges();
    });

    it('should reload on libraryDeleted hook', () => {
      appHookService.libraryDeleted.next('');
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalled();
    });

    it('should reload on libraryUpdated hook', () => {
      appHookService.libraryUpdated.next({} as any);
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalled();
    });

    it('should reload on favoriteLibraryToggle hook', () => {
      appHookService.favoriteLibraryToggle.next();
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalled();
    });

    it('should reload on libraryJoined hook', () => {
      appHookService.libraryJoined.next();
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalled();
    });

    it('should reload on libraryLeft hook', () => {
      appHookService.libraryLeft.next({} as any);
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalled();
    });
  });

  describe('Pagination', () => {
    it('should get list with pagination data onChangePageSize event', () => {
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(of(favoriteLibrariesMock));

      component.onChangePageSize(libraryPaginationMock);

      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalledWith('-me-', libraryPaginationMock);
    });

    it('should set preference page size onChangePageSize event', () => {
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(of(favoriteLibrariesMock));

      component.onChangePageSize(libraryPaginationMock);

      expect(userPreference.paginationSize).toBe(libraryPaginationMock.maxItems);
    });
  });
});
