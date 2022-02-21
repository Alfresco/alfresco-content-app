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

import { Routes } from '@angular/router';
import { AppLayoutComponent } from './components/layout/app-layout/app-layout.component';
import { LoginComponent } from './components/login/login.component';
import { GenericErrorComponent, ExtensionsDataLoaderGuard } from '@alfresco/aca-shared';
import { AuthGuardEcm, BlankPageComponent } from '@alfresco/adf-core';

export const APP_ROUTES: Routes = [
  {
    path: 'blank',
    component: BlankPageComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'APP.SIGN_IN'
    }
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuardEcm, ExtensionsDataLoaderGuard],
    children: [
      {
        path: '**',
        component: GenericErrorComponent
      }
    ],
    canActivateChild: [AuthGuardEcm]
  }
];
