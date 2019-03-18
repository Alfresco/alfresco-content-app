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

export const SET_SELECTED_NODES = 'SET_SELECTED_NODES';
export const DELETE_NODES = 'DELETE_NODES';
export const UNDO_DELETE_NODES = 'UNDO_DELETE_NODES';
export const RESTORE_DELETED_NODES = 'RESTORE_DELETED_NODES';
export const PURGE_DELETED_NODES = 'PURGE_DELETED_NODES';
export const DOWNLOAD_NODES = 'DOWNLOAD_NODES';
export const CREATE_FOLDER = 'CREATE_FOLDER';
export const EDIT_FOLDER = 'EDIT_FOLDER';
export const SHARE_NODE = 'SHARE_NODE';
export const UNSHARE_NODES = 'UNSHARE_NODES';
export const COPY_NODES = 'COPY_NODES';
export const MOVE_NODES = 'MOVE_NODES';
export const MANAGE_PERMISSIONS = 'MANAGE_PERMISSIONS';
export const PRINT_FILE = 'PRINT_FILE';
export const FULLSCREEN_VIEWER = 'FULLSCREEN_VIEWER';
export const MANAGE_VERSIONS = 'MANAGE_VERSIONS';
export const EDIT_OFFLINE = 'EDIT_OFFLINE';
export const UNLOCK_WRITE = 'UNLOCK_WRITE_LOCK';

export class SetSelectedNodesAction implements Action {
  readonly type = SET_SELECTED_NODES;
  constructor(public payload: MinimalNodeEntity[] = []) {}
}

export class DeleteNodesAction implements Action {
  readonly type = DELETE_NODES;
  constructor(public payload: MinimalNodeEntity[] = []) {}
}

export class UndoDeleteNodesAction implements Action {
  readonly type = UNDO_DELETE_NODES;
  constructor(public payload: any[] = []) {}
}

export class RestoreDeletedNodesAction implements Action {
  readonly type = RESTORE_DELETED_NODES;
  constructor(public payload: Array<MinimalNodeEntity>) {}
}

export class PurgeDeletedNodesAction implements Action {
  readonly type = PURGE_DELETED_NODES;
  constructor(public payload: Array<MinimalNodeEntity>) {}
}

export class DownloadNodesAction implements Action {
  readonly type = DOWNLOAD_NODES;
  constructor(public payload: MinimalNodeEntity[] = []) {}
}

export class CreateFolderAction implements Action {
  readonly type = CREATE_FOLDER;
  constructor(public payload: string) {}
}

export class EditFolderAction implements Action {
  readonly type = EDIT_FOLDER;
  constructor(public payload: MinimalNodeEntity) {}
}

export class ShareNodeAction implements Action {
  readonly type = SHARE_NODE;
  constructor(public payload: MinimalNodeEntity) {}
}

export class UnshareNodesAction implements Action {
  readonly type = UNSHARE_NODES;
  constructor(public payload: Array<MinimalNodeEntity>) {}
}

export class CopyNodesAction implements Action {
  readonly type = COPY_NODES;
  constructor(public payload: Array<MinimalNodeEntity>) {}
}

export class MoveNodesAction implements Action {
  readonly type = MOVE_NODES;
  constructor(public payload: Array<MinimalNodeEntity>) {}
}

export class ManagePermissionsAction implements Action {
  readonly type = MANAGE_PERMISSIONS;
  constructor(public payload: MinimalNodeEntity) {}
}

export class PrintFileAction implements Action {
  readonly type = PRINT_FILE;
  constructor(public payload: MinimalNodeEntity) {}
}

export class FullscreenViewerAction implements Action {
  readonly type = FULLSCREEN_VIEWER;
  constructor(public payload: MinimalNodeEntity) {}
}

export class ManageVersionsAction implements Action {
  readonly type = MANAGE_VERSIONS;
  constructor(public payload: MinimalNodeEntity) {}
}

export class EditOfflineAction implements Action {
  readonly type = EDIT_OFFLINE;
  constructor(public payload: any) {}
}

export class UnlockWriteAction implements Action {
  readonly type = UNLOCK_WRITE;
  constructor(public payload: any) {}
}
