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
    navigation = [];

    private subscriptions: Subscription[] = [];

    constructor(
        private browsingFilesService: BrowsingFilesService,
        private contentService: ContentService,
        private appConfig: AppConfigService
    ) {}

    ngOnInit() {
        this.navigation = this.buildMenu();

        this.subscriptions.concat([
            this.browsingFilesService.onChangeParent
                .subscribe((node: MinimalNodeEntryEntity) => this.node = node)
        ]);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    canCreateContent(parentNode: MinimalNodeEntryEntity): boolean {
        if (parentNode) {
            return this.contentService.hasPermission(parentNode, 'create');
        }
        return false;
    }

    private buildMenu() {
        const schema = this.appConfig.get('navigation');
        const data = Array.isArray(schema) ? { main: schema } : schema;

        return Object.keys(data).map((key) => data[key]);
    }
}
