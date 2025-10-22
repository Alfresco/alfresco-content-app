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

import { DocumentListPresetRef } from '@alfresco/adf-extensions';
import { FavoritePaging, Pagination, SitePaging } from '@alfresco/js-api';

export const librariesMock: SitePaging = {
  list: {
    entries: [
      { entry: { id: '1', guid: '1', title: 'Library 1', visibility: 'public' } },
      { entry: { id: '2', guid: '2', title: 'Library 2', visibility: 'private' } }
    ],
    pagination: { count: 25, skipCount: 0 }
  }
};

export const favoriteLibrariesMock: FavoritePaging = {
  list: {
    entries: [
      { entry: { targetGuid: '1', target: { id: '1', guid: '1', title: 'Favorite Library 1', visibility: 'public' } } },
      { entry: { targetGuid: '2', target: { id: '2', guid: '2', title: 'Favorite Library 2', visibility: 'private' } } }
    ],
    pagination: { count: 25, skipCount: 0 }
  }
};

export const libraryColumnsPresetMock: DocumentListPresetRef[] = [
  {
    key: 'name',
    type: 'text',
    sortable: false,
    template: '',
    desktopOnly: false,
    sortingKey: '',
    id: ''
  }
];

export const libraryPaginationMock: Pagination = {
  count: 100,
  hasMoreItems: true,
  totalItems: 300,
  skipCount: 25,
  maxItems: 25
};
