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

import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { DiscoveryApiService } from '@alfresco/adf-core';
import { EcmProductVersionModel, ObjectDataTableAdapter  } from '@alfresco/adf-content-services';

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
            const regexp = new RegExp('^(ng2-alfresco|alfresco-)');

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
