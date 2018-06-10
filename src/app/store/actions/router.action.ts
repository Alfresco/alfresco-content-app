import { Action } from '@ngrx/store';

export const NAVIGATE_ROUTE = 'NAVIGATE_ROUTE';

export class NavigateRouteAction implements Action {
    readonly type = NAVIGATE_ROUTE;
    constructor(public payload: any[]) {}
}
