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

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MinimalNodeEntryEntity, PathElementEntity, PathInfo } from 'alfresco-js-api';
import { ContentService, NodesApiService, UserPreferencesService, NotificationService } from '@alfresco/adf-core';

import { ContentManagementService } from '../../common/services/content-management.service';
import { NodePermissionService } from '../../common/services/node-permission.service';
import { PageComponent } from '../page.component';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states/app.state';

@Component({
    templateUrl: './favorites.component.html'
})
export class FavoritesComponent extends PageComponent implements OnInit {

    constructor(router: Router,
                route: ActivatedRoute,
                store: Store<AppStore>,
                private nodesApi: NodesApiService,
                private contentService: ContentService,
                private content: ContentManagementService,
                private notificationService: NotificationService,
                public permission: NodePermissionService,
                preferences: UserPreferencesService) {
        super(preferences, router, route, store);
    }

    ngOnInit() {
        super.ngOnInit();

        this.subscriptions = this.subscriptions.concat([
            this.content.nodeDeleted.subscribe(() => this.reload()),
            this.content.nodeRestored.subscribe(() => this.reload()),
            this.contentService.folderEdit.subscribe(() => this.reload()),
            this.content.nodeMoved.subscribe(() => this.reload())
        ]);
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

    openSnackMessage(event: any) {
        this.notificationService.openSnackMessage(
            event,
            4000
        );
    }
}
