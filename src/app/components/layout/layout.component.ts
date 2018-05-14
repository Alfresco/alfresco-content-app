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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { UserPreferencesService, AppConfigService } from '@alfresco/adf-core';
import { BrowsingFilesService } from '../../common/services/browsing-files.service';
import { NodePermissionService } from '../../common/services/node-permission.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
    node: MinimalNodeEntryEntity;
    hideSidenav: boolean;
    expandedSidenav: boolean;
    private hideConditions: string[] = ['preview'];
    private subscriptions: Subscription[] = [];

    constructor(
        private router: Router,
        private browsingFilesService: BrowsingFilesService,
        private userPreferenceService: UserPreferencesService,
        private appConfigService: AppConfigService,
        public permission: NodePermissionService) {
            this.router.events
                .filter(event => event instanceof NavigationEnd)
                .subscribe( (event: any ) => {
                    this.hideSidenav = this.hideConditions.some(el => event.urlAfterRedirects.includes(el));
                });
        }

    ngOnInit() {
        this.expandedSidenav = this.sidenavState;

        this.subscriptions.concat([
            this.browsingFilesService.onChangeParent.subscribe((node: MinimalNodeEntryEntity) => this.node = node)
        ]);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    get sidenavState(): boolean {
        const expand = this.appConfigService.get<boolean>('sideNav.expandedSidenav', true);
        const preserveState = this.appConfigService.get<boolean>('sideNav.preserveState', true);

        if (preserveState)  {
            return (this.userPreferenceService.get('expandedSidenav', expand.toString()) === 'true');
        }

        return expand;
    }

    setState(state) {
        if (this.appConfigService.get('sideNav.preserveState')) {
            this.userPreferenceService.set('expandedSidenav', state);
        }
    }
}
