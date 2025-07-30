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

import { FolderRuleSetsService } from './folder-rule-sets.service';
import { TestBed } from '@angular/core/testing';
import { FolderRulesService } from './folder-rules.service';
import { ContentApiService } from '@alfresco/aca-shared';
import { getOtherFolderEntryMock, getOwningFolderEntryMock, otherFolderIdMock, owningFolderIdMock, owningFolderMock } from '../mock/node.mock';
import { filter, firstValueFrom, lastValueFrom, of, skip, throwError } from 'rxjs';
import { getDefaultRuleSetResponseMock, getRuleSetsResponseMock, inheritedRuleSetMock, ownedRuleSetMock } from '../mock/rule-sets.mock';
import { take } from 'rxjs/operators';
import { inheritedRulesMock, linkedRulesMock, ownedRulesMock, ruleMock } from '../mock/rules.mock';
import { AlfrescoApiService } from '@alfresco/adf-content-services';
import { NoopTranslateModule } from '@alfresco/adf-core';
import { HttpErrorResponse } from '@angular/common/http';
import { Rule } from '../model/rule.model';

describe('FolderRuleSetsService', () => {
  let folderRuleSetsService: FolderRuleSetsService;
  let folderRulesService: FolderRulesService;
  let contentApiService: ContentApiService;

  let apiClientSpy: jasmine.SpyObj<{ callApi: jasmine.Spy }>;
  let getRulesSpy: jasmine.Spy;
  let getNodeSpy: jasmine.Spy;

  beforeEach(() => {
    apiClientSpy = jasmine.createSpyObj('contentPrivateClient', ['callApi']);

    TestBed.configureTestingModule({
      imports: [NoopTranslateModule],
      providers: [
        ContentApiService,
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

    folderRuleSetsService = TestBed.inject(FolderRuleSetsService);
    folderRulesService = TestBed.inject(FolderRulesService);
    contentApiService = TestBed.inject(ContentApiService);

    apiClientSpy.callApi
      .withArgs(
        `/nodes/${owningFolderIdMock}/rule-sets/-default-?include=isLinkedTo,owningFolder,linkedToBy`,
        'GET',
        {},
        {},
        {},
        {},
        {},
        ['application/json'],
        ['application/json']
      )
      .and.returnValue(of(getDefaultRuleSetResponseMock))
      .withArgs(
        `/nodes/${owningFolderIdMock}/rule-sets?include=isLinkedTo,owningFolder,linkedToBy&skipCount=0&maxItems=100`,
        'GET',
        {},
        {},
        {},
        {},
        {},
        ['application/json'],
        ['application/json']
      )
      .and.returnValue(of(getRuleSetsResponseMock))
      .withArgs('/nodes/folder-1-id/rule-set-links', 'POST', {}, {}, {}, {}, { id: 'folder-2-id' }, ['application/json'], ['application/json'])
      .and.returnValue(of({}))
      .withArgs('/nodes/folder-1-id/rule-set-links/rule-set-1-id', 'DELETE', {}, {}, {}, {}, {}, ['application/json'], ['application/json'])
      .and.returnValue(of({}));

    getRulesSpy = spyOn<any>(folderRulesService, 'getRules')
      .withArgs(jasmine.anything(), 'rule-set-no-links')
      .and.returnValue(of({ rules: ownedRulesMock, hasMoreRules: false }))
      .withArgs(jasmine.anything(), 'rule-set-with-link')
      .and.returnValue(of({ rules: linkedRulesMock, hasMoreRules: false }))
      .withArgs(jasmine.anything(), 'inherited-rule-set')
      .and.returnValue(of({ rules: inheritedRulesMock, hasMoreRules: false }));

    getNodeSpy = spyOn(contentApiService, 'getNode')
      .withArgs(owningFolderIdMock)
      .and.returnValue(of(getOwningFolderEntryMock))
      .withArgs(otherFolderIdMock)
      .and.returnValue(of(getOtherFolderEntryMock));

    spyOn(folderRulesService, 'selectRule');
  });

  it('should have an initial value of null for selectedRuleSet$', async () => {
    const selectedRuleSetPromise = firstValueFrom(folderRuleSetsService.selectedRuleSet$.pipe(take(1)));
    const selectedRuleSet = await selectedRuleSetPromise;
    expect(selectedRuleSet).toBeNull();
  });

  it('should select the first rule of the owned rule set of the folder', async () => {
    // take(3), because: 1 = init of the BehaviourSubject, 2 = reinitialise at beginning of loadRuleSets, 3 = in subscribe
    const mainRuleSetPromise = firstValueFrom(folderRuleSetsService.mainRuleSet$.pipe(skip(3), take(1)));

    folderRuleSetsService.loadRuleSets(owningFolderIdMock);
    folderRuleSetsService.removeRuleFromMainRuleSet('owned-rule-1-id');
    const mainRuleSet = await mainRuleSetPromise;

    expect(mainRuleSet.rules[0].id).toBe('owned-rule-2-id');
    expect(folderRulesService.selectRule).toHaveBeenCalledWith(ruleMock('owned-rule-1'));
  });

  it('should not call selectRule on removeRuleFromMainRuleSet if mainRuleSet not set', async () => {
    folderRuleSetsService.removeRuleFromMainRuleSet('owned-rule-1-id');

    expect(folderRulesService.selectRule).not.toHaveBeenCalled();
  });

  it(`should load node info when loading the node's rule sets`, async () => {
    // take(2), because: 1 = init of the BehaviourSubject, 2 = in subscribe
    const folderInfoPromise = lastValueFrom(folderRuleSetsService.folderInfo$.pipe(take(2)));

    folderRuleSetsService.loadRuleSets(owningFolderIdMock);
    const folderInfo = await folderInfoPromise;

    expect(getNodeSpy).toHaveBeenCalledWith(owningFolderIdMock);
    expect(folderInfo).toEqual(owningFolderMock);
  });

  it('should load the main rule set (main or linked)', async () => {
    // take(3), because: 1 = init of the BehaviourSubject, 2 = reinitialise at beginning of loadRuleSets, 3 = in subscribe
    const mainRuleSetPromise = lastValueFrom(folderRuleSetsService.mainRuleSet$.pipe(take(3)));

    folderRuleSetsService.loadRuleSets(owningFolderIdMock);
    const ruleSet = await mainRuleSetPromise;

    expect(apiClientSpy.callApi).toHaveBeenCalledWith(
      `/nodes/${owningFolderIdMock}/rule-sets/-default-?include=isLinkedTo,owningFolder,linkedToBy`,
      'GET',
      {},
      {},
      {},
      {},
      {},
      ['application/json'],
      ['application/json']
    );
    expect(ruleSet).toEqual(ownedRuleSetMock);
  });

  it('should load inherited rule sets of a node and filter out owned or inherited rule sets', async () => {
    // take(3), because: 1 = init of the BehaviourSubject, 2 = reinitialise at beginning of loadRuleSets, 3 = in subscribe
    const inheritedRuleSetsPromise = lastValueFrom(folderRuleSetsService.inheritedRuleSets$.pipe(take(3)));
    const hasMoreRuleSetsPromise = lastValueFrom(folderRuleSetsService.hasMoreRuleSets$.pipe(take(3)));

    folderRuleSetsService.loadRuleSets(owningFolderIdMock);
    const ruleSets = await inheritedRuleSetsPromise;
    const hasMoreRuleSets = await hasMoreRuleSetsPromise;

    expect(apiClientSpy.callApi).toHaveBeenCalledWith(
      `/nodes/${owningFolderIdMock}/rule-sets?include=isLinkedTo,owningFolder,linkedToBy&skipCount=0&maxItems=100`,
      'GET',
      {},
      {},
      {},
      {},
      {},
      ['application/json'],
      ['application/json']
    );
    expect(ruleSets).toEqual([inheritedRuleSetMock]);
    expect(getRulesSpy).toHaveBeenCalledWith(owningFolderIdMock, jasmine.anything());
    expect(hasMoreRuleSets).toEqual(false);
  });

  it('should append additional inherited rule sets on loadMoreInheritedRuleSets', (done) => {
    folderRuleSetsService.loadRuleSets(owningFolderIdMock);

    folderRuleSetsService.inheritedRuleSets$.pipe(take(3)).subscribe(async () => {
      const additionalRuleSet = {
        ...inheritedRuleSetMock,
        id: 'additional-inherited-rule-set',
        owningFolder: otherFolderIdMock
      };

      apiClientSpy.callApi
        .withArgs(
          `/nodes/${owningFolderIdMock}/rule-sets?include=isLinkedTo,owningFolder,linkedToBy&skipCount=1&maxItems=100`,
          'GET',
          {},
          {},
          {},
          {},
          {},
          ['application/json'],
          ['application/json']
        )
        .and.returnValue(
          of({
            list: {
              entries: [{ entry: additionalRuleSet }],
              pagination: { hasMoreItems: false }
            }
          })
        );

      getRulesSpy
        .withArgs(jasmine.anything(), 'additional-inherited-rule-set')
        .and.returnValue(of({ rules: inheritedRulesMock, hasMoreRules: false }));

      let updateCount = 0;
      const subscription = folderRuleSetsService.inheritedRuleSets$.subscribe((ruleSets) => {
        updateCount++;
        if (updateCount === 2) {
          subscription.unsubscribe();

          expect(ruleSets[0]).toEqual(inheritedRuleSetMock);
          expect(ruleSets[1].id).toBe('additional-inherited-rule-set');

          expect(apiClientSpy.callApi).toHaveBeenCalledWith(
            `/nodes/${owningFolderIdMock}/rule-sets?include=isLinkedTo,owningFolder,linkedToBy&skipCount=1&maxItems=100`,
            'GET',
            {},
            {},
            {},
            {},
            {},
            ['application/json'],
            ['application/json']
          );

          done();
        }
      });

      folderRuleSetsService.loadMoreInheritedRuleSets();
    });
  });

  describe('Error handling', () => {
    function testRuleSetApiError(status: number, statusText: string, errorMessage: string, done: DoneFn) {
      const httpError = new HttpErrorResponse({
        status,
        statusText,
        error: { message: errorMessage }
      });

      apiClientSpy.callApi
        .withArgs(
          `/nodes/${owningFolderIdMock}/rule-sets/-default-?include=isLinkedTo,owningFolder,linkedToBy`,
          'GET',
          {},
          {},
          {},
          {},
          {},
          ['application/json'],
          ['application/json']
        )
        .and.returnValue(throwError(() => httpError));

      folderRuleSetsService.mainRuleSet$.pipe(skip(1), take(1)).subscribe((value) => {
        expect(value).toBeNull();
        done();
      });

      folderRuleSetsService.loadRuleSets(owningFolderIdMock, false);
    }

    function testNodeInfoError(service: FolderRuleSetsService, status: number, expectedValue: null | undefined, done: DoneFn) {
      const httpError = new HttpErrorResponse({ status, statusText: status === 404 ? 'Not Found' : 'Failed' });
      getNodeSpy.withArgs(owningFolderIdMock).and.returnValue(throwError(() => httpError));

      service.folderInfo$.pipe(skip(1), take(1)).subscribe((info) => {
        expect(info).toEqual(expectedValue);
        done();
      });

      service.loadRuleSets(owningFolderIdMock, false);
    }

    it('should set main rule set to null on 404 error', (done) => {
      testRuleSetApiError(404, 'Not Found', 'Rule set not found', done);
    });

    it('should set mainRuleSet$ to null on non-404 error', (done) => {
      testRuleSetApiError(400, 'Failed', 'Failed to fetch main rule set', done);
    });

    it('should emit null folderInfo when getNodeInfo fails with 404', (done) => {
      testNodeInfoError(folderRuleSetsService, 404, null, done);
    });

    it('should emit undefined folderInfo on getNodeInfo non-404 error', (done) => {
      testNodeInfoError(folderRuleSetsService, 400, undefined, done);
    });
  });

  it('should emit null folderInfo when nodeId is empty', (done) => {
    apiClientSpy.callApi
      .withArgs(
        `/nodes//rule-sets/-default-?include=isLinkedTo,owningFolder,linkedToBy`,
        'GET',
        {},
        {},
        {},
        {},
        {},
        ['application/json'],
        ['application/json']
      )
      .and.returnValue(throwError(() => new Error('Node ID is empty')));
    folderRuleSetsService.folderInfo$.pipe(skip(1), take(1)).subscribe((info) => {
      expect(info).toBeNull();
      expect(getNodeSpy).not.toHaveBeenCalled();
      done();
    });

    folderRuleSetsService.loadRuleSets('', false);
  });

  it('should add new rule to main rule set', async () => {
    folderRuleSetsService.loadRuleSets(owningFolderIdMock);
    const newRule = ruleMock('new-rule');

    await firstValueFrom(
      folderRuleSetsService.isLoading$.pipe(
        filter((loading) => !loading),
        take(1)
      )
    );

    folderRuleSetsService.addOrUpdateRuleInMainRuleSet(newRule);
    const main = await firstValueFrom(folderRuleSetsService.mainRuleSet$.pipe(take(1)));
    expect(main.rules[2]).toEqual(newRule);
  });

  it('should update existing rule in main rule set', async () => {
    folderRuleSetsService.loadRuleSets(owningFolderIdMock);
    const newRule = { ...ownedRulesMock[0], description: 'new description' } as Rule;
    folderRuleSetsService.addOrUpdateRuleInMainRuleSet(newRule);
    const main = await firstValueFrom(folderRuleSetsService.mainRuleSet$.pipe(take(1)));

    expect(main.rules[0].description).toEqual(newRule.description);
  });

  it('should set main rule set to null if last rules was removed', async () => {
    getRulesSpy.withArgs(jasmine.anything(), 'rule-set-no-links').and.returnValue(of({ rules: [ownedRulesMock[0]], hasMoreRules: false }));

    folderRuleSetsService.loadRuleSets(owningFolderIdMock);

    await firstValueFrom(
      folderRuleSetsService.isLoading$.pipe(
        filter((loading) => !loading),
        take(1)
      )
    );

    folderRuleSetsService.removeRuleFromMainRuleSet('owned-rule-1-id');

    const main = await lastValueFrom(folderRuleSetsService.mainRuleSet$.pipe(take(1)));

    expect(main).toBe(null);
  });

  it('should send a POST request to create a new link between two folders', async () => {
    await folderRuleSetsService.createRuleSetLink('folder-1-id', 'folder-2-id');
    expect(apiClientSpy.callApi).toHaveBeenCalledWith(
      '/nodes/folder-1-id/rule-set-links',
      'POST',
      {},
      {},
      {},
      {},
      { id: 'folder-2-id' },
      ['application/json'],
      ['application/json']
    );
  });

  it('should call refreshMainRuleSet when main rule set is empty', (done) => {
    const newRule = ruleMock('owned-rule-33');
    apiClientSpy.callApi
      .withArgs(
        `/nodes/${owningFolderIdMock}/rule-sets/-default-?include=isLinkedTo,owningFolder,linkedToBy`,
        'GET',
        {},
        {},
        {},
        {},
        {},
        ['application/json'],
        ['application/json']
      )
      .and.returnValue(throwError(() => new Error('Main rule set not found')));

    folderRuleSetsService.loadRuleSets(owningFolderIdMock);

    folderRuleSetsService.mainRuleSet$.pipe(skip(0), take(1)).subscribe((ruleSet) => {
      expect(ruleSet).toBeNull();
      done();
    });

    folderRuleSetsService.addOrUpdateRuleInMainRuleSet(newRule);
  });

  it('should refreshMainRuleSet and select a rule when main rule set exists', () => {
    folderRuleSetsService.loadRuleSets(owningFolderIdMock);
    const newRule = ruleMock('new-rule');

    folderRuleSetsService.refreshMainRuleSet(newRule);

    expect(folderRulesService.selectRule).toHaveBeenCalled();
  });

  it('should send a DELETE request to remove a rule set link', async () => {
    await folderRuleSetsService.deleteRuleSetLink('folder-1-id', 'rule-set-1-id');

    expect(apiClientSpy.callApi).toHaveBeenCalledWith(
      '/nodes/folder-1-id/rule-set-links/rule-set-1-id',
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
});
