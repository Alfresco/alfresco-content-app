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
          cascade: false,
          asynchronous: false,
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
          enabled: true
        }
      },
      {
        entry: {
          isShared: false,
          cascade: false,
          asynchronous: false,
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
          enabled: true
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
    enabled: true,
    cascade: false,
    asynchronous: false,
    errorScript: '',
    isShared: false,
    triggers: ['inbound'],
    conditions: null,
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
    enabled: true,
    cascade: false,
    asynchronous: false,
    errorScript: '',
    isShared: false,
    triggers: ['inbound'],
    conditions: null,
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
