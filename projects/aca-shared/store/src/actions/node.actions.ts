/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { Action } from '@ngrx/store';
import { NodeEntry } from '@alfresco/js-api';
import { ModalConfiguration } from '../models/modal-configuration';

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
  FolderInformation = 'FOLDER_INFORMATION',
  ManagePermissions = 'MANAGE_PERMISSIONS',
  PrintFile = 'PRINT_FILE',
  ManageVersions = 'MANAGE_VERSIONS',
  EditOffline = 'EDIT_OFFLINE',
  UnlockForWriting = 'UNLOCK_WRITE_LOCK',
  AddFavorite = 'ADD_FAVORITE',
  RemoveFavorite = 'REMOVE_FAVORITE',
  ChangeAspects = 'ASPECT_LIST',
  ExpandInfoDrawer = 'EXPAND_INFO_DRAWER',
  ManageRules = 'MANAGE_RULES'
}

export class SetSelectedNodesAction implements Action {
  readonly type = NodeActionTypes.SetSelection;

  constructor(public payload: NodeEntry[] = []) {}
}

export class DeleteNodesAction implements Action {
  readonly type = NodeActionTypes.Delete;

  constructor(
    public payload: NodeEntry[] = [],
    public allowUndo = true,
    public configuration?: ModalConfiguration
  ) {}
}

export class UndoDeleteNodesAction implements Action {
  readonly type = NodeActionTypes.UndoDelete;

  constructor(public payload: any[] = []) {}
}

export class RestoreDeletedNodesAction implements Action {
  readonly type = NodeActionTypes.RestoreDeleted;

  constructor(
    public payload: Array<NodeEntry>,
    public configuration?: ModalConfiguration
  ) {}
}

export class PurgeDeletedNodesAction implements Action {
  readonly type = NodeActionTypes.PurgeDeleted;

  constructor(
    public payload: Array<NodeEntry>,
    public configuration?: ModalConfiguration
  ) {}
}

export class DownloadNodesAction implements Action {
  readonly type = NodeActionTypes.Download;

  constructor(
    public payload: NodeEntry[] = [],
    public configuration?: ModalConfiguration
  ) {}
}

export class CreateFolderAction implements Action {
  readonly type = NodeActionTypes.CreateFolder;

  constructor(public payload: string) {}
}

export class EditFolderAction implements Action {
  readonly type = NodeActionTypes.EditFolder;

  constructor(
    public payload: NodeEntry,
    public configuration?: ModalConfiguration
  ) {}
}

export class ShareNodeAction implements Action {
  readonly type = NodeActionTypes.Share;

  constructor(
    public payload: NodeEntry,
    public configuration?: ModalConfiguration
  ) {}
}

export class UnshareNodesAction implements Action {
  readonly type = NodeActionTypes.Unshare;

  constructor(public payload: Array<NodeEntry>) {}
}

export class CopyNodesAction implements Action {
  readonly type = NodeActionTypes.Copy;

  constructor(
    public payload: Array<NodeEntry>,
    public configuration?: ModalConfiguration
  ) {}
}

export class MoveNodesAction implements Action {
  readonly type = NodeActionTypes.Move;

  constructor(
    public payload: Array<NodeEntry>,
    public configuration?: ModalConfiguration
  ) {}
}

export class ManagePermissionsAction implements Action {
  readonly type = NodeActionTypes.ManagePermissions;

  constructor(public payload: NodeEntry) {}
}
export class ExpandInfoDrawerAction implements Action {
  readonly type = NodeActionTypes.ExpandInfoDrawer;

  constructor(public payload: NodeEntry) {}
}

export class PrintFileAction implements Action {
  readonly type = NodeActionTypes.PrintFile;

  constructor(public payload: NodeEntry) {}
}

export class ManageVersionsAction implements Action {
  readonly type = NodeActionTypes.ManageVersions;

  constructor(
    public payload: NodeEntry,
    public configuration?: ModalConfiguration
  ) {}
}

export class EditOfflineAction implements Action {
  readonly type = NodeActionTypes.EditOffline;

  constructor(public payload: NodeEntry) {}
}

export class UnlockWriteAction implements Action {
  readonly type = NodeActionTypes.UnlockForWriting;

  constructor(public payload: any) {}
}

export class AddFavoriteAction implements Action {
  readonly type = NodeActionTypes.AddFavorite;

  constructor(
    public payload: Array<NodeEntry>,
    public configuration?: ModalConfiguration
  ) {}
}

export class RemoveFavoriteAction implements Action {
  readonly type = NodeActionTypes.RemoveFavorite;

  constructor(
    public payload: Array<NodeEntry>,
    public configuration?: ModalConfiguration
  ) {}
}
export class ManageAspectsAction implements Action {
  readonly type = NodeActionTypes.ChangeAspects;

  constructor(
    public payload: NodeEntry,
    public configuration?: ModalConfiguration
  ) {}
}

export class ManageRulesAction implements Action {
  readonly type = NodeActionTypes.ManageRules;

  constructor(public payload: NodeEntry) {}
}

export class FolderInformationAction implements Action {
  readonly type = NodeActionTypes.FolderInformation;

  constructor(public payload: NodeEntry) {}
}
