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
  Component,
  ViewEncapsulation,
  HostListener,
  ViewChild,
  Inject
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { AppExtensionService } from '../../extensions/extension.service';
import { getAppSelection } from '@alfresco/aca-shared/store';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { CONTEXT_MENU_DIRECTION } from './direction.token';
import { Directionality } from '@angular/cdk/bidi';
var ContextMenuComponent = /** @class */ (function() {
  function ContextMenuComponent(
    contextMenuOverlayRef,
    extensions,
    store,
    direction
  ) {
    this.contextMenuOverlayRef = contextMenuOverlayRef;
    this.extensions = extensions;
    this.store = store;
    this.direction = direction;
    this.onDestroy$ = new Subject();
    this.actions = [];
  }
  ContextMenuComponent.prototype.handleKeydownEscape = function(event) {
    if (event) {
      if (this.contextMenuOverlayRef) {
        this.contextMenuOverlayRef.close();
      }
    }
  };
  ContextMenuComponent.prototype.onClickOutsideEvent = function() {
    if (this.contextMenuOverlayRef) {
      this.contextMenuOverlayRef.close();
    }
  };
  ContextMenuComponent.prototype.runAction = function(actionId) {
    this.extensions.runActionById(actionId);
  };
  ContextMenuComponent.prototype.ngOnDestroy = function() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  };
  ContextMenuComponent.prototype.ngOnInit = function() {
    var _this = this;
    this.store
      .select(getAppSelection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(function(selection) {
        if (selection.count) {
          _this.actions = _this.extensions.getAllowedContextMenuActions();
        }
      });
  };
  ContextMenuComponent.prototype.ngAfterViewInit = function() {
    var _this = this;
    setTimeout(function() {
      return _this.trigger.openMenu();
    }, 0);
  };
  ContextMenuComponent.prototype.trackById = function(_, obj) {
    return obj.id;
  };
  tslib_1.__decorate(
    [
      ViewChild(MatMenuTrigger),
      tslib_1.__metadata('design:type', MatMenuTrigger)
    ],
    ContextMenuComponent.prototype,
    'trigger',
    void 0
  );
  tslib_1.__decorate(
    [
      HostListener('document:keydown.Escape', ['$event']),
      tslib_1.__metadata('design:type', Function),
      tslib_1.__metadata('design:paramtypes', [KeyboardEvent]),
      tslib_1.__metadata('design:returntype', void 0)
    ],
    ContextMenuComponent.prototype,
    'handleKeydownEscape',
    null
  );
  ContextMenuComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'aca-context-menu',
        templateUrl: './context-menu.component.html',
        styleUrls: ['./context-menu.component.theme.scss'],
        host: {
          class: 'aca-context-menu-holder'
        },
        encapsulation: ViewEncapsulation.None
      }),
      tslib_1.__param(3, Inject(CONTEXT_MENU_DIRECTION)),
      tslib_1.__metadata('design:paramtypes', [
        ContextMenuOverlayRef,
        AppExtensionService,
        Store,
        Directionality
      ])
    ],
    ContextMenuComponent
  );
  return ContextMenuComponent;
})();
export { ContextMenuComponent };
//# sourceMappingURL=context-menu.component.js.map
