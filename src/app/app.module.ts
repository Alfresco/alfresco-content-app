/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TRANSLATION_PROVIDER,
  CoreModule,
  AppConfigService,
  DebugAppConfigService
} from '@alfresco/adf-core';
import {
  LibraryDialogComponent,
  ContentModule
} from '@alfresco/adf-content-services';
import { AppRouteReuseStrategy, SharedModule } from '@alfresco/aca-shared';

import { AppComponent } from '@app/app.component';
import { APP_ROUTES } from '@app/app.routes';

import { FilesComponent } from '@app/components/files/files.component';
import { LibrariesComponent } from '@app/components/libraries/libraries.component';
import { FavoriteLibrariesComponent } from '@app/components/favorite-libraries/favorite-libraries.component';
import { NodeVersionUploadDialogComponent } from '@app/dialogs/node-version-upload/node-version-upload.dialog';
import { NodeVersionsDialogComponent } from '@app/dialogs/node-versions/node-versions.dialog';

import { AppStoreModule } from '@app/store/app-store.module';
import { MaterialModule } from '@app/material.module';
import { AppExtensionsModule } from '@app/extensions.module';
import { CoreExtensionsModule } from '@app/extensions/core.extensions.module';
import { AppInfoDrawerModule } from '@app/components/info-drawer/info.drawer.module';
import { DirectivesModule } from '@app/directives/directives.module';
import { ContextMenuModule } from '@app/components/context-menu/context-menu.module';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { AppToolbarModule } from '@app/components/toolbar/toolbar.module';
import { AppCreateMenuModule } from '@app/components/create-menu/create-menu.module';
import { AppSidenavModule } from '@app/components/sidenav/sidenav.module';
import { AppPermissionsModule } from '@app/components/permissions/permissions.module';
import { AppCommonModule } from '@app/components/common/common.module';
import { AppLayoutModule } from '@app/components/layout/layout.module';
import { AppCurrentUserModule } from '@app/components/current-user/current-user.module';
import { AppSearchInputModule } from '@app/components/search/search-input.module';
import { DocumentListCustomComponentsModule } from '@app/components/dl-custom-components/document-list-custom-components.module';
import { AppSearchResultsModule } from '@app/components/search/search-results.module';
import { AppLoginModule } from '@app/components/login/login.module';
import { AppHeaderModule } from '@app/components/header/header.module';
import { AppNodeVersionModule } from '@app/components/node-version/node-version.module';
import { FavoritesComponent } from '@app/components/favorites/favorites.component';
import { RecentFilesComponent } from '@app/components/recent-files/recent-files.component';
import { SharedFilesComponent } from '@app/components/shared-files/shared-files.component';
import { CreateFromTemplateDialogComponent } from '@app/dialogs/node-template/create-from-template.dialog';
import { environment } from '@app/../environments/environment';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeDe from '@angular/common/locales/de';
import localeIt from '@angular/common/locales/it';
import localeEs from '@angular/common/locales/es';
import localeJa from '@angular/common/locales/ja';
import localeNl from '@angular/common/locales/nl';
import localePt from '@angular/common/locales/pt';
import localeNb from '@angular/common/locales/nb';
import localeRu from '@angular/common/locales/ru';
import localeCh from '@angular/common/locales/zh';
import localeAr from '@angular/common/locales/ar';
import localeCs from '@angular/common/locales/cs';
import localePl from '@angular/common/locales/pl';
import localeFi from '@angular/common/locales/fi';
import localeDa from '@angular/common/locales/da';
import localeSv from '@angular/common/locales/sv';

registerLocaleData(localeFr);
registerLocaleData(localeDe);
registerLocaleData(localeIt);
registerLocaleData(localeEs);
registerLocaleData(localeJa);
registerLocaleData(localeNl);
registerLocaleData(localePt);
registerLocaleData(localeNb);
registerLocaleData(localeRu);
registerLocaleData(localeCh);
registerLocaleData(localeAr);
registerLocaleData(localeCs);
registerLocaleData(localePl);
registerLocaleData(localeFi);
registerLocaleData(localeDa);
registerLocaleData(localeSv);

@NgModule({
  imports: [
    BrowserModule,
    environment.e2e ? NoopAnimationsModule : BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(APP_ROUTES, {
      useHash: true,
      enableTracing: false // enable for debug only
    }),
    MaterialModule,
    CoreModule.forRoot(),
    ContentModule.forRoot(),
    SharedModule.forRoot(),
    AppStoreModule,
    CoreExtensionsModule.forRoot(),
    ExtensionsModule,
    AppExtensionsModule,
    AppLoginModule,
    AppCommonModule,
    AppLayoutModule,
    AppCurrentUserModule,
    DirectivesModule,
    ContextMenuModule,
    AppInfoDrawerModule,
    AppToolbarModule,
    AppSidenavModule,
    AppCreateMenuModule,
    DocumentListCustomComponentsModule,
    AppPermissionsModule,
    AppSearchInputModule,
    AppSearchResultsModule,
    AppHeaderModule,
    AppNodeVersionModule
  ],
  declarations: [
    AppComponent,
    FilesComponent,
    LibrariesComponent,
    FavoriteLibrariesComponent,
    NodeVersionUploadDialogComponent,
    NodeVersionsDialogComponent,
    FavoritesComponent,
    RecentFilesComponent,
    SharedFilesComponent,
    CreateFromTemplateDialogComponent
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
    }
  ],
  entryComponents: [
    NodeVersionsDialogComponent,
    NodeVersionUploadDialogComponent,
    LibraryDialogComponent,
    CreateFromTemplateDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
