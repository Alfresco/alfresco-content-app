/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { InjectionToken } from '@angular/core';
import { CanActivate, CanActivateChild, Route } from '@angular/router';
import { ExtensionsDataLoaderGuard } from '../../../../projects/aca-shared/src/public-api';
import { ShellLayoutComponent } from './components/shell/shell.component';

export const SHELL_AUTH_TOKEN = new InjectionToken<CanActivate & CanActivateChild>('SHELL_AUTH_TOKEN');

export const SHELL_LAYOUT_ROUTE: Route = {
  path: '',
  component: ShellLayoutComponent,
  canActivate: [SHELL_AUTH_TOKEN, ExtensionsDataLoaderGuard],
  children: []
};
