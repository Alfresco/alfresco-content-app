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

import { Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FolderRuleSetsService } from '../services/folder-rule-sets.service';
import { Node } from '@alfresco/js-api';
import { RuleSet } from '../model/rule-set.model';
import { BehaviorSubject, combineLatest, from, of } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { EmptyContentComponent, NotificationService } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RuleListItemUiComponent } from '../rule-list/rule-list-item/rule-list-item.ui-component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContentNodeSelectorPanelComponent } from '@alfresco/adf-content-services';

export interface RuleSetPickerOptions {
  nodeId: string;
  defaultNodeId: string;
  existingRuleSet?: RuleSet;
}

@Component({
  imports: [
    CommonModule,
    TranslatePipe,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RuleListItemUiComponent,
    EmptyContentComponent,
    ContentNodeSelectorPanelComponent
  ],
  selector: 'aca-rule-set-picker',
  templateUrl: './rule-set-picker.smart-component.html',
  styleUrls: ['./rule-set-picker.smart-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-set-picker' },
  providers: [FolderRuleSetsService]
})
export class RuleSetPickerSmartComponent implements OnInit {
  nodeId = '-root-';
  defaultNodeId = '-root-';
  isBusy = false;
  existingRuleSet: RuleSet = null;
  hasOwnedRules = false;

  private selectedNodeId = '';
  private folderLoading$ = new BehaviorSubject<boolean>(true);

  public readonly data: RuleSetPickerOptions = inject(MAT_DIALOG_DATA);
  public readonly folderRuleSetsService = inject(FolderRuleSetsService);
  private readonly dialogRef = inject(MatDialogRef<RuleSetPickerSmartComponent>);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  mainRuleSet$ = this.folderRuleSetsService.mainRuleSet$;
  rulesLoading$ = combineLatest(this.folderRuleSetsService.isLoading$, this.folderLoading$).pipe(
    map(([rulesLoading, folderLoading]) => rulesLoading || folderLoading)
  );

  constructor() {
    this.nodeId = this.data?.nodeId ?? '-root-';
    this.defaultNodeId = this.data?.defaultNodeId ?? '-root-';
    this.existingRuleSet = this.data?.existingRuleSet ?? null;
  }

  ngOnInit(): void {
    this.mainRuleSet$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((mainRuleSet) => {
      this.hasOwnedRules = mainRuleSet?.rules.length > 0 && FolderRuleSetsService.isOwnedRuleSet(mainRuleSet, this.selectedNodeId);
    });
  }

  onNodeSelect(nodes: Node[]) {
    if (nodes?.length && nodes[0].isFolder && nodes[0].id !== this.selectedNodeId) {
      this.selectedNodeId = nodes[0].id;
      this.folderRuleSetsService.loadRuleSets(this.selectedNodeId, false);
    }
  }

  setFolderLoading(isLoading: boolean) {
    this.folderLoading$.next(isLoading);
  }

  onSubmit() {
    this.isBusy = true;
    from(this.existingRuleSet ? this.folderRuleSetsService.deleteRuleSetLink(this.nodeId, this.existingRuleSet.id) : of(null))
      .pipe(
        switchMap(() => from(this.folderRuleSetsService.createRuleSetLink(this.nodeId, this.selectedNodeId))),
        finalize(() => {
          this.isBusy = false;
        })
      )
      .subscribe(
        () => {
          this.dialogRef.close(true);
        },
        () => {
          this.handleError();
        }
      );
  }

  private handleError() {
    this.notificationService.showError('ACA_FOLDER_RULES.LINK_RULES_DIALOG.ERRORS.REQUEST_FAILED');
  }
}
