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

import { DestroyRef, Directive, HostListener, inject, OnInit } from '@angular/core';
import { DocumentListComponent, DocumentListService } from '@alfresco/adf-content-services';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPreferencesService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { filter } from 'rxjs/operators';
import { NodeEntry } from '@alfresco/js-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  standalone: true,
  selector: '[acaDocumentList]'
})
export class DocumentListDirective implements OnInit {
  private isLibrary = false;
  selectedNode: NodeEntry;

  get sortingPreferenceKey(): string {
    return this.route.snapshot.data.sortingPreferenceKey;
  }

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private store: Store<any>,
    private documentList: DocumentListComponent,
    private preferences: UserPreferencesService,
    private route: ActivatedRoute,
    private router: Router,
    private documentListService: DocumentListService
  ) {}

  ngOnInit() {
    this.documentList.stickyHeader = true;
    this.documentList.includeFields = ['isFavorite', 'aspectNames', 'definition'];
    this.isLibrary =
      this.documentList.currentFolderId === '-mysites-' ||
      // workaround for custom node list
      this.router.url.endsWith('/libraries') ||
      this.router.url.startsWith('/search-libraries');

    if (this.sortingPreferenceKey) {
      if (this.preferences.hasItem(`${this.sortingPreferenceKey}.columns.width`)) {
        this.documentList.setColumnsWidths = JSON.parse(this.preferences.get(`${this.sortingPreferenceKey}.columns.width`));
      }

      if (this.preferences.hasItem(`${this.sortingPreferenceKey}.columns.visibility`)) {
        this.documentList.setColumnsVisibility = JSON.parse(this.preferences.get(`${this.sortingPreferenceKey}.columns.visibility`));
      }

      if (this.preferences.hasItem(`${this.sortingPreferenceKey}.columns.order`)) {
        this.documentList.setColumnsOrder = JSON.parse(this.preferences.get(`${this.sortingPreferenceKey}.columns.order`));
      }

      const mode = this.documentList.sortingMode;
      this.preferences.set(`${this.sortingPreferenceKey}.sorting.mode`, mode);
      if (mode === 'server') {
        this.restoreSorting();
      }
    }

    this.documentList.ready
      .pipe(
        filter(() => !this.router.url.includes('viewer:view')),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.onReady());

    this.documentListService.reload$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.reload();
    });

    this.documentListService.resetSelection$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.reset();
    });
  }

  @HostListener('sorting-changed', ['$event'])
  onSortingChanged(event: CustomEvent) {
    if (this.sortingPreferenceKey) {
      if (this.documentList.sortingMode === 'client') {
        this.storePreviousSorting();
      }
      this.preferences.set(`${this.sortingPreferenceKey}.sorting.key`, event.detail.key);
      this.preferences.set(`${this.sortingPreferenceKey}.sorting.sortingKey`, event.detail.sortingKey);
      this.preferences.set(`${this.sortingPreferenceKey}.sorting.direction`, event.detail.direction);
    }
  }

  @HostListener('columnsWidthChanged', ['$event'])
  onColumnsWidthChanged(event: CustomEvent) {
    if (this.sortingPreferenceKey) {
      this.preferences.set(`${this.sortingPreferenceKey}.columns.width`, JSON.stringify(event));
    }
  }

  @HostListener('columnsVisibilityChanged', ['$event'])
  onColumnsVisibilityChange(event: CustomEvent) {
    if (this.sortingPreferenceKey) {
      this.preferences.set(`${this.sortingPreferenceKey}.columns.visibility`, JSON.stringify(event));
    }
  }

  @HostListener('columnsOrderChanged', ['$event'])
  onColumnOrderChanged(event: CustomEvent) {
    if (this.sortingPreferenceKey) {
      this.preferences.set(`${this.sortingPreferenceKey}.columns.order`, JSON.stringify(event));
    }
  }

  @HostListener('node-select', ['$event'])
  onNodeSelect(event: CustomEvent) {
    if (!!event.detail && !!event.detail.node) {
      this.updateSelection();
      this.selectedNode = event.detail.node;
    }
  }

  @HostListener('node-unselect')
  onNodeUnselect() {
    this.updateSelection();
  }

  onReady() {
    this.updateSelection();
    this.restoreSorting();
  }

  private updateSelection() {
    const selection = this.documentList.selection.map((node) => {
      node['isLibrary'] = this.isLibrary;
      return node;
    });

    this.store.dispatch(new SetSelectedNodesAction(selection));
  }

  private reload() {
    this.store.dispatch(new SetSelectedNodesAction([]));
  }

  private reset() {
    this.selectedNode = null;
    this.store.dispatch(new SetSelectedNodesAction([]));
  }

  private setSorting(key: string, direction: string) {
    this.documentList.sorting = [key, direction];
    this.documentList.data.setSorting({ key, direction });
  }

  private storePreviousSorting() {
    if (this.preferences.hasItem(`${this.sortingPreferenceKey}.sorting.key`)) {
      const keyToSave = this.preferences.get(`${this.sortingPreferenceKey}.sorting.key`);

      if (!keyToSave.includes(this.documentList.sorting[0])) {
        const dirToSave = this.preferences.get(`${this.sortingPreferenceKey}.sorting.direction`);
        this.preferences.set(`${this.sortingPreferenceKey}.sorting.previousKey`, keyToSave);
        this.preferences.set(`${this.sortingPreferenceKey}.sorting.previousDirection`, dirToSave);
      }
    }
  }

  private restoreSorting() {
    const [previousKey, previousDir] = [
      this.preferences.get(`${this.sortingPreferenceKey}.sorting.previousKey`, null),
      this.preferences.get(`${this.sortingPreferenceKey}.sorting.previousDirection`, null)
    ];

    const [currentKey, currentDir] = [
      this.preferences.get(`${this.sortingPreferenceKey}.sorting.sortingKey`, null) ||
        this.preferences.get(`${this.sortingPreferenceKey}.sorting.key`, null),
      this.preferences.get(`${this.sortingPreferenceKey}.sorting.direction`, null)
    ];

    if (previousKey) {
      this.setSorting(previousKey, previousDir);
    }
    if (currentKey) {
      this.setSorting(currentKey, currentDir);
    }
  }
}
