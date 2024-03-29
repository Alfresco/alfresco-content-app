/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ToggleInfoDrawerAction, isInfoDrawerOpened } from '@alfresco/aca-shared/store';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, MatButtonModule, MatIconModule],
  selector: 'app-toggle-info-drawer',
  template: `
    <button
      mat-icon-button
      [color]="(infoDrawerOpened$ | async) ? 'primary' : null"
      [attr.aria-label]="'APP.ACTIONS.DETAILS' | translate"
      [attr.aria-expanded]="infoDrawerOpened$ | async"
      [attr.title]="'APP.ACTIONS.DETAILS' | translate"
      (click)="onClick()"
    >
      <mat-icon>view_sidebar</mat-icon>
    </button>
  `,
  styles: [
    `
      .app-toggle-info-drawer button:focus {
        border: 2px solid var(--theme-blue-button-color);
        border-radius: 6px;
        outline: none;
        background-color: var(--theme-selected-background-color);
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-info-drawer' }
})
export class ToggleInfoDrawerComponent {
  infoDrawerOpened$: Observable<boolean>;

  constructor(private store: Store<any>) {
    this.infoDrawerOpened$ = this.store.select(isInfoDrawerOpened);
  }

  onClick() {
    this.store.dispatch(new ToggleInfoDrawerAction());
  }
}
