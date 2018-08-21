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

import { ContentActionRef, ContentActionType } from './action.extensions';

export function getValue(target: any, key: string): any {
    if (!target) {
        return undefined;
    }

    const keys = key.split('.');
    key = '';

    do {
        key += keys.shift();
        const value = target[key];
        if (
            value !== undefined &&
            (typeof value === 'object' || !keys.length)
        ) {
            target = value;
            key = '';
        } else if (!keys.length) {
            target = undefined;
        } else {
            key += '.';
        }
    } while (keys.length);

    return target;
}

export function filterEnabled(entry: { disabled?: boolean }): boolean {
    return !entry.disabled;
}

export function sortByOrder(
    a: { order?: number | undefined },
    b: { order?: number | undefined }
) {
    const left = a.order === undefined ? Number.MAX_SAFE_INTEGER : a.order;
    const right = b.order === undefined ? Number.MAX_SAFE_INTEGER : b.order;
    return left - right;
}

export function reduceSeparators(
    acc: ContentActionRef[],
    el: ContentActionRef,
    i: number,
    arr: ContentActionRef[]
): ContentActionRef[] {
    // remove leading separator
    if (i === 0) {
        if (arr[i].type === ContentActionType.separator) {
            return acc;
        }
    }
    // remove duplicate separators
    if (i > 0) {
        const prev = arr[i - 1];
        if (
            prev.type === ContentActionType.separator &&
            el.type === ContentActionType.separator
        ) {
            return acc;
        }

        // remove trailing separator
        if (i === arr.length - 1) {
            if (el.type === ContentActionType.separator) {
                return acc;
            }
        }
    }

    return acc.concat(el);
}

export function reduceEmptyMenus(
    acc: ContentActionRef[],
    el: ContentActionRef
): ContentActionRef[] {
    if (el.type === ContentActionType.menu) {
        if ((el.children || []).length === 0) {
            return acc;
        }
    }
    return acc.concat(el);
}

export function mergeObjects(...objects): any {
    const result = {};

    objects.forEach(source => {
        Object.keys(source).forEach(prop => {
            if (!prop.startsWith('$')) {
                if (prop in result && Array.isArray(result[prop])) {
                    // result[prop] = result[prop].concat(source[prop]);
                    result[prop] = mergeArrays(result[prop], source[prop]);
                } else if (prop in result && typeof result[prop] === 'object') {
                    result[prop] = mergeObjects(result[prop], source[prop]);
                } else {
                    result[prop] = source[prop];
                }
            }
        });
    });

    return result;
}

export function mergeArrays(left: any[], right: any[]): any[] {
    const result = [];
    const map = {};

    (left || []).forEach(entry => {
        const element = entry;
        if (element && element.hasOwnProperty('id')) {
            map[element.id] = element;
        } else {
            result.push(element);
        }
    });

    (right || []).forEach(entry => {
        const element = entry;
        if (element && element.hasOwnProperty('id') && map[element.id]) {
            const merged = mergeObjects(map[element.id], element);
            map[element.id] = merged;
        } else {
            result.push(element);
        }
    });

    return Object.values(map).concat(result);
}
