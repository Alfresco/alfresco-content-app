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
import { map, take } from 'rxjs/operators';
import {
  AppStore,
  NodeActionTypes,
  AddFavoriteAction,
  RemoveFavoriteAction,
  getAppSelection
} from '@alfresco/aca-shared/store';
import { Store } from '@ngrx/store';
import { ContentManagementService } from '../../services/content-management.service';

@Injectable()
export class FavoriteEffects {
  constructor(
    private store: Store<AppStore>,
    private actions$: Actions,
    private content: ContentManagementService
  ) {}

  @Effect({ dispatch: false })
  addFavorite$ = this.actions$.pipe(
    ofType<AddFavoriteAction>(NodeActionTypes.AddFavorite),
    map(action => {
      if (action.payload && action.payload.length > 0) {
        this.content.addFavorite(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && !selection.isEmpty) {
              this.content.addFavorite(selection.nodes);
            }
          });
      }
    })
  );

  @Effect({ dispatch: false })
  removeFavorite$ = this.actions$.pipe(
    ofType<RemoveFavoriteAction>(NodeActionTypes.RemoveFavorite),
    map(action => {
      if (action.payload && action.payload.length > 0) {
        this.content.removeFavorite(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && !selection.isEmpty) {
              this.content.removeFavorite(selection.nodes);
            }
          });
      }
    })
  );
}
