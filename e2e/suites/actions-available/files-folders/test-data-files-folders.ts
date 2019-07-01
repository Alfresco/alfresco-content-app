import { Utils } from '../../../utilities/utils';

export const trashActions = ['Permanently Delete', 'Restore'];

// ----- files -----

const fileContextMenu = ['Share', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileSharedFavLockedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileToolbarPrimary = ['Share', 'Download', 'View', 'View Details', 'More Actions'];
const fileToolbarMore = ['Edit Offline', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileDocxToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileDocxContextMenu = ['Edit in Microsoft Office™', 'Share', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileSharedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
const fileFavLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileDocxFavContextMenu = ['Edit in Microsoft Office™', 'Share', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileDocxFavToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileDocxSharedFavContextMenu = ['Edit in Microsoft Office™', 'Shared Link Settings', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileDocxSharedContextMenu = ['Edit in Microsoft Office™', 'Shared Link Settings', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileFavContextMenu = ['Share', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileFavToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileSharedFavContextMenu = ['Shared Link Settings', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileSharedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileFavLockedContextMenu = ['Share', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileLockedContextMenu = ['Share', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const fileSharedLockedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];

// ---- VIEWER ----

const viewerSharedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
const viewerToolbarPrimary = ['Activate full-screen mode', 'Share', 'Download', 'Print', 'View Details', 'More Actions'];
const viewerToolbarMore = ['Edit Offline', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const viewerFavToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const viewerDocxToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const viewerFavLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const viewerDocxFavToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
const viewerLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];


// ---- FAVORITES workarounds ----

// TODO: add Edit Offline when ACA-2174 is fixed
// TODO: change 'Share' into 'Shared Link Settings' when ACA-2175 is done
// TODO: investigate why 'Edit in Microsoft Office™' and 'Permissions' are not displayed and raise issue

// TODO: change 'Share' into 'Shared Link Settings' when ACA-2175 is done
const favoritesSharedToolbarPrimary = ['Share', 'Download', 'View', 'View Details', 'More Actions'];
// TODO: add Edit Offline when ACA-2174 is fixed
// TODO: investigate why 'Edit in Microsoft Office™' and 'Permissions' are not displayed and raise issue
const favoritesContextMenu = ['Share', 'Download', 'View', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// TODO: add Edit Offline when ACA-2174 is fixed
// TODO: investigate why 'Edit in Microsoft Office™' and 'Permissions' are not displayed and raise issue
const favoritesToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// TODO: add Edit Offline when ACA-2174 is fixed
// TODO: investigate why 'Edit in Microsoft Office™' and 'Permissions' are not displayed and raise issue
// TODO: change 'Share' into 'Shared Link Settings' when ACA-2175 is done
const favoritesSharedContextMenu = ['Share', 'Download', 'View', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];

// ---- SEARCH workarounds ----

const searchDocxContextMenu = ['Edit in Microsoft Office™', 'Share', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchToolbarPrimary = ['Toggle search filter', 'Share', 'Download', 'View', 'View Details', 'More Actions'];
const searchSharedToolbarPrimary = ['Toggle search filter', 'Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];
const searchFavLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchSharedFavLockedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchDocxToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchFavContextMenu = ['Share', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchSharedLockedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchDocxFavContextMenu = ['Edit in Microsoft Office™', 'Share', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchDocxFavToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchSharedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchToolbarMore = ['Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchDocxSharedFavContextMenu = ['Edit in Microsoft Office™', 'Shared Link Settings', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchDocxSharedContextMenu = ['Edit in Microsoft Office™', 'Shared Link Settings', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchFavToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchContextMenu = ['Share', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchFavLockedContextMenu = ['Share', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchLockedContextMenu = ['Share', 'Download', 'View', 'Cancel Editing', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchSharedFavContextMenu = ['Shared Link Settings', 'Download', 'View', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];

const searchViewerToolbarMore = ['Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchViewerFavToolbarMore = ['Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchViewerDocxToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchViewerFavLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchViewerDocxFavToolbarMore = ['Edit in Microsoft Office™', 'Edit Offline', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions', 'Permissions'];
const searchViewerLockedToolbarMore = ['Cancel Editing', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions', 'Permissions'];

// ---- SHARED workarounds ----

// TODO: add Edit Offline to expectedContextMenu when ACA-2173 is fixed
const sharedFilesDocxContextMenu = ['Edit in Microsoft Office™', 'Shared Link Settings', 'Download', 'View', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
// TODO: add Edit Offline to expectedToolbarMore when ACA-2173 is fixed
const sharedFilesDocxToolbarMore = ['Edit in Microsoft Office™', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
// TODO: add Edit Offline to expectedContextMenu when ACA-2173 is fixed
const sharedFilesDocxSharedFavContextMenu = ['Edit in Microsoft Office™', 'Shared Link Settings', 'Download', 'View', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
// TODO: add Edit Offline to expectedToolbarMore when ACA-2173 is fixed
const sharedFilesDocxSharedFavToolbarMore = ['Edit in Microsoft Office™', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
// TODO: add Cancel Editing to expectedContextMenu when ACA-2173 is fixed
const sharedFilesSharedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
// TODO: add Cancel Editing to expectedToolbarMore when ACA-2173 is fixed
const sharedFilesSharedToolbarMore = ['Upload New Version', 'Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
// TODO: add Edit Offline to expectedToolbarMore when ACA-2173 is fixed
const sharedFilesFavSharedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];
// TODO: add Cancel Editing to expectedToolbarMore when ACA-2173 is fixed
const sharedFilesSharedFavToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions', 'Permissions'];




export const fileDocx = {
  name: `file-docx-${Utils.random()}.docx`,
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
  name: `file-docx-fav-${Utils.random()}.docx`,
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
  searchViewerToolbarMore: searchViewerDocxFavToolbarMore,
};

export const file = {
  name: `file-${Utils.random()}.txt`,
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
  name: `file-fav-${Utils.random()}.txt`,
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
  name: `file-docx-shared-${Utils.random()}.docx`,
  description: 'file shared, not fav, office, not locked',

  contextMenu: fileDocxSharedContextMenu,
  toolbarPrimary: fileSharedToolbarPrimary,
  toolbarMore: fileDocxToolbarMore,
  viewerToolbarPrimary: viewerSharedToolbarPrimary,
  viewerToolbarMore: viewerDocxToolbarMore,

  searchContextMenu: searchDocxSharedContextMenu,
  searchToolbarPrimary: searchSharedToolbarPrimary,
  searchToolbarMore: searchDocxToolbarMore,
  searchViewerToolbarMore: searchViewerDocxToolbarMore,

  sharedContextMenu: sharedFilesDocxContextMenu,
  sharedToolbarMore: sharedFilesDocxToolbarMore
};

export const fileDocxSharedFav = {
  name: `file-docx-shared-fav-${Utils.random()}.docx`,
  description: 'file shared, fav, office, not locked',

  contextMenu: fileDocxSharedFavContextMenu,
  toolbarPrimary: fileSharedToolbarPrimary,
  toolbarMore: fileDocxFavToolbarMore,
  viewerToolbarPrimary: viewerSharedToolbarPrimary,
  viewerToolbarMore: viewerDocxFavToolbarMore,

  favoritesContextMenu: favoritesSharedContextMenu,
  favoritesToolbarPrimary: favoritesSharedToolbarPrimary,
  favoritesToolbarMore,

  searchContextMenu: searchDocxSharedFavContextMenu,
  searchToolbarPrimary: searchSharedToolbarPrimary,
  searchToolbarMore: searchDocxFavToolbarMore,
  searchViewerToolbarMore: searchViewerDocxFavToolbarMore,

  sharedContextMenu: sharedFilesDocxSharedFavContextMenu,
  sharedToolbarMore: sharedFilesDocxSharedFavToolbarMore
};

export const fileShared = {
  name: `file-shared-${Utils.random()}.txt`,
  description: 'file shared, not fav, not office, not locked',

  contextMenu: fileSharedContextMenu,
  toolbarPrimary: fileSharedToolbarPrimary,
  toolbarMore: fileToolbarMore,
  viewerToolbarPrimary: viewerSharedToolbarPrimary,
  viewerToolbarMore,

  searchContextMenu: searchSharedContextMenu,
  searchToolbarPrimary: searchSharedToolbarPrimary,
  searchToolbarMore,
  searchViewerToolbarMore,

  sharedContextMenu: sharedFilesSharedContextMenu,
  sharedToolbarMore: sharedFilesSharedToolbarMore
};

export const fileSharedFav = {
  name: `file-shared-fav-${Utils.random()}.txt`,
  description: 'file shared, fav, not office, not locked',

  contextMenu: fileSharedFavContextMenu,
  toolbarPrimary: fileSharedToolbarPrimary,
  toolbarMore: fileFavToolbarMore,
  viewerToolbarPrimary: viewerSharedToolbarPrimary,
  viewerToolbarMore: viewerFavToolbarMore,

  favoritesContextMenu: favoritesSharedContextMenu,
  favoritesToolbarPrimary: favoritesSharedToolbarPrimary,
  favoritesToolbarMore,

  searchContextMenu: searchSharedFavContextMenu,
  searchToolbarPrimary: searchSharedToolbarPrimary,
  searchToolbarMore: searchFavToolbarMore,
  searchViewerToolbarMore: searchViewerFavToolbarMore,

  sharedContextMenu: sharedFilesFavSharedContextMenu,
  sharedToolbarMore: sharedFilesSharedFavToolbarMore
};

export const fileLocked = {
  name: `file-locked-${Utils.random()}.txt`,
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
  name: `file-fav-locked-${Utils.random()}.txt`,
  description: 'file not shared, fav, not office, locked',

  contextMenu: fileFavLockedContextMenu,
  toolbarPrimary: fileToolbarPrimary,
  toolbarMore: fileFavLockedToolbarMore,
  viewerToolbarPrimary,
  viewerToolbarMore: viewerFavLockedToolbarMore,

  favoritesContextMenu,
  favoritesToolbarMore,

  searchContextMenu: searchFavLockedContextMenu,
  searchToolbarPrimary,
  searchToolbarMore: searchFavLockedToolbarMore,
  searchViewerToolbarMore: searchViewerFavLockedToolbarMore
};

export const fileSharedLocked = {
  name: `file-shared-locked-${Utils.random()}.txt`,
  description: 'file shared, not fav, not office, locked',

  contextMenu: fileSharedLockedContextMenu,
  toolbarPrimary: fileSharedToolbarPrimary,
  toolbarMore: fileLockedToolbarMore,
  viewerToolbarPrimary: viewerSharedToolbarPrimary,
  viewerToolbarMore: viewerLockedToolbarMore,

  searchContextMenu: searchSharedLockedContextMenu,
  searchToolbarPrimary: searchSharedToolbarPrimary,
  searchToolbarMore: searchLockedToolbarMore,
  searchViewerToolbarMore: searchViewerLockedToolbarMore,

  sharedContextMenu: sharedFilesSharedContextMenu,
  sharedToolbarMore: sharedFilesSharedToolbarMore
};

export const fileSharedFavLocked = {
  name: `file-shared-fav-locked-${Utils.random()}.txt`,
  description: 'file shared, fav, not office, locked',

  contextMenu: fileSharedFavLockedContextMenu,
  toolbarPrimary: fileSharedToolbarPrimary,
  toolbarMore: fileFavLockedToolbarMore,
  viewerToolbarPrimary: viewerSharedToolbarPrimary,
  viewerToolbarMore: viewerFavLockedToolbarMore,

  favoritesContextMenu: favoritesSharedContextMenu,
  favoritesToolbarPrimary: favoritesSharedToolbarPrimary,
  favoritesToolbarMore,

  searchContextMenu: searchSharedFavLockedContextMenu,
  searchToolbarPrimary: searchSharedToolbarPrimary,
  searchToolbarMore: searchFavLockedToolbarMore,
  searchViewerToolbarMore: searchViewerFavLockedToolbarMore,

  sharedContextMenu: sharedFilesFavSharedContextMenu,
  sharedToolbarMore: sharedFilesSharedFavToolbarMore
};

export const fileInTrash = {
  name: `deleted-file-${Utils.random()}.txt`,
  trashActions
};

export const file2InTrash = {
  name: `deleted-file2-${Utils.random()}.txt`,
  trashActions
};

export const folderInTrash = {
  name: `deleted-folder-${Utils.random()}`,
  trashActions
};

export const folder2InTrash = {
  name: `deleted-folder2-${Utils.random()}`,
  trashActions
};

// ---- folders ---

const folderContextMenu = ['Download', 'Edit', 'Favorite', 'Move', 'Copy', 'Delete', 'Permissions'];
const folderFavContextMenu = ['Download', 'Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Permissions'];
const folderToolbarPrimary = ['Download', 'View Details', 'More Actions'];
const folderToolbarMore = ['Edit', 'Favorite', 'Move', 'Copy', 'Delete', 'Permissions'];
const folderFavToolbarMore = ['Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Permissions'];

const favoritesFolderFavContextMenu = ['Download', 'Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete'];
const favoritesFolderFavToolbarMore = ['Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete'];

const searchFolderContextMenu = ['Download', 'Edit', 'Favorite', 'Copy', 'Permissions'];
const searchFolderToolbarPrimary = ['Toggle search filter', 'Download', 'View Details', 'More Actions'];
const searchFolderToolbarMore = ['Edit', 'Favorite', 'Copy', 'Permissions'];
const searchFolderFavContextMenu = ['Download', 'Edit', 'Remove Favorite', 'Copy', 'Permissions'];
const searchFolderFavToolbarMore = ['Edit', 'Remove Favorite', 'Copy', 'Permissions'];

export const folder = {
  name: `folder-${Utils.random()}`,
  description: 'folder not favorite',

  contextMenu: folderContextMenu,
  toolbarPrimary: folderToolbarPrimary,
  toolbarMore: folderToolbarMore,

  searchContextMenu: searchFolderContextMenu,
  searchToolbarPrimary: searchFolderToolbarPrimary,
  searchToolbarMore: searchFolderToolbarMore
};

export const folderFav = {
  name: `folder-fav-${Utils.random()}`,
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
  name: `folder-fav-2-${Utils.random()}`,
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
const searchMultipleSelToolbarPrimary = ['Toggle search filter', 'Download', 'View Details', 'More Actions'];
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
}

export const multipleSelAllFav = {
  contextMenu: multipleSelAllFavContextMenu,
  toolbarPrimary: multipleSelToolbarPrimary,
  toolbarMore: multipleSelAllFavToolbarMore,

  favoritesContextMenu: favoritesMultipleSelAllFavContextMenu,
  favoritesToolbarMore: favoritesMultipleSelAllFavToolbarMore,

  searchToolbarPrimary: searchMultipleSelToolbarPrimary,
  searchContextMenu: searchMultipleSelAllFavContextMenu,
  searchToolbarMore: searchMultipleSelAllFavToolbarMore
}
