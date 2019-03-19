/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { Injectable } from '@angular/core';
import { NodePermissions } from '@alfresco/adf-extensions';
import { Node, SharedLink, SharedLinkEntry, NodeEntry } from '@alfresco/js-api';

export type PermissionSource = NodeEntry | SharedLinkEntry | Node;

export interface PermissionOptions {
  target?: string;
  operation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NodePermissionService implements NodePermissions {
  static DEFAULT_OPERATION = 'OR';

  private defaultOptions: PermissionOptions = {
    operation: NodePermissionService.DEFAULT_OPERATION,
    target: null
  };

  check(
    source: PermissionSource | PermissionSource[],
    permissions: string[],
    options?: PermissionOptions
  ): boolean {
    const opts = Object.assign({}, this.defaultOptions, options || {});

    if (!source) {
      return false;
    }

    if (Array.isArray(source)) {
      source = source.filter(item => item);

      if (source.length > 0) {
        return source.every(node =>
          this.isOperationAllowed(node, permissions, opts)
        );
      }
      return false;
    } else {
      return this.isOperationAllowed(source, permissions, opts);
    }
  }

  private isOperationAllowed(
    node: PermissionSource,
    permissions: string[],
    options: PermissionOptions
  ): boolean {
    const allowableOperations = this.getAllowableOperations(
      node,
      options.target
    );

    if (allowableOperations.length) {
      if (options.operation === NodePermissionService.DEFAULT_OPERATION) {
        return permissions.some(permission =>
          allowableOperations.includes(permission)
        );
      } else {
        return permissions.every(permission =>
          allowableOperations.includes(permission)
        );
      }
    }

    return false;
  }

  private getAllowableOperations(
    node: PermissionSource,
    property?: string
  ): string[] {
    let entry: Node | SharedLink;

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
  }
}
