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
      enabled: true,
      cascade: false,
      asynchronous: false,
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

  private apiCall(path: string, httpMethod: string, params?: any[]): Promise<any> {
    return this.apiService.getInstance().contentClient.callApi(path, httpMethod, ...params);
  }

  private formatRules(res): Rule[] {
    return res.list.entries.map((entry) => this.formatRule(entry.entry));
  }

  private formatRule(obj): Rule {
    return {
      id: obj.id,
      name: obj.name ?? FolderRulesService.emptyRule.name,
      description: obj.description ?? FolderRulesService.emptyRule.description,
      enabled: obj.enabled ?? FolderRulesService.emptyRule.enabled,
      cascade: obj.cascade ?? FolderRulesService.emptyRule.cascade,
      asynchronous: obj.asynchronous ?? FolderRulesService.emptyRule.asynchronous,
      errorScript: obj.errorScript ?? FolderRulesService.emptyRule.errorScript,
      isShared: obj.isShared ?? FolderRulesService.emptyRule.isShared,
      triggers: obj.triggers ?? FolderRulesService.emptyRule.triggers,
      conditions: obj.conditions ?? { ...FolderRulesService.emptyRule.conditions },
      actions: obj.actions ?? FolderRulesService.emptyRule.actions
    };
  }
}
