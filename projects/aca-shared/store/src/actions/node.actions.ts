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

export enum NodeActionTypes {
  SetSelection = 'SET_SELECTED_NODES',
  Delete = 'DELETE_NODES',
  UndoDelete = 'UNDO_DELETE_NODES',
  RestoreDeleted = 'RESTORE_DELETED_NODES',
  PurgeDeleted = 'PURGE_DELETED_NODES',
  Download = 'DOWNLOAD_NODES',
  CreateFolder = 'CREATE_FOLDER',
  EditFolder = 'EDIT_FOLDER',
  Share = 'SHARE_NODE',
  Unshare = 'UNSHARE_NODES',
  Copy = 'COPY_NODES',
  Move = 'MOVE_NODES',
  ManagePermissions = 'MANAGE_PERMISSIONS',
  PrintFile = 'PRINT_FILE',
  ManageVersions = 'MANAGE_VERSIONS',
  EditOffline = 'EDIT_OFFLINE',
  UnlockForWriting = 'UNLOCK_WRITE_LOCK',
  AddFavorite = 'ADD_FAVORITE',
  RemoveFavorite = 'REMOVE_FAVORITE',
  ChangeAspects = 'ASPECT_LIST',
  ExpandInfoDrawer = 'EXPAND_INFO_DRAWER'
}

export class SetSelectedNodesAction implements Action {
  readonly type = NodeActionTypes.SetSelection;

  constructor(public payload: MinimalNodeEntity[] = []) {}
}

export class DeleteNodesAction implements Action {
  readonly type = NodeActionTypes.Delete;

  constructor(public payload: MinimalNodeEntity[] = []) {}
}

export class UndoDeleteNodesAction implements Action {
  readonly type = NodeActionTypes.UndoDelete;

  constructor(public payload: any[] = []) {}
}

export class RestoreDeletedNodesAction implements Action {
  readonly type = NodeActionTypes.RestoreDeleted;

  constructor(public payload: Array<MinimalNodeEntity>) {}
}

export class PurgeDeletedNodesAction implements Action {
  readonly type = NodeActionTypes.PurgeDeleted;

  constructor(public payload: Array<MinimalNodeEntity>) {}
}

export class DownloadNodesAction implements Action {
  readonly type = NodeActionTypes.Download;

  constructor(public payload: MinimalNodeEntity[] = []) {}
}

export class CreateFolderAction implements Action {
  readonly type = NodeActionTypes.CreateFolder;

  constructor(public payload: string) {}
}

export class EditFolderAction implements Action {
  readonly type = NodeActionTypes.EditFolder;

  constructor(public payload: MinimalNodeEntity) {}
}

export class ShareNodeAction implements Action {
  readonly type = NodeActionTypes.Share;

  constructor(public payload: MinimalNodeEntity) {}
}

export class UnshareNodesAction implements Action {
  readonly type = NodeActionTypes.Unshare;

  constructor(public payload: Array<MinimalNodeEntity>) {}
}

export class CopyNodesAction implements Action {
  readonly type = NodeActionTypes.Copy;

  constructor(public payload: Array<MinimalNodeEntity>) {}
}

export class MoveNodesAction implements Action {
  readonly type = NodeActionTypes.Move;

  constructor(public payload: Array<MinimalNodeEntity>) {}
}

export class ManagePermissionsAction implements Action {
  readonly type = NodeActionTypes.ManagePermissions;

  constructor(public payload: MinimalNodeEntity) {}
}
export class ExpandInfoDrawerAction implements Action {
  readonly type = NodeActionTypes.ExpandInfoDrawer;

  constructor(public payload: MinimalNodeEntity) {}
}

export class PrintFileAction implements Action {
  readonly type = NodeActionTypes.PrintFile;

  constructor(public payload: MinimalNodeEntity) {}
}

export class ManageVersionsAction implements Action {
  readonly type = NodeActionTypes.ManageVersions;

  constructor(public payload: MinimalNodeEntity) {}
}

export class EditOfflineAction implements Action {
  readonly type = NodeActionTypes.EditOffline;

  constructor(public payload: any) {}
}

export class UnlockWriteAction implements Action {
  readonly type = NodeActionTypes.UnlockForWriting;

  constructor(public payload: any) {}
}

export class AddFavoriteAction implements Action {
  readonly type = NodeActionTypes.AddFavorite;

  constructor(public payload: Array<MinimalNodeEntity>) {}
}

export class RemoveFavoriteAction implements Action {
  readonly type = NodeActionTypes.RemoveFavorite;

  constructor(public payload: Array<MinimalNodeEntity>) {}
}
export class ManageAspectsAction implements Action {
  readonly type = NodeActionTypes.ChangeAspects;

  constructor(public payload: MinimalNodeEntity) {}
}
