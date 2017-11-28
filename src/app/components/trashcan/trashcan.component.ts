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

import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { Pagination } from 'alfresco-js-api';
import { UserPreferencesService } from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { ContentManagementService } from '../../common/services/content-management.service';

@Component({
    templateUrl: './trashcan.component.html'
})
export class TrashcanComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    @ViewChild(DocumentListComponent) documentList;

    constructor(
        private contentManagementService: ContentManagementService,
        private preferences: UserPreferencesService) {}

    ngOnInit() {
        this.subscriptions.push(this.contentManagementService.restoreNode.subscribe(() => this.refresh()));
    }

    refresh(): void {
        this.documentList.loadTrashcan();
        this.documentList.resetSelection();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    onChangePageSize(event: Pagination): void {
        this.preferences.paginationSize = event.maxItems;
    }
}
