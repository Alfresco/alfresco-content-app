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

import { RuleSet } from '../model/rule-set.model';
import { folderToLinkMock, otherFolderIdMock, otherFolderMock, owningFolderIdMock, owningFolderMock } from './node.mock';
import { Rule } from '../model/rule.model';
import { inheritedRulesMock, linkedRulesMock, ownedRulesMock, ruleMock } from './rules.mock';

export const getRuleSetsResponseMock = {
  list: {
    pagination: {
      count: 3,
      hasMoreItems: false,
      totalItems: 3,
      skipCount: 0,
      maxItems: 100
    },
    entries: [
      {
        entry: {
          linkedToBy: [],
          owningFolder: otherFolderIdMock,
          isLinkedTo: false,
          id: 'inherited-rule-set'
        }
      },
      {
        entry: {
          linkedToBy: [],
          owningFolder: owningFolderIdMock,
          isLinkedTo: false,
          id: 'rule-set-no-links'
        }
      },
      {
        entry: {
          linkedToBy: [owningFolderIdMock],
          owningFolder: otherFolderIdMock,
          isLinkedTo: true,
          id: 'rule-set-with-link'
        }
      }
    ]
  }
};

export const getDefaultRuleSetResponseMock = {
  entry: {
    linkedToBy: [],
    owningFolder: owningFolderIdMock,
    isLinkedTo: false,
    id: 'rule-set-no-links'
  }
};

export const ruleSetMock = (rules: Rule[] = []): RuleSet => ({
  id: 'rule-set-id',
  isLinkedTo: false,
  owningFolder: owningFolderMock,
  linkedToBy: [],
  rules: [...rules],
  hasMoreRules: true,
  loadingRules: false
});

export const ownedRuleSetMock: RuleSet = {
  id: 'rule-set-no-links',
  isLinkedTo: false,
  owningFolder: owningFolderMock,
  linkedToBy: [],
  rules: ownedRulesMock,
  hasMoreRules: false,
  loadingRules: false
};

export const ruleSetWithLinkMock: RuleSet = {
  id: 'rule-set-with-link',
  isLinkedTo: true,
  owningFolder: otherFolderMock,
  linkedToBy: [owningFolderIdMock],
  rules: linkedRulesMock,
  hasMoreRules: false,
  loadingRules: false
};

export const inheritedRuleSetMock: RuleSet = {
  id: 'inherited-rule-set',
  isLinkedTo: false,
  owningFolder: otherFolderMock,
  linkedToBy: [],
  rules: inheritedRulesMock,
  hasMoreRules: false,
  loadingRules: false
};

export const inheritedRuleSetWithEmptyRulesMock: RuleSet = {
  id: 'inherited-rule-set',
  isLinkedTo: false,
  owningFolder: otherFolderMock,
  linkedToBy: [],
  rules: [],
  hasMoreRules: false,
  loadingRules: false
};

export const inheritedRuleSetWithOnlyDisabledRulesMock: RuleSet = {
  id: 'inherited-rule-set',
  isLinkedTo: false,
  owningFolder: otherFolderMock,
  linkedToBy: [],
  rules: [
    { ...ruleMock('rule1'), isEnabled: false },
    { ...ruleMock('rule2'), isEnabled: false }
  ],
  hasMoreRules: false,
  loadingRules: false
};

export const ruleSetsMock: RuleSet[] = [inheritedRuleSetMock, ownedRuleSetMock, ruleSetWithLinkMock];

export const ruleSetWithNoRulesToLinkMock: RuleSet = {
  id: 'rule-set-to-link-with-no-rules',
  isLinkedTo: false,
  owningFolder: folderToLinkMock,
  linkedToBy: [],
  rules: [],
  hasMoreRules: false,
  loadingRules: false
};

export const ruleSetWithOwnedRulesToLinkMock: RuleSet = {
  id: 'rule-set-to-link-with-no-rules',
  isLinkedTo: false,
  owningFolder: folderToLinkMock,
  linkedToBy: [],
  rules: ownedRulesMock,
  hasMoreRules: false,
  loadingRules: false
};
