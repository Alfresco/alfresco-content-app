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
import * as navigation from './navigation.rules';
import * as repository from './repository.rules';
import { isAdmin } from './user.rules';

export interface AcaRuleContext extends RuleContext {
  withCredentials: boolean;
}

/**
 * Checks if user can copy selected node.
 * JSON ref: `app.canCopyNode`
 *
 * @param context Rule execution context
 */
export const canCopyNode = (context: RuleContext): boolean =>
  [hasSelection(context), navigation.isNotTrashcan(context), navigation.isNotLibraries(context)].every(Boolean);

/**
 * Checks if user can mark selected nodes as **Favorite**.
 * JSON ref: `app.selection.canAddFavorite`
 */
export function canAddFavorite(context: RuleContext): boolean {
  if (!context.selection.isEmpty) {
    if (navigation.isFavorites(context) || navigation.isLibraries(context) || navigation.isTrashcan(context)) {
      return false;
    }
    return context.selection.nodes.some((node) => !node.entry.isFavorite);
  }
  return false;
}

/**
 * Checks if user can un-mark selected nodes as **Favorite**.
 * JSON ref: `app.selection.canRemoveFavorite`
 */
export function canRemoveFavorite(context: RuleContext): boolean {
  if (!context.selection.isEmpty && !navigation.isTrashcan(context)) {
    if (navigation.isFavorites(context)) {
      return true;
    }
    return context.selection.nodes.every((node) => node.entry.isFavorite);
  }
  return false;
}

/**
 * Checks if user can share selected file.
 * JSON ref: `app.selection.file.canShare`
 */
export const canShareFile = (context: RuleContext): boolean =>
  [context.selection.file, navigation.isNotTrashcan(context), repository.hasQuickShareEnabled(context), !isShared(context)].every(Boolean);

/**
 * Checks if user can perform "Join" or "Cancel Join Request" on a library.
 * JSON ref: `canToggleJoinLibrary`
 */
export const canToggleJoinLibrary = (context: RuleContext): boolean =>
  [hasLibrarySelected(context), !isPrivateLibrary(context), hasNoLibraryRole(context)].every(Boolean) ||
  [hasLibrarySelected(context), isPrivateLibrary(context), hasNoLibraryRole(context), isAdmin(context)].every(Boolean);

/**
 * Checks if user can edit the selected folder.
 * JSON ref: `canEditFolder`
 *
 * @param context Rule execution context
 */
export const canEditFolder = (context: RuleContext): boolean => [canUpdateSelectedFolder(context), navigation.isNotTrashcan(context)].every(Boolean);

/**
 * Checks if the selected file is already shared.
 * JSON ref: `app.selection.file.isShared`
 */
export function isShared(context: RuleContext): boolean {
  if (navigation.isSharedFiles(context) && context.selection.file) {
    return true;
  }

  if (navigation.isNotTrashcan(context) && !context.selection.isEmpty && context.selection.file) {
    return !!(context.selection.file.entry && context.selection.file.entry.properties && context.selection.file.entry.properties['qshare:sharedId']);
  }

  return false;
}

/**
 * Checks if user can delete selected nodes.
 * JSON ref: `app.selection.canDelete`
 */
export function canDeleteSelection(context: RuleContext): boolean {
  if (
    navigation.isNotTrashcan(context) &&
    navigation.isNotLibraries(context) &&
    navigation.isNotSearchResults(context) &&
    !context.selection.isEmpty
  ) {
    if (hasLockedFiles(context)) {
      return false;
    }

    // temp workaround for Favorites api
    if (navigation.isFavorites(context)) {
      return true;
    }

    if (navigation.isPreview(context)) {
      return context.permissions.check(context.selection.nodes, ['delete']);
    }

    // workaround for Shared Files
    if (navigation.isSharedFiles(context)) {
      return context.permissions.check(context.selection.nodes, ['delete'], {
        target: 'allowableOperationsOnTarget'
      });
    }

    return context.permissions.check(context.selection.nodes, ['delete']);
  }
  return false;
}

/**
 * Checks if user can un-share selected nodes.
 * JSON ref: `app.selection.canUnshare`
 */
export function canUnshareNodes(context: RuleContext): boolean {
  if (!context.selection.isEmpty) {
    return context.permissions.check(context.selection.nodes, ['delete'], {
      target: 'allowableOperationsOnTarget'
    });
  }
  return false;
}

/**
 * Checks if user selected anything.
 * JSON ref: `app.selection.notEmpty`
 */
export const hasSelection = (context: RuleContext): boolean => !context.selection.isEmpty;

/**
 * Checks if user can create a new folder with current path.
 * JSON ref: `app.navigation.folder.canCreate`
 */
export function canCreateFolder(context: RuleContext): boolean {
  const { currentFolder } = context.navigation;
  if (currentFolder) {
    return context.permissions.check(currentFolder, ['create']);
  }
  return false;
}

/**
 * Checks if user can upload content to current folder.
 * JSON ref: `app.navigation.folder.canUpload`
 */
