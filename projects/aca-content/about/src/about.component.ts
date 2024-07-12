/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { DEV_MODE_TOKEN } from './dev-mode.tokens';
import { AboutModule, AuthenticationService, RepositoryInfo } from '@alfresco/adf-core';
import { DiscoveryApiService } from '@alfresco/adf-content-services';
import { PACKAGE_JSON } from './package-json.token';
import { TranslateModule } from '@ngx-translate/core';
import { AppExtensionService, AppSettingsService, PageLayoutComponent } from '@alfresco/aca-shared';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, AboutModule, RouterModule, MatIconModule, MatButtonModule, PageLayoutComponent],
  selector: 'app-about-page',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutComponent implements OnInit {
  private authService = inject(AuthenticationService);
  private appExtensions = inject(AppExtensionService);
  private appSettings = inject(AppSettingsService);
  private discovery = inject(DiscoveryApiService);
  public packageJson? = inject(PACKAGE_JSON, { optional: true });
  public dev = inject(DEV_MODE_TOKEN);

  extensions$ = this.appExtensions.references$;
  repository: RepositoryInfo = null;
  landingPage = this.appSettings.landingPage;

  ngOnInit(): void {
    if (this.authService.isEcmLoggedIn()) {
      this.setECMInfo();
    }
  }

  setECMInfo() {
    this.discovery.getEcmProductInfo().subscribe((repository) => {
      this.repository = repository as RepositoryInfo;
    });
  }
}
