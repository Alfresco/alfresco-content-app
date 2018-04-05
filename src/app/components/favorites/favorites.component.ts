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

import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { MinimalNodeEntryEntity, MinimalNodeEntity, PathElementEntity, PathInfo } from 'alfresco-js-api';
import { ContentService, NodesApiService, UserPreferencesService } from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';

import { ContentManagementService } from '../../common/services/content-management.service';
import { NodePermissionService } from '../../common/services/node-permission.service';
import { PageComponent } from '../page.component';

@Component({
    templateUrl: './favorites.component.html'
})
export class FavoritesComponent extends PageComponent implements OnInit, OnDestroy {

    @ViewChild(DocumentListComponent)
    documentList: DocumentListComponent;

    private subscriptions: Subscription[] = [];

    sorting = [ 'modifiedAt', 'desc' ];

    constructor(private router: Router,
                private route: ActivatedRoute,
                private nodesApi: NodesApiService,
                private contentService: ContentService,
                private content: ContentManagementService,
                public permission: NodePermissionService,
                preferences: UserPreferencesService) {
        super(preferences);

        const sortingKey = preferences.get(`${this.prefix}.sorting.key`) || 'modifiedAt';
        const sortingDirection = preferences.get(`${this.prefix}.sorting.direction`) || 'desc';

        this.sorting = [sortingKey, sortingDirection];
    }

    ngOnInit() {
        this.subscriptions = this.subscriptions.concat([
            this.content.nodeDeleted.subscribe(() => this.refresh()),
            this.content.nodeRestored.subscribe(() => this.refresh()),
            this.contentService.folderEdit.subscribe(() => this.refresh()),
            this.content.nodeMoved.subscribe(() => this.refresh())
        ]);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    fetchNodes(): void {
        // todo: remove once all views migrate to native data source
    }

    navigate(favorite: MinimalNodeEntryEntity) {
        const { isFolder, id } = favorite;

        // TODO: rework as it will fail on non-English setups
        const isSitePath = (path: PathInfo): boolean => {
            return path.elements.some(({ name }: PathElementEntity) => (name === 'Sites'));
        };

        if (isFolder) {
            this.nodesApi
                .getNode(id)
                .subscribe(({ path }: MinimalNodeEntryEntity) => {
                    const routeUrl = isSitePath(path) ? '/libraries' : '/personal-files';
                    this.router.navigate([ routeUrl, id ]);
                });
        }
    }

    onNodeDoubleClick(node: MinimalNodeEntryEntity) {
        if (node) {
            if (node.isFolder) {
                this.navigate(node);
            }

            if (node.isFile) {
                this.router.navigate(['./preview', node.id], { relativeTo: this.route });
            }
        }
    }

    showEditOption(selection: MinimalNodeEntity[]) {
        return selection && selection.length === 1 && selection[0].entry.isFolder;
    }

    refresh(): void {
        if (this.documentList) {
            this.documentList.reload();
        }
    }

    onSortingChanged(event: CustomEvent) {
        this.preferences.set(`${this.prefix}.sorting.key`, event.detail.key || 'modifiedAt');
        this.preferences.set(`${this.prefix}.sorting.direction`, event.detail.direction || 'desc');
    }

    private get prefix() {
        return this.route.snapshot.data.preferencePrefix;
    }
}
