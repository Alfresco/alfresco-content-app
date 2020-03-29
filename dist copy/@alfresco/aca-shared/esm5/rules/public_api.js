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
  canShowProcessServices
} from './app.rules';
export {
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
  isSharedFileViewer
} from './navigation.rules';
export { hasQuickShareEnabled } from './repository.rules';
export { isAdmin } from './user.rules';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljX2FwaS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hY2Etc2hhcmVkL3J1bGVzLyIsInNvdXJjZXMiOlsicHVibGljX2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLGt0QkFBYyxhQUFhLENBQUM7QUFDNUIsZ1RBQWMsb0JBQW9CLENBQUM7QUFDbkMscUNBQWMsb0JBQW9CLENBQUM7QUFDbkMsd0JBQWMsY0FBYyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDA1IC0gMjAyMCBBbGZyZXNjbyBTb2Z0d2FyZSBMaW1pdGVkXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbi5cbiAqIElmIHRoZSBzb2Z0d2FyZSB3YXMgcHVyY2hhc2VkIHVuZGVyIGEgcGFpZCBBbGZyZXNjbyBsaWNlbnNlLCB0aGUgdGVybXMgb2ZcbiAqIHRoZSBwYWlkIGxpY2Vuc2UgYWdyZWVtZW50IHdpbGwgcHJldmFpbC4gIE90aGVyd2lzZSwgdGhlIHNvZnR3YXJlIGlzXG4gKiBwcm92aWRlZCB1bmRlciB0aGUgZm9sbG93aW5nIG9wZW4gc291cmNlIGxpY2Vuc2UgdGVybXM6XG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggQWxmcmVzY28uIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5leHBvcnQgKiBmcm9tICcuL2FwcC5ydWxlcyc7XG5leHBvcnQgKiBmcm9tICcuL25hdmlnYXRpb24ucnVsZXMnO1xuZXhwb3J0ICogZnJvbSAnLi9yZXBvc2l0b3J5LnJ1bGVzJztcbmV4cG9ydCAqIGZyb20gJy4vdXNlci5ydWxlcyc7XG4iXX0=
