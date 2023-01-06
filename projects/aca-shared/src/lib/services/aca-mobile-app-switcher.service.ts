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

import { AppConfigService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OpenInAppComponent } from '../components/open-in-app/open-in-app.component';

@Injectable({
  providedIn: 'root'
})
export class AcaMobileAppSwitcherService {
  private mobileAppSwitchConfig: any = this.config.get<any>('mobileAppSwitch', {});
  constructor(private config: AppConfigService, private dialog: MatDialog) {}

  checkForMobileApp() {
    const currentTime = new Date().getTime();
    const sessionTime = sessionStorage.getItem('sessionTime');
    const sessionConvertedTime = parseFloat(sessionTime);
    const timeDifference = (currentTime - sessionConvertedTime) / (1000 * 60 * 60);
    const sessionTimeForOpenAppDialogDisplay = parseFloat(this.mobileAppSwitchConfig.sessionTimeForOpenAppDialogDisplay);
    if (sessionTime === null || (sessionTime !== null && timeDifference > sessionTimeForOpenAppDialogDisplay)) {
      this.showAppNotification();
    }
  }
  showAppNotification() {
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.indexOf('android') > -1;
    const isIphone = ua.indexOf('iphone') > -1;
    const url = window.location.href;
    const date = new Date();
    const time = date.getTime();
    sessionStorage.setItem('sessionTime', time.toString());
    if (isIphone === true) {
      const iphoneUrl = this.mobileAppSwitchConfig.isIphone + url;
      this.openInApp(iphoneUrl);
    } else if (isAndroid === true) {
      const androidUrl = this.mobileAppSwitchConfig.isAndroidPart1 + url + this.mobileAppSwitchConfig.isAndroidPart2;
      this.openInApp(androidUrl);
    }
  }
  openInApp(redirectUrl: string) {
    this.dialog.open(OpenInAppComponent, {
      data: {
        redirectUrl
      },
      width: '75%',
      role: 'dialog',
      position: { bottom: '50px' }
    });
  }
}
