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

import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { DiscoveryApiService } from '@alfresco/adf-core';
import { EcmProductVersionModel, ObjectDataTableAdapter  } from '@alfresco/adf-core';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: [ './about.component.scss' ]
})
export class AboutComponent implements OnInit {
    ecmVersion: EcmProductVersionModel = null;
    data: ObjectDataTableAdapter;
    status: ObjectDataTableAdapter;
    license: ObjectDataTableAdapter;
    modules: ObjectDataTableAdapter;
    githubUrlCommitAlpha = 'https://github.com/Alfresco/alfresco-content-app/commits';


    constructor(
        private discovery: DiscoveryApiService,
        private http: Http
    ) {}

    ngOnInit() {
        this.discovery.getEcmProductInfo().subscribe((ecmVers) => {
            this.ecmVersion = ecmVers;

            this.modules = new ObjectDataTableAdapter(this.ecmVersion.modules, [
                {type: 'text', key: 'id', title: 'ID', sortable: true},
                {type: 'text', key: 'title', title: 'Title', sortable: true},
                {type: 'text', key: 'version', title: 'Description', sortable: true},
                {type: 'text', key: 'installDate', title: 'Install Date', sortable: true},
                {type: 'text', key: 'installState', title: 'Install State', sortable: true},
                {type: 'text', key: 'versionMin', title: 'Version Minor', sortable: true},
                {type: 'text', key: 'versionMax', title: 'Version Max', sortable: true}
            ]);

            this.status = new ObjectDataTableAdapter([this.ecmVersion.status], [
                {type: 'text', key: 'isReadOnly', title: 'Read Only', sortable: true},
                {type: 'text', key: 'isAuditEnabled', title: 'Audit Enable', sortable: true},
                {type: 'text', key: 'isQuickShareEnabled', title: 'Quick Shared Enable', sortable: true},
                {type: 'text', key: 'isThumbnailGenerationEnabled', title: 'Thumbnail Generation', sortable: true}
            ]);

            this.license = new ObjectDataTableAdapter([this.ecmVersion.license], [
                {type: 'text', key: 'issuedAt', title: 'Issued At', sortable: true},
                {type: 'text', key: 'expiresAt', title: 'Expires At', sortable: true},
                {type: 'text', key: 'remainingDays', title: 'Remaining Days', sortable: true},
                {type: 'text', key: 'holder', title: 'Holder', sortable: true},
                {type: 'text', key: 'mode', title: 'Type', sortable: true},
                {type: 'text', key: 'isClusterEnabled', title: 'Cluster Enabled', sortable: true},
                {type: 'text', key: 'isCryptodocEnabled', title: 'Cryptodoc Enable', sortable: true}
            ]);
        });

        this.http.get('/versions.json').subscribe(response => {
            const regexp = new RegExp('^(@alfresco|alfresco-)');

            const alfrescoPackagesTableRepresentation = Object.keys(response.json().dependencies)
                .filter((val) => regexp.test(val))
                .map((val) => ({
                    name: val,
                    version: response.json().dependencies[val].version
                }));

            this.data = new ObjectDataTableAdapter(alfrescoPackagesTableRepresentation, [
                {type: 'text', key: 'name', title: 'Name', sortable: true},
                {type: 'text', key: 'version', title: 'Version', sortable: true}
            ]);
        });
    }
}
