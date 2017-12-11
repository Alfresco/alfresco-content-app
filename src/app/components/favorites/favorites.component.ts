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

import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { MinimalNodeEntryEntity, MinimalNodeEntity, PathElementEntity, PathInfo } from 'alfresco-js-api';
import { ContentService, NodesApiService, UserPreferencesService } from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';

import { ContentManagementService } from '../../common/services/content-management.service';
import { PageComponent } from '../page.component';

@Component({
    templateUrl: './favorites.component.html'
})
export class FavoritesComponent extends PageComponent implements OnInit, OnDestroy {

    @ViewChild(DocumentListComponent)
    documentList: DocumentListComponent;

    private subscriptions: Subscription[] = [];

    constructor(
        private router: Router,
        private nodesApi: NodesApiService,
        private contentService: ContentService,
        private content: ContentManagementService,
        preferences: UserPreferencesService) {
        super(preferences);
    }

    ngOnInit() {
        this.subscriptions = this.subscriptions.concat([
            this.content.deleteNode.subscribe(() => this.refresh()),
            this.content.restoreNode.subscribe(() => this.refresh()),
            this.contentService.folderEdit.subscribe(() => this.refresh()),
            this.content.moveNode.subscribe(() => this.refresh())
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
                this.router.navigate(['/preview', node.id]);
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
}
