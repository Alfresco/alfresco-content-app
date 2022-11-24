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

import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Rule } from '../../model/rule.model';
import { RuleGroupingItem } from '../../model/rule-grouping-item.model';
import { RuleSet } from '../../model/rule-set.model';

@Component({
  selector: 'aca-rule-list-grouping',
  templateUrl: 'rule-list-grouping.ui-component.html',
  styleUrls: ['rule-list-grouping.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-list-grouping' }
})
export class RuleListGroupingUiComponent {
  @Input()
  items: RuleGroupingItem[] = [];
  @Input()
  selectedRule: Rule = null;
  @Input()
  showEnabledToggles = false;

  @Output()
  selectRule = new EventEmitter<Rule>();
  @Output()
  ruleEnabledChanged = new EventEmitter<[Rule, boolean]>();
  @Output()
  loadMoreRules = new EventEmitter<RuleSet>();
  @Output()
  loadMoreRuleSets = new EventEmitter<void>();

  onRuleClicked(rule: Rule): void {
    this.selectRule.emit(rule);
  }

  isSelected(rule): boolean {
    return rule.id === this.selectedRule?.id;
  }

  onEnabledChanged(rule: Rule, isEnabled: boolean) {
    this.ruleEnabledChanged.emit([rule, isEnabled]);
  }

  onClickLoadMoreRules(ruleSet: RuleSet) {
    this.loadMoreRules.emit(ruleSet);
  }

  onClickLoadMoreRuleSets() {
    this.loadMoreRuleSets.emit();
  }
}
