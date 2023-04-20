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

import { TestBed } from '@angular/core/testing';
import { AcaFileAutoDownloadService, initialState, LibTestingModule } from '@alfresco/aca-shared';
import { MatDialog } from '@angular/material/dialog';
import { AppConfigService } from '@alfresco/adf-core';
import { FileAutoDownloadComponent } from '@alfresco/adf-content-services';
import { provideMockStore } from '@ngrx/store/testing';

describe('AcaFileAutoDownloadService', () => {
  let service: AcaFileAutoDownloadService;
  let appConfig: AppConfigService;

  const mockDialogRef = {
    open: jasmine.createSpy('open')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibTestingModule],
      providers: [provideMockStore({ initialState }), { provide: MatDialog, useValue: mockDialogRef }]
    });

    service = TestBed.inject(AcaFileAutoDownloadService);
    appConfig = TestBed.inject(AppConfigService);
  });

  it('shouldFileAutoDownload should return true if fileSize exceeds configured threshold and file auto download is enabled', () => {
    appConfig.config.viewer = {
      enableFileAutoDownload: true,
      fileAutoDownloadSizeThresholdInMB: 10
    };
    const shouldAutDownloadFlag = service.shouldFileAutoDownload(11000000);
    expect(shouldAutDownloadFlag).toBe(true);
  });

  it('shouldFileAutoDownload should return false if fileSize does not exceeds configured threshold and file auto download is enabled', () => {
    appConfig.config.viewer = {
      enableFileAutoDownload: true,
      fileAutoDownloadSizeThresholdInMB: 10
    };
    const shouldAutDownloadFlag = service.shouldFileAutoDownload(500000);
    expect(shouldAutDownloadFlag).toBe(false);
  });

  it('shouldFileAutoDownload should return false if fileSize exceeds configured threshold but file auto download is disabled', () => {
    appConfig.config.viewer = {
      enableFileAutoDownload: false,
      fileAutoDownloadSizeThresholdInMB: 10
    };
    const shouldAutDownloadFlag = service.shouldFileAutoDownload(11000000);
    expect(shouldAutDownloadFlag).toBe(false);
  });

  it('autoDownloadFile should open FileAutoDownload dialog when called', () => {
    const nodeEntity: any = { entry: { isFile: true } };
    service.autoDownloadFile(nodeEntity);
    expect(mockDialogRef.open).toHaveBeenCalledWith(FileAutoDownloadComponent, { disableClose: true, data: nodeEntity });
  });
});
