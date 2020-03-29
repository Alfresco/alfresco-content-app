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
import * as tslib_1 from 'tslib';
import {
  AppConfigService,
  SidenavLayoutComponent,
  UserPreferencesService
} from '@alfresco/adf-core';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, NavigationStart } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil, map, withLatestFrom } from 'rxjs/operators';
import { NodePermissionService } from '@alfresco/aca-shared';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  getCurrentFolder,
  ResetSelectionAction
} from '@alfresco/aca-shared/store';
var AppLayoutComponent = /** @class */ (function() {
  function AppLayoutComponent(
    store,
    permission,
    router,
    userPreferenceService,
    appConfigService,
    breakpointObserver
  ) {
    this.store = store;
    this.permission = permission;
    this.router = router;
    this.userPreferenceService = userPreferenceService;
    this.appConfigService = appConfigService;
    this.breakpointObserver = breakpointObserver;
    this.onDestroy$ = new Subject();
    this.canUpload = false;
    this.minimizeSidenav = false;
    this.hideSidenav = false;
    this.minimizeConditions = ['search'];
    this.hideConditions = ['/preview/'];
  }
  AppLayoutComponent.prototype.ngOnInit = function() {
    var _this = this;
    this.isSmallScreen$ = this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .pipe(
        map(function(result) {
          return result.matches;
        })
      );
    this.hideSidenav = this.hideConditions.some(function(el) {
      return _this.router.routerState.snapshot.url.includes(el);
    });
    this.minimizeSidenav = this.minimizeConditions.some(function(el) {
      return _this.router.routerState.snapshot.url.includes(el);
    });
    if (!this.minimizeSidenav) {
      this.expandedSidenav = this.getSidenavState();
    } else {
      this.expandedSidenav = false;
    }
    this.store
      .select(getCurrentFolder)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(function(node) {
        _this.currentFolderId = node ? node.id : null;
        _this.canUpload = node && _this.permission.check(node, ['create']);
      });
    this.router.events
      .pipe(
        withLatestFrom(this.isSmallScreen$),
        filter(function(_a) {
          var event = _a[0],
            isSmallScreen = _a[1];
          return isSmallScreen && event instanceof NavigationEnd;
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe(function() {
        _this.layout.container.sidenav.close();
      });
    this.router.events
      .pipe(
        filter(function(event) {
          return event instanceof NavigationEnd;
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe(function(event) {
        _this.minimizeSidenav = _this.minimizeConditions.some(function(el) {
          return event.urlAfterRedirects.includes(el);
        });
        _this.hideSidenav = _this.hideConditions.some(function(el) {
          return event.urlAfterRedirects.includes(el);
        });
        _this.updateState();
      });
    this.router.events
      .pipe(
        filter(function(event) {
          return event instanceof NavigationStart;
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe(function() {
        _this.store.dispatch(new ResetSelectionAction());
      });
  };
  AppLayoutComponent.prototype.ngOnDestroy = function() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  };
  AppLayoutComponent.prototype.hideMenu = function(event) {
    if (this.layout.container.isMobileScreenSize) {
      event.preventDefault();
      this.layout.container.toggleMenu();
    }
  };
  AppLayoutComponent.prototype.updateState = function() {
    if (this.minimizeSidenav && !this.layout.isMenuMinimized) {
      this.layout.isMenuMinimized = true;
      if (!this.layout.container.isMobileScreenSize) {
        this.layout.container.toggleMenu();
      }
    }
    if (!this.minimizeSidenav) {
      if (this.getSidenavState() && this.layout.isMenuMinimized) {
        this.layout.isMenuMinimized = false;
        this.layout.container.toggleMenu();
      }
    }
  };
  AppLayoutComponent.prototype.onExpanded = function(state) {
    if (
      !this.minimizeSidenav &&
      this.appConfigService.get('sideNav.preserveState')
    ) {
      this.userPreferenceService.set('expandedSidenav', state);
    }
  };
  AppLayoutComponent.prototype.getSidenavState = function() {
    var expand = this.appConfigService.get('sideNav.expandedSidenav', true);
    var preserveState = this.appConfigService.get(
      'sideNav.preserveState',
      true
    );
    if (preserveState) {
      return (
        this.userPreferenceService.get('expandedSidenav', expand.toString()) ===
        'true'
      );
    }
    return expand;
  };
  tslib_1.__decorate(
    [
      ViewChild('layout'),
      tslib_1.__metadata('design:type', SidenavLayoutComponent)
    ],
    AppLayoutComponent.prototype,
    'layout',
    void 0
  );
  AppLayoutComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-layout',
        templateUrl: './app-layout.component.html',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-layout' }
      }),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        NodePermissionService,
        Router,
        UserPreferencesService,
        AppConfigService,
        BreakpointObserver
      ])
    ],
    AppLayoutComponent
  );
  return AppLayoutComponent;
})();
export { AppLayoutComponent };
//# sourceMappingURL=app-layout.component.js.map
