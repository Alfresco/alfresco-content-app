/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FolderRulesService } from '../services/folder-rules.service';
import { Observable } from 'rxjs';
import { Rule } from '../model/rule.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NodeInfo } from '@alfresco/aca-shared/store';
import { delay } from 'rxjs/operators';
import { EditRuleDialogUiComponent } from '../rule-details/edit-rule-dialog.ui-component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, EmptyContentComponent, NotificationService } from '@alfresco/adf-core';
import { ActionDefinitionTransformed } from '../model/rule-action.model';
import { ActionsService } from '../services/actions.service';
import { FolderRuleSetsService } from '../services/folder-rule-sets.service';
import { RuleSet } from '../model/rule-set.model';
import { RuleSetPickerSmartComponent } from '../rule-set-picker/rule-set-picker.smart-component';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActionParameterConstraint } from '../model/action-parameter-constraint.model';
import { TranslatePipe } from '@ngx-translate/core';
import { GenericErrorComponent, PageLayoutComponent } from '@alfresco/aca-shared';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { RuleListUiComponent } from '../rule-list/rule-list/rule-list.ui-component';
import { RuleDetailsUiComponent } from '../rule-details/rule-details.ui-component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  imports: [
    CommonModule,
    TranslatePipe,
    PageLayoutComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatDividerModule,
    RuleListUiComponent,
    RouterModule,
    GenericErrorComponent,
    RuleDetailsUiComponent,
    EmptyContentComponent,
    MatToolbar
  ],
  selector: 'aca-manage-rules',
  templateUrl: 'manage-rules.smart-component.html',
  styleUrls: ['manage-rules.smart-component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  host: { class: 'aca-manage-rules' }
})
export class ManageRulesSmartComponent implements OnInit {
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
  parameterConstraints$: Observable<ActionParameterConstraint[]>;
  canEditMainRule = false;
  canEditSelectedRule = false;
  isMainRuleSetNotEmpty = false;
  isInheritedRuleSetsNotEmpty = false;

  private readonly destroyRef = inject(DestroyRef);

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
    this.parameterConstraints$ = this.actionsService.parameterConstraints$;

    this.folderRulesService.deletedRuleId$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((deletedRuleId) => this.onRuleDelete(deletedRuleId));

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

    this.actionDefinitions$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((actionDefinitions: ActionDefinitionTransformed[]) => this.actionsService.loadActionParameterConstraints(actionDefinitions));

    this.mainRuleSet$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((ruleSet) => {
      this.canEditMainRule = this.canEditRule(ruleSet);
      this.isMainRuleSetNotEmpty = !!ruleSet;
    });

    this.inheritedRuleSets$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((inheritedRuleSet) => {
      this.isInheritedRuleSetsNotEmpty = inheritedRuleSet.some((ruleSet) => ruleSet.rules.some((rule: Rule) => rule.isEnabled));
    });

    this.selectedRuleSet$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((ruleSet) => {
      this.canEditSelectedRule = this.canEditRule(ruleSet);
    });
  }

  goBack(): void {
    this.location.back();
  }

  onSelectRule(rule: Rule) {
    this.folderRulesService.selectRule(rule);
  }

  openCreateUpdateRuleDialog(model = {}) {
    const dialogRef = this.matDialogService.open(EditRuleDialogUiComponent, {
      width: '90%',
      panelClass: 'aca-edit-rule-dialog-container',
      data: {
        model,
        nodeId: this.nodeId,
        parameterConstraints$: this.parameterConstraints$,
        actionDefinitions$: this.actionDefinitions$
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
    const updatedRule = await this.folderRulesService.updateRule(this.nodeId, rule.id, { ...rule, isEnabled });
    this.folderRuleSetsService.addOrUpdateRuleInMainRuleSet(updatedRule);
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
        minWidth: '346px',
        restoreFocus: true
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
}
