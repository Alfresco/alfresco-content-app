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

import { RuleContext } from './rule-context';
import { RuleParameter } from './rule-parameter';
import { Node } from 'alfresco-js-api';

export function canCreateFolder(context: RuleContext, ...args: RuleParameter[]): boolean {
    const folder = context.navigation.currentFolder;
    if (folder) {
        return nodeHasPermission(folder, 'create');
    }
    return false;
}

export function hasFolderSelected(context: RuleContext, ...args: RuleParameter[]): boolean {
    const folder = context.selection.folder;
    return folder ? true : false;
}

export function hasFileSelected(context: RuleContext, ...args: RuleParameter[]): boolean {
    const file = context.selection.file;
    return file ? true : false;
}

export function canUpdateSelectedFolder(context: RuleContext, ...args: RuleParameter[]): boolean {
    const folder = context.selection.folder;
    if (folder && folder.entry) {
        return nodeHasPermission(folder.entry, 'update');
    }
    return false;
}

export function nodeHasPermission(node: Node, permission: string): boolean {
    if (node && permission) {
        const allowableOperations = node.allowableOperations || [];
        return allowableOperations.includes(permission);
    }
    return false;
}
