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
const NodeActionTypes = {
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
export class SetSelectedNodesAction {
  /**
   * @param {?=} payload
   */
  constructor(payload = []) {
    this.payload = payload;
    this.type = NodeActionTypes.SetSelection;
  }
}
if (false) {
  /** @type {?} */
  SetSelectedNodesAction.prototype.type;
  /** @type {?} */
  SetSelectedNodesAction.prototype.payload;
}
export class DeleteNodesAction {
  /**
   * @param {?=} payload
   */
  constructor(payload = []) {
    this.payload = payload;
    this.type = NodeActionTypes.Delete;
  }
}
if (false) {
  /** @type {?} */
  DeleteNodesAction.prototype.type;
  /** @type {?} */
  DeleteNodesAction.prototype.payload;
}
export class UndoDeleteNodesAction {
  /**
   * @param {?=} payload
   */
  constructor(payload = []) {
    this.payload = payload;
    this.type = NodeActionTypes.UndoDelete;
  }
}
if (false) {
  /** @type {?} */
  UndoDeleteNodesAction.prototype.type;
  /** @type {?} */
  UndoDeleteNodesAction.prototype.payload;
}
export class RestoreDeletedNodesAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.RestoreDeleted;
  }
}
if (false) {
  /** @type {?} */
  RestoreDeletedNodesAction.prototype.type;
  /** @type {?} */
  RestoreDeletedNodesAction.prototype.payload;
}
export class PurgeDeletedNodesAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.PurgeDeleted;
  }
}
if (false) {
  /** @type {?} */
  PurgeDeletedNodesAction.prototype.type;
  /** @type {?} */
  PurgeDeletedNodesAction.prototype.payload;
}
export class DownloadNodesAction {
  /**
   * @param {?=} payload
   */
  constructor(payload = []) {
    this.payload = payload;
    this.type = NodeActionTypes.Download;
  }
}
if (false) {
  /** @type {?} */
  DownloadNodesAction.prototype.type;
  /** @type {?} */
  DownloadNodesAction.prototype.payload;
}
export class CreateFolderAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.CreateFolder;
  }
}
if (false) {
  /** @type {?} */
  CreateFolderAction.prototype.type;
  /** @type {?} */
  CreateFolderAction.prototype.payload;
}
export class EditFolderAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.EditFolder;
  }
}
if (false) {
  /** @type {?} */
  EditFolderAction.prototype.type;
  /** @type {?} */
  EditFolderAction.prototype.payload;
}
export class ShareNodeAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.Share;
  }
}
if (false) {
  /** @type {?} */
  ShareNodeAction.prototype.type;
  /** @type {?} */
  ShareNodeAction.prototype.payload;
}
export class UnshareNodesAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.Unshare;
  }
}
if (false) {
  /** @type {?} */
  UnshareNodesAction.prototype.type;
  /** @type {?} */
  UnshareNodesAction.prototype.payload;
}
export class CopyNodesAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.Copy;
  }
}
if (false) {
  /** @type {?} */
  CopyNodesAction.prototype.type;
  /** @type {?} */
  CopyNodesAction.prototype.payload;
}
export class MoveNodesAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.Move;
  }
}
if (false) {
  /** @type {?} */
  MoveNodesAction.prototype.type;
  /** @type {?} */
  MoveNodesAction.prototype.payload;
}
export class ManagePermissionsAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.ManagePermissions;
  }
}
if (false) {
  /** @type {?} */
  ManagePermissionsAction.prototype.type;
  /** @type {?} */
  ManagePermissionsAction.prototype.payload;
}
export class PrintFileAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.PrintFile;
  }
}
if (false) {
  /** @type {?} */
  PrintFileAction.prototype.type;
  /** @type {?} */
  PrintFileAction.prototype.payload;
}
export class ManageVersionsAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.ManageVersions;
  }
}
if (false) {
  /** @type {?} */
  ManageVersionsAction.prototype.type;
  /** @type {?} */
  ManageVersionsAction.prototype.payload;
}
export class EditOfflineAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.EditOffline;
  }
}
if (false) {
  /** @type {?} */
  EditOfflineAction.prototype.type;
  /** @type {?} */
  EditOfflineAction.prototype.payload;
}
export class UnlockWriteAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.UnlockForWriting;
  }
}
if (false) {
  /** @type {?} */
  UnlockWriteAction.prototype.type;
  /** @type {?} */
  UnlockWriteAction.prototype.payload;
}
export class AddFavoriteAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.AddFavorite;
  }
}
if (false) {
  /** @type {?} */
  AddFavoriteAction.prototype.type;
  /** @type {?} */
  AddFavoriteAction.prototype.payload;
}
export class RemoveFavoriteAction {
  /**
   * @param {?} payload
   */
  constructor(payload) {
    this.payload = payload;
    this.type = NodeActionTypes.RemoveFavorite;
  }
}
if (false) {
  /** @type {?} */
  RemoveFavoriteAction.prototype.type;
  /** @type {?} */
  RemoveFavoriteAction.prototype.payload;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5hY3Rpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FjYS1zaGFyZWQvc3RvcmUvIiwic291cmNlcyI6WyJhY3Rpb25zL25vZGUuYWN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE2QkUsY0FBZSxvQkFBb0I7SUFDbkMsUUFBUyxjQUFjO0lBQ3ZCLFlBQWEsbUJBQW1CO0lBQ2hDLGdCQUFpQix1QkFBdUI7SUFDeEMsY0FBZSxxQkFBcUI7SUFDcEMsVUFBVyxnQkFBZ0I7SUFDM0IsY0FBZSxlQUFlO0lBQzlCLFlBQWEsYUFBYTtJQUMxQixPQUFRLFlBQVk7SUFDcEIsU0FBVSxlQUFlO0lBQ3pCLE1BQU8sWUFBWTtJQUNuQixNQUFPLFlBQVk7SUFDbkIsbUJBQW9CLG9CQUFvQjtJQUN4QyxXQUFZLFlBQVk7SUFDeEIsZ0JBQWlCLGlCQUFpQjtJQUNsQyxhQUFjLGNBQWM7SUFDNUIsa0JBQW1CLG1CQUFtQjtJQUN0QyxhQUFjLGNBQWM7SUFDNUIsZ0JBQWlCLGlCQUFpQjs7O0FBR3BDLE1BQU0sT0FBTyxzQkFBc0I7Ozs7SUFHakMsWUFBbUIsVUFBK0IsRUFBRTtRQUFqQyxZQUFPLEdBQVAsT0FBTyxDQUEwQjtRQUYzQyxTQUFJLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQztJQUVVLENBQUM7Q0FDekQ7OztJQUhDLHNDQUE2Qzs7SUFFakMseUNBQXdDOztBQUd0RCxNQUFNLE9BQU8saUJBQWlCOzs7O0lBRzVCLFlBQW1CLFVBQStCLEVBQUU7UUFBakMsWUFBTyxHQUFQLE9BQU8sQ0FBMEI7UUFGM0MsU0FBSSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUM7SUFFZ0IsQ0FBQztDQUN6RDs7O0lBSEMsaUNBQXVDOztJQUUzQixvQ0FBd0M7O0FBR3RELE1BQU0sT0FBTyxxQkFBcUI7Ozs7SUFHaEMsWUFBbUIsVUFBaUIsRUFBRTtRQUFuQixZQUFPLEdBQVAsT0FBTyxDQUFZ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QixZQUFPLEdBQVAsT0FBTyxDQUFtQjtRQUZwQyxTQUFJLEdBQUcsZUFBZSxDQUFDLGNBQWMsQ0FBQztJQUVDLENBQUM7Q0FDbEQ7OztJQUhDLG9DQUErQzs7SUFFbkMsdUNBQWlDOztBQUcvQyxNQUFNLE9BQU8saUJBQWlCOzs7O0lBRzVCLFlBQW1CLE9BQVk7UUFBWixZQUFPLEdBQVAsT0FBTyxDQUFLO1FBRnRCLFNBQUksR0FBRyxlQUFlLENBQUMsV0FBVyxDQUFDO0lBRVYsQ0FBQztDQUNwQzs7O0lBSEMsaUNBQTRDOztJQUVoQyxvQ0FBbUI7O0FBR2pDLE1BQU0sT0FBTyxpQkFBaUI7Ozs7SUFHNUIsWUFBbUIsT0FBWTtRQUFaLFlBQU8sR0FBUCxPQUFPLENBQUs7UUFGdEIsU0FBSSxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQztJQUVmLENBQUM7Q0FDcEM7OztJQUhDLGlDQUFpRDs7SUFFckMsb0NBQW1COztBQUdqQyxNQUFNLE9BQU8saUJBQWlCOzs7O0lBRzVCLFlBQW1CLE9BQWlDO1FBQWpDLFlBQU8sR0FBUCxPQUFPLENBQTBCO1FBRjNDLFNBQUksR0FBRyxlQUFlLENBQUMsV0FBVyxDQUFDO0lBRVcsQ0FBQztDQUN6RDs7O0lBSEMsaUNBQTRDOztJQUVoQyxvQ0FBd0M7O0FBR3RELE1BQU0sT0FBTyxvQkFBb0I7Ozs7SUFHL0IsWUFBbUIsT0FBaUM7UUFBakMsWUFBTyxHQUFQLE9BQU8sQ0FBMEI7UUFGM0MsU0FBSSxHQUFHLGVBQWUsQ0FBQyxjQUFjLENBQUM7SUFFUSxDQUFDO0NBQ3pEOzs7SUFIQyxvQ0FBK0M7O0lBRW5DLHVDQUF3QyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvblxuICpcbiAqIENvcHlyaWdodCAoQykgMjAwNSAtIDIwMjAgQWxmcmVzY28gU29mdHdhcmUgTGltaXRlZFxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24uXG4gKiBJZiB0aGUgc29mdHdhcmUgd2FzIHB1cmNoYXNlZCB1bmRlciBhIHBhaWQgQWxmcmVzY28gbGljZW5zZSwgdGhlIHRlcm1zIG9mXG4gKiB0aGUgcGFpZCBsaWNlbnNlIGFncmVlbWVudCB3aWxsIHByZXZhaWwuICBPdGhlcndpc2UsIHRoZSBzb2Z0d2FyZSBpc1xuICogcHJvdmlkZWQgdW5kZXIgdGhlIGZvbGxvd2luZyBvcGVuIHNvdXJjZSBsaWNlbnNlIHRlcm1zOlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEFsZnJlc2NvLiBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgTWluaW1hbE5vZGVFbnRpdHkgfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcblxuZXhwb3J0IGVudW0gTm9kZUFjdGlvblR5cGVzIHtcbiAgU2V0U2VsZWN0aW9uID0gJ1NFVF9TRUxFQ1RFRF9OT0RFUycsXG4gIERlbGV0ZSA9ICdERUxFVEVfTk9ERVMnLFxuICBVbmRvRGVsZXRlID0gJ1VORE9fREVMRVRFX05PREVTJyxcbiAgUmVzdG9yZURlbGV0ZWQgPSAnUkVTVE9SRV9ERUxFVEVEX05PREVTJyxcbiAgUHVyZ2VEZWxldGVkID0gJ1BVUkdFX0RFTEVURURfTk9ERVMnLFxuICBEb3dubG9hZCA9ICdET1dOTE9BRF9OT0RFUycsXG4gIENyZWF0ZUZvbGRlciA9ICdDUkVBVEVfRk9MREVSJyxcbiAgRWRpdEZvbGRlciA9ICdFRElUX0ZPTERFUicsXG4gIFNoYXJlID0gJ1NIQVJFX05PREUnLFxuICBVbnNoYXJlID0gJ1VOU0hBUkVfTk9ERVMnLFxuICBDb3B5ID0gJ0NPUFlfTk9ERVMnLFxuICBNb3ZlID0gJ01PVkVfTk9ERVMnLFxuICBNYW5hZ2VQZXJtaXNzaW9ucyA9ICdNQU5BR0VfUEVSTUlTU0lPTlMnLFxuICBQcmludEZpbGUgPSAnUFJJTlRfRklMRScsXG4gIE1hbmFnZVZlcnNpb25zID0gJ01BTkFHRV9WRVJTSU9OUycsXG4gIEVkaXRPZmZsaW5lID0gJ0VESVRfT0ZGTElORScsXG4gIFVubG9ja0ZvcldyaXRpbmcgPSAnVU5MT0NLX1dSSVRFX0xPQ0snLFxuICBBZGRGYXZvcml0ZSA9ICdBRERfRkFWT1JJVEUnLFxuICBSZW1vdmVGYXZvcml0ZSA9ICdSRU1PVkVfRkFWT1JJVEUnXG59XG5cbmV4cG9ydCBjbGFzcyBTZXRTZWxlY3RlZE5vZGVzQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5TZXRTZWxlY3Rpb247XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IE1pbmltYWxOb2RlRW50aXR5W10gPSBbXSkge31cbn1cblxuZXhwb3J0IGNsYXNzIERlbGV0ZU5vZGVzQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5EZWxldGU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IE1pbmltYWxOb2RlRW50aXR5W10gPSBbXSkge31cbn1cblxuZXhwb3J0IGNsYXNzIFVuZG9EZWxldGVOb2Rlc0FjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBOb2RlQWN0aW9uVHlwZXMuVW5kb0RlbGV0ZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogYW55W10gPSBbXSkge31cbn1cblxuZXhwb3J0IGNsYXNzIFJlc3RvcmVEZWxldGVkTm9kZXNBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTm9kZUFjdGlvblR5cGVzLlJlc3RvcmVEZWxldGVkO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBBcnJheTxNaW5pbWFsTm9kZUVudGl0eT4pIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBQdXJnZURlbGV0ZWROb2Rlc0FjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBOb2RlQWN0aW9uVHlwZXMuUHVyZ2VEZWxldGVkO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBBcnJheTxNaW5pbWFsTm9kZUVudGl0eT4pIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBEb3dubG9hZE5vZGVzQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5Eb3dubG9hZDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogTWluaW1hbE5vZGVFbnRpdHlbXSA9IFtdKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgQ3JlYXRlRm9sZGVyQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5DcmVhdGVGb2xkZXI7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IHN0cmluZykge31cbn1cblxuZXhwb3J0IGNsYXNzIEVkaXRGb2xkZXJBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTm9kZUFjdGlvblR5cGVzLkVkaXRGb2xkZXI7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IE1pbmltYWxOb2RlRW50aXR5KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgU2hhcmVOb2RlQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5TaGFyZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogTWluaW1hbE5vZGVFbnRpdHkpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBVbnNoYXJlTm9kZXNBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTm9kZUFjdGlvblR5cGVzLlVuc2hhcmU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IEFycmF5PE1pbmltYWxOb2RlRW50aXR5Pikge31cbn1cblxuZXhwb3J0IGNsYXNzIENvcHlOb2Rlc0FjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBOb2RlQWN0aW9uVHlwZXMuQ29weTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogQXJyYXk8TWluaW1hbE5vZGVFbnRpdHk+KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTW92ZU5vZGVzQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5Nb3ZlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBBcnJheTxNaW5pbWFsTm9kZUVudGl0eT4pIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBNYW5hZ2VQZXJtaXNzaW9uc0FjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG4gIHJlYWRvbmx5IHR5cGUgPSBOb2RlQWN0aW9uVHlwZXMuTWFuYWdlUGVybWlzc2lvbnM7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IE1pbmltYWxOb2RlRW50aXR5KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgUHJpbnRGaWxlQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5QcmludEZpbGU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IE1pbmltYWxOb2RlRW50aXR5KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTWFuYWdlVmVyc2lvbnNBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTm9kZUFjdGlvblR5cGVzLk1hbmFnZVZlcnNpb25zO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBNaW5pbWFsTm9kZUVudGl0eSkge31cbn1cblxuZXhwb3J0IGNsYXNzIEVkaXRPZmZsaW5lQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5FZGl0T2ZmbGluZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogYW55KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgVW5sb2NrV3JpdGVBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTm9kZUFjdGlvblR5cGVzLlVubG9ja0ZvcldyaXRpbmc7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBheWxvYWQ6IGFueSkge31cbn1cblxuZXhwb3J0IGNsYXNzIEFkZEZhdm9yaXRlQWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcbiAgcmVhZG9ubHkgdHlwZSA9IE5vZGVBY3Rpb25UeXBlcy5BZGRGYXZvcml0ZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGF5bG9hZDogQXJyYXk8TWluaW1hbE5vZGVFbnRpdHk+KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgUmVtb3ZlRmF2b3JpdGVBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuICByZWFkb25seSB0eXBlID0gTm9kZUFjdGlvblR5cGVzLlJlbW92ZUZhdm9yaXRlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYXlsb2FkOiBBcnJheTxNaW5pbWFsTm9kZUVudGl0eT4pIHt9XG59XG4iXX0=
