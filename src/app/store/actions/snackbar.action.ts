import { Action } from '@ngrx/store';

export const SNACKBAR_INFO = 'SNACKBAR_INFO';
export const SNACKBAR_WARNING = 'SNACKBAR_WARNING';
export const SNACKBAR_ERROR = 'SNACKBAR_ERROR';

export interface SnackbarAction extends Action {
    payload: string;
    params?: Object;
    userAction?: SnackbarUserAction;
    duration: number;
}

export class SnackbarUserAction {
    constructor(public title: string, public action: Action) {}
}

export class SnackbarInfoAction implements SnackbarAction {
    readonly type = SNACKBAR_INFO;

    userAction?: SnackbarUserAction;
    duration = 4000;

    constructor(public payload: string, public params?: Object) {}
}

export class SnackbarWarningAction implements SnackbarAction {
    readonly type = SNACKBAR_WARNING;

    userAction?: SnackbarUserAction;
    duration = 4000;

    constructor(public payload: string, public params?: Object) {}
}

export class SnackbarErrorAction implements SnackbarAction {
    readonly type = SNACKBAR_ERROR;

    userAction?: SnackbarUserAction;
    duration = 4000;

    constructor(public payload: string, public params?: Object) {}
}
