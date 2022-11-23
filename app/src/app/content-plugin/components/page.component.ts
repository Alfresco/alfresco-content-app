/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import { DocumentListComponent, ShareDataRow } from '@alfresco/adf-content-services';
import { ShowHeaderMode } from '@alfresco/adf-core';
import { ContentActionRef, DocumentListPresetRef, SelectionState } from '@alfresco/adf-extensions';
import { OnDestroy, OnInit, OnChanges, ViewChild, SimpleChanges, Directive } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinimalNodeEntity, MinimalNodeEntryEntity, NodePaging } from '@alfresco/js-api';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ContentManagementService } from '../services/content-management.service';
import {
  AppStore,
  ReloadDocumentListAction,
  getCurrentFolder,
  getAppSelection,
  getDocumentDisplayMode,
  isInfoDrawerOpened,
  getSharedUrl,
  ViewNodeAction,
  ViewNodeExtras,
  SetSelectedNodesAction
} from '@alfresco/aca-shared/store';
import { isLocked, isLibrary, AppExtensionService } from '@alfresco/aca-shared';

/* eslint-disable @angular-eslint/directive-class-suffix */
@Directive()
export abstract class PageComponent implements OnInit, OnDestroy, OnChanges {
  onDestroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(DocumentListComponent)
  documentList: DocumentListComponent;

  title = 'Page';
  infoDrawerOpened$: Observable<boolean>;
  node: MinimalNodeEntryEntity;
  selection: SelectionState;
  documentDisplayMode$: Observable<string>;
  sharedPreviewUrl$: Observable<string>;
  actions: Array<ContentActionRef> = [];
  viewerToolbarActions: Array<ContentActionRef> = [];
  canUpdateNode = false;
  canUpload = false;
  nodeResult: NodePaging;
  showHeader = ShowHeaderMode.Data;
  filterSorting = 'name-asc';

  protected subscriptions: Subscription[] = [];

  protected constructor(protected store: Store<AppStore>, protected extensions: AppExtensionService, protected content: ContentManagementService) {}

  ngOnInit() {
    this.sharedPreviewUrl$ = this.store.select(getSharedUrl);
    this.infoDrawerOpened$ = this.store.select(isInfoDrawerOpened).pipe(map((infoDrawerState) => !this.isOutletPreviewUrl() && infoDrawerState));

    this.documentDisplayMode$ = this.store.select(getDocumentDisplayMode);

    this.store
      .select(getAppSelection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((selection) => {
        this.selection = selection;
        this.canUpdateNode = this.selection.count === 1 && this.content.canUpdateNode(selection.first);
      });

    this.extensions
      .getAllowedToolbarActions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((actions) => {
        this.actions = actions;
      });

    this.extensions
      .getViewerToolbarActions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((actions) => {
        this.viewerToolbarActions = actions;
      });

    this.store
      .select(getCurrentFolder)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((node) => {
        this.canUpload = node && this.content.canUploadContent(node);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.nodeResult && changes.nodeResult.currentValue) {
      this.nodeResult = changes.nodeResult.currentValue;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];

    this.onDestroy$.next(true);
    this.onDestroy$.complete();
    this.store.dispatch(new SetSelectedNodesAction([]));
  }

  showPreview(node: MinimalNodeEntity, extras?: ViewNodeExtras) {
    if (node && node.entry) {
      let id: string;

      if (node.entry.nodeType === 'app:filelink') {
        id = node.entry.properties['cm:destination'];
      } else {
        id = (node as any).entry.nodeId || (node as any).entry.guid || node.entry.id;
      }

      this.store.dispatch(new ViewNodeAction(id, extras));
    }
  }

  getParentNodeId(): string {
    return this.node ? this.node.id : null;
  }

  imageResolver(row: ShareDataRow): string | null {
    if (isLocked(row.node)) {
      return 'assets/images/baseline-lock-24px.svg';
    }

    if (isLibrary(row.node)) {
      return 'assets/images/baseline-library_books-24px.svg';
    }

    return null;
  }

  reload(selectedNode?: MinimalNodeEntity): void {
    if (this.isOutletPreviewUrl()) {
      return;
    }

    this.store.dispatch(new ReloadDocumentListAction());
    if (selectedNode) {
      this.store.dispatch(new SetSelectedNodesAction([selectedNode]));
    }
  }

  trackByActionId(_: number, action: ContentActionRef) {
    return action.id;
  }

  trackById(_: number, obj: { id: string }) {
    return obj.id;
  }

  trackByColumnId(_: number, obj: DocumentListPresetRef): string {
    return obj.id;
  }

  private isOutletPreviewUrl(): boolean {
    return location.href.includes('viewer:view');
  }

  onSortingChanged(event) {
    this.filterSorting = event.detail.key + '-' + event.detail.direction;
  }

  onAllFilterCleared() {
    if (!this.isOutletPreviewUrl()) {
      this.documentList.node = null;
      this.store.dispatch(new ReloadDocumentListAction());
    }
  }
}
