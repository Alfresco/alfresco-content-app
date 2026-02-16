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
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { DIALOG_COMPONENT_DATA, LocalizedDatePipe, TimeAgoPipe, IconComponent, FileSizePipe, TranslationService } from '@alfresco/adf-core';
import { Node, SizeDetails } from '@alfresco/js-api';
import { MatDividerModule } from '@angular/material/divider';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ContentService, NodesApiService } from '@alfresco/adf-content-services';
import { catchError, concatMap, delay, expand, first, switchMap, take } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, of, timer } from 'rxjs';

class NodeDetails {
  name: string;
  size: string;
  location: string;
  secondaryParentsPaths: string[];
  created: Date;
  modified: Date;
  icon: string;
  numberOfFiles: string | number;
}

@Component({
  selector: 'app-node-info',
  imports: [CommonModule, MatDividerModule, TimeAgoPipe, TranslatePipe, LocalizedDatePipe, IconComponent, NgOptimizedImage],
  templateUrl: './node-information.component.html',
  styleUrls: ['./node-information.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-node-info' }
})
export class NodeInformationComponent implements OnInit {
  readonly contentService = inject(ContentService);
  readonly nodesService = inject(NodesApiService);
  readonly translateService = inject(TranslateService);
  readonly translationService = inject(TranslationService);

  private readonly destroyRef = inject(DestroyRef);
  private readonly fileSizePipe = new FileSizePipe(this.translationService);

  node: Node = inject(DIALOG_COMPONENT_DATA);
  nodeDetails = new NodeDetails();

  ngOnInit() {
    this.nodeDetails.name = this.node.name;
    this.nodeDetails.location = this.node.path.name;
    this.nodeDetails.created = this.node.createdAt;
    this.nodeDetails.modified = this.node.modifiedAt;
    this.nodeDetails.icon = this.contentService.getNodeIcon(this.node);
    this.nodesService
      .listParents(this.node.id, { where: `(isPrimary=false and assocType='cm:contains')`, include: ['path'] })
      .pipe(
        take(1),
        catchError(() => of(null))
      )
      .subscribe((parents) => {
        this.nodeDetails.secondaryParentsPaths = parents != null ? parents.list.entries.map((entry) => entry.entry.path.name) : [];
      });
    if (this.node.isFolder) {
      this.nodeDetails.size = this.translateService.instant('APP.NODE_INFO.CALCULATING');
      this.nodeDetails.numberOfFiles = this.translateService.instant('APP.NODE_INFO.CALCULATING');
      this.nodesService
        .initiateFolderSizeCalculation(this.node.id)
        .pipe(
          first(),
          delay(1000),
          switchMap((jobIdEntry) => {
            return this.nodesService.getFolderSizeInfo(this.node.id, jobIdEntry.entry.jobId).pipe(
              expand((result) =>
                result.entry.status === SizeDetails.StatusEnum.IN_PROGRESS
                  ? timer(5000).pipe(concatMap(() => this.nodesService.getFolderSizeInfo(this.node.id, jobIdEntry.entry.jobId)))
                  : EMPTY
              ),
              catchError(() => {
                this.nodeDetails.size = this.translateService.instant('APP.NODE_INFO.ERROR');
                return of(null);
              })
            );
          }),
          takeUntilDestroyed(this.destroyRef),
          catchError(() => {
            this.nodeDetails.numberOfFiles = this.translateService.instant('APP.NODE_INFO.ERROR');
            this.nodeDetails.size = this.translateService.instant('APP.NODE_INFO.ERROR');
            return of(null);
          })
        )
        .subscribe((folderInfo) => {
          if (folderInfo?.entry?.status === SizeDetails.StatusEnum.COMPLETE) {
            this.nodeDetails.size = this.fileSizePipe.transform(folderInfo.entry.sizeInBytes);
            this.nodeDetails.numberOfFiles = folderInfo.entry.numberOfFiles;
          } else if (folderInfo?.entry?.status !== SizeDetails.StatusEnum.IN_PROGRESS) {
            this.nodeDetails.size = this.translateService.instant('APP.NODE_INFO.ERROR');
            this.nodeDetails.numberOfFiles = this.translateService.instant('APP.NODE_INFO.ERROR');
          }
        });
    } else {
      this.nodeDetails.size = this.fileSizePipe.transform(this.node.content.sizeInBytes);
    }
  }
}
