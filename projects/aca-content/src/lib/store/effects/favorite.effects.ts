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

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject, Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { AddFavoriteAction, AppStore, getAppSelection, NodeActionTypes, RemoveFavoriteAction } from '@alfresco/aca-shared/store';
import { Store } from '@ngrx/store';
import { ContentManagementService } from '../../services/content-management.service';

@Injectable()
export class FavoriteEffects {
  private store = inject(Store<AppStore>);
  private actions$ = inject(Actions);
  private content = inject(ContentManagementService);

  addFavorite$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<AddFavoriteAction>(NodeActionTypes.AddFavorite),
        map((action) => {
          if (action.payload && action.payload.length > 0) {
            this.content.addFavorite(action.payload, action.configuration.focusedElementOnCloseSelector);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && !selection.isEmpty) {
                  this.content.addFavorite(selection.nodes, action.configuration.focusedElementOnCloseSelector);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );

  removeFavorite$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<RemoveFavoriteAction>(NodeActionTypes.RemoveFavorite),
        map((action) => {
          if (action.payload && action.payload.length > 0) {
            this.content.removeFavorite(action.payload, action.configuration.focusedElementOnCloseSelector);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (selection && !selection.isEmpty) {
                  this.content.removeFavorite(selection.nodes, action.configuration.focusedElementOnCloseSelector);
                }
              });
          }
        })
      ),
    { dispatch: false }
  );
}
