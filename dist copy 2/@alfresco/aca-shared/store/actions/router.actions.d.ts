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
import { MinimalNodeEntity } from '@alfresco/js-api';
export declare enum RouterActionTypes {
  NavigateUrl = 'NAVIGATE_URL',
  NavigateRoute = 'NAVIGATE_ROUTE',
  NavigateFolder = 'NAVIGATE_FOLDER',
  NavigateParentFolder = 'NAVIGATE_PARENT_FOLDER'
}
export declare class NavigateUrlAction implements Action {
  payload: string;
  readonly type = RouterActionTypes.NavigateUrl;
  constructor(payload: string);
}
export declare class NavigateRouteAction implements Action {
  payload: any[];
  readonly type = RouterActionTypes.NavigateRoute;
  constructor(payload: any[]);
}
export declare class NavigateToFolder implements Action {
  payload: MinimalNodeEntity;
  readonly type = RouterActionTypes.NavigateFolder;
  constructor(payload: MinimalNodeEntity);
}
export declare class NavigateToParentFolder implements Action {
  payload: MinimalNodeEntity;
  readonly type = RouterActionTypes.NavigateParentFolder;
  constructor(payload: MinimalNodeEntity);
}
