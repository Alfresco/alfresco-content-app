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
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TRANSLATION_PROVIDER, CoreModule, AppConfigService, DebugAppConfigService } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';

import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';

import { GenericErrorComponent } from './components/generic-error/generic-error.component';
import { LoginComponent } from './components/login/login.component';
import { FilesComponent } from './components/files/files.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { LibrariesComponent } from './components/libraries/libraries.component';
import { RecentFilesComponent } from './components/recent-files/recent-files.component';
import { SharedFilesComponent } from './components/shared-files/shared-files.component';
import { TrashcanComponent } from './components/trashcan/trashcan.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SidenavViewsManagerDirective } from './components/layout/sidenav-views-manager.directive';
import { CurrentUserComponent } from './components/current-user/current-user.component';
import { SearchInputComponent } from './components/search/search-input/search-input.component';
import { SearchInputControlComponent } from './components/search/search-input-control/search-input-control.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { LocationLinkComponent } from './components/location-link/location-link.component';
import { SharedLinkViewComponent } from './components/shared-link-view/shared-link-view.component';
import { NodeVersionsDialogComponent } from './dialogs/node-versions/node-versions.dialog';
import { LibraryDialogComponent } from './dialogs/library/library.dialog';
import { ContentManagementService } from './services/content-management.service';
import { NodeActionsService } from './services/node-actions.service';
import { NodePermissionService } from './services/node-permission.service';
import { SearchResultsComponent } from './components/search/search-results/search-results.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileResolver } from './services/profile.resolver';
import { ExperimentalGuard } from './services/experimental-guard.service';

import { AppStoreModule } from './store/app-store.module';
import { MaterialModule } from './material.module';
import { ContentApiService } from './services/content-api.service';
import { ExtensionsModule } from './extensions.module';
import { CoreExtensionsModule } from './extensions/core.extensions.module';
import { SearchResultsRowComponent } from './components/search/search-results-row/search-results-row.component';
import { NodePermissionsDialogComponent } from './dialogs/node-permissions/node-permissions.dialog';
import { PermissionsManagerComponent } from './components/permission-manager/permissions-manager.component';
import { AppRouteReuseStrategy } from './app.routes.strategy';
import { ViewUtilService} from './services/view-util.service';
import { ExtensionService } from './extensions/extension.service';
import { AppInfoDrawerModule } from './components/info-drawer/info.drawer.module';
import { DirectivesModule } from './directives/directives.module';

export function setupExtensionServiceFactory(service: ExtensionService): Function {
    return () => service.load();
}
@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(APP_ROUTES, {
            useHash: true,
            enableTracing: false // enable for debug only
        }),
        MaterialModule,
        CoreModule.forRoot(),
        ContentModule,
        AppStoreModule,
        CoreExtensionsModule.forRoot(),
        ExtensionsModule,

        DirectivesModule,
        AppInfoDrawerModule
    ],
    declarations: [
        AppComponent,
        GenericErrorComponent,
        LoginComponent,
        LayoutComponent,
        SidenavViewsManagerDirective,
        CurrentUserComponent,
        SearchInputComponent,
        SearchInputControlComponent,
        SidenavComponent,
        FilesComponent,
        FavoritesComponent,
        LibrariesComponent,
        RecentFilesComponent,
        SharedFilesComponent,
        TrashcanComponent,
        LocationLinkComponent,
        SearchResultsRowComponent,
        NodeVersionsDialogComponent,
        LibraryDialogComponent,
        NodePermissionsDialogComponent,
        PermissionsManagerComponent,
        SearchResultsComponent,
        SettingsComponent,
        SharedLinkViewComponent
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy },
        { provide: AppConfigService, useClass: DebugAppConfigService },
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'app',
                source: 'assets'
            }
        },
        ContentManagementService,
        NodeActionsService,
        NodePermissionService,
        ProfileResolver,
        ExperimentalGuard,
        ContentApiService,
        {
            provide: APP_INITIALIZER,
            useFactory: setupExtensionServiceFactory,
            deps: [ExtensionService],
            multi: true
        },
        ViewUtilService
    ],
    entryComponents: [
        LibraryDialogComponent,
        NodeVersionsDialogComponent,
        NodePermissionsDialogComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
