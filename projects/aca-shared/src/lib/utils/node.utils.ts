/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import { Node } from '@alfresco/js-api';

export function isLocked(node: { entry: Node }): boolean {
  const { entry } = node;

  return (
    (entry && entry.isLocked) ||
    (entry.properties && (entry.properties['cm:lockType'] === 'READ_ONLY_LOCK' || entry.properties['cm:lockType'] === 'WRITE_LOCK'))
  );
}

export function isLibrary(node: { entry: Node | any }): boolean {
  const { entry } = node;

  return (entry.guid && entry.id && entry.preset && entry.title && entry.visibility) || entry.nodeType === 'st:site';
}
