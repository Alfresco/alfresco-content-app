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

import { Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppHookService } from '@alfresco/aca-shared';
import { AppStore } from '@alfresco/aca-shared/store';
import { ToggleJoinLibraryButtonComponent } from './toggle-join-library-button.component';

@Component({
  selector: 'app-toggle-join-library-menu',
  template: `
    <button
      mat-menu-item
      #membership="libraryMembership"
      (toggle)="onToggleEvent($event)"
      (error)="onErrorEvent($event)"
      [adf-library-membership]="(selection$ | async).library"
      [attr.title]="(membership.isJoinRequested | async) ? ('APP.ACTIONS.CANCEL_JOIN' | translate) : ('APP.ACTIONS.JOIN' | translate)"
    >
      <mat-icon *ngIf="membership.isJoinRequested | async">cancel</mat-icon>
      <mat-icon *ngIf="!(membership.isJoinRequested | async)" svgIcon="adf:join_library"></mat-icon>
      <span>{{ (membership.isJoinRequested | async) ? ('APP.ACTIONS.CANCEL_JOIN' | translate) : ('APP.ACTIONS.JOIN' | translate) }}</span>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-join-library' }
})
export class ToggleJoinLibraryMenuComponent extends ToggleJoinLibraryButtonComponent {
  constructor(store: Store<AppStore>, appHookService: AppHookService) {
    super(store, appHookService);
  }
}
