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
import { RuleContext } from '@alfresco/adf-extensions';
export interface AcaRuleContext extends RuleContext {
  languagePicker: boolean;
  withCredentials: boolean;
  processServices: boolean;
}
/**
 * Checks if user can copy selected node.
 * JSON ref: `app.canCopyNode`
 * @param context Rule execution context
 */
export declare function canCopyNode(context: RuleContext): boolean;
/**
 * Checks if user can mark selected nodes as **Favorite**.
 * JSON ref: `app.selection.canAddFavorite`
 */
export declare function canAddFavorite(context: RuleContext): boolean;
/**
 * Checks if user can un-mark selected nodes as **Favorite**.
 * JSON ref: `app.selection.canRemoveFavorite`
 */
export declare function canRemoveFavorite(context: RuleContext): boolean;
/**
 * Checks if user can share selected file.
 * JSON ref: `app.selection.file.canShare`
 */
export declare function canShareFile(context: RuleContext): boolean;
/**
 * Checks if user can perform "Join" or "Cancel Join Request" on a library.
 * JSON ref: `canToggleJoinLibrary`
 */
export declare function canToggleJoinLibrary(context: RuleContext): boolean;
/**
 * Checks if user can edit the selected folder.
 * JSON ref: `canEditFolder`
 * @param context Rule execution context
 */
export declare function canEditFolder(context: RuleContext): boolean;
/**
 * Checks if the selected file is already shared.
 * JSON ref: `app.selection.file.isShared`
 */
export declare function isShared(context: RuleContext): boolean;
/**
 * Checks if user can delete selected nodes.
 * JSON ref: `app.selection.canDelete`
 */
export declare function canDeleteSelection(context: RuleContext): boolean;
/**
 * Checks if user can un-share selected nodes.
 * JSON ref: `app.selection.canUnshare`
 */
export declare function canUnshareNodes(context: RuleContext): boolean;
/**
 * Checks if user selected anything.
 * JSON ref: `app.selection.notEmpty`
 */
export declare function hasSelection(context: RuleContext): boolean;
/**
 * Checks if user can create a new folder with current path.
 * JSON ref: `app.navigation.folder.canCreate`
 */
export declare function canCreateFolder(context: RuleContext): boolean;
/**
 * Checks if user can upload content to current folder.
 * JSON ref: `app.navigation.folder.canUpload`
 */
export declare function canUpload(context: RuleContext): boolean;
/**
 * Checks if user can download selected nodes (either files or folders).
 * JSON ref: `app.selection.canDownload`
 */
export declare function canDownloadSelection(context: RuleContext): boolean;
/**
 * Checks if user has selected a folder.
 * JSON ref: `app.selection.folder`
 */
export declare function hasFolderSelected(context: RuleContext): boolean;
/**
 * Checks if user has selected a library (site).
 * JSON ref: `app.selection.library`
 */
export declare function hasLibrarySelected(context: RuleContext): boolean;
/**
 * Checks if user has selected a **private** library (site)
 * JSON ref: `app.selection.isPrivateLibrary`
 */
export declare function isPrivateLibrary(context: RuleContext): boolean;
/**
 * Checks if the selected library has a **role** property defined.
 * JSON ref: `app.selection.hasLibraryRole`
 */
export declare function hasLibraryRole(context: RuleContext): boolean;
/**
 * Checks if the selected library has no **role** property defined.
 * JSON ref: `app.selection.hasNoLibraryRole`
 */
export declare function hasNoLibraryRole(context: RuleContext): boolean;
/**
 * Checks if user has selected a file.
 * JSON ref: `app.selection.file`
 */
export declare function hasFileSelected(context: RuleContext): boolean;
/**
 * Checks if user can update the first selected node.
 * JSON ref: `app.selection.first.canUpdate`
 */
