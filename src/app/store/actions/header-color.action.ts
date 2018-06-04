import { Action } from '@ngrx/store';

export const SET_HEADER_COLOR = 'SET_HEADER_COLOR';

export class SetHeaderColorAction implements Action {
    readonly type = SET_HEADER_COLOR;
    constructor(public payload: string) {}
}
