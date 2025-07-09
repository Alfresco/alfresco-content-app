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

import { Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_COMPONENT_DATA, IconComponent, LocalizedDatePipe, TimeAgoPipe } from '@alfresco/adf-core';
import { Node, SizeDetails } from '@alfresco/js-api';
import { MatDividerModule } from '@angular/material/divider';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ContentService, NodesApiService } from '@alfresco/adf-content-services';
import { catchError, concatMap, delay, expand, first, switchMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, of, timer } from 'rxjs';

const MEMORY_UNIT_LIST = ['bytes', 'KB', 'MB', 'GB', 'TB'];

class FolderDetails {
  name: string;
  size: string;
  location: string;
  created: Date;
  modified: Date;
  icon: string;
  numberOfFiles: string | number;
}

@Component({
  selector: 'app-folder-info',
  imports: [CommonModule, MatDividerModule, TimeAgoPipe, TranslatePipe, LocalizedDatePipe, IconComponent],
  templateUrl: './folder-information.component.html',
  styleUrls: ['./folder-information.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-folder-info' }
})
export class FolderInformationComponent implements OnInit {
  readonly contentService = inject(ContentService);
  readonly nodesService = inject(NodesApiService);
  readonly translateService = inject(TranslateService);

  private readonly destroyRef = inject(DestroyRef);

  data: Node = inject(DIALOG_COMPONENT_DATA);
  folderDetails = new FolderDetails();

  ngOnInit() {
    this.folderDetails.name = this.data.name;
    this.folderDetails.location = this.data.path.name;
    this.folderDetails.created = this.data.createdAt;
    this.folderDetails.modified = this.data.modifiedAt;
    this.folderDetails.icon = this.contentService.getNodeIcon(this.data);
    this.folderDetails.size = this.translateService.instant('APP.FOLDER_INFO.CALCULATING');
    this.folderDetails.numberOfFiles = this.translateService.instant('APP.FOLDER_INFO.CALCULATING');

    this.nodesService
      .initiateFolderSizeCalculation(this.data.id)
      .pipe(
        first(),
        delay(1000),
        switchMap((jobIdEntry) => {
          return this.nodesService.getFolderSizeInfo(this.data.id, jobIdEntry.entry.jobId).pipe(
            expand((result) =>
              result.entry.status === SizeDetails.StatusEnum.IN_PROGRESS
                ? timer(5000).pipe(concatMap(() => this.nodesService.getFolderSizeInfo(this.data.id, jobIdEntry.entry.jobId)))
                : EMPTY
            ),
            catchError(() => {
              this.folderDetails.size = this.translateService.instant('APP.FOLDER_INFO.ERROR');
              return of(null);
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef),
        catchError(() => {
          this.folderDetails.numberOfFiles = this.translateService.instant('APP.FOLDER_INFO.ERROR');
          this.folderDetails.size = this.translateService.instant('APP.FOLDER_INFO.ERROR');
          return of(null);
        })
      )
      .subscribe((folderInfo) => {
        if (folderInfo?.entry?.status === SizeDetails.StatusEnum.COMPLETE) {
          let size = parseFloat(folderInfo.entry.sizeInBytes);
          let unitIndex = 0;
          let isMoreThanBytes = false;
          while (size > 1000) {
            isMoreThanBytes = true;
            size = size / 1000;
            unitIndex++;
          }
          const params = {
            sizeInBytes: parseFloat(folderInfo.entry.sizeInBytes).toLocaleString('en'),
            sizeInLargeUnit: size.toFixed(2),
            unit: MEMORY_UNIT_LIST[unitIndex]
          };
          this.folderDetails.size = this.translateService.instant(
            isMoreThanBytes ? 'APP.FOLDER_INFO.CALCULATED_SIZE_LARGE' : 'APP.FOLDER_INFO.CALCULATED_SIZE_NORMAL',
            params
          );
          this.folderDetails.numberOfFiles = folderInfo.entry.numberOfFiles;
        } else if (folderInfo?.entry?.status !== SizeDetails.StatusEnum.IN_PROGRESS) {
          this.folderDetails.size = this.translateService.instant('APP.FOLDER_INFO.ERROR');
          this.folderDetails.numberOfFiles = this.translateService.instant('APP.FOLDER_INFO.ERROR');
        }
      });
  }
}
