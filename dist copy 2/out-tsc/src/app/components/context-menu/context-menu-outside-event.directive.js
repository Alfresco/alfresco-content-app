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
import { Directive, Output, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
var OutsideEventDirective = /** @class */ (function() {
  function OutsideEventDirective() {
    this.subscriptions = [];
    this.clickOutside = new EventEmitter();
  }
  OutsideEventDirective.prototype.ngOnInit = function() {
    var _this = this;
    this.subscriptions = this.subscriptions.concat([
      fromEvent(document.body, 'click')
        .pipe(
          filter(function(event) {
            return !_this.findAncestor(event.target);
          })
        )
        .subscribe(function() {
          return _this.clickOutside.next();
        })
    ]);
  };
  OutsideEventDirective.prototype.ngOnDestroy = function() {
    this.subscriptions.forEach(function(subscription) {
      return subscription.unsubscribe();
    });
    this.subscriptions = [];
  };
  OutsideEventDirective.prototype.findAncestor = function(el) {
    var className = 'aca-context-menu';
    if (el.classList.contains(className)) {
      return true;
    }
    // tslint:disable-next-line:curly
    while ((el = el.parentElement) && !el.classList.contains(className));
    return !!el;
  };
  tslib_1.__decorate(
    [Output(), tslib_1.__metadata('design:type', EventEmitter)],
    OutsideEventDirective.prototype,
    'clickOutside',
    void 0
  );
  OutsideEventDirective = tslib_1.__decorate(
    [
      Directive({
        selector: '[acaContextMenuOutsideEvent]'
      }),
      tslib_1.__metadata('design:paramtypes', [])
    ],
    OutsideEventDirective
  );
  return OutsideEventDirective;
})();
export { OutsideEventDirective };
//# sourceMappingURL=context-menu-outside-event.directive.js.map
