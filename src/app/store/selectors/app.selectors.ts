import { createSelector } from '@ngrx/store';
import { AcaState, AppState } from '../states/app.state';

export const selectApp = (state: AcaState) => state.app;
export const selectHeaderColor = createSelector(selectApp, (state: AppState) => state.headerColor);
export const selectAppName = createSelector(selectApp, (state: AppState) => state.appName);
export const selectLogoPath = createSelector(selectApp, (state: AppState) => state.logoPath);
