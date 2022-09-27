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

import { Injectable, InjectionToken } from '@angular/core';
import { CanActivate, CanActivateChild, Route, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ExtensionsDataLoaderGuard } from '../../../../projects/aca-shared/src/public-api';
import { ShellLayoutComponent } from './components/shell/shell.component';

export const SHELL_AUTH_TOKEN = new InjectionToken<CanActivate & CanActivateChild>('SHELL_AUTH_TOKEN');
export const SHELL_MAIN_ROUTE = new InjectionToken<Route>('SHELL_MAIN_ROUTE');

@Injectable({
  providedIn: 'root'
})
export class ShellDummyGuard implements CanActivate, CanActivateChild {
  /*
    Required due to plugin system since without it
    we are going to get real guard which could prevent us from accessing e.g. login page
  */
  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    return true;
  }

  canActivateChild(_childRoute: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    return true;
  }
}

export const SHELL_LAYOUT_ROUTE: Route = {
  path: '',
  component: ShellLayoutComponent,
  canActivate: [SHELL_AUTH_TOKEN, ExtensionsDataLoaderGuard],
  children: []
};
