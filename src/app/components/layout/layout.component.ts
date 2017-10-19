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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AlfrescoContentService } from 'ng2-alfresco-core';
import { BrowsingFilesService } from '../../common/services/browsing-files.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
    node: MinimalNodeEntryEntity;

    browsingFilesSubscription: Subscription;

    constructor(
        private contentService: AlfrescoContentService,
        private browsingFilesService: BrowsingFilesService) {}

    ngOnInit() {
        this.browsingFilesSubscription = this.browsingFilesService.onChangeParent
            .subscribe((node: MinimalNodeEntryEntity) => this.node = node);
    }

    ngOnDestroy() {
        this.browsingFilesSubscription.unsubscribe();
    }

    canCreateContent(node: MinimalNodeEntryEntity): boolean {
        if (node) {
            return this.contentService.hasPermission(node, 'create');
        }
        return false;
    }
}
