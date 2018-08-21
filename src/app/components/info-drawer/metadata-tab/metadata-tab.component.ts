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

import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { NodePermissionService } from '../../../services/node-permission.service';

@Component({
    selector: 'app-metadata-tab',
    template: `
        <adf-content-metadata-card
            [readOnly]="!canUpdateNode"
            [displayEmpty]="canUpdateNode"
            [preset]="'custom'"
            [node]="node">
        </adf-content-metadata-card>
    `,
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'app-metadata-tab' }
})
export class MetadataTabComponent implements OnChanges {
    @Input()
    node: MinimalNodeEntryEntity;

    canUpdateNode = false;

    constructor(public permission: NodePermissionService) {}

    ngOnChanges() {
        this.canUpdateNode =
            this.node && this.permission.check(this.node, ['update']);
    }
}
