/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { LogService } from '../../services/log.service';
import { DownloadZipService } from '../../services/download-zip.service';
export declare class DownloadZipDialogComponent implements OnInit {
  private dialogRef;
  data: any;
  private logService;
  private downloadZipService;
  cancelled: boolean;
  downloadId: string;
  constructor(
    dialogRef: MatDialogRef<DownloadZipDialogComponent>,
    data: any,
    logService: LogService,
    downloadZipService: DownloadZipService
  );
  ngOnInit(): void;
  cancelDownload(): void;
  downloadZip(nodeIds: string[]): void;
  waitAndDownload(downloadId: string, url: string, fileName: string): void;
  download(url: string, fileName: string): void;
}
