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
export declare enum NodeActionTypes {
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
  RemoveFavorite = 'REMOVE_FAVORITE'
}
export declare class SetSelectedNodesAction implements Action {
  payload: MinimalNodeEntity[];
  readonly type = NodeActionTypes.SetSelection;
  constructor(payload?: MinimalNodeEntity[]);
}
export declare class DeleteNodesAction implements Action {
  payload: MinimalNodeEntity[];
  readonly type = NodeActionTypes.Delete;
  constructor(payload?: MinimalNodeEntity[]);
}
export declare class UndoDeleteNodesAction implements Action {
  payload: any[];
  readonly type = NodeActionTypes.UndoDelete;
  constructor(payload?: any[]);
}
export declare class RestoreDeletedNodesAction implements Action {
  payload: Array<MinimalNodeEntity>;
  readonly type = NodeActionTypes.RestoreDeleted;
  constructor(payload: Array<MinimalNodeEntity>);
}
export declare class PurgeDeletedNodesAction implements Action {
  payload: Array<MinimalNodeEntity>;
  readonly type = NodeActionTypes.PurgeDeleted;
  constructor(payload: Array<MinimalNodeEntity>);
}
export declare class DownloadNodesAction implements Action {
  payload: MinimalNodeEntity[];
  readonly type = NodeActionTypes.Download;
  constructor(payload?: MinimalNodeEntity[]);
}
export declare class CreateFolderAction implements Action {
  payload: string;
  readonly type = NodeActionTypes.CreateFolder;
  constructor(payload: string);
}
export declare class EditFolderAction implements Action {
  payload: MinimalNodeEntity;
  readonly type = NodeActionTypes.EditFolder;
  constructor(payload: MinimalNodeEntity);
}
export declare class ShareNodeAction implements Action {
  payload: MinimalNodeEntity;
  readonly type = NodeActionTypes.Share;
  constructor(payload: MinimalNodeEntity);
}
export declare class UnshareNodesAction implements Action {
  payload: Array<MinimalNodeEntity>;
  readonly type = NodeActionTypes.Unshare;
  constructor(payload: Array<MinimalNodeEntity>);
}
export declare class CopyNodesAction implements Action {
  payload: Array<MinimalNodeEntity>;
  readonly type = NodeActionTypes.Copy;
  constructor(payload: Array<MinimalNodeEntity>);
}
export declare class MoveNodesAction implements Action {
  payload: Array<MinimalNodeEntity>;
  readonly type = NodeActionTypes.Move;
  constructor(payload: Array<MinimalNodeEntity>);
}
export declare class ManagePermissionsAction implements Action {
  payload: MinimalNodeEntity;
  readonly type = NodeActionTypes.ManagePermissions;
  constructor(payload: MinimalNodeEntity);
}
export declare class PrintFileAction implements Action {
  payload: MinimalNodeEntity;
  readonly type = NodeActionTypes.PrintFile;
  constructor(payload: MinimalNodeEntity);
}
export declare class ManageVersionsAction implements Action {
  payload: MinimalNodeEntity;
  readonly type = NodeActionTypes.ManageVersions;
  constructor(payload: MinimalNodeEntity);
}
export declare class EditOfflineAction implements Action {
  payload: any;
  readonly type = NodeActionTypes.EditOffline;
  constructor(payload: any);
}
export declare class UnlockWriteAction implements Action {
  payload: any;
  readonly type = NodeActionTypes.UnlockForWriting;
  constructor(payload: any);
}
export declare class AddFavoriteAction implements Action {
  payload: Array<MinimalNodeEntity>;
  readonly type = NodeActionTypes.AddFavorite;
  constructor(payload: Array<MinimalNodeEntity>);
}
export declare class RemoveFavoriteAction implements Action {
  payload: Array<MinimalNodeEntity>;
  readonly type = NodeActionTypes.RemoveFavorite;
  constructor(payload: Array<MinimalNodeEntity>);
}
