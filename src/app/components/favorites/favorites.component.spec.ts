/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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
import { TestBed, ComponentFixture } from '@angular/core/testing';
import {
  AlfrescoApiService,
  NodeFavoriteDirective,
  DataTableComponent,
  AppConfigPipe
} from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { of } from 'rxjs';
import { FavoritesComponent } from './favorites.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ContentApiService } from '@alfresco/aca-shared';

describe('FavoritesComponent', () => {
  let fixture: ComponentFixture<FavoritesComponent>;
  let component: FavoritesComponent;
  let alfrescoApi: AlfrescoApiService;
  let contentApi: ContentApiService;
  let router: Router;
  let page;
  let node;

  beforeEach(() => {
    page = {
      list: {
        entries: [
          { entry: { id: 1, target: { file: {} } } },
          { entry: { id: 2, target: { folder: {} } } }
        ],
        pagination: { data: 'data' }
      }
    };

    node = <any>{
      id: 'folder-node',
      isFolder: true,
      isFile: false,
      path: {
        elements: []
      }
    };
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [
        DataTableComponent,
        NodeFavoriteDirective,
        DocumentListComponent,
        FavoritesComponent,
        AppConfigPipe
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
    router = TestBed.get(Router);
  });

  describe('Node navigation', () => {
    beforeEach(() => {
      spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
      spyOn(router, 'navigate');
      fixture.detectChanges();
    });

    it('navigates to `/libraries` if node path has `Sites`', () => {
      node.path.elements = [{ name: 'Sites' }];

      component.navigate(node);

      expect(router.navigate).toHaveBeenCalledWith([
        '/libraries',
        'folder-node'
      ]);
    });

    it('navigates to `/personal-files` if node path has no `Sites`', () => {
      node.path.elements = [{ name: 'something else' }];

      component.navigate(node);

      expect(router.navigate).toHaveBeenCalledWith([
        '/personal-files',
        'folder-node'
      ]);
    });

    it('does not navigate when node is not folder', () => {
      node.isFolder = false;

      component.navigate(node);

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should call document list reload', () => {
      spyOn(component, 'reload');
      fixture.detectChanges();

      component.reload();

      expect(component.reload).toHaveBeenCalled();
    });
  });
});
