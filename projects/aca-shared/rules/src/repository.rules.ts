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

/**
 * Checks if the quick share repository option is enabled or not.
 * JSON ref: `repository.isQuickShareEnabled`
 */
export function hasQuickShareEnabled(context: RuleContext): boolean {
  return context.repository.status.isQuickShareEnabled;
}

export function isMajorVersionAvailable(context: RuleContext, versionNumber: string): boolean {
  const majorVersion = context.repository.version?.major ? parseInt(context.repository.version.major, 10) : 0;
  return majorVersion >= parseInt(versionNumber, 10);
}
