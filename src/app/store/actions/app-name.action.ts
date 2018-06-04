import { Action } from '@ngrx/store';

export const SET_APP_NAME = 'SET_APP_NAME';

export class SetAppNameAction implements Action {
    readonly type = SET_APP_NAME;
    constructor(public payload: string) {}
}
