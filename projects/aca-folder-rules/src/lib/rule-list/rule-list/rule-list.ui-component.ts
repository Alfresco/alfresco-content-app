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
import { RuleSet } from '../../model/rule-set.model';
import { Rule } from '../../model/rule.model';
import { RuleGroupingItem } from '../../model/rule-grouping-item.model';
import { FolderRuleSetsService } from '../../services/folder-rule-sets.service';

@Component({
  selector: 'aca-rule-list',
  templateUrl: './rule-list.ui-component.html',
  styleUrls: ['./rule-list.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-list' }
})
export class RuleListUiComponent {
  @Input()
  mainRuleSet: RuleSet = null;
  @Input()
  folderId: string;
  @Input()
  inheritedRuleSets: RuleSet[] = [];
  @Input()
  hasMoreRuleSets = false;
  @Input()
  ruleSetsLoading = false;
  @Input()
  selectedRule = null;

  @Output()
  loadMoreRuleSets = new EventEmitter<void>();
  @Output()
  loadMoreRules = new EventEmitter<RuleSet>();
  @Output()
  selectRule = new EventEmitter<Rule>();
  @Output()
  ruleEnabledChanged = new EventEmitter<[Rule, boolean]>();
  @Output()
  ruleSetEditLinkClicked = new EventEmitter<RuleSet>();
  @Output()
  ruleSetUnlinkClicked = new EventEmitter<RuleSet>();

  inheritedRuleSetsExpanded = true;
  mainRuleSetExpanded = true;

  get isMainRuleSetOwned(): boolean {
    return FolderRuleSetsService.isOwnedRuleSet(this.mainRuleSet, this.folderId);
  }

  get mainRuleSetGroupingItems(): RuleGroupingItem[] {
    return this.mainRuleSet ? this.getRuleSetGroupingItems(this.mainRuleSet) : [];
  }

  get inheritedRuleSetGroupingItems(): RuleGroupingItem[] {
    const items = this.inheritedRuleSets.reduce((accumulator: RuleGroupingItem[], currentRuleSet: RuleSet) => {
      accumulator.push(...this.getRuleSetGroupingItems(currentRuleSet));
      return accumulator;
    }, []);
    if (this.ruleSetsLoading || this.hasMoreRuleSets) {
      items.push({
        type: this.ruleSetsLoading ? 'loading' : 'load-more-rule-sets'
      });
    }
    return items;
  }

  getRuleSetGroupingItems(ruleSet: RuleSet): RuleGroupingItem[] {
    const items: RuleGroupingItem[] = ruleSet.rules.map((rule: Rule) => ({
      type: 'rule',
      rule
    }));
    if (ruleSet.loadingRules || ruleSet.hasMoreRules) {
      items.push(
        ruleSet.loadingRules
          ? {
              type: 'loading'
            }
          : {
              type: 'load-more-rules',
              ruleSet
            }
      );
    }
    return items;
  }

  onLoadMoreRuleSets() {
    this.loadMoreRuleSets.emit();
  }

  onLoadMoreRules(ruleSet: RuleSet) {
    this.loadMoreRules.emit(ruleSet);
  }

  onSelectRule(rule: Rule) {
    this.selectRule.emit(rule);
  }

  onRuleEnabledChanged(event: [Rule, boolean]) {
    this.ruleEnabledChanged.emit(event);
  }

  onRuleSetEditLinkClicked(event: Event) {
    event.stopPropagation();
    this.ruleSetEditLinkClicked.emit(this.mainRuleSet);
  }

  onRuleSetUnlinkClicked(event: Event) {
    event.stopPropagation();
    this.ruleSetUnlinkClicked.emit(this.mainRuleSet);
  }
}
