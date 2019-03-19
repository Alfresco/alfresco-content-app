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

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map, take, mergeMap } from 'rxjs/operators';
import {
  DeleteLibraryAction,
  DELETE_LIBRARY,
  CreateLibraryAction,
  CREATE_LIBRARY,
  NavigateLibraryAction,
  NAVIGATE_LIBRARY,
  UpdateLibraryAction,
  UPDATE_LIBRARY,
  LeaveLibraryAction,
  LEAVE_LIBRARY,
  NavigateRouteAction
} from '../actions';
import { ContentManagementService } from '../../services/content-management.service';
import { Store } from '@ngrx/store';
import { AppStore } from '../states';
import { appSelection } from '../selectors/app.selectors';
import { ContentApiService } from '../../services/content-api.service';
import { SnackbarErrorAction } from '../actions/snackbar.actions';

@Injectable()
export class LibraryEffects {
  constructor(
    private store: Store<AppStore>,
    private actions$: Actions,
    private content: ContentManagementService,
    private contentApi: ContentApiService
  ) {}

  @Effect({ dispatch: false })
  deleteLibrary$ = this.actions$.pipe(
    ofType<DeleteLibraryAction>(DELETE_LIBRARY),
    map(action => {
      if (action.payload) {
        this.content.deleteLibrary(action.payload);
      } else {
        this.store
          .select(appSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.library) {
              this.content.deleteLibrary(selection.library.entry.id);
            }
          });
      }
    })
  );

  @Effect({ dispatch: false })
  leaveLibrary$ = this.actions$.pipe(
    ofType<LeaveLibraryAction>(LEAVE_LIBRARY),
    map(action => {
      if (action.payload) {
        this.content.leaveLibrary(action.payload);
      } else {
        this.store
          .select(appSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.library) {
              this.content.leaveLibrary(selection.library.entry.id);
            }
          });
      }
    })
  );

  @Effect()
  createLibrary$ = this.actions$.pipe(
    ofType<CreateLibraryAction>(CREATE_LIBRARY),
    mergeMap(() => this.content.createLibrary()),
    map(libraryId => new NavigateLibraryAction(libraryId))
  );

  @Effect({ dispatch: false })
  navigateLibrary$ = this.actions$.pipe(
    ofType<NavigateLibraryAction>(NAVIGATE_LIBRARY),
    map(action => {
      const libraryId = action.payload;
      if (libraryId) {
        this.contentApi
          .getNode(libraryId, { relativePath: '/documentLibrary' })
          .pipe(map(node => node.entry.id))
          .subscribe(
            id => {
              this.store.dispatch(new NavigateRouteAction(['libraries', id]));
            },
            () => {
              this.store.dispatch(
                new SnackbarErrorAction('APP.MESSAGES.ERRORS.MISSING_CONTENT')
              );
            }
          );
      }
    })
  );

  @Effect({ dispatch: false })
  updateLibrary$ = this.actions$.pipe(
    ofType<UpdateLibraryAction>(UPDATE_LIBRARY),
    map(action => {
      this.store
        .select(appSelection)
        .pipe(take(1))
        .subscribe(selection => {
          if (selection && selection.library) {
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
  );
}
