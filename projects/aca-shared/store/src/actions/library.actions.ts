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

import { Action } from '@ngrx/store';
import { SiteBody } from '@alfresco/js-api';

export enum LibraryActionTypes {
  Delete = 'DELETE_LIBRARY',
  Create = 'CREATE_LIBRARY',
  Navigate = 'NAVIGATE_LIBRARY',
  Update = 'UPDATE_LIBRARY',
  Leave = 'LEAVE_LIBRARY'
}

export class DeleteLibraryAction implements Action {
  readonly type = LibraryActionTypes.Delete;

  constructor(public payload?: string) {}
}

export class CreateLibraryAction implements Action {
  readonly type = LibraryActionTypes.Create;
}

export class NavigateLibraryAction implements Action {
  readonly type = LibraryActionTypes.Navigate;

  constructor(public payload?: string, public route?: string) {}
}

export class UpdateLibraryAction implements Action {
  readonly type = LibraryActionTypes.Update;

  constructor(public payload?: SiteBody) {}
}

export class LeaveLibraryAction implements Action {
  readonly type = LibraryActionTypes.Leave;

  constructor(public payload?: string) {}
}
