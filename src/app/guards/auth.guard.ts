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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthenticationService,
  AppConfigService,
  AuthGuardEcm
} from '@alfresco/adf-core';

@Injectable({
  providedIn: 'root'
})
export class AppAuthGuard extends AuthGuardEcm {
  constructor(
    private _auth: AuthenticationService,
    private _router: Router,
    private _config: AppConfigService
  ) {
    super(_auth, _router, _config);
  }

  checkLogin(redirectUrl: string): boolean {
    const withCredentials = this._config.get<boolean>(
      'auth.withCredentials',
      false
    );

    if (withCredentials || this._auth.isEcmLoggedIn()) {
      return true;
    }

    if (!this._auth.isOauth() || this.isOAuthWithoutSilentLogin()) {
      this._auth.setRedirect({ provider: 'ECM', url: redirectUrl });
      this._router.navigateByUrl('/login?redirectUrl=' + redirectUrl);
    }

    return false;
  }
}
