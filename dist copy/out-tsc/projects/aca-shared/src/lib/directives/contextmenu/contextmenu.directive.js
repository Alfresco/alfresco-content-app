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
import { Directive, HostListener, Input } from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { ContextMenu } from '@alfresco/aca-shared/store';
var ContextActionsDirective = /** @class */ (function() {
  function ContextActionsDirective(store) {
    this.store = store;
    this.execute$ = new Subject();
    this.onDestroy$ = new Subject();
    // tslint:disable-next-line:no-input-rename
    this.enabled = true;
  }
  ContextActionsDirective.prototype.onContextMenuEvent = function(event) {
    if (event) {
      event.preventDefault();
      if (this.enabled) {
        var target = this.getTarget(event);
        if (target) {
          this.execute(event, target);
        }
      }
    }
  };
  ContextActionsDirective.prototype.ngOnInit = function() {
    var _this = this;
    this.execute$
      .pipe(
        debounceTime(300),
        takeUntil(this.onDestroy$)
      )
      .subscribe(function(event) {
        _this.store.dispatch(new ContextMenu(event));
      });
  };
  ContextActionsDirective.prototype.ngOnDestroy = function() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  };
  ContextActionsDirective.prototype.execute = function(event, target) {
    if (!this.isSelected(target)) {
      target.dispatchEvent(new MouseEvent('click'));
    }
    this.execute$.next(event);
  };
  ContextActionsDirective.prototype.getTarget = function(event) {
    return this.findAncestor(event.target, 'adf-datatable-cell');
  };
  ContextActionsDirective.prototype.isSelected = function(target) {
    if (!target) {
      return false;
    }
    return this.findAncestor(target, 'adf-datatable-row').classList.contains(
      'adf-is-selected'
    );
  };
  ContextActionsDirective.prototype.findAncestor = function(el, className) {
    if (el.classList.contains(className)) {
      return el;
    }
    // tslint:disable-next-line:curly
    while ((el = el.parentElement) && !el.classList.contains(className));
    return el;
  };
  tslib_1.__decorate(
    [Input('acaContextEnable'), tslib_1.__metadata('design:type', Object)],
    ContextActionsDirective.prototype,
    'enabled',
    void 0
  );
  tslib_1.__decorate(
    [
      HostListener('contextmenu', ['$event']),
      tslib_1.__metadata('design:type', Function),
      tslib_1.__metadata('design:paramtypes', [MouseEvent]),
      tslib_1.__metadata('design:returntype', void 0)
    ],
    ContextActionsDirective.prototype,
    'onContextMenuEvent',
    null
  );
  ContextActionsDirective = tslib_1.__decorate(
    [
      Directive({
        selector: '[acaContextActions]',
        exportAs: 'acaContextActions'
      }),
      tslib_1.__metadata('design:paramtypes', [Store])
    ],
    ContextActionsDirective
  );
  return ContextActionsDirective;
})();
export { ContextActionsDirective };
//# sourceMappingURL=contextmenu.directive.js.map
