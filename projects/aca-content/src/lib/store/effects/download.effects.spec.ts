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
import { AppTestingModule } from '../../testing/app-testing.module';
import { EffectsModule } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DownloadNodesAction } from '@alfresco/aca-shared/store';
import { SelectionState } from '@alfresco/adf-extensions';
import { VersionEntry } from '@alfresco/js-api';
import { DownloadEffects } from './download.effects';

describe('DownloadEffects', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, EffectsModule.forRoot([DownloadEffects]), MatDialogModule]
    });
    store = TestBed.inject(Store);
  });

  describe('downloadNode$', () => {
    let dialog: MatDialog;

    beforeEach(() => {
      dialog = TestBed.inject(MatDialog);
    });

    it('should focus element indicated by passed selector after closing modal', () => {
      const elementToFocusSelector = 'button';
      const afterClosed$ = new Subject<void>();
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => afterClosed$.asObservable()
      } as MatDialogRef<any>);
      const elementToFocus = document.createElement(elementToFocusSelector);
      spyOn(elementToFocus, 'focus');
      spyOn(document, 'querySelector').withArgs(elementToFocusSelector).and.returnValue(elementToFocus);
      spyOn(store, 'select').and.returnValues(
        new BehaviorSubject({
          isEmpty: false,
          nodes: [
            {
              entry: {
                id: 'someId',
                isFolder: true
              }
            }
          ]
        } as SelectionState),
        new BehaviorSubject<VersionEntry>(null)
      );
      store.dispatch(
        new DownloadNodesAction([], {
          focusedElementOnCloseSelector: elementToFocusSelector
        })
      );
      afterClosed$.next();
      expect(elementToFocus.focus).toHaveBeenCalled();
    });

    it('should not looking for element to focus if passed selector is empty string', () => {
      const afterClosed$ = new Subject<void>();
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => afterClosed$.asObservable()
      } as MatDialogRef<any>);
      spyOn(document, 'querySelector');
      spyOn(store, 'select').and.returnValues(
        new BehaviorSubject({
          isEmpty: false,
          nodes: [
            {
              entry: {
                id: 'someId',
                isFolder: true
              }
            }
          ]
        } as SelectionState),
        new BehaviorSubject<VersionEntry>(null)
      );
      store.dispatch(
        new DownloadNodesAction([], {
          focusedElementOnCloseSelector: ''
        })
      );
      afterClosed$.next();
      expect(document.querySelector).not.toHaveBeenCalled();
    });
  });
});
