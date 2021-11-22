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

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AppActionTypes, LogoutAction, ReloadDocumentListAction, ResetSelectionAction } from '@alfresco/aca-shared/store';
import { AuthenticationService } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { AppHookService } from '@alfresco/aca-shared';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private auth: AuthenticationService, private router: Router, private appHookService: AppHookService) {}

  @Effect({ dispatch: false })
  reload = this.actions$.pipe(
    ofType<ReloadDocumentListAction>(AppActionTypes.ReloadDocumentList),
    map((action) => {
      this.appHookService.reload.next(action);
    })
  );

  @Effect({ dispatch: false })
  resetSelection = this.actions$.pipe(
    ofType<ResetSelectionAction>(AppActionTypes.ResetSelection),
    map((action) => {
      this.appHookService.reset.next(action);
    })
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType<LogoutAction>(AppActionTypes.Logout),
    map(() => {
      this.auth.logout().subscribe(
        () => this.redirectToLogin(),
        () => this.redirectToLogin()
      );
    })
  );

  private redirectToLogin(): Promise<boolean> {
    return this.router.navigate(['login']);
  }
}
