/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { Node } from '@alfresco/js-api';

const RMA_NODE_TYPES = {
  hold: 'rma:hold',
  holdContainer: 'rma:holdContainer',
  transferContainer: 'rma:transferContainer',
  unfiledRecordContainer: 'rma:unfiledRecordContainer'
} as const;

type RmaNodeType = (typeof RMA_NODE_TYPES)[keyof typeof RMA_NODE_TYPES];

export function isLocked(node: { entry: Node }): boolean {
  if (node?.entry) {
    const { entry } = node;

    return entry.isLocked || entry.properties?.['cm:lockType'] === 'READ_ONLY_LOCK' || entry.properties?.['cm:lockType'] === 'WRITE_LOCK';
  } else {
    return false;
  }
}

export function isLibrary(node: { entry: Node | any }): boolean {
  if (node?.entry) {
    const { entry } = node;

    return !!(entry.guid && entry.id && entry.preset && entry.title && entry.visibility) || entry.nodeType === 'st:site';
  } else {
    return false;
  }
}

const hasNodeType =
  (type: RmaNodeType) =>
  (node: Node): boolean =>
    node.nodeType === type;

const isRmaHoldsContainer = hasNodeType(RMA_NODE_TYPES.holdContainer);
const isRmaHold = hasNodeType(RMA_NODE_TYPES.hold);
const isRmaTransferContainer = hasNodeType(RMA_NODE_TYPES.transferContainer);
const isRmaUnfiledRecordsContainer = hasNodeType(RMA_NODE_TYPES.unfiledRecordContainer);

export const isRmaSystemFolder = (node: Node): boolean =>
  isRmaHoldsContainer(node) || isRmaTransferContainer(node) || isRmaUnfiledRecordsContainer(node);

export const isRmaRestrictedCreateFolder = (node: Node): boolean => isRmaHold(node) || isRmaTransferContainer(node) || isRmaHoldsContainer(node);

export const isRmaContent = (node: Node): boolean => {
  return node.nodeType.startsWith('rma:');
};
