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

import { RuleContext, RuleParameter } from '@alfresco/adf-extensions';
import {
    isNotTrashcan,
    isNotSharedFiles,
    isNotLibraries,
    isFavorites,
    isLibraries,
    isTrashcan,
    isSharedFiles,
    isNotSearchResults,
    isPreview
} from './navigation.evaluators';

export function canAddFavorite(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    if (!context.selection.isEmpty) {
        if (
            isFavorites(context, ...args) ||
            isLibraries(context, ...args) ||
            isTrashcan(context, ...args)
        ) {
            return false;
        }
        return context.selection.nodes.some(node => !node.entry.isFavorite);
    }
    return false;
}

export function canRemoveFavorite(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    if (!context.selection.isEmpty && !isTrashcan(context, ...args)) {
        if (isFavorites(context, ...args)) {
            return true;
        }
        return context.selection.nodes.every(node => node.entry.isFavorite);
    }
    return false;
}

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
        isNotSearchResults(context, ...args) &&
        !context.selection.isEmpty
    ) {
        // temp workaround for Search api
        if (isFavorites(context, ...args)) {
            return true;
        }

        if (isPreview(context, ...args)) {
            return context.permissions.check(context.selection.nodes, [
                'delete'
            ]);
        }

        // workaround for Shared Files
        if (isSharedFiles(context, ...args)) {
            return context.permissions.check(
                context.selection.nodes,
                ['delete'],
                { target: 'allowableOperationsOnTarget' }
            );
        }

        return context.permissions.check(context.selection.nodes, ['delete']);
    }
    return false;
}

export function canUnshareNodes(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    if (!context.selection.isEmpty) {
        return context.permissions.check(context.selection.nodes, ['delete'], {
            target: 'allowableOperationsOnTarget'
        });
    }
    return false;
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

export function canUpdateSelectedNode(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    if (context.selection && !context.selection.isEmpty) {
        const node = context.selection.first;

        if (node.entry.hasOwnProperty('allowableOperationsOnTarget')) {
            return context.permissions.check(node, ['update'], {
                target: 'allowableOperationsOnTarget'
            });
        }

        return context.permissions.check(node, ['update']);
    }
    return false;
}

export function canUpdateSelectedFolder(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    const { folder } = context.selection;
    if (folder) {
        return (
            // workaround for Search Api
            isFavorites(context, ...args) ||
            context.permissions.check(folder.entry, ['update'])
        );
    }
    return false;
}
