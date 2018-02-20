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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlfrescoApiService, UserPreferencesService, ObjectUtils, TranslationService, NotificationService } from '@alfresco/adf-core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { ContentManagementService } from '../../common/services/content-management.service';

@Component({
    selector: 'app-preview',
    templateUrl: 'preview.component.html',
    styleUrls: ['preview.component.scss'],
    encapsulation: ViewEncapsulation.None,
    // tslint:disable-next-line:use-host-property-decorator
    host: { 'class': 'app-preview' }
})
export class PreviewComponent implements OnInit {

    node: MinimalNodeEntryEntity;
    previewLocation: string = null;
    routesSkipNavigation = [ 'shared', 'recent-files', 'favorites' ];
    navigateSource: string = null;
    navigationSources = ['favorites', 'libraries', 'personal-files', 'recent-files', 'shared'];

    folderId: string = null;
    nodeId: string = null;
    previousNodeId: string;
    nextNodeId: string;
    navigateMultiple = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private apiService: AlfrescoApiService,
                private preferences: UserPreferencesService,
                private translate: TranslationService,
                private notification: NotificationService,
                private content: ContentManagementService) {
    }

    ngOnInit() {
        this.previewLocation = this.router.url
            .substr(0, this.router.url.indexOf('/', 1))
            .replace(/\//g, '');

        const routeData = this.route.snapshot.data;

        if (routeData.navigateMultiple) {
            this.navigateMultiple = true;
        }

        if (routeData.navigateSource) {
            const source = routeData.navigateSource.toLowerCase();
            if (this.navigationSources.includes(source)) {
                this.navigateSource = routeData.navigateSource;
            }
        }

        this.route.params.subscribe(params => {
            this.folderId = params.folderId;
            const id = params.nodeId;
            if (id) {
                this.displayNode(id);
            }
        });
    }

    /**
     * Loads the particular node into the Viewer
     * @param id Unique identifier for the Node to display
     */
    async displayNode(id: string) {
        if (id) {
            try {
                this.node = await this.apiService.nodesApi.getNodeInfo(id, {
                    include: [ 'allowableOperations']
                });
                if (this.node && this.node.isFile) {
                    const nearest = await this.getNearestNodes(this.node.id, this.node.parentId);

                    this.previousNodeId = nearest.left;
                    this.nextNodeId = nearest.right;
                    this.nodeId = this.node.id;
                    return;
                }
                this.router.navigate([this.previewLocation, id]);
            } catch {
                this.router.navigate([this.previewLocation, id]);
            }
        }
    }

    /**
     * Handles the visibility change of the Viewer component.
     * @param isVisible Indicator whether Viewer is visible or hidden.
     */
    onVisibilityChanged(isVisible: boolean): void {
        const shouldSkipNavigation = this.routesSkipNavigation.includes(this.previewLocation);

        if (!isVisible) {
            const route = [this.previewLocation];

            if ( !shouldSkipNavigation && this.folderId ) {
                route.push(this.folderId);
            }

            this.router.navigate(route);
        }
    }

    /** Handles navigation to a previous document */
    onNavigateBefore(): void {
        if (this.previousNodeId) {
            this.router.navigate(
                this.getPreviewPath(this.folderId, this.previousNodeId)
            );
        }
    }

    /** Handles navigation to a next document */
    onNavigateNext(): void {
        if (this.nextNodeId) {
            this.router.navigate(
                this.getPreviewPath(this.folderId, this.nextNodeId)
            );
        }
    }

    /**
     * Generates a node preview route based on folder and node IDs.
     * @param folderId Folder ID
     * @param nodeId Node ID
     */
    getPreviewPath(folderId: string, nodeId: string): any[] {
        const route = [this.previewLocation];

        if (folderId) {
            route.push(folderId);
        }

        if (nodeId) {
            route.push('preview', nodeId);
        }

        return route;
    }


    /**
     * Retrieves nearest node information for the given node and folder.
     * @param nodeId Unique identifier of the document node
     * @param folderId Unique identifier of the containing folder node.
     */
    async getNearestNodes(nodeId: string, folderId: string): Promise<{ left: string, right: string }> {
        const empty = {
            left: null,
            right: null
        };

        if (nodeId && folderId) {
            try {
                const ids = await this.getFileIds(this.navigateSource, folderId);
                const idx = ids.indexOf(nodeId);

                if (idx >= 0) {
                    return {
                        left: ids[idx - 1] || null,
                        right: ids[idx + 1] || null
                    };
                } else {
                    return empty;
                }
            } catch {
                return empty;
            }
        } else {
            return empty;
        }
    }

    /**
     * Retrieves a list of node identifiers for the folder and data source.
     * @param source Data source name. Allowed values are: personal-files, libraries, favorites, shared, recent-files.
     * @param folderId Containing folder node identifier for 'personal-files' and 'libraries' sources.
     */
    async getFileIds(source: string, folderId?: string): Promise<string[]> {
        if ((source === 'personal-files' || source === 'libraries') && folderId) {
            const sortKey = this.preferences.get('personal-files.sorting.key') || 'modifiedAt';
            const sortDirection = this.preferences.get('personal-files.sorting.direction') || 'desc';
            const nodes = await this.apiService.nodesApi.getNodeChildren(folderId, {
                // orderBy: `${sortKey} ${sortDirection}`,
                fields: ['id', this.getRootField(sortKey)],
                where: '(isFile=true)'
            });

            const entries = nodes.list.entries.map(obj => obj.entry);
            this.sort(entries, sortKey, sortDirection);

            return entries.map(obj => obj.id);
        }

        if (source === 'favorites') {
            const nodes = await this.apiService.favoritesApi.getFavorites('-me-', {
                where: '(EXISTS(target/file))',
                fields: ['target']
            });

            const sortKey = this.preferences.get('favorites.sorting.key') || 'modifiedAt';
            const sortDirection = this.preferences.get('favorites.sorting.direction') || 'desc';
            const files = nodes.list.entries.map(obj => obj.entry.target.file);
            this.sort(files, sortKey, sortDirection);

            return files.map(f => f.id);
        }

        if (source === 'shared') {
            const sortingKey = this.preferences.get('shared.sorting.key') || 'modifiedAt';
            const sortingDirection = this.preferences.get('shared.sorting.direction') || 'desc';

            const nodes = await this.apiService.sharedLinksApi.findSharedLinks({
                fields: ['nodeId', this.getRootField(sortingKey)]
            });

            const entries = nodes.list.entries.map(obj => obj.entry);
            this.sort(entries, sortingKey, sortingDirection);

            return entries.map(obj => obj.nodeId);
        }

        if (source === 'recent-files') {
            const person = await this.apiService.peopleApi.getPerson('-me-');
            const username = person.entry.id;
            const sortingKey = this.preferences.get('recent-files.sorting.key') || 'modifiedAt';
            const sortingDirection = this.preferences.get('recent-files.sorting.direction') || 'desc';

            const nodes = await this.apiService.searchApi.search({
                query: {
                    query: '*',
                    language: 'afts'
                },
                filterQueries: [
                    { query: `cm:modified:[NOW/DAY-30DAYS TO NOW/DAY+1DAY]` },
                    { query: `cm:modifier:${username} OR cm:creator:${username}` },
                    { query: `TYPE:"content" AND -TYPE:"app:filelink" AND -TYPE:"fm:post"` }
                ],
                fields: ['id', this.getRootField(sortingKey)],
                sort: [{
                    type: 'FIELD',
                    field: 'cm:modified',
                    ascending: false
                }]
            });

            const entries = nodes.list.entries.map(obj => obj.entry);
            this.sort(entries, sortingKey, sortingDirection);

            return entries.map(obj => obj.id);
        }

        return [];
    }

    private sort(items: any[], key: string, direction: string) {
        const options: Intl.CollatorOptions = {};

        if (key.includes('sizeInBytes') || key === 'name') {
            options.numeric = true;
        }

        items.sort((a: any, b: any) => {
            let left = ObjectUtils.getValue(a, key);
            if (left) {
                left = (left instanceof Date) ? left.valueOf().toString() : left.toString();
            } else {
                left = '';
            }

            let right = ObjectUtils.getValue(b, key);
            if (right) {
                right = (right instanceof Date) ? right.valueOf().toString() : right.toString();
            } else {
                right = '';
            }

            return direction === 'asc'
                ? left.localeCompare(right, undefined, options)
                : right.localeCompare(left, undefined, options);
        });
    }

    /**
     * Get the root field name from the property path.
     * Example: 'property1.some.child.property' => 'property1'
     * @param path Property path
     */
    getRootField(path: string) {
        if (path) {
           return path.split('.')[0];
        }
        return path;
    }

    canDeleteFile(): boolean {
        return this.nodeHasPermission(this.node, 'delete');
    }

    async deleteFile() {
        if (this.canDeleteFile()) {
            try {
                await this.apiService.nodesApi.deleteNode(this.node.id);

                this.notification
                    .openSnackMessageAction(
                        this.translate.instant('APP.MESSAGES.INFO.NODE_DELETION.SINGULAR', { name: this.node.name }),
                        this.translate.translate.instant('APP.ACTIONS.UNDO'),
                        10000
                    )
                    .onAction()
                    .subscribe(() => {
                        this.restoreFile();
                    });

                this.content.nodeDeleted.next(this.node.id);
                this.onVisibilityChanged(false);
            } catch {
                this.notification.openSnackMessage(
                    this.translate.instant('APP.MESSAGES.ERRORS.NODE_DELETION', { name: this.node.name }),
                    10000
                );
            }
        }
    }

    async restoreFile() {
        if (this.node) {
            try {
                await this.apiService.nodesApi.restoreNode(this.node.id);
                this.content.nodeRestored.next(this.node.id);
            } catch {
                this.notification.openSnackMessage(
                    this.translate.instant('APP.MESSAGES.ERRORS.NODE_RESTORE', { name: this.node.name }),
                    3000
                );
            }
        }
    }

    nodeHasPermission(node: MinimalNodeEntryEntity, permission: string) {
        if (node && permission) {
            const { allowableOperations = [] } = <any>(node || {});

            if (allowableOperations.indexOf(permission) > -1) {
                return true;
            }
        }

        return false;
    }
}