export function canUpload(context: RuleContext): boolean {
  const { currentFolder } = context.navigation;
  if (currentFolder) {
    return context.permissions.check(currentFolder, ['create']);
  }
  return false;
}

/**
 * Checks if user can download selected nodes (either files or folders).
 * JSON ref: `app.selection.canDownload`
 */
export function canDownloadSelection(context: RuleContext): boolean {
  if (!context.selection.isEmpty && navigation.isNotTrashcan(context)) {
    return context.selection.nodes.every((node: any) => node.entry && (node.entry.isFile || node.entry.isFolder || !!node.entry.nodeId));
  }
  return false;
}

/**
 * Checks if user has selected a folder.
 * JSON ref: `app.selection.folder`
 */
export const hasFolderSelected = (context: RuleContext): boolean => !!context.selection.folder;

/**
 * Checks if user has selected a library (site).
 * JSON ref: `app.selection.library`
 */
export const hasLibrarySelected = (context: RuleContext): boolean => !!context.selection.library;

/**
 * Checks if user has selected a **private** library (site)
 * JSON ref: `app.selection.isPrivateLibrary`
 */
export function isPrivateLibrary(context: RuleContext): boolean {
  const library = context.selection.library;
  return library ? !!(library.entry && library.entry.visibility && library.entry.visibility === 'PRIVATE') : false;
}

/**
 * Checks if the selected library has a **role** property defined.
 * JSON ref: `app.selection.hasLibraryRole`
 */
export function hasLibraryRole(context: RuleContext): boolean {
  const library = context.selection.library;
  return library ? !!(library.entry && library.entry.role) : false;
}

/**
 * Checks if the selected library has no **role** property defined.
 * JSON ref: `app.selection.hasNoLibraryRole`
 */
export const hasNoLibraryRole = (context: RuleContext): boolean => !hasLibraryRole(context);

/**
 * Checks if user has selected a file.
 * JSON ref: `app.selection.file`
 */
export const hasFileSelected = (context: RuleContext): boolean => !!(context && context.selection && context.selection.file);

/**
 * Checks if user can update the first selected node.
 * JSON ref: `app.selection.first.canUpdate`
 */
export function canUpdateSelectedNode(context: RuleContext): boolean {
  if (context.selection && !context.selection.isEmpty) {
    const node = context.selection.first;

    if (node.entry.isFile && hasLockedFiles(context)) {
      return false;
    }

    return context.permissions.check(node, ['update']);
  }
  return false;
}

export function isMultiselection(context: RuleContext): boolean {
  let isMultiNodeSelected = false;
  if (context.selection && !context.selection.isEmpty) {
    isMultiNodeSelected = context.selection.count > 1;
  }
  return isMultiNodeSelected;
}

/**
 * Checks if user can update the first selected folder.
 * JSON ref: `app.selection.folder.canUpdate`
 */
export function canUpdateSelectedFolder(context: RuleContext): boolean {
  const { folder } = context.selection;
  if (folder) {
    return (
      // workaround for Favorites Api
      navigation.isFavorites(context) || context.permissions.check(folder.entry, ['update'])
    );
  }
  return false;
}

/**
 * Checks if user has selected a **locked** file node.
 * JSON ref: `app.selection.file.isLocked`
 */
export function hasLockedFiles(context: RuleContext): boolean {
  if (context && context.selection && context.selection.nodes) {
    return context.selection.nodes.some((node) => {
      if (!node.entry.isFile) {
        return false;
      }

      return node.entry.isLocked || (node.entry.properties && node.entry.properties['cm:lockType'] === 'READ_ONLY_LOCK');
    });
  }

  return false;
}

/**
 * Checks if the selected file has **write** or **read-only** locks specified.
 * JSON ref: `app.selection.file.isLocked`
 */
export const isWriteLocked = (context: RuleContext): boolean =>
  !!(
    context &&
    context.selection &&
    context.selection.file &&
    context.selection.file.entry &&
    context.selection.file.entry.properties &&
    (context.selection.file.entry.properties['cm:lockType'] === 'WRITE_LOCK' ||
      context.selection.file.entry.properties['cm:lockType'] === 'READ_ONLY_LOCK')
  );

/**
 * Checks if the selected file has **write** or **read-only** locks specified,
 * and that current user is the owner of the lock.
 * JSON ref: `app.selection.file.isLockOwner`
 */
export const isUserWriteLockOwner = (context: RuleContext): boolean =>
  isWriteLocked(context) &&
  context.selection.file.entry.properties['cm:lockOwner'] &&
  context.selection.file.entry.properties['cm:lockOwner'].id === context.profile.id;

/**
 * Checks if user can lock selected file.
 * JSON ref: `app.selection.file.canLock`
 */
export const canLockFile = (context: RuleContext): boolean => !isWriteLocked(context) && canUpdateSelectedNode(context);

/**
 * Checks if user can unlock selected file.
 * JSON ref: `app.selection.file.canUnlock`
 */
export function canUnlockFile(context: RuleContext): boolean {
  const { file } = context.selection;
  return isWriteLocked(context) && (context.permissions.check(file.entry, ['delete']) || isUserWriteLockOwner(context));
}

