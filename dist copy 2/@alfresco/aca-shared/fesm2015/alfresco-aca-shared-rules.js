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
/**
 * Checks if a Preview route is activated.
 * JSON ref: `app.navigation.isPreview`
 * @param {?} context
 * @return {?}
 */
function isPreview(context) {
  const { url } = context.navigation;
  return (
    url &&
    (url.includes('/preview/') ||
      url.includes('viewer:view') ||
      url.includes('/view/'))
  );
}
/**
 * Checks if a **Favorites** route is activated.
 * JSON ref: `app.navigation.isFavorites`
 * @param {?} context
 * @return {?}
 */
function isFavorites(context) {
  const { url } = context.navigation;
  return url && url.startsWith('/favorites') && !isPreview(context);
}
/**
 * Checks if the activated route is not **Favorites**.
 * JSON ref: `app.navigation.isNotFavorites`
 * @param {?} context
 * @return {?}
 */
function isNotFavorites(context) {
  return !isFavorites(context);
}
/**
 * Checks if a **Shared Files** route is activated.
 * JSON ref: `app.navigation.isSharedFiles`
 * @param {?} context
 * @return {?}
 */
function isSharedFiles(context) {
  const { url } = context.navigation;
  return url && url.startsWith('/shared') && !isPreview(context);
}
/**
 * Checks if the activated route is not **Shared Files**.
 * JSON ref: `app.navigation.isNotSharedFiles`
 * @param {?} context
 * @return {?}
 */
function isNotSharedFiles(context) {
  return !isSharedFiles(context);
}
/**
 * Checks if a **Trashcan** route is activated.
 * JSON ref: `app.navigation.isTrashcan`
 * @param {?} context
 * @return {?}
 */
function isTrashcan(context) {
  const { url } = context.navigation;
  return url && url.startsWith('/trashcan');
}
/**
 * Checks if the activated route is not **Trashcan**.
 * JSON ref: `app.navigation.isNotTrashcan`
 * @param {?} context
 * @return {?}
 */
function isNotTrashcan(context) {
  return !isTrashcan(context);
}
/**
 * Checks if a **Personal Files** route is activated.
 * JSON ref: `app.navigation.isPersonalFiles`
 * @param {?} context
 * @return {?}
 */
function isPersonalFiles(context) {
  const { url } = context.navigation;
  return url && url.startsWith('/personal-files');
}
/**
 * Checks if a **Library Files** route is activated.
 * JSON ref: `app.navigation.isLibraryFiles`
 * @param {?} context
 * @return {?}
 */
function isLibraryFiles(context) {
  const { url } = context.navigation;
  return url && url.startsWith('/libraries');
}
/**
 * Checks if a **Library Files** or **Library Search Result** route is activated.
 * JSON ref: `app.navigation.isLibraryFiles`
 * @param {?} context
 * @return {?}
 */
function isLibraries(context) {
  const { url } = context.navigation;
  return (
    url && (url.endsWith('/libraries') || url.startsWith('/search-libraries'))
  );
}
/**
 * Checks if the activated route is neither **Libraries** nor **Library Search Results**.
 * JSON ref: `app.navigation.isNotLibraries`
 * @param {?} context
 * @return {?}
 */
function isNotLibraries(context) {
  return !isLibraries(context);
}
/**
 * Checks if a **Recent Files** route is activated.
 * JSON ref: `app.navigation.isRecentFiles`
 * @param {?} context
 * @return {?}
 */
function isRecentFiles(context) {
  const { url } = context.navigation;
  return url && url.startsWith('/recent-files');
}
/**
 * Checks if the activated route is not **Recent Files**.
 * JSON ref: `app.navigation.isNotRecentFiles`
 * @param {?} context
 * @return {?}
 */
function isNotRecentFiles(context) {
  return !isRecentFiles(context);
}
/**
 * Checks if a **Search Results** route is activated.
 * JSON ref: `app.navigation.isSearchResults`
 * @param {?} context
 * @return {?}
 */
