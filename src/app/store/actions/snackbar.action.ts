import { Action } from '@ngrx/store';

export const SNACKBAR_INFO = 'SNACKBAR_INFO';
export const SNACKBAR_WARNING = 'SNACKBAR_WARNING';
export const SNACKBAR_ERROR = 'SNACKBAR_ERROR';

export class SnackbarInfoAction implements Action {
    readonly type = SNACKBAR_INFO;
    constructor(public payload: string) {}
}

export class SnackbarWarningAction implements Action {
    readonly type = SNACKBAR_WARNING;
    constructor(public payload: string) {}
}

export class SnackbarErrorAction implements Action {
    readonly type = SNACKBAR_ERROR;
    constructor(public payload: string) {}
}
