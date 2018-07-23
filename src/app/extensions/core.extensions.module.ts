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
import { ToolbarActionComponent } from './components/toolbar-action/toolbar-action.component';
import * as app from './evaluators/app.evaluators';
import { ExtensionService } from './extension.service';

export function setupExtensions(extensions: ExtensionService): Function {
    return () =>
        new Promise(resolve => {
            extensions.setComponents({
                'app.layout.main': LayoutComponent,
                'app.components.trashcan': TrashcanComponent
            });

            extensions.setAuthGuards({
                'app.auth': AuthGuardEcm
            });

            extensions.setEvaluators({
                'app.selection.canDownload': app.canDownloadSelection,
                'app.selection.notEmpty': app.hasSelection,
                'app.selection.file': app.hasFileSelected,
                'app.selection.folder': app.hasFolderSelected,
                'app.selection.folder.canUpdate': app.canUpdateSelectedFolder,
                'app.navigation.folder.canCreate': app.canCreateFolder,
                'app.navigation.isTrashcan': app.isTrashcan,
                'app.navigation.isNotTrashcan': app.isNotTrashcan
            });

            resolve(true);
        });
}

@NgModule({
    imports: [CommonModule, CoreModule.forChild()],
    declarations: [ToolbarActionComponent],
    exports: [ToolbarActionComponent]
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
