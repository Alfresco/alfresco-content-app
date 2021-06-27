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

// ---- multiple selection ---

export const trashActions = ['Permanently Delete', 'Restore'];

// ---- single selection ----

const memberFavContextMenu = ['Leave Library', 'Delete', 'Remove Favorite'];
const memberNotFavContextMenu = ['Leave Library', 'Delete', 'Favorite'];
const memberToolbarPrimary = ['Leave Library', 'View Details', 'More Actions'];
const favToolbarMore = ['Delete', 'Remove Favorite'];
const notFavToolbarMore = ['Delete', 'Favorite'];
const searchMemberToolbarPrimary = ['Leave Library', 'View Details', 'More Actions'];
const searchReqJoinToolbarPrimary = ['Cancel Join Request', 'More Actions'];
const searchNotMemberToolbarPrimary = ['Join', 'More Actions'];
const reqJoinToolbarMore = ['Cancel Join Request', 'More Actions'];
const notMemberFavContextMenu = ['Join', 'Delete', 'Remove Favorite'];
const notMemberNotFavContextMenu = ['Join', 'Delete', 'Favorite'];
const notMemberToolbarPrimary = ['Join', 'More Actions'];
const reqJoinNotFavContextMenu = ['Cancel Join Request', 'Delete', 'Favorite'];
const reqJoinFavContextMenu = ['Cancel Join Request', 'Delete', 'Remove Favorite'];

export const publicUserMemberFav = {
  name: `actionsSite-public-member-fav-${Utils.random()}`,
  description: 'public site, user member, user favorite',
  contextMenu: memberFavContextMenu,
  toolbarPrimary: memberToolbarPrimary,
  toolbarMore: favToolbarMore,

  searchToolbarPrimary: searchMemberToolbarPrimary
};

export const privateUserMemberFav = {
  name: `actionsSite-private-member-fav-${Utils.random()}`,
  description: 'private site, user member, user favorite',
  contextMenu: memberFavContextMenu,
  toolbarPrimary: memberToolbarPrimary,
  toolbarMore: favToolbarMore,

  searchToolbarPrimary: searchMemberToolbarPrimary
};

export const moderatedUserMemberFav = {
  name: `actionsSite-moderated-member-fav-${Utils.random()}`,
  description: 'moderated site, user member, user favorite',
  contextMenu: memberFavContextMenu,
  toolbarPrimary: memberToolbarPrimary,
  toolbarMore: favToolbarMore,

  searchToolbarPrimary: searchMemberToolbarPrimary
};

export const publicUserMemberNotFav = {
  name: `actionsSite-public-member-not-fav-${Utils.random()}`,
  description: 'public site, user member, not favorite',
  contextMenu: memberNotFavContextMenu,
  toolbarPrimary: memberToolbarPrimary,
  toolbarMore: notFavToolbarMore,

  searchToolbarPrimary: searchMemberToolbarPrimary
};

export const privateUserMemberNotFav = {
  name: `actionsSite-private-member-not-fav-${Utils.random()}`,
  description: 'private site, user member, not favorite',
  contextMenu: memberNotFavContextMenu,
  toolbarPrimary: memberToolbarPrimary,
  toolbarMore: notFavToolbarMore,

  searchToolbarPrimary: searchMemberToolbarPrimary
};

export const moderatedUserMemberNotFav = {
  name: `actionsSite-moderated-member-not-fav-${Utils.random()}`,
  description: 'moderated site, user member, not favorite',
  contextMenu: memberNotFavContextMenu,
  toolbarPrimary: memberToolbarPrimary,
  toolbarMore: notFavToolbarMore,

  searchToolbarPrimary: searchMemberToolbarPrimary
};

export const publicNotMemberFav = {
  name: `actionsSite-public-not-member-fav-${Utils.random()}`,
  description: 'public site, user not member, user favorite',
  contextMenu: notMemberFavContextMenu,
  toolbarPrimary: notMemberToolbarPrimary,
  toolbarMore: favToolbarMore,

  searchToolbarPrimary: searchNotMemberToolbarPrimary
};

export const moderatedNotMemberFav = {
  name: `actionsSite-moderated-not-member-fav-${Utils.random()}`,
  description: 'moderated site, user not member, user favorite',
  contextMenu: notMemberFavContextMenu,
  toolbarPrimary: notMemberToolbarPrimary,
  toolbarMore: favToolbarMore,

  searchToolbarPrimary: searchNotMemberToolbarPrimary
};

export const publicNotMemberNotFav = {
  name: `actionsSite-public-not-member-not-fav-${Utils.random()}`,
  description: 'public site, user not member, not favorite',
  contextMenu: notMemberNotFavContextMenu,
  toolbarPrimary: notMemberToolbarPrimary,
  toolbarMore: notFavToolbarMore,

  searchToolbarPrimary: searchNotMemberToolbarPrimary
};

export const moderatedNotMemberNotFav = {
  name: `actionsSite-moderated-not-member-not-fav-${Utils.random()}`,
  description: 'moderated site, user not member, not favorite',
  contextMenu: notMemberNotFavContextMenu,
  toolbarPrimary: notMemberToolbarPrimary,
  toolbarMore: notFavToolbarMore,

  searchToolbarPrimary: searchNotMemberToolbarPrimary
};

export const moderatedRequestedJoinFav = {
  name: `actionsSite-moderated-req-join-fav-${Utils.random()}`,
  description: 'moderated site, user requested join, user favorite',
  contextMenu: reqJoinFavContextMenu,
  toolbarPrimary: reqJoinToolbarMore,
  toolbarMore: favToolbarMore,

  searchToolbarPrimary: searchReqJoinToolbarPrimary
};

export const moderatedRequestedJoinNotFav = {
  name: `actionsSite-moderated-req-join-not-fav-${Utils.random()}`,
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
