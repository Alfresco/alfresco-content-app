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

import { NgModule } from '@angular/core';
import { AuthGuardEcm, CoreModule } from '@alfresco/adf-core';
import { ExtensionService } from './extension.service';
import { LayoutComponent } from '../components/layout/layout.component';
import { ToolbarActionComponent } from './components/toolbar-action/toolbar-action.component';
import { CommonModule } from '@angular/common';
import { every, some } from './evaluators/core.evaluators';
import {
    canCreateFolder,
    hasFolderSelected,
    canUpdateSelectedFolder,
    hasFileSelected,
    canDownloadSelection
} from './evaluators/app.evaluators';
import { TrashcanComponent } from '../components/trashcan/trashcan.component';

@NgModule({
    imports: [CommonModule, CoreModule.forChild()],
    declarations: [ToolbarActionComponent],
    exports: [ToolbarActionComponent],
    entryComponents: [TrashcanComponent],
    providers: [ExtensionService]
})
export class CoreExtensionsModule {
    constructor(extensions: ExtensionService) {
        extensions
            .setComponent('app.layout.main', LayoutComponent)
            .setComponent('app.components.trashcan', TrashcanComponent)
            .setAuthGuard('app.auth', AuthGuardEcm)

            .setEvaluator('core.every', every)
            .setEvaluator('core.some', some)
            .setEvaluator('app.selection.canDownload', canDownloadSelection)
            .setEvaluator('app.selection.file', hasFileSelected)
            .setEvaluator('app.selection.folder', hasFolderSelected)
            .setEvaluator(
                'app.selection.folder.canUpdate',
                canUpdateSelectedFolder
            )
            .setEvaluator('app.navigation.folder.canCreate', canCreateFolder);
    }
}
