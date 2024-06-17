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

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { SearchNavigationService } from '../search-navigation.service';
import { CommonModule } from '@angular/common';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule],
  selector: 'aca-toggle-search',
  template: `<mat-slide-toggle *ngIf="showToggle" [labelPosition]="'before'" [checked]="checked" (change)="toggleSearch($event)"
    >Use AI</mat-slide-toggle
  >`,
  styleUrls: ['./toggle-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-toggle-search' }
})
export class ToggleSearchComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  checked: boolean;
  showToggle: boolean;

  constructor(private searchNavigationService: SearchNavigationService, private router: Router, activatedRoute: ActivatedRoute) {
    this.checked = this.router.url.includes('/search-ai');
    activatedRoute.queryParams.pipe(takeUntil(this.onDestroy$)).subscribe((params) => {
      this.showToggle = !params['hideAiToggle'];
    });
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(this.onDestroy$)
      )
      .subscribe((event: NavigationStart) => {
        this.checked = event.url.includes('/search-ai');
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  toggleSearch(event: MatSlideToggleChange) {
    if (event.checked) {
      this.searchNavigationService.navigateToSearchAi();
    } else if (this.searchNavigationService.hasAiSearchResults) {
      this.searchNavigationService.openConfirmDialog().subscribe((confirm) => {
        if (confirm) {
          this.searchNavigationService.navigateToSearch();
        } else {
          event.source.checked = true;
        }
      });
    } else {
      this.searchNavigationService.navigateToSearch();
    }
  }
}
