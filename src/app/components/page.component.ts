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
import { FileUploadErrorEvent, UserPreferencesService } from '@alfresco/adf-core';
import { OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { MinimalNodeEntity, MinimalNodeEntryEntity } from 'alfresco-js-api';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs/Rx';
import { SnackbarErrorAction, ViewNodeAction, SetSelectedNodesAction } from '../store/actions';
import { appSelection } from '../store/selectors/app.selectors';
import { AppStore } from '../store/states/app.state';
import { SelectionState } from '../store/states/selection.state';

export abstract class PageComponent implements OnInit, OnDestroy {

    onDestroy$: Subject<boolean> = new Subject<boolean>();

    @ViewChild(DocumentListComponent)
    documentList: DocumentListComponent;

    title = 'Page';
    infoDrawerOpened = false;
    node: MinimalNodeEntryEntity;
    selection: SelectionState;

    protected subscriptions: Subscription[] = [];

    static isLockedNode(node) {
        return node.isLocked || (node.properties && node.properties['cm:lockType'] === 'READ_ONLY_LOCK');
    }

    constructor(protected preferences: UserPreferencesService,
                protected route: ActivatedRoute,
                protected store: Store<AppStore>) {
    }

    ngOnInit() {
        this.store
            .select(appSelection)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(selection => {
                this.selection = selection;
                if (selection.isEmpty) {
                    this.infoDrawerOpened = false;
                }
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
            const { id, nodeId, name, isFile, isFolder } = node.entry;
            const parentId = this.node ? this.node.id : null;

            this.store.dispatch(new ViewNodeAction({
                parentId,
                id: nodeId || id,
                name,
                isFile,
                isFolder
            }));
        }
    }

    getParentNodeId(): string {
        return this.node ? this.node.id : null;
    }

    onNodeSelect(event: CustomEvent, documentList: DocumentListComponent) {
        if (!!event.detail && !!event.detail.node) {

            const node: MinimalNodeEntryEntity = event.detail.node.entry;
            if (node && PageComponent.isLockedNode(node)) {
                this.unSelectLockedNodes(documentList);
            }

            this.store.dispatch(new SetSelectedNodesAction(documentList.selection));
        }
    }

    onDocumentListReady(event: CustomEvent, documentList: DocumentListComponent) {
        this.store.dispatch(new SetSelectedNodesAction(documentList.selection));
    }

    onNodeUnselect(event: CustomEvent, documentList: DocumentListComponent) {
        this.store.dispatch(new SetSelectedNodesAction(documentList.selection));
    }

    unSelectLockedNodes(documentList: DocumentListComponent) {
        documentList.selection = documentList.selection.filter(item => !PageComponent.isLockedNode(item.entry));

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

    isLockedRow(row) {
        return row.getValue('isLocked') ||
            (row.getValue('properties') && row.getValue('properties')['cm:lockType'] === 'READ_ONLY_LOCK');
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

    onFileUploadedError(error: FileUploadErrorEvent) {
        let message = 'APP.MESSAGES.UPLOAD.ERROR.GENERIC';

        if (error.error.status === 409) {
           message = 'APP.MESSAGES.UPLOAD.ERROR.CONFLICT';
        }

        if (error.error.status === 500) {
            message = 'APP.MESSAGES.UPLOAD.ERROR.500';
         }

        const action = new SnackbarErrorAction(message);

        this.store.dispatch(action);
    }
}
