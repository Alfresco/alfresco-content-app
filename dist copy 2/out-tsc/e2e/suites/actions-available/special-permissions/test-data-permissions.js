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
// ----- files -----
var consumerContextMenu = ['Share', 'Download', 'View', 'Favorite', 'Copy', 'Manage Versions'];
var consumerFavContextMenu = ['Share', 'Download', 'View', 'Remove Favorite', 'Copy', 'Manage Versions'];
var consumerSharedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Favorite', 'Copy', 'Manage Versions'];
var consumerSharedFavContextMenu = ['Shared Link Settings', 'Download', 'View', 'Remove Favorite', 'Copy', 'Manage Versions'];
var consumerToolbarPrimary = ['Share', 'Download', 'View', 'View Details', 'More Actions'];
var consumerSharedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
var searchConsumerToolbarPrimary = ['Toggle search filter', 'Share', 'Download', 'View', 'View Details', 'More Actions'];
var searchConsumerSharedToolbarPrimary = ['Toggle search filter', 'Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
var consumerToolbarMore = ['Favorite', 'Copy', 'Manage Versions'];
var consumerFavToolbarMore = ['Remove Favorite', 'Copy', 'Manage Versions'];
// ---- VIEWER ----
var consumerViewerSharedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
var consumerViewerToolbarPrimary = ['Activate full-screen mode', 'Share', 'Download', 'Print', 'View Details', 'More Actions'];
var consumerViewerFavToolbarMore = ['Remove Favorite', 'Copy', 'Manage Versions'];
var consumerViewerToolbarMore = ['Favorite', 'Copy', 'Manage Versions'];
// ---- FAVORITES workarounds ----
// TODO: remove 'Move' and 'Delete' when ACA-1737 is done
// TODO: investigate why 'Upload New Version' appears and raise issue
var favoritesConsumerToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// TODO: remove 'Move' and 'Delete' when ACA-1737 is done
// TODO: investigate why 'Upload New Version' appears and raise issue
var favoritesConsumerContextMenu = ['Share', 'Download', 'View', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// TODO: remove 'Move' and 'Delete' when ACA-1737 is done
// TODO: investigate why 'Upload New Version' appears and raise issue
var favoritesConsumerSharedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// ---- SHARED FILES workaround ----
// TODO: investigate why 'Upload New Version' appears and raise issue
var sharedConsumerToolbarMore = ['Upload New Version', 'Favorite', 'Copy', 'Manage Versions'];
// TODO: investigate why 'Cancel Editing' appears and raise issue
// TODO: investigate why 'Upload New Version' appears and raise issue
var sharedConsumerLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions'];
// TODO: investigate why 'Upload New Version' appears and raise issue
var sharedConsumerFavToolbarMore = ['Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
// TODO: investigate why 'Cancel Editing' appears and raise issue
// TODO: investigate why 'Upload New Version' appears and raise issue
var sharedConsumerFavLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
// TODO: investigate why 'Upload New Version' appears and raise issue
var sharedConsumerContextMenu = ['Shared Link Settings', 'Download', 'View', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions'];
// TODO: investigate why 'Cancel Editing' appears and raise issue
// TODO: investigate why 'Upload New Version' appears and raise issue
var sharedConsumerLockedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions'];
// TODO: investigate why 'Upload New Version' appears and raise issue
var sharedConsumerFavContextMenu = ['Shared Link Settings', 'Download', 'View', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
// TODO: investigate why 'Cancel Editing' appears and raise issue
// TODO: investigate why 'Upload New Version' appears and raise issue
var sharedConsumerFavLockedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
export var fileDocx = {
    name: "file-docx-" + Utils.random() + ".docx",
    description: 'file not shared, not fav, office, not locked',
    contextMenu: consumerContextMenu,
    toolbarPrimary: consumerToolbarPrimary,
    toolbarMore: consumerToolbarMore,
    viewerToolbarPrimary: consumerViewerToolbarPrimary,
    viewerToolbarMore: consumerViewerToolbarMore,
    searchToolbarPrimary: searchConsumerToolbarPrimary
};
export var fileDocxFav = {
    name: "file-docx-fav-" + Utils.random() + ".docx",
    description: 'file not shared, fav, office, not locked',
    contextMenu: consumerFavContextMenu,
    toolbarPrimary: consumerToolbarPrimary,
    toolbarMore: consumerFavToolbarMore,
    viewerToolbarPrimary: consumerViewerToolbarPrimary,
    viewerToolbarMore: consumerViewerFavToolbarMore,
    favoritesToolbarMore: favoritesConsumerToolbarMore,
    favoritesContextMenu: favoritesConsumerContextMenu,
    searchToolbarPrimary: searchConsumerToolbarPrimary
};
export var file = {
    name: "file-" + Utils.random() + ".txt",
    description: 'file not shared, not fav, not office, not locked',
    contextMenu: consumerContextMenu,
    toolbarPrimary: consumerToolbarPrimary,
    toolbarMore: consumerToolbarMore,
    viewerToolbarPrimary: consumerViewerToolbarPrimary,
    viewerToolbarMore: consumerViewerToolbarMore,
    searchToolbarPrimary: searchConsumerToolbarPrimary
};
export var fileFav = {
    name: "file-fav-" + Utils.random() + ".txt",
    description: 'file not shared, fav, not office, not locked',
    contextMenu: consumerFavContextMenu,
    toolbarPrimary: consumerToolbarPrimary,
    toolbarMore: consumerFavToolbarMore,
    viewerToolbarPrimary: consumerViewerToolbarPrimary,
    viewerToolbarMore: consumerViewerFavToolbarMore,
    favoritesToolbarMore: favoritesConsumerToolbarMore,
    favoritesContextMenu: favoritesConsumerContextMenu,
    searchToolbarPrimary: searchConsumerToolbarPrimary
};
export var fileDocxShared = {
    name: "file-docx-shared-" + Utils.random() + ".docx",
    description: 'file shared, not fav, office, not locked',
    contextMenu: consumerSharedContextMenu,
    toolbarPrimary: consumerSharedToolbarPrimary,
    toolbarMore: consumerToolbarMore,
    viewerToolbarPrimary: consumerViewerSharedToolbarPrimary,
    viewerToolbarMore: consumerViewerToolbarMore,
    sharedToolbarMore: sharedConsumerToolbarMore,
    sharedContextMenu: sharedConsumerContextMenu,
    searchToolbarPrimary: searchConsumerSharedToolbarPrimary
};
export var fileDocxSharedFav = {
    name: "file-docx-shared-fav-" + Utils.random() + ".docx",
    description: 'file shared, fav, office, not locked',
    contextMenu: consumerSharedFavContextMenu,
    toolbarPrimary: consumerSharedToolbarPrimary,
    toolbarMore: consumerFavToolbarMore,
    viewerToolbarPrimary: consumerViewerSharedToolbarPrimary,
    viewerToolbarMore: consumerViewerFavToolbarMore,
    favoritesToolbarMore: favoritesConsumerToolbarMore,
    favoritesContextMenu: favoritesConsumerSharedContextMenu,
    sharedToolbarMore: sharedConsumerFavToolbarMore,
    sharedContextMenu: sharedConsumerFavContextMenu,
    searchToolbarPrimary: searchConsumerSharedToolbarPrimary
};
export var fileShared = {
    name: "file-shared-" + Utils.random() + ".txt",
    description: 'file shared, not fav, not office, not locked',
    contextMenu: consumerSharedContextMenu,
    toolbarPrimary: consumerSharedToolbarPrimary,
    toolbarMore: consumerToolbarMore,
    viewerToolbarPrimary: consumerViewerSharedToolbarPrimary,
    viewerToolbarMore: consumerViewerToolbarMore,
    sharedToolbarMore: sharedConsumerToolbarMore,
    sharedContextMenu: sharedConsumerContextMenu,
    searchToolbarPrimary: searchConsumerSharedToolbarPrimary
};
export var fileSharedFav = {
    name: "file-shared-fav-" + Utils.random() + ".txt",
    description: 'file shared, fav, not office, not locked',
    contextMenu: consumerSharedFavContextMenu,
    toolbarPrimary: consumerSharedToolbarPrimary,
    toolbarMore: consumerFavToolbarMore,
    viewerToolbarPrimary: consumerViewerSharedToolbarPrimary,
    viewerToolbarMore: consumerViewerFavToolbarMore,
    favoritesToolbarMore: favoritesConsumerToolbarMore,
    favoritesContextMenu: favoritesConsumerSharedContextMenu,
    sharedToolbarMore: sharedConsumerFavToolbarMore,
    sharedContextMenu: sharedConsumerFavContextMenu,
    searchToolbarPrimary: searchConsumerSharedToolbarPrimary
};
export var fileLocked = {
    name: "file-locked-" + Utils.random() + ".txt",
    description: 'file not shared, not fav, not office, locked',
    contextMenu: consumerContextMenu,
    toolbarPrimary: consumerToolbarPrimary,
    toolbarMore: consumerToolbarMore,
    viewerToolbarPrimary: consumerViewerToolbarPrimary,
    viewerToolbarMore: consumerViewerToolbarMore,
    searchToolbarPrimary: searchConsumerToolbarPrimary
};
export var fileFavLocked = {
    name: "file-fav-locked-" + Utils.random() + ".txt",
    description: 'file not shared, fav, not office, locked',
    contextMenu: consumerFavContextMenu,
    toolbarPrimary: consumerToolbarPrimary,
    toolbarMore: consumerFavToolbarMore,
    viewerToolbarPrimary: consumerViewerToolbarPrimary,
    viewerToolbarMore: consumerViewerFavToolbarMore,
    favoritesToolbarMore: favoritesConsumerToolbarMore,
    favoritesContextMenu: favoritesConsumerContextMenu,
    searchToolbarPrimary: searchConsumerToolbarPrimary
};
export var fileSharedLocked = {
    name: "file-shared-locked-" + Utils.random() + ".txt",
    description: 'file shared, not fav, not office, locked',
    contextMenu: consumerSharedContextMenu,
    toolbarPrimary: consumerSharedToolbarPrimary,
    toolbarMore: consumerToolbarMore,
    viewerToolbarPrimary: consumerViewerSharedToolbarPrimary,
    viewerToolbarMore: consumerViewerToolbarMore,
    sharedToolbarMore: sharedConsumerLockedToolbarMore,
    sharedContextMenu: sharedConsumerLockedContextMenu,
    searchToolbarPrimary: searchConsumerSharedToolbarPrimary
};
export var fileSharedFavLocked = {
    name: "file-shared-fav-locked-" + Utils.random() + ".txt",
    description: 'file shared, fav, not office, locked',
    contextMenu: consumerSharedFavContextMenu,
    toolbarPrimary: consumerSharedToolbarPrimary,
    toolbarMore: consumerFavToolbarMore,
    viewerToolbarPrimary: consumerViewerSharedToolbarPrimary,
    viewerToolbarMore: consumerViewerFavToolbarMore,
    favoritesToolbarMore: favoritesConsumerToolbarMore,
    favoritesContextMenu: favoritesConsumerSharedContextMenu,
    sharedToolbarMore: sharedConsumerFavLockedToolbarMore,
    sharedContextMenu: sharedConsumerFavLockedContextMenu,
    searchToolbarPrimary: searchConsumerSharedToolbarPrimary
};
export var fileGranularPermission = "file-granular-" + Utils.random() + ".txt";
export var fileLockedByUser = "my-file-locked-" + Utils.random() + ".txt";
// ---- folders ---
var consumerFolderContextMenu = ['Download', 'Favorite', 'Copy'];
var consumerFolderToolbarPrimary = ['Download', 'View Details', 'More Actions'];
var consumerFolderToolbarMore = ['Favorite', 'Copy'];
var searchConsumerFolderToolbarPrimary = ['Toggle search filter', 'Download', 'View Details', 'More Actions'];
var consumerFolderFavContextMenu = ['Download', 'Remove Favorite', 'Copy'];
var consumerFolderFavToolbarMore = ['Remove Favorite', 'Copy'];
// ---- FAVORITES workarounds ----
// TODO: remove 'Edit', 'Move' and 'Delete' when ACA-1737 is done
var favoritesConsumerFolderContextMenu = ['Download', 'Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete'];
// TODO: remove 'Edit', 'Move' and 'Delete' when ACA-1737 is done
var favoritesConsumerFolderToolbarMore = ['Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete'];
export var folder = {
    name: "folder-" + Utils.random(),
    description: 'folder not favorite',
    contextMenu: consumerFolderContextMenu,
    toolbarPrimary: consumerFolderToolbarPrimary,
    toolbarMore: consumerFolderToolbarMore,
    searchToolbarPrimary: searchConsumerFolderToolbarPrimary
};
export var folderFav = {
    name: "folder-fav-" + Utils.random(),
    description: 'folder favorite',
    contextMenu: consumerFolderFavContextMenu,
    toolbarPrimary: consumerFolderToolbarPrimary,
    toolbarMore: consumerFolderFavToolbarMore,
    favoritesContextMenu: favoritesConsumerFolderContextMenu,
    favoritesToolbarMore: favoritesConsumerFolderToolbarMore,
    searchToolbarPrimary: searchConsumerFolderToolbarPrimary,
};
export var folderFav2 = {
    name: "folder-fav-2-" + Utils.random(),
    description: 'folder 2 favorite'
};
// ---- multiple selection ---
var multipleSelContextMenu = ['Download', 'Favorite', 'Copy'];
var multipleSelAllFavContextMenu = ['Download', 'Remove Favorite', 'Copy'];
var multipleSelToolbarPrimary = ['Download', 'View Details', 'More Actions'];
var multipleSelToolbarMore = ['Favorite', 'Copy'];
var multipleSelAllFavToolbarMore = ['Remove Favorite', 'Copy'];
var searchMultipleSelToolbarPrimary = ['Toggle search filter', 'Download', 'View Details', 'More Actions'];
// ---- FAVORITES workarounds ----
// TODO: remove 'Move' and 'Delete' when ACA-1737 is done
var favoritesMultipleSelContextMenu = ['Download', 'Favorite', 'Move', 'Copy', 'Delete'];
// TODO: remove 'Move' and 'Delete' when ACA-1737 is done
var favoritesMultipleSelToolbarMore = ['Favorite', 'Move', 'Copy', 'Delete'];
// TODO: remove 'Move' and 'Delete' when ACA-1737 is done
var favoritesMultipleSelAllFavContextMenu = ['Download', 'Remove Favorite', 'Move', 'Copy', 'Delete'];
// TODO: remove 'Move' and 'Delete' when ACA-1737 is done
var favoritesMultipleSelAllFavToolbarMore = ['Remove Favorite', 'Move', 'Copy', 'Delete'];
export var multipleSel = {
    contextMenu: multipleSelContextMenu,
    toolbarPrimary: multipleSelToolbarPrimary,
    toolbarMore: multipleSelToolbarMore,
    favoritesContextMenu: favoritesMultipleSelContextMenu,
    favoritesToolbarMore: favoritesMultipleSelToolbarMore,
    searchToolbarPrimary: searchMultipleSelToolbarPrimary
};
export var multipleSelAllFav = {
    contextMenu: multipleSelAllFavContextMenu,
    toolbarPrimary: multipleSelToolbarPrimary,
    toolbarMore: multipleSelAllFavToolbarMore,
    favoritesContextMenu: favoritesMultipleSelAllFavContextMenu,
    favoritesToolbarMore: favoritesMultipleSelAllFavToolbarMore,
    searchToolbarPrimary: searchMultipleSelToolbarPrimary
};
//# sourceMappingURL=test-data-permissions.js.map