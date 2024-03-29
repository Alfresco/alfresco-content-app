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

import { Rule, RuleSettings } from '../model/rule.model';
import { RuleGroupingItem } from '../model/rule-grouping-item.model';

export const getRulesResponseMock = {
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
          name: 'rule1-name',
          id: 'rule1-id',
          triggers: ['inbound'],
          actions: [
            {
              actionDefinitionId: 'counter',
              params: {}
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
          name: 'rule2-name',
          id: 'rule2-id',
          triggers: ['inbound'],
          actions: [
            {
              actionDefinitionId: 'counter',
              params: {}
            }
          ],
          isEnabled: true
        }
      }
    ]
  }
};

export const getMoreRulesResponseMock = {
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
          name: 'rule3-name',
          id: 'rule3-id',
          triggers: ['inbound'],
          actions: [
            {
              actionDefinitionId: 'counter',
              params: {}
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
          name: 'rule4-name',
          id: 'rule4-id',
          triggers: ['inbound'],
          actions: [
            {
              actionDefinitionId: 'counter',
              params: {}
            }
          ],
          isEnabled: true
        }
      }
    ]
  }
};

const genericRuleMock: Rule = {
  id: '',
  name: '',
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
      actionDefinitionId: 'counter',
      params: {}
    }
  ]
};

export const ruleMock = (unique: string): Rule => ({
  ...genericRuleMock,
  id: `${unique}-id`,
  name: `${unique}-name`
});

export const rulesMock: Rule[] = [ruleMock('rule1'), ruleMock('rule2')];
export const moreRulesMock: Rule[] = [ruleMock('rule3'), ruleMock('rule4')];
export const manyRulesMock: Rule[] = [ruleMock('rule1'), ruleMock('rule2'), ruleMock('rule3'), ruleMock('rule4'), ruleMock('rule5')];

export const ownedRulesMock: Rule[] = [ruleMock('owned-rule-1'), ruleMock('owned-rule-2')];
export const linkedRulesMock: Rule[] = [ruleMock('linked-rule-1'), ruleMock('linked-rule-2')];
export const inheritedRulesMock: Rule[] = [ruleMock('inherited-rule-1'), ruleMock('inherited-rule-2')];

export const ruleListGroupingItemsMock: RuleGroupingItem[] = [
  {
    type: 'rule',
    rule: ruleMock('rule1')
  },
  {
    type: 'rule',
    rule: ruleMock('rule2')
  }
];

export const ruleSettingsMock: RuleSettings = {
  value: false,
  key: '-parameter-'
};
