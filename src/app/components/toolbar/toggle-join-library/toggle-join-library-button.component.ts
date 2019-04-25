/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import {
  AppStore,
  SetSelectedNodesAction,
  SnackbarErrorAction,
  SnackbarInfoAction,
  getAppSelection
} from '@alfresco/aca-shared/store';
import { SelectionState } from '@alfresco/adf-extensions';
import { Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  LibraryMembershipErrorEvent,
  LibraryMembershipToggleEvent
} from '../../../directives/library-membership.directive';
import { ContentManagementService } from '../../../services/content-management.service';

@Component({
  selector: 'app-toggle-join-library-button',
  template: `
    <button
      mat-icon-button
      color="primary"
      #membership="libraryMembership"
      (toggle)="onToggleEvent($event)"
      (error)="onErrorEvent($event)"
      [acaLibraryMembership]="(selection$ | async).library"
      [attr.title]="
        (membership.isJoinRequested | async)
          ? ('APP.ACTIONS.CANCEL_JOIN' | translate)
          : ('APP.ACTIONS.JOIN' | translate)
      "
    >
      <mat-icon *ngIf="(membership.isJoinRequested | async)">cancel</mat-icon>
      <mat-icon
        *ngIf="!(membership.isJoinRequested | async)"
        svgIcon="adf:join_library"
      ></mat-icon>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-join-library' }
})
export class ToggleJoinLibraryButtonComponent {
  selection$: Observable<SelectionState>;

  constructor(
    private store: Store<AppStore>,
    private content: ContentManagementService
  ) {
    this.selection$ = this.store.select(getAppSelection);
  }

  onToggleEvent(event: LibraryMembershipToggleEvent) {
    this.store.dispatch(new SnackbarInfoAction(event.i18nKey));

    if (event.shouldReload) {
      this.content.libraryJoined.next();
    } else {
      if (event.updatedEntry) {
        this.store.dispatch(
          new SetSelectedNodesAction([
            <any>{ entry: event.updatedEntry, isLibrary: true }
          ])
        );
      }
      this.content.joinLibraryToggle.next();
    }
  }

  onErrorEvent(event: LibraryMembershipErrorEvent) {
    this.store.dispatch(new SnackbarErrorAction(event.i18nKey));
  }
}
