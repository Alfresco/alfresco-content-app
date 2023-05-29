/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { SelectionState } from '@alfresco/adf-extensions';
import { AppStore, ShareNodeAction, getAppSelection } from '@alfresco/aca-shared/store';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule, TranslateModule, MatButtonModule],
  selector: 'app-toggle-shared',
  templateUrl: './toggle-shared.component.html'
})
export class ToggleSharedComponent implements OnInit {
  @Input()
  data: {
    iconButton?: string;
  };

  selection$: Observable<SelectionState>;

  constructor(private store: Store<AppStore>) {}

  ngOnInit() {
    this.selection$ = this.store.select(getAppSelection);
  }

  isShared(selection: SelectionState) {
    // workaround for shared files
    if (selection.first && selection.first.entry && (selection.first.entry as any).sharedByUser) {
      return true;
    }

    return selection.first && selection.first.entry && selection.first.entry.properties && !!selection.first.entry.properties['qshare:sharedId'];
  }

  editSharedNode(selection: SelectionState, focusedElementOnCloseSelector: string) {
    this.store.dispatch(
      new ShareNodeAction(selection.first, {
        focusedElementOnCloseSelector
      })
    );
  }

  getLabel(selection: SelectionState): string {
    return this.isShared(selection) ? 'APP.ACTIONS.SHARE_EDIT' : 'APP.ACTIONS.SHARE';
  }
}
