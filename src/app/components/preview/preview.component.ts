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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';

@Component({
    selector: 'app-preview',
    templateUrl: 'preview.component.html',
    styleUrls: ['preview.component.scss'],
    encapsulation: ViewEncapsulation.None,
    // tslint:disable-next-line:use-host-property-decorator
    host: { 'class': 'app-preview' }
})
export class PreviewComponent implements OnInit {

    private node: MinimalNodeEntryEntity;
    private previewLocation: string = null;
    private routesSkipNavigation = [ '/shared', '/recent-files', '/favorites' ];
    nodeId: string = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private apiService: AlfrescoApiService) {
            this.previewLocation = this.router.url.substr(0, this.router.url.indexOf('/', 1));
        }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = params.nodeId;
            if (id) {
                this.apiService.getInstance().nodes.getNodeInfo(id).then(
                    (node) => {
                        this.node = node;

                        if (node && node.isFile) {
                            this.nodeId = id;
                            return;
                        }
                        this.router.navigate([this.previewLocation, id]);
                    },
                    () => this.router.navigate([this.previewLocation, id])
                );
            }
        });
    }

    onShowChange(isVisible) {
        const shouldSkipNavigation = this.routesSkipNavigation.includes(this.previewLocation);

        if (!isVisible) {
            if ( !shouldSkipNavigation ) {
                this.router.navigate([this.previewLocation, this.node.parentId ]);
            } else {
                this.router.navigate([this.previewLocation]);
            }
        }
    }
}
