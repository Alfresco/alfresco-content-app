/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
            this.content.restoreNode.subscribe(() => this.refresh()),
            this.content.toggleFavorite.subscribe(() => this.refresh())
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
