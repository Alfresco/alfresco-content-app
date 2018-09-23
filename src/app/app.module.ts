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
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TRANSLATION_PROVIDER,
  CoreModule,
  AppConfigService,
  DebugAppConfigService
} from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';

import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';

import { FilesComponent } from './components/files/files.component';
import { LibrariesComponent } from './components/libraries/libraries.component';
import { NodeVersionsDialogComponent } from './dialogs/node-versions/node-versions.dialog';
import { LibraryDialogComponent } from './dialogs/library/library.dialog';
import { ContentManagementService } from './services/content-management.service';
import { NodeActionsService } from './services/node-actions.service';
import { NodePermissionService } from './services/node-permission.service';
import { ProfileResolver } from './services/profile.resolver';
import { RepositoryStatusResolver } from './services/repository-status.resolver';
import { ExperimentalGuard } from './services/experimental-guard.service';

import { AppStoreModule } from './store/app-store.module';
import { MaterialModule } from './material.module';
import { ContentApiService } from './services/content-api.service';
import { AppExtensionsModule } from './extensions.module';
import { CoreExtensionsModule } from './extensions/core.extensions.module';
import { AppRouteReuseStrategy } from './app.routes.strategy';
import { AppInfoDrawerModule } from './components/info-drawer/info.drawer.module';
import { DirectivesModule } from './directives/directives.module';
import { ContextMenuModule } from './components/context-menu/context-menu.module';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { AppToolbarModule } from './components/toolbar/toolbar.module';
import { AppCreateMenuModule } from './components/create-menu/create-menu.module';
import { AppSidenavModule } from './components/sidenav/sidenav.module';
import { AppPermissionsModule } from './components/permissions/permissions.module';
import { AppCommonModule } from './components/common/common.module';
import { AppLayoutModule } from './components/layout/layout.module';
import { AppCurrentUserModule } from './components/current-user/current-user.module';
import { AppSearchInputModule } from './components/search/search-input.module';
import { AppSearchResultsModule } from './components/search/search-results.module';
import { AppLoginModule } from './components/login/login.module';
import { AppAuthGuard } from './guards/auth.guard';
import { AppRuleGuard } from './guards/rule.guard';

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
    ContentModule.forRoot(),
    AppStoreModule,
    CoreExtensionsModule.forRoot(),
    ExtensionsModule.forRoot(),
    AppExtensionsModule,
    AppLoginModule,
    AppCommonModule,
    AppLayoutModule,
    AppCurrentUserModule,
    DirectivesModule,
    ContextMenuModule.forRoot(),
    AppInfoDrawerModule,
    AppToolbarModule,
    AppSidenavModule,
    AppCreateMenuModule,
    AppPermissionsModule,
    AppSearchInputModule,
    AppSearchResultsModule
  ],
  declarations: [
    AppComponent,
    FilesComponent,
    LibrariesComponent,
    NodeVersionsDialogComponent,
    LibraryDialogComponent
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
    AppRuleGuard,
    AppAuthGuard,
    ContentManagementService,
    NodeActionsService,
    NodePermissionService,
    ProfileResolver,
    RepositoryStatusResolver,
    ExperimentalGuard,
    ContentApiService
  ],
  entryComponents: [LibraryDialogComponent, NodeVersionsDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
