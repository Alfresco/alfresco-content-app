/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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
import { DiscoveryEntry } from 'alfresco-js-api';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  GET_REPOSITORY_STATUS,
  GetRepositoryStatusAction
} from '../actions/repository.actions';
import { Router } from '@angular/router';
import { ContentApiService } from '../../services/content-api.service';
import { SetRepositoryStatusAction } from '../actions';

@Injectable()
export class RepositoryEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private contentApi: ContentApiService
  ) {}

  @Effect()
  getRepositoryStatus$ = this.actions$.pipe(
    ofType<GetRepositoryStatusAction>(GET_REPOSITORY_STATUS),
    switchMap(() => {
      return this.contentApi.getRepositoryInformation().pipe(
        map(
          (response: DiscoveryEntry) =>
            new SetRepositoryStatusAction(response.entry.repository.status)
        ),
        catchError(error => {
          this.redirectToLogin();
          return of(error);
        })
      );
    })
  );

  private redirectToLogin() {
    this.router.navigate(['login']);
  }
}
