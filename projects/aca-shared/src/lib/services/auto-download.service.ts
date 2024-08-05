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

import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NodeEntry } from '@alfresco/js-api';
import { FileAutoDownloadComponent } from '@alfresco/adf-content-services';

const BYTES_TO_MB_CONVERSION_VALUE = 1048576;

@Injectable({
  providedIn: 'root'
})
export class AutoDownloadService {
  private dialog = inject(MatDialog);

  private shouldDownload(node: NodeEntry, threshold: number): boolean {
    const fileSizeInBytes = node?.entry?.content?.sizeInBytes || 0;
    const sizeInMB = fileSizeInBytes / BYTES_TO_MB_CONVERSION_VALUE;

    return sizeInMB && sizeInMB > threshold;
  }

  /**
   * Opens the dialog to download the node content.
   * Determines whether node content should be auto downloaded based on the file size and the configured threshold.
   * @param node node entry
   * @param threshold file size threshold in MB
   */
  tryDownload(node: NodeEntry, threshold: number): boolean {
    if (this.shouldDownload(node, threshold)) {
      this.dialog.open(FileAutoDownloadComponent, { disableClose: true, data: node });
      return true;
    }

    return false;
  }
}
