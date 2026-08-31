/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NodeEntry } from '@alfresco/js-api';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'aca-lock-icon',
  standalone: true,
  template: `<mat-icon class="adf-datatable-cell-badge" [title]="tooltip" aria-hidden="true">lock</mat-icon>`,
  imports: [MatIconModule],
  encapsulation: ViewEncapsulation.None
})
export class LockIconComponent implements OnInit {
  private readonly translate = inject(TranslateService);

  @Input()
  data: { node: NodeEntry };

  tooltip: string;

  ngOnInit() {
    const entry = this.data?.node?.entry;
    const aspectNames = entry?.aspectNames ?? [];
    const props = entry?.properties ?? {};

    // cspell:ignore workingcopy
    const isWorkingCopy = aspectNames.includes('cm:workingcopy');
    const ownerProp = isWorkingCopy ? props['cm:workingCopyOwner'] : props['cm:lockOwner'];
    const key = isWorkingCopy ? 'APP.TOOLTIPS.WORKING_COPY_BADGE' : 'APP.TOOLTIPS.LOCK_BADGE';
    this.tooltip = this.translate.instant(key, { owner: ownerProp?.displayName ?? ownerProp?.id ?? '' });
  }
}
