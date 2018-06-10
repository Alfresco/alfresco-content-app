import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { NavigateRouteAction, NAVIGATE_ROUTE } from '../actions/router.action';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class RouterEffects {
    constructor(private actions$: Actions, private router: Router) {}

    @Effect({ dispatch: false })
    navigateRoute$ = this.actions$.pipe(
        ofType<NavigateRouteAction>(NAVIGATE_ROUTE),
        map(action => {
            this.router.navigate(action.payload);
        })
    );
}
