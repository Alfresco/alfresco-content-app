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

import { Rule } from '../model/rule.model';

export const dummyResponse = {
  list: {
    pagination: {
      count: 2,
      hasMoreItems: false,
      totalItems: 2,
      skipCount: 0,
      maxItems: 100
    },
    entries: [
      {
        entry: {
          isShared: false,
          isInheritable: false,
          isAsynchronous: false,
          name: 'rule1',
          id: 'd388ed54-a522-410f-a158-6dbf5a833731',
          triggers: ['inbound'],
          actions: [
            {
              actionDefinitionId: 'copy',
              params: {
                'deep-copy': false,
                'destination-folder': '279c65f0-912b-4563-affb-ed9dab8338e0',
                actionContext: 'rule'
              }
            }
          ],
          isEnabled: true
        }
      },
      {
        entry: {
          isShared: false,
          isInheritable: false,
          isAsynchronous: false,
          name: 'rule2',
          id: 'e0e645ca-e6c0-47d4-9936-1a8872a6c30b',
          triggers: ['inbound'],
          actions: [
            {
              actionDefinitionId: 'move',
              params: {
                'destination-folder': '279c65f0-912b-4563-affb-ed9dab8338e0',
                actionContext: 'rule'
              }
            }
          ],
          isEnabled: true
        }
      }
    ]
  }
};

export const dummyRules: Rule[] = [
  {
    id: 'd388ed54-a522-410f-a158-6dbf5a833731',
    name: 'rule1',
    description: '',
    isEnabled: true,
    isInheritable: false,
    isAsynchronous: false,
    errorScript: '',
    isShared: false,
    triggers: ['inbound'],
    conditions: {
      inverted: false,
      booleanMode: 'and',
      simpleConditions: [],
      compositeConditions: []
    },
    actions: [
      {
        actionDefinitionId: 'copy',
        params: {
          'deep-copy': false,
          'destination-folder': '279c65f0-912b-4563-affb-ed9dab8338e0',
          actionContext: 'rule'
        }
      }
    ]
  },
  {
    id: 'e0e645ca-e6c0-47d4-9936-1a8872a6c30b',
    name: 'rule2',
    description: '',
    isEnabled: true,
    isInheritable: false,
    isAsynchronous: false,
    errorScript: '',
    isShared: false,
    triggers: ['inbound'],
    conditions: {
      inverted: false,
      booleanMode: 'and',
      simpleConditions: [],
      compositeConditions: []
    },
    actions: [
      {
        actionDefinitionId: 'move',
        params: {
          'destination-folder': '279c65f0-912b-4563-affb-ed9dab8338e0',
          actionContext: 'rule'
        }
      }
    ]
  }
];