function isSearchResults(context /*,
...args: RuleParameter[]*/) {
  const { url } = context.navigation;
  return url && url.startsWith('/search');
}
/**
 * Checks if the activated route is not **Search Results**.
 * JSON ref: `app.navigation.isNotSearchResults`
 * @param {?} context
 * @return {?}
 */
function isNotSearchResults(context) {
  return !isSearchResults(context);
}
/**
 * Checks if a **Shared Preview** route is activated.
 * JSON ref: `app.navigation.isSharedPreview`
 * @param {?} context
 * @return {?}
 */
function isSharedPreview(context) {
  const { url } = context.navigation;
  return (
    url &&
    (url.startsWith('/shared/preview/') ||
      (url.startsWith('/shared') && url.includes('viewer:view')))
  );
}
/**
 * Checks if a **Favorites Preview** route is activated.
 * JSON ref: `app.navigation.isFavoritesPreview`
 * @param {?} context
 * @return {?}
 */
function isFavoritesPreview(context) {
  const { url } = context.navigation;
  return (
    url &&
    (url.startsWith('/favorites/preview/') ||
      (url.startsWith('/favorites') && url.includes('viewer:view')))
  );
}
/**
 * Checks if a **Shared File Preview** route is activated.
 * JSON ref: `app.navigation.isFavoritesPreview`
 * @param {?} context
 * @return {?}
 */
function isSharedFileViewer(context) {
  const { url } = context.navigation;
  return url && url.startsWith('/preview/s/');
}

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
/**
 * Checks if the quick share repository option is enabled or not.
 * JSON ref: `repository.isQuickShareEnabled`
 * @param {?} context
 * @return {?}
 */
