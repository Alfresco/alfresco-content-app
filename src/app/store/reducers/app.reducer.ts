/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { Action } from '@ngrx/store';
import {
  AppState,
  AppActionTypes,
  NodeActionTypes,
  SearchActionTypes,
  SetUserProfileAction,
  SetLanguagePickerAction,
  SetCurrentFolderAction,
  SetCurrentUrlAction,
  SetInitialStateAction,
  SetSelectedNodesAction,
  SetRepositoryInfoAction,
  SetInfoDrawerStateAction
} from '@alfresco/aca-shared/store';
import { INITIAL_APP_STATE } from '../initial-state';

export function appReducer(
  state: AppState = INITIAL_APP_STATE,
  action: Action
): AppState {
  let newState: AppState;

  switch (action.type) {
    case AppActionTypes.SetInitialState:
      newState = Object.assign({}, (<SetInitialStateAction>action).payload);
      break;
    case NodeActionTypes.SetSelection:
      newState = updateSelectedNodes(state, <SetSelectedNodesAction>action);
      break;
    case AppActionTypes.SetUserProfile:
      newState = updateUser(state, <SetUserProfileAction>action);
      break;
    case AppActionTypes.SetLanguagePicker:
      newState = updateLanguagePicker(state, <SetLanguagePickerAction>action);
      break;
    case AppActionTypes.SetCurrentFolder:
      newState = updateCurrentFolder(state, <SetCurrentFolderAction>action);
      break;
    case AppActionTypes.SetCurrentUrl:
      newState = updateCurrentUrl(state, <SetCurrentUrlAction>action);
      break;
    case AppActionTypes.ToggleInfoDrawer:
      newState = toggleInfoDrawer(state);
      break;
    case AppActionTypes.SetInfoDrawerState:
      newState = setInfoDrawer(state, <SetInfoDrawerStateAction>action);
      break;
    case AppActionTypes.ToggleDocumentDisplayMode:
      newState = toggleDocumentDisplayMode(state);
      break;
    case AppActionTypes.SetRepositoryInfo:
      newState = updateRepositoryStatus(state, <SetRepositoryInfoAction>action);
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
    default:
      newState = Object.assign({}, state);
  }

  return newState;
}

function toggleSearchFilter(state: AppState): AppState {
  const newState = Object.assign({}, state);
  newState.showFacetFilter = !newState.showFacetFilter;
  return newState;
}

function hideSearchFilter(state: AppState): AppState {
  const newState = Object.assign({}, state);
  newState.showFacetFilter = false;
  return newState;
}

function showSearchFilter(state: AppState): AppState {
  const newState = Object.assign({}, state);
  newState.showFacetFilter = true;
  return newState;
}

function updateLanguagePicker(
  state: AppState,
  action: SetLanguagePickerAction
): AppState {
  const newState = Object.assign({}, state);
  newState.languagePicker = action.payload;
  return newState;
}

function updateUser(state: AppState, action: SetUserProfileAction): AppState {
  const newState = Object.assign({}, state);
  const user = action.payload.person;
  const groups = [...(action.payload.groups || [])];

  const id = user.id;
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  const userName = `${firstName} ${lastName}`;
  const initials = [firstName[0], lastName[0]].join('');

  const capabilities = (<any>user).capabilities;
  const isAdmin = capabilities ? capabilities.isAdmin : true;

  // todo: remove <any>
  newState.user = <any>{
    firstName,
    lastName,
    userName,
    initials,
    isAdmin,
    id,
    groups
  };

  return newState;
}

function updateCurrentFolder(state: AppState, action: SetCurrentFolderAction) {
  const newState = Object.assign({}, state);
  newState.navigation.currentFolder = action.payload;
  return newState;
}

function updateCurrentUrl(state: AppState, action: SetCurrentUrlAction) {
  const newState = Object.assign({}, state);
  newState.navigation.url = action.payload;
  return newState;
}

function toggleInfoDrawer(state: AppState) {
  const newState = Object.assign({}, state);

  let value = state.infoDrawerOpened;
  if (state.selection.isEmpty) {
    value = false;
  } else {
    value = !value;
  }

  newState.infoDrawerOpened = value;

  return newState;
}

function toggleDocumentDisplayMode(state: AppState) {
  const newState = Object.assign({}, state);
  newState.documentDisplayMode =
    newState.documentDisplayMode === 'list' ? 'gallery' : 'list';
  return newState;
}

function updateSelectedNodes(
  state: AppState,
  action: SetSelectedNodesAction
): AppState {
  const newState = Object.assign({}, state);
  const nodes = [...action.payload];
  const count = nodes.length;
  const isEmpty = nodes.length === 0;

  let first = null;
  let last = null;
  let file = null;
  let folder = null;
  let library = null;

  if (nodes.length > 0) {
    first = nodes[0];
    last = nodes[nodes.length - 1];

    if (nodes.length === 1) {
      file = nodes.find((entity: any) => {
        // workaround Shared
        return entity.entry.isFile ||
          entity.entry.nodeId ||
          entity.entry.sharedByUser
          ? true
          : false;
      });
      folder = nodes.find((entity: any) => entity.entry.isFolder);
    }
  }

  const libraries: any[] = [...action.payload].filter(
    (node: any) => node.isLibrary
  );
  if (libraries.length === 1) {
    library = libraries[0];
  }

  if (isEmpty) {
    newState.infoDrawerOpened = false;
  }

  newState.selection = {
    count,
    nodes,
    isEmpty,
    first,
    last,
    file,
    folder,
    libraries,
    library
  };
  return newState;
}

function setInfoDrawer(state: AppState, action: SetInfoDrawerStateAction) {
  const newState = Object.assign({}, state);
  newState.infoDrawerOpened = action.payload;
  return newState;
}

function updateRepositoryStatus(
  state: AppState,
  action: SetRepositoryInfoAction
) {
  const newState = Object.assign({}, state);
  newState.repository = action.payload;
  return newState;
}