export declare function canUpdateSelectedNode(context: RuleContext): boolean;
/**
 * Checks if user can update the first selected folder.
 * JSON ref: `app.selection.folder.canUpdate`
 */
export declare function canUpdateSelectedFolder(context: RuleContext): boolean;
/**
 * Checks if user has selected a **locked** file node.
 * JSON ref: `app.selection.file.isLocked`
 */
export declare function hasLockedFiles(context: RuleContext): boolean;
/**
 * Checks if the selected file has **write** or **read-only** locks specified.
 * JSON ref: `app.selection.file.isLocked`
 */
export declare function isWriteLocked(context: RuleContext): boolean;
/**
 * Checks if the selected file has **write** or **read-only** locks specified,
 * and that current user is the owner of the lock.
 * JSON ref: `app.selection.file.isLockOwner`
 */
export declare function isUserWriteLockOwner(context: RuleContext): boolean;
/**
 * Checks if user can lock selected file.
 * JSON ref: `app.selection.file.canLock`
 */
export declare function canLockFile(context: RuleContext): boolean;
/**
 * Checks if user can unlock selected file.
 * JSON ref: `app.selection.file.canUnlock`
 */
export declare function canUnlockFile(context: RuleContext): boolean;
/**
 * Checks if user can upload a new version of the file.
 * JSON ref: `app.selection.file.canUploadVersion`
 */
export declare function canUploadVersion(context: RuleContext): boolean;
/**
 * Checks if user has trashcan item selected.
 * JSON ref: `isTrashcanItemSelected`
 * @param context Rule execution context
 */
export declare function isTrashcanItemSelected(context: RuleContext): boolean;
/**
 * Checks if user can view the file.
 * JSON ref: `canViewFile`
 * @param context Rule execution context
 */
export declare function canViewFile(context: RuleContext): boolean;
/**
 * Checks if user can **Leave** selected library.
 * JSON ref: `canLeaveLibrary`
 * @param context Rule execution context
 */
export declare function canLeaveLibrary(context: RuleContext): boolean;
/**
 * Checks if user can toggle shared link mode.
 * JSON ref: `canToggleSharedLink`
 * @param context Rule execution context
 */
export declare function canToggleSharedLink(context: RuleContext): boolean;
/**
 * Checks if user can show **Info Drawer** for the selected node.
 * JSON ref: `canShowInfoDrawer`
 * @param context Rule execution context
 */
export declare function canShowInfoDrawer(context: RuleContext): boolean;
/**
 * Checks if user can manage file versions for the selected node.
 * JSON ref: `canManageFileVersions`
 * @param context Rule execution context
 */
export declare function canManageFileVersions(context: RuleContext): boolean;
/**
 * Checks if user can manage permissions for the selected node.
 * JSON ref: `canManagePermissions`
 * @param context Rule execution context
 */
export declare function canManagePermissions(context: RuleContext): boolean;
/**
 * Checks if user can toggle **Edit Offline** mode for selected node.
 * JSON ref: `canToggleEditOffline`
 * @param context Rule execution context
 */
export declare function canToggleEditOffline(context: RuleContext): boolean;
/**
 * @deprecated Uses workarounds for for recent files and search api issues.
 * Checks if user can toggle **Favorite** state for a node.
 * @param context Rule execution context
 */
export declare function canToggleFavorite(context: RuleContext): boolean;
/**
 * Checks if application should render language picker menu.
 * JSON ref: `canShowLanguagePicker`
 * @param context Rule execution context
 */
export declare function canShowLanguagePicker(context: AcaRuleContext): boolean;
/**
 * Checks if application should render logout option.
 * JSON ref: `canShowLogout`
 * @param context Rule execution context
 */
export declare function canShowLogout(context: AcaRuleContext): boolean;
/**
 * Checks if application should render process services extension.
 * JSON ref: `canShowProcessServices`
 * @param context Rule execution context
 */
export declare function canShowProcessServices(
  context: AcaRuleContext
): boolean;
