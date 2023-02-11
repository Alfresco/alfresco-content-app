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

import { Component, Input, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { NavBarGroupRef, NavBarLinkRef } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { AppStore, getSideNavState } from '@alfresco/aca-shared/store';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { AppExtensionService, AppService } from '@alfresco/aca-shared';
import { SidenavLayoutComponent } from '@alfresco/adf-core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-sidenav' }
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Input()
  data: {
    layout?: SidenavLayoutComponent;
    mode?: 'collapsed' | 'expanded';
  } = {};

  groups: Array<NavBarGroupRef> = [];
  private onDestroy$ = new Subject<boolean>();

  constructor(private store: Store<AppStore>, private extensions: AppExtensionService, private appService: AppService) {}

  ngOnInit() {
    this.store
      .select(getSideNavState)
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.groups = this.extensions.getApplicationNavigation(this.extensions.navbar);
      });

    this.appService.appNavNarMode$.next(this.data.mode);
    this.appService.toggleAppNavBar$.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.toggleNavBar());
  }

  trackByGroupId(_: number, obj: NavBarGroupRef): string {
    return obj.id;
  }

  trackByLinkId(_: number, obj: NavBarLinkRef): string {
    return obj.id;
  }

  toggleClick() {
    this.toggleNavBar();
  }

  private toggleNavBar() {
    this.data.layout.toggleMenu();
    this.appService.appNavNarMode$.next(this.data.layout.isMenuMinimized ? 'collapsed' : 'expanded');
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
