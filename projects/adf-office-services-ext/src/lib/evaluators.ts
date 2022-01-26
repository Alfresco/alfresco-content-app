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

import { RuleContext } from '@alfresco/adf-extensions';
import { getFileExtension, supportedExtensions } from './utils';

export function canOpenWithOffice(context: RuleContext): boolean {
  if (context.navigation && context.navigation.url && context.navigation.url.startsWith('/trashcan')) {
    return false;
  }

  if (!context || !context.selection) {
    return false;
  }

  const { file } = context.selection;

  if (!file || !file.entry) {
    return false;
  }

  const extension = getFileExtension(file.entry.name);
  if (!extension || !supportedExtensions[extension]) {
    return false;
  }

  if (!file.entry.properties) {
    return false;
  }

  if (file.entry.isLocked) {
    return false;
  }

  /*
  if (file.entry && file.entry.aspectNames) {
    const checkedOut = file.entry.aspectNames.find(
      (aspect: string) => aspect === 'cm:checkedOut'
    );

    if (checkedOut) {
      return false;
    }
  }
  */

  if (file.entry.properties['cm:lockType'] === 'WRITE_LOCK' || file.entry.properties['cm:lockType'] === 'READ_ONLY_LOCK') {
    return false;
  }

  const lockOwner = file.entry.properties['cm:lockOwner'];
  if (lockOwner && lockOwner.id !== context.profile.id) {
    return false;
  }

  // check if record
  if (file.entry.aspectNames && (file.entry.aspectNames.includes('rma:declaredRecord') || file.entry.aspectNames.includes('rma:record'))) {
    return false;
  }

  // workaround for Shared files
  if (context.navigation && context.navigation.url && context.navigation.url.startsWith('/shared')) {
    if (file.entry.hasOwnProperty('allowableOperationsOnTarget')) {
      return context.permissions.check(file, ['update'], {
        target: 'allowableOperationsOnTarget'
      });
    }
  }

  return context.permissions.check(file, ['update']);
}
