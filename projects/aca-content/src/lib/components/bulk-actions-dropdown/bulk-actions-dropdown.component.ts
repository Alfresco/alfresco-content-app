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

import { ContentActionRef } from '@alfresco/adf-extensions';
import { AppStore, getSearchItemsTotalCount } from '@alfresco/aca-shared/store';
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { IconComponent, TranslationService } from '@alfresco/adf-core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'aca-bulk-actions-dropdown',
  templateUrl: './bulk-actions-dropdown.component.html',
  styleUrls: ['./bulk-actions-dropdown.component.scss'],
  imports: [CommonModule, TranslateModule, MatSelectModule, IconComponent, ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None
})
export class BulkActionsDropdownComponent implements OnInit, OnDestroy {
  @Input() items: ContentActionRef[];

  placeholder: string;
  tooltip: string;
  totalItems$: Observable<number> = this.store.select(getSearchItemsTotalCount);
  selectControl = new FormControl();

  private onDestroy$ = new Subject();

  constructor(private store: Store<AppStore>, private translationService: TranslationService) {}

  ngOnInit() {
    this.totalItems$
      .pipe(
        switchMap((totalItems) => {
          if (totalItems > 0) {
            this.selectControl.enable();

            return combineLatest([
              this.translationService.get('SEARCH.BULK_ACTIONS_DROPDOWN.TITLE', { count: totalItems }),
              this.translationService.get('SEARCH.BULK_ACTIONS_DROPDOWN.TITLE', { count: totalItems })
            ]);
          } else {
            this.selectControl.disable();

            return combineLatest([
              this.translationService.get('SEARCH.BULK_ACTIONS_DROPDOWN.BULK_NOT_AVAILABLE'),
              this.translationService.get('SEARCH.BULK_ACTIONS_DROPDOWN.BULK_NOT_AVAILABLE_TOOLTIP')
            ]);
          }
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe(([placeholder, title]) => {
        this.tooltip = title;
        this.placeholder = placeholder;
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
