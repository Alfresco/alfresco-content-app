/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { Utils } from '../../utils';

export interface TestNode {
  /** Unique token in the name; use it as a precise search term. */
  random: string;
  name: string;
}

export interface TestFileData extends TestNode {
  description: string;
  contextMenu: string[];
  toolbarPrimary: string[];
  toolbarMore: string[];
  viewerToolbarPrimary: string[];
  viewerToolbarMore: string[];
  searchToolbarPrimary: string[];
  favoritesToolbarMore?: string[];
  favoritesContextMenu?: string[];
  sharedToolbarMore?: string[];
  sharedContextMenu?: string[];
}

export interface TestFolderData {
  name: string;
  description: string;
  contextMenu?: string[];
  toolbarPrimary?: string[];
  toolbarMore?: string[];
  searchToolbarPrimary?: string[];
  favoritesContextMenu?: string[];
  favoritesToolbarMore?: string[];
}

const buildFileData = (buildName: (fileRandom: string) => string, data: Omit<TestFileData, 'name' | 'random'>): TestFileData => {
  const fileRandom = Utils.random();
  return { random: fileRandom, name: buildName(fileRandom), ...data };
};

const buildNode = (buildName: (fileRandom: string) => string): TestNode => {
  const fileRandom = Utils.random();
  return { random: fileRandom, name: buildName(fileRandom) };
};

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

