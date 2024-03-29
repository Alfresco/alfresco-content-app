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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { OpenInAppComponent } from './open-in-app.component';
import { initialState, LibTestingModule } from '../../testing/lib-testing-module';
import { provideMockStore } from '@ngrx/store/testing';

describe('OpenInAppComponent', () => {
  let fixture: ComponentFixture<OpenInAppComponent>;
  let component: OpenInAppComponent;

  const mockDialogRef = {
    close: jasmine.createSpy('close'),
    open: jasmine.createSpy('open')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibTestingModule, OpenInAppComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: MAT_DIALOG_DATA, useValue: { redirectUrl: 'mockRedirectUrl', appStoreUrl: 'mockAppStoreUrl' } },
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    });

    fixture = TestBed.createComponent(OpenInAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should redirect to app when click on `Open in App` button` ', async () => {
    let currentLocation: string | string[];
    component.window = {
      location: {
        set href(value: string | string[]) {
          currentLocation = value;
        }
      }
    } as Window & typeof globalThis;
    const saveButton = fixture.debugElement.query(By.css('[data-automation-id="open-in-app-button"]')).nativeElement;
    saveButton.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(currentLocation).toBe('mockRedirectUrl');
  });

  it('should set the value `mobile_notification_expires_in` in session storage on dialog close', async () => {
    sessionStorage.clear();
    component.onCloseDialog();
    expect(sessionStorage.getItem('mobile_notification_expires_in')).not.toBeNull();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should redirect to App Store for downloading the app in case of Ios device', async () => {
    let currentLocation: string | string[];
    const windowStub: Window & typeof globalThis = {
      location: {
        set href(value: string | string[]) {
          currentLocation = value;
        }
      }
    } as Window & typeof globalThis;
    component.window = windowStub;
    const downloadAppButton = fixture.debugElement.query(By.css('[data-automation-id="download-app-button"]')).nativeElement;
    downloadAppButton.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(currentLocation).toBe('mockAppStoreUrl');
  });
});
