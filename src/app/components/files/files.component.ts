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

import { Observable, Subscription } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MinimalNodeEntity, MinimalNodeEntryEntity, PathElementEntity, NodePaging, PathElement } from 'alfresco-js-api';
import {
    UploadService, FileUploadEvent, NodesApiService,
    ContentService, AlfrescoApiService, UserPreferencesService, NotificationService
} from '@alfresco/adf-core';

import { DocumentListComponent } from '@alfresco/adf-content-services';

import { BrowsingFilesService } from '../../common/services/browsing-files.service';
import { ContentManagementService } from '../../common/services/content-management.service';
import { NodeActionsService } from '../../common/services/node-actions.service';
import { NodePermissionService } from '../../common/services/node-permission.service';

import { PageComponent } from '../page.component';

@Component({
    templateUrl: './files.component.html'
})
export class FilesComponent extends PageComponent implements OnInit, OnDestroy {
    @ViewChild(DocumentListComponent) documentList: DocumentListComponent;

    isValidPath = true;

    private nodePath: PathElement[];
    private subscriptions: Subscription[] = [];

    constructor(private router: Router,
                route: ActivatedRoute,
                private nodesApi: NodesApiService,
                private nodeActionsService: NodeActionsService,
                private uploadService: UploadService,
                private contentManagementService: ContentManagementService,
                private browsingFilesService: BrowsingFilesService,
                private contentService: ContentService,
                private apiService: AlfrescoApiService,
                private notificationService: NotificationService,
                public permission: NodePermissionService,
                preferences: UserPreferencesService) {
        super(preferences, route);
    }

    ngOnInit() {
        const { route, contentManagementService, contentService, nodeActionsService, uploadService } = this;
        const { data } = route.snapshot;

        this.title = data.title;

        route.params.subscribe(({ folderId }: Params) => {
            const nodeId = folderId || data.defaultNodeId;

            this.fetchNode(nodeId)
                .do((node) => {
                    if (node.isFolder) {
                        this.updateCurrentNode(node);
                    } else {
                        this.router.navigate(['/personal-files', node.parentId], { replaceUrl: true });
                    }
                })
                .skipWhile(node => !node.isFolder)
                .flatMap((node) => this.fetchNodes(node.id))
                .subscribe(
                    (page) => {
                        this.isValidPath = true;
                    },
                    error => {
                        this.isValidPath = false;
                    }
                );
        });

        this.subscriptions = this.subscriptions.concat([
            nodeActionsService.contentCopied.subscribe((nodes) => this.onContentCopied(nodes)),
            contentService.folderCreate.subscribe(() => this.documentList.reload()),
            contentService.folderEdit.subscribe(() => this.documentList.reload()),
            contentManagementService.nodeDeleted.subscribe(() => this.documentList.reload()),
            contentManagementService.nodeMoved.subscribe(() => this.documentList.reload()),
            contentManagementService.nodeRestored.subscribe(() => this.documentList.reload()),
            uploadService.fileUploadComplete.subscribe(file => this.onFileUploadedEvent(file)),
            uploadService.fileUploadDeleted.subscribe((file) => this.onFileUploadedEvent(file))
        ]);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());

        this.browsingFilesService.onChangeParent.next(null);
    }

    fetchNode(nodeId: string): Observable<MinimalNodeEntryEntity> {
        return this.nodesApi.getNode(nodeId);
    }

    fetchNodes(parentNodeId?: string, options: { maxItems?: number, skipCount?: number } = {}): Observable<NodePaging> {
        const defaults = {
            include: [ 'isLocked', 'path', 'properties', 'allowableOperations' ]
        };

        const queryOptions = Object.assign({}, defaults, options);

        return this.nodesApi.getNodeChildren(parentNodeId, queryOptions);
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

    onNodeDoubleClick(event) {
        if (!!event.detail && !!event.detail.node) {

            const node: MinimalNodeEntryEntity = event.detail.node.entry;
            if (node) {

                if (node.isFolder) {
                    this.navigate(node.id);
                }

                if (PageComponent.isLockedNode(node)) {
                    event.preventDefault();

                } else if (node.isFile) {
                    this.router.navigate(['./preview', node.id], { relativeTo: this.route });
                }
            }

        }
    }

    showPreview(node: MinimalNodeEntryEntity) {
        if (node) {
            if (node.isFile) {
                this.router.navigate(['./preview', node.id], { relativeTo: this.route });
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
            this.documentList.reload();
        }
    }

    onContentCopied(nodes: MinimalNodeEntity[]) {
        const newNode = nodes
            .find((node) => {
                return node && node.entry && node.entry.parentId === this.getParentNodeId();
            });
        if (newNode) {
            this.documentList.reload();
        }
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

    openSnackMessage(event: any) {
        this.notificationService.openSnackMessage(
            event,
            4000
        );
    }
}
