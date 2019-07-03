import { Utils } from '../../../utilities/utils';


// ---- multiple selection ---

export const trashActions = ['Permanently Delete', 'Restore'];


// ---- single selection ----

const memberFavContextMenu = ['Leave Library', 'Delete', 'Remove Favorite'];
const memberNotFavContextMenu = ['Leave Library', 'Delete', 'Favorite'];
const memberToolbarPrimary = ['Leave Library', 'View Details', 'More Actions'];
const favToolbarMore = ['Delete', 'Remove Favorite'];
const notFavToolbarMore = ['Delete', 'Favorite'];
const searchMemberToolbarPrimary = ['Toggle search filter', 'Leave Library', 'View Details', 'More Actions'];
const searchReqJoinToolbarPrimary = ['Toggle search filter', 'Cancel Join Request', 'View Details', 'More Actions'];
const searchNotMemberToolbarPrimary = ['Toggle search filter', 'Join', 'View Details', 'More Actions'];
const reqJoinToolbarMore = ['Cancel Join Request', 'View Details', 'More Actions'];
const notMemberFavContextMenu = ['Join', 'Delete', 'Remove Favorite'];
const notMemberNotFavContextMenu = ['Join', 'Delete', 'Favorite'];
const notMemberToolbarPrimary = ['Join', 'View Details', 'More Actions'];
const reqJoinNotFavContextMenu = ['Cancel Join Request', 'Delete', 'Favorite'];
const reqJoinFavContextMenu = ['Cancel Join Request', 'Delete', 'Remove Favorite'];


export const publicUserMemberFav = {
  name: `site-public-member-fav-${Utils.random()}`,
  description: 'public site, user member, user favorite',
  contextMenu: memberFavContextMenu,
  toolbarPrimary: memberToolbarPrimary,
  toolbarMore: favToolbarMore,

  searchToolbarPrimary: searchMemberToolbarPrimary
};

export const privateUserMemberFav = {
  name: `site-private-member-fav-${Utils.random()}`,
  description: 'private site, user member, user favorite',
  contextMenu: memberFavContextMenu,
  toolbarPrimary: memberToolbarPrimary,
  toolbarMore: favToolbarMore,

  searchToolbarPrimary: searchMemberToolbarPrimary
};

export const moderatedUserMemberFav = {
  name: `site-moderated-member-fav-${Utils.random()}`,
  description: 'moderated site, user member, user favorite',
  contextMenu: memberFavContextMenu,
  toolbarPrimary: memberToolbarPrimary,
  toolbarMore: favToolbarMore,

  searchToolbarPrimary: searchMemberToolbarPrimary
};

export const publicUserMemberNotFav = {
  name: `site-public-member-not-fav-${Utils.random()}`,
  description: 'public site, user member, not favorite',
  contextMenu: memberNotFavContextMenu,
  toolbarPrimary: memberToolbarPrimary,
  toolbarMore: notFavToolbarMore,

  searchToolbarPrimary: searchMemberToolbarPrimary
};

export const privateUserMemberNotFav = {
  name: `site-private-member-not-fav-${Utils.random()}`,
  description: 'private site, user member, not favorite',
  contextMenu: memberNotFavContextMenu,
  toolbarPrimary: memberToolbarPrimary,
  toolbarMore: notFavToolbarMore,

  searchToolbarPrimary: searchMemberToolbarPrimary
};

export const moderatedUserMemberNotFav = {
  name: `site-moderated-member-not-fav-${Utils.random()}`,
  description: 'moderated site, user member, not favorite',
  contextMenu: memberNotFavContextMenu,
  toolbarPrimary: memberToolbarPrimary,
  toolbarMore: notFavToolbarMore,

  searchToolbarPrimary: searchMemberToolbarPrimary
};

export const publicNotMemberFav = {
  name: `site-public-not-member-fav-${Utils.random()}`,
  description: 'public site, user not member, user favorite',
  contextMenu: notMemberFavContextMenu,
  toolbarPrimary: notMemberToolbarPrimary,
  toolbarMore: favToolbarMore,

  searchToolbarPrimary: searchNotMemberToolbarPrimary
};

export const moderatedNotMemberFav = {
  name: `site-moderated-not-member-fav-${Utils.random()}`,
  description: 'moderated site, user not member, user favorite',
  contextMenu: notMemberFavContextMenu,
  toolbarPrimary: notMemberToolbarPrimary,
  toolbarMore: favToolbarMore,

  searchToolbarPrimary: searchNotMemberToolbarPrimary
};

export const publicNotMemberNotFav = {
  name: `site-public-not-member-not-fav-${Utils.random()}`,
  description: 'public site, user not member, not favorite',
  contextMenu: notMemberNotFavContextMenu,
  toolbarPrimary: notMemberToolbarPrimary,
  toolbarMore: notFavToolbarMore,

  searchToolbarPrimary: searchNotMemberToolbarPrimary
};

export const moderatedNotMemberNotFav = {
  name: `site-moderated-not-member-not-fav-${Utils.random()}`,
  description: 'moderated site, user not member, not favorite',
  contextMenu: notMemberNotFavContextMenu,
  toolbarPrimary: notMemberToolbarPrimary,
  toolbarMore: notFavToolbarMore,

  searchToolbarPrimary: searchNotMemberToolbarPrimary
};

export const moderatedRequestedJoinFav = {
  name: `site-moderated-req-join-fav-${Utils.random()}`,
  description: 'moderated site, user requested join, user favorite',
  contextMenu: reqJoinFavContextMenu,
  toolbarPrimary: reqJoinToolbarMore,
  toolbarMore: favToolbarMore,

  searchToolbarPrimary: searchReqJoinToolbarPrimary
};

export const moderatedRequestedJoinNotFav = {
  name: `site-moderated-req-join-not-fav-${Utils.random()}`,
  description: 'moderated site, user requested join, not favorite',
  contextMenu: reqJoinNotFavContextMenu,
  toolbarPrimary: reqJoinToolbarMore,
  toolbarMore: notFavToolbarMore,

  searchToolbarPrimary: searchReqJoinToolbarPrimary
};

export const siteInTrash = {
  name: `deleted-site-${Utils.random()}`,
  trashActions
};

export const site2InTrash = {
  name: `deleted-site2-${Utils.random()}`,
  trashActions
};

