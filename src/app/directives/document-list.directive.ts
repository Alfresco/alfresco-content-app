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

import { Directive, OnDestroy, OnInit, HostListener } from '@angular/core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPreferencesService } from '@alfresco/adf-core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { takeUntil } from 'rxjs/operators';
import { ContentManagementService } from '../services/content-management.service';

@Directive({
  selector: '[acaDocumentList]'
})
export class DocumentListDirective implements OnInit, OnDestroy {
  private isLibrary = false;

  onDestroy$ = new Subject<boolean>();

  get sortingPreferenceKey(): string {
    return this.route.snapshot.data.sortingPreferenceKey;
  }

  constructor(
    private store: Store<any>,
    private content: ContentManagementService,
    private documentList: DocumentListComponent,
    private preferences: UserPreferencesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.documentList.includeFields = ['isFavorite', 'aspectNames'];
    this.isLibrary =
      this.documentList.currentFolderId === '-mysites-' ||
      // workaround for custom node list
      this.router.url.endsWith('/libraries') ||
      this.router.url.startsWith('/search-libraries');

    if (this.sortingPreferenceKey) {
      const current = this.documentList.sorting;

      const key = this.preferences.get(
        `${this.sortingPreferenceKey}.sorting.key`,
        current[0]
      );
      const direction = this.preferences.get(
        `${this.sortingPreferenceKey}.sorting.direction`,
        current[1]
      );

      this.documentList.sorting = [key, direction];
      // TODO: bug in ADF, the `sorting` binding is not updated when changed from code
      this.documentList.data.setSorting({ key, direction });
    }

    this.documentList.ready
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.onReady());

    this.content.reload.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.reload();
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  @HostListener('sorting-changed', ['$event'])
  onSortingChanged(event: CustomEvent) {
    if (this.sortingPreferenceKey) {
      this.preferences.set(
        `${this.sortingPreferenceKey}.sorting.key`,
        event.detail.key
      );
      this.preferences.set(
        `${this.sortingPreferenceKey}.sorting.direction`,
        event.detail.direction
      );
    }
  }

  @HostListener('node-select', ['$event'])
  onNodeSelect(event: CustomEvent) {
    if (!!event.detail && !!event.detail.node) {
      this.updateSelection();
    }
  }

  @HostListener('node-unselect')
  onNodeUnselect() {
    this.updateSelection();
  }

  onReady() {
    this.updateSelection();
  }

  private updateSelection() {
    const selection = this.documentList.selection.map(node => {
      node['isLibrary'] = this.isLibrary;
      return node;
    });

    this.store.dispatch(new SetSelectedNodesAction(selection));
  }

  private reload() {
    this.documentList.resetSelection();
    this.store.dispatch(new SetSelectedNodesAction([]));
    this.documentList.reload();
  }
}
