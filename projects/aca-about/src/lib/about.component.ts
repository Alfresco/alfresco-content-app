/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import { ExtensionRef } from '@alfresco/adf-extensions';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RepositoryInfo } from '@alfresco/js-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppExtensionService, ContentApiService } from '@alfresco/aca-shared';
import { dependencies, version, name, commit } from 'package.json';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['about.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-about' }
})
export class AboutComponent implements OnInit {
  repository: RepositoryInfo;
  extensions$: Observable<ExtensionRef[]>;
  dependencyEntries: Array<{ name: string; version: string }>;
  statusEntries: Array<{ property: string; value: string }>;
  licenseEntries: Array<{ property: string; value: string }>;
  adfRepoUrl = 'https://github.com/Alfresco/alfresco-ng2-components/commits';
  appRepoUrl = !!commit ? `https://github.com/Alfresco/${name}/commits/${commit}` : null;
  adfVersion = '';
  appVersion = version;

  constructor(private contentApi: ContentApiService, appExtensions: AppExtensionService) {
    this.extensions$ = appExtensions.references$;
  }

  ngOnInit() {
    this.dependencyEntries = Object.keys(dependencies).map((key) => {
      if (key === '@alfresco/adf-core') {
        this.adfVersion = dependencies[key].split('-')[0];
        const adfCurrentCommit = dependencies[key].split('-')[1] || '';

        if (adfCurrentCommit) {
          this.adfRepoUrl = this.adfRepoUrl.concat('/', adfCurrentCommit);
        } else {
          this.adfRepoUrl = null;
        }
      }
      return {
        name: key,
        version: dependencies[key]
      };
    });

    this.contentApi
      .getRepositoryInformation()
      .pipe(map((node) => node.entry.repository))
      .subscribe((repository) => {
        this.repository = repository;

        this.statusEntries = Object.keys(repository.status).map((key) => {
          return {
            property: key,
            value: repository.status[key]
          };
        });

        if (repository.license) {
          this.licenseEntries = Object.keys(repository.license).map((key) => {
            return {
              property: key,
              value: repository.license[key]
            };
          });
        }
      });
  }
}
