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

import {
  AppStore,
  CreateLibraryAction,
  DeleteLibraryAction,
  getAppSelection,
  LeaveLibraryAction,
  LibraryActionTypes,
  NavigateLibraryAction,
  NavigateRouteAction,
  UpdateLibraryAction,
  isAdmin
} from '@alfresco/aca-shared/store';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { ContentApiService } from '@alfresco/aca-shared';
import { ContentManagementService } from '../../services/content-management.service';
import { NotificationService } from '@alfresco/adf-core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class LibraryEffects {
  private notificationService = inject(NotificationService);
  private store = inject(Store<AppStore>);
  private actions$ = inject(Actions);
  private content = inject(ContentManagementService);
  private contentApi = inject(ContentApiService);

  deleteLibrary$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<DeleteLibraryAction>(LibraryActionTypes.Delete),
        map((action) => {
          if (action.payload) {
            this.content.deleteLibrary(action.payload);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection?.library) {
                  this.content.deleteLibrary(selection.library.entry.id);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  leaveLibrary$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<LeaveLibraryAction>(LibraryActionTypes.Leave),
        map((action) => {
          if (action.payload) {
            this.content.leaveLibrary(action.payload);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection?.library) {
                  this.content.leaveLibrary(selection.library.entry.id, action.configuration?.focusedElementOnCloseSelector);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  createLibrary$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<CreateLibraryAction>(LibraryActionTypes.Create),
        mergeMap(() => this.content.createLibrary()),
        tap((libraryId) => this.navigateToLibraryById(libraryId))
      ),
    { dispatch: false }
  );

  navigateLibrary$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<NavigateLibraryAction>(LibraryActionTypes.Navigate),
        tap((action) => {
          const payload = action.payload;
          if (payload && 'guid' in payload) {
            this.store
              .select(isAdmin)
              .pipe(take(1))
              .subscribe((isUserAdmin) => {
                if (!isUserAdmin && payload.visibility !== 'PUBLIC' && !payload.role) {
                  this.notificationService.showError('APP.BROWSE.LIBRARIES.LIBRARY_NO_PERMISSIONS_WARNING');
                } else {
                  this.navigateToLibraryById(payload.guid, action.route);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  private navigateToLibraryById(libraryId: string, route = 'libraries'): void {
    this.contentApi
      .getNode(libraryId, { relativePath: '/documentLibrary' })
      .pipe(
        map((node) => node.entry.id),
        take(1)
      )
      .subscribe({
        next: (id) => {
          this.store.dispatch(new NavigateRouteAction([route, id]));
        },
        error: (error: HttpErrorResponse) => {
          switch (error.status) {
            case 403:
              this.notificationService.showWarning('APP.BROWSE.LIBRARIES.LIBRARY_NO_PERMISSIONS_WARNING');
              break;
            case 404:
              this.notificationService.showError('APP.BROWSE.LIBRARIES.ERRORS.LIBRARY_NOT_FOUND');
              break;
            default:
              this.notificationService.showError('APP.BROWSE.LIBRARIES.ERRORS.LIBRARY_LOADING_ERROR');
          }
        }
      });
  }

  updateLibrary$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<UpdateLibraryAction>(LibraryActionTypes.Update),
        map((action) => {
          this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe((selection) => {
              if (selection?.library) {
                const { id } = selection.library.entry;
                const { title, description, visibility } = action.payload;

                const siteBody = {
                  title,
                  description,
                  visibility
                };

                this.content.updateLibrary(id, siteBody);
              }
            });
        })
      ),
    { dispatch: false }
  );
}
