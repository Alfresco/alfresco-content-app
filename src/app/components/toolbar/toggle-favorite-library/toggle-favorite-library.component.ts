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

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStore } from '@alfresco/aca-shared/store';
import { appSelection } from '../../../store/selectors/app.selectors';
import { Observable } from 'rxjs';
import { SelectionState } from '@alfresco/adf-extensions';
import { ContentManagementService } from '../../../services/content-management.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toggle-favorite-library',
  template: `
    <button
      mat-menu-item
      #favoriteLibrary="favoriteLibrary"
      (toggle)="onToggleEvent()"
      [acaFavoriteLibrary]="(selection$ | async).library"
      [attr.title]="
        favoriteLibrary.isFavorite()
          ? ('APP.ACTIONS.REMOVE_FAVORITE' | translate)
          : ('APP.ACTIONS.FAVORITE' | translate)
      "
    >
      <mat-icon *ngIf="favoriteLibrary.isFavorite()">star</mat-icon>
      <mat-icon *ngIf="!favoriteLibrary.isFavorite()">star_border</mat-icon>
      <span>{{
        (favoriteLibrary.isFavorite()
          ? 'APP.ACTIONS.REMOVE_FAVORITE'
          : 'APP.ACTIONS.FAVORITE') | translate
      }}</span>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-favorite-library' }
})
export class ToggleFavoriteLibraryComponent implements OnInit {
  selection$: Observable<SelectionState>;

  constructor(
    private store: Store<AppStore>,
    private content: ContentManagementService,
    private router: Router
  ) {}

  ngOnInit() {
    const isFavoriteLibraries = this.router.url.startsWith(
      '/favorite/libraries'
    );

    this.selection$ = this.store.select(appSelection).pipe(
      distinctUntilChanged(),
      map(selection => {
        // favorite libraries list should already be marked as favorite
        if (selection.library && isFavoriteLibraries) {
          (<any>selection.library).isFavorite = true;
          return selection;
        }
        return selection;
      })
    );
  }

  onToggleEvent() {
    this.content.favoriteLibraryToggle.next();
  }
}
