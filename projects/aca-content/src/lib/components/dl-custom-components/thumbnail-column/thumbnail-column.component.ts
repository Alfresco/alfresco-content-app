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

import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation, inject } from '@angular/core';
import { TranslationService } from '@alfresco/adf-core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  imports: [NgIf, MatIconModule, MatTooltipModule],
  selector: 'aca-custom-thumbnail-column',
  templateUrl: './thumbnail-column.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ThumbnailColumnComponent implements OnChanges {
  private translation = inject(TranslationService);

  @Input()
  context: any;

  public thumbnailUrl?: string;
  public tooltip?: string;

  get isSelected(): boolean {
    return !!this.context.row.isSelected;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.context) {
      const context = changes.context.currentValue;

      if (context) {
        this.thumbnailUrl = this.getThumbnail(context);
        this.tooltip = this.getToolTip(context);
      } else {
        this.thumbnailUrl = null;
        this.tooltip = null;
      }
    }
  }

  private getThumbnail({ data, row, col }): string {
    return data.getValue(row, col);
  }

  private getToolTip({ row }): string {
    const displayName = row.node?.entry?.properties?.['cm:lockOwner']?.displayName;
    return displayName ? `${this.translation.instant('APP.LOCKED_BY')} ${displayName}` : '';
  }
}
