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
import { ContentActionRef, SelectionState } from '@alfresco/adf-extensions';
import { OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinimalNodeEntity, MinimalNodeEntryEntity } from 'alfresco-js-api';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppExtensionService } from '../extensions/extension.service';
import { ContentManagementService } from '../services/content-management.service';
import { SetSelectedNodesAction, ViewFileAction } from '../store/actions';
import { appSelection, currentFolder, documentDisplayMode, infoDrawerOpened, sharedUrl } from '../store/selectors/app.selectors';
import { AppStore } from '../store/states/app.state';

export abstract class PageComponent implements OnInit, OnDestroy {

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

    protected subscriptions: Subscription[] = [];

    static isLockedNode(node) {
        return node.isLocked || (node.properties && node.properties['cm:lockType'] === 'READ_ONLY_LOCK');
    }

    constructor(
        protected store: Store<AppStore>,
        protected extensions: AppExtensionService,
        protected content: ContentManagementService) {}

    ngOnInit() {
        this.sharedPreviewUrl$ = this.store.select(sharedUrl);
        this.infoDrawerOpened$ = this.store.select(infoDrawerOpened);
        this.documentDisplayMode$ = this.store.select(documentDisplayMode);

        this.store
            .select(appSelection)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(selection => {
                this.selection = selection;
                this.actions = this.extensions.getAllowedToolbarActions();
                this.viewerToolbarActions = this.extensions.getViewerToolbarActions();
                this.canUpdateNode = this.selection.count === 1 && this.content.canUpdateNode(selection.first);
            });

        this.store.select(currentFolder)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(node => {
                this.canUpload = node && this.content.canUploadContent(node);
            });
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

    reload(): void {
        if (this.documentList) {
            this.documentList.resetSelection();
            this.store.dispatch(new SetSelectedNodesAction([]));
            this.documentList.reload();
        }
    }

    trackByActionId(index: number, action: ContentActionRef) {
        return action.id;
    }
}
