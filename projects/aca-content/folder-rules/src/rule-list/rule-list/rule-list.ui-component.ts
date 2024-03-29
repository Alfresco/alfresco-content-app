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

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { RuleSet } from '../../model/rule-set.model';
import { Rule } from '../../model/rule.model';
import { RuleGroupingItem } from '../../model/rule-grouping-item.model';
import { FolderRuleSetsService } from '../../services/folder-rule-sets.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RuleListGroupingUiComponent } from '../rule-list-grouping/rule-list-grouping.ui-component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatRippleModule,
    MatIconModule,
    MatTooltipModule,
    RuleListGroupingUiComponent,
    RouterModule,
    MatButtonModule
  ],
  selector: 'aca-rule-list',
  templateUrl: './rule-list.ui-component.html',
  styleUrls: ['./rule-list.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-list' }
})
export class RuleListUiComponent implements OnInit, OnDestroy {
  @Input()
  mainRuleSet$: Observable<RuleSet>;
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

  mainRuleSet: RuleSet = null;
  inheritedRuleSetsExpanded = true;
  mainRuleSetExpanded = true;
  mainRuleSetGroupingItems: RuleGroupingItem[] = [];
  inheritedRuleSetGroupingItems: RuleGroupingItem[] = [];
  isMainRuleSetOwned = false;
  isMainRuleSetLinked = false;

  private _mainRuleSetSub: Subscription;

  ngOnInit() {
    this._mainRuleSetSub = this.mainRuleSet$.subscribe((ruleSet: RuleSet) => {
      if (ruleSet) {
        this.mainRuleSet = ruleSet;
        this.isMainRuleSetOwned = FolderRuleSetsService.isOwnedRuleSet(ruleSet, this.folderId);
        this.isMainRuleSetLinked = FolderRuleSetsService.isLinkedRuleSet(ruleSet, this.folderId);
      }

      this.mainRuleSetGroupingItems = ruleSet ? this.getRuleSetGroupingItems(ruleSet, !this.isMainRuleSetOwned) : [];
    });

    this.inheritedRuleSetGroupingItems = this.inheritedRuleSets.reduce((accumulator: RuleGroupingItem[], currentRuleSet: RuleSet) => {
      accumulator.push(...this.getRuleSetGroupingItems(currentRuleSet, true));
      return accumulator;
    }, []);
    if (this.ruleSetsLoading || this.hasMoreRuleSets) {
      this.inheritedRuleSetGroupingItems.push({
        type: this.ruleSetsLoading ? 'loading' : 'load-more-rule-sets'
      });
    }
  }

  ngOnDestroy() {
    this._mainRuleSetSub.unsubscribe();
  }

  getRuleSetGroupingItems(ruleSet: RuleSet, filterOutDisabledRules: boolean): RuleGroupingItem[] {
    const items: RuleGroupingItem[] = ruleSet.rules
      .filter((rule: Rule) => rule.isEnabled || !filterOutDisabledRules)
      .map((rule: Rule) => ({
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
