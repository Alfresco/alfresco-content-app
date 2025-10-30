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

import { Component, DestroyRef, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DynamicExtensionComponent, NavBarGroupRef, NavBarLinkRef } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { AppStore, getSideNavState } from '@alfresco/aca-shared/store';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AppExtensionService, AppService, NavigationHistoryService } from '@alfresco/aca-shared';
import { SidenavLayoutComponent } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { SidenavHeaderComponent } from './components/sidenav-header.component';
import { MatListModule } from '@angular/material/list';
import { ExpandMenuComponent } from './components/expand-menu.component';
import { NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [CommonModule, SidenavHeaderComponent, MatListModule, ExpandMenuComponent, DynamicExtensionComponent, TranslatePipe],
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-sidenav' }
})
export class SidenavComponent implements OnInit {
  @Input()
  data: {
    layout?: SidenavLayoutComponent;
    mode?: 'collapsed' | 'expanded';
  } = {};

  groups: Array<NavBarGroupRef> = [];

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private store: Store<AppStore>,
    private extensions: AppExtensionService,
    private appService: AppService,
    private navigationHistoryService: NavigationHistoryService
  ) {}

  ngOnInit() {
    this.store
      .select(getSideNavState)
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.groups = this.extensions.getApplicationNavigation(this.extensions.navbar);
      });

    this.appService.setAppNavbarMode(this.data.mode);
    this.appService.toggleAppNavBar$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.toggleNavBar());
    this.data.layout.expanded.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.setNavBarMode());
    this.navigationHistoryService
      .listenToRouteChanges()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event: NavigationEnd) => {
        this.navigationHistoryService.setHistory(event);
      });
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

  private setNavBarMode() {
    this.appService.setAppNavbarMode(this.data.layout.isMenuMinimized || this.data.layout.isHeaderInside ? 'collapsed' : 'expanded');
  }

  private toggleNavBar() {
    this.data.layout.toggleMenu();
    this.setNavBarMode();
  }
}
