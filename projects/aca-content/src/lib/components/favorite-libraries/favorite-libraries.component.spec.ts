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
import { UserPreferencesService } from '@alfresco/adf-core';
import { AlfrescoApiService } from '@alfresco/adf-content-services';
import { FavoriteLibrariesComponent } from './favorite-libraries.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { AppHookService, ContentApiService } from '@alfresco/aca-shared';
import { provideEffects } from '@ngrx/effects';
import { RouterEffects } from '@alfresco/aca-shared/store';
import { of, throwError } from 'rxjs';
import { LibraryEffects } from '../../store/effects';
import { NodeEntry } from '@alfresco/js-api';
import { getTitleElementText } from '../../testing/test-utils';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SiteEntry } from '@alfresco/js-api/typings';

describe('FavoriteLibrariesComponent', () => {
  let fixture: ComponentFixture<FavoriteLibrariesComponent>;
  let component: FavoriteLibrariesComponent;
  let alfrescoApi: AlfrescoApiService;
  let userPreference: UserPreferencesService;
  let contentApiService: ContentApiService;
  let router: Router;
  let page;
  let appHookService: AppHookService;

  beforeEach(() => {
    page = {
      list: {
        entries: [{ entry: { id: 1 } }, { entry: { id: 2 } }],
        pagination: { data: 'data' }
      }
    };
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, FavoriteLibrariesComponent, MatSnackBarModule],
      providers: [provideEffects([RouterEffects, LibraryEffects])]
    });

    fixture = TestBed.createComponent(FavoriteLibrariesComponent);
    component = fixture.componentInstance;

    alfrescoApi = TestBed.inject(AlfrescoApiService);
    contentApiService = TestBed.inject(ContentApiService);
    userPreference = TestBed.inject(UserPreferencesService);
    appHookService = TestBed.inject(AppHookService);
    alfrescoApi.reset();
    router = TestBed.inject(Router);

    spyOn(contentApiService, 'getNode').and.returnValue(of({ entry: { id: 'libraryId' } } as NodeEntry));
  });

  describe('on initialization', () => {
    it('should set data', () => {
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(of(page));
      fixture.detectChanges();

      expect(component.list).toBe(page);
      expect(component.pagination).toBe(page.list.pagination);
    });

    it('should get data with user preference pagination size', () => {
      userPreference.paginationSize = 1;
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(of(page));

      fixture.detectChanges();

      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalledWith('-me-', {
        maxItems: userPreference.paginationSize
      });
    });

    it('should set data on error', () => {
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(throwError('error'));
      fixture.detectChanges();

      expect(component.list).toBe(null);
      expect(component.pagination).toBe(null);
      expect(component.isLoading).toBe(false);
    });

    it('should set title based on selectedRowItemsCount', () => {
      fixture.detectChanges();

      expect(getTitleElementText(fixture)).toBe('APP.BROWSE.LIBRARIES.MENU.FAVORITE_LIBRARIES.TITLE');

      component.selectedRowItemsCount = 5;
      fixture.detectChanges();

      expect(getTitleElementText(fixture)).toBe('APP.HEADER.SELECTED');
    });
  });

  describe('Node navigation', () => {
    it('does not navigate when id is not passed', () => {
      spyOn(router, 'navigate').and.stub();
      component.navigateTo(null);

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('does not navigate when id is not passed', () => {
      spyOn(router, 'navigate').and.stub();
      component.navigateTo({
        entry: {
          guid: 'test-guid',
          visibility: 'PUBLIC',
          role: 'SiteConsumer'
        }
      } as SiteEntry);

      expect(router.navigate).toHaveBeenCalledWith(['favorite/libraries', 'libraryId']);
    });
  });

  describe('Reload on actions', () => {
    beforeEach(() => {
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(of(page));
      fixture.detectChanges();
    });

    it('should reload on libraryDeleted action', () => {
      appHookService.libraryDeleted.next('');
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalled();
    });

    it('should reload on libraryUpdated action', () => {
      appHookService.libraryUpdated.next({} as any);
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalled();
    });

    it('should reload on favoriteLibraryToggle action', () => {
      appHookService.favoriteLibraryToggle.next();
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalled();
    });

    it('should reload on libraryJoined action', () => {
      appHookService.libraryJoined.next();
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalled();
    });

    it('should reload on libraryLeft action', () => {
      appHookService.libraryLeft.next({} as any);
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalled();
    });
  });

  describe('Pagination', () => {
    let pagination;

    beforeEach(() => {
      pagination = {
        count: 100,
        hasMoreItems: true,
        totalItems: 300,
        skipCount: 25,
        maxItems: 25
      };
    });

    it('should get list with pagination data onChange event', () => {
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(of(page));

      component.onChange(pagination);

      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalledWith('-me-', pagination);
    });

    it('should get list with pagination data onChangePageSize event', () => {
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(of(page));

      component.onChangePageSize(pagination);

      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalledWith('-me-', pagination);
    });

    it('should set preference page size onChangePageSize event', () => {
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(of(page));

      component.onChangePageSize(pagination);

      expect(userPreference.paginationSize).toBe(pagination.maxItems);
    });
  });
});
