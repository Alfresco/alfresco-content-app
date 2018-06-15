import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './reducers/app.reducer';
import { INITIAL_STATE } from './states/app.state';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '../../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
    SnackbarEffects,
    NodeEffects,
    RouterEffects,
    DownloadEffects,
    ViewerEffects
} from './effects';

@NgModule({
    imports: [
        StoreModule.forRoot(
            { app: appReducer },
            { initialState: INITIAL_STATE }
        ),
        StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
        EffectsModule.forRoot([
            SnackbarEffects,
            NodeEffects,
            RouterEffects,
            DownloadEffects,
            ViewerEffects
        ]),
        !environment.production
            ? StoreDevtoolsModule.instrument({ maxAge: 25 })
            : []
    ]
})
export class AppStoreModule {}
