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
import { MinimalNodeEntity } from '@alfresco/js-api';

export enum ViewerActionTypes {
  ViewFile = 'VIEW_FILE',
  ViewNode = 'VIEW_NODE',
  FullScreen = 'FULLSCREEN_VIEWER'
}

export class ViewFileAction implements Action {
  readonly type = ViewerActionTypes.ViewFile;

  constructor(public payload: MinimalNodeEntity, public parentId?: string) {}
}

export class ViewNodeAction implements Action {
  readonly type = ViewerActionTypes.ViewNode;

  constructor(public nodeId: string, public location?: string) {}
}

export class FullscreenViewerAction implements Action {
  readonly type = ViewerActionTypes.FullScreen;

  constructor(public payload: MinimalNodeEntity) {}
}
