import { Action } from '@ngrx/store';

export const SET_SELECTED_NODES = 'SET_SELECTED_NODES';

export class SetSelectedNodesAction implements Action {
    readonly type = SET_SELECTED_NODES;
    constructor(public payload: any[] = []) {}
}
