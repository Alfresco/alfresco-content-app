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

import { RuleContext, RuleParameter } from '@alfresco/adf-extensions';
import { AppRuleContext } from '../app.interface';
import {
  isNotTrashcan,
  isNotLibraries,
  isFavorites,
  isLibraries,
  isTrashcan,
  isSharedFiles,
  isNotSearchResults,
  isPreview
} from './navigation.evaluators';

/**
 * Checks if user can mark selected nodes as **Favorite**.
 * JSON ref: `app.selection.canAddFavorite`
 */
export function canAddFavorite(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  if (!context.selection.isEmpty) {
    if (
      isFavorites(context, ...args) ||
      isLibraries(context, ...args) ||
      isTrashcan(context, ...args)
    ) {
      return false;
    }
    return context.selection.nodes.some(node => !node.entry.isFavorite);
  }
  return false;
}

/**
 * Checks if user can un-mark selected nodes as **Favorite**.
 * JSON ref: `app.selection.canRemoveFavorite`
 */
export function canRemoveFavorite(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  if (!context.selection.isEmpty && !isTrashcan(context, ...args)) {
    if (isFavorites(context, ...args)) {
      return true;
    }
    return context.selection.nodes.every(node => node.entry.isFavorite);
  }
  return false;
}

/**
 * Checks if user can share selected file.
 * JSON ref: `app.selection.file.canShare`
 */
export function canShareFile(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  if (isNotTrashcan(context, ...args) && context.selection.file) {
    return true;
  }
  return false;
}

/**
 * Checks if the selected file is already shared.
 * JSON ref: `app.selection.file.isShared`
 */
export function isShared(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  if (isSharedFiles(context, ...args) && !context.selection.isEmpty) {
    return true;
  }

  if (
    (isNotTrashcan(context, ...args),
    !context.selection.isEmpty && context.selection.file)
  ) {
    return !!(
      context.selection.file.entry &&
      context.selection.file.entry.properties &&
      context.selection.file.entry.properties['qshare:sharedId']
    );
  }

  return false;
}

/**
 * Checks if user can delete selected nodes.
 * JSON ref: `app.selection.canDelete`
 */
