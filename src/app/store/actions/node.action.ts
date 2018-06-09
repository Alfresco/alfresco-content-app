import { Action } from '@ngrx/store';

export const SET_SELECTED_NODES = 'SET_SELECTED_NODES';
export const DELETE_NODES = 'DELETE_NODES';
export const RESTORE_DELETED_NODES = 'RESTORE_DELETED_NODES';

export class SetSelectedNodesAction implements Action {
    readonly type = SET_SELECTED_NODES;
    constructor(public payload: any[] = []) {}
}

export class DeleteNodesAction implements Action {
    readonly type = DELETE_NODES;
    constructor(public payload: any[] = []) {}
}

export class RestoreDeletedNodesAction implements Action {
    readonly type = RESTORE_DELETED_NODES;
    constructor(public payload: any[] = []) {}
}
