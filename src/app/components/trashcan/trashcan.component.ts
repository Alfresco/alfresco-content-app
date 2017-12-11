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
