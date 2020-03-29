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
// ---- multiple selection ---
export var trashActions = ['Permanently Delete', 'Restore'];
// ---- single selection ----
var memberFavContextMenu = ['Leave Library', 'Delete', 'Remove Favorite'];
var memberNotFavContextMenu = ['Leave Library', 'Delete', 'Favorite'];
var memberToolbarPrimary = ['Leave Library', 'View Details', 'More Actions'];
var favToolbarMore = ['Delete', 'Remove Favorite'];
var notFavToolbarMore = ['Delete', 'Favorite'];
var searchMemberToolbarPrimary = ['Toggle search filter', 'Leave Library', 'View Details', 'More Actions'];
var searchReqJoinToolbarPrimary = ['Toggle search filter', 'Cancel Join Request', 'View Details', 'More Actions'];
var searchNotMemberToolbarPrimary = ['Toggle search filter', 'Join', 'View Details', 'More Actions'];
var reqJoinToolbarMore = ['Cancel Join Request', 'View Details', 'More Actions'];
var notMemberFavContextMenu = ['Join', 'Delete', 'Remove Favorite'];
var notMemberNotFavContextMenu = ['Join', 'Delete', 'Favorite'];
var notMemberToolbarPrimary = ['Join', 'View Details', 'More Actions'];
var reqJoinNotFavContextMenu = ['Cancel Join Request', 'Delete', 'Favorite'];
var reqJoinFavContextMenu = ['Cancel Join Request', 'Delete', 'Remove Favorite'];
export var publicUserMemberFav = {
    name: "site-public-member-fav-" + Utils.random(),
    description: 'public site, user member, user favorite',
    contextMenu: memberFavContextMenu,
    toolbarPrimary: memberToolbarPrimary,
    toolbarMore: favToolbarMore,
    searchToolbarPrimary: searchMemberToolbarPrimary
};
export var privateUserMemberFav = {
    name: "site-private-member-fav-" + Utils.random(),
    description: 'private site, user member, user favorite',
    contextMenu: memberFavContextMenu,
    toolbarPrimary: memberToolbarPrimary,
    toolbarMore: favToolbarMore,
    searchToolbarPrimary: searchMemberToolbarPrimary
};
export var moderatedUserMemberFav = {
    name: "site-moderated-member-fav-" + Utils.random(),
    description: 'moderated site, user member, user favorite',
    contextMenu: memberFavContextMenu,
    toolbarPrimary: memberToolbarPrimary,
    toolbarMore: favToolbarMore,
    searchToolbarPrimary: searchMemberToolbarPrimary
};
export var publicUserMemberNotFav = {
    name: "site-public-member-not-fav-" + Utils.random(),
    description: 'public site, user member, not favorite',
    contextMenu: memberNotFavContextMenu,
    toolbarPrimary: memberToolbarPrimary,
    toolbarMore: notFavToolbarMore,
    searchToolbarPrimary: searchMemberToolbarPrimary
};
export var privateUserMemberNotFav = {
    name: "site-private-member-not-fav-" + Utils.random(),
    description: 'private site, user member, not favorite',
    contextMenu: memberNotFavContextMenu,
    toolbarPrimary: memberToolbarPrimary,
    toolbarMore: notFavToolbarMore,
    searchToolbarPrimary: searchMemberToolbarPrimary
};
export var moderatedUserMemberNotFav = {
    name: "site-moderated-member-not-fav-" + Utils.random(),
    description: 'moderated site, user member, not favorite',
    contextMenu: memberNotFavContextMenu,
    toolbarPrimary: memberToolbarPrimary,
    toolbarMore: notFavToolbarMore,
    searchToolbarPrimary: searchMemberToolbarPrimary
};
export var publicNotMemberFav = {
    name: "site-public-not-member-fav-" + Utils.random(),
    description: 'public site, user not member, user favorite',
    contextMenu: notMemberFavContextMenu,
    toolbarPrimary: notMemberToolbarPrimary,
    toolbarMore: favToolbarMore,
    searchToolbarPrimary: searchNotMemberToolbarPrimary
};
export var moderatedNotMemberFav = {
    name: "site-moderated-not-member-fav-" + Utils.random(),
    description: 'moderated site, user not member, user favorite',
    contextMenu: notMemberFavContextMenu,
    toolbarPrimary: notMemberToolbarPrimary,
    toolbarMore: favToolbarMore,
    searchToolbarPrimary: searchNotMemberToolbarPrimary
};
export var publicNotMemberNotFav = {
    name: "site-public-not-member-not-fav-" + Utils.random(),
    description: 'public site, user not member, not favorite',
    contextMenu: notMemberNotFavContextMenu,
    toolbarPrimary: notMemberToolbarPrimary,
    toolbarMore: notFavToolbarMore,
    searchToolbarPrimary: searchNotMemberToolbarPrimary
};
export var moderatedNotMemberNotFav = {
    name: "site-moderated-not-member-not-fav-" + Utils.random(),
    description: 'moderated site, user not member, not favorite',
    contextMenu: notMemberNotFavContextMenu,
    toolbarPrimary: notMemberToolbarPrimary,
    toolbarMore: notFavToolbarMore,
    searchToolbarPrimary: searchNotMemberToolbarPrimary
};
export var moderatedRequestedJoinFav = {
    name: "site-moderated-req-join-fav-" + Utils.random(),
    description: 'moderated site, user requested join, user favorite',
    contextMenu: reqJoinFavContextMenu,
    toolbarPrimary: reqJoinToolbarMore,
    toolbarMore: favToolbarMore,
    searchToolbarPrimary: searchReqJoinToolbarPrimary
};
export var moderatedRequestedJoinNotFav = {
    name: "site-moderated-req-join-not-fav-" + Utils.random(),
    description: 'moderated site, user requested join, not favorite',
    contextMenu: reqJoinNotFavContextMenu,
    toolbarPrimary: reqJoinToolbarMore,
    toolbarMore: notFavToolbarMore,
    searchToolbarPrimary: searchReqJoinToolbarPrimary
};
export var siteInTrash = {
    name: "deleted-site-" + Utils.random(),
    trashActions: trashActions
};
export var site2InTrash = {
    name: "deleted-site2-" + Utils.random(),
    trashActions: trashActions
};
//# sourceMappingURL=test-data-libraries.js.map