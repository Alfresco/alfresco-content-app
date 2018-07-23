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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, UrlTree, UrlSegmentGroup, UrlSegment, PRIMARY_OUTLET } from '@angular/router';
import { UserPreferencesService, ObjectUtils } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states/app.state';
import { DeleteNodesAction, SetSelectedNodesAction } from '../../store/actions';
import { PageComponent } from '../page.component';
import { ContentApiService } from '../../services/content-api.service';
import { ExtensionService } from '../../extensions/extension.service';
import { ContentManagementService } from '../../services/content-management.service';
import { ViewUtilService } from '../../services/view-util.service';
import { ContentActionRef } from '../../extensions/action.extensions';
@Component({
    selector: 'app-preview',
    templateUrl: 'preview.component.html',
    styleUrls: ['preview.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'app-preview' }
})
export class PreviewComponent extends PageComponent implements OnInit {

    previewLocation: string = null;
    routesSkipNavigation = [ 'shared', 'recent-files', 'favorites' ];
    navigateSource: string = null;
    navigationSources = ['favorites', 'libraries', 'personal-files', 'recent-files', 'shared'];
    folderId: string = null;
    nodeId: string = null;
    previousNodeId: string;
    nextNodeId: string;
    navigateMultiple = false;
    openWith: Array<ContentActionRef> = [];

    constructor(
        private contentApi: ContentApiService,
        private preferences: UserPreferencesService,
        private route: ActivatedRoute,
        private router: Router,
        private viewUtils: ViewUtilService,
        store: Store<AppStore>,
        extensions: ExtensionService,
        content: ContentManagementService) {
        super(store, extensions, content);
    }

    ngOnInit() {
        super.ngOnInit();

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

        this.openWith = this.extensions.openWithActions;
    }

    /**
     * Loads the particular node into the Viewer
     * @param id Unique identifier for the Node to display
     */
    async displayNode(id: string) {
        if (id) {
            try {
                this.node = await this.contentApi.getNodeInfo(id).toPromise();
                this.store.dispatch(new SetSelectedNodesAction([{ entry: this.node }]));

                if (this.node && this.node.isFile) {
                    const nearest = await this.getNearestNodes(this.node.id, this.node.parentId);

                    this.previousNodeId = nearest.left;
                    this.nextNodeId = nearest.right;
                    this.nodeId = this.node.id;
                    return;
                }
                this.router.navigate([this.previewLocation, id]);
            } catch (err) {
                if (!err || err.status !== 401) {
                    this.router.navigate([this.previewLocation, id]);
                }
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
            const route = this.getNavigationCommands(this.previewLocation);

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
            const nodes = await this.contentApi.getNodeChildren(folderId, {
                // orderBy: `${sortKey} ${sortDirection}`,
                fields: ['id', this.getRootField(sortKey)],
                where: '(isFile=true)'
            }).toPromise();

            const entries = nodes.list.entries.map(obj => obj.entry);
            this.sort(entries, sortKey, sortDirection);

            return entries.map(obj => obj.id);
        }

        if (source === 'favorites') {
            const nodes = await this.contentApi.getFavorites('-me-', {
                where: '(EXISTS(target/file))',
                fields: ['target']
            }).toPromise();

            const sortKey = this.preferences.get('favorites.sorting.key') || 'modifiedAt';
            const sortDirection = this.preferences.get('favorites.sorting.direction') || 'desc';
            const files = nodes.list.entries.map(obj => obj.entry.target.file);
            this.sort(files, sortKey, sortDirection);

            return files.map(f => f.id);
        }

        if (source === 'shared') {
            const sortingKey = this.preferences.get('shared.sorting.key') || 'modifiedAt';
            const sortingDirection = this.preferences.get('shared.sorting.direction') || 'desc';

            const nodes = await this.contentApi.findSharedLinks({
                fields: ['nodeId', this.getRootField(sortingKey)]
            }).toPromise();

            const entries = nodes.list.entries.map(obj => obj.entry);
            this.sort(entries, sortingKey, sortingDirection);

            return entries.map(obj => obj.nodeId);
        }

        if (source === 'recent-files') {
            const person = await this.contentApi.getPerson('-me-').toPromise();
            const username = person.entry.id;
            const sortingKey = this.preferences.get('recent-files.sorting.key') || 'modifiedAt';
            const sortingDirection = this.preferences.get('recent-files.sorting.direction') || 'desc';

            const nodes = await this.contentApi.search({
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
            }).toPromise();

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

    deleteFile() {
        this.store.dispatch(new DeleteNodesAction([
            {
                id: this.node.nodeId || this.node.id,
                name: this.node.name
            }
        ]));
        this.onVisibilityChanged(false);
    }

    printFile(event: any) {
        this.viewUtils.printFileGeneric(this.nodeId, this.node.content.mimeType);
    }

    private getNavigationCommands(url: string): any[] {
        const urlTree: UrlTree = this.router.parseUrl(url);
        const urlSegmentGroup: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];

        if (!urlSegmentGroup) {
            return [url];
        }

        const urlSegments: UrlSegment[] = urlSegmentGroup.segments;

        return urlSegments.reduce(function(acc, item) {
            acc.push(item.path, item.parameters);
            return acc;
        }, []);
    }
}
