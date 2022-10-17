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

import { Injectable } from '@angular/core';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { BehaviorSubject, forkJoin, from, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { Rule } from '../model/rule.model';
import { ContentApiService } from '@alfresco/aca-shared';
import { NodeInfo } from '@alfresco/aca-shared/store';
import { RuleCompositeCondition } from '../model/rule-composite-condition.model';
import { RuleSimpleCondition } from '../model/rule-simple-condition.model';

@Injectable({
  providedIn: 'root'
})
export class FolderRulesService {
  public static get emptyCompositeCondition(): RuleCompositeCondition {
    return {
      inverted: false,
      booleanMode: 'and',
      compositeConditions: [],
      simpleConditions: []
    };
  }

  public static get emptyRule(): Rule {
    return {
      id: '',
      name: '',
      description: '',
      isEnabled: true,
      isInheritable: false,
      isAsynchronous: false,
      errorScript: '',
      isShared: false,
      triggers: ['inbound'],
      conditions: FolderRulesService.emptyCompositeCondition,
      actions: []
    };
  }

  private rulesListingSource = new BehaviorSubject<Rule[]>([]);
  rulesListing$: Observable<Rule[]> = this.rulesListingSource.asObservable();
  private folderInfoSource = new BehaviorSubject<NodeInfo>(null);
  folderInfo$: Observable<NodeInfo> = this.folderInfoSource.asObservable();
  private loadingSource = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSource.asObservable();
  private deletedRuleIdSource = new BehaviorSubject<string>(null);
  deletedRuleId$: Observable<string> = this.deletedRuleIdSource.asObservable();

  constructor(private apiService: AlfrescoApiService, private contentApi: ContentApiService) {}

  loadRules(nodeId: string, ruleSetId: string = '-default-'): void {
    this.loadingSource.next(true);
    forkJoin([
      from(
        this.apiCall(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules`, 'GET', [{}, {}, {}, {}, {}, ['application/json'], ['application/json']])
      ).pipe(
        map((res) => this.formatRules(res)),
        catchError((error) => {
          if (error.status === 404) {
            return of([]);
          }
          return of(error);
        })
      ),
      this.contentApi.getNode(nodeId).pipe(
        catchError((error) => {
          if (error.status === 404) {
            return of({ entry: null });
          }
          return of(error);
        })
      )
    ])
      .pipe(finalize(() => this.loadingSource.next(false)))
      .subscribe(
        ([rules, nodeInfo]) => {
          this.rulesListingSource.next(rules);
          this.folderInfoSource.next(nodeInfo.entry);
        },
        (error) => {
          this.rulesListingSource.next([]);
          this.folderInfoSource.next(error);
        }
      );
  }

  createRule(nodeId: string, rule: Partial<Rule>, ruleSetId: string = '-default-') {
    return this.apiCall(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules`, 'POST', [
      {},
      {},
      {},
      {},
      { ...rule },
      ['application/json'],
      ['application/json']
    ]);
  }

  updateRule(nodeId: string, ruleId: string, rule: Rule, ruleSetId: string = '-default-') {
    return this.apiCall(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules/${ruleId}`, 'PUT', [
      {},
      {},
      {},
      {},
      { ...rule },
      ['application/json'],
      ['application/json']
    ]);
  }

  deleteRule(nodeId: string, ruleId: string, ruleSetId: string = '-default-'): void {
    this.loadingSource.next(true);
    from(
      this.apiCall(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules/${ruleId}`, 'DELETE', [
        {},
        {},
        {},
        {},
        {},
        ['application/json'],
        ['application/json']
      ])
    ).subscribe(
      () => {
        this.deletedRuleIdSource.next(ruleId);
      },
      (error) => {
        this.deletedRuleIdSource.next(error);
        this.loadingSource.next(false);
      }
    );
  }

  toggleRule(nodeId: string, ruleId: string, rule: Rule, ruleSetId: string = '-default-'): void {
    from(
      this.apiCall(`/nodes/${nodeId}/rule-sets/${ruleSetId}/rules/${ruleId}`, 'PUT', [
        {},
        {},
        {},
        {},
        { ...rule },
        ['application/json'],
        ['application/json']
      ])
    ).subscribe({ error: (error) => console.error(error) });
  }

  private apiCall(path: string, httpMethod: string, params?: any[]): Promise<any> {
    // APIs used by this service are still private and not yet available for public use
    return this.apiService.getInstance().contentPrivateClient.callApi(path, httpMethod, ...params);
  }

  private formatRules(res): Rule[] {
    return res.list.entries.map((entry) => this.formatRule(entry.entry));
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
}
