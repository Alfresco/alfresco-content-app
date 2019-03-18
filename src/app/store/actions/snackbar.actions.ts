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

import { Action } from '@ngrx/store';

export const SNACKBAR_INFO = 'SNACKBAR_INFO';
export const SNACKBAR_WARNING = 'SNACKBAR_WARNING';
export const SNACKBAR_ERROR = 'SNACKBAR_ERROR';

export interface SnackbarAction extends Action {
  payload: string;
  params?: Object;
  userAction?: SnackbarUserAction;
  duration: number;
}

export class SnackbarUserAction {
  constructor(public title: string, public action: Action) {}
}

export class SnackbarInfoAction implements SnackbarAction {
  readonly type = SNACKBAR_INFO;

  userAction?: SnackbarUserAction;
  duration = 4000;

  constructor(public payload: string, public params?: Object) {}
}

export class SnackbarWarningAction implements SnackbarAction {
  readonly type = SNACKBAR_WARNING;

  userAction?: SnackbarUserAction;
  duration = 4000;

  constructor(public payload: string, public params?: Object) {}
}

export class SnackbarErrorAction implements SnackbarAction {
  readonly type = SNACKBAR_ERROR;

  userAction?: SnackbarUserAction;
  duration = 4000;

  constructor(public payload: string, public params?: Object) {}
}
