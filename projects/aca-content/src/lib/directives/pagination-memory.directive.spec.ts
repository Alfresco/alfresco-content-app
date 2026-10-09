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

import { BehaviorSubject, Subject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { PaginationStateService } from '@alfresco/aca-shared';
import { PaginationModel } from '@alfresco/adf-core';
import { NodePaging } from '@alfresco/js-api';
import { PaginationMemoryDirective } from './pagination-memory.directive';

interface DocumentListMock {
  currentFolderId: string;
  isDataProvidedExternally: boolean;
  ready: Subject<NodePaging>;
  pagination: BehaviorSubject<PaginationModel>;
  updatePagination: jasmine.Spy<DocumentListComponent['updatePagination']>;
}

describe('PaginationMemoryDirective', () => {
  let directive: PaginationMemoryDirective;
  let documentListMock: DocumentListMock;
  let paginationStateMock: jasmine.SpyObj<PaginationStateService>;

  const emitReady = (pagination: { skipCount: number; maxItems: number; totalItems?: number }) => {
    documentListMock.ready.next({ list: { pagination } } as NodePaging);
  };

  beforeEach(() => {
    documentListMock = {
      currentFolderId: 'folder-1',
      isDataProvidedExternally: false,
      ready: new Subject<NodePaging>(),
      pagination: new BehaviorSubject<PaginationModel>({ skipCount: 0, maxItems: 25 }),
      updatePagination: jasmine.createSpy<DocumentListComponent['updatePagination']>('updatePagination')
    };

    paginationStateMock = jasmine.createSpyObj<PaginationStateService>('PaginationStateService', [
      'prepareContext',
      'getPaginationState',
      'setPaginationState',
      'resetPaginationState',
      'clearAll'
    ]);
    paginationStateMock.getPaginationState.and.returnValue(null);

    TestBed.configureTestingModule({
      imports: [PaginationMemoryDirective],
      providers: [
        PaginationMemoryDirective,
        { provide: DocumentListComponent, useValue: documentListMock },
        { provide: PaginationStateService, useValue: paginationStateMock }
      ]
    });

    directive = TestBed.inject(PaginationMemoryDirective);
    directive.ngOnInit();
  });

  it('should delegate context detection to the state service on every folder load', () => {
    emitReady({ skipCount: 0, maxItems: 25 });

    expect(paginationStateMock.prepareContext).toHaveBeenCalled();
  });

  it('should restore the stored page for the folder', () => {
    paginationStateMock.getPaginationState.and.returnValue({ skipCount: 25, maxItems: 25 });

    emitReady({ skipCount: 0, maxItems: 25, totalItems: 100 });

    expect(documentListMock.updatePagination).toHaveBeenCalledWith({ maxItems: 25, skipCount: 25 });
  });

  it('should keep the stored state when drilling down (not reset it)', () => {
    paginationStateMock.getPaginationState.and.returnValue({ skipCount: 25, maxItems: 25 });

    emitReady({ skipCount: 0, maxItems: 25, totalItems: 100 });

    expect(paginationStateMock.resetPaginationState).not.toHaveBeenCalled();
  });

  it('should stay on the first page when there is no stored state', () => {
    paginationStateMock.getPaginationState.and.returnValue(null);

    emitReady({ skipCount: 0, maxItems: 25, totalItems: 100 });

    expect(documentListMock.updatePagination).not.toHaveBeenCalled();
  });

  it('should force the first page when a stale page is loaded and nothing is stored', () => {
    paginationStateMock.getPaginationState.and.returnValue(null);

    emitReady({ skipCount: 50, maxItems: 25, totalItems: 100 });

    expect(documentListMock.updatePagination).toHaveBeenCalledWith({ maxItems: 25, skipCount: 0 });
  });

  it('should drop and not apply a stored page that is beyond the available items', () => {
    paginationStateMock.getPaginationState.and.returnValue({ skipCount: 200, maxItems: 25 });

    emitReady({ skipCount: 0, maxItems: 25, totalItems: 100 });

    expect(paginationStateMock.resetPaginationState).toHaveBeenCalledWith('folder-1');
    expect(documentListMock.updatePagination).not.toHaveBeenCalled();
  });

  it('should not restore when the loaded page already matches the stored page', () => {
    paginationStateMock.getPaginationState.and.returnValue({ skipCount: 25, maxItems: 25 });

    emitReady({ skipCount: 25, maxItems: 25, totalItems: 100 });

    expect(documentListMock.updatePagination).not.toHaveBeenCalled();
  });

  it('should be inert when the data is provided externally', () => {
    documentListMock.isDataProvidedExternally = true;

    emitReady({ skipCount: 50, maxItems: 25 });

    expect(paginationStateMock.prepareContext).not.toHaveBeenCalled();
    expect(documentListMock.updatePagination).not.toHaveBeenCalled();
  });

  it('should be inert when there is no current folder id', () => {
    documentListMock.currentFolderId = null;

    emitReady({ skipCount: 50, maxItems: 25 });

    expect(paginationStateMock.prepareContext).not.toHaveBeenCalled();
    expect(documentListMock.updatePagination).not.toHaveBeenCalled();
  });

  it('should only handle a folder once per visit (ignores in-folder reloads)', () => {
    emitReady({ skipCount: 0, maxItems: 25, totalItems: 100 });
    paginationStateMock.getPaginationState.calls.reset();

    emitReady({ skipCount: 25, maxItems: 25, totalItems: 100 });

    expect(paginationStateMock.getPaginationState).not.toHaveBeenCalled();
    expect(documentListMock.updatePagination).not.toHaveBeenCalled();
  });

  it('should persist the page when pagination changes for the handled folder', () => {
    emitReady({ skipCount: 0, maxItems: 25, totalItems: 100 });
    paginationStateMock.setPaginationState.calls.reset();

    documentListMock.pagination.next({ skipCount: 25, maxItems: 25 });

    expect(paginationStateMock.setPaginationState).toHaveBeenCalledWith('folder-1', { skipCount: 25, maxItems: 25 });
  });

  it('should not persist pagination before the folder has been handled', () => {
    documentListMock.pagination.next({ skipCount: 25, maxItems: 25 });

    expect(paginationStateMock.setPaginationState).not.toHaveBeenCalled();
  });
});
