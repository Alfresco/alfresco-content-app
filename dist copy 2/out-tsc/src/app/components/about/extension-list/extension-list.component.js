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
var ExtensionListComponent = /** @class */ (function() {
  function ExtensionListComponent() {
    this.columns = [
      {
        columnDef: 'id',
        header: 'APP.ABOUT.PLUGINS.ID',
        cell: function(row) {
          return '' + row.$id;
        }
      },
      {
        columnDef: 'name',
        header: 'APP.ABOUT.PLUGINS.NAME',
        cell: function(row) {
          return '' + row.$name;
        }
      },
      {
        columnDef: 'version',
        header: 'APP.ABOUT.PLUGINS.VERSION',
        cell: function(row) {
          return '' + row.$version;
        }
      },
      {
        columnDef: 'vendor',
        header: 'APP.ABOUT.PLUGINS.VENDOR',
        cell: function(row) {
          return '' + row.$vendor;
        }
      },
      {
        columnDef: 'license',
        header: 'APP.ABOUT.PLUGINS.LICENSE',
        cell: function(row) {
          return '' + row.$license;
        }
      },
      {
        columnDef: 'runtime',
        header: 'APP.ABOUT.PLUGINS.RUNTIME',
        cell: function(row) {
          return '' + row.$runtime;
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
    ExtensionListComponent.prototype,
    'data',
    void 0
  );
  ExtensionListComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-extension-list',
        templateUrl: './extension-list.component.html',
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush
      })
    ],
    ExtensionListComponent
  );
  return ExtensionListComponent;
})();
export { ExtensionListComponent };
//# sourceMappingURL=extension-list.component.js.map
