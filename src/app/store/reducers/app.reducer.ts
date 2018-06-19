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
    SET_HEADER_COLOR,
    SetHeaderColorAction,
    SET_APP_NAME,
    SetAppNameAction,
    SET_LOGO_PATH,
    SetLogoPathAction,
    SET_SELECTED_NODES,
    SetSelectedNodesAction
} from '../actions';

export function appReducer(
    state: AppState = INITIAL_APP_STATE,
    action: Action
): AppState {
    let newState: AppState;

    switch (action.type) {
        case SET_APP_NAME:
            newState = updateAppName(state, <SetAppNameAction>action);
            break;
        case SET_HEADER_COLOR:
            newState = updateHeaderColor(state, <SetHeaderColorAction>action);
            break;
        case SET_LOGO_PATH:
            newState = updateLogoPath(state, <SetLogoPathAction>action);
            break;
        case SET_SELECTED_NODES:
            newState = updateSelectedNodes(state, <SetSelectedNodesAction>(
                action
            ));
            break;
        default:
            newState = Object.assign({}, state);
    }

    return newState;
}

function updateHeaderColor(
    state: AppState,
    action: SetHeaderColorAction
): AppState {
    const newState = Object.assign({}, state);
    newState.headerColor = action.payload;
    return newState;
}

function updateAppName(state: AppState, action: SetAppNameAction): AppState {
    const newState = Object.assign({}, state);
    newState.appName = action.payload;
    return newState;
}

function updateLogoPath(state: AppState, action: SetLogoPathAction): AppState {
    const newState = Object.assign({}, state);
    newState.logoPath = action.payload;
    return newState;
}

function updateSelectedNodes(
    state: AppState,
    action: SetSelectedNodesAction
): AppState {
    const newState = Object.assign({}, state);
    const nodes = [...action.payload];
    const isEmpty = nodes.length === 0;

    let first = null;
    let last = null;
    let firstFile = null;
    let firstFolder = null;

    if (nodes.length > 0) {
        first = nodes[0];
        last = nodes[nodes.length - 1];
        firstFile = nodes.find(entity => entity.entry.isFile);
        firstFolder = nodes.find(entity => entity.entry.isFolder);
    }

    newState.selectedNodes = [...action.payload];

    newState.selection = {
        nodes,
        isEmpty,
        first,
        last,
        firstFile,
        firstFolder
    };
    return newState;
}