export function canDeleteSelection(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  if (
    isNotTrashcan(context, ...args) &&
    isNotLibraries(context, ...args) &&
    isNotSearchResults(context, ...args) &&
    !context.selection.isEmpty
  ) {
    if (hasLockedFiles(context, ...args)) {
      return false;
    }

    // temp workaround for Search api
    if (isFavorites(context, ...args)) {
      return true;
    }

    if (isPreview(context, ...args)) {
      return context.permissions.check(context.selection.nodes, ['delete']);
    }

    // workaround for Shared Files
    if (isSharedFiles(context, ...args)) {
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
export function canUnshareNodes(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
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
export function hasSelection(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  return !context.selection.isEmpty;
}

/**
 * Checks if user can create a new folder with current path.
 * JSON ref: `app.navigation.folder.canCreate`
 */
export function canCreateFolder(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
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
export function canUpload(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
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
export function canDownloadSelection(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  if (!context.selection.isEmpty) {
    return context.selection.nodes.every((node: any) => {
      return (
        node.entry &&
        (node.entry.isFile || node.entry.isFolder || !!node.entry.nodeId)
      );
    });
  }
  return false;
}

/**
 * Checks if user has selected a folder.
 * JSON ref: `app.selection.folder`
 */
export function hasFolderSelected(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const folder = context.selection.folder;
  return folder ? true : false;
}

/**
 * Checks if user has selected a library (site).
 * JSON ref: `app.selection.library`
 */
export function hasLibrarySelected(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const library = context.selection.library;
  return library ? true : false;
}

/**
 * Checks if user has selected a **private** library (site)
 * JSON ref: `app.selection.isPrivateLibrary`
 */
export function isPrivateLibrary(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const library = context.selection.library;
  return library
    ? !!(
        library.entry &&
        library.entry.visibility &&
        library.entry.visibility === 'PRIVATE'
      )
    : false;
}

/**
 * Checks if the selected library has a **role** property defined.
 * JSON ref: `app.selection.hasLibraryRole`
 */
export function hasLibraryRole(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const library = context.selection.library;
  return library ? !!(library.entry && library.entry.role) : false;
}

/**
 * Checks if the selected library has no **role** property defined.
 * JSON ref: `app.selection.hasNoLibraryRole`
 */
export function hasNoLibraryRole(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  return !hasLibraryRole(context, ...args);
}

/**
 * Checks if user has selected a file.
 * JSON ref: `app.selection.file`
 */
export function hasFileSelected(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const file = context.selection.file;
  return file ? true : false;
}

/**
 * Checks if user can update the first selected node.
 * JSON ref: `app.selection.first.canUpdate`
 */
export function canUpdateSelectedNode(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  if (context.selection && !context.selection.isEmpty) {
    const node = context.selection.first;

    if (node.entry.isFile && hasLockedFiles(context, ...args)) {
      return false;
    }

    return context.permissions.check(node, ['update']);
  }
  return false;
}

/**
 * Checks if user can update the first selected folder.
 * JSON ref: `app.selection.folder.canUpdate`
 */
export function canUpdateSelectedFolder(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  const { folder } = context.selection;
  if (folder) {
    return (
      // workaround for Favorites Api
      isFavorites(context, ...args) ||
      context.permissions.check(folder.entry, ['update'])
    );
  }
  return false;
}

/**
 * Checks if user has selected a **locked** file node.
 * JSON ref: `app.selection.file.isLocked`
 */
export function hasLockedFiles(
  context: RuleContext,
  ...args: RuleParameter[]
): boolean {
  if (context && context.selection && context.selection.nodes) {
    return context.selection.nodes.some(node => {
      if (!node.entry.isFile) {
        return false;
      }

      return (
        node.entry.isLocked ||
        (node.entry.properties &&
          node.entry.properties['cm:lockType'] === 'READ_ONLY_LOCK')
      );
    });
  }

  return false;
}

/**
 * Checks if the selected file has **write** or **read-only** locks specified.
 * JSON ref: `app.selection.file.isLocked`
 */
export function isWriteLocked(
  context: AppRuleContext,
  ...args: RuleParameter[]
): boolean {
  return !!(
    context &&
    context.selection &&
    context.selection.file &&
    context.selection.file.entry &&
    context.selection.file.entry.properties &&
    (context.selection.file.entry.properties['cm:lockType'] === 'WRITE_LOCK' ||
      context.selection.file.entry.properties['cm:lockType'] ===
        'READ_ONLY_LOCK')
  );
}

/**
 * Checks if the selected file has **write** or **read-only** locks specified,
 * and that current user is the owner of the lock.
 * JSON ref: `app.selection.file.isLockOwner`
 */
export function isUserWriteLockOwner(
  context: AppRuleContext,
  ...args: RuleParameter[]
): boolean {
  return (
    isWriteLocked(context, ...args) &&
    (context.selection.file.entry.properties['cm:lockOwner'] &&
      context.selection.file.entry.properties['cm:lockOwner'].id ===
        context.profile.id)
  );
}

/**
 * Checks if user can lock selected file.
 * JSON ref: `app.selection.file.canLock`
 */
export function canLockFile(
  context: AppRuleContext,
  ...args: RuleParameter[]
): boolean {
  return (
    !isWriteLocked(context, ...args) && canUpdateSelectedNode(context, ...args)
  );
}

/**
 * Checks if user can unlock selected file.
 * JSON ref: `app.selection.file.canLock`
 */
export function canUnlockFile(
  context: AppRuleContext,
  ...args: RuleParameter[]
): boolean {
  const { file } = context.selection;
  return (
    isWriteLocked(context, ...args) &&
    (context.permissions.check(file.entry, ['delete']) ||
      isUserWriteLockOwner(context, ...args))
  );
}

/**
 * Checks if user can upload a new version of the file.
 * JSON ref: `app.selection.file.canUploadVersion`
 */
export function canUploadVersion(
  context: AppRuleContext,
  ...args: RuleParameter[]
): boolean {
  if (isFavorites(context, ...args) || isSharedFiles(context, ...args)) {
    return true;
  }

  return isWriteLocked(context, ...args)
    ? isUserWriteLockOwner(context, ...args)
    : canUpdateSelectedNode(context, ...args);
}
