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

// ----- files -----

const consumerContextMenu = ['Share', 'Download', 'View', 'Favorite', 'Copy', 'Manage Versions'];
const consumerFavContextMenu = ['Share', 'Download', 'View', 'Remove Favorite', 'Copy', 'Manage Versions'];
const consumerSharedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Favorite', 'Copy', 'Manage Versions'];
const consumerSharedFavContextMenu = ['Shared Link Settings', 'Download', 'View', 'Remove Favorite', 'Copy', 'Manage Versions'];

const consumerToolbarPrimary = ['Share', 'Download', 'View', 'View Details', 'More Actions'];
const consumerSharedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];

const searchConsumerToolbarPrimary = ['Share', 'Download', 'View', 'View Details', 'More Actions'];
const searchConsumerSharedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];

const consumerToolbarMore = ['Favorite', 'Copy', 'Manage Versions'];
const consumerFavToolbarMore = ['Remove Favorite', 'Copy', 'Manage Versions'];

// ---- VIEWER ----

const consumerViewerSharedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
const consumerViewerToolbarPrimary = ['Activate full-screen mode', 'Share', 'Download', 'Print', 'View Details', 'More Actions'];
const consumerViewerFavToolbarMore = ['Remove Favorite', 'Copy', 'Manage Versions'];
const consumerViewerToolbarMore = ['Favorite', 'Copy', 'Manage Versions'];

// ---- FAVORITES workarounds ----

