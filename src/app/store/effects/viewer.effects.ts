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

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ViewNodeAction, VIEW_NODE, ViewFolderAction, VIEW_FOLDER } from '../actions/viewer.actions';
import { Router } from '@angular/router';

@Injectable()
export class ViewerEffects {
    constructor(private actions$: Actions, private router: Router) {}

    @Effect({ dispatch: false })
    viewNode$ = this.actions$.pipe(
        ofType<ViewNodeAction>(VIEW_NODE),
        map(action => {
            const node = action.payload;
            if (!node) {
                return;
            }

            let previewLocation = this.router.url;
            if (previewLocation.lastIndexOf('/') > 0) {
                previewLocation = previewLocation.substr(
                    0,
                    this.router.url.indexOf('/', 1)
                );
            }
            previewLocation = previewLocation.replace(/\//g, '');

            const path = [previewLocation];
            if (node.parentId) {
                path.push(node.parentId);
            }
            path.push('preview', node.id);
            this.router.navigateByUrl(path.join('/'));
        })
    );

    @Effect({ dispatch: false })
    viewFolder$ = this.actions$.pipe(
        ofType<ViewFolderAction>(VIEW_FOLDER),
        map(action => {
            this.router.navigateByUrl('/personal-files/' + action.payload);
        })
    );
}
