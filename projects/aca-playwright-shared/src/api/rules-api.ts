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

import { ApiClientFactory } from './api-client-factory';
import { AcaFolderRulesModule } from '@alfresco/aca-content/folder-rules';
import * as crypto from 'crypto';

export class RulesApi {
  private apiService: ApiClientFactory;

  constructor() {
    this.apiService = new ApiClientFactory();
  }

  static async initialize(userName: string, password?: string): Promise<RulesApi> {
    const classObj = new RulesApi();
    await classObj.apiService.setUpAcaBackend(userName, password);
    return classObj;
  }

  private callApi(path: string, httpMethod: string, body: object = {}): Promise<any> {
    // APIs used by this service are still private and not yet available for public use
    const params = [{}, {}, {}, {}, body, ['application/json'], ['application/json']];
    return this.apiService.alfrescoApi.contentPrivateClient.callApi(path, httpMethod, ...params);
  }

  async createRule(nodeId: string, rule: Partial<Rule>, ruleSetId: string = '-default-'): Promise<Rule> {
    const response = await this.callApi(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules`, 'POST', { ...rule });
    return response.entry;
  }

  async createRandomRule(folderId: string, ruleName: string): Promise<Rule> {
    const randomActionsIndex = crypto.randomInt(0, ActionTypes.actions.length);
    const randomAction = ActionTypes.actions[randomActionsIndex];
    return this.createRule(folderId, {
      name: ruleName,
      isEnabled: true,
      actions: [randomAction]
    });
  }

  async createRandomRuleWithMultipleConditions(folderId: string, ruleName: string, numOfConditions: number): Promise<Rule> {
    if (numOfConditions > ConditionsTypes.conditions.length) {
      numOfConditions = ConditionsTypes.conditions.length;
    }
    const randomActionsIndex = crypto.randomInt(0, ActionTypes.actions.length);
    const randomAction = ActionTypes.actions[randomActionsIndex];
    const conditionsArray = [];
    for (let i = 0; i < numOfConditions; i++) {
      const randomIndex = crypto.randomInt(0, ConditionsTypes.conditions.length);
      const randomCondition = ConditionsTypes.conditions[randomIndex];
      conditionsArray.push(randomCondition);
    }
    return this.createRule(folderId, {
      name: ruleName,
      isEnabled: true,
      actions: [randomAction],
      conditions: {
        inverted: false,
        booleanMode: 'and',
        compositeConditions: conditionsArray
      }
    });
  }

  async createRandomRuleWithMultipleActions(folderId: string, ruleName: string, numOfActions: number): Promise<Rule> {
    if (numOfActions > ActionTypes.actions.length) {
      numOfActions = ActionTypes.actions.length;
    }
    const actionsArray = [];
    for (let i = 0; i < numOfActions; i++) {
      const randomIndex = crypto.randomInt(0, ActionTypes.actions.length);
      const randomAction = ActionTypes.actions[randomIndex];
      actionsArray.push(randomAction);
    }
    return this.createRule(folderId, {
      name: ruleName,
      isEnabled: true,
      actions: actionsArray
    });
  }

  async createRandomComplexRule(
    folderId: string,
    ruleName: string,
    numOfConditions: number,
    numOfActions: number,
    ruleDescription?: string
  ): Promise<Rule> {
    if (numOfConditions > ConditionsTypes.conditions.length) {
      numOfConditions = ConditionsTypes.conditions.length;
    }
    const conditionsArray = [];
    for (let i = 0; i < numOfConditions; i++) {
      const randomIndex = crypto.randomInt(0, ConditionsTypes.conditions.length);
      const randomCondition = ConditionsTypes.conditions[randomIndex];
      conditionsArray.push(randomCondition);
    }
    if (numOfActions > ActionTypes.actions.length) {
      numOfActions = ActionTypes.actions.length;
    }
    const actionsArray = [];
    for (let i = 0; i < numOfActions; i++) {
      const randomIndex = crypto.randomInt(0, ActionTypes.actions.length);
      const randomAction = ActionTypes.actions[randomIndex];
      actionsArray.push(randomAction);
    }
    return this.createRule(folderId, {
      name: ruleName,
      description: ruleDescription,
      isEnabled: true,
      actions: actionsArray,
      conditions: {
        inverted: false,
        booleanMode: 'and',
        compositeConditions: conditionsArray
      }
    });
  }

  async createRuleWithRandomAspects(folderId: string, ruleName: string): Promise<Rule> {
    return this.createRule(folderId, {
      name: ruleName,
      isEnabled: true,
      actions: [
        {
          actionDefinitionId: 'add-features',
          params: {
            'aspect-name': 'sc:controlsAreClearance'
          }
        },
        {
          actionDefinitionId: 'add-features',
          params: {
            'aspect-name': 'sfdc:objectModel'
          }
        },
        {
          actionDefinitionId: 'add-features',
          params: {
            'aspect-name': 'sfdc:folder'
          }
        }
      ]
    });
  }

  async createRuleWithDestinationFolder(
    folderId: string,
    ruleName: string,
    actionType: 'move' | 'copy' | 'import',
    destinationFolderId: string
  ): Promise<Rule> {
    return this.createRule(folderId, {
      name: ruleName,
      isEnabled: true,
      actions: [
        {
          actionDefinitionId: actionType,
          params: {
            'destination-folder': destinationFolderId
          }
        }
      ]
    });
  }
}

type RuleTrigger = 'inbound' | 'update' | 'outbound';

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
  conditions: AcaFolderRulesModule;
  actions: RuleAction[];
}

export interface RuleAction {
  actionDefinitionId: string;
  params?: { [key: string]: unknown };
}

export class ActionTypes {
  static readonly ADDFEATURES = new ActionTypes('ADDFEATURES', {
    actionDefinitionId: 'add-features',
    params: { 'aspect-name': 'cm:thumbnailed' }
  });
  static readonly CHECKIN = new ActionTypes('CHECKIN', {
    actionDefinitionId: 'check-in',
    params: {
      description: 'test',
      minorChange: true
    }
  });
  static readonly SPECIALISETYPE = new ActionTypes('SPECIALISETYPE', {
    actionDefinitionId: 'specialise-type',
    params: { 'type-name': 'sys:base' }
  });
  static readonly RECORDABLEVERSION = new ActionTypes('RECORDABLEVERSION', {
    actionDefinitionId: 'recordable-version-config',
    params: { version: 'ALL' }
  });
  static readonly SETPROPERTYVALUE = new ActionTypes('SETPROPERTYVALUE', {
    actionDefinitionId: 'set-property-value',
    params: { property: 'dl:ganttPercentComplete', value: 'test' }
  });
  static readonly actions = [
    ActionTypes.ADDFEATURES.value,
    ActionTypes.CHECKIN.value,
    ActionTypes.RECORDABLEVERSION.value,
    ActionTypes.SPECIALISETYPE.value,
    ActionTypes.SETPROPERTYVALUE.value
  ];
  constructor(public key: string, public value: RuleAction) {}
}

export class ConditionsTypes {
  static readonly MIMETYPE = new ConditionsTypes('MIMETYPE', {
    inverted: false,
    booleanMode: 'and',
    simpleConditions: [
      {
        field: 'mimetype',
        comparator: 'equals',
        parameter: 'video/3gpp'
      }
    ]
  });
  static readonly CMNAME = new ConditionsTypes('CM:NAME', {
    inverted: false,
    booleanMode: 'and',
    simpleConditions: [
      {
        field: 'cm:name',
        comparator: 'equals',
        parameter: 'testname'
      }
    ]
  });
  static readonly SIZE = new ConditionsTypes('SIZE', {
    inverted: false,
    booleanMode: 'and',
    simpleConditions: [
      {
        field: 'size',
        comparator: 'equals',
        parameter: '345'
      }
    ]
  });
  static readonly TAG = new ConditionsTypes('TAG', {
    inverted: false,
    booleanMode: 'and',
    simpleConditions: [
      {
        field: 'tag',
        comparator: 'equals',
        parameter: 'testtag'
      }
    ]
  });
  static readonly conditions = [ConditionsTypes.MIMETYPE.value, ConditionsTypes.CMNAME.value, ConditionsTypes.SIZE.value, ConditionsTypes.TAG.value];
  constructor(public key: string, public value: AcaFolderRulesModule) {}
}
