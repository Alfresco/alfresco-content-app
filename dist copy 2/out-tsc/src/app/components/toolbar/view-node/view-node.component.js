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
import { Component, ViewEncapsulation, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ViewNodeAction, getAppSelection } from '@alfresco/aca-shared/store';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
var ViewNodeComponent = /** @class */ (function() {
  function ViewNodeComponent(store, router) {
    this.store = store;
    this.router = router;
  }
  ViewNodeComponent.prototype.onClick = function() {
    var _this = this;
    this.store
      .select(getAppSelection)
      .pipe(take(1))
      .subscribe(function(selection) {
        var id =
          selection.file.entry.nodeId ||
          selection.file.entry.guid ||
          selection.file.entry.id;
        _this.store.dispatch(
          new ViewNodeAction(id, { location: _this.router.url })
        );
      });
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    ViewNodeComponent.prototype,
    'data',
    void 0
  );
  ViewNodeComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-view-node',
        template:
          '\n    <button\n      *ngIf="data.iconButton"\n      mat-icon-button\n      [attr.aria-label]="data.title | translate"\n      [attr.title]="data.title | translate"\n      (click)="onClick()"\n    >\n      <mat-icon>visibility</mat-icon>\n    </button>\n\n    <button *ngIf="data.menuButton" mat-menu-item (click)="onClick()">\n      <mat-icon>visibility</mat-icon>\n      <span>{{ data.title | translate }}</span>\n    </button>\n  ',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-view-node' }
      }),
      tslib_1.__metadata('design:paramtypes', [Store, Router])
    ],
    ViewNodeComponent
  );
  return ViewNodeComponent;
})();
export { ViewNodeComponent };
//# sourceMappingURL=view-node.component.js.map
