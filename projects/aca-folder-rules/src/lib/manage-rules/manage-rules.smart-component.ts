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

import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { FolderRulesService } from '../services/folder-rules.service';
import { Observable, Subscription } from 'rxjs';
import { Rule } from '../model/rule.model';
import { ActivatedRoute } from '@angular/router';
import { NodeInfo } from '@alfresco/aca-shared/store';
import { tap } from 'rxjs/operators';
import { EditRuleDialogSmartComponent } from '../rule-details/edit-rule-dialog.smart-component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@alfresco/adf-content-services';
import { NotificationService } from '@alfresco/adf-core';

@Component({
  selector: 'aca-manage-rules',
  templateUrl: 'manage-rules.smart-component.html',
  styleUrls: ['manage-rules.smart-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-manage-rules' }
})
export class ManageRulesSmartComponent implements OnInit, OnDestroy {
  rules$: Observable<Rule[]>;
  isLoading$: Observable<boolean>;
  folderInfo$: Observable<NodeInfo>;
  selectedRule: Rule = null;
  nodeId: string = null;
  deletedRuleSubscription$: Subscription;
  ruleDialogOnSubmitSubscription$: Subscription;

  constructor(
    private location: Location,
    private folderRulesService: FolderRulesService,
    private route: ActivatedRoute,
    private matDialogService: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.rules$ = this.folderRulesService.rulesListing$.pipe(
      tap((rules) => {
        if (!rules.includes(this.selectedRule)) {
          this.selectedRule = rules[0];
        }
      })
    );
    this.deletedRuleSubscription$ = this.folderRulesService.deletedRuleId$.subscribe((deletedRuleId) => {
      if (deletedRuleId) {
        this.folderRulesService.loadRules(this.nodeId);
      }
    });
    this.isLoading$ = this.folderRulesService.loading$;
    this.folderInfo$ = this.folderRulesService.folderInfo$;
    this.route.params.subscribe((params) => {
      this.nodeId = params.nodeId;
      if (this.nodeId) {
        this.folderRulesService.loadRules(this.nodeId);
      }
    });
  }

  ngOnDestroy(): void {
    this.deletedRuleSubscription$.unsubscribe();
    this.ruleDialogOnSubmitSubscription$.unsubscribe();
  }

  goBack(): void {
    this.location.back();
  }

  onRuleSelected(rule: Rule): void {
    this.selectedRule = rule;
  }

  openNewRuleDialog() {
    const dialogRef = this.matDialogService.open(EditRuleDialogSmartComponent, {
      width: '90%',
      panelClass: 'aca-edit-rule-dialog-container'
    });

    this.onRuleCreate(dialogRef)
  }

  onRuleCreate(dialogRef) {
    this.ruleDialogOnSubmitSubscription$ = dialogRef.componentInstance.submitted.subscribe((rule) => {
      this.folderRulesService
        .createRule(this.nodeId, rule)
        .then((_) => {
          this.folderRulesService.loadRules(this.nodeId);
          dialogRef.close();
        })
        .catch((err) => {
          this.notificationService.showError(err.response.body.error.errorKey);
        });
    });
  }

  onRuleDelete(): void {
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
          this.folderRulesService.deleteRule(this.nodeId, this.selectedRule.id);
        }
      });
  }
}