/**
 * Checks if user can upload a new version of the file.
 * JSON ref: `app.selection.file.canUploadVersion`
 */
export function canUploadVersion(context: RuleContext): boolean {
  if (navigation.isFavorites(context) || navigation.isSharedFiles(context)) {
    return hasFileSelected(context);
  }

  return [
    hasFileSelected(context),
    navigation.isNotTrashcan(context),
    isWriteLocked(context) ? isUserWriteLockOwner(context) : canUpdateSelectedNode(context)
  ].every(Boolean);
}

/**
 * Checks if user has trashcan item selected.
 * JSON ref: `isTrashcanItemSelected`
 *
 * @param context Rule execution context
 */
export const isTrashcanItemSelected = (context: RuleContext): boolean => [navigation.isTrashcan(context), hasSelection(context)].every(Boolean);

/**
 * Checks if user can view the file.
 * JSON ref: `canViewFile`
 *
 * @param context Rule execution context
 */
export const canViewFile = (context: RuleContext): boolean => [hasFileSelected(context), navigation.isNotTrashcan(context)].every(Boolean);

/**
 * Checks if user can **Leave** selected library.
 * JSON ref: `canLeaveLibrary`
 *
 * @param context Rule execution context
 */
export const canLeaveLibrary = (context: RuleContext): boolean => [hasLibrarySelected(context), hasLibraryRole(context)].every(Boolean);

/**
 * Checks if user can toggle shared link mode.
 * JSON ref: `canToggleSharedLink`
 *
 * @param context Rule execution context
 */
export const canToggleSharedLink = (context: RuleContext): boolean =>
  [hasFileSelected(context), [canShareFile(context), isShared(context)].some(Boolean)].every(Boolean);

/**
 * Checks if user can show **Info Drawer** for the selected node.
 * JSON ref: `canShowInfoDrawer`
 *
 * @param context Rule execution context
 */
export const canShowInfoDrawer = (context: RuleContext): boolean =>
  [hasSelection(context), navigation.isNotLibraries(context), navigation.isNotTrashcan(context)].every(Boolean);

/**
 * Checks if user can manage file versions for the selected node.
 * JSON ref: `canManageFileVersions`
 *
 * @param context Rule execution context
 */
export const canManageFileVersions = (context: RuleContext): boolean =>
  [hasFileSelected(context), navigation.isNotTrashcan(context), !hasLockedFiles(context)].every(Boolean);

/**
 * Checks if user can edit aspects for the selected node.
 * JSON ref: `canEditAspects`
 *
 * @param context Rule execution context
 */
export const canEditAspects = (context: RuleContext): boolean =>
  [
    !isMultiselection(context),
    canUpdateSelectedNode(context),
    !isWriteLocked(context),
    navigation.isNotTrashcan(context),
    repository.isMajorVersionAvailable(context, '7')
  ].every(Boolean);

/**
 * Checks if user can manage permissions for the selected node.
 * JSON ref: `canManagePermissions`
 *
 * @param context Rule execution context
 */
export const canManagePermissions = (context: RuleContext): boolean =>
  [canUpdateSelectedNode(context), navigation.isNotTrashcan(context)].every(Boolean);

/**
 * Checks if user can toggle **Edit Offline** mode for selected node.
 * JSON ref: `canToggleEditOffline`
 *
 * @param context Rule execution context
 */
export const canToggleEditOffline = (context: RuleContext): boolean =>
  [hasFileSelected(context), navigation.isNotTrashcan(context), canLockFile(context) || canUnlockFile(context)].every(Boolean);

/**
 * @deprecated Uses workarounds for for recent files and search api issues.
 * Checks if user can toggle **Favorite** state for a node.
 * @param context Rule execution context
 */
export const canToggleFavorite = (context: RuleContext): boolean =>
  [
    [canAddFavorite(context), canRemoveFavorite(context)].some(Boolean),
    [navigation.isRecentFiles(context), navigation.isSharedFiles(context), navigation.isSearchResults(context), navigation.isFavorites(context)].some(
      Boolean
    )
  ].every(Boolean);

/**
 * Checks if application should render logout option.
 * JSON ref: `canShowLogout`
 *
 * @param context Rule execution context
 */
export const canShowLogout = (context: AcaRuleContext): boolean => !context.withCredentials;

/**
 * Checks if user is library manager
 * JSON ref: `isLibraryManager`
 *
 * @param context Rule execution context
 */
export const isLibraryManager = (context: RuleContext): boolean =>
  hasLibrarySelected(context) && context.selection.library.entry && context.selection.library.entry.role === 'SiteManager';

/**
 * Checks if the preview button for search results can be showed
 * JSON ref: `canInfoPreview`
 *
 * @param context Rule execution context
 */
export const canInfoPreview = (context: RuleContext): boolean =>
  navigation.isSearchResults(context) && !isMultiselection(context) && !hasFolderSelected(context) && !navigation.isPreview(context);

export const showInfoSelectionButton = (context: RuleContext): boolean => navigation.isSearchResults(context) && !navigation.isPreview(context);
