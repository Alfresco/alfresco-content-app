/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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
import { AppState, INITIAL_APP_STATE } from '../states/app.state';
import {
  SET_SELECTED_NODES,
  SetSelectedNodesAction,
  SET_USER_PROFILE,
  SetUserProfileAction,
  SET_REPOSITORY_STATUS,
  SetRepositoryStatusAction,
  SET_LANGUAGE_PICKER,
  SetLanguagePickerAction,
  SET_CURRENT_FOLDER,
  SetCurrentFolderAction,
  SET_CURRENT_URL,
  SetCurrentUrlAction
} from '../actions';
import {
  TOGGLE_INFO_DRAWER,
  ToggleInfoDrawerAction,
  TOGGLE_DOCUMENT_DISPLAY_MODE,
  ToggleDocumentDisplayMode,
  SET_INITIAL_STATE,
  SetInitialStateAction
} from '../actions/app.actions';

export function appReducer(
  state: AppState = INITIAL_APP_STATE,
  action: Action
): AppState {
  let newState: AppState;

  switch (action.type) {
    case SET_INITIAL_STATE:
      newState = Object.assign({}, (<SetInitialStateAction>action).payload);
      break;
    case SET_SELECTED_NODES:
      newState = updateSelectedNodes(state, <SetSelectedNodesAction>action);
      break;
    case SET_USER_PROFILE:
      newState = updateUser(state, <SetUserProfileAction>action);
      break;
    case SET_LANGUAGE_PICKER:
      newState = updateLanguagePicker(state, <SetLanguagePickerAction>action);
      break;
    case SET_CURRENT_FOLDER:
      newState = updateCurrentFolder(state, <SetCurrentFolderAction>action);
      break;
    case SET_CURRENT_URL:
      newState = updateCurrentUrl(state, <SetCurrentUrlAction>action);
      break;
    case TOGGLE_INFO_DRAWER:
      newState = updateInfoDrawer(state, <ToggleInfoDrawerAction>action);
      break;
    case TOGGLE_DOCUMENT_DISPLAY_MODE:
      newState = updateDocumentDisplayMode(state, <ToggleDocumentDisplayMode>(
        action
      ));
      break;
    case SET_REPOSITORY_STATUS:
      newState = updateRepositoryStatus(state, <SetRepositoryStatusAction>(
        action
      ));
      break;
    default:
      newState = Object.assign({}, state);
  }

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
  const user = action.payload;

  const id = user.id;
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  const userName = `${firstName} ${lastName}`;
  const initials = [firstName[0], lastName[0]].join('');

  const capabilities = (<any>user).capabilities;
  const isAdmin = capabilities ? capabilities.isAdmin : true;

  newState.user = {
    firstName,
    lastName,
    userName,
    initials,
    isAdmin,
    id
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

function updateInfoDrawer(state: AppState, action: ToggleInfoDrawerAction) {
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

function updateDocumentDisplayMode(
  state: AppState,
  action: ToggleDocumentDisplayMode
) {
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
      file = nodes.find(entity => {
        // workaround Shared
        return entity.entry.isFile || entity.entry.nodeId ? true : false;
      });
      folder = nodes.find(entity => entity.entry.isFolder);
    }
  }

  const libraries = [...action.payload].filter((node: any) => node.isLibrary);
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

function updateRepositoryStatus(
  state: AppState,
  action: SetRepositoryStatusAction
) {
  const newState = Object.assign({}, state);
  newState.repository = action.payload;
  return newState;
}
