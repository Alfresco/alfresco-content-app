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

import { Component, Inject, OnInit, Optional } from '@angular/core';
import { DEV_MODE_TOKEN } from './dev-mode.tokens';
import { Observable } from 'rxjs';
import { AppExtensionService, ExtensionRef } from '@alfresco/adf-extensions';
import { AuthenticationService, DiscoveryApiService, RepositoryInfo } from '@alfresco/adf-core';
import { PACKAGE_JSON } from './package-json.token';
import { AppService } from '@alfresco/aca-shared';

@Component({
  selector: 'app-about-page',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  pkg: any;
  dev = false;
  extensions$: Observable<ExtensionRef[]>;
  repository: RepositoryInfo = null;
  hideSidenav: boolean;

  constructor(
    @Inject(DEV_MODE_TOKEN) devMode,
    @Optional()
    @Inject(PACKAGE_JSON)
    public packageJson,
    private authService: AuthenticationService,
    private appExtensions: AppExtensionService,
    private discovery: DiscoveryApiService,
    private appServices: AppService
  ) {
    this.dev = !devMode;
    this.extensions$ = this.appExtensions.references$;
  }

  ngOnInit(): void {
    if (this.authService.isEcmLoggedIn()) {
      this.setECMInfo();
    }
    this.appServices.cast.subscribe((data) => (this.hideSidenav = data));
  }

  setECMInfo() {
    this.discovery.getEcmProductInfo().subscribe((repository) => {
      this.repository = repository as RepositoryInfo;
    });
  }
}
