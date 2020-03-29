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
import {
  AppActionTypes,
  NodeActionTypes,
  SearchActionTypes
} from '@alfresco/aca-shared/store';
import { INITIAL_APP_STATE } from '../initial-state';
export function appReducer(state, action) {
  if (state === void 0) {
    state = INITIAL_APP_STATE;
  }
  var newState;
  switch (action.type) {
    case AppActionTypes.SetInitialState:
      newState = Object.assign({}, action.payload);
      break;
    case NodeActionTypes.SetSelection:
      newState = updateSelectedNodes(state, action);
      break;
    case AppActionTypes.SetUserProfile:
      newState = updateUser(state, action);
      break;
    case AppActionTypes.SetLanguagePicker:
      newState = updateLanguagePicker(state, action);
      break;
    case AppActionTypes.SetCurrentFolder:
      newState = updateCurrentFolder(state, action);
      break;
    case AppActionTypes.SetCurrentUrl:
      newState = updateCurrentUrl(state, action);
      break;
    case AppActionTypes.ToggleInfoDrawer:
      newState = toggleInfoDrawer(state);
      break;
    case AppActionTypes.SetInfoDrawerState:
      newState = setInfoDrawer(state, action);
      break;
    case AppActionTypes.SetInfoDrawerMetadataAspect:
      newState = setInfoDrawerAspect(state, action);
      break;
    case AppActionTypes.ToggleDocumentDisplayMode:
      newState = toggleDocumentDisplayMode(state);
      break;
    case AppActionTypes.SetRepositoryInfo:
      newState = updateRepositoryStatus(state, action);
      break;
    case SearchActionTypes.ToggleFilter:
      newState = toggleSearchFilter(state);
      break;
    case SearchActionTypes.ShowFilter:
      newState = showSearchFilter(state);
      break;
    case SearchActionTypes.HideFilter:
      newState = hideSearchFilter(state);
      break;
    case AppActionTypes.ToggleProcessServices:
      newState = updateProcessServices(state, action);
      break;
    default:
      newState = Object.assign({}, state);
  }
  return newState;
}
function toggleSearchFilter(state) {
  var newState = Object.assign({}, state);
  newState.showFacetFilter = !newState.showFacetFilter;
  return newState;
}
function hideSearchFilter(state) {
  var newState = Object.assign({}, state);
  newState.showFacetFilter = false;
  return newState;
}
function showSearchFilter(state) {
  var newState = Object.assign({}, state);
  newState.showFacetFilter = true;
  return newState;
}
function updateLanguagePicker(state, action) {
  var newState = Object.assign({}, state);
  newState.languagePicker = action.payload;
  return newState;
}
function updateUser(state, action) {
  var newState = Object.assign({}, state);
  var user = action.payload.person;
  var groups = (action.payload.groups || []).slice();
  var id = user.id;
  var firstName = user.firstName || '';
  var lastName = user.lastName || '';
  var userName = firstName + ' ' + lastName;
  var initials = [firstName[0], lastName[0]].join('');
  var capabilities = user.capabilities;
  var isAdmin = capabilities ? capabilities.isAdmin : true;
  // todo: remove <any>
  newState.user = {
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    initials: initials,
    isAdmin: isAdmin,
    id: id,
    groups: groups
  };
  return newState;
}
function updateCurrentFolder(state, action) {
  var newState = Object.assign({}, state);
  newState.navigation.currentFolder = action.payload;
  return newState;
}
function updateCurrentUrl(state, action) {
  var newState = Object.assign({}, state);
  newState.navigation.url = action.payload;
  return newState;
}
function toggleInfoDrawer(state) {
  var newState = Object.assign({}, state);
  var value = state.infoDrawerOpened;
  if (state.selection.isEmpty) {
    value = false;
  } else {
    value = !value;
  }
  newState.infoDrawerOpened = value;
  return newState;
}
function toggleDocumentDisplayMode(state) {
  var newState = Object.assign({}, state);
  newState.documentDisplayMode =
    newState.documentDisplayMode === 'list' ? 'gallery' : 'list';
  return newState;
}
function updateSelectedNodes(state, action) {
  var newState = Object.assign({}, state);
  var nodes = action.payload.slice();
  var count = nodes.length;
  var isEmpty = nodes.length === 0;
  var first = null;
  var last = null;
  var file = null;
  var folder = null;
  var library = null;
  if (nodes.length > 0) {
    first = nodes[0];
    last = nodes[nodes.length - 1];
    if (nodes.length === 1) {
      file = nodes.find(function(entity) {
        // workaround Shared
        return entity.entry.isFile ||
          entity.entry.nodeId ||
          entity.entry.sharedByUser
          ? true
          : false;
      });
      folder = nodes.find(function(entity) {
        return entity.entry.isFolder;
      });
    }
  }
  var libraries = action.payload.slice().filter(function(node) {
    return node.isLibrary;
  });
  if (libraries.length === 1) {
    library = libraries[0];
  }
  if (isEmpty) {
    newState.infoDrawerOpened = false;
  }
  newState.selection = {
    count: count,
    nodes: nodes,
    isEmpty: isEmpty,
    first: first,
    last: last,
    file: file,
    folder: folder,
    libraries: libraries,
    library: library
  };
  return newState;
}
function setInfoDrawer(state, action) {
  var newState = Object.assign({}, state);
  newState.infoDrawerOpened = action.payload;
  return newState;
}
function setInfoDrawerAspect(state, action) {
  var newState = Object.assign({}, state);
  newState.infoDrawerMetadataAspect = action.payload;
  return newState;
}
function updateRepositoryStatus(state, action) {
  var newState = Object.assign({}, state);
  newState.repository = action.payload;
  return newState;
}
function updateProcessServices(state, action) {
  var newState = Object.assign({}, state);
  newState.processServices = action.payload;
  return newState;
}
//# sourceMappingURL=app.reducer.js.map
