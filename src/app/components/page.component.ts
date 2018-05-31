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
import { ShareDataRow } from '@alfresco/adf-content-services';

export abstract class PageComponent {
    title = 'Page';
    infoDrawerOpened = false;
    node: MinimalNodeEntryEntity;

    static isLockedNode(node) {
        return node.isLocked || (node.properties && node.properties['cm:lockType'] === 'READ_ONLY_LOCK');
    }

    constructor(protected preferences: UserPreferencesService) {
    }

    getParentNodeId(): string {
        return this.node ? this.node.id : null;
    }

    hasSelection(selection: Array<MinimalNodeEntity>): boolean {
        return selection && selection.length > 0;
    }

    isFileSelected(selection: Array<MinimalNodeEntity>): boolean {
        if (selection && selection.length === 1) {
            const entry = selection[0].entry;

            if (entry && entry.isFile) {
                return true;
            }
        }
        return false;
    }

    isFolderSelected(selection: Array<MinimalNodeEntity>): boolean {
        if (selection && selection.length === 1) {
            const entry = selection[0].entry;

            if (entry && entry.isFolder) {
                return true;
            }
        }
        return false;
    }

    onChangePageSize(event: Pagination): void {
        this.preferences.paginationSize = event.maxItems;
    }

    onNodeSelect(event, documentList) {
        if (!!event.detail && !!event.detail.node) {

            const node: MinimalNodeEntryEntity = event.detail.node.entry;
            if (node && PageComponent.isLockedNode(node)) {
                this.unSelectLockedNodes(documentList);
            }
        }
    }

    unSelectLockedNodes(documentList) {
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
            return '/assets/images/ic_lock_black_24dp_1x.png';
        }
        return null;
    }

    toggleSidebar(event) {
        if (event) {
            return;
        }

        this.infoDrawerOpened = !this.infoDrawerOpened;
    }
}
