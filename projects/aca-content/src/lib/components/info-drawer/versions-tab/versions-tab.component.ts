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

import { Component, inject, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { VersionManagerModule } from '@alfresco/adf-content-services';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AppSettingsService } from '@alfresco/aca-shared';

@Component({
  standalone: true,
  imports: [CommonModule, VersionManagerModule, MatIconModule, TranslateModule],
  selector: 'app-versions-tab',
  template: `
    <ng-container *ngIf="isFileSelected; else empty">
      <adf-version-manager [showComments]="settings.uploadAllowComments" [allowDownload]="settings.uploadAllowDownload" [node]="node">
      </adf-version-manager>
    </ng-container>

    <ng-template #empty>
      <div class="adf-manage-versions-empty">
        <mat-icon class="adf-manage-versions-empty-icon">face</mat-icon>
        {{ 'VERSION.SELECTION.EMPTY' | translate }}
      </div>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None
})
export class VersionsTabComponent implements OnInit, OnChanges {
  settings = inject(AppSettingsService);

  @Input()
  node: Node;

  isFileSelected = false;

  ngOnInit() {
    this.updateState();
  }

  ngOnChanges() {
    this.updateState();
  }

  private updateState() {
    if (this.node && (this.node as any).nodeId) {
      // workaround for shared files type.
      this.isFileSelected = true;
    } else {
      this.isFileSelected = this.node.isFile;
    }
  }
}
