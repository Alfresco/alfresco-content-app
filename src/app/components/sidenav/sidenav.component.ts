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
import { ContentService, AppConfigService } from '@alfresco/adf-core';

import { BrowsingFilesService } from '../../common/services/browsing-files.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
    node: MinimalNodeEntryEntity = null;
    onChangeParentSubscription: Subscription;
    navigation = [];

    constructor(
        private browsingFilesService: BrowsingFilesService,
        private contentService: ContentService,
        private appConfig: AppConfigService
    ) {
        this.navigation = this.navigation.concat([
            this.appConfig.get('navigation.main'),
            this.appConfig.get('navigation.secondary')
        ]);
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
