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

import {
  AppStore,
  CreateLibraryAction,
  DeleteLibraryAction,
  LeaveLibraryAction,
  LibraryActionTypes,
  NavigateLibraryAction,
  NavigateRouteAction,
  UpdateLibraryAction,
  getAppSelection
} from '@alfresco/aca-shared/store';
import { inject, Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, take } from 'rxjs/operators';
import { ContentApiService } from '@alfresco/aca-shared';
import { ContentManagementService } from '../../services/content-management.service';
import { NotificationService } from '@alfresco/adf-core';

@Injectable()
export class LibraryEffects {
  private notificationService = inject(NotificationService);

  constructor(
    private store: Store<AppStore>,
    private actions$: Actions,
    private content: ContentManagementService,
    private contentApi: ContentApiService
  ) {}

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
        map((libraryId) => new NavigateLibraryAction(libraryId))
      ),
    { dispatch: true }
  );

  navigateLibrary$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<NavigateLibraryAction>(LibraryActionTypes.Navigate),
        map((action) => {
          const libraryId = action.payload;
          if (libraryId) {
            this.contentApi
              .getNode(libraryId, { relativePath: '/documentLibrary' })
              .pipe(map((node) => node.entry.id))
              .subscribe(
                (id) => {
                  const route = action.route ? action.route : 'libraries';
                  this.store.dispatch(new NavigateRouteAction([route, id]));
                },
                () => {
                  this.notificationService.showError('APP.MESSAGES.ERRORS.MISSING_CONTENT');
                }
              );
          }
        })
      ),
    { dispatch: false }
  );

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
