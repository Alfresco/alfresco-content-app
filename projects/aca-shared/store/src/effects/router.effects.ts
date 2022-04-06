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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { MinimalNodeEntryEntity, PathInfoEntity } from '@alfresco/js-api';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppStore } from '../states/app.state';
import { Location } from '@angular/common';
import { NavigateUrlAction, NavigateRouteAction, NavigateToFolder, NavigateToParentFolder, NavigateToPreviousPage } from '../actions/router.actions';
import { SnackbarErrorAction } from '../actions/snackbar.actions';
import { RouterActionTypes } from '../actions/router-action-types';

@Injectable()
export class RouterEffects {
  constructor(private store: Store<AppStore>, private actions$: Actions, private router: Router, private location: Location) {}

  navigateUrl$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<NavigateUrlAction>(RouterActionTypes.NavigateUrl),
        map((action) => {
          if (action.payload) {
            this.router.navigateByUrl(action.payload);
          }
        })
      ),
    { dispatch: false }
  );

  navigateRoute$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<NavigateRouteAction>(RouterActionTypes.NavigateRoute),
        map((action) => {
          this.router.navigate(action.payload);
        })
      ),
    { dispatch: false }
  );

  navigateToFolder$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<NavigateToFolder>(RouterActionTypes.NavigateFolder),
        map((action) => {
          if (action.payload && action.payload.entry) {
            this.navigateToFolder(action.payload.entry);
          }
        })
      ),
    { dispatch: false }
  );

  navigateToParentFolder$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<NavigateToParentFolder>(RouterActionTypes.NavigateParentFolder),
        map((action) => {
          if (action.payload && action.payload.entry) {
            this.navigateToParentFolder(action.payload.entry);
          }
        })
      ),
    { dispatch: false }
  );

  navigateToPreviousPage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<NavigateToPreviousPage>(RouterActionTypes.NavigateToPreviousPage),
        map(() => this.location.back())
      ),
    { dispatch: false }
  );

  private navigateToFolder(node: MinimalNodeEntryEntity) {
    let link: any[] = null;
    const { path, id } = node;

    if (path && path.name && path.elements) {
      const isLibraryPath = this.isLibraryContent(path);

      const parent = path.elements[path.elements.length - 1];
      const area = isLibraryPath ? '/libraries' : '/personal-files';

      if (!isLibraryPath) {
        link = [area, id];
      } else {
        // parent.id could be 'Site' folder or child as 'documentLibrary'
        link = [area, parent.name === 'Sites' ? {} : id];
      }

      setTimeout(() => {
        this.router.navigate(link);
      }, 10);
    } else {
      this.router.navigate(['/personal-files', node.id]);
    }
  }

  private navigateToParentFolder(node: MinimalNodeEntryEntity) {
    let link: any[] = null;
    const { path } = node;

    if (path && path.name && path.elements) {
      const isLibraryPath = this.isLibraryContent(path);

      const parent = path.elements[path.elements.length - 1];
      const area = isLibraryPath ? '/libraries' : '/personal-files';

      if (!isLibraryPath) {
        link = [area, parent.id];
      } else {
        // parent.id could be 'Site' folder or child as 'documentLibrary'
        link = [area, parent.name === 'Sites' ? {} : parent.id];
      }

      setTimeout(() => {
        this.router.navigate(link);
      }, 10);
    } else {
      this.store.dispatch(new SnackbarErrorAction('APP.MESSAGES.ERRORS.CANNOT_NAVIGATE_LOCATION'));
    }
  }

  private isLibraryContent(path: PathInfoEntity): boolean {
    return path && path.elements.length >= 2 && path.elements[1].name === 'Sites';
  }
}
