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

import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TRANSLATION_PROVIDER,
  CoreModule,
  AppConfigService,
  DebugAppConfigService,
  AuthGuardEcm,
  LanguagePickerComponent,
  NotificationHistoryComponent,
  UserInfoComponent
} from '@alfresco/adf-core';
import {
  ContentModule,
  ContentVersionService,
  LibraryNameColumnComponent,
  LibraryRoleColumnComponent,
  LibraryStatusColumnComponent,
  TrashcanNameColumnComponent
} from '@alfresco/adf-content-services';
import { ExtensionsDataLoaderGuard, RouterExtensionService, SharedModule } from '@alfresco/aca-shared';
import * as rules from '@alfresco/aca-shared/rules';

import { FilesComponent } from './components/files/files.component';
import { LibrariesComponent } from './components/libraries/libraries.component';
import { FavoriteLibrariesComponent } from './components/favorite-libraries/favorite-libraries.component';
import { ViewProfileModule } from './components/view-profile/view-profile.module';

import { AppStoreModule } from './store/app-store.module';
import { MaterialModule } from '../material.module';
import { CoreExtensionsModule } from '../extensions/core.extensions.module';
import { AppInfoDrawerModule } from './components/info-drawer/info.drawer.module';
import { DirectivesModule } from './directives/directives.module';
import { ContextMenuModule } from './components/context-menu/context-menu.module';
import { ExtensionService, ExtensionsModule } from '@alfresco/adf-extensions';
import { AppToolbarModule } from './components/toolbar/toolbar.module';
import { AppCreateMenuModule } from './components/create-menu/create-menu.module';
import { AppSidenavModule } from './components/sidenav/sidenav.module';
import { AppCommonModule } from './components/common/common.module';
import { AppLayoutModule } from './components/layout/layout.module';
import { AppSearchInputModule } from './components/search/search-input.module';
import { DocumentListCustomComponentsModule } from './components/dl-custom-components/document-list-custom-components.module';
import { AppSearchResultsModule } from './components/search/search-results.module';
import { AppLoginModule } from './components/login/login.module';
import { AppHeaderModule } from './components/header/header.module';
import { AppNodeVersionModule } from './components/node-version/node-version.module';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { RecentFilesComponent } from './components/recent-files/recent-files.component';
import { SharedFilesComponent } from './components/shared-files/shared-files.component';
import { CreateFromTemplateDialogComponent } from './dialogs/node-template/create-from-template.dialog';
import { environment } from '../../environments/environment';
import { DetailsComponent } from './components/details/details.component';
import { ContentUrlService } from './services/content-url.service';
import { HomeComponent } from './components/home/home.component';

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
import { LocationLinkComponent } from './components/common/location-link/location-link.component';
import { LogoutComponent } from './components/common/logout/logout.component';
import { ToggleSharedComponent } from './components/common/toggle-shared/toggle-shared.component';
import { CustomNameColumnComponent } from './components/dl-custom-components/name-column/name-column.component';
import { AppHeaderComponent } from './components/header/header.component';
import { CommentsTabComponent } from './components/info-drawer/comments-tab/comments-tab.component';
import { LibraryMetadataTabComponent } from './components/info-drawer/library-metadata-tab/library-metadata-tab.component';
import { MetadataTabComponent } from './components/info-drawer/metadata-tab/metadata-tab.component';
import { VersionsTabComponent } from './components/info-drawer/versions-tab/versions-tab.component';
import { PreviewComponent } from './components/preview/preview.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { DocumentDisplayModeComponent } from './components/toolbar/document-display-mode/document-display-mode.component';
import { ToggleEditOfflineComponent } from './components/toolbar/toggle-edit-offline/toggle-edit-offline.component';
import { ToggleFavoriteLibraryComponent } from './components/toolbar/toggle-favorite-library/toggle-favorite-library.component';
import { ToggleFavoriteComponent } from './components/toolbar/toggle-favorite/toggle-favorite.component';
import { ToggleInfoDrawerComponent } from './components/toolbar/toggle-info-drawer/toggle-info-drawer.component';
import { ToggleJoinLibraryButtonComponent } from './components/toolbar/toggle-join-library/toggle-join-library-button.component';
import { ToggleJoinLibraryMenuComponent } from './components/toolbar/toggle-join-library/toggle-join-library-menu.component';
import { ViewNodeComponent } from './components/toolbar/view-node/view-node.component';
import { CONTENT_ROUTES } from './content.routes';
import { RouterModule } from '@angular/router';

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
    ContentModule.forRoot(),
    RouterModule.forChild(CONTENT_ROUTES),
    CoreModule.forChild(),
    ExtensionsModule.forChild(),
    CoreExtensionsModule.forChild(),
    SharedModule,
    MaterialModule,
    AppStoreModule,
    AppLoginModule,
    AppCommonModule,
    AppLayoutModule,
    DirectivesModule,
    ContextMenuModule,
    AppInfoDrawerModule,
    AppToolbarModule,
    AppSidenavModule,
    AppCreateMenuModule,
    DocumentListCustomComponentsModule,
    AppSearchInputModule,
    AppSearchResultsModule,
    AppHeaderModule,
    AppNodeVersionModule,
    HammerModule,
    ViewProfileModule
  ],
  declarations: [
    FilesComponent,
    DetailsComponent,
    LibrariesComponent,
    FavoriteLibrariesComponent,
    FavoritesComponent,
    RecentFilesComponent,
    SharedFilesComponent,
    CreateFromTemplateDialogComponent,
    HomeComponent
  ],
  providers: [
    { provide: AppConfigService, useClass: DebugAppConfigService },
    { provide: ContentVersionService, useClass: ContentUrlService },
    {
      provide: TRANSLATION_PROVIDER,
      multi: true,
      useValue: {
        name: 'app',
        source: 'assets'
      }
    }
  ]
})
export class ContentServiceExtensionModule {
  constructor(public extensions: ExtensionService, public routeExtensionService: RouterExtensionService) {
    extensions.setAuthGuards({
      'app.auth': AuthGuardEcm,
      'app.extensions.dataLoaderGuard': ExtensionsDataLoaderGuard
    });

    extensions.setComponents({
      'app.layout.header': AppHeaderComponent,
      'app.layout.sidenav': SidenavComponent,
      'app.components.tabs.metadata': MetadataTabComponent,
      'app.components.tabs.library.metadata': LibraryMetadataTabComponent,
      'app.components.tabs.comments': CommentsTabComponent,
      'app.components.tabs.versions': VersionsTabComponent,
      'app.components.preview': PreviewComponent,
      'app.toolbar.toggleInfoDrawer': ToggleInfoDrawerComponent,
      'app.toolbar.toggleFavorite': ToggleFavoriteComponent,
      'app.toolbar.toggleFavoriteLibrary': ToggleFavoriteLibraryComponent,
      'app.toolbar.toggleJoinLibrary': ToggleJoinLibraryButtonComponent,
      'app.toolbar.cardView': DocumentDisplayModeComponent,
      'app.menu.toggleJoinLibrary': ToggleJoinLibraryMenuComponent,
      'app.shared-link.toggleSharedLink': ToggleSharedComponent,
      'app.columns.name': CustomNameColumnComponent,
      'app.columns.libraryName': LibraryNameColumnComponent,
      'app.columns.libraryRole': LibraryRoleColumnComponent,
      'app.columns.libraryStatus': LibraryStatusColumnComponent,
      'app.columns.trashcanName': TrashcanNameColumnComponent,
      'app.columns.location': LocationLinkComponent,
      'app.toolbar.toggleEditOffline': ToggleEditOfflineComponent,
      'app.toolbar.viewNode': ViewNodeComponent,
      'app.languagePicker': LanguagePickerComponent,
      'app.logout': LogoutComponent,
      'app.user': UserInfoComponent,
      'app.notification-center': NotificationHistoryComponent
    });

    extensions.setEvaluators({
      canCopyNode: rules.canCopyNode,
      canToggleJoinLibrary: rules.canToggleJoinLibrary,
      canEditFolder: rules.canEditFolder,
      isTrashcanItemSelected: rules.isTrashcanItemSelected,
      canViewFile: rules.canViewFile,
      canLeaveLibrary: rules.canLeaveLibrary,
      canToggleSharedLink: rules.canToggleSharedLink,
      canShowInfoDrawer: rules.canShowInfoDrawer,
      canManageFileVersions: rules.canManageFileVersions,
      canManagePermissions: rules.canManagePermissions,
      canToggleEditOffline: rules.canToggleEditOffline,
      canToggleFavorite: rules.canToggleFavorite,
      isLibraryManager: rules.isLibraryManager,
      canEditAspects: rules.canEditAspects,
      canInfoPreview: rules.canInfoPreview,
      showInfoSelectionButton: rules.showInfoSelectionButton,

      'app.selection.canDelete': rules.canDeleteSelection,
      'app.selection.file.canUnlock': rules.canUnlockFile,
      'app.selection.file.canLock': rules.canLockFile,
      'app.selection.canDownload': rules.canDownloadSelection,
      'app.selection.notEmpty': rules.hasSelection,
      'app.selection.canUnshare': rules.canUnshareNodes,
      'app.selection.canAddFavorite': rules.canAddFavorite,
      'app.selection.canRemoveFavorite': rules.canRemoveFavorite,
      'app.selection.first.canUpdate': rules.canUpdateSelectedNode,
      'app.selection.file': rules.hasFileSelected,
      'app.selection.file.canShare': rules.canShareFile,
      'app.selection.file.isShared': rules.isShared,
      'app.selection.file.isLocked': rules.hasLockedFiles,
      'app.selection.file.isLockOwner': rules.isUserWriteLockOwner,
      'app.selection.file.canUploadVersion': rules.canUploadVersion,
      'app.selection.library': rules.hasLibrarySelected,
      'app.selection.isPrivateLibrary': rules.isPrivateLibrary,
      'app.selection.hasLibraryRole': rules.hasLibraryRole,
      'app.selection.hasNoLibraryRole': rules.hasNoLibraryRole,
      'app.selection.folder': rules.hasFolderSelected,
      'app.selection.folder.canUpdate': rules.canUpdateSelectedFolder,

      'app.navigation.folder.canCreate': rules.canCreateFolder,
      'app.navigation.folder.canUpload': rules.canUpload,
      'app.navigation.isTrashcan': rules.isTrashcan,
      'app.navigation.isNotTrashcan': rules.isNotTrashcan,
      'app.navigation.isLibraries': rules.isLibraries,
      'app.navigation.isLibraryFiles': rules.isLibraryFiles,
      'app.navigation.isPersonalFiles': rules.isPersonalFiles,
      'app.navigation.isNotLibraries': rules.isNotLibraries,
      'app.navigation.isSharedFiles': rules.isSharedFiles,
      'app.navigation.isNotSharedFiles': rules.isNotSharedFiles,
      'app.navigation.isFavorites': rules.isFavorites,
      'app.navigation.isNotFavorites': rules.isNotFavorites,
      'app.navigation.isRecentFiles': rules.isRecentFiles,
      'app.navigation.isNotRecentFiles': rules.isNotRecentFiles,
      'app.navigation.isSearchResults': rules.isSearchResults,
      'app.navigation.isNotSearchResults': rules.isNotSearchResults,
      'app.navigation.isPreview': rules.isPreview,
      'app.navigation.isSharedPreview': rules.isSharedPreview,
      'app.navigation.isFavoritesPreview': rules.isFavoritesPreview,
      'app.navigation.isSharedFileViewer': rules.isSharedFileViewer,

      'repository.isQuickShareEnabled': rules.hasQuickShareEnabled,
      'user.isAdmin': rules.isAdmin,
      'app.canShowLogout': rules.canShowLogout,
      'app.isContentServiceEnabled': rules.isContentServiceEnabled
    });
  }
}
