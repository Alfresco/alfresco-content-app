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

import { Observable, Subscription } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MinimalNodeEntity, MinimalNodeEntryEntity, PathElementEntity, NodePaging, PathElement } from 'alfresco-js-api';
import { UploadService, FileUploadEvent, NodesApiService, AlfrescoContentService, AlfrescoApiService } from 'ng2-alfresco-core';

import { BrowsingFilesService } from '../../common/services/browsing-files.service';
import { ContentManagementService } from '../../common/services/content-management.service';
import { NodeActionsService } from '../../common/services/node-actions.service';

import { PageComponent } from '../page.component';

@Component({
    templateUrl: './files.component.html'
})
export class FilesComponent extends PageComponent implements OnInit, OnDestroy {
    private routeData: any = {};
    isValidPath = true;

    private nodePath: PathElement[];
    private onCopyNode: Subscription;
    private onRemoveItem: Subscription;
    private onCreateFolder: Subscription;
    private onEditFolder: Subscription;
    private onDeleteNode: Subscription;
    private onMoveNode: Subscription;
    private onRestoreNode: Subscription;
    private onFileUploadComplete: Subscription;
    private onToggleFavorite: Subscription;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private nodesApi: NodesApiService,
        private changeDetector: ChangeDetectorRef,
        private nodeActionsService: NodeActionsService,
        private uploadService: UploadService,
        private contentManagementService: ContentManagementService,
        private browsingFilesService: BrowsingFilesService,
        private contentService: AlfrescoContentService,
        private apiService: AlfrescoApiService) {
        super();
    }

    ngOnInit() {
        const { route, contentManagementService, contentService, nodeActionsService, uploadService } = this;
        const { data } = route.snapshot;

        this.routeData = data;
        this.title = data.i18nTitle;

        route.params.subscribe(({ id }: Params) => {
            const nodeId = id || data.defaultNodeId;
            this.isLoading = true;

            this.fetchNode(nodeId)
                .do((node) => this.updateCurrentNode(node))
                .flatMap((node) => this.fetchNodes(node.id))
                .subscribe(
                    (page) => {
                        this.isValidPath = true;
                        this.onPageLoaded(page);
                    },
                    error => {
                        this.isValidPath = false;
                        this.onFetchError(error);
                    }
                );
        });

        this.onCopyNode = nodeActionsService.contentCopied
            .subscribe((nodes) => this.onContentCopied(nodes));
        this.onCreateFolder = contentService.folderCreate.subscribe(() => this.load());
        this.onEditFolder = contentService.folderEdit.subscribe(() => this.load());
        this.onDeleteNode = contentManagementService.deleteNode.subscribe(() => this.load());
        this.onMoveNode = contentManagementService.moveNode.subscribe(() => this.load());
        this.onRestoreNode = contentManagementService.restoreNode.subscribe(() => this.load());
        this.onToggleFavorite = contentManagementService.toggleFavorite.subscribe(() => this.load());
        this.onFileUploadComplete = uploadService.fileUploadComplete
            .subscribe(file => this.onFileUploadedEvent(file));
        this.onRemoveItem = uploadService.fileUploadDeleted
            .subscribe((file) => this.onFileUploadedEvent(file));
    }

    ngOnDestroy() {
        this.onCopyNode.unsubscribe();
        this.onRemoveItem.unsubscribe();
        this.onCreateFolder.unsubscribe();
        this.onEditFolder.unsubscribe();
        this.onDeleteNode.unsubscribe();
        this.onMoveNode.unsubscribe();
        this.onRestoreNode.unsubscribe();
        this.onFileUploadComplete.unsubscribe();
        this.onToggleFavorite.unsubscribe();

        this.browsingFilesService.onChangeParent.next(null);
    }

    fetchNode(nodeId: string): Observable<MinimalNodeEntryEntity> {
        return this.nodesApi.getNode(nodeId);
    }

    fetchNodes(parentNodeId?: string, options: any = {}): Observable<NodePaging> {
        return this.nodesApi.getNodeChildren(parentNodeId, options);
    }

    navigate(nodeId: string = null) {
        const commands = [ './' ];

        if (nodeId && !this.isRootNode(nodeId)) {
            commands.push(nodeId);
        }

        this.router.navigate(commands, {
            relativeTo: this.route.parent
        });
    }

    onNodeDoubleClick(node: MinimalNodeEntryEntity) {
        if (node) {
            if (node.isFolder) {
                this.navigate(node.id);
            }

            if (node.isFile) {
                this.router.navigate(['/preview', node.id]);
            }
        }
    }

    onBreadcrumbNavigate(route: PathElementEntity) {
        // todo: review this approach once 5.2.3 is out
        if (this.nodePath && this.nodePath.length > 2) {
            if (this.nodePath[1].name === 'Sites' && this.nodePath[2].id === route.id) {
                return this.navigate(this.nodePath[3].id);
            }
        }
        this.navigate(route.id);
    }

    onFileUploadedEvent(event: FileUploadEvent) {
        if (event && event.file.options.parentId === this.getParentNodeId()) {
            this.load();
        }
    }

    onContentCopied(nodes: MinimalNodeEntity[]) {
        const newNode = nodes
            .find((node) => {
                return node && node.entry && node.entry.parentId === this.getParentNodeId();
            });
        if (newNode) {
            this.load();
        }
    }

    canCreateContent(parentNode: MinimalNodeEntryEntity): boolean {
        if (parentNode) {
            return this.contentService.hasPermission(parentNode, 'create');
        }

        return false;
    }

    load(showIndicator: boolean = false, pagination: any = {}) {
        this.isLoading = showIndicator;

        this.fetchNodes(this.getParentNodeId(), pagination)
            .subscribe(
                (page) => this.onPageLoaded(page),
                error => this.onFetchError(error),
                () => this.changeDetector.detectChanges()
            );
    }

    // todo: review this approach once 5.2.3 is out
    private async updateCurrentNode(node: MinimalNodeEntryEntity) {
        this.nodePath = null;

        if (node && node.path && node.path.elements) {
            const elements = node.path.elements;

            this.nodePath = elements.map(pathElement => {
                return Object.assign({}, pathElement);
            });

            if (elements.length > 1) {
                if (elements[1].name === 'User Homes') {
                    elements.splice(0, 2);
                } else if (elements[1].name === 'Sites') {
                    await this.normalizeSitePath(node);
                }
            }
        }

        this.node = node;
        this.browsingFilesService.onChangeParent.next(node);
    }

    // todo: review this approach once 5.2.3 is out
    private async normalizeSitePath(node: MinimalNodeEntryEntity) {
        const elements = node.path.elements;

        // remove 'Sites'
        elements.splice(1, 1);

        if (this.isSiteContainer(node)) {
            // rename 'documentLibrary' entry to the target site display name
            // clicking on the breadcrumb entry loads the site content
            const parentNode = await this.apiService.nodesApi.getNodeInfo(node.parentId);
            node.name = parentNode.properties['cm:title'] || parentNode.name;

            // remove the site entry
            elements.splice(1, 1);
        } else {
            // remove 'documentLibrary' in the middle of the path
            const docLib = elements.findIndex(el => el.name === 'documentLibrary');
            if (docLib > -1) {
                const siteFragment = elements[docLib - 1];
                const siteNode = await this.apiService.nodesApi.getNodeInfo(siteFragment.id);

                // apply Site Name to the parent fragment
                siteFragment.name = siteNode.properties['cm:title'] || siteNode.name;
                elements.splice(docLib, 1);
            }
        }
    }

    isSiteContainer(node: MinimalNodeEntryEntity): boolean {
        if (node && node.aspectNames && node.aspectNames.length > 0) {
            return node.aspectNames.indexOf('st:siteContainer') >= 0;
        }
        return false;
    }

    isRootNode(nodeId: string): boolean {
        if (this.node && this.node.path && this.node.path.elements && this.node.path.elements.length > 0) {
            return this.node.path.elements[0].id === nodeId;
        }
        return false;
    }
}