export const collaboratorToolbarPrimary = ['Shared Link Settings', 'View', 'View Details', 'More Actions'];
export const collaboratorEditRowToolbarMore = [
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Copy',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
export const favoritesCollaboratorToolbarMore = [
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
export const collaboratorSharedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Print', 'View Details', 'More Actions'];
export const collaboratorViewerLockedToolbarPrimary = ['Activate full-screen mode', 'View Details', 'More Actions'];
export const collaboratorDocToolbarMore = [
  'Edit in Microsoft Office™',
  'Edit Offline',
  'Upload New Version',
  'Remove Favorite',
  'Copy',
  'Manage Versions',
  'Edit Aspects',
  'Permissions'
];
export const collaboratorLockCurrentUserToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy'];
export const collaboratorLockOtherUserToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Move', 'Copy', 'Permissions'];
export const collaboratorLockOtherUserSearchToolbarMore = ['Cancel Editing', 'Remove Favorite', 'Copy', 'Permissions'];

// ---- VIEWER ----

const consumerViewerSharedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
const consumerViewerToolbarPrimary = ['Activate full-screen mode', 'Share', 'Download', 'Print', 'View Details', 'More Actions'];
const consumerViewerLockedToolbarPrimary = ['Activate full-screen mode', 'View Details', 'More Actions'];
const consumerViewerFavToolbarMore = ['Remove Favorite', 'Copy', 'Manage Versions'];
const consumerViewerToolbarMore = ['Favorite', 'Copy', 'Manage Versions'];
const consumerViewerLockedToolbarMore = ['Favorite', 'Copy'];
const consumerViewerLockedFavToolbarMore = ['Remove Favorite', 'Copy'];

// ---- FAVORITES workarounds ----

const favoritesConsumerToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];

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

const sharedConsumerToolbarMore = ['Upload New Version', 'Favorite', 'Copy', 'Manage Versions'];
const sharedConsumerLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions'];
const sharedConsumerFavToolbarMore = ['Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
const sharedConsumerFavLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
const sharedConsumerContextMenu = ['Shared Link Settings', 'Download', 'View', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions'];
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

const sharedConsumerFavContextMenu = ['Shared Link Settings', 'Download', 'View', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];

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

export const fileDocx = buildFileData((fileRandom) => `file-${fileRandom}-docx.docx`, {
  description: 'file not shared, not fav, office, not locked',

  contextMenu: consumerContextMenu,
  toolbarPrimary: consumerToolbarPrimary,
  toolbarMore: consumerToolbarMore,
  viewerToolbarPrimary: consumerViewerToolbarPrimary,
  viewerToolbarMore: consumerViewerToolbarMore,

  searchToolbarPrimary: searchConsumerToolbarPrimary
});

export const fileDocxFav = buildFileData((fileRandom) => `file-${fileRandom}-docx-fav.docx`, {
  description: 'file not shared, fav, office, not locked',

  contextMenu: consumerFavContextMenu,
  toolbarPrimary: consumerToolbarPrimary,
  toolbarMore: consumerFavToolbarMore,
  viewerToolbarPrimary: consumerViewerToolbarPrimary,
  viewerToolbarMore: consumerViewerFavToolbarMore,

  favoritesToolbarMore: favoritesConsumerToolbarMore,
  favoritesContextMenu: favoritesConsumerContextMenu,

  searchToolbarPrimary: searchConsumerToolbarPrimary
});

export const file = buildFileData((fileRandom) => `file-${fileRandom}.txt`, {
  description: 'file not shared, not fav, not office, not locked',

  contextMenu: consumerContextMenu,
  toolbarPrimary: consumerToolbarPrimary,
  toolbarMore: consumerToolbarMore,
  viewerToolbarPrimary: consumerViewerToolbarPrimary,
  viewerToolbarMore: consumerViewerToolbarMore,

  searchToolbarPrimary: searchConsumerToolbarPrimary
});

export const fileFav = buildFileData((fileRandom) => `file-${fileRandom}-fav.txt`, {
  description: 'file not shared, fav, not office, not locked',

  contextMenu: consumerFavContextMenu,
  toolbarPrimary: consumerToolbarPrimary,
  toolbarMore: consumerFavToolbarMore,
  viewerToolbarPrimary: consumerViewerToolbarPrimary,
  viewerToolbarMore: consumerViewerFavToolbarMore,

  favoritesToolbarMore: favoritesConsumerToolbarMore,
  favoritesContextMenu: favoritesConsumerContextMenu,

  searchToolbarPrimary: searchConsumerToolbarPrimary
});

export const fileDocxShared = buildFileData((fileRandom) => `file-${fileRandom}-docx-shared.docx`, {
  description: 'file shared, not fav, office, not locked',

  contextMenu: consumerSharedContextMenu,
  toolbarPrimary: consumerSharedToolbarPrimary,
  toolbarMore: consumerToolbarMore,
  viewerToolbarPrimary: consumerViewerSharedToolbarPrimary,
  viewerToolbarMore: consumerViewerToolbarMore,

  sharedToolbarMore: sharedConsumerToolbarMore,
  sharedContextMenu: sharedConsumerContextMenu,

  searchToolbarPrimary: searchConsumerSharedToolbarPrimary
});

export const fileDocxSharedFav = buildFileData((fileRandom) => `file-${fileRandom}-docx-shared-fav.docx`, {
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
});

export const fileShared = buildFileData((fileRandom) => `file-${fileRandom}-shared.txt`, {
  description: 'file shared, not fav, not office, not locked',

  contextMenu: consumerSharedContextMenu,
  toolbarPrimary: consumerSharedToolbarPrimary,
  toolbarMore: consumerToolbarMore,
  viewerToolbarPrimary: consumerViewerSharedToolbarPrimary,
  viewerToolbarMore: consumerViewerToolbarMore,

  sharedToolbarMore: sharedConsumerToolbarMore,
  sharedContextMenu: sharedConsumerContextMenu,

  searchToolbarPrimary: searchConsumerSharedToolbarPrimary
});

export const fileSharedFav = buildFileData((fileRandom) => `file-${fileRandom}-shared-fav.txt`, {
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
});

export const fileLocked = buildFileData((fileRandom) => `file-${fileRandom}-locked.txt`, {
  description: 'file not shared, not fav, not office, locked',

  contextMenu: consumerContextMenu,
  toolbarPrimary: consumerToolbarPrimary,
  toolbarMore: consumerToolbarMore,
  viewerToolbarPrimary: consumerViewerLockedToolbarPrimary,
  viewerToolbarMore: consumerViewerLockedToolbarMore,

  searchToolbarPrimary: searchConsumerToolbarPrimary
});

export const fileFavLocked = buildFileData((fileRandom) => `file-${fileRandom}-fav-locked.txt`, {
  description: 'file not shared, fav, not office, locked',

  contextMenu: consumerFavContextMenu,
  toolbarPrimary: consumerToolbarPrimary,
  toolbarMore: consumerFavToolbarMore,
  viewerToolbarPrimary: consumerViewerLockedToolbarPrimary,
  viewerToolbarMore: consumerViewerLockedFavToolbarMore,

  favoritesToolbarMore: favoritesConsumerToolbarMore,
  favoritesContextMenu: favoritesConsumerContextMenu,

  searchToolbarPrimary: searchConsumerToolbarPrimary
});

export const fileSharedLocked = buildFileData((fileRandom) => `file-${fileRandom}-shared-locked.txt`, {
  description: 'file shared, not fav, not office, locked',

  contextMenu: consumerSharedContextMenu,
  toolbarPrimary: consumerSharedToolbarPrimary,
  toolbarMore: consumerToolbarMore,
  viewerToolbarPrimary: consumerViewerLockedToolbarPrimary,
  viewerToolbarMore: consumerViewerLockedToolbarMore,

  sharedToolbarMore: sharedConsumerLockedToolbarMore,
  sharedContextMenu: sharedConsumerLockedContextMenu,

  searchToolbarPrimary: searchConsumerSharedToolbarPrimary
});

export const fileSharedFavLocked = buildFileData((fileRandom) => `file-${fileRandom}-shared-fav-locked.txt`, {
  description: 'file shared, fav, not office, locked',

  contextMenu: consumerSharedFavContextMenu,
  toolbarPrimary: consumerSharedToolbarPrimary,
  toolbarMore: consumerFavToolbarMore,
  viewerToolbarPrimary: consumerViewerLockedToolbarPrimary,
  viewerToolbarMore: consumerViewerLockedFavToolbarMore,

  favoritesToolbarMore: favoritesConsumerToolbarMore,
  favoritesContextMenu: favoritesConsumerSharedContextMenu,

  sharedToolbarMore: sharedConsumerFavLockedToolbarMore,
  sharedContextMenu: sharedConsumerFavLockedContextMenu,

  searchToolbarPrimary: searchConsumerSharedToolbarPrimary
});

export const fileLockedByUser = buildNode((fileRandom) => `file-${fileRandom}-my-locked.txt`);

// ---- non-versionable file (no cm:versionable aspect) ----

const consumerNotVersionableToolbarMore = ['Favorite', 'Copy'];
const consumerNotVersionableContextMenu = ['Share', 'Download', 'View', 'Favorite', 'Copy'];
const consumerViewerNotVersionableToolbarMore = ['Favorite', 'Copy'];

export const fileNotVersionable = buildFileData((fileRandom) => `file-${fileRandom}-not-versionable.txt`, {
  description: 'file not shared, not fav, not office, not locked, not versionable - should not show Manage Versions',

  contextMenu: consumerNotVersionableContextMenu,
  toolbarPrimary: consumerToolbarPrimary,
  toolbarMore: consumerNotVersionableToolbarMore,
  viewerToolbarPrimary: consumerViewerToolbarPrimary,
  viewerToolbarMore: consumerViewerNotVersionableToolbarMore,

  searchToolbarPrimary: searchConsumerToolbarPrimary
});

// ---- multiple selection ---

const multipleSelContextMenu = ['Download', 'Favorite', 'Copy'];
const multipleSelAllFavContextMenu = ['Download', 'Remove Favorite', 'Copy'];
const multipleSelToolbarPrimary = ['Download', 'View Details', 'More Actions'];
const multipleSelToolbarMore = ['Favorite', 'Copy'];
const multipleSelAllFavToolbarMore = ['Remove Favorite', 'Copy'];
const searchMultipleSelToolbarPrimary = ['Download', 'View Details', 'More Actions'];

// ---- FAVORITES workarounds ----

const favoritesMultipleSelContextMenu = ['Download', 'Favorite', 'Move', 'Copy', 'Delete'];
const favoritesMultipleSelToolbarMore = ['Favorite', 'Move', 'Copy', 'Delete'];
const favoritesMultipleSelAllFavContextMenu = ['Download', 'Remove Favorite', 'Move', 'Copy', 'Delete'];
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
