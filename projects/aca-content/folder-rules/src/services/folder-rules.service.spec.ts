/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { TestBed } from '@angular/core/testing';
import { NoopTranslateModule, NotificationService } from '@alfresco/adf-core';
import { of } from 'rxjs';
import { FolderRulesService } from './folder-rules.service';
import {
  getMoreRulesResponseMock,
  getRulesResponseMock,
  manyRulesMock,
  moreRulesMock,
  ruleMock,
  ruleSettingsMock,
  rulesMock
} from '../mock/rules.mock';
import { ruleSetMock } from '../mock/rule-sets.mock';
import { owningFolderIdMock } from '../mock/node.mock';
import { take } from 'rxjs/operators';
import { AlfrescoApiService } from '@alfresco/adf-content-services';

describe('FolderRulesService', () => {
  let folderRulesService: FolderRulesService;
  let notificationService: NotificationService;

  let apiClientSpy: jasmine.SpyObj<{ callApi: jasmine.Spy }>;

  const nodeId = owningFolderIdMock;
  const ruleSetId = 'rule-set-id';
  const mockedRule = ruleMock('rule-mock');
  const { ...mockedRuleWithoutId } = mockedRule;
  const mockedRuleEntry = { entry: mockedRule };
  const ruleId = mockedRule.id;
  const mockedRuleSettingsEntry = { entry: ruleSettingsMock };
  const key = ruleSettingsMock.key;

  beforeEach(() => {
    apiClientSpy = jasmine.createSpyObj('contentPrivateClient', ['callApi']);

    TestBed.configureTestingModule({
      imports: [NoopTranslateModule],
      providers: [
        FolderRulesService,
        {
          provide: AlfrescoApiService,
          useValue: {
            getInstance: () => ({
              contentPrivateClient: apiClientSpy
            })
          }
        }
      ]
    });

    folderRulesService = TestBed.inject(FolderRulesService);
    notificationService = TestBed.inject(NotificationService);
  });

  it('should load some rules into a rule set', () => {
    const ruleSet = ruleSetMock();
    apiClientSpy.callApi.and.returnValue(of(getRulesResponseMock));

    expect(ruleSet.rules.length).toBe(0);
    expect(ruleSet.hasMoreRules).toBeTrue();
    expect(ruleSet.loadingRules).toBeFalse();

    folderRulesService.loadRules(ruleSet);

    expect(apiClientSpy.callApi).toHaveBeenCalledWith(
      `/nodes/${ruleSet.owningFolder.id}/rule-sets/${ruleSet.id}/rules?skipCount=0&maxItems=100`,
      'GET',
      {},
      {},
      {},
      {},
      {},
      ['application/json'],
      ['application/json']
    );
    expect(ruleSet.rules.length).toBe(2);
    expect(ruleSet.rules).toEqual(rulesMock);
    expect(ruleSet.hasMoreRules).toBeFalse();
  });

  it('should load more rules if it still has some more to load', () => {
    const ruleSet = ruleSetMock(rulesMock);
    apiClientSpy.callApi.and.returnValue(of(getMoreRulesResponseMock));

    expect(ruleSet.rules.length).toBe(2);
    expect(ruleSet.hasMoreRules).toBeTrue();

    folderRulesService.loadRules(ruleSet);

    expect(apiClientSpy.callApi).toHaveBeenCalledWith(
      `/nodes/${ruleSet.owningFolder.id}/rule-sets/${ruleSet.id}/rules?skipCount=2&maxItems=100`,
      'GET',
      {},
      {},
      {},
      {},
      {},
      ['application/json'],
      ['application/json']
    );
    expect(ruleSet.rules.length).toBe(4);
    expect(ruleSet.rules).toEqual([...rulesMock, ...moreRulesMock]);
    expect(ruleSet.hasMoreRules).toBeFalse();
  });

  it('should select the right rule rule after loading', () => {
    const ruleSet = ruleSetMock(rulesMock);
    spyOn(folderRulesService, 'getRules').and.returnValue(of({ rules: manyRulesMock, hasMoreRules: false }));
    const selectedRuleSourceSpy = spyOn(folderRulesService['selectedRuleSource'], 'next');

    folderRulesService.loadRules(ruleSet, 0);
    expect(selectedRuleSourceSpy).not.toHaveBeenCalled();

    folderRulesService.loadRules(ruleSet, 0, 'first');
    expect(selectedRuleSourceSpy).toHaveBeenCalledWith(ruleMock('rule1'));
    selectedRuleSourceSpy.calls.reset();

    folderRulesService.loadRules(ruleSet, 0, 'last');
    expect(selectedRuleSourceSpy).toHaveBeenCalledWith(ruleMock('rule5'));
    selectedRuleSourceSpy.calls.reset();
    selectedRuleSourceSpy.calls.reset();

    folderRulesService.loadRules(ruleSet, 0, ruleMock('rule3'));
    expect(selectedRuleSourceSpy).toHaveBeenCalledWith(ruleMock('rule3'));
  });

  it('should delete a rule and return its id', async () => {
    apiClientSpy.callApi
      .withArgs(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules/${ruleId}`, 'DELETE', {}, {}, {}, {}, {}, ['application/json'], ['application/json'])
      .and.returnValue(ruleId);
    const deletedRulePromise = folderRulesService.deletedRuleId$.pipe(take(2)).toPromise();

    folderRulesService.deleteRule(nodeId, ruleId, ruleSetId);
    const deletedRule = await deletedRulePromise;

    expect(deletedRule).toBeTruthy('rule has not been deleted');
    expect(deletedRule).toBe(ruleId, 'wrong id of deleted rule');
    expect(apiClientSpy.callApi).toHaveBeenCalledTimes(1);
    expect(apiClientSpy.callApi).toHaveBeenCalledWith(
      `/nodes/${nodeId}/rule-sets/${ruleSetId}/rules/${ruleId}`,
      'DELETE',
      {},
      {},
      {},
      {},
      {},
      ['application/json'],
      ['application/json']
    );
  });

  it('should emit error when deleting rule fails', (done) => {
    const errorMessage = 'Delete failed';
    const mockError = new Error(errorMessage);

    apiClientSpy.callApi
      .withArgs(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules/${ruleId}`, 'DELETE', {}, {}, {}, {}, {}, ['application/json'], ['application/json'])
      .and.returnValue(Promise.reject(mockError));

    folderRulesService.deletedRuleId$.pipe(take(2)).subscribe((value) => {
      if (value !== null) {
        expect(value as unknown as Error).toEqual(mockError);
        done();
      }
    });

    folderRulesService.deleteRule(nodeId, ruleId, ruleSetId);
  });

  it('should format simple conditions with default values when properties are missing', () => {
    const mockResponse = {
      list: {
        entries: [
          {
            entry: {
              id: 'test-rule',
              name: 'Test Rule',
              conditions: {
                simpleConditions: [{}]
              }
            }
          }
        ],
        pagination: { hasMoreItems: false }
      }
    };

    apiClientSpy.callApi.and.returnValue(of(mockResponse));

    folderRulesService.getRules('folder-id', 'ruleset-id').subscribe((result) => {
      const conditions = result.rules[0].conditions.simpleConditions;

      expect(conditions[0]).toEqual({
        field: 'cm:name',
        comparator: 'equals',
        parameter: ''
      });
    });
  });

  it('should send correct POST request and return created rule', async () => {
    apiClientSpy.callApi
      .withArgs(
        `/nodes/${nodeId}/rule-sets/${ruleSetId}/rules`,
        'POST',
        {},
        {},
        {},
        {},
        mockedRuleWithoutId,
        ['application/json'],
        ['application/json']
      )
      .and.returnValue(Promise.resolve(mockedRuleEntry));
    const result = await folderRulesService.createRule(nodeId, mockedRuleWithoutId, ruleSetId);

    expect(result).toEqual(mockedRule);
  });

  it('should send correct PUT request to update rule and return it', async () => {
    apiClientSpy.callApi
      .withArgs(
        `/nodes/${nodeId}/rule-sets/${ruleSetId}/rules/${ruleId}`,
        'PUT',
        {},
        {},
        {},
        {},
        mockedRule,
        ['application/json'],
        ['application/json']
      )
      .and.returnValue(Promise.resolve(mockedRuleEntry));

    const result = await folderRulesService.updateRule(nodeId, ruleId, mockedRule, ruleSetId);
    expect(result).toEqual(mockedRule);
  });

  it('should display error message and revert enabled state when updating rule fails', async () => {
    apiClientSpy.callApi
      .withArgs(
        `/nodes/${nodeId}/rule-sets/${ruleSetId}/rules/${ruleId}`,
        'PUT',
        {},
        {},
        {},
        {},
        mockedRule,
        ['application/json'],
        ['application/json']
      )
      .and.returnValue(Promise.reject(new Error(JSON.stringify({ error: { briefSummary: 'Error updating rule' } }))));
    spyOn(notificationService, 'showError');

    const result = await folderRulesService.updateRule(nodeId, ruleId, mockedRule, ruleSetId);
    expect(notificationService.showError).toHaveBeenCalledWith('Error updating rule');
    expect(result.isEnabled).toBe(false);
  });

  it('should send correct GET request and return rule settings', async () => {
    apiClientSpy.callApi
      .withArgs(`/nodes/${nodeId}/rule-settings/${key}`, 'GET', {}, {}, {}, {}, {}, ['application/json'], ['application/json'])
      .and.returnValue(Promise.resolve(mockedRuleSettingsEntry));

    const result = await folderRulesService.getRuleSettings(nodeId, key);
    expect(result).toEqual(ruleSettingsMock);
  });

  it('should send correct PUT request to update rule settings and return them', async () => {
    apiClientSpy.callApi
      .withArgs(`/nodes/${nodeId}/rule-settings/${key}`, 'PUT', {}, {}, {}, {}, ruleSettingsMock, ['application/json'], ['application/json'])
      .and.returnValue(Promise.resolve(mockedRuleSettingsEntry));

    const result = await folderRulesService.updateRuleSettings(nodeId, key, ruleSettingsMock);
    expect(result).toEqual(ruleSettingsMock);
  });

  it('should handle rule with null simpleConditions', () => {
    const mockResponse = {
      list: {
        entries: [
          {
            entry: {
              id: 'test-rule',
              name: 'Test Rule',
              conditions: {
                simpleConditions: null
              }
            }
          }
        ],
        pagination: { hasMoreItems: false }
      }
    };

    apiClientSpy.callApi.and.returnValue(of(mockResponse));

    folderRulesService.getRules('folder-id', 'ruleset-id').subscribe((result) => {
      expect(result.rules[0].conditions.simpleConditions).toEqual([]);
    });

    expect(apiClientSpy.callApi).toHaveBeenCalledWith(
      '/nodes/folder-id/rule-sets/ruleset-id/rules?skipCount=0&maxItems=100',
      'GET',
      {},
      {},
      {},
      {},
      {},
      ['application/json'],
      ['application/json']
    );
  });

  it('should handle nested composite conditions when getting rules', () => {
    const mockResponse = {
      list: {
        entries: [
          {
            entry: {
              id: 'test-rule',
              name: 'Test Rule',
              conditions: {
                inverted: false,
                booleanMode: 'and',
                simpleConditions: [],
                compositeConditions: [
                  {
                    inverted: true,
                    booleanMode: 'or',
                    simpleConditions: [{ field: 'cm:title', comparator: 'contains', parameter: 'test' }],
                    compositeConditions: [
                      {
                        inverted: false,
                        booleanMode: 'and',
                        simpleConditions: [{ field: 'cm:description', comparator: 'equals', parameter: 'nested' }],
                        compositeConditions: []
                      }
                    ]
                  }
                ]
              }
            }
          }
        ],
        pagination: { hasMoreItems: false }
      }
    };

    apiClientSpy.callApi.and.returnValue(of(mockResponse));

    folderRulesService.getRules('folder-id', 'ruleset-id').subscribe((result) => {
      const conditions = result.rules[0].conditions;

      expect(conditions.compositeConditions[0].inverted).toBe(true);
      expect(conditions.compositeConditions[0].booleanMode).toBe('or');
      expect(conditions.compositeConditions[0].compositeConditions[0].inverted).toBe(false);
      expect(conditions.compositeConditions[0].compositeConditions[0].booleanMode).toBe('and');
    });
  });

  it('should create empty rule for form with options properties removed', () => {
    const result = FolderRulesService.emptyRuleForForm;

    expect(result).toEqual({
      id: '',
      name: '',
      description: '',
      isShared: false,
      triggers: ['inbound'],
      conditions: FolderRulesService.emptyCompositeCondition,
      actions: [],
      options: FolderRulesService.emptyRuleOptions
    });
  });
});
