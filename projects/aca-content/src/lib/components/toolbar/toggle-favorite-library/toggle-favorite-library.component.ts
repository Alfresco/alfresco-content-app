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

import { Component, DestroyRef, inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppHookService } from '@alfresco/aca-shared';
import { AppStore, getAppSelection } from '@alfresco/aca-shared/store';
import { SelectionState } from '@alfresco/adf-extensions';
import { distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LibraryFavoriteDirective } from '@alfresco/adf-content-services';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuItem, MatMenuModule } from '@angular/material/menu';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [CommonModule, TranslatePipe, MatIconModule, MatMenuModule, LibraryFavoriteDirective],
  selector: 'app-toggle-favorite-library',
  template: `
    <button
      mat-menu-item
      (toggle)="onToggleEvent()"
      [adf-favorite-library]="library"
      [attr.title]="library.isFavorite ? ('APP.ACTIONS.REMOVE_FAVORITE' | translate) : ('APP.ACTIONS.FAVORITE' | translate)"
    >
      <mat-icon class="app-context-menu-item--icon">{{ library.isFavorite ? 'star' : 'star_border' }}</mat-icon>
      <span>{{ (library.isFavorite ? 'APP.ACTIONS.REMOVE_FAVORITE' : 'APP.ACTIONS.FAVORITE') | translate }}</span>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-favorite-library' }
})
export class ToggleFavoriteLibraryComponent implements OnInit {
  library;

  @Input() data: { focusAfterClosed?: string };

  @ViewChild(MatMenuItem)
  menuItem: MatMenuItem;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private store: Store<AppStore>,
    private appHookService: AppHookService,
    private router: Router
  ) {}

  ngOnInit() {
    const isFavoriteLibraries = this.router.url.startsWith('/favorite/libraries');

    this.store
      .select(getAppSelection)
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((selection: SelectionState) => {
        this.library = { ...selection.library };

        // favorite libraries list should already be marked as favorite
        if (selection.library && isFavoriteLibraries) {
          this.library.isFavorite = true;
        }
      });
  }

  onToggleEvent() {
    if (this.data?.focusAfterClosed) {
      document.querySelector<HTMLElement>('.adf-context-menu-source')?.focus();
    }
    setTimeout(() => {
      this.appHookService.favoriteLibraryToggle.next();
    }, 100);
  }
}
