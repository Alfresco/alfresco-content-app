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

import { FolderRuleSetsService } from './folder-rule-sets.service';
import { TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '@alfresco/adf-core';
import { FolderRulesService } from './folder-rules.service';
import { ContentApiService } from '@alfresco/aca-shared';
import { getOtherFolderEntryMock, getOwningFolderEntryMock, otherFolderIdMock, owningFolderIdMock, owningFolderMock } from '../mock/node.mock';
import { of } from 'rxjs';
import { getRuleSetsResponseMock, ruleSetsMock } from '../mock/rule-sets.mock';
import { take } from 'rxjs/operators';
import { inheritedRulesMock, linkedRulesMock, ownedRulesMock, ruleMock } from '../mock/rules.mock';

describe('FolderRuleSetsService', () => {
  let folderRuleSetsService: FolderRuleSetsService;
  let folderRulesService: FolderRulesService;
  let contentApiService: ContentApiService;

  let callApiSpy: jasmine.Spy;
  let getNodeSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule],
      providers: [FolderRuleSetsService, FolderRulesService, ContentApiService]
    });

    folderRuleSetsService = TestBed.inject(FolderRuleSetsService);
    folderRulesService = TestBed.inject(FolderRulesService);
    contentApiService = TestBed.inject(ContentApiService);

    callApiSpy = spyOn<any>(folderRuleSetsService, 'callApi');
    spyOn<any>(folderRulesService, 'getRules')
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
    callApiSpy.and.returnValue(of(getRuleSetsResponseMock));
    // take(2), because: 1 = init of the BehaviourSubject, 2 = in subscribe
    const folderInfoPromise = folderRuleSetsService.folderInfo$.pipe(take(2)).toPromise();

    folderRuleSetsService.loadRuleSets(owningFolderIdMock);
    const folderInfo = await folderInfoPromise;

    expect(getNodeSpy).toHaveBeenCalledWith(owningFolderIdMock);
    expect(folderInfo).toEqual(owningFolderMock);
  });

  it('should load rule sets of a node', async () => {
    callApiSpy.and.returnValue(of(getRuleSetsResponseMock));
    // take(3), because: 1 = init of the BehaviourSubject, 2 = reinitialise at beginning of loadRuleSets, 3 = in subscribe
    const ruleSetListingPromise = folderRuleSetsService.ruleSetListing$.pipe(take(3)).toPromise();
    const hasMoreRuleSetsPromise = folderRuleSetsService.hasMoreRuleSets$.pipe(take(3)).toPromise();

    folderRuleSetsService.loadRuleSets(owningFolderIdMock);
    const ruleSets = await ruleSetListingPromise;
    const hasMoreRuleSets = await hasMoreRuleSetsPromise;

    expect(callApiSpy).toHaveBeenCalledWith(
      `/nodes/${owningFolderIdMock}/rule-sets?include=isLinkedTo,owningFolder,linkedToBy&skipCount=0&maxItems=100`,
      'GET'
    );
    expect(ruleSets).toEqual(ruleSetsMock);
    expect(hasMoreRuleSets).toEqual(false);
  });

  it('should select the first rule of the owned rule set of the folder', async () => {
    callApiSpy.and.returnValue(of(getRuleSetsResponseMock));
    const selectRuleSpy = spyOn(folderRulesService, 'selectRule');
    // take(3), because: 1 = init of the BehaviourSubject, 2 = reinitialise at beginning of loadRuleSets, 3 = in subscribe
    const ruleSetListingPromise = folderRuleSetsService.ruleSetListing$.pipe(take(3)).toPromise();

    folderRuleSetsService.loadRuleSets(owningFolderIdMock);
    await ruleSetListingPromise;

    expect(selectRuleSpy).toHaveBeenCalledWith(ruleMock('owned-rule-1'));
  });
});
