import { Action } from '@ngrx/store';

export const NAVIGATE_ROUTE = 'NAVIGATE_ROUTE';
export const NAVIGATE_LOCATION = 'NAVIGATE_LOCATION';

export class NavigateRouteAction implements Action {
    readonly type = NAVIGATE_ROUTE;
    constructor(public payload: any[]) {}
}

export class NavigateToLocationAction implements Action {
    readonly type = NAVIGATE_LOCATION;
    constructor(public payload: any) {}
}
