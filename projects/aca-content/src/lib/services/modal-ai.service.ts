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

import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfigValues, UnsavedChangesDialogComponent, UserPreferencesService } from '@alfresco/adf-core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class ModalAiService {
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private userPreferencesService = inject(UserPreferencesService);

  openUnsavedChangesModal(callback: () => void): void {
    const hasPreviousSearch = this.route.snapshot?.queryParams?.query?.length > 0;
    const modalHidden = this.userPreferencesService.get(AppConfigValues.UNSAVED_CHANGES_MODAL_HIDDEN) === 'true';

    if (!hasPreviousSearch || modalHidden) {
      callback();
      return;
    }

    this.dialog
      .open<UnsavedChangesDialogComponent>(UnsavedChangesDialogComponent, {
        width: '345px',
        data: {
          descriptionText: 'KNOWLEDGE_RETRIEVAL.SEARCH.DISCARD_CHANGES.LOSE_RESPONSE',
          confirmButtonText: 'KNOWLEDGE_RETRIEVAL.SEARCH.DISCARD_CHANGES.ASK_AI',
          checkboxText: 'KNOWLEDGE_RETRIEVAL.SEARCH.DISCARD_CHANGES.DO_NOT_SHOW_MESSAGE',
          headerText: 'KNOWLEDGE_RETRIEVAL.SEARCH.DISCARD_CHANGES.WARNING'
        }
      })
      .afterClosed()
      .subscribe((openModal: boolean) => {
        if (openModal) {
          callback();
        }
      });
  }
}
