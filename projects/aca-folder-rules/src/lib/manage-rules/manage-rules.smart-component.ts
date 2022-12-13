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
import { NodeInfo } from '@alfresco/aca-shared/store';
import { delay, takeUntil } from 'rxjs/operators';
import { EditRuleDialogSmartComponent } from '../rule-details/edit-rule-dialog.smart-component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@alfresco/adf-content-services';
import { NotificationService } from '@alfresco/adf-core';
import { ActionDefinitionTransformed } from '../model/rule-action.model';
import { ActionsService } from '../services/actions.service';
import { FolderRuleSetsService } from '../services/folder-rule-sets.service';
import { RuleSet } from '../model/rule-set.model';
import { RuleSetPickerSmartComponent } from '../rule-set-picker/rule-set-picker.smart-component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'aca-manage-rules',
  templateUrl: 'manage-rules.smart-component.html',
  styleUrls: ['manage-rules.smart-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-manage-rules' }
})
export class ManageRulesSmartComponent implements OnInit, OnDestroy {
  nodeId = '';
  isInheritanceEnabled = true;
  isInheritanceToggleDisabled = false;

  mainRuleSet$: Observable<RuleSet>;
  inheritedRuleSets$: Observable<RuleSet[]>;
  selectedRule$: Observable<Rule>;
  selectedRuleSet$: Observable<RuleSet>;
  hasMoreRuleSets$: Observable<boolean>;
  ruleSetsLoading$: Observable<boolean>;
  folderInfo$: Observable<NodeInfo>;

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
    private folderRuleSetsService: FolderRuleSetsService
  ) {}

  ngOnInit() {
    this.mainRuleSet$ = this.folderRuleSetsService.mainRuleSet$;
    this.inheritedRuleSets$ = this.folderRuleSetsService.inheritedRuleSets$;
    this.selectedRule$ = this.folderRulesService.selectedRule$;
    this.selectedRuleSet$ = this.folderRuleSetsService.selectedRuleSet$;
    this.hasMoreRuleSets$ = this.folderRuleSetsService.hasMoreRuleSets$;
    this.ruleSetsLoading$ = this.folderRuleSetsService.isLoading$;
    this.folderInfo$ = this.folderRuleSetsService.folderInfo$;

    this.actionsLoading$ = this.actionsService.loading$.pipe(delay(0));
    this.actionDefinitions$ = this.actionsService.actionDefinitionsListing$;

    this.folderRulesService.deletedRuleId$.pipe(takeUntil(this.destroyed$)).subscribe((deletedRuleId) => this.onRuleDelete(deletedRuleId));

    this.actionsService.loadActionDefinitions();

    this.route.params.subscribe((params) => {
      this.nodeId = params.nodeId;
      if (this.nodeId) {
        this.folderRulesService.getRuleSettings(this.nodeId).then((ruleSettings) => {
          this.isInheritanceEnabled = ruleSettings.value;
        });

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
        model,
        nodeId: this.nodeId
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
    const newRule = await this.folderRulesService.updateRule(this.nodeId, rule.id, rule);
    this.folderRuleSetsService.addOrUpdateRuleInMainRuleSet(newRule);
  }

  async onRuleCreate(ruleCreateParams: Partial<Rule>) {
    const newRule = await this.folderRulesService.createRule(this.nodeId, ruleCreateParams);
    this.folderRuleSetsService.addOrUpdateRuleInMainRuleSet(newRule);
  }

  async onRuleEnabledToggle(rule: Rule, isEnabled: boolean) {
    await this.folderRulesService.updateRule(this.nodeId, rule.id, { ...rule, isEnabled });
  }

  async onInheritanceToggleChange(event: MatSlideToggleChange) {
    this.isInheritanceToggleDisabled = true;
    const ruleSettings = await this.folderRulesService.updateRuleSettings(this.nodeId, '-isInheritanceEnabled-', { value: event.checked });
    this.isInheritanceEnabled = ruleSettings.value;
    this.folderRuleSetsService.loadRuleSets(this.nodeId);
    this.isInheritanceToggleDisabled = false;
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
    this.folderRuleSetsService.removeRuleFromMainRuleSet(deletedRuleId);
  }

  onLoadMoreRuleSets() {
    this.folderRuleSetsService.loadMoreInheritedRuleSets();
  }

  onLoadMoreRules(ruleSet: RuleSet) {
    this.folderRulesService.loadRules(ruleSet);
  }

  canEditRule(ruleSet: RuleSet): boolean {
    return !ruleSet || FolderRuleSetsService.isOwnedRuleSet(ruleSet, this.nodeId);
  }

  openLinkRulesDialog(existingRuleSet?: RuleSet) {
    this.matDialogService
      .open(RuleSetPickerSmartComponent, {
        width: '90%',
        panelClass: 'aca-rule-set-picker-container',
        data: {
          nodeId: this.nodeId,
          defaultNodeId: this.nodeId,
          existingRuleSet
        }
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.folderRuleSetsService.refreshMainRuleSet();
        }
      });
  }

  onRuleSetUnlinkClicked(linkedRuleSet: RuleSet) {
    this.matDialogService
      .open(ConfirmDialogComponent, {
        data: {
          title: 'ACA_FOLDER_RULES.CONFIRMATION_DIALOG.DELETE_RULE_SET_LINK.TITLE',
          message: 'ACA_FOLDER_RULES.CONFIRMATION_DIALOG.DELETE_RULE_SET_LINK.MESSAGE'
        },
        minWidth: '346px'
      })
      .afterClosed()
      .subscribe(async (result) => {
        if (result) {
          try {
            await this.folderRuleSetsService.deleteRuleSetLink(this.nodeId, linkedRuleSet.id);
            this.folderRuleSetsService.refreshMainRuleSet();
          } catch (error) {
            this.notificationService.showError('ACA_FOLDER_RULES.ERRORS.DELETE_RULE_SET_LINK_FAILED');
          }
        }
      });
  }

  isMainRuleSetNotEmpty(mainRuleSet: RuleSet): boolean {
    return !!mainRuleSet;
  }

  isInheritedRuleSetsNotEmpty(inheritedRuleSets: RuleSet[]): boolean {
    return inheritedRuleSets.some((ruleSet) => ruleSet.rules.some((rule: Rule) => rule.isEnabled));
  }
}
