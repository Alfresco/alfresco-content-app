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
import { dummyResponse, dummyRules } from '../mock/rules.mock';
import { NodeInfo } from '@alfresco/aca-shared/store';
import { ContentApiService } from '@alfresco/aca-shared';
import { dummyGetNodeResponse, dummyNodeInfo } from '../mock/node.mock';

describe('FolderRulesService', () => {
  let folderRulesService: FolderRulesService;
  let contentApi: ContentApiService;
  let rulesPromise: Promise<Partial<Rule>[]>;
  let folderInfoPromise: Promise<NodeInfo>;
  let deletedRulePromise: Promise<string>;
  let rules: Partial<Rule>[];
  let folderInfo: NodeInfo;
  let deletedRule: string;
  let apiCallSpy;
  let getNodeSpy;

  const nodeId = '********-fake-node-****-********';
  const ruleId = '********-fake-rule-****-********';
  const ruleSetId = '-default-';
  const params = [{}, {}, {}, {}, {}, ['application/json'], ['application/json']];
  const paramsWithBody = [{}, {}, {}, {}, dummyRules[0], ['application/json'], ['application/json']];

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule],
      providers: [FolderRulesService, ContentApiService]
    });
    folderRulesService = TestBed.inject<FolderRulesService>(FolderRulesService);
  });

  describe('loadRules', () => {
    beforeEach(async () => {
      contentApi = TestBed.inject<ContentApiService>(ContentApiService);

      apiCallSpy = spyOn<any>(folderRulesService, 'apiCall')
        .withArgs(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules`, 'GET', params)
        .and.returnValue(of(dummyResponse) as any);
      getNodeSpy = spyOn<any>(contentApi, 'getNode').and.returnValue(of(dummyGetNodeResponse) as any);

      rulesPromise = folderRulesService.rulesListing$.pipe(take(2)).toPromise();
      folderInfoPromise = folderRulesService.folderInfo$.pipe(take(2)).toPromise();

      folderRulesService.loadRules(nodeId, ruleSetId);

      rules = await rulesPromise;
      folderInfo = await folderInfoPromise;
    });

    it('should format and set the data', async () => {
      expect(rules).toBeTruthy('rulesListing$ is empty');
      expect(folderInfo).toBeTruthy('folderInfo$ is empty');
      expect(rules.length).toBe(2, 'rulesListing$ size is wrong');
      expect(rules).toEqual(dummyRules, 'The list of rules is incorrectly formatted');
      expect(folderInfo).toEqual(dummyNodeInfo, 'The node info is wrong');
      expect(apiCallSpy).toHaveBeenCalledTimes(1);
      expect(apiCallSpy).toHaveBeenCalledWith(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules`, 'GET', params);
      expect(getNodeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteRule', () => {
    beforeEach(async () => {
      apiCallSpy = spyOn<any>(folderRulesService, 'apiCall')
        .withArgs(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules/${ruleId}`, 'DELETE', params)
        .and.returnValue(ruleId);

      deletedRulePromise = folderRulesService.deletedRuleId$.pipe(take(2)).toPromise();

      folderRulesService.deleteRule(nodeId, ruleId, ruleSetId);

      deletedRule = await deletedRulePromise;
    });

    it('should delete a rule and return its id', async () => {
      expect(deletedRule).toBeTruthy('rule has not been deleted');
      expect(deletedRule).toBe(ruleId, 'wrong id of deleted rule');
      expect(apiCallSpy).toHaveBeenCalledTimes(1);
      expect(apiCallSpy).toHaveBeenCalledWith(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules/${ruleId}`, 'DELETE', params);
    });
  });

  describe('toggleRule', () => {
    beforeEach(async () => {
      apiCallSpy = spyOn<any>(folderRulesService, 'apiCall')
        .withArgs(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules/${ruleId}`, 'PUT', paramsWithBody)
        .and.returnValue([]);

      folderRulesService.toggleRule(nodeId, ruleId, dummyRules[0]);
    });

    it('should send correct PUT request', async () => {
      expect(apiCallSpy).toHaveBeenCalled();
      expect(apiCallSpy).toHaveBeenCalledWith(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules/${ruleId}`, 'PUT', paramsWithBody);
    });
  });

  describe('createRule', () => {
    beforeEach(async () => {
      spyOn<any>(folderRulesService, 'apiCall')
        .withArgs(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules`, 'POST', paramsWithBody)
        .and.returnValue(Promise.resolve(dummyRules[0]));
    });

    it('should send correct POST request and return created rule', async () => {
      const result = await folderRulesService.createRule(nodeId, dummyRules[0]);
      expect(result).toEqual(dummyRules[0]);
    });
  });

  it('should send correct PUT request to update rule and return it', async () => {
    spyOn<any>(folderRulesService, 'apiCall')
      .withArgs(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules/${ruleId}`, 'PUT', paramsWithBody)
      .and.returnValue(Promise.resolve(dummyRules[0]));

    const result = await folderRulesService.updateRule(nodeId, ruleId, dummyRules[0]);
    expect(result).toEqual(dummyRules[0]);
  });
});
