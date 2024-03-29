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
      enabled: true
    };
    service = TestBed.inject(AcaMobileAppSwitcherService);
    sessionStorage.clear();
  });

  it('should set the redirectUrl to `iphoneUrl`', () => {
    spyOnProperty(window.navigator, 'userAgent').and.returnValue('iphone');
    const url: string = window.location.href;
    const iphoneUrl = service.getIPhoneRedirectUrl(url);
    service.identifyBrowserAndSetRedirectURL();
    expect(service.redirectUrl).toEqual(iphoneUrl);
  });

  it('should set the redirectUrl to `androidUrl`', () => {
    spyOnProperty(window.navigator, 'userAgent').and.returnValue('android');
    const androidUrl = service.getAndroidRedirectUrl(window.location.href);
    service.identifyBrowserAndSetRedirectURL();
    expect(service.redirectUrl).toEqual(androidUrl);
  });

  it('should check if `identifyBrowserAndSetRedirectURL` function is called', () => {
    const identifyBrowserAndSetRedirectURLSpy: jasmine.Spy<() => void> = spyOn(service, 'identifyBrowserAndSetRedirectURL');
    service.resolveExistenceOfDialog();
    expect(identifyBrowserAndSetRedirectURLSpy).toHaveBeenCalled();
  });

  it('should not display `openInApp` dialog box after closing the same and time difference less than session time', () => {
    const time: number = new Date().getTime();
    sessionStorage.setItem('mobile_notification_expires_in', time.toString());
    const identifyBrowserAndSetRedirectURLSpy: jasmine.Spy<() => void> = spyOn(service, 'identifyBrowserAndSetRedirectURL');
    service.verifySessionExistsForDialog();
    expect(identifyBrowserAndSetRedirectURLSpy).not.toHaveBeenCalled();
  });

  it('should check if `openInApp` dialog box is getting opened with `iphone` url', () => {
    service.redirectUrl = service.getIPhoneRedirectUrl(window.location.href);
    service.identifyBrowserAndSetRedirectURL();
    expect(mockDialogRef.open).toHaveBeenCalled();
  });

  it('should check if `openInApp` dialog box is getting opened with `android` url', () => {
    service.redirectUrl = service.getAndroidRedirectUrl(window.location.href);
    service.identifyBrowserAndSetRedirectURL();
    expect(mockDialogRef.open).toHaveBeenCalled();
  });

  it('should not display Open in app dialog when the web application is opened within mobile application', () => {
    spyOn(service, 'getCurrentUrl').and.returnValue('localhost?mobileapps=true');
    const verifySessionExistsForDialogSpy: jasmine.Spy<() => void> = spyOn(service, 'verifySessionExistsForDialog');
    service.resolveExistenceOfDialog();
    expect(verifySessionExistsForDialogSpy).not.toHaveBeenCalled();
  });

  it('should display Open in app dialog when the web application is opened in mobile browser', () => {
    spyOn(service, 'getCurrentUrl').and.returnValue('localhost');
    const verifySessionExistsForDialogSpy: jasmine.Spy<() => void> = spyOn(service, 'verifySessionExistsForDialog');
    service.resolveExistenceOfDialog();
    expect(verifySessionExistsForDialogSpy).toHaveBeenCalled();
  });
});
