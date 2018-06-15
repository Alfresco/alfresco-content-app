/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

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
