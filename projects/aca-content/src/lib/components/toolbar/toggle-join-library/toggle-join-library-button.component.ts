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

import { AppStore, SetSelectedNodesAction, getAppSelection } from '@alfresco/aca-shared/store';
import { AppHookService, UserProfileService } from '@alfresco/aca-shared';
import { SelectionState } from '@alfresco/adf-extensions';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LibraryMembershipDirective, LibraryMembershipErrorEvent, LibraryMembershipToggleEvent } from '@alfresco/adf-content-services';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '@alfresco/adf-core';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, MatButtonModule, MatIconModule, LibraryMembershipDirective],
  selector: 'app-toggle-join-library-button',
  template: `
    <button
      mat-icon-button
      color="primary"
      #membership="libraryMembership"
      (toggle)="onToggleEvent($event)"
      (error)="onErrorEvent($event)"
      [adf-library-membership]="(selection$ | async).library"
      [isAdmin]="(profile$ | async).isAdmin"
      [attr.title]="(membership.isJoinRequested | async) ? ('APP.ACTIONS.CANCEL_JOIN' | translate) : ('APP.ACTIONS.JOIN' | translate)"
    >
      <mat-icon *ngIf="membership.isJoinRequested | async">cancel</mat-icon>
      <mat-icon *ngIf="!(membership.isJoinRequested | async)">library_add</mat-icon>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-join-library' }
})
export class ToggleJoinLibraryButtonComponent {
  private userProfileService = inject(UserProfileService);
  private notificationService = inject(NotificationService);
  private appHookService = inject(AppHookService);
  private store = inject(Store<AppStore>);

  selection$: Observable<SelectionState>;
  profile$ = this.userProfileService.userProfile$;

  constructor() {
    this.selection$ = this.store.select(getAppSelection);
  }

  onToggleEvent(event: LibraryMembershipToggleEvent) {
    this.notificationService.showInfo(event.i18nKey);

    if (event.shouldReload) {
      this.appHookService.libraryJoined.next();
    } else {
      if (event.updatedEntry) {
        this.store.dispatch(new SetSelectedNodesAction([{ entry: event.updatedEntry, isLibrary: true } as any]));
      }
      this.appHookService.joinLibraryToggle.next();
    }
  }

  onErrorEvent(event: LibraryMembershipErrorEvent) {
    this.notificationService.showError(event.i18nKey);
  }
}
