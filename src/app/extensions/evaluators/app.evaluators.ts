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

import { RuleContext, RuleParameter } from '../rule.extensions';

export function canShareFile(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    if (
        isNotTrashcan(context, ...args) &&
        isNotSharedFiles(context, ...args) &&
        context.selection.file
    ) {
        return true;
    }
    return false;
}

export function canDeleteSelection(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    if (
        isNotTrashcan(context, ...args) &&
        isNotLibraries(context, ...args) &&
        !context.selection.isEmpty
    ) {
        return context.permissions.check(context.selection.nodes, ['delete']);
    }
    return false;
}

export function isSharedFiles(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    const { url } = context.navigation;
    return url && url.startsWith('/shared');
}

export function isNotSharedFiles(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    return !isSharedFiles(context, ...args);
}

export function isTrashcan(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    const { url } = context.navigation;
    return url && url.startsWith('/trashcan');
}

export function isNotTrashcan(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    return !isTrashcan(context, ...args);
}

export function isLibraries(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    const { url } = context.navigation;
    return url && url.startsWith('/libraries');
}

export function isNotLibraries(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    return !isLibraries(context, ...args);
}

export function hasSelection(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    return !context.selection.isEmpty;
}

export function canCreateFolder(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    const { currentFolder } = context.navigation;
    if (currentFolder) {
        return context.permissions.check(currentFolder, ['create']);
    }
    return false;
}

export function canUpload(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    const { currentFolder } = context.navigation;
    if (currentFolder) {
        return context.permissions.check(currentFolder, ['create']);
    }
    return false;
}

export function canDownloadSelection(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    if (!context.selection.isEmpty) {
        return context.selection.nodes.every(node => {
            return (
                node.entry &&
                (node.entry.isFile ||
                    node.entry.isFolder ||
                    !!node.entry.nodeId)
            );
        });
    }
    return false;
}

export function hasFolderSelected(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    const folder = context.selection.folder;
    return folder ? true : false;
}

export function hasLibrarySelected(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    const library = context.selection.library;
    return library ? true : false;
}

export function hasFileSelected(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    const file = context.selection.file;
    return file ? true : false;
}

export function canUpdateSelectedFolder(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    const { folder } = context.selection;
    if (folder) {
        return context.permissions.check(folder.entry, ['update']);
    }
    return false;
}
