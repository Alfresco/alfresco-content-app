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

import { DocumentListComponent, ShareDataRow, UploadService } from '@alfresco/adf-content-services';
import { ShowHeaderMode } from '@alfresco/adf-core';
import { ContentActionRef, DocumentListPresetRef, SelectionState } from '@alfresco/adf-extensions';
import { OnDestroy, OnInit, OnChanges, ViewChild, SimpleChanges, Directive, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { NodeEntry, Node, NodePaging } from '@alfresco/js-api';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DocumentBasePageService } from './document-base-page.service';
import {
  AppStore,
  ReloadDocumentListAction,
  getCurrentFolder,
  getAppSelection,
  isInfoDrawerOpened,
  getSharedUrl,
  ViewNodeAction,
  ViewNodeExtras,
  SetSelectedNodesAction
} from '@alfresco/aca-shared/store';
import { AppExtensionService } from '../../services/app.extension.service';
import { isLibrary, isLocked } from '../../utils/node.utils';
import { AcaFileAutoDownloadService } from '../../services/aca-file-auto-download.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

/* eslint-disable @angular-eslint/directive-class-suffix */
@Directive()
export abstract class PageComponent implements OnInit, OnDestroy, OnChanges {
  onDestroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(DocumentListComponent)
  documentList: DocumentListComponent;

  title = 'Page';
  infoDrawerOpened$: Observable<boolean>;
  node: Node;
  selection: SelectionState;
  sharedPreviewUrl$: Observable<string>;
  actions: Array<ContentActionRef> = [];
  viewerToolbarActions: Array<ContentActionRef> = [];
  canUpdateNode = false;
  canUpload = false;
  nodeResult: NodePaging;
  showHeader = ShowHeaderMode.Data;
  filterSorting = 'name-asc';
  createActions: Array<ContentActionRef> = [];
  isSmallScreen = false;

  protected extensions = inject(AppExtensionService);
  protected content = inject(DocumentBasePageService);
  protected store = inject<Store<AppStore>>(Store<AppStore>);
  protected breakpointObserver = inject(BreakpointObserver);
  protected uploadService = inject(UploadService);
  protected router = inject(Router);
  private fileAutoDownloadService = inject(AcaFileAutoDownloadService, { optional: true });

  protected subscriptions: Subscription[] = [];

  ngOnInit() {
    this.extensions
      .getCreateActions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((actions) => {
        this.createActions = actions;
      });

    this.sharedPreviewUrl$ = this.store.select(getSharedUrl);
    this.infoDrawerOpened$ = this.store.select(isInfoDrawerOpened);

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

    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
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

  showPreview(node: NodeEntry, extras?: ViewNodeExtras) {
    if (node && node.entry) {
      if (this.fileAutoDownloadService?.shouldFileAutoDownload(node.entry?.content?.sizeInBytes)) {
        this.fileAutoDownloadService.autoDownloadFile(node);
      } else {
        let id: string;

        if (node.entry.nodeType === 'app:filelink') {
          id = node.entry.properties['cm:destination'];
        } else {
          id = (node as any).entry.nodeId || (node as any).entry.guid || node.entry.id;
        }

        this.store.dispatch(new ViewNodeAction(id, extras));
      }
    }
  }

  getParentNodeId(): string {
    return this.node ? this.node.id : null;
  }

  imageResolver(row: ShareDataRow): string | null {
    if (row) {
      if (isLocked(row.node)) {
        return 'assets/images/baseline-lock-24px.svg';
      }

      if (isLibrary(row.node)) {
        return 'assets/images/baseline-library_books-24px.svg';
      }
    }

    return null;
  }

  reload(selectedNode?: NodeEntry): void {
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

  onSortingChanged(event: any) {
    this.filterSorting = event.detail.key + '-' + event.detail.direction;
  }

  onAllFilterCleared() {
    if (!this.isOutletPreviewUrl()) {
      this.documentList.node = null;
      this.store.dispatch(new ReloadDocumentListAction());
    }
  }
}
