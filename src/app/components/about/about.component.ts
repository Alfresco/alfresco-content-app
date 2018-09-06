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
import { HttpClient } from '@angular/common/http';
import { ObjectDataTableAdapter  } from '@alfresco/adf-core';
import { ContentApiService } from '../../services/content-api.service';
import { RepositoryInfo } from 'alfresco-js-api';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
    repository: RepositoryInfo;
    data: ObjectDataTableAdapter;
    status: ObjectDataTableAdapter;
    license: ObjectDataTableAdapter;
    modules: ObjectDataTableAdapter;
    githubUrlCommitAlpha = 'https://github.com/Alfresco/alfresco-content-app/commits';
    releaseVersion = '';

    constructor(
        private contentApi: ContentApiService,
        private http: HttpClient
    ) {}

    ngOnInit() {
        this.contentApi.getRepositoryInformation()
            .pipe(map(node => node.entry.repository))
            .subscribe(repository => {
            this.repository = repository;

            this.modules = new ObjectDataTableAdapter(repository.modules, [
                {type: 'text', key: 'id', title: 'ID', sortable: true},
                {type: 'text', key: 'title', title: 'Title', sortable: true},
                {type: 'text', key: 'version', title: 'Description', sortable: true},
                {type: 'date', key: 'installDate', title: 'Install Date', sortable: true},
                {type: 'text', key: 'installState', title: 'Install State', sortable: true},
                {type: 'text', key: 'versionMin', title: 'Version Minor', sortable: true},
                {type: 'text', key: 'versionMax', title: 'Version Max', sortable: true}
            ]);

            this.status = new ObjectDataTableAdapter([repository.status], [
                {type: 'text', key: 'isReadOnly', title: 'Read Only', sortable: true},
                {type: 'text', key: 'isAuditEnabled', title: 'Audit Enable', sortable: true},
                {type: 'text', key: 'isQuickShareEnabled', title: 'Quick Shared Enable', sortable: true},
                {type: 'text', key: 'isThumbnailGenerationEnabled', title: 'Thumbnail Generation', sortable: true}
            ]);


            if (repository.license) {
                this.license = new ObjectDataTableAdapter([repository.license], [
                    {type: 'date', key: 'issuedAt', title: 'Issued At', sortable: true},
                    {type: 'date', key: 'expiresAt', title: 'Expires At', sortable: true},
                    {type: 'text', key: 'remainingDays', title: 'Remaining Days', sortable: true},
                    {type: 'text', key: 'holder', title: 'Holder', sortable: true},
                    {type: 'text', key: 'mode', title: 'Type', sortable: true},
                    {type: 'text', key: 'isClusterEnabled', title: 'Cluster Enabled', sortable: true},
                    {type: 'text', key: 'isCryptodocEnabled', title: 'Cryptodoc Enable', sortable: true}
                ]);
            }
        });

        this.http.get('/versions.json')
            .subscribe((response: any) => {
                const regexp = new RegExp('^(@alfresco|alfresco-)');

                const alfrescoPackagesTableRepresentation = Object.keys(response.dependencies)
                    .filter((val) => regexp.test(val))
                    .map((val) => ({
                        name: val,
                        version: response.dependencies[val].version
                    }));

                this.data = new ObjectDataTableAdapter(alfrescoPackagesTableRepresentation, [
                    {type: 'text', key: 'name', title: 'Name', sortable: true},
                    {type: 'text', key: 'version', title: 'Version', sortable: true}
                ]);

                this.releaseVersion = response.version;
            });
    }
}
