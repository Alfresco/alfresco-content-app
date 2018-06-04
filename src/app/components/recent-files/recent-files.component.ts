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
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { UserPreferencesService } from '@alfresco/adf-core';

import { ContentManagementService } from '../../common/services/content-management.service';
import { PageComponent } from '../page.component';
import { NodePermissionService } from '../../common/services/node-permission.service';
import { Store } from '@ngrx/store';
import { AcaState } from '../../store/states/app.state';

@Component({
    templateUrl: './recent-files.component.html'
})
export class RecentFilesComponent extends PageComponent implements OnInit {

    constructor(
        private router: Router,
        route: ActivatedRoute,
        store: Store<AcaState>,
        private content: ContentManagementService,
        public permission: NodePermissionService,
        preferences: UserPreferencesService) {
        super(preferences, route, store);
    }

    ngOnInit() {
        super.ngOnInit();

        this.subscriptions = this.subscriptions.concat([
            this.content.nodeDeleted.subscribe(() => this.reload()),
            this.content.nodeMoved.subscribe(() => this.reload()),
            this.content.nodeRestored.subscribe(() => this.reload())
        ]);
    }

    onNodeDoubleClick(node: MinimalNodeEntryEntity) {
        if (node && PageComponent.isLockedNode(node)) {
            event.preventDefault();

        } else if (node && node.isFile) {
            this.router.navigate(['./preview', node.id], { relativeTo: this.route });
        }
    }
}
