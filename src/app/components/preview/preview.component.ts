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
import { AlfrescoApiService } from '@alfresco/adf-core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';

@Component({
    selector: 'app-preview',
    templateUrl: 'preview.component.html',
    styleUrls: ['preview.component.scss'],
    encapsulation: ViewEncapsulation.None,
    // tslint:disable-next-line:use-host-property-decorator
    host: { 'class': 'app-preview' }
})
export class PreviewComponent implements OnInit {

    private node: MinimalNodeEntryEntity;
    private previewLocation: string = null;
    private routesSkipNavigation = [ '/shared', '/recent-files', '/favorites' ];
    private navigateSource: string = null;
    private navigationSources = ['favorites', 'libraries', 'personal-files', 'recent-files', 'shared'];
    private folderId: string = null;

    nodeId: string = null;
    previousNodeId: string;
    nextNodeId: string;
    navigateMultiple = false;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private apiService: AlfrescoApiService) {
        this.previewLocation = this.router.url.substr(0, this.router.url.indexOf('/', 1));

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
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.folderId = params.folderId;
            const id = params.nodeId;
            if (id) {
                this.displayNode(id);
            }
        });
    }

    private async displayNode(id: string) {
        if (id) {
            try {
                this.node = await this.apiService.nodesApi.getNodeInfo(id);
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

    onShowChange(isVisible) {
        const shouldSkipNavigation = this.routesSkipNavigation.includes(this.previewLocation);

        if (!isVisible) {
            const route = [this.previewLocation];

            if ( !shouldSkipNavigation && this.folderId ) {
                route.push(this.folderId);
            }

            this.router.navigate(route);
        }
    }

    onNavigateBefore() {
        if (this.previousNodeId) {
            this.router.navigate(
                this.getPreviewPath(this.folderId, this.previousNodeId)
            );
        }
    }

    onNavigateNext() {
        if (this.nextNodeId) {
            this.router.navigate(
                this.getPreviewPath(this.folderId, this.nextNodeId)
            );
        }
    }

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


    private async getNearestNodes(nodeId: string, folderId: string) {
        const empty = {
            left: null,
            right: null
        };
        if (nodeId && folderId) {
            const ids = await this.getFileIds(this.navigateSource, folderId);
            const idx = ids.indexOf(nodeId);

            return {
                left: ids[idx - 1],
                right: ids[idx + 1]
            };
        } else {
            return empty;
        }
    }

    private async getFileIds(source: string, folderId: string): Promise<string[]> {
        // TODO: sorting
        if (source === 'personal-files' || source === 'libraries') {
            const nodes = await this.apiService.nodesApi.getNodeChildren(folderId, {
                orderBy: 'modifiedAt DESC',
                fields: ['id'],
                where: '(isFile=true)'
            });
            return nodes.list.entries.map(obj => obj.entry.id);
        }

        // TODO: sorting
        if (source === 'favorites') {
            const nodes = await this.apiService.favoritesApi.getFavorites('-me-', {
                where: '(EXISTS(target/file))',
                fields: ['target']
            });
            return nodes.list.entries.map(obj => obj.entry.target.file.id);
        }

        // TODO: sorting
        if (source === 'shared') {
            const nodes = await this.apiService.sharedLinksApi.findSharedLinks({
                fields: ['nodeId']
            });
            return nodes.list.entries.map(obj => obj.entry.nodeId);
        }

        // TODO: ADF needs to provide an API for that, for now it's hidden inside DocumentList
        // TODO: sorting
        if (source === 'recent-files') {
            const person = await this.apiService.peopleApi.getPerson('-me-');
            const username = person.entry.id;
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
                fields: ['id'],
                sort: [{
                    type: 'FIELD',
                    field: 'cm:modified',
                    ascending: false
                }]
            });
            return nodes.list.entries.map(obj => obj.entry.id);
        }

        return [];
    }
}
