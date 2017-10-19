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

import { Subscription } from 'rxjs/Rx';

import { Component, OnInit, OnDestroy } from '@angular/core';

import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AlfrescoContentService } from 'ng2-alfresco-core';

import { BrowsingFilesService } from '../../common/services/browsing-files.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
    node: MinimalNodeEntryEntity = null;

    onChangeParentSubscription: Subscription;

    constructor(
        private browsingFilesService: BrowsingFilesService,
        private contentService: AlfrescoContentService
    ) {}

    get menus() {
        const main = [
            {
                icon: 'folder',
                label: 'APP.BROWSE.PERSONAL.SIDENAV_LINK.LABEL',
                title: 'APP.BROWSE.PERSONAL.SIDENAV_LINK.TOOLTIP',
                route: { url: '/personal-files' }
            },
            {
                icon: 'group_work',
                label: 'APP.BROWSE.LIBRARIES.SIDENAV_LINK.LABEL',
                title: 'APP.BROWSE.LIBRARIES.SIDENAV_LINK.TOOLTIP',
                route: { url: '/libraries' }
            }
        ];

        const secondary = [
            {
                icon: 'people',
                label: 'APP.BROWSE.SHARED.SIDENAV_LINK.LABEL',
                title: 'APP.BROWSE.SHARED.SIDENAV_LINK.TOOLTIP',
                route: { url: '/shared' }
            },
            {
                icon: 'schedule',
                label: 'APP.BROWSE.RECENT.SIDENAV_LINK.LABEL',
                title: 'APP.BROWSE.RECENT.SIDENAV_LINK.TOOLTIP',
                route: { url: '/recent-files' }
            },
            {
                icon: 'star',
                label: 'APP.BROWSE.FAVORITES.SIDENAV_LINK.LABEL',
                title: 'APP.BROWSE.FAVORITES.SIDENAV_LINK.TOOLTIP',
                route: { url: '/favorites' }
            },
            {
                icon: 'delete',
                label: 'APP.BROWSE.TRASHCAN.SIDENAV_LINK.LABEL',
                title: 'APP.BROWSE.TRASHCAN.SIDENAV_LINK.TOOLTIP',
                route: { url: '/trashcan' }
            }
        ];

        return [ main, secondary ];
    }

    ngOnInit() {
        this.onChangeParentSubscription = this.browsingFilesService.onChangeParent
            .subscribe((node: MinimalNodeEntryEntity) => {
                this.node = node;
            });
    }

    ngOnDestroy() {
        this.onChangeParentSubscription.unsubscribe();
    }

    canCreateContent(parentNode: MinimalNodeEntryEntity): boolean {
        if (parentNode) {
            return this.contentService.hasPermission(parentNode, 'create');
        }
        return false;
    }
}
