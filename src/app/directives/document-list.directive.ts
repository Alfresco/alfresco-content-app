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

import { Directive, OnDestroy, OnInit, HostListener } from '@angular/core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPreferencesService } from '@alfresco/adf-core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppStore } from '../store/states/app.state';
import { SetSelectedNodesAction } from '../store/actions';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';

@Directive({
  selector: '[acaDocumentList]'
})
export class DocumentListDirective implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private isLibrary = false;

  get sortingPreferenceKey(): string {
    return this.route.snapshot.data.sortingPreferenceKey;
  }

  constructor(
    private store: Store<AppStore>,
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

    this.subscriptions.push(
      this.documentList.ready.subscribe(() => this.onReady())
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
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
      const node: MinimalNodeEntryEntity = event.detail.node.entry;
      if (node && this.isLockedNode(node)) {
        this.unSelectLockedNodes(this.documentList);
      }

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
    const selection = this.documentList.selection.map(entry => {
      entry['isLibrary'] = this.isLibrary;
      return entry;
    });

    this.store.dispatch(new SetSelectedNodesAction(selection));
  }

  private isLockedNode(node): boolean {
    return (
      node.isLocked ||
      (node.properties && node.properties['cm:lockType'] === 'READ_ONLY_LOCK')
    );
  }

  private isLockedRow(row): boolean {
    return (
      row.getValue('isLocked') ||
      (row.getValue('properties') &&
        row.getValue('properties')['cm:lockType'] === 'READ_ONLY_LOCK')
    );
  }

  private unSelectLockedNodes(documentList: DocumentListComponent) {
    documentList.selection = documentList.selection.filter(
      item => !this.isLockedNode(item.entry)
    );

    const dataTable = documentList.dataTable;
    if (dataTable && dataTable.data) {
      const rows = dataTable.data.getRows();

      if (rows && rows.length > 0) {
        rows.forEach(r => {
          if (this.isLockedRow(r)) {
            r.isSelected = false;
          }
        });
      }
    }
  }
}
