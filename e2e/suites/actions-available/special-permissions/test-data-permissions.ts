import { Utils } from '../../../utilities/utils';


// ----- files -----

const consumerContextMenu = ['Share', 'Download', 'View', 'Favorite', 'Copy', 'Manage Versions'];
const consumerFavContextMenu = ['Share', 'Download', 'View', 'Remove Favorite', 'Copy', 'Manage Versions'];
const consumerSharedContextMenu = ['Shared Link Settings', 'Download', 'View', 'Favorite', 'Copy', 'Manage Versions'];
const consumerSharedFavContextMenu = ['Shared Link Settings', 'Download', 'View', 'Remove Favorite', 'Copy', 'Manage Versions'];

const consumerToolbarPrimary = ['Share', 'Download', 'View', 'View Details', 'More Actions'];
const consumerSharedToolbarPrimary = ['Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];

const searchConsumerToolbarPrimary = ['Toggle search filter', 'Share', 'Download', 'View', 'View Details', 'More Actions'];
const searchConsumerSharedToolbarPrimary = ['Toggle search filter', 'Shared Link Settings', 'Download', 'View', 'View Details', 'More Actions'];

const consumerToolbarMore = ['Favorite', 'Copy', 'Manage Versions'];
const consumerFavToolbarMore = ['Remove Favorite', 'Copy', 'Manage Versions'];

// ---- VIEWER ----

const consumerViewerSharedToolbarPrimary = ['Activate full-screen mode', 'Shared Link Settings', 'Download', 'Print', 'View Details', 'More Actions'];
const consumerViewerToolbarPrimary = ['Activate full-screen mode', 'Share', 'Download', 'Print', 'View Details', 'More Actions'];
const consumerViewerFavToolbarMore = ['Remove Favorite', 'Copy', 'Manage Versions'];
const consumerViewerToolbarMore = ['Favorite', 'Copy', 'Manage Versions'];

// ---- FAVORITES workarounds ----

// TODO: remove 'Move' and 'Delete' when ACA-1737 is done
// TODO: remove 'Upload New Version' when ACA-2175 is done
const favoritesConsumerToolbarMore = ['Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// TODO: remove 'Move' and 'Delete' when ACA-1737 is done
// TODO: remove 'Upload New Version' when ACA-2175 is done
const favoritesConsumerContextMenu = ['Share', 'Download', 'View', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// TODO: remove 'Move' and 'Delete' when ACA-1737 is done
// TODO: remove 'Upload New Version' when ACA-2175 is done
// TODO: change 'Share' into 'Shared Link Settings' when ACA-2175 is done
const favoritesConsumerSharedContextMenu = ['Share', 'Download', 'View', 'Upload New Version', 'Remove Favorite', 'Move', 'Copy', 'Delete', 'Manage Versions'];
// TODO: change 'Share' into 'Shared Link Settings' when ACA-2175 is done
const favoritesConsumerSharedToolbarPrimary = ['Share', 'Download', 'View', 'View Details', 'More Actions'];


// ---- SHARED FILES workaround ----

// TODO: remove 'Upload New Version' when ACA-2173 is done
const sharedConsumerToolbarMore = ['Upload New Version', 'Favorite', 'Copy', 'Manage Versions'];
// TODO: remove 'Upload New Version' when ACA-2173 is done
const sharedConsumerFavToolbarMore = ['Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];
// TODO: remove 'Upload New Version' when ACA-2173 is done
const sharedConsumerContextMenu = ['Shared Link Settings', 'Download', 'View', 'Upload New Version', 'Favorite', 'Copy', 'Manage Versions'];
// TODO: remove 'Upload New Version' when ACA-2173 is done
const sharedConsumerFavContextMenu = ['Shared Link Settings', 'Download', 'View', 'Upload New Version', 'Remove Favorite', 'Copy', 'Manage Versions'];


export const fileDocx = {
  name: `file-docx-${Utils.random()}.docx`,
  description: 'file not shared, not fav, office, not locked',

  contextMenu: consumerContextMenu,
  toolbarPrimary: consumerToolbarPrimary,
  toolbarMore: consumerToolbarMore,
  viewerToolbarPrimary: consumerViewerToolbarPrimary,
  viewerToolbarMore: consumerViewerToolbarMore,

  searchToolbarPrimary: searchConsumerToolbarPrimary
};

export const fileDocxFav = {
  name: `file-docx-fav-${Utils.random()}.docx`,
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
  name: `file-${Utils.random()}.txt`,
  description: 'file not shared, not fav, not office, not locked',

  contextMenu: consumerContextMenu,
  toolbarPrimary: consumerToolbarPrimary,
  toolbarMore: consumerToolbarMore,
  viewerToolbarPrimary: consumerViewerToolbarPrimary,
  viewerToolbarMore: consumerViewerToolbarMore,

  searchToolbarPrimary: searchConsumerToolbarPrimary
};

export const fileFav = {
  name: `file-fav-${Utils.random()}.txt`,
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
  name: `file-docx-shared-${Utils.random()}.docx`,
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
  name: `file-docx-shared-fav-${Utils.random()}.docx`,
  description: 'file shared, fav, office, not locked',

  contextMenu: consumerSharedFavContextMenu,
  toolbarPrimary: consumerSharedToolbarPrimary,
  toolbarMore: consumerFavToolbarMore,
  viewerToolbarPrimary: consumerViewerSharedToolbarPrimary,
  viewerToolbarMore: consumerViewerFavToolbarMore,

  favoritesToolbarMore: favoritesConsumerToolbarMore,
  favoritesContextMenu: favoritesConsumerSharedContextMenu,
  favoritesToolbarPrimary: favoritesConsumerSharedToolbarPrimary,

  sharedToolbarMore: sharedConsumerFavToolbarMore,
  sharedContextMenu: sharedConsumerFavContextMenu,

  searchToolbarPrimary: searchConsumerSharedToolbarPrimary
};

export const fileShared = {
  name: `file-shared-${Utils.random()}.txt`,
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
  name: `file-shared-fav-${Utils.random()}.txt`,
  description: 'file shared, fav, not office, not locked',

  contextMenu: consumerSharedFavContextMenu,
  toolbarPrimary: consumerSharedToolbarPrimary,
  toolbarMore: consumerFavToolbarMore,
  viewerToolbarPrimary: consumerViewerSharedToolbarPrimary,
  viewerToolbarMore: consumerViewerFavToolbarMore,

  favoritesToolbarMore: favoritesConsumerToolbarMore,
  favoritesContextMenu: favoritesConsumerSharedContextMenu,
  favoritesToolbarPrimary: favoritesConsumerSharedToolbarPrimary,

  sharedToolbarMore: sharedConsumerFavToolbarMore,
  sharedContextMenu: sharedConsumerFavContextMenu,

  searchToolbarPrimary: searchConsumerSharedToolbarPrimary
};

export const fileLocked = {
  name: `file-locked-${Utils.random()}.txt`,
  description: 'file not shared, not fav, not office, locked',

  contextMenu: consumerContextMenu,
  toolbarPrimary: consumerToolbarPrimary,
  toolbarMore: consumerToolbarMore,
  viewerToolbarPrimary: consumerViewerToolbarPrimary,
  viewerToolbarMore: consumerViewerToolbarMore,

  searchToolbarPrimary: searchConsumerToolbarPrimary
};

export const fileFavLocked = {
  name: `file-fav-locked-${Utils.random()}.txt`,
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
  name: `file-shared-locked-${Utils.random()}.txt`,
  description: 'file shared, not fav, not office, locked',

  contextMenu: consumerSharedContextMenu,
  toolbarPrimary: consumerSharedToolbarPrimary,
  toolbarMore: consumerToolbarMore,
  viewerToolbarPrimary: consumerViewerSharedToolbarPrimary,
  viewerToolbarMore: consumerViewerToolbarMore,

  sharedToolbarMore: sharedConsumerToolbarMore,
  sharedContextMenu: sharedConsumerContextMenu,

  searchToolbarPrimary: searchConsumerSharedToolbarPrimary
};

export const fileSharedFavLocked = {
  name: `file-shared-fav-locked-${Utils.random()}.txt`,
  description: 'file shared, fav, not office, locked',

  contextMenu: consumerSharedFavContextMenu,
  toolbarPrimary: consumerSharedToolbarPrimary,
  toolbarMore: consumerFavToolbarMore,
  viewerToolbarPrimary: consumerViewerSharedToolbarPrimary,
  viewerToolbarMore: consumerViewerFavToolbarMore,

  favoritesToolbarMore: favoritesConsumerToolbarMore,
  favoritesContextMenu: favoritesConsumerSharedContextMenu,
  favoritesToolbarPrimary: favoritesConsumerSharedToolbarPrimary,

  sharedToolbarMore: sharedConsumerFavToolbarMore,
  sharedContextMenu: sharedConsumerFavContextMenu,

  searchToolbarPrimary: searchConsumerSharedToolbarPrimary
};

// ---- folders ---

const consumerFolderContextMenu = ['Download', 'Favorite', 'Copy'];
const consumerFolderToolbarPrimary = ['Download', 'View Details', 'More Actions'];
const consumerFolderToolbarMore = ['Favorite', 'Copy'];
const searchConsumerFolderToolbarPrimary = ['Toggle search filter', 'Download', 'View Details', 'More Actions'];
const consumerFolderFavContextMenu = ['Download', 'Remove Favorite', 'Copy'];
const consumerFolderFavToolbarMore = ['Remove Favorite', 'Copy'];

// ---- FAVORITES workarounds ----

// TODO: remove 'Edit', 'Move' and 'Delete' when ACA-1737 is done
const favoritesConsumerFolderContextMenu = ['Download', 'Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete'];
// TODO: remove 'Edit', 'Move' and 'Delete' when ACA-1737 is done
const favoritesConsumerFolderToolbarMore = ['Edit', 'Remove Favorite', 'Move', 'Copy', 'Delete'];

export const folder = {
  name: `folder-${Utils.random()}`,
  description: 'folder not favorite',
  contextMenu: consumerFolderContextMenu,
  toolbarPrimary: consumerFolderToolbarPrimary,
  toolbarMore: consumerFolderToolbarMore,

  searchToolbarPrimary: searchConsumerFolderToolbarPrimary
};

export const folderFav = {
  name: `folder-fav-${Utils.random()}`,
  description: 'folder favorite',
  contextMenu: consumerFolderFavContextMenu,
  toolbarPrimary: consumerFolderToolbarPrimary,
  toolbarMore: consumerFolderFavToolbarMore,

  favoritesContextMenu: favoritesConsumerFolderContextMenu,
  favoritesToolbarMore: favoritesConsumerFolderToolbarMore,

  searchToolbarPrimary: searchConsumerFolderToolbarPrimary,
};

export const folderFav2 = {
  name: `folder-fav-2-${Utils.random()}`,
  description: 'folder 2 favorite'
};

// ---- multiple selection ---

const multipleSelContextMenu = ['Download', 'Favorite', 'Copy'];
const multipleSelAllFavContextMenu = ['Download', 'Remove Favorite', 'Copy'];
const multipleSelToolbarPrimary = ['Download', 'View Details', 'More Actions'];
const multipleSelToolbarMore = ['Favorite', 'Copy'];
const multipleSelAllFavToolbarMore = ['Remove Favorite', 'Copy'];
const searchMultipleSelToolbarPrimary = ['Toggle search filter', 'Download', 'View Details', 'More Actions'];

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
}

export const multipleSelAllFav = {
  contextMenu: multipleSelAllFavContextMenu,
  toolbarPrimary: multipleSelToolbarPrimary,
  toolbarMore: multipleSelAllFavToolbarMore,

  favoritesContextMenu: favoritesMultipleSelAllFavContextMenu,
  favoritesToolbarMore: favoritesMultipleSelAllFavToolbarMore,

  searchToolbarPrimary: searchMultipleSelToolbarPrimary
}
