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

import { FolderRuleSetsService } from './folder-rule-sets.service';
import { TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '@alfresco/adf-core';
import { FolderRulesService } from './folder-rules.service';
import { ContentApiService } from '@alfresco/aca-shared';
import { getOtherFolderEntryMock, getOwningFolderEntryMock, otherFolderIdMock, owningFolderIdMock, owningFolderMock } from '../mock/node.mock';
import { of } from 'rxjs';
import { getDefaultRuleSetResponseMock, getRuleSetsResponseMock, inheritedRuleSetMock, ownedRuleSetMock } from '../mock/rule-sets.mock';
import { take } from 'rxjs/operators';
import { inheritedRulesMock, linkedRulesMock, ownedRulesMock, ruleMock } from '../mock/rules.mock';

describe('FolderRuleSetsService', () => {
  let folderRuleSetsService: FolderRuleSetsService;
  let folderRulesService: FolderRulesService;
  let contentApiService: ContentApiService;

  let callApiSpy: jasmine.Spy;
  let getRulesSpy: jasmine.Spy;
  let getNodeSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule],
      providers: [FolderRuleSetsService, FolderRulesService, ContentApiService]
    });

    folderRuleSetsService = TestBed.inject(FolderRuleSetsService);
    folderRulesService = TestBed.inject(FolderRulesService);
    contentApiService = TestBed.inject(ContentApiService);

    callApiSpy = spyOn<any>(folderRuleSetsService, 'callApi')
      .withArgs(`/nodes/${owningFolderIdMock}/rule-sets/-default-?include=isLinkedTo,owningFolder,linkedToBy`, 'GET')
      .and.returnValue(of(getDefaultRuleSetResponseMock))
      .withArgs(`/nodes/${owningFolderIdMock}/rule-sets?include=isLinkedTo,owningFolder,linkedToBy&skipCount=0&maxItems=100`, 'GET')
      .and.returnValue(of(getRuleSetsResponseMock))
      .and.stub();
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
  });

  it(`should load node info when loading the node's rule sets`, async () => {
    // take(2), because: 1 = init of the BehaviourSubject, 2 = in subscribe
    const folderInfoPromise = folderRuleSetsService.folderInfo$.pipe(take(2)).toPromise();

    folderRuleSetsService.loadRuleSets(owningFolderIdMock);
    const folderInfo = await folderInfoPromise;

    expect(getNodeSpy).toHaveBeenCalledWith(owningFolderIdMock);
    expect(folderInfo).toEqual(owningFolderMock);
  });

  it('should load the main rule set (main or linked)', async () => {
    // take(3), because: 1 = init of the BehaviourSubject, 2 = reinitialise at beginning of loadRuleSets, 3 = in subscribe
    const mainRuleSetPromise = folderRuleSetsService.mainRuleSet$.pipe(take(3)).toPromise();

    folderRuleSetsService.loadRuleSets(owningFolderIdMock);
    const ruleSet = await mainRuleSetPromise;

    expect(callApiSpy).toHaveBeenCalledWith(`/nodes/${owningFolderIdMock}/rule-sets/-default-?include=isLinkedTo,owningFolder,linkedToBy`, 'GET');
    expect(ruleSet).toEqual(ownedRuleSetMock);
  });

  it('should load inherited rule sets of a node and filter out owned or inherited rule sets', async () => {
    // take(3), because: 1 = init of the BehaviourSubject, 2 = reinitialise at beginning of loadRuleSets, 3 = in subscribe
    const inheritedRuleSetsPromise = folderRuleSetsService.inheritedRuleSets$.pipe(take(3)).toPromise();
    const hasMoreRuleSetsPromise = folderRuleSetsService.hasMoreRuleSets$.pipe(take(3)).toPromise();

    folderRuleSetsService.loadRuleSets(owningFolderIdMock);
    const ruleSets = await inheritedRuleSetsPromise;
    const hasMoreRuleSets = await hasMoreRuleSetsPromise;

    expect(callApiSpy).toHaveBeenCalledWith(
      `/nodes/${owningFolderIdMock}/rule-sets?include=isLinkedTo,owningFolder,linkedToBy&skipCount=0&maxItems=100`,
      'GET'
    );
    expect(ruleSets).toEqual([inheritedRuleSetMock]);
    expect(getRulesSpy).toHaveBeenCalledWith(owningFolderIdMock, jasmine.anything());
    expect(hasMoreRuleSets).toEqual(false);
  });

  it('should select the first rule of the owned rule set of the folder', async () => {
    const selectRuleSpy = spyOn(folderRulesService, 'selectRule');
    // take(3), because: 1 = init of the BehaviourSubject, 2 = reinitialise at beginning of loadRuleSets, 3 = in subscribe
    const ruleSetListingPromise = folderRuleSetsService.inheritedRuleSets$.pipe(take(3)).toPromise();

    folderRuleSetsService.loadRuleSets(owningFolderIdMock);
    await ruleSetListingPromise;

    expect(selectRuleSpy).toHaveBeenCalledWith(ruleMock('owned-rule-1'));
  });

  it('should select a different rule when removing a rule', () => {
    const selectRuleSpy = spyOn(folderRulesService, 'selectRule');
    folderRuleSetsService['mainRuleSet'] = JSON.parse(JSON.stringify(ownedRuleSetMock));
    folderRuleSetsService['inheritedRuleSets'] = JSON.parse(JSON.stringify([inheritedRuleSetMock]));

    folderRuleSetsService.removeRuleFromMainRuleSet('owned-rule-1-id');

    expect(selectRuleSpy).toHaveBeenCalledWith(ruleMock('owned-rule-2'));

    selectRuleSpy.calls.reset();
    folderRuleSetsService.removeRuleFromMainRuleSet('owned-rule-2-id');

    expect(selectRuleSpy).toHaveBeenCalledWith(ruleMock('inherited-rule-1'));
  });

  it('should send a POST request to create a new link between two folders', async () => {
    await folderRuleSetsService.createRuleSetLink('folder-1-id', 'folder-2-id');
    expect(callApiSpy).toHaveBeenCalledWith('/nodes/folder-1-id/rule-set-links', 'POST', {
      id: 'folder-2-id'
    });
  });

  it('should send a DELETE request to delete a link between two folders', async () => {
    await folderRuleSetsService.deleteRuleSetLink('folder-1-id', 'rule-set-1-id');
    expect(callApiSpy).toHaveBeenCalledWith('/nodes/folder-1-id/rule-set-links/rule-set-1-id', 'DELETE');
  });
});
