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

import { AppConfigService } from '@alfresco/adf-core';
import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OpenInAppComponent } from '../components/open-in-app/open-in-app.component';

@Injectable({
  providedIn: 'root'
})
export class AcaMobileAppSwitcherService {
  public redirectUrl: string;
  private dialogRef: MatDialogRef<OpenInAppComponent>;
  private config = inject(AppConfigService);
  private dialog = inject(MatDialog);

  get appStoreUrl(): string {
    const defaultValue = 'https://apps.apple.com/us/app/alfresco-mobile-workspace/id1514434480';
    return this.config.get<string>('mobileAppSwitch.appStoreUrl', defaultValue);
  }

  get sessionTimeout(): number {
    return this.config.get<number>('mobileAppSwitch.sessionTimeout', 12);
  }

  getIPhoneRedirectUrl(url: string): string {
    const prefix = this.config.get<string>('mobileAppSwitch.iphoneUrl', 'iosamw://');
    return prefix + url;
  }

  getAndroidRedirectUrl(url: string): string {
    const prefix = this.config.get<string>('mobileAppSwitch.androidUrlPart1', 'intent:///');
    const suffix = this.config.get<string>('mobileAppSwitch.androidUrlPart2', '#Intent;scheme=androidamw;package=com.alfresco.content.app;end');
    return prefix + url + suffix;
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

      if (timeDifference > this.sessionTimeout) {
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
    const isIPadInSafari = /Macintosh/i.test(ua) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1;
    const isIOS: boolean = ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1 || isIPadInSafari;
    const currentUrl: string = this.getCurrentUrl();

    if (isIOS === true) {
      this.redirectUrl = this.getIPhoneRedirectUrl(currentUrl);
    } else if (isAndroid === true) {
      this.redirectUrl = this.getAndroidRedirectUrl(currentUrl);
    }

    if (this.redirectUrl !== undefined && this.redirectUrl !== null) {
      this.openDialog(this.redirectUrl, this.appStoreUrl);
    }
  }

  openDialog(redirectUrl: string, appStoreUrl?: string): void {
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open(OpenInAppComponent, {
        data: {
          redirectUrl,
          appStoreUrl
        },
        hasBackdrop: false,
        width: '100%',
        role: 'dialog',
        position: { bottom: '0' }
      });
    }
  }

  clearSessionExpireTime(): void {
    sessionStorage.removeItem('mobile_notification_expires_in');
  }

  getCurrentUrl(): string {
    return window.location.href;
  }

  closeDialog(): void {
    if (this.dialogRef) {
      this.dialog.closeAll();
      this.dialogRef = null;
    }
  }
}
