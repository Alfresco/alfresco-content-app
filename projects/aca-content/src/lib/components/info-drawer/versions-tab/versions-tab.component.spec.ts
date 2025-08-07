/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { VersionsTabComponent } from './versions-tab.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppSettingsService } from '@alfresco/aca-shared';
import { VersionListDataSource, VersionManagerComponent } from '@alfresco/adf-content-services';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NoopTranslateModule, provideCoreAuthTesting } from '@alfresco/adf-core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('VersionsTabComponent', () => {
  let component: VersionsTabComponent;
  let fixture: ComponentFixture<VersionsTabComponent>;
  let appSettingsService: AppSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, VersionsTabComponent],
      providers: [provideNoopAnimations(), provideCoreAuthTesting()]
    });

    fixture = TestBed.createComponent(VersionsTabComponent);
    component = fixture.componentInstance;
    appSettingsService = TestBed.inject(AppSettingsService);
    spyOn(VersionListDataSource.prototype, 'connect').and.returnValue(of());
    spyOn(VersionListDataSource.prototype, 'reset');
  });

  describe('Version manager', () => {
    let uploadAllowDownloadSpy: jasmine.SpyAnd<() => boolean>;
    let versionManagerAllowViewVersionsSpy: jasmine.SpyAnd<() => boolean>;
    let versionManagerShowActionsSpy: jasmine.SpyAnd<() => boolean>;
    let versionManagerAllowVersionDeleteSpy: jasmine.SpyAnd<() => boolean>;
    let uploadAllowCommentsSpy: jasmine.SpyAnd<() => boolean>;
    let versionManagerComponent: VersionManagerComponent;

    beforeEach(() => {
      component.node = {
        nodeId: 'some id'
      } as any;
      uploadAllowDownloadSpy = spyOnProperty(appSettingsService, 'uploadAllowDownload').and;
      versionManagerAllowViewVersionsSpy = spyOnProperty(appSettingsService, 'versionManagerAllowViewVersions').and;
      versionManagerShowActionsSpy = spyOnProperty(appSettingsService, 'versionManagerShowActions').and;
      versionManagerAllowVersionDeleteSpy = spyOnProperty(appSettingsService, 'versionManagerAllowVersionDelete').and;
      uploadAllowCommentsSpy = spyOnProperty(appSettingsService, 'uploadAllowComments').and;
      fixture.detectChanges();
      versionManagerComponent = fixture.debugElement.query(By.directive(VersionManagerComponent)).componentInstance;
    });

    it('should have assigned true to showComments if settings.uploadAllowComments returns true', () => {
      uploadAllowDownloadSpy.returnValue(true);
      versionManagerAllowViewVersionsSpy.returnValue(true);
      versionManagerShowActionsSpy.returnValue(true);
      versionManagerAllowVersionDeleteSpy.returnValue(true);
      uploadAllowCommentsSpy.returnValue(true);

      fixture.detectChanges();
      expect(versionManagerComponent.showComments).toBe(true);
    });

    it('should have assigned false to showComments if settings.uploadAllowComments returns false', () => {
      uploadAllowDownloadSpy.returnValue(true);
      versionManagerAllowViewVersionsSpy.returnValue(true);
      versionManagerShowActionsSpy.returnValue(true);
      versionManagerAllowVersionDeleteSpy.returnValue(true);
      uploadAllowCommentsSpy.returnValue(false);

      fixture.detectChanges();
      expect(versionManagerComponent.showComments).toBe(false);
    });

    it('should have assigned true to allowDownload if settings.uploadAllowDownload returns true', () => {
      uploadAllowDownloadSpy.returnValue(true);
      versionManagerAllowViewVersionsSpy.returnValue(true);
      versionManagerShowActionsSpy.returnValue(true);
      versionManagerAllowVersionDeleteSpy.returnValue(true);
      uploadAllowCommentsSpy.returnValue(true);

      fixture.detectChanges();
      expect(versionManagerComponent.allowDownload).toBe(true);
    });

    it('should have assigned false to allowDownload if settings.uploadAllowDownload returns false', () => {
      uploadAllowDownloadSpy.returnValue(false);
      versionManagerAllowViewVersionsSpy.returnValue(true);
      versionManagerShowActionsSpy.returnValue(true);
      versionManagerAllowVersionDeleteSpy.returnValue(true);
      uploadAllowCommentsSpy.returnValue(true);

      fixture.detectChanges();
      expect(versionManagerComponent.allowDownload).toBe(false);
    });

    it('should have assigned true to allowViewVersions if settings.versionManagerAllowViewVersions returns true', () => {
      uploadAllowDownloadSpy.returnValue(true);
      versionManagerAllowViewVersionsSpy.returnValue(true);
      versionManagerShowActionsSpy.returnValue(true);
      versionManagerAllowVersionDeleteSpy.returnValue(true);
      uploadAllowCommentsSpy.returnValue(true);

      fixture.detectChanges();
      expect(versionManagerComponent.allowViewVersions).toBe(true);
    });

    it('should have assigned false to allowViewVersions if settings.versionManagerAllowViewVersions returns false', () => {
      uploadAllowDownloadSpy.returnValue(true);
      versionManagerAllowViewVersionsSpy.returnValue(false);
      versionManagerShowActionsSpy.returnValue(true);
      versionManagerAllowVersionDeleteSpy.returnValue(true);
      uploadAllowCommentsSpy.returnValue(true);

      fixture.detectChanges();
      expect(versionManagerComponent.allowViewVersions).toBe(false);
    });

    it('should have assigned true to allowVersionDelete if settings.versionManagerAllowVersionDelete returns true', () => {
      uploadAllowDownloadSpy.returnValue(true);
      versionManagerAllowViewVersionsSpy.returnValue(true);
      versionManagerShowActionsSpy.returnValue(true);
      versionManagerAllowVersionDeleteSpy.returnValue(true);
      uploadAllowCommentsSpy.returnValue(true);

      fixture.detectChanges();
      expect(versionManagerComponent.allowVersionDelete).toBe(true);
    });

    it('should have assigned false to allowVersionDelete if settings.versionManagerAllowVersionDelete returns false', () => {
      uploadAllowDownloadSpy.returnValue(true);
      versionManagerAllowViewVersionsSpy.returnValue(true);
      versionManagerShowActionsSpy.returnValue(true);
      versionManagerAllowVersionDeleteSpy.returnValue(false);
      uploadAllowCommentsSpy.returnValue(true);

      fixture.detectChanges();
      expect(versionManagerComponent.allowVersionDelete).toBe(false);
    });

    it('should have assigned true to showActions if settings.versionManagerShowActions returns true', () => {
      uploadAllowDownloadSpy.returnValue(true);
      versionManagerAllowViewVersionsSpy.returnValue(true);
      versionManagerShowActionsSpy.returnValue(true);
      versionManagerAllowVersionDeleteSpy.returnValue(true);
      uploadAllowCommentsSpy.returnValue(true);

      fixture.detectChanges();
      expect(versionManagerComponent.allowVersionDelete).toBe(true);
    });

    it('should have assigned false to showActions if settings.versionManagerShowActions returns false', () => {
      uploadAllowDownloadSpy.returnValue(true);
      versionManagerAllowViewVersionsSpy.returnValue(true);
      versionManagerShowActionsSpy.returnValue(false);
      versionManagerAllowVersionDeleteSpy.returnValue(true);
      uploadAllowCommentsSpy.returnValue(true);

      fixture.detectChanges();
      expect(versionManagerComponent.showActions).toBe(false);
    });
  });
});
