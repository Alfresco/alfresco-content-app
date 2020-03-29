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
import * as navigation from './navigation.rules';
import * as repository from './repository.rules';
/**
 * @record
 */
export function AcaRuleContext() {}
if (false) {
  /** @type {?} */
  AcaRuleContext.prototype.languagePicker;
  /** @type {?} */
  AcaRuleContext.prototype.withCredentials;
  /** @type {?} */
  AcaRuleContext.prototype.processServices;
}
/**
 * Checks if user can copy selected node.
 * JSON ref: `app.canCopyNode`
 * @param {?} context Rule execution context
 * @return {?}
 */
export function canCopyNode(context) {
  return [
    hasSelection(context),
    navigation.isNotTrashcan(context),
    navigation.isNotLibraries(context)
  ].every(Boolean);
}
/**
 * Checks if user can mark selected nodes as **Favorite**.
 * JSON ref: `app.selection.canAddFavorite`
 * @param {?} context
 * @return {?}
 */
export function canAddFavorite(context) {
  if (!context.selection.isEmpty) {
    if (
      navigation.isFavorites(context) ||
      navigation.isLibraries(context) ||
      navigation.isTrashcan(context)
    ) {
      return false;
    }
    return context.selection.nodes.some(function(node) {
      return !node.entry.isFavorite;
    });
  }
  return false;
}
/**
 * Checks if user can un-mark selected nodes as **Favorite**.
 * JSON ref: `app.selection.canRemoveFavorite`
 * @param {?} context
 * @return {?}
 */
export function canRemoveFavorite(context) {
  if (!context.selection.isEmpty && !navigation.isTrashcan(context)) {
    if (navigation.isFavorites(context)) {
      return true;
    }
    return context.selection.nodes.every(function(node) {
      return node.entry.isFavorite;
    });
  }
  return false;
}
/**
 * Checks if user can share selected file.
 * JSON ref: `app.selection.file.canShare`
 * @param {?} context
 * @return {?}
 */
export function canShareFile(context) {
  return [
    context.selection.file,
    navigation.isNotTrashcan(context),
    repository.hasQuickShareEnabled(context),
    !isShared(context)
  ].every(Boolean);
}
/**
 * Checks if user can perform "Join" or "Cancel Join Request" on a library.
 * JSON ref: `canToggleJoinLibrary`
 * @param {?} context
 * @return {?}
 */
