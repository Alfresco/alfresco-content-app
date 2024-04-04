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

import { TestBed } from '@angular/core/testing';
import { TranslationMock, TranslationService, UserPreferencesService } from '@alfresco/adf-core';
import { ContentApiService } from '@alfresco/aca-shared';
import { FavoritePaging, NodePaging, SharedLinkPaging } from '@alfresco/js-api';
import { ViewerService } from './viewer.service';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

const list = {
  list: {
    entries: [
      { entry: { id: 'node1', name: 'node 1', modifiedAt: new Date(1) } },
      { entry: { id: 'node3', name: 'node 3', modifiedAt: new Date(2) } },
      { entry: { id: 'node2', name: 'node 2', modifiedAt: new Date(1) } }
    ]
  }
};

const favoritesList = {
  list: {
    entries: [
      { entry: { target: { file: { id: 'node1', name: 'node 1' } } } },
      { entry: { target: { file: { id: 'node2', name: 'node 2' } } } },
      { entry: { target: { file: { id: 'node3', name: 'node 3' } } } }
    ]
  }
};

const emptyAdjacent = {
  left: null,
  right: null
};

const preferencesNoPrevSortValues = ['client', '', ''];
const preferencesCurSortValues = [...preferencesNoPrevSortValues, 'name', 'desc'];
const preferencesNoCurSortValues = [...preferencesNoPrevSortValues, '', ''];
const resultDesc = ['node3', 'node2', 'node1'];
const resultAsc = ['node1', 'node2', 'node3'];

describe('ViewerService', () => {
  let preferences: UserPreferencesService;
  let contentApi: ContentApiService;
  let viewerService: ViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientModule],
      providers: [{ provide: TranslationService, useClass: TranslationMock }, ViewerService, UserPreferencesService, ContentApiService]
    });

    preferences = TestBed.inject(UserPreferencesService);
    contentApi = TestBed.inject(ContentApiService);
    viewerService = TestBed.inject(ViewerService);
  });

  describe('Sorting for different sources', () => {
    beforeEach(() => {
      spyOn(preferences, 'get').and.returnValues(...preferencesCurSortValues, ...preferencesCurSortValues);
    });

    it('should fetch and sort file ids for personal files and libraries', async () => {
      spyOn(contentApi, 'getNodeChildren').and.returnValue(of(list as unknown as NodePaging));

      const idsPersonal = await viewerService.getFileIds('personal-files', 'folder1');
      const idsLibraries = await viewerService.getFileIds('libraries', 'folder1');

      expect(idsPersonal).toEqual(resultDesc);
      expect(idsLibraries).toEqual(resultDesc);
    });

    it('should fetch and sort file ids for favorites', async () => {
      spyOn(contentApi, 'getFavorites').and.returnValue(of(favoritesList as FavoritePaging));
      const idsFavorites = await viewerService.getFileIds('favorites');
      expect(idsFavorites).toEqual(resultDesc);
    });

    it('should fetch and sort file ids for shared', async () => {
      spyOn(contentApi, 'findSharedLinks').and.returnValue(
        of({
          list: {
            entries: [
              {
                entry: {
                  nodeId: 'node1',
                  name: 'node 1'
                }
              },
              {
                entry: {
                  nodeId: 'node2',
                  name: 'node 2'
                }
              },
              {
                entry: {
                  nodeId: 'node3',
                  name: 'node 3'
                }
              }
            ]
          }
        } as SharedLinkPaging)
      );
      const idsShared = await viewerService.getFileIds('shared');
      expect(idsShared).toEqual(resultDesc);
    });
  });

  it('should use default with no sorting for personal-files and other sources', async () => {
    spyOn(preferences, 'get').and.returnValues(...preferencesNoCurSortValues);

    spyOn(contentApi, 'getNodeChildren').and.returnValue(of(list as unknown as NodePaging));
    const idsFiles = await viewerService.getFileIds('personal-files', 'folder1');

    spyOn(contentApi, 'getFavorites').and.returnValue(of(favoritesList as FavoritePaging));
    const idsOther = await viewerService.getFileIds('favorites');

    expect(idsFiles).toEqual(resultAsc);
    expect(idsOther).toEqual(resultAsc);
  });

  describe('Other sorting scenarios', () => {
    beforeEach(() => {
      spyOn(contentApi, 'getNodeChildren').and.returnValue(of(list as unknown as NodePaging));
    });

    it('should not sort when server-side sorting is set', async () => {
      spyOn(preferences, 'get').and.returnValues('server', '', '', 'name', 'desc');
      const ids = await viewerService.getFileIds('personal-files', 'folder1');
      expect(ids).toEqual(['node1', 'node3', 'node2']);
    });

    it('should sort with previous and current sorting', async () => {
      spyOn(preferences, 'get').and.returnValues('client', 'name', 'asc', 'modifiedAt', 'desc');
      const ids = await viewerService.getFileIds('personal-files', 'folder1');
      expect(ids).toEqual(['node3', 'node1', 'node2']);
    });
  });

  it('should extract the property path root', () => {
    expect(viewerService.getRootField('some.property.path')).toBe('some');
    expect(viewerService.getRootField('some')).toBe('some');
    expect(viewerService.getRootField('')).toBe('');
    expect(viewerService.getRootField(null)).toBe(null);
  });

  it('should return empty adjacent nodes for missing node id or wrong source', async () => {
    const noNodeId = await viewerService.getNearestNodes(null, 'folder1', 'source');
    const wrongSource = await viewerService.getNearestNodes('id', 'folder1', 'source');

    expect(noNodeId).toEqual(emptyAdjacent);
    expect(wrongSource).toEqual(emptyAdjacent);
  });

  it('should return empty nearest nodes for missing folder id', async () => {
    const nearest = await viewerService.getNearestNodes('node1', null, 'source');

    expect(nearest).toEqual({ left: null, right: null });
  });

  it('should return empty nearest nodes for crashed fields id request', async () => {
    spyOn(viewerService, 'getFileIds').and.returnValue(Promise.reject(new Error('err')));

    const nearest = await viewerService.getNearestNodes('node1', 'folder1', 'source');

    expect(nearest).toEqual({ left: null, right: null });
  });

  it('should return nearest nodes', async () => {
    spyOn(viewerService, 'getFileIds').and.returnValue(Promise.resolve(['node1', 'node2', 'node3', 'node4', 'node5']));

    let nearest = await viewerService.getNearestNodes('node1', 'folder1', 'source');
    expect(nearest).toEqual({ left: null, right: 'node2' });

    nearest = await viewerService.getNearestNodes('node3', 'folder1', 'source');
    expect(nearest).toEqual({ left: 'node2', right: 'node4' });

    nearest = await viewerService.getNearestNodes('node5', 'folder1', 'source');
    expect(nearest).toEqual({ left: 'node4', right: null });
  });

  it('should return empty nearest nodes if node is already deleted', async () => {
    spyOn(viewerService, 'getFileIds').and.returnValue(Promise.resolve(['node1', 'node2', 'node3', 'node4', 'node5']));

    const nearest = await viewerService.getNearestNodes('node9', 'folder1', 'source');
    expect(nearest).toEqual({ left: null, right: null });
  });

  it('should require folder id to fetch ids for personal-files and libraries', async () => {
    const ids = await viewerService.getFileIds('libraries', null);
    expect(ids).toEqual([]);
  });
});
