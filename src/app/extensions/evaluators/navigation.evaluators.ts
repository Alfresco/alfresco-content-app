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

export function isFavorites(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    const { url } = context.navigation;
    return url && url.startsWith('/favorites');
}

export function isNotFavorites(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
   return !isFavorites(context, ...args);
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
    return url && url.endsWith('/libraries');
}

export function isNotLibraries(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    return !isLibraries(context, ...args);
}

export function isRecentFiles(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    const { url } = context.navigation;
    return url && url.startsWith('/recent-files');
}

export function isNotRecentFiles(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    return !isRecentFiles(context, ...args);
}

export function isSearchResults(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    const { url } = context.navigation;
    return url && url.startsWith('/search');
}

export function isNotSearchResults(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    return !isSearchResults(context, ...args);
}

export function isPreview(
    context: RuleContext,
    ...args: RuleParameter[]
): boolean {
    const { url } = context.navigation;
    return url && url.includes('/preview/');
}
