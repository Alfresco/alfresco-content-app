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
import { SitesService } from '@alfresco/adf-content-services';
import { LibraryListComponent } from './library-list.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { AppExtensionService, AppHookService } from '@alfresco/aca-shared';
import { provideEffects } from '@ngrx/effects';
import { Observable, of, throwError } from 'rxjs';
import { LibraryEffects } from '../../store/effects';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SitePaging } from '@alfresco/js-api';
import { libraryColumnsPresetMock, librariesMock, libraryPaginationMock } from '../../mock/libraries-mock';

describe('LibraryListComponent', () => {
  let fixture: ComponentFixture<LibraryListComponent>;
  let component: LibraryListComponent;
  let userPreference: UserPreferencesService;
  let sitesService: SitesService;
  let appHookService: AppHookService;
  let getSitesSpy: jasmine.Spy<(options?: any) => Observable<SitePaging>>;
  let appExtensionService: AppExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, LibraryListComponent, MatSnackBarModule],
      providers: [provideEffects([LibraryEffects])]
    });

    fixture = TestBed.createComponent(LibraryListComponent);
    component = fixture.componentInstance;

    sitesService = TestBed.inject(SitesService);
    userPreference = TestBed.inject(UserPreferencesService);
    appHookService = TestBed.inject(AppHookService);
    appExtensionService = TestBed.inject(AppExtensionService);

    getSitesSpy = spyOn(sitesService, 'getSites');
    getSitesSpy.and.returnValue(of(librariesMock));
    fixture.detectChanges();
  });

  it('should set data', () => {
    expect(component.list).toBe(librariesMock);
    expect(component.pagination).toBe(librariesMock.list.pagination);
  });

  it('should get data with user preference pagination size', () => {
    userPreference.paginationSize = 1;
    component.ngOnInit();
    expect(sitesService.getSites).toHaveBeenCalledWith({ maxItems: 1 });
  });

  it('should set data on error', () => {
    getSitesSpy.and.returnValue(throwError(() => 'error'));
    component.ngOnInit();

    expect(component.list).toBeNull();
    expect(component.pagination).toBeNull();
    expect(component.isLoading).toBe(false);
  });

  it('should set columns from extensions on init', () => {
    appExtensionService.documentListPresets.libraries = libraryColumnsPresetMock;
    component.ngOnInit();
    expect(component.columns).toEqual(appExtensionService.documentListPresets.libraries);
  });

  it('should handle no columns preset in extensions', () => {
    appExtensionService.documentListPresets.libraries = undefined;
    component.ngOnInit();
    expect(component.columns.length).toBe(0);
  });

  describe('Library hooks', () => {
    it('should reload on libraryDeleted action', () => {
      appHookService.libraryDeleted.next('');
      expect(sitesService.getSites).toHaveBeenCalled();
    });

    it('should reload on libraryUpdated action', () => {
      appHookService.libraryUpdated.next(librariesMock.list.entries[0]);
      expect(sitesService.getSites).toHaveBeenCalled();
    });

    it('should reload on libraryJoined action', () => {
      appHookService.libraryJoined.next();
      expect(sitesService.getSites).toHaveBeenCalled();
    });

    it('should reload on libraryLeft action', () => {
      appHookService.libraryLeft.next('');
      expect(sitesService.getSites).toHaveBeenCalled();
    });
  });

  describe('Pagination', () => {
    it('should get list with pagination data onChange event', () => {
      component.getList(libraryPaginationMock);
      expect(sitesService.getSites).toHaveBeenCalledWith(libraryPaginationMock);
    });

    it('should get list with pagination data onChangePageSize event', () => {
      component.onChangePageSize(libraryPaginationMock);
      expect(sitesService.getSites).toHaveBeenCalledWith(libraryPaginationMock);
    });

    it('should set preference page size onChangePageSize event', () => {
      component.onChangePageSize(libraryPaginationMock);
      expect(userPreference.paginationSize).toBe(libraryPaginationMock.maxItems);
    });
  });
});
