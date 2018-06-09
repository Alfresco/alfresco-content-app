import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import {
    SnackbarErrorAction,
    SNACKBAR_ERROR,
    SNACKBAR_INFO,
    SnackbarInfoAction,
    SnackbarWarningAction,
    SNACKBAR_WARNING
} from '../actions';
import { MatSnackBar } from '@angular/material';
import { TranslationService } from '@alfresco/adf-core';
import { map } from 'rxjs/operators';

@Injectable()
export class SnackbarEffects {
    constructor(
        private actions$: Actions,
        private snackBar: MatSnackBar,
        private translationService: TranslationService
    ) {}

    @Effect({ dispatch: false })
    infoEffect = this.actions$.pipe(
        ofType<SnackbarInfoAction>(SNACKBAR_INFO),
        map((action: SnackbarInfoAction) => {
            this.snackBar.open(
                this.translate(action.payload, action.params),
                null,
                {
                    duration: 4000,
                    panelClass: 'info-snackbar'
                }
            );
        })
    );

    @Effect({ dispatch: false })
    warningEffect = this.actions$.pipe(
        ofType<SnackbarWarningAction>(SNACKBAR_WARNING),
        map((action: SnackbarWarningAction) => {
            this.snackBar.open(
                this.translate(action.payload, action.params),
                null,
                {
                    duration: 4000,
                    panelClass: 'warning-snackbar'
                }
            );
        })
    );

    @Effect({ dispatch: false })
    errorEffect = this.actions$.pipe(
        ofType<SnackbarErrorAction>(SNACKBAR_ERROR),
        map((action: SnackbarErrorAction) => {
            this.snackBar.open(
                this.translate(action.payload, action.params),
                null,
                {
                    duration: 4000,
                    panelClass: 'warning-snackbar'
                }
            );
        })
    );

    private translate(message: string, params: Object): string {
        return this.translationService.instant(message, params);
    }
}
