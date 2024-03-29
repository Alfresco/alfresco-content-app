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

import { Injectable } from '@angular/core';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Rule, RuleForForm, RuleOptions, RuleSettings } from '../model/rule.model';
import { RuleCompositeCondition } from '../model/rule-composite-condition.model';
import { RuleSimpleCondition } from '../model/rule-simple-condition.model';
import { RuleSet } from '../model/rule-set.model';

interface GetRulesResult {
  rules: Rule[];
  hasMoreRules: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FolderRulesService {
  public static MAX_RULES_PER_GET = 100;

  public static get emptyCompositeCondition(): RuleCompositeCondition {
    return {
      inverted: false,
      booleanMode: 'and',
      compositeConditions: [],
      simpleConditions: []
    };
  }

  public static get emptyRuleOptions(): RuleOptions {
    return {
      isEnabled: true,
      isInheritable: false,
      isAsynchronous: false,
      errorScript: ''
    };
  }

  public static get emptyRule(): Rule {
    return {
      id: '',
      name: '',
      description: '',
      isShared: false,
      triggers: ['inbound'],
      conditions: FolderRulesService.emptyCompositeCondition,
      actions: [],
      ...FolderRulesService.emptyRuleOptions
    };
  }

  public static get emptyRuleForForm(): RuleForForm {
    const value = {
      ...FolderRulesService.emptyRule,
      options: FolderRulesService.emptyRuleOptions
    };
    Object.keys(value.options).forEach((key: string) => {
      delete value[key];
    });
    return value;
  }

  private selectedRuleSource = new BehaviorSubject<Rule>(null);
  private deletedRuleIdSource = new BehaviorSubject<string>(null);

  selectedRule$ = this.selectedRuleSource.asObservable();
  deletedRuleId$: Observable<string> = this.deletedRuleIdSource.asObservable();

  constructor(private apiService: AlfrescoApiService) {}

  private callApi(path: string, httpMethod: string, body: object = {}): Promise<any> {
    // APIs used by this service are still private and not yet available for public use
    const params = [{}, {}, {}, {}, body, ['application/json'], ['application/json']];
    return this.apiService.getInstance().contentPrivateClient.callApi(path, httpMethod, ...params);
  }

  getRules(owningFolderId: string, ruleSetId: string, skipCount = 0): Observable<GetRulesResult> {
    return from(
      this.callApi(
        `/nodes/${owningFolderId}/rule-sets/${ruleSetId}/rules?skipCount=${skipCount}&maxItems=${FolderRulesService.MAX_RULES_PER_GET}`,
        'GET'
      )
    ).pipe(
      map((res) => ({
        rules: this.formatRules(res),
        hasMoreRules: !!res?.list?.pagination?.hasMoreItems
      }))
    );
  }

  loadRules(ruleSet: RuleSet, skipCount = ruleSet.rules.length, selectRule: 'first' | 'last' | Rule = null) {
    if (ruleSet && !ruleSet.loadingRules) {
      ruleSet.loadingRules = true;
      this.getRules(ruleSet.owningFolder.id, ruleSet.id, skipCount)
        .pipe(
          finalize(() => {
            ruleSet.loadingRules = false;
          })
        )
        .subscribe((res: GetRulesResult) => {
          ruleSet.hasMoreRules = res.hasMoreRules;
          ruleSet.rules.splice(skipCount);
          ruleSet.rules.push(...res.rules);
          this.selectRuleInRuleSet(ruleSet, selectRule);
        });
    }
  }

  async createRule(nodeId: string, rule: Partial<Rule>, ruleSetId: string = '-default-'): Promise<Rule> {
    const response = await this.callApi(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules`, 'POST', { ...rule });
    return this.formatRule(response.entry);
  }

  async updateRule(nodeId: string, ruleId: string, rule: Rule, ruleSetId: string = '-default-'): Promise<Rule> {
    const response = await this.callApi(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules/${ruleId}`, 'PUT', { ...rule });
    return this.formatRule(response.entry);
  }

  deleteRule(nodeId: string, ruleId: string, ruleSetId: string = '-default-') {
    from(this.callApi(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules/${ruleId}`, 'DELETE')).subscribe(
      () => {
        this.deletedRuleIdSource.next(ruleId);
      },
      (error) => {
        this.deletedRuleIdSource.next(error);
      }
    );
  }

  async getRuleSettings(nodeId: string, key: string = '-isInheritanceEnabled-'): Promise<RuleSettings> {
    const response = await this.callApi(`/nodes/${nodeId}/rule-settings/${key}`, 'GET');
    return response.entry;
  }

  async updateRuleSettings(nodeId: string, key: string, body: RuleSettings): Promise<RuleSettings> {
    const response = await this.callApi(`/nodes/${nodeId}/rule-settings/${key}`, 'PUT', { ...body });
    return response.entry;
  }

  private formatRules(res): Rule[] {
    return [...res.list.entries.map((entry) => this.formatRule(entry.entry))];
  }

  private formatRule(obj): Rule {
    return {
      id: obj.id,
      name: obj.name ?? FolderRulesService.emptyRule.name,
      description: obj.description ?? FolderRulesService.emptyRule.description,
      isEnabled: obj.isEnabled ?? FolderRulesService.emptyRule.isEnabled,
      isInheritable: obj.isInheritable ?? FolderRulesService.emptyRule.isInheritable,
      isAsynchronous: obj.isAsynchronous ?? FolderRulesService.emptyRule.isAsynchronous,
      errorScript: obj.errorScript ?? FolderRulesService.emptyRule.errorScript,
      isShared: obj.isShared ?? FolderRulesService.emptyRule.isShared,
      triggers: obj.triggers ?? FolderRulesService.emptyRule.triggers,
      conditions: this.formatCompositeCondition(obj.conditions ?? { ...FolderRulesService.emptyRule.conditions }),
      actions: obj.actions ?? FolderRulesService.emptyRule.actions
    };
  }

  private formatCompositeCondition(obj): RuleCompositeCondition {
    return {
      inverted: obj.inverted ?? false,
      booleanMode: obj.booleanMode ?? 'and',
      compositeConditions: (obj.compositeConditions || []).map((condition) => this.formatCompositeCondition(condition)),
      simpleConditions: this.parseSimpleCondition(obj.simpleConditions)
    };
  }

  private parseSimpleCondition(arr) {
    if (arr) {
      if (arr.every((element) => element === null)) {
        return [];
      }
      return arr.map((condition) => this.formatSimpleCondition(condition));
    } else {
      return [];
    }
  }

  private formatSimpleCondition(obj): RuleSimpleCondition {
    return {
      field: obj.field || 'cm:name',
      comparator: obj.comparator || 'equals',
      parameter: obj.parameter || ''
    };
  }

  selectRule(rule: Rule) {
    this.selectedRuleSource.next(rule);
  }

  selectRuleInRuleSet(ruleSet: RuleSet, selectRule: 'first' | 'last' | Rule = null) {
    if (selectRule === 'first') {
      this.selectRule(ruleSet.rules[0]);
    } else if (selectRule === 'last') {
      this.selectRule(ruleSet.rules[ruleSet.rules.length - 1]);
    } else if (selectRule) {
      this.selectRule(selectRule);
    }
  }
}
