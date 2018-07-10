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

import {
    ContentActionExtension,
    ContentActionType
} from './content-action.extension';

export function reduceSeparators(
    acc: ContentActionExtension[],
    el: ContentActionExtension,
    i: number,
    arr: ContentActionExtension[]
): ContentActionExtension[] {
    // remove duplicate separators
    if (i > 0) {
        const prev = arr[i - 1];
        if (
            prev.type === ContentActionType.separator &&
            el.type === ContentActionType.separator
        ) {
            return acc;
        }
    }
    // remove trailing separator
    if (i === arr.length - 1) {
        if (el.type === ContentActionType.separator) {
            return acc;
        }
    }
    return acc.concat(el);
}


export function reduceEmptyMenus(
    acc: ContentActionExtension[],
    el: ContentActionExtension
): ContentActionExtension[] {
    if (el.type === ContentActionType.menu) {
        if ((el.children || []).length === 0) {
            return acc;
        }
    }
    return acc.concat(el);
}

export function sortByOrder(
    a: { order?: number | undefined },
    b: { order?: number | undefined }
) {
    const left = a.order === undefined ? Number.MAX_SAFE_INTEGER : a.order;
    const right = b.order === undefined ? Number.MAX_SAFE_INTEGER : b.order;
    return left - right;
}

export function filterEnabled(entry: { disabled?: boolean }): boolean {
    return !entry.disabled;
}

export function copyAction(action: ContentActionExtension): ContentActionExtension {
    return {
        ...action,
        children: (action.children || []).map(copyAction)
    };
}
