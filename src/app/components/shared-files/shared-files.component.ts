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

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { AlfrescoApiService, UserPreferencesService } from '@alfresco/adf-core';

import { ContentManagementService } from '../../common/services/content-management.service';
import { NodePermissionService } from '../../common/services/node-permission.service';
import { PageComponent } from '../page.component';

@Component({
    templateUrl: './shared-files.component.html'
})
export class SharedFilesComponent extends PageComponent implements OnInit {

    constructor(private router: Router,
                route: ActivatedRoute,
                private content: ContentManagementService,
                private apiService: AlfrescoApiService,
                public permission: NodePermissionService,
                preferences: UserPreferencesService) {
        super(preferences, route);
    }

    ngOnInit() {
        this.subscriptions = this.subscriptions.concat([
            this.content.nodeDeleted.subscribe(() => this.reload()),
            this.content.nodeMoved.subscribe(() => this.reload()),
            this.content.nodeRestored.subscribe(() => this.reload())
        ]);
    }

    onNodeDoubleClick(link: { nodeId?: string }) {
        if (link && link.nodeId) {
            this.apiService.nodesApi.getNode(link.nodeId).then(
                (node: MinimalNodeEntity) => {
                    if (node && node.entry && node.entry.isFile) {
                        this.router.navigate(['./preview', node.entry.id], { relativeTo: this.route });
                    }
                }
            );
        }
    }

    /** @override */
    isFileSelected(selection: Array<MinimalNodeEntity>): boolean {
        return selection && selection.length === 1;
    }
}
