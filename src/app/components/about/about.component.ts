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

import { ObjectDataTableAdapter } from '@alfresco/adf-core';
import { ExtensionRef } from '@alfresco/adf-extensions';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RepositoryInfo } from 'alfresco-js-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppExtensionService } from '../../extensions/extension.service';
import { ContentApiService } from '../../services/content-api.service';
import { version, dependencies } from '../../../../package.json';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-about' }
})
export class AboutComponent implements OnInit {
  repository: RepositoryInfo;
  status: ObjectDataTableAdapter;
  license: ObjectDataTableAdapter;
  modules: ObjectDataTableAdapter;
  releaseVersion = version;

  extensionColumns: string[] = [
    '$id',
    '$name',
    '$version',
    '$vendor',
    '$license',
    '$runtime',
    '$description'
  ];
  extensions$: Observable<ExtensionRef[]>;

  dependencyColumns: string[] = ['name', 'version'];
  dependencyEntries: Array<{ name: string; version: string }> = [];

  constructor(
    private contentApi: ContentApiService,
    appExtensions: AppExtensionService
  ) {
    this.extensions$ = appExtensions.references$;
  }

  ngOnInit() {
    this.dependencyEntries = Object.keys(dependencies).map(key => {
      return {
        name: key,
        version: dependencies[key]
      };
    });

    this.contentApi
      .getRepositoryInformation()
      .pipe(map(node => node.entry.repository))
      .subscribe(repository => {
        this.repository = repository;

        this.modules = new ObjectDataTableAdapter(repository.modules, [
          { type: 'text', key: 'id', title: 'ID', sortable: true },
          { type: 'text', key: 'title', title: 'Title', sortable: true },
          {
            type: 'text',
            key: 'version',
            title: 'Description',
            sortable: true
          },
          {
            type: 'date',
            key: 'installDate',
            title: 'Install Date',
            sortable: true
          },
          {
            type: 'text',
            key: 'installState',
            title: 'Install State',
            sortable: true
          },
          {
            type: 'text',
            key: 'versionMin',
            title: 'Version Minor',
            sortable: true
          },
          {
            type: 'text',
            key: 'versionMax',
            title: 'Version Max',
            sortable: true
          }
        ]);

        this.status = new ObjectDataTableAdapter(
          [repository.status],
          [
            {
              type: 'text',
              key: 'isReadOnly',
              title: 'Read Only',
              sortable: true
            },
            {
              type: 'text',
              key: 'isAuditEnabled',
              title: 'Audit Enable',
              sortable: true
            },
            {
              type: 'text',
              key: 'isQuickShareEnabled',
              title: 'Quick Shared Enable',
              sortable: true
            },
            {
              type: 'text',
              key: 'isThumbnailGenerationEnabled',
              title: 'Thumbnail Generation',
              sortable: true
            }
          ]
        );

        if (repository.license) {
          this.license = new ObjectDataTableAdapter(
            [repository.license],
            [
              {
                type: 'date',
                key: 'issuedAt',
                title: 'Issued At',
                sortable: true
              },
              {
                type: 'date',
                key: 'expiresAt',
                title: 'Expires At',
                sortable: true
              },
              {
                type: 'text',
                key: 'remainingDays',
                title: 'Remaining Days',
                sortable: true
              },
              { type: 'text', key: 'holder', title: 'Holder', sortable: true },
              { type: 'text', key: 'mode', title: 'Type', sortable: true },
              {
                type: 'text',
                key: 'isClusterEnabled',
                title: 'Cluster Enabled',
                sortable: true
              },
              {
                type: 'text',
                key: 'isCryptodocEnabled',
                title: 'Cryptodoc Enable',
                sortable: true
              }
            ]
          );
        }
      });
  }
}
