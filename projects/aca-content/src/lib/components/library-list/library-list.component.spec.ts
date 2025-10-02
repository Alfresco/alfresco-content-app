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
import { Router } from '@angular/router';
import { UnitTestingUtils, UserPreferencesService } from '@alfresco/adf-core';
import { DocumentListComponent, SitesService } from '@alfresco/adf-content-services';
import { LibraryListComponent } from './library-list.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { AppHookService } from '@alfresco/aca-shared';
import { provideEffects } from '@ngrx/effects';
import { RouterEffects } from '@alfresco/aca-shared/store';
import { of, throwError } from 'rxjs';
import { LibraryEffects } from '../../store/effects';
import { getTitleElementText } from '../../testing/test-utils';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Pagination, SiteEntry, SitePaging } from '@alfresco/js-api';

describe('LibraryListComponent', () => {
  let fixture: ComponentFixture<LibraryListComponent>;
  let component: LibraryListComponent;
  let userPreference: UserPreferencesService;
  let sitesService: SitesService;
  let router: Router;
  let appHookService: AppHookService;
  let getSitesSpy: jasmine.Spy;
  let unitTestingUtils: UnitTestingUtils;

  const paging: SitePaging = {
    list: {
      entries: [
        { entry: { id: '1', guid: '1', title: 'Library 1', visibility: 'public' } },
        { entry: { id: '2', guid: '2', title: 'Library 2', visibility: 'private' } }
      ],
      pagination: { count: 25, skipCount: 0 }
    }
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, LibraryListComponent, MatSnackBarModule],
      providers: [provideEffects([RouterEffects, LibraryEffects])]
    });

    fixture = TestBed.createComponent(LibraryListComponent);
    component = fixture.componentInstance;

    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
    sitesService = TestBed.inject(SitesService);
    userPreference = TestBed.inject(UserPreferencesService);
    appHookService = TestBed.inject(AppHookService);
    router = TestBed.inject(Router);

    getSitesSpy = spyOn(sitesService, 'getSites');
    getSitesSpy.and.returnValue(of(paging));
    fixture.detectChanges();
  });

  describe('on initialization', () => {
    it('should set data', () => {
      expect(component.list).toBe(paging);
      expect(component.pagination).toBe(paging.list.pagination);
    });

    it('should get data with user preference pagination size', () => {
      userPreference.paginationSize = 1;
      component.ngOnInit();
      expect(sitesService.getSites).toHaveBeenCalledWith({ maxItems: userPreference.paginationSize });
    });

    it('should set data on error', () => {
      getSitesSpy.and.returnValue(throwError(() => 'error'));
      component.ngOnInit();

      expect(component.list).toBe(null);
      expect(component.pagination).toBe(null);
      expect(component.isLoading).toBe(false);
    });

    it('should set title based on selectedRowItemsCount', () => {
      expect(getTitleElementText(fixture)).toBe('APP.BROWSE.LIBRARIES.MENU.ALL_LIBRARIES.TITLE');

      component.selectedRowItemsCount = 5;
      fixture.detectChanges();

      expect(getTitleElementText(fixture)).toBe('APP.HEADER.SELECTED');
    });

    it('should handle no columns preset in extensions', () => {
      component['extensions'].documentListPresets.libraries = undefined;
      component.ngOnInit();
      expect(component.columns.length).toBe(0);
    });
  });

  describe('Node navigation', () => {
    it('should not navigate when node is null or missing guid', () => {
      spyOn(router, 'navigate').and.stub();
      component.navigateTo(null);
      expect(router.navigate).not.toHaveBeenCalled();

      component.navigateTo({ entry: {} } as any);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should dispatch navigation action when node has guid', () => {
      spyOn(component['store'], 'dispatch').and.stub();
      component.navigateTo({ entry: { guid: 'guid' } } as SiteEntry);
      expect(component['store'].dispatch).toHaveBeenCalled();
    });

    it('should handle node double click', () => {
      spyOn(component, 'navigateTo').and.stub();
      const documentList = unitTestingUtils.getByDirective(DocumentListComponent);
      documentList.triggerEventHandler('node-dblclick', { detail: { node: { entry: { guid: 'guid' } } } });
      expect(component.navigateTo).toHaveBeenCalledWith({ entry: { guid: 'guid' } } as SiteEntry);
    });

    it('should handle name click', () => {
      spyOn(component, 'navigateTo').and.stub();
      const documentList = unitTestingUtils.getByDirective(DocumentListComponent);
      documentList.triggerEventHandler('name-click', { detail: { node: { entry: { guid: 'guid' } } } });
      expect(component.navigateTo).toHaveBeenCalledWith({ entry: { guid: 'guid' } } as SiteEntry);
    });
  });

  describe('Reload on actions', () => {
    it('should reload on libraryDeleted action', () => {
      appHookService.libraryDeleted.next('');
      expect(sitesService.getSites).toHaveBeenCalled();
    });

    it('should reload on libraryUpdated action', () => {
      appHookService.libraryUpdated.next(paging.list.entries[0]);
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
    const pagination: Pagination = {
      count: 100,
      hasMoreItems: true,
      totalItems: 300,
      skipCount: 25,
      maxItems: 25
    };

    it('should get list with pagination data onChange event', () => {
      component.onChange(pagination);
      expect(sitesService.getSites).toHaveBeenCalledWith(pagination);
    });

    it('should get list with pagination data onChangePageSize event', () => {
      component.onChangePageSize(pagination);
      expect(sitesService.getSites).toHaveBeenCalledWith(pagination);
    });

    it('should set preference page size onChangePageSize event', () => {
      component.onChangePageSize(pagination);
      expect(userPreference.paginationSize).toBe(pagination.maxItems);
    });
  });
});
