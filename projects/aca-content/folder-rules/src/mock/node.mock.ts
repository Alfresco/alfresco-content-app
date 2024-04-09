/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NodeInfo } from '@alfresco/aca-shared/store';
import { Node, NodeEntry } from '@alfresco/js-api';

export const getOwningFolderEntryMock: NodeEntry = {
  entry: {
    id: 'owning-folder-id',
    name: 'owning-folder-name'
  }
} as NodeEntry;

export const getOtherFolderEntryMock: NodeEntry = {
  entry: {
    id: 'other-folder-id',
    name: 'other-folder-name'
  }
} as NodeEntry;

export const owningFolderIdMock = 'owning-folder-id';
export const otherFolderIdMock = 'other-folder-id';

export const owningFolderMock: NodeInfo = {
  id: owningFolderIdMock,
  name: 'owning-folder-name'
};

export const otherFolderMock: NodeInfo = {
  id: otherFolderIdMock,
  name: 'other-folder-name'
};

export const folderToLinkMock: Node = {
  id: 'folder-1-id',
  name: 'folder-1-name',
  nodeType: 'folder',
  isFolder: true,
  isFile: false,
  modifiedAt: new Date(),
  modifiedByUser: {
    id: 'user-id',
    displayName: 'user-name'
  },
  createdAt: new Date(),
  createdByUser: {
    id: 'user-id',
    displayName: 'user-name'
  }
};
