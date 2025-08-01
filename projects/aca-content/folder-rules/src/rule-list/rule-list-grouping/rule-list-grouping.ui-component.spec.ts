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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RuleListGroupingUiComponent } from './rule-list-grouping.ui-component';
import { ruleListGroupingItemsMock, rulesMock } from '../../mock/rules.mock';
import { NoopTranslateModule, UnitTestingUtils } from '@alfresco/adf-core';
import { RuleSet } from '../../model/rule-set.model';

describe('RuleListGroupingUiComponent', () => {
  let component: RuleListGroupingUiComponent;
  let fixture: ComponentFixture<RuleListGroupingUiComponent>;
  let unitTestingUtils: UnitTestingUtils;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, RuleListGroupingUiComponent]
    });

    fixture = TestBed.createComponent(RuleListGroupingUiComponent);
    component = fixture.componentInstance;
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
  });

  it('should display the list of rules', () => {
    expect(component).toBeTruthy();

    component.items = ruleListGroupingItemsMock;

    fixture.detectChanges();

    const rules = unitTestingUtils.getAllByCSS('.aca-rule-list-item');

    expect(rules).toBeTruthy('Could not find rules');
    expect(rules.length).toBe(2, 'Unexpected number of rules');

    const name = unitTestingUtils.getByCSS('.aca-rule-list-item:first-child .aca-rule-list-item__header__name');
    const description = unitTestingUtils.getByCSS('.aca-rule-list-item:first-child .aca-rule-list-item__description');

    expect(name.nativeElement.textContent).toBe(rulesMock[0].name);
    expect(description.nativeElement.textContent).toBe(rulesMock[0].description);
  });

  it('should emit selectRule event with rule when onRuleClicked is called', () => {
    spyOn(component.selectRule, 'emit');
    const mockRule = rulesMock[0];

    component.onRuleClicked(mockRule);

    expect(component.selectRule.emit).toHaveBeenCalledWith(mockRule);
  });

  it('should return true when rule is selected', () => {
    const mockRule = rulesMock[0];
    component.selectedRule = mockRule;

    const result = component.isSelected(mockRule);

    expect(result).toBe(true);
  });

  it('should return false when rule is not selected', () => {
    const [mockRule, differentRule] = rulesMock;
    component.selectedRule = mockRule;

    const result = component.isSelected(differentRule);

    expect(result).toBe(false);
  });

  it('should return false when no rule is selected', () => {
    const mockRule = rulesMock[0];
    component.selectedRule = null;

    const result = component.isSelected(mockRule);

    expect(result).toBe(false);
  });

  it('should emit ruleEnabledChanged event with tuple when onEnabledChanged is called', () => {
    spyOn(component.ruleEnabledChanged, 'emit');
    const mockRule = rulesMock[0];
    const isEnabled = true;

    component.onEnabledChanged(mockRule, isEnabled);

    expect(component.ruleEnabledChanged.emit).toHaveBeenCalledWith([mockRule, isEnabled]);
  });

  it('should emit loadMoreRules event with ruleSet when onClickLoadMoreRules is called', () => {
    spyOn(component.loadMoreRules, 'emit');
    const mockRuleSet = { id: 'test-rule-set' } as RuleSet;

    component.onClickLoadMoreRules(mockRuleSet);

    expect(component.loadMoreRules.emit).toHaveBeenCalledWith(mockRuleSet);
  });

  it('should emit loadMoreRuleSets event when onClickLoadMoreRuleSets is called', () => {
    spyOn(component.loadMoreRuleSets, 'emit');

    component.onClickLoadMoreRuleSets();

    expect(component.loadMoreRuleSets.emit).toHaveBeenCalled();
  });
});
