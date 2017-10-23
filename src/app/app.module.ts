import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TRANSLATION_PROVIDER } from 'ng2-alfresco-core';

import { AdfModule } from './adf.module';
import { CommonModule } from './common/common.module';
import { MaterialModule } from './common/material.module';

import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';

import { GenericErrorComponent } from './components/generic-error/generic-error.component';
import { LoginComponent } from './components/login/login.component';
import { PreviewComponent } from './components/preview/preview.component';
import { FilesComponent } from './components/files/files.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { LibrariesComponent } from './components/libraries/libraries.component';
import { RecentFilesComponent } from './components/recent-files/recent-files.component';
import { SharedFilesComponent } from './components/shared-files/shared-files.component';
import { TrashcanComponent } from './components/trashcan/trashcan.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HeaderComponent } from './components/header/header.component';
import { CurrentUserComponent } from './components/current-user/current-user.component';
import { SearchComponent } from './components/search/search.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(APP_ROUTES, {
            useHash: true,
            enableTracing: false // enable for debug only
        }),
        AdfModule,
        CommonModule,
        MaterialModule
    ],
    declarations: [
        AppComponent,
        GenericErrorComponent,
        LoginComponent,
        LayoutComponent,
        HeaderComponent,
        CurrentUserComponent,
        SearchComponent,
        SidenavComponent,
        FilesComponent,
        FavoritesComponent,
        LibrariesComponent,
        RecentFilesComponent,
        SharedFilesComponent,
        TrashcanComponent,
        PreviewComponent
    ],
    providers: [
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'app',
                source: 'assets'
            }
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
