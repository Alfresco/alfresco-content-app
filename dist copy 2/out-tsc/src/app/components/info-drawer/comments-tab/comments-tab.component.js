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
import { Component, Input } from '@angular/core';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';
import { NodePermissionService, isLocked } from '@alfresco/aca-shared';
var CommentsTabComponent = /** @class */ (function() {
  function CommentsTabComponent(permission) {
    this.permission = permission;
  }
  Object.defineProperty(CommentsTabComponent.prototype, 'canUpdateNode', {
    get: function() {
      if (!this.node) {
        return false;
      }
      if (
        this.node.isFolder ||
        (this.node.isFile && !isLocked({ entry: this.node }))
      ) {
        return this.permission.check(this.node, ['update']);
      }
      return false;
    },
    enumerable: true,
    configurable: true
  });
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', MinimalNodeEntryEntity)],
    CommentsTabComponent.prototype,
    'node',
    void 0
  );
  CommentsTabComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-comments-tab',
        template:
          '\n    <adf-comments\n      [readOnly]="!canUpdateNode"\n      [nodeId]="node?.id"\n    ></adf-comments>\n  '
      }),
      tslib_1.__metadata('design:paramtypes', [NodePermissionService])
    ],
    CommentsTabComponent
  );
  return CommentsTabComponent;
})();
export { CommentsTabComponent };
//# sourceMappingURL=comments-tab.component.js.map
