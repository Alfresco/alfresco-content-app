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

import { DocumentListDirective } from './document-list.directive';
import { Subject } from 'rxjs';
import { SetSelectedNodesAction } from '@alfresco/aca-shared/store';

describe('DocumentListDirective', () => {
  let documentListDirective: DocumentListDirective;

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
    ready: new Subject<any>()
  };

  const storeMock: any = {
    dispatch: jasmine.createSpy('dispatch')
  };

  const mockRouter: any = {
    url: ''
  };

  const appHookServiceMock: any = {
    reload: new Subject<any>(),
    reset: new Subject<any>()
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
    get: jasmine.createSpy('get')
  };

  beforeEach(() => {
    documentListDirective = new DocumentListDirective(
      storeMock,
      documentListMock,
      userPreferencesServiceMock,
      mockRoute,
      mockRouter,
      appHookServiceMock
    );
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

  it('should reset and reload document list on `reload` event', () => {
    documentListDirective.ngOnInit();
    appHookServiceMock.reload.next();

    expect(documentListMock.resetSelection).toHaveBeenCalled();
    expect(documentListMock.reload).toHaveBeenCalled();
  });

  it('should reset store selection on `reload` event', () => {
    documentListDirective.ngOnInit();
    appHookServiceMock.reload.next();

    expect(storeMock.dispatch).toHaveBeenCalledWith(new SetSelectedNodesAction([]));
  });

  it('should reset selection state on `reset` event', () => {
    documentListDirective.ngOnInit();
    appHookServiceMock.reset.next();

    expect(documentListMock.resetSelection).toHaveBeenCalled();
    expect(storeMock.dispatch).toHaveBeenCalledWith(new SetSelectedNodesAction([]));
    expect(documentListDirective.selectedNode).toBeNull();
  });
});
