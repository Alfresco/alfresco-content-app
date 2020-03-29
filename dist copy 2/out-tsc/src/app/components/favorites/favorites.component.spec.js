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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  AlfrescoApiService,
  NodeFavoriteDirective,
  DataTableComponent,
  AppConfigPipe,
  UploadService
} from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { of } from 'rxjs';
import { FavoritesComponent } from './favorites.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ContentApiService } from '@alfresco/aca-shared';
describe('FavoritesComponent', function() {
  var fixture;
  var component;
  var alfrescoApi;
  var contentApi;
  var router;
  var mockRouter = {
    url: 'favorites',
    navigate: function() {}
  };
  var page;
  var node;
  var uploadService;
  beforeEach(function() {
    page = {
      list: {
        entries: [
          { entry: { id: 1, target: { file: {} } } },
          { entry: { id: 2, target: { folder: {} } } }
        ],
        pagination: { data: 'data' }
      }
    };
    node = {
      id: 'folder-node',
      isFolder: true,
      isFile: false,
      path: {
        elements: []
      }
    };
  });
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [
        DataTableComponent,
        NodeFavoriteDirective,
        DocumentListComponent,
        FavoritesComponent,
        AppConfigPipe
      ],
      providers: [
        {
          provide: Router,
          useValue: mockRouter
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    alfrescoApi = TestBed.get(AlfrescoApiService);
    alfrescoApi.reset();
    spyOn(alfrescoApi.favoritesApi, 'getFavorites').and.returnValue(
      Promise.resolve(page)
    );
    contentApi = TestBed.get(ContentApiService);
    uploadService = TestBed.get(UploadService);
    router = TestBed.get(Router);
  });
  describe('Node navigation', function() {
    beforeEach(function() {
      spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
      spyOn(router, 'navigate');
      fixture.detectChanges();
    });
    it('navigates to `/libraries` if node path has `Sites`', function() {
      node.path.elements = [{ name: 'Sites' }];
      component.navigate(node);
      expect(router.navigate).toHaveBeenCalledWith([
        '/libraries',
        'folder-node'
      ]);
    });
    it('navigates to `/personal-files` if node path has no `Sites`', function() {
      node.path.elements = [{ name: 'something else' }];
      component.navigate(node);
      expect(router.navigate).toHaveBeenCalledWith([
        '/personal-files',
        'folder-node'
      ]);
    });
    it('does not navigate when node is not folder', function() {
      node.isFolder = false;
      component.navigate(node);
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
  it('should call document list reload on fileUploadComplete event', fakeAsync(function() {
    spyOn(component, 'reload');
    fixture.detectChanges();
    uploadService.fileUploadComplete.next();
    tick(500);
    expect(component.reload).toHaveBeenCalled();
  }));
  it('should call document list reload on fileUploadDeleted event', fakeAsync(function() {
    spyOn(component, 'reload');
    fixture.detectChanges();
    uploadService.fileUploadDeleted.next();
    tick(500);
    expect(component.reload).toHaveBeenCalled();
  }));
  it('should navigate if node is folder', function() {
    var nodeEntity = { entry: { isFolder: true } };
    spyOn(component, 'navigate').and.stub();
    fixture.detectChanges();
    component.onNodeDoubleClick(nodeEntity);
    expect(component.navigate).toHaveBeenCalledWith(nodeEntity.entry);
  });
  it('should call showPreview if node is file', function() {
    var nodeEntity = { entry: { isFile: true } };
    spyOn(component, 'showPreview').and.stub();
    fixture.detectChanges();
    component.onNodeDoubleClick(nodeEntity);
    expect(component.showPreview).toHaveBeenCalledWith(nodeEntity, {
      location: mockRouter.url
    });
  });
});
//# sourceMappingURL=favorites.component.spec.js.map
