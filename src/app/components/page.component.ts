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

import { DocumentListComponent, ShareDataRow } from '@alfresco/adf-content-services';
import { DisplayMode } from '@alfresco/adf-core';
import { OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinimalNodeEntity, MinimalNodeEntryEntity } from 'alfresco-js-api';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs/Rx';
import { SetSelectedNodesAction, DownloadNodesAction, ViewFileAction } from '../store/actions';
import { appSelection, sharedUrl, currentFolder } from '../store/selectors/app.selectors';
import { AppStore } from '../store/states/app.state';
import { SelectionState } from '../store/states/selection.state';
import { Observable } from 'rxjs/Rx';
import { ExtensionService } from '../extensions/extension.service';
import { ContentManagementService } from '../services/content-management.service';
import { ContentActionRef } from '../extensions/action.extensions';

export abstract class PageComponent implements OnInit, OnDestroy {

    onDestroy$: Subject<boolean> = new Subject<boolean>();

    @ViewChild(DocumentListComponent)
    documentList: DocumentListComponent;

    title = 'Page';
    infoDrawerOpened = false;
    node: MinimalNodeEntryEntity;
    selection: SelectionState;
    displayMode = DisplayMode.List;
    sharedPreviewUrl$: Observable<string>;
    actions: Array<ContentActionRef> = [];
    canUpdateFile = false;
    canUpdateNode = false;
    canDelete = false;
    canEditFolder = false;
    canUpload = false;
    canDeleteShared = false;
    canUpdateShared = false;

    protected subscriptions: Subscription[] = [];

    static isLockedNode(node) {
        return node.isLocked || (node.properties && node.properties['cm:lockType'] === 'READ_ONLY_LOCK');
    }

    constructor(
        protected store: Store<AppStore>,
        protected extensions: ExtensionService,
        protected content: ContentManagementService) {}

    ngOnInit() {
        this.sharedPreviewUrl$ = this.store.select(sharedUrl);

        this.store
            .select(appSelection)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(selection => {
                this.selection = selection;
                if (selection.isEmpty) {
                    this.infoDrawerOpened = false;
                }
                this.actions = this.extensions.getAllowedContentActions();
                this.canUpdateFile = this.selection.file && this.content.canUpdateNode(selection.file);
                this.canUpdateNode = this.selection.count === 1 && this.content.canUpdateNode(selection.first);
                this.canDelete = !this.selection.isEmpty && this.content.canDeleteNodes(selection.nodes);
                this.canEditFolder = selection.folder && this.content.canUpdateNode(selection.folder);
                this.canDeleteShared = !this.selection.isEmpty && this.content.canDeleteSharedNodes(selection.nodes);
                this.canUpdateShared = selection.file && this.content.canUpdateSharedNode(selection.file);
            });

        this.store.select(currentFolder)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(node => {
                this.canUpload = node && this.content.canUploadContent(node);
            });

        this.subscriptions.push(
            this.content.favoriteAdded.subscribe(() => this.reload()),
            this.content.favoriteRemoved.subscribe(() => this.reload()),
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];

        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    showPreview(node: MinimalNodeEntity) {
        if (node && node.entry) {
            const parentId = this.node ? this.node.id : null;
           this.store.dispatch(new ViewFileAction(node, parentId));
        }
    }

    getParentNodeId(): string {
        return this.node ? this.node.id : null;
    }

    imageResolver(row: ShareDataRow): string | null {
        const entry: MinimalNodeEntryEntity = row.node.entry;

        if (PageComponent.isLockedNode(entry)) {
            return 'assets/images/ic_lock_black_24dp_1x.png';
        }
        return null;
    }

    toggleSidebar(event) {
        if (event) {
            return;
        }

        this.infoDrawerOpened = !this.infoDrawerOpened;
    }

    reload(): void {
        if (this.documentList) {
            this.documentList.resetSelection();
            this.store.dispatch(new SetSelectedNodesAction([]));
            this.documentList.reload();
        }
    }

    toggleGalleryView(): void {
        this.displayMode = this.displayMode === DisplayMode.List ? DisplayMode.Gallery : DisplayMode.List;
        this.documentList.display = this.displayMode;
    }

    downloadSelection() {
        this.store.dispatch(new DownloadNodesAction());
    }

    // this is where each application decides how to treat an action and what to do
    // the ACA maps actions to the NgRx actions as an example
    runAction(actionId: string) {
        const context = {
            selection: this.selection
        };

        this.extensions.runActionById(actionId, context);
    }
}
