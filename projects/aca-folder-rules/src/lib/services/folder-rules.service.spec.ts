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

import { TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '@alfresco/adf-core';
import { take } from 'rxjs/operators';
import { of } from 'rxjs';
import { FolderRulesService } from './folder-rules.service';
import { Rule } from '../model/rule.model';

describe('FolderRulesService', () => {
  let folderRulesService: FolderRulesService;
  let rulesPromise: Promise<Partial<Rule>[]>;
  let rules: Partial<Rule>[];
  let apiCallSpy;

  const dummyResponse = {
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
            shared: false,
            cascade: false,
            asynchronous: false,
            name: 'rule1',
            id: 'd388ed54-a522-410f-a158-6dbf5a833731',
            triggers: ['INBOUND'],
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
            shared: false,
            cascade: false,
            asynchronous: false,
            name: 'rule2',
            id: 'e0e645ca-e6c0-47d4-9936-1a8872a6c30b',
            triggers: ['INBOUND'],
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
  const dummyRules: Partial<Rule>[] = [
    {
      id: 'd388ed54-a522-410f-a158-6dbf5a833731',
      name: 'rule1',
      description: '',
      enabled: true,
      cascade: false,
      asynchronous: false,
      errorScript: '',
      shared: false,
      triggers: ['INBOUND'],
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
      shared: false,
      triggers: ['INBOUND'],
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

  const firstRuleId = dummyResponse.list.entries[0].entry.id;
  const lastRuleId = dummyResponse.list.entries[dummyResponse.list.entries.length - 1].entry.id;
  const nodeId = '';
  const ruleSetId = '-default-';

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule],
      providers: [FolderRulesService]
    });

    folderRulesService = TestBed.inject<FolderRulesService>(FolderRulesService);

    apiCallSpy = spyOn(folderRulesService, 'apiCall').and.returnValue(of(dummyResponse) as any);

    rulesPromise = folderRulesService.rulesListing$.pipe(take(2)).toPromise();

    folderRulesService.loadAllRules(nodeId, ruleSetId);

    rules = await rulesPromise;
  });

  it('should set data', async () => {
    expect(rules).toBeTruthy('rulesListing$ is empty');
    expect(rules.length).toBe(2, 'rulesListing$ size is wrong');
  });

  it('should make 1 API call', async () => {
    expect(apiCallSpy).toHaveBeenCalledTimes(1);
  });

  it('should format response to list of rules', async () => {
    expect(rules).toEqual(dummyRules, 'The list of rules is incorrectly formatted');
  });

  it('should format each rule entity', async () => {
    const unformattedRule = dummyResponse.list.entries[0].entry;

    expect(rules[0]).not.toEqual(unformattedRule as any, 'Rule entity is not formatted');
    expect(rules[0]).toEqual(dummyRules[0], 'Rule entity is not formatted correctly');
  });

  it('should keep the order of the rules list', async () => {
    expect(rules[0].id).toBe(firstRuleId, 'First rule has wrong id');
    expect(rules[rules.length - 1].id).toBe(lastRuleId, 'Last rule has wrong id');
  });
});
