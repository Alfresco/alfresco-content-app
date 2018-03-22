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
import { ContentService } from '@alfresco/adf-core';
import { BrowsingFilesService } from '../../common/services/browsing-files.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
    node: MinimalNodeEntryEntity;
    isPreview = false;

    private subscriptions: Subscription[] = [];

    constructor(
        private router: Router,
        private contentService: ContentService,
        private browsingFilesService: BrowsingFilesService) {
            this.router.events
                .filter(event => event instanceof NavigationEnd)
                .subscribe( (event: any ) => {
                    this.isPreview = event.urlAfterRedirects.includes('preview');
                });
        }

    ngOnInit() {
        this.subscriptions.concat([
            this.browsingFilesService.onChangeParent.subscribe((node: MinimalNodeEntryEntity) => this.node = node)
        ]);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    canCreateContent(node: MinimalNodeEntryEntity): boolean {
        if (node) {
            return this.contentService.hasPermission(node, 'create');
        }
        return false;
    }
}
