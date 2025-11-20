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

import { DocumentListDirective } from './document-list.directive';
import { Subject } from 'rxjs';
import { SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { TestBed } from '@angular/core/testing';

describe('DocumentListDirective', () => {
  let documentListDirective: DocumentListDirective;

  const preferenceKey = 'files';
  const sortingKey = 'sortingKey';
  const documentListMock: any = {
    currentFolderId: '',
    stickyHeader: false,
    includeFields: [],
    sorting: [],
    data: {
      setSorting: jasmine.createSpy('setSorting')
    },
    selection: [],
    reload: jasmine.createSpy('reload'),
    resetSelection: jasmine.createSpy('resetSelection'),
    ready: new Subject<any>(),
    setColumnsWidths: {},
    setColumnsVisibility: {},
    setColumnsOrder: {}
  };

  const storeMock: any = {
    dispatch: jasmine.createSpy('dispatch')
  };

  const mockRouter: any = {
    url: ''
  };

  const documentListServiceMock = {
    reload$: new Subject<any>(),
    resetSelection$: new Subject<any>()
  };

  const mockRoute: any = {
    snapshot: {
      data: {
        sortingPreferenceKey: null
      }
    }
  };

  const userPreferencesServiceMock: any = {
    set: jasmine.createSpy('set'),
    get: jasmine.createSpy('get'),
    hasItem: jasmine.createSpy('hasItem')
  };

  beforeEach(() => {
    TestBed.runInInjectionContext(() => {
      documentListDirective = new DocumentListDirective(
        storeMock,
        documentListMock,
        userPreferencesServiceMock,
        mockRoute,
        mockRouter,
        documentListServiceMock as any
      );
    });
  });

  afterEach(() => {
    storeMock.dispatch.calls.reset();
  });

  it('should not update store selection on `documentList.ready` if route includes `viewer:view`', () => {
    mockRouter.url = '/some-route/(viewer:view)';
    documentListDirective.ngOnInit();
    documentListMock.ready.next();

    expect(storeMock.dispatch).not.toHaveBeenCalled();
  });

  it('should update store selection on `documentList.ready`', () => {
    mockRouter.url = '/some-route';
    documentListDirective.ngOnInit();
    documentListMock.ready.next();

    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should enable sticky headers', () => {
    mockRouter.url = '/some-route';
    documentListMock.currentFolderId = '-mysites-';
    documentListDirective.ngOnInit();
    documentListMock.ready.next();

    expect(documentListMock.stickyHeader).toBeTruthy();
  });

  it('should set `isLibrary` to true if selected node is a library', () => {
    mockRouter.url = '/some-route';
    documentListMock.currentFolderId = '-mysites-';
    documentListMock.selection = [{}];
    documentListDirective.ngOnInit();
    documentListMock.ready.next();

    expect(storeMock.dispatch).toHaveBeenCalledWith(new SetSelectedNodesAction([{ isLibrary: true } as any]));
  });

  it('should update store selection on `node-unselect` event', () => {
    mockRouter.url = '/some-route';
    documentListDirective.ngOnInit();
    documentListDirective.onNodeUnselect();

    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should update store selection on `node-select` event', () => {
    mockRouter.url = '/some-route';
    documentListDirective.ngOnInit();
    documentListDirective.onNodeSelect({ detail: { node: {} } } as any);

    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should reset store selection on `reload` event', () => {
    documentListDirective.ngOnInit();
    documentListServiceMock.reload$.next({});

    expect(storeMock.dispatch).toHaveBeenCalledWith(new SetSelectedNodesAction([]));
  });

  it('should reset selection state on `reset` event', () => {
    documentListDirective.ngOnInit();
    documentListServiceMock.resetSelection$.next({});

    expect(storeMock.dispatch).toHaveBeenCalledWith(new SetSelectedNodesAction([]));
    expect(documentListDirective.selectedNode).toBeNull();
  });

  it('should set user preferences for columns visibility`', () => {
    const event = new CustomEvent('columnsVisibilityChanged', { detail: { 'app.tags': true, 'app.name': false } });
    mockRoute.snapshot.data.sortingPreferenceKey = preferenceKey;
    documentListDirective.ngOnInit();
    documentListDirective.onColumnsVisibilityChange(event);

    expect(userPreferencesServiceMock.set).toHaveBeenCalledWith('files.columns.visibility', JSON.stringify(event));
  });

  it('should set user preferences for columns order`', () => {
    const event = new CustomEvent('columnsOrderChanged', { detail: ['app.tags', 'app.name'] });
    mockRoute.snapshot.data.sortingPreferenceKey = preferenceKey;
    documentListDirective.ngOnInit();
    documentListDirective.onColumnOrderChanged(event);

    expect(userPreferencesServiceMock.set).toHaveBeenCalledWith('files.columns.order', JSON.stringify(event));
  });

  it('should set user preferences for columns width`', () => {
    const event = new CustomEvent('columnsWidthChanged', { detail: { 'app.tags': 65, 'app.name': 75 } });
    mockRoute.snapshot.data.sortingPreferenceKey = preferenceKey;
    documentListDirective.ngOnInit();
    documentListDirective.onColumnsWidthChanged(event);

    expect(userPreferencesServiceMock.set).toHaveBeenCalledWith('files.columns.width', JSON.stringify(event));
  });

  it('should set document list properties from user preferences`', () => {
    mockRoute.snapshot.data.sortingPreferenceKey = preferenceKey;
    userPreferencesServiceMock.hasItem.and.returnValue(true);
    userPreferencesServiceMock.get.and.returnValue(false);
    userPreferencesServiceMock.get.withArgs('files.columns.width').and.returnValue(JSON.stringify({ 'app.tag': 87 }));
    userPreferencesServiceMock.get.withArgs('files.columns.order').and.returnValue(JSON.stringify(['app.tag', 'app.name']));
    userPreferencesServiceMock.get.withArgs('files.columns.visibility').and.returnValue(JSON.stringify({ 'app.tag': true }));
    documentListDirective.ngOnInit();

    expect(documentListMock.setColumnsWidths).toEqual({ 'app.tag': 87 });
    expect(documentListMock.setColumnsOrder).toEqual(['app.tag', 'app.name']);
    expect(documentListMock.setColumnsVisibility).toEqual({ 'app.tag': true });
  });

  it('should set sorting using sortingKey from preferences if sortingKey exists in preferences', () => {
    mockRoute.snapshot.data.sortingPreferenceKey = preferenceKey;
    documentListMock.sortingMode = 'server';
    userPreferencesServiceMock.get.and.callThrough().withArgs(`${preferenceKey}.sorting.sortingKey`, null).and.returnValue(sortingKey);

    documentListDirective.ngOnInit();
    expect(documentListMock.sorting).toEqual([sortingKey, undefined]);
    expect(documentListMock.data.setSorting).toHaveBeenCalledWith({
      key: sortingKey,
      direction: undefined
    });
  });

  it('should set sorting using key from preferences when sortingKey is missing in preferences', () => {
    mockRoute.snapshot.data.sortingPreferenceKey = preferenceKey;
    documentListMock.sortingMode = 'server';
    userPreferencesServiceMock.get.and.callThrough().withArgs(`${preferenceKey}.sorting.key`, null).and.returnValue(sortingKey);

    documentListDirective.ngOnInit();
    expect(documentListMock.sorting).toEqual([sortingKey, undefined]);
    expect(documentListMock.data.setSorting).toHaveBeenCalledWith({
      key: sortingKey,
      direction: undefined
    });
  });

  describe('onReady', () => {
    beforeEach(() => {
      mockRoute.snapshot.data.sortingPreferenceKey = preferenceKey;
    });

    it('should set sorting using sortingKey from preferences if sortingKey exists in preferences', () => {
      userPreferencesServiceMock.get.and.callThrough().withArgs(`${preferenceKey}.sorting.sortingKey`, null).and.returnValue(sortingKey);

      documentListDirective.onReady();
      expect(documentListMock.sorting).toEqual([sortingKey, undefined]);
      expect(documentListMock.data.setSorting).toHaveBeenCalledWith({
        key: sortingKey,
        direction: undefined
      });
    });

    it('should set sorting using key from preferences when sortingKey is missing in preferences', () => {
      userPreferencesServiceMock.get.and.callThrough().withArgs(`${preferenceKey}.sorting.key`, null).and.returnValue(sortingKey);

      documentListDirective.onReady();
      expect(documentListMock.sorting).toEqual([sortingKey, undefined]);
      expect(documentListMock.data.setSorting).toHaveBeenCalledWith({
        key: sortingKey,
        direction: undefined
      });
    });
  });
});
