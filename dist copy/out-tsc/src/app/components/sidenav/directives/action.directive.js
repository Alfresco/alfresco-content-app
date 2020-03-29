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
import { PRIMARY_OUTLET, Router } from '@angular/router';
import { Store } from '@ngrx/store';
var ActionDirective = /** @class */ (function() {
  function ActionDirective(router, store) {
    this.router = router;
    this.store = store;
  }
  ActionDirective.prototype.onClick = function() {
    if (this.action.route) {
      this.router.navigate(this.getNavigationCommands(this.action.route));
    } else if (this.action.click) {
      this.store.dispatch({
        type: this.action.click.action,
        payload: this.getNavigationCommands(this.action.click.payload)
      });
    }
  };
  ActionDirective.prototype.getNavigationCommands = function(url) {
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
    ActionDirective.prototype,
    'action',
    void 0
  );
  tslib_1.__decorate(
    [
      HostListener('click'),
      tslib_1.__metadata('design:type', Function),
      tslib_1.__metadata('design:paramtypes', []),
      tslib_1.__metadata('design:returntype', void 0)
    ],
    ActionDirective.prototype,
    'onClick',
    null
  );
  ActionDirective = tslib_1.__decorate(
    [
      Directive({
        /* tslint:disable-next-line */
        selector: '[action]',
        exportAs: 'action'
      }),
      tslib_1.__metadata('design:paramtypes', [Router, Store])
    ],
    ActionDirective
  );
  return ActionDirective;
})();
export { ActionDirective };
//# sourceMappingURL=action.directive.js.map
