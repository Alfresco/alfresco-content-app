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
import { Directive, Input, HostListener } from '@angular/core';
import { Router, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Store } from '@ngrx/store';
var ExpansionPanelDirective = /** @class */ (function() {
  function ExpansionPanelDirective(store, router, expansionPanel) {
    this.store = store;
    this.router = router;
    this.expansionPanel = expansionPanel;
    this.hasActiveChildren = false;
    this.onDestroy$ = new Subject();
  }
  ExpansionPanelDirective.prototype.onClick = function() {
    if (this.expansionPanel.expanded && !this.hasActiveLinks()) {
      var firstChild = this.acaExpansionPanel.children[0];
      if (firstChild.url) {
        this.router.navigate(this.getNavigationCommands(firstChild.url));
      } else {
        this.store.dispatch({
          type: firstChild.action.action,
          payload: this.getNavigationCommands(firstChild.action.payload)
        });
      }
    }
  };
  ExpansionPanelDirective.prototype.hasActiveLinks = function() {
    var _this = this;
    if (this.acaExpansionPanel && this.acaExpansionPanel.children) {
      return this.acaExpansionPanel.children.some(function(child) {
        return _this.router.url.startsWith(child.url || child.action.payload);
      });
    }
    return false;
  };
  ExpansionPanelDirective.prototype.ngOnInit = function() {
    var _this = this;
    this.hasActiveChildren = this.hasActiveLinks();
    this.router.events
      .pipe(
        filter(function(event) {
          return event instanceof NavigationEnd;
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe(function() {
        _this.hasActiveChildren = _this.hasActiveLinks();
      });
  };
  ExpansionPanelDirective.prototype.ngOnDestroy = function() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  };
  ExpansionPanelDirective.prototype.getNavigationCommands = function(url) {
    var urlTree = this.router.parseUrl(url);
    var urlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    if (!urlSegmentGroup) {
      return [url];
    }
    var urlSegments = urlSegmentGroup.segments;
    return urlSegments.reduce(function(acc, item) {
      acc.push(item.path, item.parameters);
      return acc;
    }, []);
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    ExpansionPanelDirective.prototype,
    'acaExpansionPanel',
    void 0
  );
  tslib_1.__decorate(
    [
      HostListener('click'),
      tslib_1.__metadata('design:type', Function),
      tslib_1.__metadata('design:paramtypes', []),
      tslib_1.__metadata('design:returntype', void 0)
    ],
    ExpansionPanelDirective.prototype,
    'onClick',
    null
  );
  ExpansionPanelDirective = tslib_1.__decorate(
    [
      Directive({
        selector: '[acaExpansionPanel]',
        exportAs: 'acaExpansionPanel'
      }),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        Router,
        MatExpansionPanel
      ])
    ],
    ExpansionPanelDirective
  );
  return ExpansionPanelDirective;
})();
export { ExpansionPanelDirective };
//# sourceMappingURL=expansion-panel.directive.js.map
