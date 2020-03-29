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
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
var LockedByComponent = /** @class */ (function() {
  function LockedByComponent() {}
  LockedByComponent.prototype.ngOnInit = function() {
    this.node = this.context.row.node;
  };
  LockedByComponent.prototype.writeLockedBy = function() {
    return (
      this.node &&
      this.node.entry.properties &&
      this.node.entry.properties['cm:lockOwner'] &&
      this.node.entry.properties['cm:lockOwner'].displayName
    );
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    LockedByComponent.prototype,
    'context',
    void 0
  );
  LockedByComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'aca-locked-by',
        template:
          '\n    <mat-icon class="locked_by--icon">lock</mat-icon>\n    <span class="locked_by--name">{{ writeLockedBy() }}</span>\n  ',
        styleUrls: ['./locked-by.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
        encapsulation: ViewEncapsulation.None,
        host: {
          class: 'aca-locked-by'
        }
      }),
      tslib_1.__metadata('design:paramtypes', [])
    ],
    LockedByComponent
  );
  return LockedByComponent;
})();
export { LockedByComponent };
//# sourceMappingURL=locked-by.component.js.map
