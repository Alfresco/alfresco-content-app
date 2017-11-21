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
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { DocumentListComponent } from '@alfresco/adf-content-services';

import { ContentManagementService } from '../../common/services/content-management.service';
import { PageComponent } from '../page.component';

@Component({
    templateUrl: './recent-files.component.html'
})
export class RecentFilesComponent extends PageComponent implements OnInit, OnDestroy {

    @ViewChild(DocumentListComponent)
    documentList: DocumentListComponent;

    private subscriptions: Subscription[] = [];

    constructor(
        private router: Router,
        private content: ContentManagementService) {
        super();
    }

    ngOnInit() {
        this.subscriptions = this.subscriptions.concat([
            this.content.deleteNode.subscribe(() => this.refresh()),
            this.content.moveNode.subscribe(() => this.refresh()),
            this.content.restoreNode.subscribe(() => this.refresh()),
            this.content.toggleFavorite.subscribe(() => this.refresh())
        ]);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    onNodeDoubleClick(node: MinimalNodeEntryEntity) {
        if (node && node.isFile) {
            this.router.navigate(['/preview', node.id]);
        }
    }

    fetchNodes(): void {
        // todo: remove once all views migrate to native data source
    }

    refresh(): void {
        if (this.documentList) {
            this.documentList.reload();
        }
    }
}
