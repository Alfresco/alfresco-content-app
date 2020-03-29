/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
/** @enum {string} */
var NodeActionTypes = {
  SetSelection: 'SET_SELECTED_NODES',
  Delete: 'DELETE_NODES',
  UndoDelete: 'UNDO_DELETE_NODES',
  RestoreDeleted: 'RESTORE_DELETED_NODES',
  PurgeDeleted: 'PURGE_DELETED_NODES',
  Download: 'DOWNLOAD_NODES',
  CreateFolder: 'CREATE_FOLDER',
  EditFolder: 'EDIT_FOLDER',
  Share: 'SHARE_NODE',
  Unshare: 'UNSHARE_NODES',
  Copy: 'COPY_NODES',
  Move: 'MOVE_NODES',
  ManagePermissions: 'MANAGE_PERMISSIONS',
  PrintFile: 'PRINT_FILE',
  ManageVersions: 'MANAGE_VERSIONS',
  EditOffline: 'EDIT_OFFLINE',
  UnlockForWriting: 'UNLOCK_WRITE_LOCK',
  AddFavorite: 'ADD_FAVORITE',
  RemoveFavorite: 'REMOVE_FAVORITE'
};
export { NodeActionTypes };
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
if (false) {
  /** @type {?} */
  SetSelectedNodesAction.prototype.type;
  /** @type {?} */
  SetSelectedNodesAction.prototype.payload;
}
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
if (false) {
  /** @type {?} */
  DeleteNodesAction.prototype.type;
  /** @type {?} */
  DeleteNodesAction.prototype.payload;
}
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
if (false) {
  /** @type {?} */
  UndoDeleteNodesAction.prototype.type;
  /** @type {?} */
  UndoDeleteNodesAction.prototype.payload;
}
var RestoreDeletedNodesAction = /** @class */ (function() {
  function RestoreDeletedNodesAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.RestoreDeleted;
  }
  return RestoreDeletedNodesAction;
})();
export { RestoreDeletedNodesAction };
if (false) {
  /** @type {?} */
  RestoreDeletedNodesAction.prototype.type;
  /** @type {?} */
  RestoreDeletedNodesAction.prototype.payload;
}
var PurgeDeletedNodesAction = /** @class */ (function() {
  function PurgeDeletedNodesAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.PurgeDeleted;
  }
  return PurgeDeletedNodesAction;
})();
export { PurgeDeletedNodesAction };
if (false) {
  /** @type {?} */
  PurgeDeletedNodesAction.prototype.type;
  /** @type {?} */
  PurgeDeletedNodesAction.prototype.payload;
}
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
if (false) {
  /** @type {?} */
  DownloadNodesAction.prototype.type;
  /** @type {?} */
  DownloadNodesAction.prototype.payload;
}
var CreateFolderAction = /** @class */ (function() {
  function CreateFolderAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.CreateFolder;
  }
  return CreateFolderAction;
})();
export { CreateFolderAction };
if (false) {
  /** @type {?} */
  CreateFolderAction.prototype.type;
  /** @type {?} */
  CreateFolderAction.prototype.payload;
}
var EditFolderAction = /** @class */ (function() {
  function EditFolderAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.EditFolder;
  }
  return EditFolderAction;
})();
export { EditFolderAction };
if (false) {
  /** @type {?} */
  EditFolderAction.prototype.type;
  /** @type {?} */
  EditFolderAction.prototype.payload;
}
var ShareNodeAction = /** @class */ (function() {
  function ShareNodeAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.Share;
  }
  return ShareNodeAction;
})();
export { ShareNodeAction };
if (false) {
  /** @type {?} */
  ShareNodeAction.prototype.type;
  /** @type {?} */
  ShareNodeAction.prototype.payload;
}
var UnshareNodesAction = /** @class */ (function() {
  function UnshareNodesAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.Unshare;
  }
  return UnshareNodesAction;
})();
export { UnshareNodesAction };
if (false) {
  /** @type {?} */
  UnshareNodesAction.prototype.type;
  /** @type {?} */
  UnshareNodesAction.prototype.payload;
}
var CopyNodesAction = /** @class */ (function() {
  function CopyNodesAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.Copy;
  }
  return CopyNodesAction;
})();
export { CopyNodesAction };
if (false) {
  /** @type {?} */
  CopyNodesAction.prototype.type;
  /** @type {?} */
  CopyNodesAction.prototype.payload;
}
var MoveNodesAction = /** @class */ (function() {
  function MoveNodesAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.Move;
  }
  return MoveNodesAction;
})();
export { MoveNodesAction };
if (false) {
  /** @type {?} */
  MoveNodesAction.prototype.type;
  /** @type {?} */
  MoveNodesAction.prototype.payload;
}
var ManagePermissionsAction = /** @class */ (function() {
  function ManagePermissionsAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.ManagePermissions;
  }
  return ManagePermissionsAction;
})();
export { ManagePermissionsAction };
if (false) {
  /** @type {?} */
  ManagePermissionsAction.prototype.type;
  /** @type {?} */
  ManagePermissionsAction.prototype.payload;
}
var PrintFileAction = /** @class */ (function() {
  function PrintFileAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.PrintFile;
  }
  return PrintFileAction;
})();
export { PrintFileAction };
if (false) {
  /** @type {?} */
  PrintFileAction.prototype.type;
  /** @type {?} */
  PrintFileAction.prototype.payload;
}
var ManageVersionsAction = /** @class */ (function() {
  function ManageVersionsAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.ManageVersions;
  }
  return ManageVersionsAction;
})();
export { ManageVersionsAction };
if (false) {
  /** @type {?} */
  ManageVersionsAction.prototype.type;
  /** @type {?} */
  ManageVersionsAction.prototype.payload;
}
var EditOfflineAction = /** @class */ (function() {
  function EditOfflineAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.EditOffline;
  }
  return EditOfflineAction;
})();
export { EditOfflineAction };
if (false) {
  /** @type {?} */
  EditOfflineAction.prototype.type;
  /** @type {?} */
  EditOfflineAction.prototype.payload;
}
var UnlockWriteAction = /** @class */ (function() {
  function UnlockWriteAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.UnlockForWriting;
  }
  return UnlockWriteAction;
})();
export { UnlockWriteAction };
if (false) {
  /** @type {?} */
  UnlockWriteAction.prototype.type;
  /** @type {?} */
  UnlockWriteAction.prototype.payload;
}
var AddFavoriteAction = /** @class */ (function() {
  function AddFavoriteAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.AddFavorite;
  }
  return AddFavoriteAction;
})();
export { AddFavoriteAction };
if (false) {
  /** @type {?} */
  AddFavoriteAction.prototype.type;
  /** @type {?} */
  AddFavoriteAction.prototype.payload;
}
var RemoveFavoriteAction = /** @class */ (function() {
  function RemoveFavoriteAction(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.RemoveFavorite;
  }
  return RemoveFavoriteAction;
})();
export { RemoveFavoriteAction };
if (false) {
  /** @type {?} */
  RemoveFavoriteAction.prototype.type;
  /** @type {?} */
  RemoveFavoriteAction.prototype.payload;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5hY3Rpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FjYS1zaGFyZWQvc3RvcmUvIiwic291cmNlcyI6WyJhY3Rpb25zL25vZGUuYWN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE2QkUsY0FBZSxvQkFBb0I7SUFDbkMsUUFBUyxjQUFjO0lBQ3ZCLFlBQWEsbUJBQW1CO0lBQ2hDLGdCQUFpQix1QkFBdUI7SUFDeEMsY0FBZSxxQkFBcUI7SUFDcEMsVUFBVyxnQkFBZ0I7SUFDM0IsY0FBZSxlQUFlO0lBQzlCLFlBQWEsYUFBYTtJQUMxQixPQUFRLFlBQVk7SUFDcEIsU0FBVSxlQUFlO0lBQ3pCLE1BQU8sWUFBWTtJQUNuQixNQUFPLFlBQVk7SUFDbkIsbUJBQW9CLG9CQUFvQjtJQUN4QyxXQUFZLFlBQVk7SUFDeEIsZ0JBQWlCLGlCQUFpQjtJQUNsQyxhQUFjLGNBQWM7SUFDNUIsa0JBQW1CLG1CQUFtQjtJQUN0QyxhQUFjLGNBQWM7SUFDNUIsZ0JBQWlCLGlCQUFpQjs7O0FBR3BDO0lBR0UsZ0NBQW1CLE9BQWlDO1FBQWpDLHdCQUFBLEVBQUEsWUFBaUM7UUFBakMsWUFBTyxHQUFQLE9BQU8sQ0FBMEI7UUFGM0MsU0FBSSxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUM7SUFFVSxDQUFDO0lBQzFELDZCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7Ozs7SUFIQyxzQ0FBNkM7O0lBRWpDLHlDQUF3Qzs7QUFHdEQ7SUFHRSwyQkFBbUIsT0FBaUM7UUFBakMsd0JBQUEsRUFBQSxZQUFpQztRQUFqQyxZQUFPLEdBQVAsT0FBTyxDQUEwQjtRQUYzQyxTQUFJLEdBQUcsZUFBZSxDQUFDLE1BQU0sQ0FBQztJQUVnQixDQUFDO0lBQzFELHdCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7Ozs7SUFIQyxpQ0FBdUM7O0lBRTNCLG9DQUF3Qzs7QUFHdEQ7SUFHRSwrQkFBbUIsT0FBbUI7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Q0FBK0M7O0lBRW5DLHVDQUF3QyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvblxuICpcbiAqIENvcHlyaWdodCAoQykgMjAwNSAtIDIwMjAgQWxmcmVzY28gU29mdHdhcmUgTGltaXRlZFxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24uXG4gKiBJZiB0aGUgc29mdHdhcmUgd2FzIHB1cmNoYXNlZCB1bmRlciBhIHBhaWQgQWxmcmVzY28gbGljZW5zZSwgdGhlIHRlcm1zIG9mXG4gKiB0aGUgcGFpZCBsaWNlbnNlIGFncmVlbWVudCB3aWxsIHByZXZhaWwuICBPdGhlcndpc2UsIHRoZSBzb2Z0d2FyZSBpc1xuICogcHJvdmlkZWQgdW5kZXIgdGhlIGZvbGxvd2luZyBvcGVuIHNvdXJjZSBsaWNlbnNlIHRlcm1zOlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEFsZnJlc2NvLiBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgTWluaW1hbE5vZGVFbnRpdHkgfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcblxuZXhwb3J0IGVudW0gTm9kZUFjdGlvblR5cGVzIHtcbiAgU2V0U2VsZWN0aW9uID0gJ1NFVF9TRUxFQ1RFRF9OT0RFUycsXG4gIERlbGV0ZSA9ICdERUxFVEVfTk9ERVMnLFxuICBVbmRvRGVsZXRlID0gJ1VORE9fREVMRVRFX05PREVTJyxcbiAgUmVzdG9yZURlbGV0ZWQgPSAnUkVTVE9SRV9ERUxFVEVEX05PREVTJyxcbiAgUHVyZ2VEZWxldGVkID0gJ1BVUkdFX0RFTEVURURfTk9ERVMnLFxuICBEb3dubG9hZCA9ICdET1dOTE9BRF9OT0RFUycsXG4gIENyZWF0ZUZvbGRlciA9ICdDUkVBVEVfRk9MREVSJyxcbiAgRWRpdEZvbGRlciA9ICdFRElUX0ZPTERFUicsXG4gIFNoYXJlID0gJ1NIQVJFX05PREUnLFxuICBVbnNoYXJlID0gJ1VOU0hBUkVfTk9ERVMnLFxuICBDb3B5ID0gJ0NPUFlfTk9ERVMnLFxuICBNb3ZlID0gJ01PVkVfTk9ERVMnLFxuICBNYW5hZ2VQZXJtaXNzaW9ucyA9ICdNQU5BR0VfUEVSTUlTU0lPTlMnLFxuICBQcmludEZpbGUgPSAnUFJJTlRfRklMRScsXG4gIE1hbmFnZVZlcnNpb25zID0gJ01BTkFHRV9WRVJTSU9OUycsXG4gIEVkaXRPZmZsaW5lID0gJ0VESVRfT0ZGTElORScsXG4gIFVubG9ja0ZvcldyaXRpbmcgPSAnVU5MT0NLX1dSSVRFX0xPQ0snLFxuICBBZGRGYXZvcml0ZSA9ICdBRERfRkFWT1JJVEUnLFxuICBSZW1vdmVGYXZvcml0ZSA9ICdSRU1PVkVfRkFWT1JJVEUnXG59XG5cbmV4cG9ydCBjbGFzcyBTZXRTZWxlY3RlZE5vZGVzQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5TZXRTZWxlY3Rpb247XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IE1pbmltYWxOb2RlRW50aXR5W10gPSBbXSkge31cbn1cblxuZXhwb3J0IGNsYXNzIERlbGV0ZU5vZGVzQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5EZWxldGU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IE1pbmltYWxOb2RlRW50aXR5W10gPSBbXSkge31cbn1cblxuZXhwb3J0IGNsYXNzIFVuZG9EZWxldGVOb2Rlc0FjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBOb2RlQWN0aW9uVHlwZXMuVW5kb0RlbGV0ZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogYW55W10gPSBbXSkge31cbn1cblxuZXhwb3J0IGNsYXNzIFJlc3RvcmVEZWxldGVkTm9kZXNBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTm9kZUFjdGlvblR5cGVzLlJlc3RvcmVEZWxldGVkO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBBcnJheTxNaW5pbWFsTm9kZUVudGl0eT4pIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBQdXJnZURlbGV0ZWROb2Rlc0FjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBOb2RlQWN0aW9uVHlwZXMuUHVyZ2VEZWxldGVkO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBBcnJheTxNaW5pbWFsTm9kZUVudGl0eT4pIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBEb3dubG9hZE5vZGVzQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5Eb3dubG9hZDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogTWluaW1hbE5vZGVFbnRpdHlbXSA9IFtdKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgQ3JlYXRlRm9sZGVyQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5DcmVhdGVGb2xkZXI7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IHN0cmluZykge31cbn1cblxuZXhwb3J0IGNsYXNzIEVkaXRGb2xkZXJBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTm9kZUFjdGlvblR5cGVzLkVkaXRGb2xkZXI7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IE1pbmltYWxOb2RlRW50aXR5KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgU2hhcmVOb2RlQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5TaGFyZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogTWluaW1hbE5vZGVFbnRpdHkpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBVbnNoYXJlTm9kZXNBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTm9kZUFjdGlvblR5cGVzLlVuc2hhcmU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IEFycmF5PE1pbmltYWxOb2RlRW50aXR5Pikge31cbn1cblxuZXhwb3J0IGNsYXNzIENvcHlOb2Rlc0FjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBOb2RlQWN0aW9uVHlwZXMuQ29weTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogQXJyYXk8TWluaW1hbE5vZGVFbnRpdHk+KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTW92ZU5vZGVzQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5Nb3ZlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBBcnJheTxNaW5pbWFsTm9kZUVudGl0eT4pIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBNYW5hZ2VQZXJtaXNzaW9uc0FjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBOb2RlQWN0aW9uVHlwZXMuTWFuYWdlUGVybWlzc2lvbnM7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IE1pbmltYWxOb2RlRW50aXR5KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgUHJpbnRGaWxlQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5QcmludEZpbGU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IE1pbmltYWxOb2RlRW50aXR5KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTWFuYWdlVmVyc2lvbnNBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTm9kZUFjdGlvblR5cGVzLk1hbmFnZVZlcnNpb25zO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBNaW5pbWFsTm9kZUVudGl0eSkge31cbn1cblxuZXhwb3J0IGNsYXNzIEVkaXRPZmZsaW5lQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5FZGl0T2ZmbGluZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogYW55KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgVW5sb2NrV3JpdGVBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTm9kZUFjdGlvblR5cGVzLlVubG9ja0ZvcldyaXRpbmc7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IGFueSkge31cbn1cblxuZXhwb3J0IGNsYXNzIEFkZEZhdm9yaXRlQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5BZGRGYXZvcml0ZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogQXJyYXk8TWluaW1hbE5vZGVFbnRpdHk+KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgUmVtb3ZlRmF2b3JpdGVBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTm9kZUFjdGlvblR5cGVzLlJlbW92ZUZhdm9yaXRlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBBcnJheTxNaW5pbWFsTm9kZUVudGl0eT4pIHt9XG59XG4iXX0=
