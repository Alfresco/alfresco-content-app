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
import { Injectable } from '@angular/core';
var NodePermissionService = /** @class */ (function() {
  function NodePermissionService() {
    this.defaultOptions = {
      operation: NodePermissionService_1.DEFAULT_OPERATION,
      target: null
    };
  }
  NodePermissionService_1 = NodePermissionService;
  NodePermissionService.prototype.check = function(
    source,
    permissions,
    options
  ) {
    var _this = this;
    var opts = Object.assign({}, this.defaultOptions, options || {});
    if (!source) {
      return false;
    }
    if (Array.isArray(source)) {
      source = source.filter(function(item) {
        return item;
      });
      if (source.length > 0) {
        return source.every(function(node) {
          return _this.isOperationAllowed(node, permissions, opts);
        });
      }
      return false;
    } else {
      return this.isOperationAllowed(source, permissions, opts);
    }
  };
  NodePermissionService.prototype.isOperationAllowed = function(
    node,
    permissions,
    options
  ) {
    var allowableOperations = this.getAllowableOperations(node, options.target);
    if (allowableOperations.length) {
      if (options.operation === NodePermissionService_1.DEFAULT_OPERATION) {
        return permissions.some(function(permission) {
          return allowableOperations.includes(permission);
        });
      } else {
        return permissions.every(function(permission) {
          return allowableOperations.includes(permission);
        });
      }
    }
    return false;
  };
  NodePermissionService.prototype.getAllowableOperations = function(
    node,
    property
  ) {
    var entry;
    if ('entry' in node) {
      entry = node.entry;
    } else {
      entry = node;
    }
    if (property) {
      return entry[property] || [];
    }
    if ('allowableOperationsOnTarget' in entry) {
      return entry.allowableOperationsOnTarget || [];
    } else {
      return entry.allowableOperations || [];
    }
  };
  var NodePermissionService_1;
  NodePermissionService.DEFAULT_OPERATION = 'OR';
  NodePermissionService = NodePermissionService_1 = tslib_1.__decorate(
    [
      Injectable({
        providedIn: 'root'
      })
    ],
    NodePermissionService
  );
  return NodePermissionService;
})();
export { NodePermissionService };
//# sourceMappingURL=node-permission.service.js.map
