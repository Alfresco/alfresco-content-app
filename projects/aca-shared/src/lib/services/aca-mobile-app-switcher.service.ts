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

@Injectable({
  providedIn: 'root'
})
export class AcaMobileAppSwitcherService {
  constructor(private config: AppConfigService) {}

  checkForMobileApp() {
    const mobileAppSwitchConfig: any = this.config.get<any>('mobileAppSwitch', {});
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.indexOf('android') > -1;
    const isIphone = ua.indexOf('iphone') > -1;
    const url = window.location.href;
    if (isIphone === true) {
      window.location.href = mobileAppSwitchConfig.isIphone + url;
    } else if (isAndroid === true) {
      setTimeout(() => {
        window.location.href = mobileAppSwitchConfig.isAndroidPart1 + url + mobileAppSwitchConfig.isAndroidPart2;
      }, 500);
    }
  }
}
