/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

@Injectable()
export class NodePermissionService implements NodePermissions {
    static DEFAULT_OPERATION = 'OR';

    private defaultOptions = {
        operation: NodePermissionService.DEFAULT_OPERATION,
        target: null
    };

    check(source: any, permissions: string[], options?: any): boolean {
        const opts = Object.assign({}, this.defaultOptions, options || {});

        if (source) {
            if (Array.isArray(source) && source.length) {
                const arr = this.sanitize(source);

                return !!arr.length && source.every(node => this.hasPermission(node, permissions, opts));
            }

            return this.hasPermission(source, permissions, opts);
        }

        return false;
    }

    private hasPermission(node, permissions, options): boolean {
        const allowableOperations = this.getAllowableOperations(node, options.target);

        if (allowableOperations.length) {
            if (options.operation === NodePermissionService.DEFAULT_OPERATION) {
                return permissions.some(permission => allowableOperations.includes(permission));
            } else {
                return permissions.every(permission => allowableOperations.includes(permission));
            }
        }

        return false;
    }

    private getAllowableOperations(node, target): string[] {
        const entry = node.entry || node;

        if (!target && entry.allowableOperations) {
            return entry.allowableOperations;
        }

        if (target && entry[target]) {
            return entry[target];
        }

        return [];
    }

    private sanitize(selection): any[] {
        return (selection || []).filter(item => item);
    }
}
