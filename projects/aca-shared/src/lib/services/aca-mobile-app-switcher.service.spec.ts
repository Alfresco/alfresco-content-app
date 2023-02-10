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
import { MatDialog } from '@angular/material/dialog';

describe('AcaMobileAppSwitcherService', () => {
  let appConfig: AppConfigService;
  let service: AcaMobileAppSwitcherService;

  const mockDialogRef = {
    close: jasmine.createSpy('close'),
    open: jasmine.createSpy('open')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibTestingModule],
      providers: [provideMockStore({ initialState }), { provide: MatDialog, useValue: mockDialogRef }]
    });
    appConfig = TestBed.inject(AppConfigService);
    appConfig.config.mobileAppSwitch = {
      enabled: true,
      iphoneUrl: 'iosamw://',
      androidUrlPart1: 'intent:///',
      androidUrlPart2: '#Intent;scheme=androidamw;package=com.alfresco.content.app;end',
      sessionTimeForOpenAppDialogDisplay: 12
    };
    service = TestBed.inject(AcaMobileAppSwitcherService);
    sessionStorage.clear();
  });

  it('should set the redirectUrl to `iphoneUrl`', () => {
    spyOnProperty(window.navigator, 'userAgent').and.returnValue('iphone');
    const url: string = window.location.href;
    const iphoneUrl: string = appConfig.config.mobileAppSwitch.iphoneUrl + url;
    service.showAppNotification();
    expect(service.redirectUrl).toEqual(iphoneUrl);
  });

  it('should set the redirectUrl to `androidUrl`', () => {
    spyOnProperty(window.navigator, 'userAgent').and.returnValue('android');
    const url: string = window.location.href;
    const androidUrl: string = appConfig.config.mobileAppSwitch.androidUrlPart1 + url + appConfig.config.mobileAppSwitch.androidUrlPart2;
    service.showAppNotification();
    expect(service.redirectUrl).toEqual(androidUrl);
  });

  it('should check if `showAppNotification` function is called', () => {
    const showAppNotificationSpy: jasmine.Spy<() => void> = spyOn(service, 'showAppNotification');
    service.checkForMobileApp();
    expect(showAppNotificationSpy).toHaveBeenCalled();
  });

  it('should not display `openInApp` dialog box when timeDifference is less than the session time', () => {
    service.checkForMobileApp();
    const showAppNotificationSpy: jasmine.Spy<() => void> = spyOn(service, 'showAppNotification');
    service.checkForMobileApp();
    expect(showAppNotificationSpy).not.toHaveBeenCalled();
  });

  it('should check if `openInApp` dialog box is getting opened with `iphone` url', () => {
    const openInAppSpy: jasmine.Spy<(redirectUrl: string) => void> = spyOn(service, 'openInApp');
    const url: string = window.location.href;
    service.redirectUrl = appConfig.config.mobileAppSwitch.iphoneUrl + url;
    service.showAppNotification();
    expect(openInAppSpy).toHaveBeenCalled();
    expect(mockDialogRef.open).toHaveBeenCalled();
  });

  it('should check if `openInApp` dialog box is getting opened with `android` url', () => {
    const openInAppSpy: jasmine.Spy<(redirectUrl: string) => void> = spyOn(service, 'openInApp');
    const url: string = window.location.href;
    service.redirectUrl = appConfig.config.mobileAppSwitch.androidUrlPart1 + url + appConfig.config.mobileAppSwitch.androidUrlPart2;
    service.showAppNotification();
    expect(openInAppSpy).toHaveBeenCalled();
    expect(mockDialogRef.open).toHaveBeenCalled();
  });
});
