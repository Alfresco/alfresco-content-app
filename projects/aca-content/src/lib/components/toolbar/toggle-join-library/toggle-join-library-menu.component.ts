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
import { ToggleJoinLibraryButtonComponent } from './toggle-join-library-button.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LibraryMembershipDirective } from '@alfresco/adf-content-services';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule, MatMenuModule, LibraryMembershipDirective],
  selector: 'app-toggle-join-library-menu',
  template: `
    <button
      mat-menu-item
      #membership="libraryMembership"
      (toggle)="onToggleEvent($event)"
      (error)="onErrorEvent($event)"
      [adf-library-membership]="(selection$ | async).library"
      [isAdmin]="(profile$ | async).isAdmin"
      [attr.title]="(membership.isJoinRequested | async) ? ('APP.ACTIONS.CANCEL_JOIN' | translate) : ('APP.ACTIONS.JOIN' | translate)"
    >
      <mat-icon>{{ membership.isJoinRequested ? 'cancel' : 'library_add' }}</mat-icon>
      <span>{{ (membership.isJoinRequested | async) ? ('APP.ACTIONS.CANCEL_JOIN' | translate) : ('APP.ACTIONS.JOIN' | translate) }}</span>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-join-library' }
})
export class ToggleJoinLibraryMenuComponent extends ToggleJoinLibraryButtonComponent {}
