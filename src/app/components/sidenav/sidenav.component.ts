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

import { Subscription } from 'rxjs/Rx';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AppConfigService, NotificationService } from '@alfresco/adf-core';


import { BrowsingFilesService } from '../../common/services/browsing-files.service';
import { NodePermissionService } from '../../common/services/node-permission.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
    @Input() showLabel: boolean;

    node: MinimalNodeEntryEntity = null;
    navigation = [];

    private subscriptions: Subscription[] = [];

    constructor(
        private notificationService: NotificationService,
        private browsingFilesService: BrowsingFilesService,
        private appConfig: AppConfigService,
        public permission: NodePermissionService
    ) {}

    ngOnInit() {
        this.navigation = this.buildMenu();

        this.subscriptions.concat([
            this.browsingFilesService.onChangeParent
                .subscribe((node: MinimalNodeEntryEntity) => this.node = node)
        ]);
    }

    openSnackMessage(event: any) {
        this.notificationService.openSnackMessage(
            event,
            4000
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    private buildMenu() {
        const schema = this.appConfig.get('navigation');
        const data = Array.isArray(schema) ? { main: schema } : schema;

        return Object.keys(data).map((key) => data[key]);
    }
}
