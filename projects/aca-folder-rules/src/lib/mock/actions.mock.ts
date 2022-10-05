import { ActionDefinitionList } from '@alfresco/js-api';
import { ActionDefinitionTransformed, ActionParameterDefinitionTransformed } from '../model/rule-action.model';

export const actionDefListMock: ActionDefinitionList = {
  list: {
    pagination: {

    },
    entries: [
      {
        applicableTypes: [],
        parameterDefinitions: [
          {
            name: 'mock-action-parameter-text',
            type: 'd:text',
            multiValued: false,
            mandatory: false,
            displayLabel: 'Mock action parameter text'
          },
          {
            name: 'mock-action-parameter-boolean',
            type: 'd:boolean',
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
  mandatory: false,
  displayLabel: 'Mock action parameter text'
};

const actionParam2TransformedMock: ActionParameterDefinitionTransformed = {
  name: 'mock-action-parameter-boolean',
  type: 'd:boolean',
  multiValued: false,
  mandatory: false,
  displayLabel: 'mock-action-parameter-boolean'
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
    actionParam2TransformedMock
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

export const actionsTransformedListMock: ActionDefinitionTransformed[] = [
  action1TransformedMock,
  action2TransformedMock
];
