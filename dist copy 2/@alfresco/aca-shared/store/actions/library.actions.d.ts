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
export declare enum LibraryActionTypes {
  Delete = 'DELETE_LIBRARY',
  Create = 'CREATE_LIBRARY',
  Navigate = 'NAVIGATE_LIBRARY',
  Update = 'UPDATE_LIBRARY',
  Leave = 'LEAVE_LIBRARY'
}
export declare class DeleteLibraryAction implements Action {
  payload?: string;
  readonly type = LibraryActionTypes.Delete;
  constructor(payload?: string);
}
export declare class CreateLibraryAction implements Action {
  readonly type = LibraryActionTypes.Create;
}
export declare class NavigateLibraryAction implements Action {
  payload?: string;
  readonly type = LibraryActionTypes.Navigate;
  constructor(payload?: string);
}
export declare class UpdateLibraryAction implements Action {
  payload?: SiteBody;
  readonly type = LibraryActionTypes.Update;
  constructor(payload?: SiteBody);
}
export declare class LeaveLibraryAction implements Action {
  payload?: string;
  readonly type = LibraryActionTypes.Leave;
  constructor(payload?: string);
}
