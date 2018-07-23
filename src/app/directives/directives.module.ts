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
import { ExperimentalDirective } from './experimental.directive';
import { DocumentListDirective } from './document-list.directive';
import { EditFolderDirective } from './edit-folder.directive';
import { NodeCopyDirective } from './node-copy.directive';
import { NodeDeleteDirective } from './node-delete.directive';
import { NodeMoveDirective } from './node-move.directive';
import { NodePermanentDeleteDirective } from './node-permanent-delete.directive';
import { NodePermissionsDirective } from './node-permissions.directive';
import { NodeRestoreDirective } from './node-restore.directive';
import { NodeUnshareDirective } from './node-unshare.directive';
import { NodeVersionsDirective } from './node-versions.directive';
import { PaginationDirective } from './pagination.directive';

@NgModule({
    declarations: [
        ExperimentalDirective,
        DocumentListDirective,
        EditFolderDirective,
        NodeCopyDirective,
        NodeDeleteDirective,
        NodeMoveDirective,
        NodePermanentDeleteDirective,
        NodePermissionsDirective,
        NodeRestoreDirective,
        NodeUnshareDirective,
        NodeVersionsDirective,
        PaginationDirective
    ],
    exports: [
        ExperimentalDirective,
        DocumentListDirective,
        EditFolderDirective,
        NodeCopyDirective,
        NodeDeleteDirective,
        NodeMoveDirective,
        NodePermanentDeleteDirective,
        NodePermissionsDirective,
        NodeRestoreDirective,
        NodeUnshareDirective,
        NodeVersionsDirective,
        PaginationDirective
    ]
})
export class DirectivesModule {}
