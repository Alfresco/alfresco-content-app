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
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
var ModuleListComponent = /** @class */ (function() {
  function ModuleListComponent() {
    this.columns = [
      {
        columnDef: 'id',
        header: 'APP.ABOUT.MODULES.ID',
        cell: function(row) {
          return '' + row.id;
        }
      },
      {
        columnDef: 'title',
        header: 'APP.ABOUT.MODULES.NAME',
        cell: function(row) {
          return '' + row.title;
        }
      },
      {
        columnDef: 'version',
        header: 'APP.ABOUT.MODULES.VERSION',
        cell: function(row) {
          return '' + row.version;
        }
      }
    ];
    this.displayedColumns = this.columns.map(function(x) {
      return x.columnDef;
    });
    this.data = [];
  }
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Array)],
    ModuleListComponent.prototype,
    'data',
    void 0
  );
  ModuleListComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-module-list',
        templateUrl: './module-list.component.html',
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush
      })
    ],
    ModuleListComponent
  );
  return ModuleListComponent;
})();
export { ModuleListComponent };
//# sourceMappingURL=module-list.component.js.map
