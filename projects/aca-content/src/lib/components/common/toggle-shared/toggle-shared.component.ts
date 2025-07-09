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

import { Component, DestroyRef, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { SelectionState } from '@alfresco/adf-extensions';
import { AppStore, getAppSelection, ShareNodeAction } from '@alfresco/aca-shared/store';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [CommonModule, MatMenuModule, MatIconModule, TranslatePipe, MatButtonModule],
  selector: 'app-toggle-shared',
  templateUrl: './toggle-shared.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ToggleSharedComponent implements OnInit {
  @Input()
  data: {
    iconButton?: string;
  };

  selection$: Observable<SelectionState>;
  selectionState: SelectionState;
  selectionLabel = '';
  isShared = false;

  private readonly destroyRef = inject(DestroyRef);

  constructor(private store: Store<AppStore>) {}

  ngOnInit() {
    this.selection$ = this.store.select(getAppSelection);
    this.selection$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((selectionState) => {
      this.selectionState = selectionState;

      this.isShared =
        (this.selectionState?.first?.entry && (this.selectionState.first.entry as any).sharedByUser) ||
        !!this.selectionState?.first?.entry?.properties?.['qshare:sharedId'];

      this.selectionLabel = this.isShared ? 'APP.ACTIONS.SHARE_EDIT' : 'APP.ACTIONS.SHARE';
    });
  }

  editSharedNode(selection: SelectionState, focusedElementOnCloseSelector: string) {
    this.store.dispatch(
      new ShareNodeAction(selection.first, {
        focusedElementOnCloseSelector
      })
    );
  }
}
