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

import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SelectionState } from '@alfresco/adf-extensions';
import { AppStore, ReloadDocumentListAction, getAppSelection } from '@alfresco/aca-shared/store';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContentDirectiveModule } from '@alfresco/adf-content-services';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, ContentDirectiveModule, MatIconModule, MatMenuModule],
  selector: 'app-toggle-favorite',
  template: `
    <button mat-menu-item #favorites="adfFavorite" (toggle)="onToggleEvent()" [adf-node-favorite]="(selection$ | async).nodes">
      <mat-icon *ngIf="favorites.hasFavorites()">star</mat-icon>
      <mat-icon *ngIf="!favorites.hasFavorites()">star_border</mat-icon>
      <span>{{ (favorites.hasFavorites() ? 'APP.ACTIONS.REMOVE_FAVORITE' : 'APP.ACTIONS.FAVORITE') | translate }}</span>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-favorite' }
})
export class ToggleFavoriteComponent implements OnInit {
  @Input() data: any;
  selection$: Observable<SelectionState>;
  private reloadOnRoutes: string[] = [];

  constructor(private store: Store<AppStore>, private router: Router) {
    this.selection$ = this.store.select(getAppSelection);
  }

  ngOnInit() {
    if (this.data) {
      this.reloadOnRoutes = JSON.parse(this.data.replace(/'/g, '"'));
    }
  }

  onToggleEvent() {
    if (this.reloadOnRoutes.includes(this.router.url)) {
      this.store.dispatch(new ReloadDocumentListAction());
    }
  }
}