function hasQuickShareEnabled(context) {
  return context.repository.status.isQuickShareEnabled;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Checks if user can copy selected node.
 * JSON ref: `app.canCopyNode`
 * @param {?} context Rule execution context
 * @return {?}
 */
function canCopyNode(context) {
  return [
    hasSelection(context),
    isNotTrashcan(context),
    isNotLibraries(context)
  ].every(Boolean);
}
/**
 * Checks if user can mark selected nodes as **Favorite**.
 * JSON ref: `app.selection.canAddFavorite`
 * @param {?} context
 * @return {?}
 */
function canAddFavorite(context) {
  if (!context.selection.isEmpty) {
    if (isFavorites(context) || isLibraries(context) || isTrashcan(context)) {
      return false;
    }
    return context.selection.nodes.some(node => !node.entry.isFavorite);
  }
  return false;
}
/**
 * Checks if user can un-mark selected nodes as **Favorite**.
 * JSON ref: `app.selection.canRemoveFavorite`
 * @param {?} context
 * @return {?}
 */
function canRemoveFavorite(context) {
  if (!context.selection.isEmpty && !isTrashcan(context)) {
    if (isFavorites(context)) {
      return true;
    }
    return context.selection.nodes.every(node => node.entry.isFavorite);
  }
  return false;
}
/**
 * Checks if user can share selected file.
 * JSON ref: `app.selection.file.canShare`
 * @param {?} context
 * @return {?}
 */
function canShareFile(context) {
  return [
    context.selection.file,
    isNotTrashcan(context),
    hasQuickShareEnabled(context),
    !isShared(context)
  ].every(Boolean);
}
/**
 * Checks if user can perform "Join" or "Cancel Join Request" on a library.
 * JSON ref: `canToggleJoinLibrary`
 * @param {?} context
 * @return {?}
 */
function canToggleJoinLibrary(context) {
  return [
    hasLibrarySelected(context),
    !isPrivateLibrary(context),
    hasNoLibraryRole(context)
  ].every(Boolean);
}
/**
 * Checks if user can edit the selected folder.
 * JSON ref: `canEditFolder`
 * @param {?} context Rule execution context
 * @return {?}
 */
function canEditFolder(context) {
  return [canUpdateSelectedFolder(context), isNotTrashcan(context)].every(
    Boolean
  );
}
/**
 * Checks if the selected file is already shared.
 * JSON ref: `app.selection.file.isShared`
 * @param {?} context
 * @return {?}
 */
function isShared(context) {
  if (isSharedFiles(context) && context.selection.file) {
    return true;
  }
  if (
    (isNotTrashcan(context),
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
 * @param {?} context
 * @return {?}
 */
function canDeleteSelection(context) {
  if (
    isNotTrashcan(context) &&
    isNotLibraries(context) &&
    isNotSearchResults(context) &&
    !context.selection.isEmpty
  ) {
    if (hasLockedFiles(context)) {
      return false;
    }
    // temp workaround for Favorites api
    if (isFavorites(context)) {
      return true;
    }
    if (isPreview(context)) {
      return context.permissions.check(context.selection.nodes, ['delete']);
    }
    // workaround for Shared Files
    if (isSharedFiles(context)) {
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
 * @param {?} context
 * @return {?}
 */
function canUnshareNodes(context) {
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
 * @param {?} context
 * @return {?}
 */
function hasSelection(context) {
  return !context.selection.isEmpty;
}
/**
 * Checks if user can create a new folder with current path.
 * JSON ref: `app.navigation.folder.canCreate`
 * @param {?} context
 * @return {?}
 */
function canCreateFolder(context) {
  const { currentFolder } = context.navigation;
  if (currentFolder) {
    return context.permissions.check(currentFolder, ['create']);
  }
  return false;
}
/**
 * Checks if user can upload content to current folder.
 * JSON ref: `app.navigation.folder.canUpload`
 * @param {?} context
 * @return {?}
 */
function canUpload(context) {
  const { currentFolder } = context.navigation;
  if (currentFolder) {
    return context.permissions.check(currentFolder, ['create']);
  }
  return false;
}
/**
 * Checks if user can download selected nodes (either files or folders).
 * JSON ref: `app.selection.canDownload`
 * @param {?} context
 * @return {?}
 */
function canDownloadSelection(context) {
  if (!context.selection.isEmpty && isNotTrashcan(context)) {
    return context.selection.nodes.every(node => {
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
 * @param {?} context
 * @return {?}
 */
function hasFolderSelected(context) {
  /** @type {?} */
  const folder = context.selection.folder;
  return folder ? true : false;
}
/**
 * Checks if user has selected a library (site).
 * JSON ref: `app.selection.library`
 * @param {?} context
 * @return {?}
 */
function hasLibrarySelected(context) {
  /** @type {?} */
  const library = context.selection.library;
  return library ? true : false;
}
/**
 * Checks if user has selected a **private** library (site)
 * JSON ref: `app.selection.isPrivateLibrary`
 * @param {?} context
 * @return {?}
 */
function isPrivateLibrary(context) {
  /** @type {?} */
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
 * @param {?} context
 * @return {?}
 */
function hasLibraryRole(context) {
  /** @type {?} */
  const library = context.selection.library;
  return library ? !!(library.entry && library.entry.role) : false;
}
/**
 * Checks if the selected library has no **role** property defined.
 * JSON ref: `app.selection.hasNoLibraryRole`
 * @param {?} context
 * @return {?}
 */
function hasNoLibraryRole(context) {
  return !hasLibraryRole(context);
}
/**
 * Checks if user has selected a file.
 * JSON ref: `app.selection.file`
 * @param {?} context
 * @return {?}
 */
function hasFileSelected(context) {
  if (context && context.selection && context.selection.file) {
    return true;
  }
  return false;
}
/**
 * Checks if user can update the first selected node.
 * JSON ref: `app.selection.first.canUpdate`
 * @param {?} context
 * @return {?}
 */
function canUpdateSelectedNode(context) {
  if (context.selection && !context.selection.isEmpty) {
    /** @type {?} */
    const node = context.selection.first;
    if (node.entry.isFile && hasLockedFiles(context)) {
      return false;
    }
    return context.permissions.check(node, ['update']);
  }
  return false;
}
/**
 * Checks if user can update the first selected folder.
 * JSON ref: `app.selection.folder.canUpdate`
 * @param {?} context
 * @return {?}
 */
function canUpdateSelectedFolder(context) {
  const { folder } = context.selection;
  if (folder) {
    return (
      // workaround for Favorites Api
      isFavorites(context) ||
      context.permissions.check(folder.entry, ['update'])
    );
  }
  return false;
}
/**
 * Checks if user has selected a **locked** file node.
 * JSON ref: `app.selection.file.isLocked`
 * @param {?} context
 * @return {?}
 */
function hasLockedFiles(context) {
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
 * @param {?} context
 * @return {?}
 */
function isWriteLocked(context) {
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
 * @param {?} context
 * @return {?}
 */
function isUserWriteLockOwner(context) {
  return (
    isWriteLocked(context) &&
    (context.selection.file.entry.properties['cm:lockOwner'] &&
      context.selection.file.entry.properties['cm:lockOwner'].id ===
        context.profile.id)
  );
}
/**
 * Checks if user can lock selected file.
 * JSON ref: `app.selection.file.canLock`
 * @param {?} context
 * @return {?}
 */
function canLockFile(context) {
  return !isWriteLocked(context) && canUpdateSelectedNode(context);
}
/**
 * Checks if user can unlock selected file.
 * JSON ref: `app.selection.file.canUnlock`
 * @param {?} context
 * @return {?}
 */
function canUnlockFile(context) {
  const { file } = context.selection;
  return (
    isWriteLocked(context) &&
    (context.permissions.check(file.entry, ['delete']) ||
      isUserWriteLockOwner(context))
  );
}
/**
 * Checks if user can upload a new version of the file.
 * JSON ref: `app.selection.file.canUploadVersion`
 * @param {?} context
 * @return {?}
 */
function canUploadVersion(context) {
  if (isFavorites(context) || isSharedFiles(context)) {
    return hasFileSelected(context);
  }
  return [
    hasFileSelected(context),
    isNotTrashcan(context),
    isWriteLocked(context)
      ? isUserWriteLockOwner(context)
      : canUpdateSelectedNode(context)
  ].every(Boolean);
}
/**
 * Checks if user has trashcan item selected.
 * JSON ref: `isTrashcanItemSelected`
 * @param {?} context Rule execution context
 * @return {?}
 */
function isTrashcanItemSelected(context) {
  return [isTrashcan(context), hasSelection(context)].every(Boolean);
}
/**
 * Checks if user can view the file.
 * JSON ref: `canViewFile`
 * @param {?} context Rule execution context
 * @return {?}
 */
function canViewFile(context) {
  return [hasFileSelected(context), isNotTrashcan(context)].every(Boolean);
}
/**
 * Checks if user can **Leave** selected library.
 * JSON ref: `canLeaveLibrary`
 * @param {?} context Rule execution context
 * @return {?}
 */
function canLeaveLibrary(context) {
  return [hasLibrarySelected(context), hasLibraryRole(context)].every(Boolean);
}
/**
 * Checks if user can toggle shared link mode.
 * JSON ref: `canToggleSharedLink`
 * @param {?} context Rule execution context
 * @return {?}
 */
function canToggleSharedLink(context) {
  return [
    hasFileSelected(context),
    [canShareFile(context), isShared(context)].some(Boolean)
  ].every(Boolean);
}
/**
 * Checks if user can show **Info Drawer** for the selected node.
 * JSON ref: `canShowInfoDrawer`
 * @param {?} context Rule execution context
 * @return {?}
 */
function canShowInfoDrawer(context) {
  return [
    hasSelection(context),
    isNotLibraries(context),
    isNotTrashcan(context)
  ].every(Boolean);
}
/**
 * Checks if user can manage file versions for the selected node.
 * JSON ref: `canManageFileVersions`
 * @param {?} context Rule execution context
 * @return {?}
 */
function canManageFileVersions(context) {
  return [
    hasFileSelected(context),
    isNotTrashcan(context),
    !hasLockedFiles(context)
  ].every(Boolean);
}
/**
 * Checks if user can manage permissions for the selected node.
 * JSON ref: `canManagePermissions`
 * @param {?} context Rule execution context
 * @return {?}
 */
function canManagePermissions(context) {
  return [canUpdateSelectedNode(context), isNotTrashcan(context)].every(
    Boolean
  );
}
/**
 * Checks if user can toggle **Edit Offline** mode for selected node.
 * JSON ref: `canToggleEditOffline`
 * @param {?} context Rule execution context
 * @return {?}
 */
function canToggleEditOffline(context) {
  return [
    hasFileSelected(context),
    isNotTrashcan(context),
    canLockFile(context) || canUnlockFile(context)
  ].every(Boolean);
}
/**
 * @deprecated Uses workarounds for for recent files and search api issues.
 * Checks if user can toggle **Favorite** state for a node.
 * @param {?} context Rule execution context
 * @return {?}
 */
function canToggleFavorite(context) {
  return [
    [canAddFavorite(context), canRemoveFavorite(context)].some(Boolean),
    [
      isRecentFiles(context),
      isSharedFiles(context),
      isSearchResults(context),
      isFavorites(context)
    ].some(Boolean)
  ].every(Boolean);
}
/**
 * Checks if application should render language picker menu.
 * JSON ref: `canShowLanguagePicker`
 * @param {?} context Rule execution context
 * @return {?}
 */
function canShowLanguagePicker(context) {
  return context.languagePicker;
}
/**
 * Checks if application should render logout option.
 * JSON ref: `canShowLogout`
 * @param {?} context Rule execution context
 * @return {?}
 */
function canShowLogout(context) {
  return !context.withCredentials;
}
/**
 * Checks if application should render process services extension.
 * JSON ref: `canShowProcessServices`
 * @param {?} context Rule execution context
 * @return {?}
 */
function canShowProcessServices(context) {
  return context.processServices;
}

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
/**
 * Checks if user is admin.
 * JSON ref: `user.isAdmin`
 * @param {?} context
 * @return {?}
 */
function isAdmin(context) {
  return context.profile.isAdmin;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export {
  canCopyNode,
  canAddFavorite,
  canRemoveFavorite,
  canShareFile,
  canToggleJoinLibrary,
  canEditFolder,
  isShared,
  canDeleteSelection,
  canUnshareNodes,
  hasSelection,
  canCreateFolder,
  canUpload,
  canDownloadSelection,
  hasFolderSelected,
  hasLibrarySelected,
  isPrivateLibrary,
  hasLibraryRole,
  hasNoLibraryRole,
  hasFileSelected,
  canUpdateSelectedNode,
  canUpdateSelectedFolder,
  hasLockedFiles,
  isWriteLocked,
  isUserWriteLockOwner,
  canLockFile,
  canUnlockFile,
  canUploadVersion,
  isTrashcanItemSelected,
  canViewFile,
  canLeaveLibrary,
  canToggleSharedLink,
  canShowInfoDrawer,
  canManageFileVersions,
  canManagePermissions,
  canToggleEditOffline,
  canToggleFavorite,
  canShowLanguagePicker,
  canShowLogout,
  canShowProcessServices,
  isPreview,
  isFavorites,
  isNotFavorites,
  isSharedFiles,
  isNotSharedFiles,
  isTrashcan,
  isNotTrashcan,
  isPersonalFiles,
  isLibraryFiles,
  isLibraries,
  isNotLibraries,
  isRecentFiles,
  isNotRecentFiles,
  isSearchResults,
  isNotSearchResults,
  isSharedPreview,
  isFavoritesPreview,
  isSharedFileViewer,
  hasQuickShareEnabled,
  isAdmin
};

//# sourceMappingURL=alfresco-aca-shared-rules.js.map