// TODO: remove 'Move' and 'Delete' when ACA-1737 is done
// TODO: investigate why 'Upload New Version' appears and raise issue
const favoritesConsumerToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// TODO: remove 'Move' and 'Delete' when ACA-1737 is done
// TODO: investigate why 'Upload New Version' appears and raise issue
const favoritesConsumerContextMenu = [
  'Share',
  'Download',
  'View',
  'Upload New Version',
  'Remove Favorite',
  'Move',
  'Copy',
  'Delete',
  'Manage Versions'
];
// TODO: remove 'Move' and 'Delete' when ACA-1737 is done
// TODO: investigate why 'Upload New Version' appears and raise issue
const favoritesConsumerSharedContextMenu = [
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

// ---- SHARED FILES workaround ----

// TODO: investigate why 'Upload New Version' appears and raise issue
const sharedConsumerToolbarMore = ['Upload New Version', 'Favorite', 'Copy', 'Manage Versions'];
// TODO: investigate why 'Cancel Editing' appears and raise issue
// TODO: investigate why 'Upload New Version' appears and raise issue
const sharedConsumerLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions'];
// TODO: investigate why 'Upload New Version' appears and raise issue
const sharedConsumerFavToolbarMore = ['Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
// TODO: investigate why 'Cancel Editing' appears and raise issue
// TODO: investigate why 'Upload New Version' appears and raise issue
const sharedConsumerFavLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
// TODO: investigate why 'Upload New Version' appears and raise issue
const sharedConsumerContextMenu = ['Shared Link Settings', 'Download', 'View', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions'];
// TODO: investigate why 'Cancel Editing' appears and raise issue
// TODO: investigate why 'Upload New Version' appears and raise issue
const sharedConsumerLockedContextMenu = [
  'Shared Link Settings',
  'Download',
  'View',
  'Cancel Editing',
  'Upload New Version',
  'Favorite',
  'Copy',
  'Manage Versions'
];
// TODO: investigate why 'Upload New Version' appears and raise issue
const sharedConsumerFavContextMenu = ['Shared Link Settings', 'Download', 'View', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
// TODO: investigate why 'Cancel Editing' appears and raise issue
// TODO: investigate why 'Upload New Version' appears and raise issue
const sharedConsumerFavLockedContextMenu = [
  'Shared Link Settings',
  'Download',
  'View',
  'Cancel Editing',
  'Upload New Version',
  'Remove Favorite',
  'Copy',
  'Manage Versions'
];

export const fileDocx = {
  name: `file-${random}-docx.docx`,
  description: 'file not shared, not fav, office, not locked',

  contextMenu: consumerContextMenu,
  toolbarPrimary: consumerToolbarPrimary,
  toolbarMore: consumerToolbarMore,
  viewerToolbarPrimary: consumerViewerToolbarPrimary,
  viewerToolbarMore: consumerViewerToolbarMore,

  searchToolbarPrimary: searchConsumerToolbarPrimary
};

export const fileDocxFav = {
  name: `file-${random}-docx-fav.docx`,
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

export const file = {
  name: `file-${random}.txt`,
  description: 'file not shared, not fav, not office, not locked',

  contextMenu: consumerContextMenu,
  toolbarPrimary: consumerToolbarPrimary,
  toolbarMore: consumerToolbarMore,
  viewerToolbarPrimary: consumerViewerToolbarPrimary,
  viewerToolbarMore: consumerViewerToolbarMore,

  searchToolbarPrimary: searchConsumerToolbarPrimary
};

export const fileFav = {
  name: `file-${random}-fav.txt`,
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

export const fileDocxShared = {
  name: `file-${random}-docx-shared.docx`,
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

export const fileDocxSharedFav = {
  name: `file-${random}-docx-shared-fav.docx`,
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

export const fileShared = {
  name: `file-${random}-shared.txt`,
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

export const fileSharedFav = {
  name: `file-${random}-shared-fav.txt`,
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

export const fileLocked = {
  name: `file-${random}-locked.txt`,
  description: 'file not shared, not fav, not office, locked',

  contextMenu: consumerContextMenu,
  toolbarPrimary: consumerToolbarPrimary,
  toolbarMore: consumerToolbarMore,
  viewerToolbarPrimary: consumerViewerToolbarPrimary,
  viewerToolbarMore: consumerViewerToolbarMore,

  searchToolbarPrimary: searchConsumerToolbarPrimary
};

export const fileFavLocked = {
  name: `file-${random}-fav-locked.txt`,
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

export const fileSharedLocked = {
  name: `file-${random}-shared-locked.txt`,
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

export const fileSharedFavLocked = {
  name: `file-${random}-shared-fav-locked.txt`,
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

export const fileGranularPermission = `file-${random}-granular.txt`;
export const fileLockedByUser = `file-${random}-my-locked.txt`;

// ---- folders ---

const consumerFolderContextMenu = ['Download', 'Favorite', 'Copy'];
const consumerFolderToolbarPrimary = ['Download', 'View Details', 'More Actions'];
const consumerFolderToolbarMore = ['Favorite', 'Copy'];
const searchConsumerFolderToolbarPrimary = ['Download', 'View Details', 'More Actions'];
const consumerFolderFavContextMenu = ['Download', 'Remove Favorite', 'Copy'];
const consumerFolderFavToolbarMore = ['Remove Favorite', 'Copy'];

// ---- FAVORITES workarounds ----

// TODO: remove 'Edit', 'Move' and 'Delete' when ACA-1737 is done
const favoritesConsumerFolderContextMenu = ['Download', 'Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete'];
// TODO: remove 'Edit', 'Move' and 'Delete' when ACA-1737 is done
const favoritesConsumerFolderToolbarMore = ['Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete'];

export const folder = {
  name: `folder-${random}`,
  description: 'folder not favorite',
  contextMenu: consumerFolderContextMenu,
  toolbarPrimary: consumerFolderToolbarPrimary,
  toolbarMore: consumerFolderToolbarMore,

  searchToolbarPrimary: searchConsumerFolderToolbarPrimary
};

export const folderFav = {
  name: `folder-fav-${random}`,
  description: 'folder favorite',
  contextMenu: consumerFolderFavContextMenu,
  toolbarPrimary: consumerFolderToolbarPrimary,
  toolbarMore: consumerFolderFavToolbarMore,

  favoritesContextMenu: favoritesConsumerFolderContextMenu,
  favoritesToolbarMore: favoritesConsumerFolderToolbarMore,

  searchToolbarPrimary: searchConsumerFolderToolbarPrimary
};

export const folderFav2 = {
  name: `folder-fav-2-${random}`,
  description: 'folder 2 favorite'
};

// ---- multiple selection ---

const multipleSelContextMenu = ['Download', 'Favorite', 'Copy'];
const multipleSelAllFavContextMenu = ['Download', 'Remove Favorite', 'Copy'];
const multipleSelToolbarPrimary = ['Download', 'View Details', 'More Actions'];
const multipleSelToolbarMore = ['Favorite', 'Copy'];
const multipleSelAllFavToolbarMore = ['Remove Favorite', 'Copy'];
const searchMultipleSelToolbarPrimary = ['Download', 'View Details', 'More Actions'];

// ---- FAVORITES workarounds ----

// TODO: remove 'Move' and 'Delete' when ACA-1737 is done
const favoritesMultipleSelContextMenu = ['Download', 'Favorite', 'Move', 'Copy', 'Delete'];
// TODO: remove 'Move' and 'Delete' when ACA-1737 is done
const favoritesMultipleSelToolbarMore = ['Favorite', 'Move', 'Copy', 'Delete'];
// TODO: remove 'Move' and 'Delete' when ACA-1737 is done
const favoritesMultipleSelAllFavContextMenu = ['Download', 'Remove Favorite', 'Move', 'Copy', 'Delete'];
// TODO: remove 'Move' and 'Delete' when ACA-1737 is done
const favoritesMultipleSelAllFavToolbarMore = ['Remove Favorite', 'Move', 'Copy', 'Delete'];

export const multipleSel = {
  contextMenu: multipleSelContextMenu,
  toolbarPrimary: multipleSelToolbarPrimary,
  toolbarMore: multipleSelToolbarMore,

  favoritesContextMenu: favoritesMultipleSelContextMenu,
  favoritesToolbarMore: favoritesMultipleSelToolbarMore,

  searchToolbarPrimary: searchMultipleSelToolbarPrimary
};

export const multipleSelAllFav = {
  contextMenu: multipleSelAllFavContextMenu,
  toolbarPrimary: multipleSelToolbarPrimary,
  toolbarMore: multipleSelAllFavToolbarMore,

  favoritesContextMenu: favoritesMultipleSelAllFavContextMenu,
  favoritesToolbarMore: favoritesMultipleSelAllFavToolbarMore,

  searchToolbarPrimary: searchMultipleSelToolbarPrimary
};
