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
import { NodeInfo } from '@alfresco/aca-shared/store';
import { Rule } from '../../model/rule.model';

@Component({
  selector: 'aca-rule-set-list',
  templateUrl: './rule-set-list.ui-component.html',
  styleUrls: ['./rule-set-list.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-set-list' }
})
export class RuleSetListUiComponent {
  @Input()
  folderId = '';
  private _ruleSets: RuleSet[] = [];
  @Input()
  get ruleSets(): RuleSet[] {
    return this._ruleSets;
  }
  set ruleSets(value: RuleSet[]) {
    this._ruleSets = value;
    this.expandedRuleSets = [...value];
  }
  @Input()
  hasMoreRuleSets = false;
  @Input()
  ruleSetsLoading = false;
  @Input()
  selectedRule = null;

  @Output()
  navigateToOtherFolder = new EventEmitter<string>();
  @Output()
  loadMoreRuleSets = new EventEmitter<void>();
  @Output()
  loadMoreRules = new EventEmitter<RuleSet>();
  @Output()
  selectRule = new EventEmitter<Rule>();

  expandedRuleSets: RuleSet[] = [];

  isRuleSetLinked(ruleSet: RuleSet): boolean {
    return ruleSet.linkedToBy.indexOf(this.folderId) > -1;
  }

  isRuleSetExpanded(ruleSet: RuleSet): boolean {
    return this.expandedRuleSets.indexOf(ruleSet) > -1;
  }

  clickRuleSetHeader(ruleSet: RuleSet) {
    if (this.isRuleSetExpanded(ruleSet)) {
      this.expandedRuleSets.splice(this.expandedRuleSets.indexOf(ruleSet), 1);
    } else {
      this.expandedRuleSets.push(ruleSet);
    }
  }

  clickNavigateButton(folder: NodeInfo) {
    if (folder && folder.id) {
      this.navigateToOtherFolder.emit(folder.id);
    }
  }

  clickLoadMoreRuleSets() {
    this.loadMoreRuleSets.emit();
  }

  clickLoadMoreRules(ruleSet: RuleSet) {
    this.loadMoreRules.emit(ruleSet);
  }

  onSelectRule(rule: Rule) {
    this.selectRule.emit(rule);
  }
}