export function canToggleJoinLibrary(context) {
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
export function canEditFolder(context) {
  return [
    canUpdateSelectedFolder(context),
    navigation.isNotTrashcan(context)
  ].every(Boolean);
}
/**
 * Checks if the selected file is already shared.
 * JSON ref: `app.selection.file.isShared`
 * @param {?} context
 * @return {?}
 */
export function isShared(context) {
  if (navigation.isSharedFiles(context) && context.selection.file) {
    return true;
  }
  if (
    (navigation.isNotTrashcan(context),
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
export function canDeleteSelection(context) {
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
 * @param {?} context
 * @return {?}
 */
export function canUnshareNodes(context) {
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
export function hasSelection(context) {
  return !context.selection.isEmpty;
}
/**
 * Checks if user can create a new folder with current path.
 * JSON ref: `app.navigation.folder.canCreate`
 * @param {?} context
 * @return {?}
 */
export function canCreateFolder(context) {
  var currentFolder = context.navigation.currentFolder;
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
export function canUpload(context) {
  var currentFolder = context.navigation.currentFolder;
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
export function canDownloadSelection(context) {
  if (!context.selection.isEmpty && navigation.isNotTrashcan(context)) {
    return context.selection.nodes.every(function(node) {
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
export function hasFolderSelected(context) {
  /** @type {?} */
  var folder = context.selection.folder;
  return folder ? true : false;
}
/**
 * Checks if user has selected a library (site).
 * JSON ref: `app.selection.library`
 * @param {?} context
 * @return {?}
 */
export function hasLibrarySelected(context) {
  /** @type {?} */
  var library = context.selection.library;
  return library ? true : false;
}
/**
 * Checks if user has selected a **private** library (site)
 * JSON ref: `app.selection.isPrivateLibrary`
 * @param {?} context
 * @return {?}
 */
export function isPrivateLibrary(context) {
  /** @type {?} */
  var library = context.selection.library;
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
export function hasLibraryRole(context) {
  /** @type {?} */
  var library = context.selection.library;
  return library ? !!(library.entry && library.entry.role) : false;
}
/**
 * Checks if the selected library has no **role** property defined.
 * JSON ref: `app.selection.hasNoLibraryRole`
 * @param {?} context
 * @return {?}
 */
export function hasNoLibraryRole(context) {
  return !hasLibraryRole(context);
}
/**
 * Checks if user has selected a file.
 * JSON ref: `app.selection.file`
 * @param {?} context
 * @return {?}
 */
export function hasFileSelected(context) {
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
export function canUpdateSelectedNode(context) {
  if (context.selection && !context.selection.isEmpty) {
    /** @type {?} */
    var node = context.selection.first;
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
export function canUpdateSelectedFolder(context) {
  var folder = context.selection.folder;
  if (folder) {
    return (
      // workaround for Favorites Api
      navigation.isFavorites(context) ||
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
export function hasLockedFiles(context) {
  if (context && context.selection && context.selection.nodes) {
    return context.selection.nodes.some(function(node) {
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
export function isWriteLocked(context) {
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
export function isUserWriteLockOwner(context) {
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
export function canLockFile(context) {
  return !isWriteLocked(context) && canUpdateSelectedNode(context);
}
/**
 * Checks if user can unlock selected file.
 * JSON ref: `app.selection.file.canUnlock`
 * @param {?} context
 * @return {?}
 */
export function canUnlockFile(context) {
  var file = context.selection.file;
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
export function canUploadVersion(context) {
  if (navigation.isFavorites(context) || navigation.isSharedFiles(context)) {
    return hasFileSelected(context);
  }
  return [
    hasFileSelected(context),
    navigation.isNotTrashcan(context),
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
export function isTrashcanItemSelected(context) {
  return [navigation.isTrashcan(context), hasSelection(context)].every(Boolean);
}
/**
 * Checks if user can view the file.
 * JSON ref: `canViewFile`
 * @param {?} context Rule execution context
 * @return {?}
 */
export function canViewFile(context) {
  return [hasFileSelected(context), navigation.isNotTrashcan(context)].every(
    Boolean
  );
}
/**
 * Checks if user can **Leave** selected library.
 * JSON ref: `canLeaveLibrary`
 * @param {?} context Rule execution context
 * @return {?}
 */
export function canLeaveLibrary(context) {
  return [hasLibrarySelected(context), hasLibraryRole(context)].every(Boolean);
}
/**
 * Checks if user can toggle shared link mode.
 * JSON ref: `canToggleSharedLink`
 * @param {?} context Rule execution context
 * @return {?}
 */
export function canToggleSharedLink(context) {
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
export function canShowInfoDrawer(context) {
  return [
    hasSelection(context),
    navigation.isNotLibraries(context),
    navigation.isNotTrashcan(context)
  ].every(Boolean);
}
/**
 * Checks if user can manage file versions for the selected node.
 * JSON ref: `canManageFileVersions`
 * @param {?} context Rule execution context
 * @return {?}
 */
export function canManageFileVersions(context) {
  return [
    hasFileSelected(context),
    navigation.isNotTrashcan(context),
    !hasLockedFiles(context)
  ].every(Boolean);
}
/**
 * Checks if user can manage permissions for the selected node.
 * JSON ref: `canManagePermissions`
 * @param {?} context Rule execution context
 * @return {?}
 */
export function canManagePermissions(context) {
  return [
    canUpdateSelectedNode(context),
    navigation.isNotTrashcan(context)
  ].every(Boolean);
}
/**
 * Checks if user can toggle **Edit Offline** mode for selected node.
 * JSON ref: `canToggleEditOffline`
 * @param {?} context Rule execution context
 * @return {?}
 */
export function canToggleEditOffline(context) {
  return [
    hasFileSelected(context),
    navigation.isNotTrashcan(context),
    canLockFile(context) || canUnlockFile(context)
  ].every(Boolean);
}
/**
 * @deprecated Uses workarounds for for recent files and search api issues.
 * Checks if user can toggle **Favorite** state for a node.
 * @param {?} context Rule execution context
 * @return {?}
 */
export function canToggleFavorite(context) {
  return [
    [canAddFavorite(context), canRemoveFavorite(context)].some(Boolean),
    [
      navigation.isRecentFiles(context),
      navigation.isSharedFiles(context),
      navigation.isSearchResults(context),
      navigation.isFavorites(context)
    ].some(Boolean)
  ].every(Boolean);
}
/**
 * Checks if application should render language picker menu.
 * JSON ref: `canShowLanguagePicker`
 * @param {?} context Rule execution context
 * @return {?}
 */
export function canShowLanguagePicker(context) {
  return context.languagePicker;
}
/**
 * Checks if application should render logout option.
 * JSON ref: `canShowLogout`
 * @param {?} context Rule execution context
 * @return {?}
 */
export function canShowLogout(context) {
  return !context.withCredentials;
}
/**
 * Checks if application should render process services extension.
 * JSON ref: `canShowProcessServices`
 * @param {?} context Rule execution context
 * @return {?}
 */
export function canShowProcessServices(context) {
  return context.processServices;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnJ1bGVzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FjYS1zaGFyZWQvcnVsZXMvIiwic291cmNlcyI6WyJhcHAucnVsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxPQUFPLEtBQUssVUFBVSxNQUFNLG9CQUFvQixDQUFDO0FBQ2pELE9BQU8sS0FBSyxVQUFVLE1BQU0sb0JBQW9CLENBQUM7Ozs7QUFFakQsb0NBSUM7OztJQUhDLHdDQUF3Qjs7SUFDeEIseUNBQXlCOztJQUN6Qix5Q0FBeUI7Ozs7Ozs7O0FBUTNCLE1BQU0sVUFBVSxXQUFXLENBQUMsT0FBb0I7SUFDOUMsT0FBTztRQUNMLFlBQVksQ0FBQyxPQUFPLENBQUM7UUFDckIsVUFBVSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFDakMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUM7S0FDbkMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbkIsQ0FBQzs7Ozs7OztBQU1ELE1BQU0sVUFBVSxjQUFjLENBQUMsT0FBb0I7SUFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO1FBQzlCLElBQ0UsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUM7WUFDL0IsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUM7WUFDL0IsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFDOUI7WUFDQSxPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUF0QixDQUFzQixDQUFDLENBQUM7S0FDckU7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7Ozs7Ozs7QUFNRCxNQUFNLFVBQVUsaUJBQWlC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UUFDakMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLGFBQWEsQ0FBQyxPQUFPLENBQUM7S0FDL0MsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbkIsQ0FBQzs7Ozs7OztBQU9ELE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxPQUFvQjtJQUNwRCxPQUFPO1FBQ0wsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUUsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ25FO1lBQ0UsVUFBVSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7WUFDakMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7WUFDakMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUM7WUFDbkMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUM7U0FDaEMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQ2hCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ25CLENBQUM7Ozs7Ozs7QUFPRCxNQUFNLFVBQVUscUJBQXFCLENBQUMsT0FBdUI7SUFDM0QsT0FBTyxPQUFPLENBQUMsY0FBYyxDQUFDO0FBQ2hDLENBQUM7Ozs7Ozs7QUFPRCxNQUFNLFVBQVUsYUFBYSxDQUFDLE9BQXVCO0lBQ25ELE9BQU8sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDO0FBQ2xDLENBQUM7Ozs7Ozs7QUFPRCxNQUFNLFVBQVUsc0JBQXNCLENBQUMsT0FBdUI7SUFDNUQsT0FBTyxPQUFPLENBQUMsZUFBZSxDQUFDO0FBQ2pDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb25cbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDUgLSAyMDIwIEFsZnJlc2NvIFNvZnR3YXJlIExpbWl0ZWRcbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uLlxuICogSWYgdGhlIHNvZnR3YXJlIHdhcyBwdXJjaGFzZWQgdW5kZXIgYSBwYWlkIEFsZnJlc2NvIGxpY2Vuc2UsIHRoZSB0ZXJtcyBvZlxuICogdGhlIHBhaWQgbGljZW5zZSBhZ3JlZW1lbnQgd2lsbCBwcmV2YWlsLiAgT3RoZXJ3aXNlLCB0aGUgc29mdHdhcmUgaXNcbiAqIHByb3ZpZGVkIHVuZGVyIHRoZSBmb2xsb3dpbmcgb3BlbiBzb3VyY2UgbGljZW5zZSB0ZXJtczpcbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBbGZyZXNjby4gSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IFJ1bGVDb250ZXh0IH0gZnJvbSAnQGFsZnJlc2NvL2FkZi1leHRlbnNpb25zJztcbmltcG9ydCAqIGFzIG5hdmlnYXRpb24gZnJvbSAnLi9uYXZpZ2F0aW9uLnJ1bGVzJztcbmltcG9ydCAqIGFzIHJlcG9zaXRvcnkgZnJvbSAnLi9yZXBvc2l0b3J5LnJ1bGVzJztcblxuZXhwb3J0IGludGVyZmFjZSBBY2FSdWxlQ29udGV4dCBleHRlbmRzIFJ1bGVDb250ZXh0IHtcbiAgbGFuZ3VhZ2VQaWNrZXI6IGJvb2xlYW47XG4gIHdpdGhDcmVkZW50aWFsczogYm9vbGVhbjtcbiAgcHJvY2Vzc1NlcnZpY2VzOiBib29sZWFuO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB1c2VyIGNhbiBjb3B5IHNlbGVjdGVkIG5vZGUuXG4gKiBKU09OIHJlZjogYGFwcC5jYW5Db3B5Tm9kZWBcbiAqIEBwYXJhbSBjb250ZXh0IFJ1bGUgZXhlY3V0aW9uIGNvbnRleHRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbkNvcHlOb2RlKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIHJldHVybiBbXG4gICAgaGFzU2VsZWN0aW9uKGNvbnRleHQpLFxuICAgIG5hdmlnYXRpb24uaXNOb3RUcmFzaGNhbihjb250ZXh0KSxcbiAgICBuYXZpZ2F0aW9uLmlzTm90TGlicmFyaWVzKGNvbnRleHQpXG4gIF0uZXZlcnkoQm9vbGVhbik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHVzZXIgY2FuIG1hcmsgc2VsZWN0ZWQgbm9kZXMgYXMgKipGYXZvcml0ZSoqLlxuICogSlNPTiByZWY6IGBhcHAuc2VsZWN0aW9uLmNhbkFkZEZhdm9yaXRlYFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuQWRkRmF2b3JpdGUoY29udGV4dDogUnVsZUNvbnRleHQpOiBib29sZWFuIHtcbiAgaWYgKCFjb250ZXh0LnNlbGVjdGlvbi5pc0VtcHR5KSB7XG4gICAgaWYgKFxuICAgICAgbmF2aWdhdGlvbi5pc0Zhdm9yaXRlcyhjb250ZXh0KSB8fFxuICAgICAgbmF2aWdhdGlvbi5pc0xpYnJhcmllcyhjb250ZXh0KSB8fFxuICAgICAgbmF2aWdhdGlvbi5pc1RyYXNoY2FuKGNvbnRleHQpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBjb250ZXh0LnNlbGVjdGlvbi5ub2Rlcy5zb21lKG5vZGUgPT4gIW5vZGUuZW50cnkuaXNGYXZvcml0ZSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB1c2VyIGNhbiB1bi1tYXJrIHNlbGVjdGVkIG5vZGVzIGFzICoqRmF2b3JpdGUqKi5cbiAqIEpTT04gcmVmOiBgYXBwLnNlbGVjdGlvbi5jYW5SZW1vdmVGYXZvcml0ZWBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhblJlbW92ZUZhdm9yaXRlKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIGlmICghY29udGV4dC5zZWxlY3Rpb24uaXNFbXB0eSAmJiAhbmF2aWdhdGlvbi5pc1RyYXNoY2FuKGNvbnRleHQpKSB7XG4gICAgaWYgKG5hdmlnYXRpb24uaXNGYXZvcml0ZXMoY29udGV4dCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gY29udGV4dC5zZWxlY3Rpb24ubm9kZXMuZXZlcnkobm9kZSA9PiBub2RlLmVudHJ5LmlzRmF2b3JpdGUpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdXNlciBjYW4gc2hhcmUgc2VsZWN0ZWQgZmlsZS5cbiAqIEpTT04gcmVmOiBgYXBwLnNlbGVjdGlvbi5maWxlLmNhblNoYXJlYFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuU2hhcmVGaWxlKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIHJldHVybiBbXG4gICAgY29udGV4dC5zZWxlY3Rpb24uZmlsZSxcbiAgICBuYXZpZ2F0aW9uLmlzTm90VHJhc2hjYW4oY29udGV4dCksXG4gICAgcmVwb3NpdG9yeS5oYXNRdWlja1NoYXJlRW5hYmxlZChjb250ZXh0KSxcbiAgICAhaXNTaGFyZWQoY29udGV4dClcbiAgXS5ldmVyeShCb29sZWFuKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdXNlciBjYW4gcGVyZm9ybSBcIkpvaW5cIiBvciBcIkNhbmNlbCBKb2luIFJlcXVlc3RcIiBvbiBhIGxpYnJhcnkuXG4gKiBKU09OIHJlZjogYGNhblRvZ2dsZUpvaW5MaWJyYXJ5YFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuVG9nZ2xlSm9pbkxpYnJhcnkoY29udGV4dDogUnVsZUNvbnRleHQpOiBib29sZWFuIHtcbiAgcmV0dXJuIFtcbiAgICBoYXNMaWJyYXJ5U2VsZWN0ZWQoY29udGV4dCksXG4gICAgIWlzUHJpdmF0ZUxpYnJhcnkoY29udGV4dCksXG4gICAgaGFzTm9MaWJyYXJ5Um9sZShjb250ZXh0KVxuICBdLmV2ZXJ5KEJvb2xlYW4pO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB1c2VyIGNhbiBlZGl0IHRoZSBzZWxlY3RlZCBmb2xkZXIuXG4gKiBKU09OIHJlZjogYGNhbkVkaXRGb2xkZXJgXG4gKiBAcGFyYW0gY29udGV4dCBSdWxlIGV4ZWN1dGlvbiBjb250ZXh0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5FZGl0Rm9sZGVyKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIHJldHVybiBbXG4gICAgY2FuVXBkYXRlU2VsZWN0ZWRGb2xkZXIoY29udGV4dCksXG4gICAgbmF2aWdhdGlvbi5pc05vdFRyYXNoY2FuKGNvbnRleHQpXG4gIF0uZXZlcnkoQm9vbGVhbik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBzZWxlY3RlZCBmaWxlIGlzIGFscmVhZHkgc2hhcmVkLlxuICogSlNPTiByZWY6IGBhcHAuc2VsZWN0aW9uLmZpbGUuaXNTaGFyZWRgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1NoYXJlZChjb250ZXh0OiBSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICBpZiAobmF2aWdhdGlvbi5pc1NoYXJlZEZpbGVzKGNvbnRleHQpICYmIGNvbnRleHQuc2VsZWN0aW9uLmZpbGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChcbiAgICAobmF2aWdhdGlvbi5pc05vdFRyYXNoY2FuKGNvbnRleHQpLFxuICAgICFjb250ZXh0LnNlbGVjdGlvbi5pc0VtcHR5ICYmIGNvbnRleHQuc2VsZWN0aW9uLmZpbGUpXG4gICkge1xuICAgIHJldHVybiAhIShcbiAgICAgIGNvbnRleHQuc2VsZWN0aW9uLmZpbGUuZW50cnkgJiZcbiAgICAgIGNvbnRleHQuc2VsZWN0aW9uLmZpbGUuZW50cnkucHJvcGVydGllcyAmJlxuICAgICAgY29udGV4dC5zZWxlY3Rpb24uZmlsZS5lbnRyeS5wcm9wZXJ0aWVzWydxc2hhcmU6c2hhcmVkSWQnXVxuICAgICk7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHVzZXIgY2FuIGRlbGV0ZSBzZWxlY3RlZCBub2Rlcy5cbiAqIEpTT04gcmVmOiBgYXBwLnNlbGVjdGlvbi5jYW5EZWxldGVgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5EZWxldGVTZWxlY3Rpb24oY29udGV4dDogUnVsZUNvbnRleHQpOiBib29sZWFuIHtcbiAgaWYgKFxuICAgIG5hdmlnYXRpb24uaXNOb3RUcmFzaGNhbihjb250ZXh0KSAmJlxuICAgIG5hdmlnYXRpb24uaXNOb3RMaWJyYXJpZXMoY29udGV4dCkgJiZcbiAgICBuYXZpZ2F0aW9uLmlzTm90U2VhcmNoUmVzdWx0cyhjb250ZXh0KSAmJlxuICAgICFjb250ZXh0LnNlbGVjdGlvbi5pc0VtcHR5XG4gICkge1xuICAgIGlmIChoYXNMb2NrZWRGaWxlcyhjb250ZXh0KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIHRlbXAgd29ya2Fyb3VuZCBmb3IgRmF2b3JpdGVzIGFwaVxuICAgIGlmIChuYXZpZ2F0aW9uLmlzRmF2b3JpdGVzKGNvbnRleHQpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAobmF2aWdhdGlvbi5pc1ByZXZpZXcoY29udGV4dCkpIHtcbiAgICAgIHJldHVybiBjb250ZXh0LnBlcm1pc3Npb25zLmNoZWNrKGNvbnRleHQuc2VsZWN0aW9uLm5vZGVzLCBbJ2RlbGV0ZSddKTtcbiAgICB9XG5cbiAgICAvLyB3b3JrYXJvdW5kIGZvciBTaGFyZWQgRmlsZXNcbiAgICBpZiAobmF2aWdhdGlvbi5pc1NoYXJlZEZpbGVzKGNvbnRleHQpKSB7XG4gICAgICByZXR1cm4gY29udGV4dC5wZXJtaXNzaW9ucy5jaGVjayhjb250ZXh0LnNlbGVjdGlvbi5ub2RlcywgWydkZWxldGUnXSwge1xuICAgICAgICB0YXJnZXQ6ICdhbGxvd2FibGVPcGVyYXRpb25zT25UYXJnZXQnXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGV4dC5wZXJtaXNzaW9ucy5jaGVjayhjb250ZXh0LnNlbGVjdGlvbi5ub2RlcywgWydkZWxldGUnXSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB1c2VyIGNhbiB1bi1zaGFyZSBzZWxlY3RlZCBub2Rlcy5cbiAqIEpTT04gcmVmOiBgYXBwLnNlbGVjdGlvbi5jYW5VbnNoYXJlYFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuVW5zaGFyZU5vZGVzKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIGlmICghY29udGV4dC5zZWxlY3Rpb24uaXNFbXB0eSkge1xuICAgIHJldHVybiBjb250ZXh0LnBlcm1pc3Npb25zLmNoZWNrKGNvbnRleHQuc2VsZWN0aW9uLm5vZGVzLCBbJ2RlbGV0ZSddLCB7XG4gICAgICB0YXJnZXQ6ICdhbGxvd2FibGVPcGVyYXRpb25zT25UYXJnZXQnXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB1c2VyIHNlbGVjdGVkIGFueXRoaW5nLlxuICogSlNPTiByZWY6IGBhcHAuc2VsZWN0aW9uLm5vdEVtcHR5YFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzU2VsZWN0aW9uKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIHJldHVybiAhY29udGV4dC5zZWxlY3Rpb24uaXNFbXB0eTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdXNlciBjYW4gY3JlYXRlIGEgbmV3IGZvbGRlciB3aXRoIGN1cnJlbnQgcGF0aC5cbiAqIEpTT04gcmVmOiBgYXBwLm5hdmlnYXRpb24uZm9sZGVyLmNhbkNyZWF0ZWBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbkNyZWF0ZUZvbGRlcihjb250ZXh0OiBSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICBjb25zdCB7IGN1cnJlbnRGb2xkZXIgfSA9IGNvbnRleHQubmF2aWdhdGlvbjtcbiAgaWYgKGN1cnJlbnRGb2xkZXIpIHtcbiAgICByZXR1cm4gY29udGV4dC5wZXJtaXNzaW9ucy5jaGVjayhjdXJyZW50Rm9sZGVyLCBbJ2NyZWF0ZSddKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHVzZXIgY2FuIHVwbG9hZCBjb250ZW50IHRvIGN1cnJlbnQgZm9sZGVyLlxuICogSlNPTiByZWY6IGBhcHAubmF2aWdhdGlvbi5mb2xkZXIuY2FuVXBsb2FkYFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuVXBsb2FkKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIGNvbnN0IHsgY3VycmVudEZvbGRlciB9ID0gY29udGV4dC5uYXZpZ2F0aW9uO1xuICBpZiAoY3VycmVudEZvbGRlcikge1xuICAgIHJldHVybiBjb250ZXh0LnBlcm1pc3Npb25zLmNoZWNrKGN1cnJlbnRGb2xkZXIsIFsnY3JlYXRlJ10pO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdXNlciBjYW4gZG93bmxvYWQgc2VsZWN0ZWQgbm9kZXMgKGVpdGhlciBmaWxlcyBvciBmb2xkZXJzKS5cbiAqIEpTT04gcmVmOiBgYXBwLnNlbGVjdGlvbi5jYW5Eb3dubG9hZGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbkRvd25sb2FkU2VsZWN0aW9uKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIGlmICghY29udGV4dC5zZWxlY3Rpb24uaXNFbXB0eSAmJiBuYXZpZ2F0aW9uLmlzTm90VHJhc2hjYW4oY29udGV4dCkpIHtcbiAgICByZXR1cm4gY29udGV4dC5zZWxlY3Rpb24ubm9kZXMuZXZlcnkoKG5vZGU6IGFueSkgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgbm9kZS5lbnRyeSAmJlxuICAgICAgICAobm9kZS5lbnRyeS5pc0ZpbGUgfHwgbm9kZS5lbnRyeS5pc0ZvbGRlciB8fCAhIW5vZGUuZW50cnkubm9kZUlkKVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHVzZXIgaGFzIHNlbGVjdGVkIGEgZm9sZGVyLlxuICogSlNPTiByZWY6IGBhcHAuc2VsZWN0aW9uLmZvbGRlcmBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc0ZvbGRlclNlbGVjdGVkKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIGNvbnN0IGZvbGRlciA9IGNvbnRleHQuc2VsZWN0aW9uLmZvbGRlcjtcbiAgcmV0dXJuIGZvbGRlciA/IHRydWUgOiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdXNlciBoYXMgc2VsZWN0ZWQgYSBsaWJyYXJ5IChzaXRlKS5cbiAqIEpTT04gcmVmOiBgYXBwLnNlbGVjdGlvbi5saWJyYXJ5YFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzTGlicmFyeVNlbGVjdGVkKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIGNvbnN0IGxpYnJhcnkgPSBjb250ZXh0LnNlbGVjdGlvbi5saWJyYXJ5O1xuICByZXR1cm4gbGlicmFyeSA/IHRydWUgOiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdXNlciBoYXMgc2VsZWN0ZWQgYSAqKnByaXZhdGUqKiBsaWJyYXJ5IChzaXRlKVxuICogSlNPTiByZWY6IGBhcHAuc2VsZWN0aW9uLmlzUHJpdmF0ZUxpYnJhcnlgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1ByaXZhdGVMaWJyYXJ5KGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIGNvbnN0IGxpYnJhcnkgPSBjb250ZXh0LnNlbGVjdGlvbi5saWJyYXJ5O1xuICByZXR1cm4gbGlicmFyeVxuICAgID8gISEoXG4gICAgICAgIGxpYnJhcnkuZW50cnkgJiZcbiAgICAgICAgbGlicmFyeS5lbnRyeS52aXNpYmlsaXR5ICYmXG4gICAgICAgIGxpYnJhcnkuZW50cnkudmlzaWJpbGl0eSA9PT0gJ1BSSVZBVEUnXG4gICAgICApXG4gICAgOiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIHNlbGVjdGVkIGxpYnJhcnkgaGFzIGEgKipyb2xlKiogcHJvcGVydHkgZGVmaW5lZC5cbiAqIEpTT04gcmVmOiBgYXBwLnNlbGVjdGlvbi5oYXNMaWJyYXJ5Um9sZWBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc0xpYnJhcnlSb2xlKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIGNvbnN0IGxpYnJhcnkgPSBjb250ZXh0LnNlbGVjdGlvbi5saWJyYXJ5O1xuICByZXR1cm4gbGlicmFyeSA/ICEhKGxpYnJhcnkuZW50cnkgJiYgbGlicmFyeS5lbnRyeS5yb2xlKSA6IGZhbHNlO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgc2VsZWN0ZWQgbGlicmFyeSBoYXMgbm8gKipyb2xlKiogcHJvcGVydHkgZGVmaW5lZC5cbiAqIEpTT04gcmVmOiBgYXBwLnNlbGVjdGlvbi5oYXNOb0xpYnJhcnlSb2xlYFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzTm9MaWJyYXJ5Um9sZShjb250ZXh0OiBSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICByZXR1cm4gIWhhc0xpYnJhcnlSb2xlKGNvbnRleHQpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB1c2VyIGhhcyBzZWxlY3RlZCBhIGZpbGUuXG4gKiBKU09OIHJlZjogYGFwcC5zZWxlY3Rpb24uZmlsZWBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc0ZpbGVTZWxlY3RlZChjb250ZXh0OiBSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICBpZiAoY29udGV4dCAmJiBjb250ZXh0LnNlbGVjdGlvbiAmJiBjb250ZXh0LnNlbGVjdGlvbi5maWxlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB1c2VyIGNhbiB1cGRhdGUgdGhlIGZpcnN0IHNlbGVjdGVkIG5vZGUuXG4gKiBKU09OIHJlZjogYGFwcC5zZWxlY3Rpb24uZmlyc3QuY2FuVXBkYXRlYFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuVXBkYXRlU2VsZWN0ZWROb2RlKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIGlmIChjb250ZXh0LnNlbGVjdGlvbiAmJiAhY29udGV4dC5zZWxlY3Rpb24uaXNFbXB0eSkge1xuICAgIGNvbnN0IG5vZGUgPSBjb250ZXh0LnNlbGVjdGlvbi5maXJzdDtcblxuICAgIGlmIChub2RlLmVudHJ5LmlzRmlsZSAmJiBoYXNMb2NrZWRGaWxlcyhjb250ZXh0KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBjb250ZXh0LnBlcm1pc3Npb25zLmNoZWNrKG5vZGUsIFsndXBkYXRlJ10pO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdXNlciBjYW4gdXBkYXRlIHRoZSBmaXJzdCBzZWxlY3RlZCBmb2xkZXIuXG4gKiBKU09OIHJlZjogYGFwcC5zZWxlY3Rpb24uZm9sZGVyLmNhblVwZGF0ZWBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhblVwZGF0ZVNlbGVjdGVkRm9sZGVyKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIGNvbnN0IHsgZm9sZGVyIH0gPSBjb250ZXh0LnNlbGVjdGlvbjtcbiAgaWYgKGZvbGRlcikge1xuICAgIHJldHVybiAoXG4gICAgICAvLyB3b3JrYXJvdW5kIGZvciBGYXZvcml0ZXMgQXBpXG4gICAgICBuYXZpZ2F0aW9uLmlzRmF2b3JpdGVzKGNvbnRleHQpIHx8XG4gICAgICBjb250ZXh0LnBlcm1pc3Npb25zLmNoZWNrKGZvbGRlci5lbnRyeSwgWyd1cGRhdGUnXSlcbiAgICApO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdXNlciBoYXMgc2VsZWN0ZWQgYSAqKmxvY2tlZCoqIGZpbGUgbm9kZS5cbiAqIEpTT04gcmVmOiBgYXBwLnNlbGVjdGlvbi5maWxlLmlzTG9ja2VkYFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzTG9ja2VkRmlsZXMoY29udGV4dDogUnVsZUNvbnRleHQpOiBib29sZWFuIHtcbiAgaWYgKGNvbnRleHQgJiYgY29udGV4dC5zZWxlY3Rpb24gJiYgY29udGV4dC5zZWxlY3Rpb24ubm9kZXMpIHtcbiAgICByZXR1cm4gY29udGV4dC5zZWxlY3Rpb24ubm9kZXMuc29tZShub2RlID0+IHtcbiAgICAgIGlmICghbm9kZS5lbnRyeS5pc0ZpbGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICBub2RlLmVudHJ5LmlzTG9ja2VkIHx8XG4gICAgICAgIChub2RlLmVudHJ5LnByb3BlcnRpZXMgJiZcbiAgICAgICAgICBub2RlLmVudHJ5LnByb3BlcnRpZXNbJ2NtOmxvY2tUeXBlJ10gPT09ICdSRUFEX09OTFlfTE9DSycpXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgc2VsZWN0ZWQgZmlsZSBoYXMgKip3cml0ZSoqIG9yICoqcmVhZC1vbmx5KiogbG9ja3Mgc3BlY2lmaWVkLlxuICogSlNPTiByZWY6IGBhcHAuc2VsZWN0aW9uLmZpbGUuaXNMb2NrZWRgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1dyaXRlTG9ja2VkKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIHJldHVybiAhIShcbiAgICBjb250ZXh0ICYmXG4gICAgY29udGV4dC5zZWxlY3Rpb24gJiZcbiAgICBjb250ZXh0LnNlbGVjdGlvbi5maWxlICYmXG4gICAgY29udGV4dC5zZWxlY3Rpb24uZmlsZS5lbnRyeSAmJlxuICAgIGNvbnRleHQuc2VsZWN0aW9uLmZpbGUuZW50cnkucHJvcGVydGllcyAmJlxuICAgIChjb250ZXh0LnNlbGVjdGlvbi5maWxlLmVudHJ5LnByb3BlcnRpZXNbJ2NtOmxvY2tUeXBlJ10gPT09ICdXUklURV9MT0NLJyB8fFxuICAgICAgY29udGV4dC5zZWxlY3Rpb24uZmlsZS5lbnRyeS5wcm9wZXJ0aWVzWydjbTpsb2NrVHlwZSddID09PVxuICAgICAgICAnUkVBRF9PTkxZX0xPQ0snKVxuICApO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgc2VsZWN0ZWQgZmlsZSBoYXMgKip3cml0ZSoqIG9yICoqcmVhZC1vbmx5KiogbG9ja3Mgc3BlY2lmaWVkLFxuICogYW5kIHRoYXQgY3VycmVudCB1c2VyIGlzIHRoZSBvd25lciBvZiB0aGUgbG9jay5cbiAqIEpTT04gcmVmOiBgYXBwLnNlbGVjdGlvbi5maWxlLmlzTG9ja093bmVyYFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNVc2VyV3JpdGVMb2NrT3duZXIoY29udGV4dDogUnVsZUNvbnRleHQpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICBpc1dyaXRlTG9ja2VkKGNvbnRleHQpICYmXG4gICAgKGNvbnRleHQuc2VsZWN0aW9uLmZpbGUuZW50cnkucHJvcGVydGllc1snY206bG9ja093bmVyJ10gJiZcbiAgICAgIGNvbnRleHQuc2VsZWN0aW9uLmZpbGUuZW50cnkucHJvcGVydGllc1snY206bG9ja093bmVyJ10uaWQgPT09XG4gICAgICAgIGNvbnRleHQucHJvZmlsZS5pZClcbiAgKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdXNlciBjYW4gbG9jayBzZWxlY3RlZCBmaWxlLlxuICogSlNPTiByZWY6IGBhcHAuc2VsZWN0aW9uLmZpbGUuY2FuTG9ja2BcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbkxvY2tGaWxlKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIHJldHVybiAhaXNXcml0ZUxvY2tlZChjb250ZXh0KSAmJiBjYW5VcGRhdGVTZWxlY3RlZE5vZGUoY29udGV4dCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHVzZXIgY2FuIHVubG9jayBzZWxlY3RlZCBmaWxlLlxuICogSlNPTiByZWY6IGBhcHAuc2VsZWN0aW9uLmZpbGUuY2FuVW5sb2NrYFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuVW5sb2NrRmlsZShjb250ZXh0OiBSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICBjb25zdCB7IGZpbGUgfSA9IGNvbnRleHQuc2VsZWN0aW9uO1xuICByZXR1cm4gKFxuICAgIGlzV3JpdGVMb2NrZWQoY29udGV4dCkgJiZcbiAgICAoY29udGV4dC5wZXJtaXNzaW9ucy5jaGVjayhmaWxlLmVudHJ5LCBbJ2RlbGV0ZSddKSB8fFxuICAgICAgaXNVc2VyV3JpdGVMb2NrT3duZXIoY29udGV4dCkpXG4gICk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHVzZXIgY2FuIHVwbG9hZCBhIG5ldyB2ZXJzaW9uIG9mIHRoZSBmaWxlLlxuICogSlNPTiByZWY6IGBhcHAuc2VsZWN0aW9uLmZpbGUuY2FuVXBsb2FkVmVyc2lvbmBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhblVwbG9hZFZlcnNpb24oY29udGV4dDogUnVsZUNvbnRleHQpOiBib29sZWFuIHtcbiAgaWYgKG5hdmlnYXRpb24uaXNGYXZvcml0ZXMoY29udGV4dCkgfHwgbmF2aWdhdGlvbi5pc1NoYXJlZEZpbGVzKGNvbnRleHQpKSB7XG4gICAgcmV0dXJuIGhhc0ZpbGVTZWxlY3RlZChjb250ZXh0KTtcbiAgfVxuXG4gIHJldHVybiBbXG4gICAgaGFzRmlsZVNlbGVjdGVkKGNvbnRleHQpLFxuICAgIG5hdmlnYXRpb24uaXNOb3RUcmFzaGNhbihjb250ZXh0KSxcbiAgICBpc1dyaXRlTG9ja2VkKGNvbnRleHQpXG4gICAgICA/IGlzVXNlcldyaXRlTG9ja093bmVyKGNvbnRleHQpXG4gICAgICA6IGNhblVwZGF0ZVNlbGVjdGVkTm9kZShjb250ZXh0KVxuICBdLmV2ZXJ5KEJvb2xlYW4pO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB1c2VyIGhhcyB0cmFzaGNhbiBpdGVtIHNlbGVjdGVkLlxuICogSlNPTiByZWY6IGBpc1RyYXNoY2FuSXRlbVNlbGVjdGVkYFxuICogQHBhcmFtIGNvbnRleHQgUnVsZSBleGVjdXRpb24gY29udGV4dFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNUcmFzaGNhbkl0ZW1TZWxlY3RlZChjb250ZXh0OiBSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICByZXR1cm4gW25hdmlnYXRpb24uaXNUcmFzaGNhbihjb250ZXh0KSwgaGFzU2VsZWN0aW9uKGNvbnRleHQpXS5ldmVyeShCb29sZWFuKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdXNlciBjYW4gdmlldyB0aGUgZmlsZS5cbiAqIEpTT04gcmVmOiBgY2FuVmlld0ZpbGVgXG4gKiBAcGFyYW0gY29udGV4dCBSdWxlIGV4ZWN1dGlvbiBjb250ZXh0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5WaWV3RmlsZShjb250ZXh0OiBSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICByZXR1cm4gW2hhc0ZpbGVTZWxlY3RlZChjb250ZXh0KSwgbmF2aWdhdGlvbi5pc05vdFRyYXNoY2FuKGNvbnRleHQpXS5ldmVyeShcbiAgICBCb29sZWFuXG4gICk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHVzZXIgY2FuICoqTGVhdmUqKiBzZWxlY3RlZCBsaWJyYXJ5LlxuICogSlNPTiByZWY6IGBjYW5MZWF2ZUxpYnJhcnlgXG4gKiBAcGFyYW0gY29udGV4dCBSdWxlIGV4ZWN1dGlvbiBjb250ZXh0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5MZWF2ZUxpYnJhcnkoY29udGV4dDogUnVsZUNvbnRleHQpOiBib29sZWFuIHtcbiAgcmV0dXJuIFtoYXNMaWJyYXJ5U2VsZWN0ZWQoY29udGV4dCksIGhhc0xpYnJhcnlSb2xlKGNvbnRleHQpXS5ldmVyeShCb29sZWFuKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdXNlciBjYW4gdG9nZ2xlIHNoYXJlZCBsaW5rIG1vZGUuXG4gKiBKU09OIHJlZjogYGNhblRvZ2dsZVNoYXJlZExpbmtgXG4gKiBAcGFyYW0gY29udGV4dCBSdWxlIGV4ZWN1dGlvbiBjb250ZXh0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5Ub2dnbGVTaGFyZWRMaW5rKGNvbnRleHQ6IFJ1bGVDb250ZXh0KTogYm9vbGVhbiB7XG4gIHJldHVybiBbXG4gICAgaGFzRmlsZVNlbGVjdGVkKGNvbnRleHQpLFxuICAgIFtjYW5TaGFyZUZpbGUoY29udGV4dCksIGlzU2hhcmVkKGNvbnRleHQpXS5zb21lKEJvb2xlYW4pXG4gIF0uZXZlcnkoQm9vbGVhbik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHVzZXIgY2FuIHNob3cgKipJbmZvIERyYXdlcioqIGZvciB0aGUgc2VsZWN0ZWQgbm9kZS5cbiAqIEpTT04gcmVmOiBgY2FuU2hvd0luZm9EcmF3ZXJgXG4gKiBAcGFyYW0gY29udGV4dCBSdWxlIGV4ZWN1dGlvbiBjb250ZXh0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5TaG93SW5mb0RyYXdlcihjb250ZXh0OiBSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICByZXR1cm4gW1xuICAgIGhhc1NlbGVjdGlvbihjb250ZXh0KSxcbiAgICBuYXZpZ2F0aW9uLmlzTm90TGlicmFyaWVzKGNvbnRleHQpLFxuICAgIG5hdmlnYXRpb24uaXNOb3RUcmFzaGNhbihjb250ZXh0KVxuICBdLmV2ZXJ5KEJvb2xlYW4pO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB1c2VyIGNhbiBtYW5hZ2UgZmlsZSB2ZXJzaW9ucyBmb3IgdGhlIHNlbGVjdGVkIG5vZGUuXG4gKiBKU09OIHJlZjogYGNhbk1hbmFnZUZpbGVWZXJzaW9uc2BcbiAqIEBwYXJhbSBjb250ZXh0IFJ1bGUgZXhlY3V0aW9uIGNvbnRleHRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbk1hbmFnZUZpbGVWZXJzaW9ucyhjb250ZXh0OiBSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICByZXR1cm4gW1xuICAgIGhhc0ZpbGVTZWxlY3RlZChjb250ZXh0KSxcbiAgICBuYXZpZ2F0aW9uLmlzTm90VHJhc2hjYW4oY29udGV4dCksXG4gICAgIWhhc0xvY2tlZEZpbGVzKGNvbnRleHQpXG4gIF0uZXZlcnkoQm9vbGVhbik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHVzZXIgY2FuIG1hbmFnZSBwZXJtaXNzaW9ucyBmb3IgdGhlIHNlbGVjdGVkIG5vZGUuXG4gKiBKU09OIHJlZjogYGNhbk1hbmFnZVBlcm1pc3Npb25zYFxuICogQHBhcmFtIGNvbnRleHQgUnVsZSBleGVjdXRpb24gY29udGV4dFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuTWFuYWdlUGVybWlzc2lvbnMoY29udGV4dDogUnVsZUNvbnRleHQpOiBib29sZWFuIHtcbiAgcmV0dXJuIFtcbiAgICBjYW5VcGRhdGVTZWxlY3RlZE5vZGUoY29udGV4dCksXG4gICAgbmF2aWdhdGlvbi5pc05vdFRyYXNoY2FuKGNvbnRleHQpXG4gIF0uZXZlcnkoQm9vbGVhbik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHVzZXIgY2FuIHRvZ2dsZSAqKkVkaXQgT2ZmbGluZSoqIG1vZGUgZm9yIHNlbGVjdGVkIG5vZGUuXG4gKiBKU09OIHJlZjogYGNhblRvZ2dsZUVkaXRPZmZsaW5lYFxuICogQHBhcmFtIGNvbnRleHQgUnVsZSBleGVjdXRpb24gY29udGV4dFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuVG9nZ2xlRWRpdE9mZmxpbmUoY29udGV4dDogUnVsZUNvbnRleHQpOiBib29sZWFuIHtcbiAgcmV0dXJuIFtcbiAgICBoYXNGaWxlU2VsZWN0ZWQoY29udGV4dCksXG4gICAgbmF2aWdhdGlvbi5pc05vdFRyYXNoY2FuKGNvbnRleHQpLFxuICAgIGNhbkxvY2tGaWxlKGNvbnRleHQpIHx8IGNhblVubG9ja0ZpbGUoY29udGV4dClcbiAgXS5ldmVyeShCb29sZWFuKTtcbn1cblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2VzIHdvcmthcm91bmRzIGZvciBmb3IgcmVjZW50IGZpbGVzIGFuZCBzZWFyY2ggYXBpIGlzc3Vlcy5cbiAqIENoZWNrcyBpZiB1c2VyIGNhbiB0b2dnbGUgKipGYXZvcml0ZSoqIHN0YXRlIGZvciBhIG5vZGUuXG4gKiBAcGFyYW0gY29udGV4dCBSdWxlIGV4ZWN1dGlvbiBjb250ZXh0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5Ub2dnbGVGYXZvcml0ZShjb250ZXh0OiBSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICByZXR1cm4gW1xuICAgIFtjYW5BZGRGYXZvcml0ZShjb250ZXh0KSwgY2FuUmVtb3ZlRmF2b3JpdGUoY29udGV4dCldLnNvbWUoQm9vbGVhbiksXG4gICAgW1xuICAgICAgbmF2aWdhdGlvbi5pc1JlY2VudEZpbGVzKGNvbnRleHQpLFxuICAgICAgbmF2aWdhdGlvbi5pc1NoYXJlZEZpbGVzKGNvbnRleHQpLFxuICAgICAgbmF2aWdhdGlvbi5pc1NlYXJjaFJlc3VsdHMoY29udGV4dCksXG4gICAgICBuYXZpZ2F0aW9uLmlzRmF2b3JpdGVzKGNvbnRleHQpXG4gICAgXS5zb21lKEJvb2xlYW4pXG4gIF0uZXZlcnkoQm9vbGVhbik7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGFwcGxpY2F0aW9uIHNob3VsZCByZW5kZXIgbGFuZ3VhZ2UgcGlja2VyIG1lbnUuXG4gKiBKU09OIHJlZjogYGNhblNob3dMYW5ndWFnZVBpY2tlcmBcbiAqIEBwYXJhbSBjb250ZXh0IFJ1bGUgZXhlY3V0aW9uIGNvbnRleHRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhblNob3dMYW5ndWFnZVBpY2tlcihjb250ZXh0OiBBY2FSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICByZXR1cm4gY29udGV4dC5sYW5ndWFnZVBpY2tlcjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYXBwbGljYXRpb24gc2hvdWxkIHJlbmRlciBsb2dvdXQgb3B0aW9uLlxuICogSlNPTiByZWY6IGBjYW5TaG93TG9nb3V0YFxuICogQHBhcmFtIGNvbnRleHQgUnVsZSBleGVjdXRpb24gY29udGV4dFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuU2hvd0xvZ291dChjb250ZXh0OiBBY2FSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICByZXR1cm4gIWNvbnRleHQud2l0aENyZWRlbnRpYWxzO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhcHBsaWNhdGlvbiBzaG91bGQgcmVuZGVyIHByb2Nlc3Mgc2VydmljZXMgZXh0ZW5zaW9uLlxuICogSlNPTiByZWY6IGBjYW5TaG93UHJvY2Vzc1NlcnZpY2VzYFxuICogQHBhcmFtIGNvbnRleHQgUnVsZSBleGVjdXRpb24gY29udGV4dFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuU2hvd1Byb2Nlc3NTZXJ2aWNlcyhjb250ZXh0OiBBY2FSdWxlQ29udGV4dCk6IGJvb2xlYW4ge1xuICByZXR1cm4gY29udGV4dC5wcm9jZXNzU2VydmljZXM7XG59XG4iXX0=
