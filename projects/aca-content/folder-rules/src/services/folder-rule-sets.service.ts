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
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import { NodeInfo } from '@alfresco/aca-shared/store';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { RuleSet } from '../model/rule-set.model';
import { ContentApiService } from '@alfresco/aca-shared';
import { NodeEntry } from '@alfresco/js-api';
import { FolderRulesService } from './folder-rules.service';
import { Rule } from '../model/rule.model';

@Injectable({
  providedIn: 'root'
})
export class FolderRuleSetsService {
  public static MAX_RULE_SETS_PER_GET = 100;

  static isOwnedRuleSet(ruleSet: RuleSet, nodeId: string): boolean {
    return ruleSet?.owningFolder?.id === nodeId;
  }
  static isLinkedRuleSet(ruleSet: RuleSet, nodeId: string): boolean {
    return ruleSet?.linkedToBy.indexOf(nodeId) > -1;
  }
  static isMainRuleSet(ruleSet: RuleSet, nodeId: string): boolean {
    return this.isOwnedRuleSet(ruleSet, nodeId) || this.isLinkedRuleSet(ruleSet, nodeId);
  }
  static isInheritedRuleSet(ruleSet: RuleSet, nodeId: string): boolean {
    return !this.isMainRuleSet(ruleSet, nodeId);
  }

  private currentFolder: NodeInfo = null;
  private mainRuleSet: RuleSet = null;
  private inheritedRuleSets: RuleSet[] = [];
  private hasMoreRuleSets = true;

  private mainRuleSetSource = new BehaviorSubject<RuleSet>(null);
  private inheritedRuleSetsSource = new BehaviorSubject<RuleSet[]>([]);
  private hasMoreRuleSetsSource = new BehaviorSubject<boolean>(true);
  private folderInfoSource = new BehaviorSubject<NodeInfo>(null);
  private isLoadingSource = new BehaviorSubject<boolean>(false);

  mainRuleSet$: Observable<RuleSet> = this.mainRuleSetSource.asObservable();
  inheritedRuleSets$: Observable<RuleSet[]> = this.inheritedRuleSetsSource.asObservable();
  hasMoreRuleSets$: Observable<boolean> = this.hasMoreRuleSetsSource.asObservable();
  folderInfo$: Observable<NodeInfo> = this.folderInfoSource.asObservable();
  isLoading$: Observable<boolean> = this.isLoadingSource.asObservable();

  selectedRuleSet$ = this.folderRulesService.selectedRule$.pipe(
    map((rule: Rule) => {
      if (rule === null) {
        return null;
      }
      if (this.mainRuleSet?.rules.findIndex((r: Rule) => r.id === rule.id) > -1) {
        return this.mainRuleSet;
      }
      return this.inheritedRuleSets.find((ruleSet: RuleSet) => ruleSet.rules.findIndex((r: Rule) => r.id === rule.id) > -1) ?? null;
    })
  );

  constructor(private apiService: AlfrescoApiService, private contentApi: ContentApiService, private folderRulesService: FolderRulesService) {}

  private callApi(path: string, httpMethod: string, body: object = {}): Promise<any> {
    // APIs used by this service are still private and not yet available for public use
    const params = [{}, {}, {}, {}, body, ['application/json'], ['application/json']];
    return this.apiService.getInstance().contentPrivateClient.callApi(path, httpMethod, ...params);
  }

