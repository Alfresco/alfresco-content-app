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

import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, OnInit } from '@angular/core';
import { NodeEntry } from '@alfresco/js-api';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [TranslateModule, MatIconModule],
  selector: 'aca-locked-by',
  template: `
    <mat-icon class="aca-locked-by--icon">lock</mat-icon>
    <span class="aca-locked-by--label">{{ 'APP.LOCKED_BY' | translate }}</span>
    <span class="aca-locked-by--name">{{ text }}</span>
  `,
  styleUrls: ['./locked-by.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'aca-locked-by'
  }
})
export class LockedByComponent implements OnInit {
  @Input()
  node: NodeEntry;

  public text: string;

  ngOnInit(): void {
    this.text = this.node?.entry?.properties?.['cm:lockOwner']?.displayName;
  }
}
