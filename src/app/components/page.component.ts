/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { MinimalNodeEntity, MinimalNodeEntryEntity, NodePaging, Pagination } from 'alfresco-js-api';

export abstract class PageComponent {

    title = 'Page';

    isLoading = false;
    isEmpty = true;

    paging: NodePaging;
    pagination: Pagination;

    node: MinimalNodeEntryEntity;

    abstract fetchNodes(parentNodeId?: string, options?: any): void;

    onFetchError(error: any) {
        this.isLoading = false;
    }

    getParentNodeId(): string {
        return this.node ? this.node.id : null;
    }

    onPaginationChange(pagination: any) {
        this.fetchNodes(this.getParentNodeId(), pagination);
    }

    onPageLoaded(page: NodePaging) {
        this.isLoading = false;
        this.paging = page;
        this.pagination = page.list.pagination;
        this.isEmpty = !(page.list.entries && page.list.entries.length > 0);
    }

    hasSelection(selection: Array<MinimalNodeEntity>): boolean {
        return selection && selection.length > 0;
    }

    filesOnlySelected(selection: Array<MinimalNodeEntity>): boolean {
        if (this.hasSelection(selection)) {
            return selection.every(entity => entity.entry && entity.entry.isFile);
        }
        return false;
    }

    foldersOnlySelected(selection: Array<MinimalNodeEntity>): boolean {
        if (this.hasSelection(selection)) {
            return selection.every(entity => entity.entry && entity.entry.isFolder);
        }
        return false;
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

    canEditFolder(selection: Array<MinimalNodeEntity>): boolean {
        if (selection && selection.length === 1) {
            const entry = selection[0].entry;

            if (entry && entry.isFolder) {
                return this.nodeHasPermission(entry, 'update');
            }
        }
        return false;
    }

    canDelete(selection: Array<MinimalNodeEntity> = []): boolean {
        return selection.every(node => node.entry && this.nodeHasPermission(node.entry, 'delete'));
    }

    canMove(selection: Array<MinimalNodeEntity>): boolean {
        return this.canDelete(selection);
    }

    canPreviewFile(selection: Array<MinimalNodeEntity>): boolean {
        return this.isFileSelected(selection);
    }

    canShareFile(selection: Array<MinimalNodeEntity>): boolean {
        return this.isFileSelected(selection);
    }

    canDownloadFile(selection: Array<MinimalNodeEntity>): boolean {
        return this.isFileSelected(selection);
    }

    nodeHasPermission(node: MinimalNodeEntryEntity, permission: string) {
        if (node && permission) {
            const { allowableOperations = [] } = <any>(node || {});

            if (allowableOperations.indexOf(permission) > -1) {
                return true;
            }
        }

        return false;
    }
}
