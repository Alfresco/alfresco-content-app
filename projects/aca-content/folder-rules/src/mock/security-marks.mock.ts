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

import { SecurityControlsMarkResponse } from '@alfresco/adf-content-services/lib/security/services/models/security-controls-mark-response.interface';
import { UpdateNotification } from '@alfresco/adf-core';

export const securityMarksResponseMock: SecurityControlsMarkResponse = {
  pagination: {
    count: 2,
    hasMoreItems: false,
    totalItems: 2,
    skipCount: 0,
    maxItems: 100
  },
  entries: [
    {
      id: 'mark-1-id',
      name: 'mark-1-name',
      groupId: 'group-1'
    },
    {
      id: 'mark-2-id',
      name: 'mark-2-name',
      groupId: 'group-1'
    }
  ]
};

export const updateNotificationMock = (value: string): UpdateNotification => {
  return {
    changed: { securityGroupId: value },
    target: {
      label: 'Security Group Id *',
      value: '',
      key: 'securityGroupId',
      default: undefined,
      editable: true,
      clickable: true,
      isEmpty: () => true,
      isValid: () => true,
      getValidationErrors: () => []
    }
  };
};
