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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TRANSLATION_PROVIDER } from '@alfresco/adf-core';

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
import { AboutComponent } from './components/about/about.component';
import { LocationLinkComponent } from './components/location-link/location-link.component';
import { EmptyFolderComponent } from './components/empty-folder/empty-folder.component';

import { LayoutContainerComponent } from './components/adf-layout/layout-container.component';
import { SidenavLayoutComponent } from './components/adf-layout/sidenav-layout.component';
import { AppLayoutHeaderDirective } from './components/adf-layout/app-layout-header.directive';
import { AppLayoutNavigationDirective } from './components/adf-layout/app-layout-navigation.directive';
import { AppLayoutContentDirective } from './components/adf-layout/app-layout-content.directive';

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
        LayoutContainerComponent,
        SidenavLayoutComponent,
        AppLayoutHeaderDirective,
        AppLayoutNavigationDirective,
        AppLayoutContentDirective,
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
        PreviewComponent,
        AboutComponent,
        LocationLinkComponent,
        EmptyFolderComponent
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
