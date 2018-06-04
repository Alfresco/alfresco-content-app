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

import { MinimalNodeEntity, MinimalNodeEntryEntity, Pagination } from 'alfresco-js-api';
import { UserPreferencesService } from '@alfresco/adf-core';
import { ShareDataRow, DocumentListComponent } from '@alfresco/adf-content-services';
import { ActivatedRoute, Router } from '@angular/router';
import { OnDestroy, ViewChild, OnInit } from '@angular/core';
import { Subscription, Subject } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { AcaState } from '../store/states/app.state';
import { SetSelectedNodesAction } from '../store/actions/select-nodes.action';
import { selectedNodes } from '../store/selectors/app.selectors';
import { takeUntil } from 'rxjs/operators';

export abstract class PageComponent implements OnInit, OnDestroy {

    onDestroy$: Subject<void> = new Subject<void>();

    @ViewChild(DocumentListComponent)
    documentList: DocumentListComponent;

    title = 'Page';
    infoDrawerOpened = false;
    node: MinimalNodeEntryEntity;

    isFileSelected = false;
    isFolderSelected = false;
    hasSelection = false;
    selectedNodes: MinimalNodeEntity[];

    protected subscriptions: Subscription[] = [];

    get sortingPreferenceKey(): string {
        return this.route.snapshot.data.sortingPreferenceKey;
    }

    static isLockedNode(node) {
        return node.isLocked || (node.properties && node.properties['cm:lockType'] === 'READ_ONLY_LOCK');
    }

    constructor(protected preferences: UserPreferencesService,
                protected router: Router,
                protected route: ActivatedRoute,
                protected store: Store<AcaState>) {
    }

    ngOnInit() {
        this.store
            .select(selectedNodes)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(selection => this.onSelectionChanged(selection));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
        this.onDestroy$.complete();
    }

    private onSelectionChanged(selection: MinimalNodeEntity[] = []) {
        this.selectedNodes = selection;
        this.hasSelection = selection.length > 0;
        this.isFileSelected = false;
        this.isFolderSelected = false;

        if (selection.length > 0) {
            const firstNode = selection[0];
            this.isFileSelected = firstNode.entry.isFile;
            this.isFolderSelected = firstNode.entry.isFolder;
        }

        if (!this.hasSelection) {
            this.infoDrawerOpened = false;
        }
    }

    showPreview(node: MinimalNodeEntity) {
        if (node && node.entry) {
            if (node.entry.isFile) {
                this.router.navigate(['./preview', node.entry.id], { relativeTo: this.route });
            }
        }
    }

    getParentNodeId(): string {
        return this.node ? this.node.id : null;
    }

    onChangePageSize(event: Pagination): void {
        this.preferences.paginationSize = event.maxItems;
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
}
