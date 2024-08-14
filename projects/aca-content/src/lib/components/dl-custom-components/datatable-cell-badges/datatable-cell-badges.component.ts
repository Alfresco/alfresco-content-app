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

import { AppExtensionService, Badge } from '@alfresco/aca-shared';
import { IconComponent } from '@alfresco/adf-core';
import { DynamicExtensionComponent } from '@alfresco/adf-extensions';
import { NodeEntry } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'aca-datatable-cell-badges',
  templateUrl: './datatable-cell-badges.component.html',
  styleUrls: ['./datatable-cell-badges.component.scss'],
  host: { class: 'aca-datatable-cell-badges' },
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, TranslateModule, DynamicExtensionComponent, IconComponent],
  standalone: true
})
export class DatatableCellBadgesComponent implements OnInit, OnDestroy {
  @Input() node: NodeEntry;

  badges: Badge[];

  private onDestroy$ = new Subject<boolean>();

  constructor(private appExtensionService: AppExtensionService) {}

  ngOnInit() {
    this.appExtensionService
      .getBadges(this.node)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((badges) => {
        this.badges = badges;
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onBadgeClick(badge: Badge) {
    if (badge.actions?.click) {
      this.appExtensionService.runActionById(badge.actions?.click, this.node);
    }
  }

  onKeyPress(badge: Badge) {
    this.onBadgeClick(badge);
  }
}
