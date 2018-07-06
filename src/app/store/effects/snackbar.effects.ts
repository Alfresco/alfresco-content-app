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

import { TranslationService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import {
    SnackbarAction,
    SnackbarErrorAction,
    SnackbarInfoAction,
    SnackbarWarningAction,
    SNACKBAR_ERROR,
    SNACKBAR_INFO,
    SNACKBAR_WARNING
} from '../actions';
import { AppStore } from '../states/app.state';

@Injectable()
export class SnackbarEffects {
    constructor(
        private store: Store<AppStore>,
        private actions$: Actions,
        private snackBar: MatSnackBar,
        private translationService: TranslationService
    ) {}

    @Effect({ dispatch: false })
    infoEffect = this.actions$.pipe(
        ofType<SnackbarInfoAction>(SNACKBAR_INFO),
        map((action: SnackbarInfoAction) => {
            this.showSnackBar(action, 'info-snackbar');
        })
    );

    @Effect({ dispatch: false })
    warningEffect = this.actions$.pipe(
        ofType<SnackbarWarningAction>(SNACKBAR_WARNING),
        map((action: SnackbarWarningAction) => {
            this.showSnackBar(action, 'warning-snackbar');
        })
    );

    @Effect({ dispatch: false })
    errorEffect = this.actions$.pipe(
        ofType<SnackbarErrorAction>(SNACKBAR_ERROR),
        map((action: SnackbarErrorAction) => {
            this.showSnackBar(action, 'error-snackbar');
        })
    );

    private showSnackBar(action: SnackbarAction, panelClass: string) {
        const message = this.translate(action.payload, action.params);

        let actionName: string = null;
        if (action.userAction) {
            actionName = this.translate(action.userAction.title);
        }

        const snackBarRef = this.snackBar.open(message, actionName, {
            duration: action.duration || 4000,
            panelClass: panelClass
        });

        if (action.userAction) {
            snackBarRef.onAction().subscribe(() => {
                this.store.dispatch(action.userAction.action);
            });
        }
    }

    private translate(message: string, params?: Object): string {
        return this.translationService.instant(message, params);
    }
}