  private getMainRuleSet(nodeId: string): Observable<RuleSet> {
    return from(this.callApi(`/nodes/${nodeId}/rule-sets/-default-?include=isLinkedTo,owningFolder,linkedToBy`, 'GET')).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return of({ entry: null });
        }
        return of(error);
      }),
      switchMap((res) => this.formatRuleSet(res.entry))
    );
  }

  private getInheritedRuleSets(nodeId: string, skipCount = 0): Observable<RuleSet[]> {
    return from(
      this.callApi(
        `/nodes/${nodeId}/rule-sets?include=isLinkedTo,owningFolder,linkedToBy&skipCount=${skipCount}&maxItems=${FolderRuleSetsService.MAX_RULE_SETS_PER_GET}`,
        'GET'
      )
    ).pipe(
      tap((res) => {
        if (res?.list?.pagination) {
          this.hasMoreRuleSets = res.list.pagination.hasMoreItems;
        }
      }),
      switchMap((res) => this.formatRuleSets(res)),
      map((ruleSets: RuleSet[]) => ruleSets.filter((ruleSet) => FolderRuleSetsService.isInheritedRuleSet(ruleSet, this.currentFolder.id)))
    );
  }

  loadRuleSets(nodeId: string, loadInheritedRuleSets = true) {
    this.isLoadingSource.next(true);
    this.mainRuleSet = null;
    this.inheritedRuleSets = [];
    this.hasMoreRuleSets = true;
    this.currentFolder = null;
    this.mainRuleSetSource.next(this.mainRuleSet);
    this.inheritedRuleSetsSource.next(this.inheritedRuleSets);
    this.hasMoreRuleSetsSource.next(this.hasMoreRuleSets);
    this.getNodeInfo(nodeId)
      .pipe(
        tap((nodeInfo: NodeInfo) => {
          this.currentFolder = nodeInfo;
          this.folderInfoSource.next(this.currentFolder);
        }),
        switchMap(() => combineLatest(this.getMainRuleSet(nodeId), loadInheritedRuleSets ? this.getInheritedRuleSets(nodeId) : of([]))),
        finalize(() => this.isLoadingSource.next(false))
      )
      .subscribe(([mainRuleSet, inheritedRuleSets]) => {
        this.mainRuleSet = mainRuleSet;
        this.inheritedRuleSets = inheritedRuleSets;
        this.mainRuleSetSource.next(mainRuleSet);
        this.inheritedRuleSetsSource.next(inheritedRuleSets);
        this.hasMoreRuleSetsSource.next(this.hasMoreRuleSets);
        const ruleToSelect =
          mainRuleSet?.rules.find((r: Rule) => FolderRuleSetsService.isOwnedRuleSet(mainRuleSet, nodeId) || r.isEnabled) ??
          inheritedRuleSets.reduce((foundRule: Rule, ruleSet: RuleSet) => foundRule ?? ruleSet.rules.find((r: Rule) => r.isEnabled), null);
        this.folderRulesService.selectRule(ruleToSelect);
      });
  }

  loadMoreInheritedRuleSets() {
    this.isLoadingSource.next(true);
    this.getInheritedRuleSets(this.currentFolder.id, this.inheritedRuleSets.length)
      .pipe(finalize(() => this.isLoadingSource.next(false)))
      .subscribe((ruleSets) => {
        this.inheritedRuleSets.push(...ruleSets);
        this.inheritedRuleSetsSource.next(this.inheritedRuleSets);
        this.hasMoreRuleSetsSource.next(this.hasMoreRuleSets);
      });
  }

  private getNodeInfo(nodeId: string): Observable<NodeInfo> {
    if (nodeId) {
      return this.contentApi.getNode(nodeId).pipe(
        catchError((error) => {
          if (error.status === 404) {
            return of({ entry: null });
          }
          return of(error);
        }),
        map((entry: NodeEntry) => entry.entry)
      );
    } else {
      return of(null);
    }
  }

  private formatRuleSets(res: any): Observable<RuleSet[]> {
    return res?.list?.entries && res.list.entries instanceof Array
      ? combineLatest((res.list.entries as Array<any>).map((entry) => this.formatRuleSet(entry.entry)))
      : of([]);
  }

  private formatRuleSet(entry: any): Observable<RuleSet> {
    if (!entry) {
      return of(null);
    }
    return combineLatest(
      this.currentFolder?.id === entry.owningFolder ? of(this.currentFolder) : this.getNodeInfo(entry.owningFolder || ''),
      this.folderRulesService.getRules(this.currentFolder.id || '', entry.id)
    ).pipe(
      map(([owningFolderNodeInfo, getRulesRes]) => ({
        id: entry.id,
        isLinkedTo: entry.isLinkedTo || false,
        owningFolder: owningFolderNodeInfo,
        linkedToBy: entry.linkedToBy || [],
        rules: getRulesRes.rules,
        hasMoreRules: getRulesRes.hasMoreRules,
        loadingRules: false
      }))
    );
  }

  removeRuleFromMainRuleSet(ruleId: string) {
    if (this.mainRuleSet) {
      const index = this.mainRuleSet.rules.findIndex((rule: Rule) => rule.id === ruleId);
      if (index > -1) {
        if (this.mainRuleSet.rules.length > 1) {
          this.mainRuleSet.rules.splice(index, 1);
        } else {
          this.mainRuleSet = null;
        }
        this.mainRuleSetSource.next(this.mainRuleSet);
        this.folderRulesService.selectRule(this.mainRuleSet?.rules[0] ?? this.inheritedRuleSets[0]?.rules[0] ?? null);
      }
    }
  }

  addOrUpdateRuleInMainRuleSet(newRule: Rule) {
    if (this.mainRuleSet) {
      const index = this.mainRuleSet.rules.findIndex((rule: Rule) => rule.id === newRule.id);
      if (index > -1) {
        this.mainRuleSet.rules.splice(index, 1, newRule);
      } else {
        this.mainRuleSet.rules.push(newRule);
      }
      this.mainRuleSetSource.next(this.mainRuleSet);
      this.folderRulesService.selectRule(newRule);
    } else {
      this.refreshMainRuleSet(newRule);
    }
  }

  refreshMainRuleSet(ruleToSelect: Rule = null) {
    this.getMainRuleSet(this.currentFolder.id).subscribe((mainRuleSet: RuleSet) => {
      this.mainRuleSet = { ...mainRuleSet };
      if (!this.mainRuleSet.rules) {
        this.mainRuleSet = null;
      }
      this.mainRuleSetSource.next(this.mainRuleSet);
      if (mainRuleSet) {
        const ruleToSelectInRuleSet = ruleToSelect ? mainRuleSet.rules.find((rule: Rule) => rule.id === ruleToSelect.id) : mainRuleSet.rules[0];
        this.folderRulesService.selectRule(ruleToSelectInRuleSet);
      }
    });
  }

  async createRuleSetLink(folderIdToCreateLink: string, folderIdToLinkFrom: string): Promise<unknown> {
    const data = {
      id: folderIdToLinkFrom
    };
    return this.callApi(`/nodes/${folderIdToCreateLink}/rule-set-links`, 'POST', data);
  }

  async deleteRuleSetLink(folderIdToDeleteLink: string, ruleSetIdToDelete: string): Promise<unknown> {
    return this.callApi(`/nodes/${folderIdToDeleteLink}/rule-set-links/${ruleSetIdToDelete}`, 'DELETE');
  }
}
