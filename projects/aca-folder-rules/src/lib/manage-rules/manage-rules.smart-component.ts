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

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { FolderRulesService } from '../services/folder-rules.service';
import { Observable, Subject } from 'rxjs';
import { Rule } from '../model/rule.model';
import { ActivatedRoute } from '@angular/router';
import { AppStore, NavigateRouteAction } from '@alfresco/aca-shared/store';
import { delay, takeUntil } from 'rxjs/operators';
import { EditRuleDialogSmartComponent } from '../rule-details/edit-rule-dialog.smart-component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@alfresco/adf-content-services';
import { NotificationService } from '@alfresco/adf-core';
import { ActionDefinitionTransformed } from '../model/rule-action.model';
import { ActionsService } from '../services/actions.service';
import { FolderRuleSetsService } from '../services/folder-rule-sets.service';
import { Store } from '@ngrx/store';
import { RuleSet } from '../model/rule-set.model';

@Component({
  selector: 'aca-manage-rules',
  templateUrl: 'manage-rules.smart-component.html',
  styleUrls: ['manage-rules.smart-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-manage-rules' }
})
export class ManageRulesSmartComponent implements OnInit, OnDestroy {
  nodeId: string = null;

  ruleSetListing$ = this.folderRuleSetsService.ruleSetListing$;
  selectedRule$ = this.folderRulesService.selectedRule$;
  hasMoreRuleSets$ = this.folderRuleSetsService.hasMoreRuleSets$;
  ruleSetsLoading$ = this.folderRuleSetsService.isLoading$;
  folderInfo$ = this.folderRuleSetsService.folderInfo$;

  actionsLoading$: Observable<boolean>;
  actionDefinitions$: Observable<ActionDefinitionTransformed[]>;

  private destroyed$ = new Subject<void>();

  constructor(
    private location: Location,
    private folderRulesService: FolderRulesService,
    private route: ActivatedRoute,
    private matDialogService: MatDialog,
    private notificationService: NotificationService,
    private actionsService: ActionsService,
    private folderRuleSetsService: FolderRuleSetsService,
    private store: Store<AppStore>
  ) {}

  ngOnInit(): void {
    this.actionDefinitions$ = this.actionsService.actionDefinitionsListing$;
    this.folderRulesService.deletedRuleId$.pipe(takeUntil(this.destroyed$)).subscribe((deletedRuleId) => this.onRuleDelete(deletedRuleId));
    this.actionsLoading$ = this.actionsService.loading$.pipe(delay(0));
    this.actionsService.loadActionDefinitions();
    this.route.params.subscribe((params) => {
      this.nodeId = params.nodeId;
      if (this.nodeId) {
        this.folderRuleSetsService.loadRuleSets(this.nodeId);
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  goBack(): void {
    this.location.back();
  }

  onSelectRule(rule: Rule) {
    this.folderRulesService.selectRule(rule);
  }

  openCreateUpdateRuleDialog(model = {}) {
    const dialogRef = this.matDialogService.open(EditRuleDialogSmartComponent, {
      width: '90%',
      panelClass: 'aca-edit-rule-dialog-container',
      data: {
        model
      }
    });

    this.onSubmitRuleDialog(dialogRef);
  }

  onSubmitRuleDialog(dialogRef) {
    dialogRef.componentInstance.submitted.subscribe(async (rule) => {
      try {
        if (rule.id) {
          await this.onRuleUpdate(rule);
        } else {
          await this.onRuleCreate(rule);
        }
        dialogRef.close();
      } catch (error) {
        this.notificationService.showError(error.response.body.error.errorKey);
      }
    });
  }

  async onRuleUpdate(rule: Rule) {
    const ruleSet = this.folderRuleSetsService.getRuleSetFromRuleId(rule.id);
    await this.folderRulesService.updateRule(this.nodeId, rule.id, rule, ruleSet.id);
    this.folderRulesService.loadRules(ruleSet, 0, rule);
  }

  async onRuleCreate(ruleCreateParams: Partial<Rule>) {
    await this.folderRulesService.createRule(this.nodeId, ruleCreateParams, '-default-');
    const ruleSetToLoad = this.folderRuleSetsService.getOwnedOrLinkedRuleSet();
    if (ruleSetToLoad) {
      this.folderRulesService.loadRules(ruleSetToLoad, 0, 'last');
    } else {
      this.folderRuleSetsService.loadMoreRuleSets(true);
    }
  }

  async onRuleEnabledToggle(rule: Rule, isEnabled: boolean) {
    const ruleSet = this.folderRuleSetsService.getRuleSetFromRuleId(rule.id);
    await this.folderRulesService.updateRule(this.nodeId, rule.id, { ...rule, isEnabled }, ruleSet.id);
  }

  onRuleDeleteButtonClicked(rule: Rule) {
    this.matDialogService
      .open(ConfirmDialogComponent, {
        data: {
          title: 'ACA_FOLDER_RULES.CONFIRMATION_DIALOG.DELETE_RULE.TITLE',
          message: 'ACA_FOLDER_RULES.CONFIRMATION_DIALOG.DELETE_RULE.MESSAGE'
        },
        minWidth: '346px'
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.folderRulesService.deleteRule(this.nodeId, rule.id);
        }
      });
  }

  onRuleDelete(deletedRuleId: string) {
    if (deletedRuleId) {
      const folderToRefresh = this.folderRuleSetsService.getRuleSetFromRuleId(deletedRuleId);
      if (folderToRefresh?.rules.length > 1) {
        this.folderRulesService.loadRules(folderToRefresh, 0, 'first');
      } else {
        this.folderRuleSetsService.loadRuleSets(this.nodeId);
      }
    }
  }

  onNavigateToOtherFolder(nodeId) {
    this.store.dispatch(new NavigateRouteAction(['nodes', nodeId, 'rules']));
  }

  onLoadMoreRuleSets() {
    this.folderRuleSetsService.loadMoreRuleSets();
  }

  onLoadMoreRules(ruleSet: RuleSet) {
    this.folderRulesService.loadRules(ruleSet);
  }
}
