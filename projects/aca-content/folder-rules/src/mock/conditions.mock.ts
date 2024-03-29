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

import { RuleCompositeCondition } from '../model/rule-composite-condition.model';
import { RuleSimpleCondition } from '../model/rule-simple-condition.model';

const simpleConditionMock: RuleSimpleCondition = {
  field: 'cm:name',
  comparator: 'equals',
  parameter: ''
};

export const mimeTypeMock: RuleSimpleCondition = {
  field: 'mimetype',
  comparator: 'equals',
  parameter: ''
};

export const tagMock: RuleSimpleCondition = {
  field: 'tag',
  comparator: 'equals',
  parameter: ''
};

export const categoriesListMock = {
  list: {
    pagination: {
      count: 3,
      hasMoreItems: false,
      totalItems: 0,
      skipCount: 0,
      maxItems: 25
    },
    entries: [
      {
        entry: {
          path: {
            name: '/a/fake/category/path/1'
          },
          hasChildren: false,
          name: 'FakeCategory1',
          id: 'fake-category-id-1',
          nodeType: 'cm:category',
          isFile: false,
          isFolder: false
        }
      },
      {
        entry: {
          path: {
            name: '/a/fake/category/path/2'
          },
          hasChildren: false,
          name: 'FakeCategory2',
          id: 'fake-category-id-2',
          nodeType: 'cm:category',
          isFile: false,
          isFolder: false
        }
      },
      {
        entry: {
          path: {
            name: '/a/fake/category/path/3'
          },
          hasChildren: false,
          name: 'FakeCategory3',
          id: 'fake-category-id-3',
          nodeType: 'cm:category',
          isFile: false,
          isFolder: false
        }
      }
    ]
  }
};

export const simpleConditionUnknownFieldMock: RuleSimpleCondition = {
  field: 'unknown-field',
  comparator: 'equals',
  parameter: ''
};

const emptyCompositeConditionMock: RuleCompositeCondition = {
  inverted: false,
  booleanMode: 'and',
  compositeConditions: [],
  simpleConditions: []
};

const compositeConditionWithOneConditionMock: RuleCompositeCondition = {
  ...emptyCompositeConditionMock,
  simpleConditions: [{ ...simpleConditionMock }]
};

export const compositeConditionWithOneGroupMock: RuleCompositeCondition = {
  ...emptyCompositeConditionMock,
  compositeConditions: [{ ...compositeConditionWithOneConditionMock }]
};

export const compositeConditionWithNestedGroupsMock: RuleCompositeCondition = {
  ...emptyCompositeConditionMock,
  compositeConditions: [
    {
      ...emptyCompositeConditionMock,
      compositeConditions: [{ ...compositeConditionWithOneConditionMock }]
    },
    { ...compositeConditionWithOneConditionMock }
  ]
};

export const compositeConditionWithThreeConditionMock: RuleCompositeCondition = {
  inverted: false,
  booleanMode: 'and',
  compositeConditions: [],
  simpleConditions: [{ ...simpleConditionMock }, { ...simpleConditionMock }, { ...simpleConditionMock }]
};
