import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MinimalNodeEntryEntity, PathInfoEntity } from 'alfresco-js-api';
import { map } from 'rxjs/operators';
import {
    NavigateRouteAction,
    NavigateToLocationAction,
    NAVIGATE_LOCATION,
    NAVIGATE_ROUTE
} from '../actions';

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

    @Effect({ dispatch: false })
    navigateLocation$ = this.actions$.pipe(
        ofType<NavigateToLocationAction>(NAVIGATE_LOCATION),
        map(action => {
            if (action.payload) {
                this.navigateToLocation(action.payload);
            }
        })
    );

    private navigateToLocation(node: MinimalNodeEntryEntity) {
        let link = null;
        const { path } = node;

        if (path && path.name && path.elements) {
            const isLibraryPath = this.isLibraryContent(<PathInfoEntity>path);

            const parent = path.elements[path.elements.length - 1];
            const area = isLibraryPath ? '/libraries' : '/personal-files';

            if (!isLibraryPath) {
                link = [area, parent.id];
            } else {
                // parent.id could be 'Site' folder or child as 'documentLibrary'
                link = [area, parent.name === 'Sites' ? {} : parent.id];
            }
        }

        setTimeout(() => {
            this.router.navigate(link);
        }, 10);
    }

    private isLibraryContent(path: PathInfoEntity): boolean {
        if (
            path &&
            path.elements.length >= 2 &&
            path.elements[1].name === 'Sites'
        ) {
            return true;
        }

        return false;
    }
}
