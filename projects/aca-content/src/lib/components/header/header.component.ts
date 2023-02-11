/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, ViewEncapsulation, Output, EventEmitter, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { AppStore, getHeaderColor, getAppName, getLogoPath } from '@alfresco/aca-shared/store';
import { AppExtensionService } from '@alfresco/aca-shared';
import { takeUntil } from 'rxjs/operators';
import { AppConfigService, SidenavLayoutComponent } from '@alfresco/adf-core';
import { isContentServiceEnabled } from '@alfresco/aca-shared/rules';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-header' }
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<boolean> = new Subject<boolean>();

  @Output()
  toggleClicked = new EventEmitter();

  @Input() expandedSidenav = true;

  @Input() data: { layout?: SidenavLayoutComponent; isMenuMinimized?: boolean } = {};

  get isSidenavExpanded(): boolean {
    return !this.data.isMenuMinimized ?? this.expandedSidenav;
  }

  appName$: Observable<string>;
  headerColor$: Observable<any>;
  logo$: Observable<string>;
  landingPage: string;

  actions: Array<ContentActionRef> = [];

  constructor(public store: Store<AppStore>, private appExtensions: AppExtensionService, private appConfigService: AppConfigService) {
    this.headerColor$ = store.select(getHeaderColor);
    this.appName$ = store.select(getAppName);
    this.logo$ = store.select(getLogoPath);
    this.landingPage = this.appConfigService.get('landingPage', '/personal-files');
  }

  ngOnInit() {
    this.appExtensions
      .getHeaderActions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((actions) => {
        this.actions = actions;
      });
  }

  onToggleSidenav(_event: boolean): void {
    this.data.layout.toggleMenu();
  }

  isContentServiceEnabled(): boolean {
    return isContentServiceEnabled();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  trackByActionId(_: number, action: ContentActionRef) {
    return action.id;
  }
}
