/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AcaMobileAppSwitcherService } from '../../services/aca-mobile-app-switcher.service';

export interface OpenInAppDialogOptions {
  redirectUrl: string;
  appStoreUrl: string;
}
@Component({
  selector: 'aca-open-in-app',
  templateUrl: './open-in-app.component.html',
  styleUrls: ['./open-in-app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OpenInAppComponent {
  private redirectUrl: string;
  public appStoreUrl: string;
  public window: Window & typeof globalThis = window;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: OpenInAppDialogOptions,
    private dialog: MatDialogRef<OpenInAppComponent>,
    private acaMobileAppSwitcherService: AcaMobileAppSwitcherService
  ) {
    if (data) {
      this.redirectUrl = data.redirectUrl;
      if (data.appStoreUrl) {
        this.appStoreUrl = data.appStoreUrl;
      }
    }
  }

  openInApp(): void {
    this.window.location.href = this.redirectUrl;
  }

  downloadIosApp(): void {
    this.window.location.href = this.appStoreUrl;
  }

  onCloseDialog(): void {
    const time: number = new Date().getTime();
    sessionStorage.setItem('mobile_notification_expires_in', time.toString());
    this.dialog.close();
    this.acaMobileAppSwitcherService.isDialogEnable = false;
  }
}
