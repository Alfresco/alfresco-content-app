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

import { Component, inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SelectionState } from '@alfresco/adf-extensions';
import { AppStore, getAppSelection } from '@alfresco/aca-shared/store';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DocumentListService, NodeFavoriteDirective } from '@alfresco/adf-content-services';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatMenuItem, MatMenuModule } from '@angular/material/menu';

@Component({
  imports: [CommonModule, TranslatePipe, MatIconModule, MatMenuModule, NodeFavoriteDirective],
  selector: 'app-toggle-favorite',
  template: `
    <button mat-menu-item #favorites="adfFavorite" (toggle)="onToggleEvent()" [adf-node-favorite]="(selection$ | async).nodes">
      <mat-icon class="app-context-menu-item--icon">{{ favorites.hasFavorites() ? 'star' : 'star_border' }}</mat-icon>
      <span>{{ (favorites.hasFavorites() ? 'APP.ACTIONS.REMOVE_FAVORITE' : 'APP.ACTIONS.FAVORITE') | translate }}</span>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-favorite' }
})
export class ToggleFavoriteComponent implements OnInit {
  private documentListService = inject(DocumentListService);

  @Input() data: any;
  selection$: Observable<SelectionState>;
  private reloadOnRoutes: string[] = [];

  @ViewChild(MatMenuItem)
  menuItem: MatMenuItem;

  constructor(
    private store: Store<AppStore>,
    private router: Router
  ) {
    this.selection$ = this.store.select(getAppSelection);
  }

  ngOnInit() {
    this.reloadOnRoutes = this.data?.routes ?? [];
  }

  onToggleEvent() {
    const focusAfterClosed = this.data?.focusAfterClosed;
    if (focusAfterClosed) {
      document.querySelector<HTMLElement>(focusAfterClosed)?.focus();
    }
    if (this.reloadOnRoutes.includes(this.router.url)) {
      this.documentListService.reload();
    }
  }
}
