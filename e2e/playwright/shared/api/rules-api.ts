/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { RuleTrigger } from '../../../../projects/aca-folder-rules/src/lib/model/rule.model';
import { RuleCompositeCondition } from '../../../../projects/aca-folder-rules/src/lib/model/rule-composite-condition.model';
import { RuleAction } from '../../../../projects/aca-folder-rules/src/lib/model/rule-action.model';

export interface Rule {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  isInheritable: boolean;
  isAsynchronous: boolean;
  errorScript: string;
  isShared: boolean;
  triggers: RuleTrigger[];
  conditions: RuleCompositeCondition;
  actions: RuleAction[];
}

export class ActionTypes {
  static ADDFEATURES = new ActionTypes('ADDFEATURES', {
    actionDefinitionId: 'add-features',
    params: { 'aspect-name': 'cm:thumbnailed' }
  });
  static CHECKIN = new ActionTypes('CHECKIN', {
    actionDefinitionId: 'check-in',
    params: {
      description: 'test',
      minorChange: true
    }
  });

  constructor(public key: string, public value: RuleAction) {}
}
