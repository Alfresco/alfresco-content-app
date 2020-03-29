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
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlfrescoApiService,
  NodeFavoriteDirective,
  DataTableComponent,
  AppConfigPipe,
  UserPreferencesService
} from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { FavoriteLibrariesComponent } from './favorite-libraries.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ContentApiService } from '@alfresco/aca-shared';
import { ContentManagementService } from '../../services/content-management.service';
import { EffectsModule } from '@ngrx/effects';
import { RouterEffects } from '@alfresco/aca-shared/store';
import { of, throwError } from 'rxjs';
import { LibraryEffects } from '../../store/effects';
describe('FavoriteLibrariesComponent', function() {
  var fixture;
  var component;
  var alfrescoApi;
  var userPreference;
  var contentApiService;
  var router;
  var page;
  var contentManagementService;
  beforeEach(function() {
    page = {
      list: {
        entries: [{ entry: { id: 1 } }, { entry: { id: 2 } }],
        pagination: { data: 'data' }
      }
    };
  });
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [
        AppTestingModule,
        EffectsModule.forRoot([RouterEffects, LibraryEffects])
      ],
      declarations: [
        DataTableComponent,
        NodeFavoriteDirective,
        DocumentListComponent,
        FavoriteLibrariesComponent,
        AppConfigPipe
      ],
      providers: [ContentManagementService, UserPreferencesService],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(FavoriteLibrariesComponent);
    component = fixture.componentInstance;
    alfrescoApi = TestBed.get(AlfrescoApiService);
    contentApiService = TestBed.get(ContentApiService);
    userPreference = TestBed.get(UserPreferencesService);
    contentManagementService = TestBed.get(ContentManagementService);
    alfrescoApi.reset();
    router = TestBed.get(Router);
    spyOn(contentApiService, 'getNode').and.returnValue(
      of({ entry: { id: 'libraryId' } })
    );
  });
  describe('on initialization', function() {
    it('should set data', function() {
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(
        of(page)
      );
      fixture.detectChanges();
      expect(component.list).toBe(page);
      expect(component.pagination).toBe(page.list.pagination);
    });
    it('should get data with user preference pagination size', function() {
      userPreference.paginationSize = 1;
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(
        of(page)
      );
      fixture.detectChanges();
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalledWith(
        '-me-',
        { maxItems: userPreference.paginationSize }
      );
    });
    it('should set data on error', function() {
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(
        throwError('error')
      );
      fixture.detectChanges();
      expect(component.list).toBe(null);
      expect(component.pagination).toBe(null);
      expect(component.isLoading).toBe(false);
    });
  });
  describe('Node navigation', function() {
    it('does not navigate when id is not passed', function() {
      spyOn(router, 'navigate').and.stub();
      component.navigateTo(null);
      expect(router.navigate).not.toHaveBeenCalled();
    });
    it('does not navigate when id is not passed', function() {
      spyOn(router, 'navigate').and.stub();
      component.navigateTo({ entry: { guid: 'guid' } });
      expect(router.navigate).toHaveBeenCalledWith(['libraries', 'libraryId']);
    });
  });
  describe('Reload on actions', function() {
    beforeEach(function() {
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(
        of(page)
      );
      fixture.detectChanges();
    });
    it('should reload on libraryDeleted action', function() {
      contentManagementService.libraryDeleted.next();
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalled();
    });
    it('should reload on libraryUpdated action', function() {
      contentManagementService.libraryUpdated.next();
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalled();
    });
    it('should reload on favoriteLibraryToggle action', function() {
      contentManagementService.favoriteLibraryToggle.next();
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalled();
    });
    it('should reload on libraryJoined action', function() {
      contentManagementService.libraryJoined.next();
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalled();
    });
    it('should reload on libraryLeft action', function() {
      contentManagementService.libraryLeft.next();
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalled();
    });
  });
  describe('Pagination', function() {
    var pagination;
    beforeEach(function() {
      pagination = {
        count: 100,
        hasMoreItems: true,
        totalItems: 300,
        skipCount: 25,
        maxItems: 25
      };
    });
    it('should get list with pagination data onChange event', function() {
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(
        of(page)
      );
      component.onChange(pagination);
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalledWith(
        '-me-',
        pagination
      );
    });
    it('should get list with pagination data onChangePageSize event', function() {
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(
        of(page)
      );
      component.onChangePageSize(pagination);
      expect(contentApiService.getFavoriteLibraries).toHaveBeenCalledWith(
        '-me-',
        pagination
      );
    });
    it('should set preference page size onChangePageSize event', function() {
      spyOn(contentApiService, 'getFavoriteLibraries').and.returnValue(
        of(page)
      );
      component.onChangePageSize(pagination);
      expect(userPreference.paginationSize).toBe(pagination.maxItems);
    });
  });
});
//# sourceMappingURL=favorite-libraries.component.spec.js.map
