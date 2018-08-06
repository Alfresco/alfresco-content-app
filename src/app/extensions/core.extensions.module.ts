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

import { AuthGuardEcm, CoreModule } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { LayoutComponent } from '../components/layout/layout.component';
import { TrashcanComponent } from '../components/trashcan/trashcan.component';
import { ToolbarActionComponent } from './components/toolbar/toolbar-action.component';
import * as app from './evaluators/app.evaluators';
import * as nav from './evaluators/navigation.evaluators';
import { ExtensionService } from './extension.service';
import { CustomExtensionComponent } from './components/custom-component/custom.component';
import { ToggleInfoDrawerComponent } from '../components/toolbar/toggle-info-drawer/toggle-info-drawer.component';
import { ToggleFavoriteComponent } from '../components/toolbar/toggle-favorite/toggle-favorite.component';
import { ToolbarButtonComponent } from './components/toolbar/toolbar-button.component';

export function setupExtensions(extensions: ExtensionService): Function {
    extensions.setComponents({
        'app.layout.main': LayoutComponent,
        'app.components.trashcan': TrashcanComponent,
        'app.toolbar.toggleInfoDrawer': ToggleInfoDrawerComponent,
        'app.toolbar.toggleFavorite': ToggleFavoriteComponent
    });

    extensions.setAuthGuards({
        'app.auth': AuthGuardEcm
    });

    extensions.setEvaluators({
        'app.selection.canDelete': app.canDeleteSelection,
        'app.selection.canDownload': app.canDownloadSelection,
        'app.selection.notEmpty': app.hasSelection,
        'app.selection.canUnshare': app.canUnshareNodes,
        'app.selection.canAddFavorite': app.canAddFavorite,
        'app.selection.canRemoveFavorite': app.canRemoveFavorite,
        'app.selection.first.canUpdate': app.canUpdateSelectedNode,
        'app.selection.file': app.hasFileSelected,
        'app.selection.file.canShare': app.canShareFile,
        'app.selection.library': app.hasLibrarySelected,
        'app.selection.folder': app.hasFolderSelected,
        'app.selection.folder.canUpdate': app.canUpdateSelectedFolder,

        'app.navigation.folder.canCreate': app.canCreateFolder,
        'app.navigation.folder.canUpload': app.canUpload,
        'app.navigation.isTrashcan': nav.isTrashcan,
        'app.navigation.isNotTrashcan': nav.isNotTrashcan,
        'app.navigation.isLibraries': nav.isLibraries,
        'app.navigation.isNotLibraries': nav.isNotLibraries,
        'app.navigation.isSharedFiles': nav.isSharedFiles,
        'app.navigation.isNotSharedFiles': nav.isNotSharedFiles,
        'app.navigation.isFavorites': nav.isFavorites,
        'app.navigation.isNotFavorites': nav.isNotFavorites,
        'app.navigation.isRecentFiles': nav.isRecentFiles,
        'app.navigation.isNotRecentFiles': nav.isNotRecentFiles,
        'app.navigation.isSearchResults': nav.isSearchResults,
        'app.navigation.isNotSearchResults': nav.isNotSearchResults
    });

    return () => extensions.load();
}

@NgModule({
    imports: [CommonModule, CoreModule.forChild()],
    declarations: [
        ToolbarActionComponent,
        ToolbarButtonComponent,
        CustomExtensionComponent
    ],
    exports: [
        ToolbarActionComponent,
        ToolbarButtonComponent,
        CustomExtensionComponent
    ]
})
export class CoreExtensionsModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreExtensionsModule,
            providers: [
                ExtensionService,
                {
                    provide: APP_INITIALIZER,
                    useFactory: setupExtensions,
                    deps: [ExtensionService],
                    multi: true
                }
            ]
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: CoreExtensionsModule
        };
    }
}
