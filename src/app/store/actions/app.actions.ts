import { Action } from '@ngrx/store';

export const SET_APP_NAME = 'SET_APP_NAME';
export const SET_HEADER_COLOR = 'SET_HEADER_COLOR';
export const SET_LOGO_PATH = 'SET_LOGO_PATH';


export class SetAppNameAction implements Action {
    readonly type = SET_APP_NAME;
    constructor(public payload: string) {}
}

export class SetHeaderColorAction implements Action {
    readonly type = SET_HEADER_COLOR;
    constructor(public payload: string) {}
}

export class SetLogoPathAction implements Action {
    readonly type = SET_LOGO_PATH;
    constructor(public payload: string) {}
}
