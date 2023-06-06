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

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppStore, ToggleDocumentDisplayMode, getDocumentDisplayMode } from '@alfresco/aca-shared/store';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-document-display-mode',
  template: `
    <ng-container *ngIf="displayMode$ | async as displayMode">
      <button
        id="app-document-display-mode-button"
        [attr.title]="displayModeTitle | translate"
        [attr.aria-label]="displayModeTitle | translate"
        mat-icon-button
        color="primary"
        (click)="onClick()"
      >
        <mat-icon *ngIf="displayMode === 'list'">view_comfy</mat-icon>
        <mat-icon *ngIf="displayMode === 'gallery'">list</mat-icon>
      </button>
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-document-display-mode' }
})
export class DocumentDisplayModeComponent implements OnInit, OnDestroy {
  displayMode$: Observable<string>;
  displayModeTitle: string;

  onDestroy$ = new Subject<void>();

  constructor(private store: Store<AppStore>) {}

  ngOnInit(): void {
    this.displayMode$ = this.store.select(getDocumentDisplayMode);
    this.displayMode$.pipe(takeUntil(this.onDestroy$)).subscribe((displayMode) => {
      this.displayModeTitle = displayMode === 'list' ? 'APP.ACTIONS.LIST_MODE' : 'APP.ACTIONS.GALLERY_MODE';
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onClick() {
    this.store.dispatch(new ToggleDocumentDisplayMode());
  }
}
