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
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { AppConfigService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OpenInAppComponent } from '../components/open-in-app/open-in-app.component';

export interface MobileAppSwitchConfigurationOptions {
  enabled: string;
  iphoneUrl: string;
  androidUrlPart1: string;
  androidUrlPart2: string;
  sessionTimeForOpenAppDialogDisplay: string;
}
@Injectable({
  providedIn: 'root'
})
export class AcaMobileAppSwitcherService {
  private mobileAppSwitchConfig: MobileAppSwitchConfigurationOptions;
  public redirectUrl: string;

  constructor(private config: AppConfigService, private dialog: MatDialog) {
    this.mobileAppSwitchConfig = this.config.get<MobileAppSwitchConfigurationOptions>('mobileAppSwitch');
  }

  resolveExistenceOfDialog(): void {
    const url: string = this.getCurrentUrl();
    const queryParams: string = url.split('?')[1];
    let queryParamsList = [];
    let hideBanner = false;
    if (queryParams !== null && queryParams !== undefined) {
      queryParamsList = queryParams.split('&');
      hideBanner = queryParamsList.some((param) => param.split('=')[0] === 'mobileapps' && param.split('=')[1] === 'true');
    }
    if (!hideBanner) {
      this.verifySessionExistsForDialog();
    }
  }

  verifySessionExistsForDialog(): void {
    const sessionTime: string = sessionStorage.getItem('mobile_notification_expires_in');
    if (sessionTime !== null) {
      const currentTime: number = new Date().getTime();
      const sessionConvertedTime: number = parseFloat(sessionTime);
      const timeDifference: number = (currentTime - sessionConvertedTime) / (1000 * 60 * 60);
      const sessionTimeForOpenAppDialogDisplay: number = parseFloat(this.mobileAppSwitchConfig.sessionTimeForOpenAppDialogDisplay);

      if (timeDifference > sessionTimeForOpenAppDialogDisplay) {
        this.clearSessionExpireTime();
        this.identifyBrowserAndSetRedirectURL();
      }
    } else {
      this.identifyBrowserAndSetRedirectURL();
    }
  }

  identifyBrowserAndSetRedirectURL(): void {
    const ua: string = navigator.userAgent.toLowerCase();
    const isAndroid: boolean = ua.indexOf('android') > -1;
    const isIOS: boolean = ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1;
    const currentUrl: string = this.getCurrentUrl();

    if (isIOS === true) {
      this.redirectUrl = this.mobileAppSwitchConfig.iphoneUrl + currentUrl;
    } else if (isAndroid === true) {
      this.redirectUrl = this.mobileAppSwitchConfig.androidUrlPart1 + currentUrl + this.mobileAppSwitchConfig.androidUrlPart2;
    }

    if (this.redirectUrl !== undefined && this.redirectUrl !== null) {
      this.openDialog(this.redirectUrl);
    }
  }

  openDialog(redirectUrl: string): void {
    this.dialog.open(OpenInAppComponent, {
      data: {
        redirectUrl
      },
      hasBackdrop: false,
      width: 'auto',
      role: 'dialog',
      position: { bottom: '20px' }
    });
  }

  clearSessionExpireTime(): void {
    sessionStorage.removeItem('mobile_notification_expires_in');
  }

  getCurrentUrl(): string {
    return window.location.href;
  }
}
