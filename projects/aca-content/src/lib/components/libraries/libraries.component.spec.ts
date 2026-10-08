/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { CustomResourcesService } from '@alfresco/adf-content-services';
import { LibrariesComponent } from './libraries.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { AppExtensionService, AppHookService } from '@alfresco/aca-shared';
import { provideEffects } from '@ngrx/effects';
import { Observable, of, throwError } from 'rxjs';
import { LibraryEffects } from '../../store/effects';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Pagination, SiteMemberPaging } from '@alfresco/js-api';
import { libraryColumnsPresetMock, librariesMock, libraryPaginationMock } from '../../mock/libraries-mock';

describe('LibrariesComponent', () => {
  let fixture: ComponentFixture<LibrariesComponent>;
  let component: LibrariesComponent;
  let userPreference: UserPreferencesService;
  let customResourcesService: CustomResourcesService;
  let appHookService: AppHookService;
  let loadMemberSitesSpy: jasmine.Spy<(pagination: Pagination, where?: string) => Observable<SiteMemberPaging>>;
  let appExtensionService: AppExtensionService;

  const memberSitesMock = librariesMock as unknown as SiteMemberPaging;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, LibrariesComponent, MatSnackBarModule],
      providers: [provideEffects([LibraryEffects])]
    });

    fixture = TestBed.createComponent(LibrariesComponent);
    component = fixture.componentInstance;

    userPreference = TestBed.inject(UserPreferencesService);
    customResourcesService = TestBed.inject(CustomResourcesService);
    appHookService = TestBed.inject(AppHookService);
    appExtensionService = TestBed.inject(AppExtensionService);

    loadMemberSitesSpy = spyOn(customResourcesService, 'loadMemberSites');
    loadMemberSitesSpy.and.returnValue(of(memberSitesMock));
    fixture.detectChanges();
  });

  it('should set data', () => {
    expect(component.list).toBe(memberSitesMock);
    expect(component.pagination).toBe(memberSitesMock.list.pagination);
  });

  it('should get data with user preference pagination size', () => {
    userPreference.paginationSize = 1;
    component.ngOnInit();
    expect(loadMemberSitesSpy).toHaveBeenCalledWith(jasmine.objectContaining({ skipCount: 0, maxItems: 1 }));
  });

  it('should set data on error', () => {
    loadMemberSitesSpy.and.returnValue(throwError(() => 'error'));
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
    beforeEach(() => {
      loadMemberSitesSpy.calls.reset();
    });

    it('should reload on libraryDeleted hook', () => {
      appHookService.libraryDeleted.next('');
      expect(loadMemberSitesSpy).toHaveBeenCalled();
    });

    it('should reload on libraryUpdated hook', () => {
      appHookService.libraryUpdated.next(librariesMock.list.entries[0]);
      expect(loadMemberSitesSpy).toHaveBeenCalled();
    });

    it('should reload on libraryLeft hook', () => {
      appHookService.libraryLeft.next('');
      expect(loadMemberSitesSpy).toHaveBeenCalled();
    });
  });

  describe('Pagination', () => {
    it('should get list with pagination data onChange event', () => {
      component.getList(libraryPaginationMock);
      expect(loadMemberSitesSpy).toHaveBeenCalledWith(libraryPaginationMock);
    });

    it('should set preference page size onChangePageSize event', () => {
      component.onChangePageSize(libraryPaginationMock);
      expect(userPreference.paginationSize).toBe(libraryPaginationMock.maxItems);
    });

    it('should retry from the first page when the stored page is out of range', () => {
      loadMemberSitesSpy.calls.reset();
      const outOfRange = { list: { entries: [], pagination: { count: 0, skipCount: 50, maxItems: 25, totalItems: 20 } } } as SiteMemberPaging;
      loadMemberSitesSpy.and.returnValues(of(outOfRange), of(memberSitesMock));

      component.getList(new Pagination({ skipCount: 50, maxItems: 25 }));

      expect(loadMemberSitesSpy).toHaveBeenCalledTimes(2);
      expect(loadMemberSitesSpy.calls.mostRecent().args[0].skipCount).toBe(0);
      expect(component.list).toBe(memberSitesMock);
    });
  });
});
