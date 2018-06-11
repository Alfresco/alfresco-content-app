import { Action } from '@ngrx/store';
import { AppState, INITIAL_APP_STATE } from '../states/app.state';
import { SET_HEADER_COLOR, SetHeaderColorAction } from '../actions/header-color.action';
import { SET_APP_NAME, SetAppNameAction } from '../actions/app-name.action';
import { SET_LOGO_PATH, SetLogoPathAction } from '../actions/logo-path.action';
import { SET_SELECTED_NODES, SetSelectedNodesAction } from '../actions/node.action';


export function appReducer(state: AppState = INITIAL_APP_STATE, action: Action): AppState {
    let newState: AppState;

    switch (action.type) {
        case SET_APP_NAME:
            newState = updateAppName(state, <SetAppNameAction> action);
            break;
        case SET_HEADER_COLOR:
            newState = updateHeaderColor(state, <SetHeaderColorAction> action);
            break;
        case SET_LOGO_PATH:
            newState = updateLogoPath(state, <SetLogoPathAction> action);
            break;
        case SET_SELECTED_NODES:
            newState = updateSelectedNodes(state, <SetSelectedNodesAction> action);
            break;
        default:
            newState = Object.assign({}, state);
    }

    return newState;
}

function updateHeaderColor(state: AppState, action: SetHeaderColorAction): AppState {
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

function updateSelectedNodes(state: AppState, action: SetSelectedNodesAction): AppState {
    const newState = Object.assign({}, state);
    newState.selectedNodes = [...action.payload];
    return newState;
}
