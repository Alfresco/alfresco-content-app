/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Router } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CustomResourcesService } from '@alfresco/adf-content-services';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { FavoritesComponent } from './favorites.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { AppService, ContentApiService } from '@alfresco/aca-shared';
import { getTitleElementText } from '../../testing/test-utils';

describe('FavoritesComponent', () => {
  let fixture: ComponentFixture<FavoritesComponent>;
  let component: FavoritesComponent;
  let contentApi: ContentApiService;
  let router: Router;
  let node;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, FavoritesComponent],
      providers: [
        {
          provide: AppService,
          useValue: {
            appNavNarMode$: new BehaviorSubject('expanded'),
            toggleAppNavBar$: new Subject()
          }
        }
      ]
    });

    const page: any = {
      list: {
        entries: [{ entry: { id: 1, target: { file: {} } } }, { entry: { id: 2, target: { folder: {} } } }],
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

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;

    const customResourcesService = TestBed.inject(CustomResourcesService);
    spyOn(customResourcesService, 'loadFavorites').and.returnValue(of(page));

    contentApi = TestBed.inject(ContentApiService);
    router = TestBed.inject(Router);
    spyOnProperty(router, 'url').and.returnValue('favorites');
  });

  describe('Node navigation', () => {
    beforeEach(() => {
      spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
      spyOn(router, 'navigate').and.stub();
      fixture.detectChanges();
    });

    it('navigates to `/libraries` if node path has `Sites`', () => {
      node.path.elements = [{ name: 'Sites' }];

      component.navigate(node);

      expect(router.navigate).toHaveBeenCalledWith(['/libraries', 'folder-node']);
    });

    it('navigates to `/personal-files` if node path has no `Sites`', () => {
      node.path.elements = [{ name: 'something else' }];

      component.navigate(node);

      expect(router.navigate).toHaveBeenCalledWith(['/personal-files', 'folder-node']);
    });

    it('does not navigate when node is not folder', () => {
      node.isFolder = false;

      component.navigate(node);

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  it('should navigate if node is folder', () => {
    const nodeEntity: any = { entry: { isFolder: true } };
    spyOn(component, 'navigate').and.stub();
    fixture.detectChanges();

    component.onNodeDoubleClick(nodeEntity);
    expect(component.navigate).toHaveBeenCalledWith(nodeEntity.entry);
  });

  it('should call showPreview if node is file', () => {
    const nodeEntity: any = { entry: { isFile: true } };
    spyOn(component, 'showPreview').and.stub();
    fixture.detectChanges();

    component.onNodeDoubleClick(nodeEntity);
    expect(component.showPreview).toHaveBeenCalledWith(nodeEntity, {
      location: 'favorites'
    });
  });

  it('should set title based on selectedRowItemsCount', () => {
    fixture.detectChanges();
    expect(getTitleElementText(fixture)).toBe('APP.BROWSE.FAVORITES.TITLE');

    component.selectedRowItemsCount = 5;
    fixture.detectChanges();
    expect(getTitleElementText(fixture)).toBe('APP.HEADER.SELECTED');
  });
});
