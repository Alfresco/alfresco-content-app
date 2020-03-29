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
export var NodeActionTypes;
(function(NodeActionTypes) {
  NodeActionTypes['SetSelection'] = 'SET_SELECTED_NODES';
  NodeActionTypes['Delete'] = 'DELETE_NODES';
  NodeActionTypes['UndoDelete'] = 'UNDO_DELETE_NODES';
  NodeActionTypes['RestoreDeleted'] = 'RESTORE_DELETED_NODES';
  NodeActionTypes['PurgeDeleted'] = 'PURGE_DELETED_NODES';
  NodeActionTypes['Download'] = 'DOWNLOAD_NODES';
  NodeActionTypes['CreateFolder'] = 'CREATE_FOLDER';
  NodeActionTypes['EditFolder'] = 'EDIT_FOLDER';
  NodeActionTypes['Share'] = 'SHARE_NODE';
  NodeActionTypes['Unshare'] = 'UNSHARE_NODES';
  NodeActionTypes['Copy'] = 'COPY_NODES';
  NodeActionTypes['Move'] = 'MOVE_NODES';
  NodeActionTypes['ManagePermissions'] = 'MANAGE_PERMISSIONS';
  NodeActionTypes['PrintFile'] = 'PRINT_FILE';
  NodeActionTypes['ManageVersions'] = 'MANAGE_VERSIONS';
  NodeActionTypes['EditOffline'] = 'EDIT_OFFLINE';
  NodeActionTypes['UnlockForWriting'] = 'UNLOCK_WRITE_LOCK';
  NodeActionTypes['AddFavorite'] = 'ADD_FAVORITE';
  NodeActionTypes['RemoveFavorite'] = 'REMOVE_FAVORITE';
})(NodeActionTypes || (NodeActionTypes = {}));
var SetSelectedNodesAction = /** @class */ (function() {
  function SetSelectedNodesAction(payload) {
    if (payload === void 0) {
      payload = [];
    }
    this.payload = payload;
    this.type = NodeActionTypes.SetSelection;
  }
  return SetSelectedNodesAction;
})();
export { SetSelectedNodesAction };
var DeleteNodesAction = /** @class */ (function() {
  function DeleteNodesAction(payload) {
    if (payload === void 0) {
      payload = [];
    }
    this.payload = payload;
    this.type = NodeActionTypes.Delete;
  }
  return DeleteNodesAction;
})();
export { DeleteNodesAction };
var UndoDeleteNodesAction = /** @class */ (function() {
  function UndoDeleteNodesAction(payload) {
    if (payload === void 0) {
      payload = [];
    }
    this.payload = payload;
    this.type = NodeActionTypes.UndoDelete;
  }
  return UndoDeleteNodesAction;
})();
export { UndoDeleteNodesAction };
var RestoreDeletedNodesAction = /** @class */ (function() {
  function RestoreDeletedNodesAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.RestoreDeleted;
  }
  return RestoreDeletedNodesAction;
})();
export { RestoreDeletedNodesAction };
var PurgeDeletedNodesAction = /** @class */ (function() {
  function PurgeDeletedNodesAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.PurgeDeleted;
  }
  return PurgeDeletedNodesAction;
})();
export { PurgeDeletedNodesAction };
var DownloadNodesAction = /** @class */ (function() {
  function DownloadNodesAction(payload) {
    if (payload === void 0) {
      payload = [];
    }
    this.payload = payload;
    this.type = NodeActionTypes.Download;
  }
  return DownloadNodesAction;
})();
export { DownloadNodesAction };
var CreateFolderAction = /** @class */ (function() {
  function CreateFolderAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.CreateFolder;
  }
  return CreateFolderAction;
})();
export { CreateFolderAction };
var EditFolderAction = /** @class */ (function() {
  function EditFolderAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.EditFolder;
  }
  return EditFolderAction;
})();
export { EditFolderAction };
var ShareNodeAction = /** @class */ (function() {
  function ShareNodeAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.Share;
  }
  return ShareNodeAction;
})();
export { ShareNodeAction };
var UnshareNodesAction = /** @class */ (function() {
  function UnshareNodesAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.Unshare;
  }
  return UnshareNodesAction;
})();
export { UnshareNodesAction };
var CopyNodesAction = /** @class */ (function() {
  function CopyNodesAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.Copy;
  }
  return CopyNodesAction;
})();
export { CopyNodesAction };
var MoveNodesAction = /** @class */ (function() {
  function MoveNodesAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.Move;
  }
  return MoveNodesAction;
})();
export { MoveNodesAction };
var ManagePermissionsAction = /** @class */ (function() {
  function ManagePermissionsAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.ManagePermissions;
  }
  return ManagePermissionsAction;
})();
export { ManagePermissionsAction };
var PrintFileAction = /** @class */ (function() {
  function PrintFileAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.PrintFile;
  }
  return PrintFileAction;
})();
export { PrintFileAction };
var ManageVersionsAction = /** @class */ (function() {
  function ManageVersionsAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.ManageVersions;
  }
  return ManageVersionsAction;
})();
export { ManageVersionsAction };
var EditOfflineAction = /** @class */ (function() {
  function EditOfflineAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.EditOffline;
  }
  return EditOfflineAction;
})();
export { EditOfflineAction };
var UnlockWriteAction = /** @class */ (function() {
  function UnlockWriteAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.UnlockForWriting;
  }
  return UnlockWriteAction;
})();
export { UnlockWriteAction };
var AddFavoriteAction = /** @class */ (function() {
  function AddFavoriteAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.AddFavorite;
  }
  return AddFavoriteAction;
})();
export { AddFavoriteAction };
var RemoveFavoriteAction = /** @class */ (function() {
  function RemoveFavoriteAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.RemoveFavorite;
  }
  return RemoveFavoriteAction;
})();
export { RemoveFavoriteAction };
//# sourceMappingURL=node.actions.js.map
