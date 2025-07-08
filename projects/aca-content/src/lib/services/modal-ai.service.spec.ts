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

import { ModalAiService } from './modal-ai.service';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { of, Subject } from 'rxjs';
import { NoopTranslateModule, StorageService, UnsavedChangesDialogComponent } from '@alfresco/adf-core';

describe('ModalAiService', () => {
  const mockQueryParams = new Subject<Params>();

  let service: ModalAiService;
  let dialogOpenSpy: jasmine.Spy<<T, R>(component: typeof UnsavedChangesDialogComponent, config?: MatDialogConfig) => MatDialogRef<T, R>>;
  let dialog: MatDialog;

  const setupBeforeEach = (query: string, storageGetItem: string) => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, MatDialogModule],
      providers: [
        {
          provide: StorageService,
          useValue: {
            getItem: () => storageGetItem,
            setItem: () => storageGetItem
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: mockQueryParams.asObservable(),
            snapshot: {
              queryParams: { query }
            }
          }
        }
      ]
    });

    dialog = TestBed.inject(MatDialog);
    dialogOpenSpy = spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<any>);
    service = TestBed.inject(ModalAiService);
  };

  describe('when there is no previous search and no UNSAVED_CHANGES_MODAL_HIDDEN in the storage', () => {
    it('should not open unsaved changes modal when there is not previous search and no UNSAVED_CHANGES_MODAL_HIDDEN in storage', () => {
      setupBeforeEach('', '');
      service.openUnsavedChangesModal(() => {});

      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });
  });

  describe('when there is no previous search and there is UNSAVED_CHANGES_MODAL_HIDDEN in storage', () => {
    it('should open unsaved changes modal when there is previous search and no UNSAVED_CHANGES_MODAL_HIDDEN in local storage', () => {
      setupBeforeEach('test', '');
      service.openUnsavedChangesModal(() => {});

      expect(dialogOpenSpy).toHaveBeenCalledWith(UnsavedChangesDialogComponent, {
        width: '345px',
        data: {
          descriptionText: 'KNOWLEDGE_RETRIEVAL.SEARCH.DISCARD_CHANGES.LOSE_RESPONSE',
          confirmButtonText: 'KNOWLEDGE_RETRIEVAL.SEARCH.DISCARD_CHANGES.ASK_AI',
          checkboxText: 'KNOWLEDGE_RETRIEVAL.SEARCH.DISCARD_CHANGES.DO_NOT_SHOW_MESSAGE',
          headerText: 'KNOWLEDGE_RETRIEVAL.SEARCH.DISCARD_CHANGES.WARNING'
        }
      });
    });

    it('should call callback after modal has been closed and change test value to true', () => {
      let test = false;
      const mockFunc = () => {
        test = true;
      };
      setupBeforeEach('test', '');
      service.openUnsavedChangesModal(mockFunc);
      expect(test).toBeTrue();
    });
  });

  describe('when there is previous search in query and UNSAVED_CHANGES_MODAL_HIDDEN is the storage', () => {
    it('should not open unsaved changes modal when has previous search and there is UNSAVED_CHANGES_MODAL_HIDDEN in local storage', () => {
      setupBeforeEach('test', 'true');
      service.openUnsavedChangesModal(() => {});

      expect(dialogOpenSpy).not.toHaveBeenCalled();
    });
  });
});
