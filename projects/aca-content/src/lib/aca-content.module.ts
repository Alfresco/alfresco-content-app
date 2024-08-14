/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TRANSLATION_PROVIDER, AuthGuardEcm, LanguagePickerComponent, NotificationHistoryComponent } from '@alfresco/adf-core';
import {
  ContentModule,
  ContentVersionService,
  LibraryNameColumnComponent,
  LibraryRoleColumnComponent,
  LibraryStatusColumnComponent,
  TrashcanNameColumnComponent
} from '@alfresco/adf-content-services';
import { DocumentBasePageService, ExtensionsDataLoaderGuard, OpenInAppComponent } from '@alfresco/aca-shared';
import * as rules from '@alfresco/aca-shared/rules';
import { AppStoreModule } from './store/app-store.module';
import { CoreExtensionsModule } from './extensions/core.extensions.module';
import { AppInfoDrawerModule } from './components/info-drawer/info.drawer.module';
import { ExtensionService, ExtensionsModule } from '@alfresco/adf-extensions';
import { APP_TOOLBAR_DIRECTIVES } from './components/toolbar';
import { APP_SIDENAV_DIRECTIVES } from './components/sidenav';
import { APP_COMMON_DIRECTIVES } from './components/common';
import { APP_SEARCH_DIRECTIVES } from './components/search';
import { CreateFromTemplateDialogComponent } from './dialogs/node-template/create-from-template.dialog';
import { ContentUrlService } from './services/content-url.service';
import { CommonModule } from '@angular/common';
import { LocationLinkComponent } from './components/common/location-link/location-link.component';
import { LogoutComponent } from './components/common/logout/logout.component';
import { ToggleSharedComponent } from './components/common/toggle-shared/toggle-shared.component';
import { CustomNameColumnComponent } from './components/dl-custom-components/name-column/name-column.component';
import { CommentsTabComponent } from './components/info-drawer/comments-tab/comments-tab.component';
import { LibraryMetadataTabComponent } from './components/info-drawer/library-metadata-tab/library-metadata-tab.component';
import { MetadataTabComponent } from './components/info-drawer/metadata-tab/metadata-tab.component';
import { VersionsTabComponent } from './components/info-drawer/versions-tab/versions-tab.component';
import { PreviewComponent } from '@alfresco/aca-content/viewer';
import { ToggleEditOfflineComponent } from './components/toolbar/toggle-edit-offline/toggle-edit-offline.component';
import { ToggleFavoriteLibraryComponent } from './components/toolbar/toggle-favorite-library/toggle-favorite-library.component';
import { ToggleFavoriteComponent } from './components/toolbar/toggle-favorite/toggle-favorite.component';
import { ToggleInfoDrawerComponent } from './components/toolbar/toggle-info-drawer/toggle-info-drawer.component';
import { ToggleJoinLibraryButtonComponent } from './components/toolbar/toggle-join-library/toggle-join-library-button.component';
import { ToggleJoinLibraryMenuComponent } from './components/toolbar/toggle-join-library/toggle-join-library-menu.component';
import { ViewNodeComponent } from './components/toolbar/view-node/view-node.component';
import { CONTENT_ROUTES } from './aca-content.routes';
import { RouterModule } from '@angular/router';
import { UploadFilesDialogComponent } from './components/upload-files-dialog/upload-files-dialog.component';
import { AcaFolderRulesModule } from '@alfresco/aca-content/folder-rules';
import { TagsColumnComponent } from './components/dl-custom-components/tags-column/tags-column.component';
import { UserInfoComponent } from './components/common/user-info/user-info.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ContentManagementService } from './services/content-management.service';
import { ShellLayoutComponent, SHELL_NAVBAR_MIN_WIDTH } from '@alfresco/adf-core/shell';
import { UserMenuComponent } from './components/sidenav/user-menu/user-menu.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { SearchResultsRowComponent } from './components/search/search-results-row/search-results-row.component';
import { BulkActionsDropdownComponent } from './components/bulk-actions-dropdown/bulk-actions-dropdown.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContentModule.forRoot(),
    RouterModule.forChild(CONTENT_ROUTES),
    ExtensionsModule,
    CoreExtensionsModule,
    AppStoreModule,
    ...APP_COMMON_DIRECTIVES,
    ...APP_TOOLBAR_DIRECTIVES,
    ...APP_SIDENAV_DIRECTIVES,
    ...APP_SEARCH_DIRECTIVES,
    ContextMenuComponent,
    AppInfoDrawerModule,
    HammerModule,
    AcaFolderRulesModule,
    CreateFromTemplateDialogComponent,
    OpenInAppComponent,
    UploadFilesDialogComponent
  ],
  providers: [
    { provide: ContentVersionService, useClass: ContentUrlService },
    { provide: DocumentBasePageService, useExisting: ContentManagementService },
    {
      provide: TRANSLATION_PROVIDER,
      multi: true,
      useValue: {
        name: 'app',
        source: 'assets'
      }
    },
    { provide: SHELL_NAVBAR_MIN_WIDTH, useValue: 0 },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { closeOnNavigation: true, hasBackdrop: true, autoFocus: true }
    }
  ]
})
export class ContentServiceExtensionModule {
  constructor(public extensions: ExtensionService) {
    extensions.setAuthGuards({
      'app.auth': AuthGuardEcm,
      'app.extensions.dataLoaderGuard': ExtensionsDataLoaderGuard
    });

    extensions.setComponents({
      'app.layout.main': ShellLayoutComponent,
      'app.layout.sidenav': SidenavComponent,
      'app.shell.sibling': UploadFilesDialogComponent,
      'app.components.tabs.metadata': MetadataTabComponent,
      'app.components.tabs.library.metadata': LibraryMetadataTabComponent,
      'app.components.tabs.comments': CommentsTabComponent,
      'app.components.tabs.versions': VersionsTabComponent,
      'app.components.preview': PreviewComponent,
      'app.toolbar.toggleInfoDrawer': ToggleInfoDrawerComponent,
      'app.toolbar.toggleFavorite': ToggleFavoriteComponent,
      'app.toolbar.toggleFavoriteLibrary': ToggleFavoriteLibraryComponent,
      'app.toolbar.toggleJoinLibrary': ToggleJoinLibraryButtonComponent,
      'app.menu.toggleJoinLibrary': ToggleJoinLibraryMenuComponent,
      'app.bulk-actions-dropdown': BulkActionsDropdownComponent,
      'app.shared-link.toggleSharedLink': ToggleSharedComponent,
      'app.columns.name': CustomNameColumnComponent,
      'app.columns.libraryName': LibraryNameColumnComponent,
      'app.columns.libraryRole': LibraryRoleColumnComponent,
      'app.columns.libraryStatus': LibraryStatusColumnComponent,
      'app.columns.trashcanName': TrashcanNameColumnComponent,
      'app.columns.location': LocationLinkComponent,
      'app.columns.tags': TagsColumnComponent,
      'app.toolbar.toggleEditOffline': ToggleEditOfflineComponent,
      'app.toolbar.viewNode': ViewNodeComponent,
      'app.languagePicker': LanguagePickerComponent,
      'app.logout': LogoutComponent,
      'app.user': UserInfoComponent,
      'app.notification-center': NotificationHistoryComponent,
      'app.user.menu': UserMenuComponent,
      'app.search.columns.name': SearchResultsRowComponent
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
      canShowExpand: rules.canShowExpand,
      canInfoPreview: rules.canInfoPreview,

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
      'app.isContentServiceEnabled': rules.isContentServiceEnabled,
      'app.isUploadSupported': rules.isUploadSupported,
      'app.canCreateLibrary': rules.canCreateLibrary,
      'app.areTagsEnabled': rules.areTagsEnabled,
      'app.areCategoriesEnabled': rules.areCategoriesEnabled
    });
  }
}
