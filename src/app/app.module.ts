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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TRANSLATION_PROVIDER, CoreModule, AppConfigService, DebugAppConfigService } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';

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
import { SidenavViewsManagerDirective } from './components/layout/sidenav-views-manager.directive';
import { HeaderComponent } from './components/header/header.component';
import { CurrentUserComponent } from './components/current-user/current-user.component';
import { SearchInputComponent } from './components/search/search-input/search-input.component';
import { SearchInputControlComponent } from './components/search/search-input-control/search-input-control.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AboutComponent } from './components/about/about.component';
import { LocationLinkComponent } from './components/location-link/location-link.component';
import { SharedLinkViewComponent } from './components/shared-link-view/shared-link-view.component';
import { NodeCopyDirective } from './common/directives/node-copy.directive';
import { NodeDeleteDirective } from './common/directives/node-delete.directive';
import { NodeMoveDirective } from './common/directives/node-move.directive';
import { NodeRestoreDirective } from './common/directives/node-restore.directive';
import { NodePermanentDeleteDirective } from './common/directives/node-permanent-delete.directive';
import { NodeUnshareDirective } from './common/directives/node-unshare.directive';
import { NodeVersionsDirective } from './common/directives/node-versions.directive';
import { NodeVersionsDialogComponent } from './dialogs/node-versions/node-versions.dialog';
import { ContentManagementService } from './common/services/content-management.service';
import { NodeActionsService } from './common/services/node-actions.service';
import { NodePermissionService } from './common/services/node-permission.service';
import { SearchResultsComponent } from './components/search/search-results/search-results.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileResolver } from './common/services/profile.resolver';
import { ExperimentalGuard } from './common/services/experimental-guard.service';

import { InfoDrawerComponent } from './components/info-drawer/info-drawer.component';
import { EditFolderDirective } from './directives/edit-folder.directive';
import { DownloadNodesDirective } from './directives/download-nodes.directive';
import { AppStoreModule } from './store/app-store.module';
import { PaginationDirective } from './directives/pagination.directive';
import { DocumentListDirective } from './directives/document-list.directive';
import { MaterialModule } from './material.module';
import { ExperimentalDirective } from './directives/experimental.directive';
import { ContentApiService } from './services/content-api.service';
import { ExtensionsModule } from './extensions.module';
import { ExtensionService } from './extensions/extension.service';
import { CoreExtensionsModule } from './extensions/core.extensions';
import { SearchResultsRowComponent } from './components/search/search-results-row/search-results-row.component';

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
        CoreModule,
        ContentModule,
        AppStoreModule,
        CoreExtensionsModule,
        ExtensionsModule
    ],
    declarations: [
        AppComponent,
        GenericErrorComponent,
        LoginComponent,
        LayoutComponent,
        SidenavViewsManagerDirective,
        HeaderComponent,
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
        PreviewComponent,
        AboutComponent,
        LocationLinkComponent,
        SearchResultsRowComponent,
        NodeCopyDirective,
        NodeDeleteDirective,
        NodeMoveDirective,
        NodeRestoreDirective,
        NodePermanentDeleteDirective,
        NodeUnshareDirective,
        NodeVersionsDirective,
        NodeVersionsDialogComponent,
        SearchResultsComponent,
        SettingsComponent,
        InfoDrawerComponent,
        SharedLinkViewComponent,
        EditFolderDirective,
        DownloadNodesDirective,
        PaginationDirective,
        DocumentListDirective,
        ExperimentalDirective
    ],
    providers: [
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
        ExtensionService
    ],
    entryComponents: [
        NodeVersionsDialogComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
