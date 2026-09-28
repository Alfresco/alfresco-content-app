/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, DestroyRef, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Node, NodeAssociationEntry, NodeAssociationPaging } from '@alfresco/js-api';
import { ContentApiService } from '@alfresco/aca-shared';
import { ConfirmDialogComponent, NotificationService } from '@alfresco/adf-core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, switchMap } from 'rxjs/operators';
import {
  CreateAssociationDialogComponent,
  CreateAssociationDialogData,
  CreateAssociationDialogResult
} from './create-association-dialog/create-association-dialog.component';

@Component({
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatListModule, MatProgressSpinnerModule, TranslatePipe],
  selector: 'app-associations-tab',
  templateUrl: './associations-tab.component.html',
  styleUrls: ['./associations-tab.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssociationsTabComponent implements OnInit {
  private readonly contentApi = inject(ContentApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  @Input()
  node: Node;

  associations: NodeAssociationEntry[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadAssociations();
  }

  openCreateAssociationDialog(): void {
    const sourceId = (this.node as any)?.nodeId ?? this.node?.id;

    this.dialog
      .open<CreateAssociationDialogComponent, CreateAssociationDialogData, CreateAssociationDialogResult>(CreateAssociationDialogComponent, {
        width: '700px',
        data: { node: this.node }
      })
      .afterClosed()
      .pipe(
        filter((result): result is CreateAssociationDialogResult => !!result && !!sourceId),
        switchMap((result) =>
          this.contentApi.createNodeAssociation(sourceId, {
            targetId: result.target.id,
            assocType: result.associationType
          })
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.notificationService.showInfo('APP.INFO_DRAWER.ASSOCIATIONS.CREATE_SUCCESS');
          this.loadAssociations();
        },
        error: (error) => {
          this.notificationService.showError(this.getCreateErrorMessage(error));
        }
      });
  }

  deleteAssociation(association: NodeAssociationEntry): void {
    const sourceId = (this.node as any)?.nodeId ?? this.node?.id;
    const targetId = association?.entry?.id;
    const assocType = association?.entry?.association?.assocType;

    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'APP.INFO_DRAWER.ASSOCIATIONS.DELETE_DIALOG.TITLE',
          message: 'APP.INFO_DRAWER.ASSOCIATIONS.DELETE_DIALOG.MESSAGE',
          yesLabel: 'APP.INFO_DRAWER.ASSOCIATIONS.DELETE_DIALOG.YES_LABEL',
          noLabel: 'APP.INFO_DRAWER.ASSOCIATIONS.DELETE_DIALOG.NO_LABEL'
        },
        minWidth: '250px'
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true && !!sourceId && !!targetId),
        switchMap(() => this.contentApi.deleteNodeAssociation(sourceId, targetId, assocType)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.notificationService.showInfo('APP.INFO_DRAWER.ASSOCIATIONS.DELETE_SUCCESS');
          this.loadAssociations();
        },
        error: () => {
          this.notificationService.showError('APP.INFO_DRAWER.ASSOCIATIONS.DELETE_ERROR');
        }
      });
  }

  private getCreateErrorMessage(error: { message?: string }): string {
    try {
      return JSON.parse(error.message).error.briefSummary;
    } catch {
      return 'APP.INFO_DRAWER.ASSOCIATIONS.CREATE_ERROR';
    }
  }

  private loadAssociations(): void {
    const nodeId = (this.node as any)?.nodeId ?? this.node?.id;

    if (!nodeId) {
      this.associations = [];
      return;
    }

    this.loading = true;

    this.contentApi
      .getNodeTargetAssociations(nodeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (paging: NodeAssociationPaging) => {
          this.associations = paging?.list?.entries ?? [];
          this.loading = false;
        },
        error: () => {
          this.associations = [];
          this.loading = false;
        }
      });
  }
}
