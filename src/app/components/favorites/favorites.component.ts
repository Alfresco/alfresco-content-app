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

import { NodesApiService } from '@alfresco/adf-core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
    MinimalNodeEntity,
    MinimalNodeEntryEntity,
    PathElementEntity,
    PathInfo
} from 'alfresco-js-api';
import { ContentManagementService } from '../../common/services/content-management.service';
import { NodePermissionService } from '../../common/services/node-permission.service';
import { AppStore } from '../../store/states/app.state';
import { PageComponent } from '../page.component';

@Component({
    templateUrl: './favorites.component.html'
})
export class FavoritesComponent extends PageComponent implements OnInit {
    constructor(
        private router: Router,
        store: Store<AppStore>,
        private nodesApi: NodesApiService,
        private content: ContentManagementService,
        public permission: NodePermissionService
    ) {
        super(store);
    }

    ngOnInit() {
        super.ngOnInit();

        this.subscriptions = this.subscriptions.concat([
            this.content.nodesDeleted.subscribe(() => this.reload()),
            this.content.nodesRestored.subscribe(() => this.reload()),
            this.content.folderEdited.subscribe(() => this.reload()),
            this.content.nodesMoved.subscribe(() => this.reload())
        ]);
    }

    navigate(favorite: MinimalNodeEntryEntity) {
        const { isFolder, id } = favorite;

        // TODO: rework as it will fail on non-English setups
        const isSitePath = (path: PathInfo): boolean => {
            return path.elements.some(
                ({ name }: PathElementEntity) => name === 'Sites'
            );
        };

        if (isFolder) {
            this.nodesApi
                .getNode(id)
                .subscribe(({ path }: MinimalNodeEntryEntity) => {
                    const routeUrl = isSitePath(path)
                        ? '/libraries'
                        : '/personal-files';
                    this.router.navigate([routeUrl, id]);
                });
        }
    }

    onNodeDoubleClick(node: MinimalNodeEntity) {
        if (node && node.entry) {
            if (node.entry.isFolder) {
                this.navigate(node.entry);
            }

            if (node.entry.isFile) {
                this.showPreview(node);
            }
        }
    }
}
