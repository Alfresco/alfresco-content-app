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
import { NameColumnComponent } from '@alfresco/adf-content-services';
import { AlfrescoApiService } from '@alfresco/adf-core';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NodeActionTypes } from '@alfresco/aca-shared/store';
import { isLocked } from '@alfresco/aca-shared';
var CustomNameColumnComponent = /** @class */ (function(_super) {
  tslib_1.__extends(CustomNameColumnComponent, _super);
  function CustomNameColumnComponent(element, cd, actions$, apiService) {
    var _this = _super.call(this, element, apiService) || this;
    _this.cd = cd;
    _this.actions$ = actions$;
    _this.apiService = apiService;
    _this.onDestroy$$ = new Subject();
    return _this;
  }
  CustomNameColumnComponent.prototype.ngOnInit = function() {
    var _this = this;
    this.updateValue();
    this.apiService.nodeUpdated
      .pipe(takeUntil(this.onDestroy$$))
      .subscribe(function(node) {
        var row = _this.context.row;
        if (row) {
          var entry = row.node.entry;
          var currentId = entry.nodeId || entry.id;
          var updatedId = node.nodeId || node.id;
          if (currentId === updatedId) {
            entry.name = node.name;
            row.node = { entry: entry };
            _this.updateValue();
          }
        }
      });
    this.actions$
      .pipe(
        ofType(NodeActionTypes.EditOffline),
        filter(function(val) {
          return _this.node.entry.id === val.payload.entry.id;
        }),
        takeUntil(this.onDestroy$$)
      )
      .subscribe(function() {
        _this.cd.detectChanges();
      });
  };
  CustomNameColumnComponent.prototype.onLinkClick = function(event) {
    event.stopPropagation();
    this.onClick();
  };
  CustomNameColumnComponent.prototype.ngOnDestroy = function() {
    _super.prototype.ngOnDestroy.call(this);
    this.onDestroy$$.next(true);
    this.onDestroy$$.complete();
  };
  CustomNameColumnComponent.prototype.isFile = function() {
    return this.node && this.node.entry && !this.node.entry.isFolder;
  };
  CustomNameColumnComponent.prototype.isFileWriteLocked = function() {
    return isLocked(this.node);
  };
  CustomNameColumnComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'aca-custom-name-column',
        templateUrl: './name-column.component.html',
        styleUrls: ['name-column.component.scss'],
        encapsulation: ViewEncapsulation.None,
        host: {
          class:
            ' adf-datatable-content-cell adf-datatable-link adf-name-column'
        }
      }),
      tslib_1.__metadata('design:paramtypes', [
        ElementRef,
        ChangeDetectorRef,
        Actions,
        AlfrescoApiService
      ])
    ],
    CustomNameColumnComponent
  );
  return CustomNameColumnComponent;
})(NameColumnComponent);
export { CustomNameColumnComponent };
//# sourceMappingURL=name-column.component.js.map
