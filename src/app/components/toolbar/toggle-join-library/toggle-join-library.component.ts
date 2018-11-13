/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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
import { AppStore } from '../../../store/states';
import { appSelection } from '../../../store/selectors/app.selectors';
import { Observable } from 'rxjs';
import { SelectionState } from '@alfresco/adf-extensions';
import { ContentManagementService } from '../../../services/content-management.service';
import {
  SnackbarErrorAction,
  SnackbarInfoAction
} from '../../../store/actions/snackbar.actions';

@Component({
  selector: 'app-toggle-join-library',
  template: `
    <button
      mat-icon-button
      [color]="'primary'"
      #membership="libraryMembership"
      (toggle)="onToggleEvent($event)"
      (error)="onErrorEvent($event)"
      [acaLibraryMembership]="(selection$ | async).library"
    >
      <mat-icon
        *ngIf="(membership.isJoinRequested | async)"
        [attr.title]="'APP.ACTIONS.CANCEL_JOIN' | translate"
        >cancel
      </mat-icon>
      <mat-icon
        *ngIf="!(membership.isJoinRequested | async)"
        svgIcon="join_library"
        [attr.title]="'APP.ACTIONS.JOIN' | translate"
      ></mat-icon>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-join-library' }
})
export class ToggleJoinLibraryComponent {
  selection$: Observable<SelectionState>;

  constructor(
    private store: Store<AppStore>,
    private content: ContentManagementService
  ) {
    this.selection$ = this.store.select(appSelection);
  }

  onToggleEvent(event) {
    this.store.dispatch(new SnackbarInfoAction(event.i18nKey));

    if (event.shouldReload) {
      this.content.libraryJoined.next();
    } else {
      this.content.joinLibraryToggle.next();
    }
  }

  onErrorEvent(event) {
    this.store.dispatch(new SnackbarErrorAction(event.i18nKey));
  }
}
