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
  Directive,
  Input,
  ElementRef,
  Renderer2,
  ContentChildren,
  QueryList
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActionDirective } from './action.directive';
var ActiveLinkDirective = /** @class */ (function() {
  function ActiveLinkDirective(router, element, renderer) {
    this.router = router;
    this.element = element;
    this.renderer = renderer;
    this.isLinkActive = false;
    this.onDestroy$ = new Subject();
  }
  ActiveLinkDirective.prototype.ngOnInit = function() {
    var _this = this;
    this.router.events
      .pipe(
        filter(function(event) {
          return event instanceof NavigationEnd;
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe(function(event) {
        _this.update(event.urlAfterRedirects);
      });
  };
  ActiveLinkDirective.prototype.update = function(url) {
    var _this = this;
    this.links.map(function(item) {
      var itemUrl = _this.resolveUrl(item);
      if (url && url.substring(1).startsWith(itemUrl)) {
        _this.isLinkActive = true;
        _this.renderer.addClass(
          _this.element.nativeElement,
          _this.acaActiveLink
        );
      } else {
        _this.isLinkActive = false;
        _this.renderer.removeClass(
          _this.element.nativeElement,
          _this.acaActiveLink
        );
      }
    });
  };
  ActiveLinkDirective.prototype.ngAfterContentInit = function() {
    var _this = this;
    this.links.changes.subscribe(function() {
      return _this.update(_this.router.url);
    });
    this.update(this.router.url);
  };
  ActiveLinkDirective.prototype.resolveUrl = function(item) {
    return (
      (item.action && (item.action.click && item.action.click.payload)) ||
      item.action.route
    );
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    ActiveLinkDirective.prototype,
    'acaActiveLink',
    void 0
  );
  tslib_1.__decorate(
    [
      ContentChildren(ActionDirective, { descendants: true }),
      tslib_1.__metadata('design:type', QueryList)
    ],
    ActiveLinkDirective.prototype,
    'links',
    void 0
  );
  ActiveLinkDirective = tslib_1.__decorate(
    [
      Directive({
        selector: '[acaActiveLink]',
        exportAs: 'acaActiveLink'
      }),
      tslib_1.__metadata('design:paramtypes', [Router, ElementRef, Renderer2])
    ],
    ActiveLinkDirective
  );
  return ActiveLinkDirective;
})();
export { ActiveLinkDirective };
//# sourceMappingURL=active-link.directive.js.map
