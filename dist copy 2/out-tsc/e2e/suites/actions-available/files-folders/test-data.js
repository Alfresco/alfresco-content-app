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
import { Utils } from '../../../utilities/utils';
export var trashActions = ['Permanently Delete', 'Restore'];
// ----- files -----
var fileContextMenu = ['Share', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var fileSharedFavLockedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var fileToolbarPrimary = ['Share', 'Download', 'View', 'View Details', 'More Actions'];
var fileToolbarMore = ['Edit Offline', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var fileDocxToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var fileDocxContextMenu = ['Share', 'Download', 'View', 'Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var fileSharedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
var fileFavLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var fileDocxFavContextMenu = ['Share', 'Download', 'View', 'Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var fileDocxFavToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var fileDocxSharedFavContextMenu = ['Shared Link Settings', 'Download', 'View', 'Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var fileDocxSharedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var fileFavContextMenu = ['Share', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var fileFavToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var fileSharedFavContextMenu = ['Shared Link Settings', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var fileSharedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var fileFavLockedContextMenu = ['Share', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var fileLockedContextMenu = ['Share', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var fileLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var fileSharedLockedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
// ---- VIEWER ----
var viewerSharedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
var viewerToolbarPrimary = ['Activate full-screen mode', 'Share', 'Download', 'Print', 'View Details', 'More Actions'];
var viewerToolbarMore = ['Edit Offline', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var viewerFavToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var viewerDocxToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var viewerFavLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var viewerDocxFavToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
var viewerLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
// ---- FAVORITES workarounds ----
// TODO: investigate why 'Edit Offline', 'Edit in Microsoft Office™' and 'Permissions' are not displayed and raise issue
var favoritesContextMenu = ['Share', 'Download', 'View', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// TODO: investigate why 'Permissions' is not displayed and raise issue
var favoritesLockedContextMenu = ['Share', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// TODO: investigate why 'Edit Offline', 'Edit in Microsoft Office™' and 'Permissions' are not displayed and raise issue
var favoritesToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// TODO: investigate why 'Permissions' is not displayed and raise issue
var favoritesLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// TODO: investigate why 'Edit Offline', 'Edit in Microsoft Office™' and 'Permissions' are not displayed and raise issue
var favoritesSharedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// TODO: investigate why 'Permissions' is not displayed and raise issue
var favoritesSharedLockedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// ---- SEARCH workarounds ----
var searchDocxContextMenu = ['Share', 'Download', 'View', 'Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchToolbarPrimary = ['Toggle search filter', 'Share', 'Download', 'View', 'View Details', 'More Actions'];
var searchSharedToolbarPrimary = ['Toggle search filter', 'Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
var searchFavLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchSharedFavLockedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchDocxToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchFavContextMenu = ['Share', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchSharedLockedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchDocxFavContextMenu = ['Share', 'Download', 'View', 'Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchDocxFavToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchSharedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchToolbarMore = ['Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchDocxSharedFavContextMenu = ['Shared Link Settings', 'Download', 'View', 'Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchDocxSharedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchFavToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchContextMenu = ['Share', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchFavLockedContextMenu = ['Share', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchLockedContextMenu = ['Share', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchSharedFavContextMenu = ['Shared Link Settings', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchViewerToolbarMore = ['Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchViewerFavToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchViewerDocxToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchViewerFavLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchViewerDocxFavToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
var searchViewerLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
export var fileDocx = {
    name: "file-docx-" + Utils.random() + ".docx",
    description: 'file not shared, not fav, office, not locked',
    contextMenu: fileDocxContextMenu,
    toolbarPrimary: fileToolbarPrimary,
    toolbarMore: fileDocxToolbarMore,
    viewerToolbarPrimary: viewerToolbarPrimary,
    viewerToolbarMore: viewerDocxToolbarMore,
    searchContextMenu: searchDocxContextMenu,
    searchToolbarPrimary: searchToolbarPrimary,
    searchToolbarMore: searchDocxToolbarMore,
    searchViewerToolbarMore: searchViewerDocxToolbarMore
};
export var fileDocxFav = {
    name: "file-docx-fav-" + Utils.random() + ".docx",
    description: 'file not shared, fav, office, not locked',
    contextMenu: fileDocxFavContextMenu,
    toolbarPrimary: fileToolbarPrimary,
    toolbarMore: fileDocxFavToolbarMore,
    viewerToolbarPrimary: viewerToolbarPrimary,
    viewerToolbarMore: viewerDocxFavToolbarMore,
    favoritesToolbarMore: favoritesToolbarMore,
    favoritesContextMenu: favoritesContextMenu,
    searchContextMenu: searchDocxFavContextMenu,
    searchToolbarPrimary: searchToolbarPrimary,
    searchToolbarMore: searchDocxFavToolbarMore,
    searchViewerToolbarMore: searchViewerDocxFavToolbarMore,
};
export var file = {
    name: "file-" + Utils.random() + ".txt",
    description: 'file not shared, not fav, not office, not locked',
    contextMenu: fileContextMenu,
    toolbarPrimary: fileToolbarPrimary,
    toolbarMore: fileToolbarMore,
    viewerToolbarPrimary: viewerToolbarPrimary,
    viewerToolbarMore: viewerToolbarMore,
    searchViewerToolbarMore: searchViewerToolbarMore,
    searchContextMenu: searchContextMenu,
    searchToolbarPrimary: searchToolbarPrimary,
    searchToolbarMore: searchToolbarMore
};
export var fileFav = {
    name: "file-fav-" + Utils.random() + ".txt",
    description: 'file not shared, fav, not office, not locked',
    contextMenu: fileFavContextMenu,
    toolbarPrimary: fileToolbarPrimary,
    toolbarMore: fileFavToolbarMore,
    viewerToolbarPrimary: viewerToolbarPrimary,
    viewerToolbarMore: viewerFavToolbarMore,
    favoritesContextMenu: favoritesContextMenu,
    favoritesToolbarMore: favoritesToolbarMore,
    searchContextMenu: searchFavContextMenu,
    searchToolbarPrimary: searchToolbarPrimary,
    searchToolbarMore: searchFavToolbarMore,
    searchViewerToolbarMore: searchViewerFavToolbarMore
};
export var fileDocxShared = {
    name: "file-docx-shared-" + Utils.random() + ".docx",
    description: 'file shared, not fav, office, not locked',
    contextMenu: fileDocxSharedContextMenu,
    toolbarPrimary: fileSharedToolbarPrimary,
    toolbarMore: fileDocxToolbarMore,
    viewerToolbarPrimary: viewerSharedToolbarPrimary,
    viewerToolbarMore: viewerDocxToolbarMore,
    searchContextMenu: searchDocxSharedContextMenu,
    searchToolbarPrimary: searchSharedToolbarPrimary,
    searchToolbarMore: searchDocxToolbarMore,
    searchViewerToolbarMore: searchViewerDocxToolbarMore
};
export var fileDocxSharedFav = {
    name: "file-docx-shared-fav-" + Utils.random() + ".docx",
    description: 'file shared, fav, office, not locked',
    contextMenu: fileDocxSharedFavContextMenu,
    toolbarPrimary: fileSharedToolbarPrimary,
    toolbarMore: fileDocxFavToolbarMore,
    viewerToolbarPrimary: viewerSharedToolbarPrimary,
    viewerToolbarMore: viewerDocxFavToolbarMore,
    favoritesContextMenu: favoritesSharedContextMenu,
    favoritesToolbarPrimary: fileSharedToolbarPrimary,
    favoritesToolbarMore: favoritesToolbarMore,
    searchContextMenu: searchDocxSharedFavContextMenu,
    searchToolbarPrimary: searchSharedToolbarPrimary,
    searchToolbarMore: searchDocxFavToolbarMore,
    searchViewerToolbarMore: searchViewerDocxFavToolbarMore
};
export var fileShared = {
    name: "file-shared-" + Utils.random() + ".txt",
    description: 'file shared, not fav, not office, not locked',
    contextMenu: fileSharedContextMenu,
    toolbarPrimary: fileSharedToolbarPrimary,
    toolbarMore: fileToolbarMore,
    viewerToolbarPrimary: viewerSharedToolbarPrimary,
    viewerToolbarMore: viewerToolbarMore,
    searchContextMenu: searchSharedContextMenu,
    searchToolbarPrimary: searchSharedToolbarPrimary,
    searchToolbarMore: searchToolbarMore,
    searchViewerToolbarMore: searchViewerToolbarMore
};
export var fileSharedFav = {
    name: "file-shared-fav-" + Utils.random() + ".txt",
    description: 'file shared, fav, not office, not locked',
    contextMenu: fileSharedFavContextMenu,
    toolbarPrimary: fileSharedToolbarPrimary,
    toolbarMore: fileFavToolbarMore,
    viewerToolbarPrimary: viewerSharedToolbarPrimary,
    viewerToolbarMore: viewerFavToolbarMore,
    favoritesContextMenu: favoritesSharedContextMenu,
    favoritesToolbarPrimary: fileSharedToolbarPrimary,
    favoritesToolbarMore: favoritesToolbarMore,
    searchContextMenu: searchSharedFavContextMenu,
    searchToolbarPrimary: searchSharedToolbarPrimary,
    searchToolbarMore: searchFavToolbarMore,
    searchViewerToolbarMore: searchViewerFavToolbarMore
};
export var fileLocked = {
    name: "file-locked-" + Utils.random() + ".txt",
    description: 'file not shared, not fav, not office, locked',
    contextMenu: fileLockedContextMenu,
    toolbarPrimary: fileToolbarPrimary,
    toolbarMore: fileLockedToolbarMore,
    viewerToolbarPrimary: viewerToolbarPrimary,
    viewerToolbarMore: viewerLockedToolbarMore,
    searchContextMenu: searchLockedContextMenu,
    searchToolbarPrimary: searchToolbarPrimary,
    searchToolbarMore: searchLockedToolbarMore,
    searchViewerToolbarMore: searchViewerLockedToolbarMore
};
export var fileFavLocked = {
    name: "file-fav-locked-" + Utils.random() + ".txt",
    description: 'file not shared, fav, not office, locked',
    contextMenu: fileFavLockedContextMenu,
    toolbarPrimary: fileToolbarPrimary,
    toolbarMore: fileFavLockedToolbarMore,
    viewerToolbarPrimary: viewerToolbarPrimary,
    viewerToolbarMore: viewerFavLockedToolbarMore,
    favoritesContextMenu: favoritesLockedContextMenu,
    favoritesToolbarMore: favoritesLockedToolbarMore,
    searchContextMenu: searchFavLockedContextMenu,
    searchToolbarPrimary: searchToolbarPrimary,
    searchToolbarMore: searchFavLockedToolbarMore,
    searchViewerToolbarMore: searchViewerFavLockedToolbarMore
};
export var fileSharedLocked = {
    name: "file-shared-locked-" + Utils.random() + ".txt",
    description: 'file shared, not fav, not office, locked',
    contextMenu: fileSharedLockedContextMenu,
    toolbarPrimary: fileSharedToolbarPrimary,
    toolbarMore: fileLockedToolbarMore,
    viewerToolbarPrimary: viewerSharedToolbarPrimary,
    viewerToolbarMore: viewerLockedToolbarMore,
    searchContextMenu: searchSharedLockedContextMenu,
    searchToolbarPrimary: searchSharedToolbarPrimary,
    searchToolbarMore: searchLockedToolbarMore,
    searchViewerToolbarMore: searchViewerLockedToolbarMore
};
export var fileSharedFavLocked = {
    name: "file-shared-fav-locked-" + Utils.random() + ".txt",
    description: 'file shared, fav, not office, locked',
    contextMenu: fileSharedFavLockedContextMenu,
    toolbarPrimary: fileSharedToolbarPrimary,
    toolbarMore: fileFavLockedToolbarMore,
    viewerToolbarPrimary: viewerSharedToolbarPrimary,
    viewerToolbarMore: viewerFavLockedToolbarMore,
    favoritesToolbarMore: favoritesLockedToolbarMore,
    favoritesContextMenu: favoritesSharedLockedContextMenu,
    favoritesToolbarPrimary: fileSharedToolbarPrimary,
    searchContextMenu: searchSharedFavLockedContextMenu,
    searchToolbarPrimary: searchSharedToolbarPrimary,
    searchToolbarMore: searchFavLockedToolbarMore,
    searchViewerToolbarMore: searchViewerFavLockedToolbarMore
};
export var fileInTrash = {
    name: "deleted-file-" + Utils.random() + ".txt",
    trashActions: trashActions
};
export var file2InTrash = {
    name: "deleted-file2-" + Utils.random() + ".txt",
    trashActions: trashActions
};
export var folderInTrash = {
    name: "deleted-folder-" + Utils.random(),
    trashActions: trashActions
};
export var folder2InTrash = {
    name: "deleted-folder2-" + Utils.random(),
    trashActions: trashActions
};
// ---- folders ---
var folderContextMenu = ['Download', 'Edit', 'Favorite', 'Move', 'Copy', 'Delete', 'Permissions'];
var folderFavContextMenu = ['Download', 'Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Permissions'];
var folderToolbarPrimary = ['Download', 'View Details', 'More Actions'];
var folderToolbarMore = ['Edit', 'Favorite', 'Move', 'Copy', 'Delete', 'Permissions'];
var folderFavToolbarMore = ['Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Permissions'];
var favoritesFolderFavContextMenu = ['Download', 'Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete'];
var favoritesFolderFavToolbarMore = ['Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete'];
var searchFolderContextMenu = ['Download', 'Edit', 'Favorite', 'Copy', 'Permissions'];
var searchFolderToolbarPrimary = ['Toggle search filter', 'Download', 'View Details', 'More Actions'];
var searchFolderToolbarMore = ['Edit', 'Favorite', 'Copy', 'Permissions'];
var searchFolderFavContextMenu = ['Download', 'Edit', 'Remove Favorite', 'Copy', 'Permissions'];
var searchFolderFavToolbarMore = ['Edit', 'Remove Favorite', 'Copy', 'Permissions'];
export var folder = {
    name: "folder-" + Utils.random(),
    description: 'folder not favorite',
    contextMenu: folderContextMenu,
    toolbarPrimary: folderToolbarPrimary,
    toolbarMore: folderToolbarMore,
    searchContextMenu: searchFolderContextMenu,
    searchToolbarPrimary: searchFolderToolbarPrimary,
    searchToolbarMore: searchFolderToolbarMore
};
export var folderFav = {
    name: "folder-fav-" + Utils.random(),
    description: 'folder favorite',
    contextMenu: folderFavContextMenu,
    toolbarPrimary: folderToolbarPrimary,
    toolbarMore: folderFavToolbarMore,
    favoritesContextMenu: favoritesFolderFavContextMenu,
    favoritesToolbarMore: favoritesFolderFavToolbarMore,
    searchContextMenu: searchFolderFavContextMenu,
    searchToolbarPrimary: searchFolderToolbarPrimary,
    searchToolbarMore: searchFolderFavToolbarMore
};
export var folderFav2 = {
    name: "folder-fav-2-" + Utils.random(),
    description: 'folder favorite',
    contextMenu: folderFavContextMenu,
    toolbarPrimary: folderToolbarPrimary,
    toolbarMore: folderFavToolbarMore,
    favoritesContextMenu: favoritesFolderFavContextMenu,
    favoritesToolbarMore: favoritesFolderFavToolbarMore,
    searchContextMenu: searchFolderFavContextMenu,
    searchToolbarPrimary: searchFolderToolbarPrimary,
    searchToolbarMore: searchFolderFavToolbarMore
};
// ---- multiple selection ---
// TODO: raise issue to remove 'Permissions'
var multipleSelContextMenu = ['Download', 'Favorite', 'Move', 'Copy', 'Delete', 'Permissions'];
// TODO: raise issue to remove 'Permissions'
var multipleSelAllFavContextMenu = ['Download', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Permissions'];
var multipleSelToolbarPrimary = ['Download', 'View Details', 'More Actions'];
// TODO: raise issue to remove 'Permissions'
var multipleSelToolbarMore = ['Favorite', 'Move', 'Copy', 'Delete', 'Permissions'];
// TODO: raise issue to remove 'Permissions'
var multipleSelAllFavToolbarMore = ['Remove Favorite', 'Move', 'Copy', 'Delete', 'Permissions'];
var favoritesMultipleSelAllFavContextMenu = ['Download', 'Remove Favorite', 'Move', 'Copy', 'Delete'];
var favoritesMultipleSelAllFavToolbarMore = ['Remove Favorite', 'Move', 'Copy', 'Delete'];
// TODO: raise issue to remove 'Permissions'
var searchMultipleSelContextMenu = ['Download', 'Favorite', 'Copy', 'Permissions'];
// TODO: raise issue to remove 'Permissions'
var searchMultipleSelAllFavContextMenu = ['Download', 'Remove Favorite', 'Copy', 'Permissions'];
var searchMultipleSelToolbarPrimary = ['Toggle search filter', 'Download', 'View Details', 'More Actions'];
// TODO: raise issue to remove 'Permissions'
var searchMultipleSelToolbarMore = ['Favorite', 'Copy', 'Permissions'];
// TODO: raise issue to remove 'Permissions'
var searchMultipleSelAllFavToolbarMore = ['Remove Favorite', 'Copy', 'Permissions'];
export var multipleSel = {
    contextMenu: multipleSelContextMenu,
    toolbarPrimary: multipleSelToolbarPrimary,
    toolbarMore: multipleSelToolbarMore,
    searchContextMenu: searchMultipleSelContextMenu,
    searchToolbarMore: searchMultipleSelToolbarMore,
    searchToolbarPrimary: searchMultipleSelToolbarPrimary
};
export var multipleSelAllFav = {
    contextMenu: multipleSelAllFavContextMenu,
    toolbarPrimary: multipleSelToolbarPrimary,
    toolbarMore: multipleSelAllFavToolbarMore,
    favoritesContextMenu: favoritesMultipleSelAllFavContextMenu,
    favoritesToolbarMore: favoritesMultipleSelAllFavToolbarMore,
    searchToolbarPrimary: searchMultipleSelToolbarPrimary,
    searchContextMenu: searchMultipleSelAllFavContextMenu,
    searchToolbarMore: searchMultipleSelAllFavToolbarMore
};
//# sourceMappingURL=test-data.js.map