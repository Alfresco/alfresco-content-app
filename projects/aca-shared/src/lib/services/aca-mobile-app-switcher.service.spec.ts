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

import { TestBed } from '@angular/core/testing';
import { AppConfigService } from '@alfresco/adf-core';
import { LibTestingModule, initialState } from '../testing/lib-testing-module';
import { provideMockStore } from '@ngrx/store/testing';
import { AcaMobileAppSwitcherService } from './aca-mobile-app-switcher.service';
import { MatDialogModule } from '@angular/material/dialog';

describe('AcaMobileAppSwitcherService', () => {
  let appConfig: AppConfigService;
  let service: AcaMobileAppSwitcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibTestingModule, MatDialogModule],
      providers: [provideMockStore({ initialState })]
    });
    appConfig = TestBed.inject(AppConfigService);
    appConfig.config.mobileAppSwitch = {
      enabled: true,
      isIphone: 'iosamw://',
      isAndroidPart1: 'intent:///',
      isAndroidPart2: '#Intent;scheme=androidamw;package=com.alfresco.content.app.debug;end'
    };
    service = TestBed.inject(AcaMobileAppSwitcherService);
  });

  it('should check if redirectUrl is the `iphoneUrl`', () => {
    spyOnProperty(window.navigator, 'userAgent').and.returnValue('iphone');
    const url = window.location.href;
    const iphoneUrl = appConfig.config.mobileAppSwitch.isIphone + url;
    service.showAppNotification();
    expect(service.redirectUrl).toEqual(iphoneUrl);
  });
  it('should check if the redirectUrl is `androidUrl`', () => {
    spyOnProperty(window.navigator, 'userAgent').and.returnValue('android');
    const url = window.location.href;
    const androidUrl = appConfig.config.mobileAppSwitch.isAndroidPart1 + url + appConfig.config.mobileAppSwitch.isAndroidPart2;
    service.showAppNotification();
    expect(service.redirectUrl).toEqual(androidUrl);
  });
});
