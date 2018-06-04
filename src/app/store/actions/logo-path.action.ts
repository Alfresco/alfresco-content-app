import { Action } from '@ngrx/store';

export const SET_LOGO_PATH = 'SET_LOGO_PATH';

export class SetLogoPathAction implements Action {
    readonly type = SET_LOGO_PATH;
    constructor(public payload: string) {}
}
