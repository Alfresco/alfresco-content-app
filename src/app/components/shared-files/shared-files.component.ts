/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2017 Alfresco Software Limited
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

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { AlfrescoApiService, UserPreferencesService } from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';

import { ContentManagementService } from '../../common/services/content-management.service';
import { PageComponent } from '../page.component';

@Component({
    templateUrl: './shared-files.component.html'
})
export class SharedFilesComponent extends PageComponent implements OnInit, OnDestroy {

    @ViewChild(DocumentListComponent)
    documentList: DocumentListComponent;

    private subscriptions: Subscription[] = [];

    constructor(
        private router: Router,
        private content: ContentManagementService,
        private apiService: AlfrescoApiService,
        preferences: UserPreferencesService) {
        super(preferences);
    }

    ngOnInit() {
        this.subscriptions = this.subscriptions.concat([
            this.content.deleteNode.subscribe(() => this.refresh()),
            this.content.moveNode.subscribe(() => this.refresh()),
            this.content.restoreNode.subscribe(() => this.refresh())
        ]);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    onNodeDoubleClick(link: { nodeId?: string }) {
        if (link && link.nodeId) {
            this.apiService.nodesApi.getNode(link.nodeId).then(
                (node: MinimalNodeEntity) => {
                    if (node && node.entry && node.entry.isFile) {
                        this.router.navigate(['/preview', node.entry.id]);
                    }
                }
            );
        }
    }

    fetchNodes(parentNodeId?: string) {
        // todo: remove once all views migrate to native data source
    }

    /** @override */
    isFileSelected(selection: Array<MinimalNodeEntity>): boolean {
        return selection && selection.length === 1;
    }

    refresh(): void {
        if (this.documentList) {
            this.documentList.reload();
        }
    }
}
