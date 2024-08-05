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
import { AutoDownloadService, initialState, LibTestingModule } from '@alfresco/aca-shared';
import { MatDialog } from '@angular/material/dialog';
import { FileAutoDownloadComponent } from '@alfresco/adf-content-services';
import { provideMockStore } from '@ngrx/store/testing';

describe('AcaFileAutoDownloadService', () => {
  let service: AutoDownloadService;

  const mockDialogRef = {
    open: jasmine.createSpy('open')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibTestingModule],
      providers: [provideMockStore({ initialState }), { provide: MatDialog, useValue: mockDialogRef }]
    });

    service = TestBed.inject(AutoDownloadService);
  });

  it('tryDownload should return true if fileSize exceeds configured threshold and file auto tryDownload is enabled', () => {
    const node = { entry: { content: { sizeInBytes: 11000000 } } } as any;
    const result = service.tryDownload(node, 10);
    expect(result).toBe(true);
  });

  it('tryDownload should return false if fileSize does not exceeds configured threshold and file auto tryDownload is enabled', () => {
    const node = { entry: { content: { sizeInBytes: 500000 } } } as any;
    const result = service.tryDownload(node, 10);
    expect(result).toBe(false);
  });

  it('tryDownload should open the dialog when called', () => {
    const nodeEntity: any = { entry: { isFile: true, content: { sizeInBytes: 11000000 } } };
    service.tryDownload(nodeEntity, 10);
    expect(mockDialogRef.open).toHaveBeenCalledWith(FileAutoDownloadComponent, { disableClose: true, data: nodeEntity });
  });
});
