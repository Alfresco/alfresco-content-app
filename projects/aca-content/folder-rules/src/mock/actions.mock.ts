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

import { ActionDefinitionTransformed, ActionParameterDefinitionTransformed, RuleAction } from '../model/rule-action.model';
import { ActionParameterConstraint } from '../model/action-parameter-constraint.model';

export const actionDefListMock = {
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
        applicableTypes: [],
        parameterDefinitions: [
          {
            name: 'mock-action-parameter-text',
            type: 'd:text',
            multiValued: false,
            mandatory: true,
            displayLabel: 'Mock action parameter text'
          },
          {
            name: 'mock-action-parameter-boolean',
            type: 'd:boolean',
            multiValued: false,
            mandatory: false
          },
          {
            name: 'aspect-name',
            type: 'd:qname',
            multiValued: false,
            mandatory: false,
            parameterConstraintName: 'ac-aspects'
          },
          {
            name: 'mock-action-parameter-noderef',
            type: 'd:noderef',
            multiValued: false,
            mandatory: false
          },
          {
            name: 'aspect-name',
            type: 'd:noderef',
            multiValued: false,
            mandatory: false
          }
        ],
        name: 'mock-action-1-definition',
        trackStatus: false,
        description: 'This is a mock action',
        id: 'mock-action-1-definition',
        title: 'Action 1 title'
      },
      {
        applicableTypes: [],
        name: 'mock-action-2-definition',
        trackStatus: false,
        id: 'mock-action-2-definition'
      }
    ]
  }
};

const actionParam1TransformedMock: ActionParameterDefinitionTransformed = {
  name: 'mock-action-parameter-text',
  type: 'd:text',
  multiValued: false,
  mandatory: true,
  displayLabel: 'Mock action parameter text',
  parameterConstraintName: ''
};

const actionParam2TransformedMock: ActionParameterDefinitionTransformed = {
  name: 'mock-action-parameter-boolean',
  type: 'd:boolean',
  multiValued: false,
  mandatory: false,
  displayLabel: 'mock-action-parameter-boolean',
  parameterConstraintName: ''
};

const actionParam3TransformedMock: ActionParameterDefinitionTransformed = {
  name: 'aspect-name',
  type: 'd:qname',
  multiValued: false,
  mandatory: false,
  displayLabel: 'aspect-name',
  parameterConstraintName: 'ac-aspects'
};

const actionParam4TransformedMock: ActionParameterDefinitionTransformed = {
  name: 'mock-action-parameter-noderef',
  type: 'd:noderef',
  multiValued: false,
  mandatory: false,
  displayLabel: 'mock-action-parameter-noderef',
  parameterConstraintName: ''
};

const actionParam5TransformedMock: ActionParameterDefinitionTransformed = {
  name: 'aspect-name',
  type: 'd:noderef',
  multiValued: false,
  mandatory: false,
  displayLabel: 'aspect-name',
  parameterConstraintName: ''
};

const actionParamLinkToCategoryTransformedMock = {
  name: 'category-value',
  type: 'd:noderef',
  multiValued: false,
  mandatory: true,
  displayLabel: 'Category value'
};

const actionParamSecurityGroup: ActionParameterDefinitionTransformed = {
  name: 'securityGroupId',
  type: 'd:text',
  multiValued: false,
  mandatory: true,
  displayLabel: 'Security Group Id'
};

const actionParamSecurityMark: ActionParameterDefinitionTransformed = {
  name: 'securityMarkId',
  type: 'd:text',
  multiValued: false,
  mandatory: true,
  displayLabel: 'Security Mark Id'
};

const action1TransformedMock: ActionDefinitionTransformed = {
  id: 'mock-action-1-definition',
  name: 'mock-action-1-definition',
  description: 'This is a mock action',
  title: 'Action 1 title',
  applicableTypes: [],
  trackStatus: false,
  parameterDefinitions: [
    actionParam1TransformedMock,
    actionParam2TransformedMock,
    actionParam3TransformedMock,
    actionParam4TransformedMock,
    actionParam5TransformedMock
  ]
};

const action2TransformedMock: ActionDefinitionTransformed = {
  id: 'mock-action-2-definition',
  name: 'mock-action-2-definition',
  description: '',
  title: 'mock-action-2-definition',
  applicableTypes: [],
  trackStatus: false,
  parameterDefinitions: []
};

export const actionLinkToCategoryTransformedMock: ActionDefinitionTransformed = {
  id: 'mock-action-3-definition',
  name: 'mock-action-3-definition',
  description: '',
  title: 'mock-action-3-definition',
  applicableTypes: [],
  trackStatus: false,
  parameterDefinitions: [actionParamLinkToCategoryTransformedMock]
};

export const securityActionTransformedMock: ActionDefinitionTransformed = {
  id: 'mock-action-4-definition',
  name: 'mock-action-4-definition',
  description: '',
  title: 'mock-action-4-definition',
  applicableTypes: [],
  trackStatus: false,
  parameterDefinitions: [actionParamSecurityGroup, actionParamSecurityMark]
};

export const actionNodeTransformedMock: ActionDefinitionTransformed = {
  id: 'mock-action-5-definition',
  name: 'mock-action-5-definition',
  description: '',
  title: 'mock-action-5-definition',
  applicableTypes: [],
  trackStatus: false,
  parameterDefinitions: [actionParam5TransformedMock]
};

export const actionsTransformedListMock: ActionDefinitionTransformed[] = [action1TransformedMock, action2TransformedMock];

export const validActionMock: RuleAction = {
  actionDefinitionId: 'mock-action-1-definition',
  params: {
    'mock-action-parameter-text': 'mock'
  }
};
export const nonExistentActionDefinitionIdMock: RuleAction = {
  actionDefinitionId: 'non-existent-action-definition-id',
  params: {}
};
export const missingMandatoryParameterMock: RuleAction = {
  actionDefinitionId: 'mock-action-1-definition',
  params: {}
};
export const incompleteMandatoryParameterMock: RuleAction = {
  actionDefinitionId: 'mock-action-1-definition',
  params: {
    'mock-action-parameter-text': ''
  }
};
export const validActionsMock: RuleAction[] = [
  validActionMock,
  {
    actionDefinitionId: 'mock-action-2-definition',
    params: {}
  }
];

export const errorScriptConstraintMock: ActionParameterConstraint = {
  name: 'script-ref',
  constraints: [
    {
      value: 'script-1-value',
      label: 'Script 1'
    },
    {
      value: 'script-2-value',
      label: 'Script 2'
    }
  ]
};
