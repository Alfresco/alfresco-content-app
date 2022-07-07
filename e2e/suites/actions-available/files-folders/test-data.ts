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

import { Utils } from '@alfresco/aca-testing-shared';

export const random = Utils.random();

export const trashActions = ['Permanently Delete', 'Restore'];

// ----- files -----

const fileContextMenu = [
  'Share',
  'Download',
  'View',
  'Edit Offline',
  'Upload New Version',
  'Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const fileSharedFavLockedContextMenu = [
  'Shared Link Settings',
  'Download',
  'View',
  'Cancel Editing',
  'Upload New Version',
  'Remove Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Permissions'
];
const fileToolbarPrimary = ['Share', 'Download', 'View', 'View Details', 'More Actions'];
const fileToolbarMore = [
  'Edit Offline',
  'Upload New Version',
  'Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const fileDocxToolbarMore = [
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const fileDocxContextMenu = [
  'Share',
  'Download',
  'View',
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const fileSharedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
const fileFavLockedToolbarMore = [
  'Cancel Editing',
  'Upload New Version',
  'Remove Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Permissions'
];
const fileDocxFavContextMenu = [
  'Share',
  'Download',
  'View',
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const fileDocxFavToolbarMore = [
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const fileDocxSharedFavContextMenu = [
  'Shared Link Settings',
  'Download',
  'View',
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const fileDocxSharedContextMenu = [
  'Shared Link Settings',
  'Download',
  'View',
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const fileFavContextMenu = [
  'Share',
  'Download',
  'View',
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const fileFavToolbarMore = [
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const fileSharedFavContextMenu = [
  'Shared Link Settings',
  'Download',
  'View',
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const fileSharedContextMenu = [
  'Shared Link Settings',
  'Download',
  'View',
  'Edit Offline',
  'Upload New Version',
  'Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const fileFavLockedContextMenu = [
  'Share',
  'Download',
  'View',
  'Cancel Editing',
  'Upload New Version',
  'Remove Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Permissions'
];
const fileLockedContextMenu = [
  'Share',
  'Download',
  'View',
  'Cancel Editing',
  'Upload New Version',
  'Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Permissions'
];
const fileLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileSharedLockedContextMenu = [
  'Shared Link Settings',
  'Download',
  'View',
  'Cancel Editing',
  'Upload New Version',
  'Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Permissions'
];

// ---- VIEWER ----

const viewerSharedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
const viewerToolbarPrimary = ['Activate full-screen mode', 'Share', 'Download', 'Print', 'View Details', 'More Actions'];
const viewerToolbarMore = [
  'Edit Offline',
  'Upload New Version',
  'Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const viewerFavToolbarMore = [
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const viewerDocxToolbarMore = [
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const viewerFavLockedToolbarMore = [
  'Cancel Editing',
  'Upload New Version',
  'Remove Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Permissions'
];
const viewerDocxFavToolbarMore = [
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const viewerLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
// ---- FAVORITES workarounds ----

// TODO: investigate why 'Edit Offline', 'Edit in Microsoft Office™' and 'Permissions' are not displayed and raise issue
const favoritesContextMenu = ['Share', 'Download', 'View', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// TODO: investigate why 'Permissions' is not displayed and raise issue
const favoritesLockedContextMenu = [
  'Share',
  'Download',
  'View',
  'Cancel Editing',
  'Upload New Version',
  'Remove Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions'
];
// TODO: investigate why 'Edit Offline', 'Edit in Microsoft Office™' and 'Permissions' are not displayed and raise issue
const favoritesToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// TODO: investigate why 'Permissions' is not displayed and raise issue
const favoritesLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// TODO: investigate why 'Edit Offline', 'Edit in Microsoft Office™' and 'Permissions' are not displayed and raise issue
const favoritesSharedContextMenu = [
  'Shared Link Settings',
  'Download',
  'View',
  'Upload New Version',
  'Remove Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions'
];
// TODO: investigate why 'Permissions' is not displayed and raise issue
const favoritesSharedLockedContextMenu = [
  'Shared Link Settings',
  'Download',
  'View',
  'Cancel Editing',
  'Upload New Version',
  'Remove Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions'
];

// ---- SEARCH workarounds ----

const searchDocxContextMenu = [
  'Share',
  'Download',
  'View',
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Favorite',
  'Copy',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const searchToolbarPrimary = ['Share', 'Download', 'View', 'View Details', 'More Actions'];
const searchSharedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
const searchFavLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchSharedFavLockedContextMenu = [
  'Shared Link Settings',
  'Download',
  'View',
  'Cancel Editing',
  'Upload New Version',
  'Remove Favorite',
  'Copy',
  'Manage Versions',
  'Permissions'
];
const searchDocxToolbarMore = [
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Favorite',
  'Copy',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const searchFavContextMenu = [
  'Share',
  'Download',
  'View',
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Copy',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const searchSharedLockedContextMenu = [
  'Shared Link Settings',
  'Download',
  'View',
  'Cancel Editing',
  'Upload New Version',
  'Favorite',
  'Copy',
  'Manage Versions',
  'Permissions'
];
const searchDocxFavContextMenu = [
  'Share',
  'Download',
  'View',
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Copy',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const searchDocxFavToolbarMore = [
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Copy',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const searchSharedContextMenu = [
  'Shared Link Settings',
  'Download',
  'View',
  'Edit Offline',
  'Upload New Version',
  'Favorite',
  'Copy',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const searchToolbarMore = ['Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Edit Aspects', 'Permissions'];
const searchDocxSharedFavContextMenu = [
  'Shared Link Settings',
  'Download',
  'View',
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Copy',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const searchDocxSharedContextMenu = [
  'Shared Link Settings',
  'Download',
  'View',
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Favorite',
  'Copy',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const searchFavToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Edit Aspects', 'Permissions'];
const searchContextMenu = [
  'Share',
  'Download',
  'View',
  'Edit Offline',
  'Upload New Version',
  'Favorite',
  'Copy',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const searchFavLockedContextMenu = [
  'Share',
  'Download',
  'View',
  'Cancel Editing',
  'Upload New Version',
  'Remove Favorite',
  'Copy',
  'Manage Versions',
  'Permissions'
];
const searchLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchLockedContextMenu = [
  'Share',
  'Download',
  'View',
  'Cancel Editing',
  'Upload New Version',
  'Favorite',
  'Copy',
  'Manage Versions',
  'Permissions'
];
const searchSharedFavContextMenu = [
  'Shared Link Settings',
  'Download',
  'View',
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Copy',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];

const searchViewerToolbarMore = ['Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Edit Aspects', 'Permissions'];
const searchViewerFavToolbarMore = [
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Copy',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const searchViewerDocxToolbarMore = [
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Favorite',
  'Copy',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const searchViewerFavLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchViewerDocxFavToolbarMore = [
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Copy',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
const searchViewerLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];

export const fileDocx = {
  name: `fileActions-docx-${random}.docx`,
  description: 'file not shared, not fav, office, not locked',

  contextMenu: fileDocxContextMenu,
  toolbarPrimary: fileToolbarPrimary,
  toolbarMore: fileDocxToolbarMore,
  viewerToolbarPrimary,
  viewerToolbarMore: viewerDocxToolbarMore,

  searchContextMenu: searchDocxContextMenu,
  searchToolbarPrimary,
  searchToolbarMore: searchDocxToolbarMore,
  searchViewerToolbarMore: searchViewerDocxToolbarMore
};

export const fileDocxFav = {
  name: `fileActions-docx-fav-${random}.docx`,
  description: 'file not shared, fav, office, not locked',

  contextMenu: fileDocxFavContextMenu,
  toolbarPrimary: fileToolbarPrimary,
  toolbarMore: fileDocxFavToolbarMore,
  viewerToolbarPrimary,
  viewerToolbarMore: viewerDocxFavToolbarMore,

  favoritesToolbarMore,
  favoritesContextMenu,

  searchContextMenu: searchDocxFavContextMenu,
  searchToolbarPrimary,
  searchToolbarMore: searchDocxFavToolbarMore,
  searchViewerToolbarMore: searchViewerDocxFavToolbarMore
};

export const file = {
  name: `fileActions-${random}.txt`,
  description: 'file not shared, not fav, not office, not locked',

  contextMenu: fileContextMenu,
  toolbarPrimary: fileToolbarPrimary,
  toolbarMore: fileToolbarMore,
  viewerToolbarPrimary,
  viewerToolbarMore,

  searchViewerToolbarMore,
  searchContextMenu,
  searchToolbarPrimary,
  searchToolbarMore
};

export const fileFav = {
  name: `fileActions-fav-${random}.txt`,
  description: 'file not shared, fav, not office, not locked',

  contextMenu: fileFavContextMenu,
  toolbarPrimary: fileToolbarPrimary,
  toolbarMore: fileFavToolbarMore,
  viewerToolbarPrimary,
  viewerToolbarMore: viewerFavToolbarMore,

  favoritesContextMenu,
  favoritesToolbarMore,

  searchContextMenu: searchFavContextMenu,
  searchToolbarPrimary,
  searchToolbarMore: searchFavToolbarMore,
  searchViewerToolbarMore: searchViewerFavToolbarMore
};

export const fileDocxShared = {
  name: `fileActions-docx-shared-${random}.docx`,
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

export const fileDocxSharedFav = {
  name: `fileActions-docx-shared-fav-${random}.docx`,
  description: 'file shared, fav, office, not locked',

  contextMenu: fileDocxSharedFavContextMenu,
  toolbarPrimary: fileSharedToolbarPrimary,
  toolbarMore: fileDocxFavToolbarMore,
  viewerToolbarPrimary: viewerSharedToolbarPrimary,
  viewerToolbarMore: viewerDocxFavToolbarMore,

  favoritesContextMenu: favoritesSharedContextMenu,
  favoritesToolbarPrimary: fileSharedToolbarPrimary,
  favoritesToolbarMore,

  searchContextMenu: searchDocxSharedFavContextMenu,
  searchToolbarPrimary: searchSharedToolbarPrimary,
  searchToolbarMore: searchDocxFavToolbarMore,
  searchViewerToolbarMore: searchViewerDocxFavToolbarMore
};

export const fileShared = {
  name: `fileActions-shared-${random}.txt`,
  description: 'file shared, not fav, not office, not locked',

  contextMenu: fileSharedContextMenu,
  toolbarPrimary: fileSharedToolbarPrimary,
  toolbarMore: fileToolbarMore,
  viewerToolbarPrimary: viewerSharedToolbarPrimary,
  viewerToolbarMore,

  searchContextMenu: searchSharedContextMenu,
  searchToolbarPrimary: searchSharedToolbarPrimary,
  searchToolbarMore,
  searchViewerToolbarMore
};

export const fileSharedFav = {
  name: `fileActions-shared-fav-${random}.txt`,
  description: 'file shared, fav, not office, not locked',

  contextMenu: fileSharedFavContextMenu,
  toolbarPrimary: fileSharedToolbarPrimary,
  toolbarMore: fileFavToolbarMore,
  viewerToolbarPrimary: viewerSharedToolbarPrimary,
  viewerToolbarMore: viewerFavToolbarMore,

  favoritesContextMenu: favoritesSharedContextMenu,
  favoritesToolbarPrimary: fileSharedToolbarPrimary,
  favoritesToolbarMore,

  searchContextMenu: searchSharedFavContextMenu,
  searchToolbarPrimary: searchSharedToolbarPrimary,
  searchToolbarMore: searchFavToolbarMore,
  searchViewerToolbarMore: searchViewerFavToolbarMore
};

export const fileLocked = {
  name: `fileActions-locked-${random}.txt`,
  description: 'file not shared, not fav, not office, locked',

  contextMenu: fileLockedContextMenu,
  toolbarPrimary: fileToolbarPrimary,
  toolbarMore: fileLockedToolbarMore,
  viewerToolbarPrimary,
  viewerToolbarMore: viewerLockedToolbarMore,

  searchContextMenu: searchLockedContextMenu,
  searchToolbarPrimary,
  searchToolbarMore: searchLockedToolbarMore,
  searchViewerToolbarMore: searchViewerLockedToolbarMore
};

export const fileFavLocked = {
  name: `fileActions-fav-locked-${random}.txt`,
  description: 'file not shared, fav, not office, locked',

  contextMenu: fileFavLockedContextMenu,
  toolbarPrimary: fileToolbarPrimary,
  toolbarMore: fileFavLockedToolbarMore,
  viewerToolbarPrimary,
  viewerToolbarMore: viewerFavLockedToolbarMore,

  favoritesContextMenu: favoritesLockedContextMenu,
  favoritesToolbarMore: favoritesLockedToolbarMore,

  searchContextMenu: searchFavLockedContextMenu,
  searchToolbarPrimary,
  searchToolbarMore: searchFavLockedToolbarMore,
  searchViewerToolbarMore: searchViewerFavLockedToolbarMore
};

export const fileSharedLocked = {
  name: `fileActions-shared-locked-${random}.txt`,
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

export const fileSharedFavLocked = {
  name: `fileActions-shared-fav-locked-${random}.txt`,
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

export const fileInTrash = {
  name: `deleted-file-${random}.txt`,
  trashActions
};

export const file2InTrash = {
  name: `deleted-file2-${random}.txt`,
  trashActions
};

export const folderInTrash = {
  name: `deleted-folder-${random}`,
  trashActions
};

export const folder2InTrash = {
  name: `deleted-folder2-${random}`,
  trashActions
};

// ---- folders ---

const folderContextMenu = ['Download', 'Edit', 'Favorite', 'Move', 'Copy', 'Delete', 'Edit Aspects', 'Permissions'];
const folderFavContextMenu = ['Download', 'Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Edit Aspects', 'Permissions'];
const folderToolbarPrimary = ['Download', 'View Details', 'More Actions'];
const folderToolbarMore = ['Edit', 'Favorite', 'Move', 'Copy', 'Delete', 'Edit Aspects', 'Permissions'];
const folderFavToolbarMore = ['Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Edit Aspects', 'Permissions'];

const favoritesFolderFavContextMenu = ['Download', 'Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete'];
const favoritesFolderFavToolbarMore = ['Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete'];

const searchFolderContextMenu = ['Download', 'Edit', 'Favorite', 'Copy', 'Edit Aspects', 'Permissions'];
const searchFolderToolbarPrimary = ['Download', 'View Details', 'More Actions'];
const searchFolderToolbarMore = ['Edit', 'Favorite', 'Copy', 'Edit Aspects', 'Permissions'];
const searchFolderFavContextMenu = ['Download', 'Edit', 'Remove Favorite', 'Copy', 'Edit Aspects', 'Permissions'];
const searchFolderFavToolbarMore = ['Edit', 'Remove Favorite', 'Copy', 'Edit Aspects', 'Permissions'];

export const folder = {
  name: `folderActions-${random}`,
  description: 'folder not favorite',

  contextMenu: folderContextMenu,
  toolbarPrimary: folderToolbarPrimary,
  toolbarMore: folderToolbarMore,

  searchContextMenu: searchFolderContextMenu,
  searchToolbarPrimary: searchFolderToolbarPrimary,
  searchToolbarMore: searchFolderToolbarMore
};

export const folderFav = {
  name: `folderActions-fav-${random}`,
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

export const folderFav2 = {
  name: `folderActions-fav-2-${random}`,
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
const multipleSelContextMenu = ['Download', 'Favorite', 'Move', 'Copy', 'Delete', 'Permissions'];
// TODO: raise issue to remove 'Permissions'
const multipleSelAllFavContextMenu = ['Download', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Permissions'];
const multipleSelToolbarPrimary = ['Download', 'View Details', 'More Actions'];
// TODO: raise issue to remove 'Permissions'
const multipleSelToolbarMore = ['Favorite', 'Move', 'Copy', 'Delete', 'Permissions'];
// TODO: raise issue to remove 'Permissions'
const multipleSelAllFavToolbarMore = ['Remove Favorite', 'Move', 'Copy', 'Delete', 'Permissions'];

const favoritesMultipleSelAllFavContextMenu = ['Download', 'Remove Favorite', 'Move', 'Copy', 'Delete'];
const favoritesMultipleSelAllFavToolbarMore = ['Remove Favorite', 'Move', 'Copy', 'Delete'];

// TODO: raise issue to remove 'Permissions'
const searchMultipleSelContextMenu = ['Download', 'Favorite', 'Copy', 'Permissions'];
// TODO: raise issue to remove 'Permissions'
const searchMultipleSelAllFavContextMenu = ['Download', 'Remove Favorite', 'Copy', 'Permissions'];
const searchMultipleSelToolbarPrimary = ['Download', 'View Details', 'More Actions'];
// TODO: raise issue to remove 'Permissions'
const searchMultipleSelToolbarMore = ['Favorite', 'Copy', 'Permissions'];
// TODO: raise issue to remove 'Permissions'
const searchMultipleSelAllFavToolbarMore = ['Remove Favorite', 'Copy', 'Permissions'];

export const multipleSel = {
  contextMenu: multipleSelContextMenu,
  toolbarPrimary: multipleSelToolbarPrimary,
  toolbarMore: multipleSelToolbarMore,

  searchContextMenu: searchMultipleSelContextMenu,
  searchToolbarMore: searchMultipleSelToolbarMore,
  searchToolbarPrimary: searchMultipleSelToolbarPrimary
};

export const multipleSelAllFav = {
  contextMenu: multipleSelAllFavContextMenu,
  toolbarPrimary: multipleSelToolbarPrimary,
  toolbarMore: multipleSelAllFavToolbarMore,

  favoritesContextMenu: favoritesMultipleSelAllFavContextMenu,
  favoritesToolbarMore: favoritesMultipleSelAllFavToolbarMore,

  searchToolbarPrimary: searchMultipleSelToolbarPrimary,
  searchContextMenu: searchMultipleSelAllFavContextMenu,
  searchToolbarMore: searchMultipleSelAllFavToolbarMore
};
