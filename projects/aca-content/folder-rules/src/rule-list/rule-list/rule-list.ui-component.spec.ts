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

import { RuleListUiComponent } from './rule-list.ui-component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopTranslateModule, UnitTestingUtils } from '@alfresco/adf-core';
import { ownedRuleSetMock, ruleSetsMock, ruleSetWithLinkMock } from '../../mock/rule-sets.mock';
import { owningFolderIdMock } from '../../mock/node.mock';
import { of } from 'rxjs';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';
import { Rule } from '../../model/rule.model';
import { RuleSet } from '../../model/rule-set.model';

describe('RuleListUiComponent', () => {
  let fixture: ComponentFixture<RuleListUiComponent>;
  let component: RuleListUiComponent;
  let unitTestingUtils: UnitTestingUtils;

  const getMainRuleSetTitleText = (): string => unitTestingUtils.getInnerTextByDataAutomationId('main-rule-set-title');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, RuleListUiComponent],
      providers: [{ provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }]
    });

    fixture = TestBed.createComponent(RuleListUiComponent);
    component = fixture.componentInstance;
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);

    component.folderId = owningFolderIdMock;
    component.inheritedRuleSets = ruleSetsMock;
  });

  it('should show "Rules from current folder" as a title if the main rule set is owned', () => {
    component.mainRuleSet$ = of(ownedRuleSetMock);
    fixture.detectChanges();

    expect(getMainRuleSetTitleText()).toBe('ACA_FOLDER_RULES.RULE_LIST.OWNED_RULES');
  });

  it('should show "Rules from linked folder" as a title if the main rule set is linked', () => {
    component.mainRuleSet$ = of(ruleSetWithLinkMock);
    fixture.detectChanges();

    expect(getMainRuleSetTitleText()).toBe('ACA_FOLDER_RULES.RULE_LIST.LINKED_RULES');
  });

  it('should add loading item when both ruleSetsLoading and hasMoreRuleSets are true', () => {
    component.inheritedRuleSets = ruleSetsMock;
    component.mainRuleSet$ = of(ruleSetWithLinkMock);
    component.ruleSetsLoading = true;
    component.hasMoreRuleSets = true;

    component.ngOnInit();

    const loadingItem = component.inheritedRuleSetGroupingItems.find((item) => item.type === 'loading');
    expect(loadingItem).toBeDefined();
    expect(loadingItem.type).toBe('loading');

    const loadMoreItem = component.inheritedRuleSetGroupingItems.find((item) => item.type === 'load-more-rule-sets');
    expect(loadMoreItem).toBeUndefined();
  });

  it('should add loading item when both loadingRules and hasMoreRules are true', () => {
    const ruleSetWithBothFlags: RuleSet = {
      ...ownedRuleSetMock,
      loadingRules: true,
      hasMoreRules: true
    };

    const result = component.getRuleSetGroupingItems(ruleSetWithBothFlags, false);

    const loadingItem = result.find((item) => item.type === 'loading');
    expect(loadingItem).toBeDefined();
    expect(loadingItem.type).toBe('loading');

    const loadMoreItem = result.find((item) => item.type === 'load-more-rules');
    expect(loadMoreItem).toBeUndefined();
  });

  it('should not add any special items when neither loadingRules nor hasMoreRules are true', () => {
    const ruleSetWithoutFlags: RuleSet = {
      ...ownedRuleSetMock,
      loadingRules: false,
      hasMoreRules: false
    };

    const result = component.getRuleSetGroupingItems(ruleSetWithoutFlags, false);

    const specialItems = result.filter((item) => item.type === 'loading' || item.type === 'load-more-rules');
    expect(specialItems.length).toBe(0);
  });

  it('should emit loadMoreRuleSets event when onLoadMoreRuleSets is called', () => {
    spyOn(component.loadMoreRuleSets, 'emit');

    component.onLoadMoreRuleSets();

    expect(component.loadMoreRuleSets.emit).toHaveBeenCalledWith();
  });

  it('should emit loadMoreRules event with ruleSet when onLoadMoreRules is called', () => {
    spyOn(component.loadMoreRules, 'emit');
    const mockRuleSet = ownedRuleSetMock;

    component.onLoadMoreRules(mockRuleSet);

    expect(component.loadMoreRules.emit).toHaveBeenCalledWith(mockRuleSet);
  });

  it('should emit selectRule event with rule when onSelectRule is called', () => {
    spyOn(component.selectRule, 'emit');
    const mockRule = ownedRuleSetMock.rules[0];

    component.onSelectRule(mockRule);

    expect(component.selectRule.emit).toHaveBeenCalledWith(mockRule);
  });

  it('should stop event propagation and emit ruleSetEditLinkClicked with mainRuleSet when onRuleSetEditLinkClicked is called', () => {
    spyOn(component.ruleSetEditLinkClicked, 'emit');
    const mockEvent = jasmine.createSpyObj<Event>('Event', ['stopPropagation']);
    component.mainRuleSet = ownedRuleSetMock;

    component.onRuleSetEditLinkClicked(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(component.ruleSetEditLinkClicked.emit).toHaveBeenCalledWith(ownedRuleSetMock);
  });

  it('should emit ruleEnabledChanged event with tuple when onRuleEnabledChanged is called', () => {
    spyOn(component.ruleEnabledChanged, 'emit');
    const mockRule = ownedRuleSetMock.rules[0];
    const event: [Rule, boolean] = [mockRule, true];

    component.onRuleEnabledChanged(event);

    expect(component.ruleEnabledChanged.emit).toHaveBeenCalledWith(event);
  });

  it('should stop event propagation and emit ruleSetUnlinkClicked with mainRuleSet when onRuleSetUnlinkClicked is called', () => {
    spyOn(component.ruleSetUnlinkClicked, 'emit');
    const mockEvent = jasmine.createSpyObj<Event>('Event', ['stopPropagation']);
    component.mainRuleSet = ownedRuleSetMock;

    component.onRuleSetUnlinkClicked(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(component.ruleSetUnlinkClicked.emit).toHaveBeenCalledWith(ownedRuleSetMock);
  });
});
