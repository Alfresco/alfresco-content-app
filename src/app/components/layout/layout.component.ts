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

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { BrowsingFilesService } from '../../common/services/browsing-files.service';
import { NodePermissionService } from '../../common/services/node-permission.service';
import { SidenavViewsManagerDirective } from './sidenav-views-manager.directive';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
    @ViewChild(SidenavViewsManagerDirective) manager: SidenavViewsManagerDirective;

    expandedSidenav: boolean;
    node: MinimalNodeEntryEntity;

    private subscriptions: Subscription[] = [];

    constructor(
        private browsingFilesService: BrowsingFilesService,
        public permission: NodePermissionService) {}

    ngOnInit() {
        if (!this.manager.minimizeSidenav) {
            this.expandedSidenav = this.manager.sidenavState;
        } else {
            this.expandedSidenav = false;
        }

        this.manager.run(true);

        this.subscriptions.concat([
            this.browsingFilesService.onChangeParent.subscribe((node: MinimalNodeEntryEntity) => this.node = node)
        ]);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
