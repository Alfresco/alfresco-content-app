/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { AuthGuardEcm, LanguagePickerComponent, NotificationHistoryComponent, provideTranslations } from '@alfresco/adf-core';
import {
  ContentModule,
  ContentVersionService,
  LibraryNameColumnComponent,
  LibraryRoleColumnComponent,
  LibraryStatusColumnComponent,
  TrashcanNameColumnComponent
} from '@alfresco/adf-content-services';
import { DocumentBasePageService, ExtensionsDataLoaderGuard, provideContentAppExtensions } from '@alfresco/aca-shared';
import * as rules from '@alfresco/aca-shared/rules';
import { AppStoreModule } from './store/app-store.module';
import { provideAppExtensions, provideExtensions } from '@alfresco/adf-extensions';
import { ContentUrlService } from './services/content-url.service';
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
import { provideRouter } from '@angular/router';
import { UploadFilesDialogComponent } from './components/upload-files-dialog/upload-files-dialog.component';
import { provideFolderRulesExtension } from '@alfresco/aca-content/folder-rules';
import { TagsColumnComponent } from './components/dl-custom-components/tags-column/tags-column.component';
import { UserInfoComponent } from './components/common/user-info/user-info.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ContentManagementService } from './services/content-management.service';
import { SHELL_NAVBAR_MIN_WIDTH, ShellLayoutComponent } from '@alfresco/adf-core/shell';
import { UserMenuComponent } from './components/sidenav/user-menu/user-menu.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { SearchResultsRowComponent } from './components/search/search-results-row/search-results-row.component';
import { BulkActionsDropdownComponent } from './components/bulk-actions-dropdown/bulk-actions-dropdown.component';
import { AgentsButtonComponent } from './components/knowledge-retrieval/search-ai/agents-button/agents-button.component';
import { SaveSearchSidenavComponent } from './components/search/search-save/sidenav/save-search-sidenav.component';
import { IsFeatureSupportedInCurrentAcsPipe } from './pipes/is-feature-supported.pipe';

@NgModule({
  imports: [ContentModule.forRoot(), AppStoreModule, HammerModule],
  providers: [
    provideRouter(CONTENT_ROUTES),
    { provide: ContentVersionService, useClass: ContentUrlService },
    { provide: DocumentBasePageService, useExisting: ContentManagementService },
    provideAppExtensions(),
    provideContentAppExtensions(),
    provideFolderRulesExtension(),
    provideTranslations('app', 'assets'),
    { provide: SHELL_NAVBAR_MIN_WIDTH, useValue: 0 },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { closeOnNavigation: true, hasBackdrop: true, autoFocus: true }
    },
    provideExtensions({
      authGuards: {
        'app.auth': AuthGuardEcm,
        'app.extensions.dataLoaderGuard': ExtensionsDataLoaderGuard
      },
      components: {
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
        'app.toolbar.ai.agents-button': AgentsButtonComponent,
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
        'app.search.columns.name': SearchResultsRowComponent,
        'app.search.navbar': SaveSearchSidenavComponent
      },
      evaluators: {
        canToggleJoinLibrary: rules.canToggleJoinLibrary,
        canToggleSharedLink: rules.canToggleSharedLink,
        canToggleFileLock: rules.canToggleFileLock,
        canToggleFavorite: rules.canToggleFavorite,
        isLibraryManager: rules.isLibraryManager,
        canEditAspects: rules.canEditAspects,
        isSmartFolder: rules.isSmartFolder,
        isMultiSelection: rules.isMultiselection,
        canPrintFile: rules.canPrintFile,
        isPreferencesApiAvailable: rules.isPreferencesApiAvailable,
        isFolderInfoAvailable: rules.isFolderInfoAvailable,
        isBulkActionsAvailable: rules.isBulkActionsAvailable,

        'app.selection.canDelete': rules.canDeleteSelection,
        'app.selection.canDownload': rules.canDownloadSelection,
        'app.selection.notEmpty': rules.hasSelection,
        'app.selection.canAddFavorite': rules.canAddFavorite,
        'app.selection.canRemoveFavorite': rules.canRemoveFavorite,
        'app.selection.first.canUpdate': rules.canUpdateSelectedNode,
        'app.selection.file': rules.hasFileSelected,
        'app.selection.file.isLocked': rules.hasLockedFiles,
        'app.selection.file.canUploadVersion': rules.canUploadVersion,
        'app.selection.library': rules.hasLibrarySelected,
        'app.selection.hasLibraryRole': rules.hasLibraryRole,
        'app.selection.folder': rules.hasFolderSelected,
        'app.selection.folder.canUpdate': rules.canUpdateSelectedFolder,
        'app.selection.displayedKnowledgeRetrievalButton': rules.canDisplayKnowledgeRetrievalButton,

        'app.navigation.folder.canCreate': rules.canCreateFolder,
        'app.navigation.isTrashcan': rules.isTrashcan,
        'app.navigation.isLibraries': rules.isLibraries,
        'app.navigation.isSharedFiles': rules.isSharedFiles,
        'app.navigation.isFavorites': rules.isFavorites,
        'app.navigation.isRecentFiles': rules.isRecentFiles,
        'app.navigation.isSearchResults': rules.isSearchResults,
        'app.navigation.isPreview': rules.isPreview,
        'app.navigation.isDetails': rules.isDetails,

        'app.canShowLogout': rules.canShowLogout,
        'app.isContentServiceEnabled': rules.isContentServiceEnabled,
        'app.areTagsEnabled': rules.areTagsEnabled,
        'app.areCategoriesEnabled': rules.areCategoriesEnabled,
        'app.isSSOEnabled': rules.isSSOEnabled
      }
    }),
    IsFeatureSupportedInCurrentAcsPipe
  ]
})
export class ContentServiceExtensionModule {}
