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

import { PathInfo } from '@alfresco/js-api';

/**
 * The browsing area a node belongs to, derived from its primary path.
 * Used to build links and routes that keep the user in the right context
 * instead of always falling back to Personal Files. The values match the
 * application route segments (`/personal-files`, `/libraries`, `/repository`).
 */
export type NodeContentSource = 'personal-files' | 'libraries' | 'repository';

const PERSONAL_FILES_FOLDER = 'User Homes';
const LIBRARIES_FOLDER = 'Sites';

/**
 * Resolves the browsing area of a node from its path. When no path information is available the default of
 * `personal-files` is kept.
 *
 * @param path path of the node
 * @returns The content source the node should be navigated to
 */
export function getNodeContentSource(path: PathInfo): NodeContentSource {
  const elements = path?.elements ?? [];

  if (elements.length === 0) {
    return 'personal-files';
  }

  if (elements[1]?.name === LIBRARIES_FOLDER) {
    return 'libraries';
  }

  if (path?.name?.includes(PERSONAL_FILES_FOLDER) || elements[1]?.name === PERSONAL_FILES_FOLDER) {
    return 'personal-files';
  }

  return 'repository';
}
