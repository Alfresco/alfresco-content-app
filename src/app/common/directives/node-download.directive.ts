/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2017 Alfresco Software Limited
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

import { Directive, Input, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { DownloadZipDialogComponent } from '@alfresco/adf-content-services';

@Directive({
    selector: '[app-download-node]'
})
export class DownloadFileDirective {

    @Input('app-download-node')
    nodes: MinimalNodeEntity[];

    @HostListener('click')
    onClick() {
        this.downloadNodes(this.nodes);
    }

    constructor(
        private apiService: AlfrescoApiService,
        private dialog: MatDialog
    ) {}

    private downloadNodes(selection: Array<MinimalNodeEntity>) {
        if (!selection || selection.length === 0) {
            return;
        }

        if (selection.length === 1) {
            this.downloadNode(selection[0]);
        } else {
            this.downloadZip(selection);
        }
    }

    private downloadNode(node: MinimalNodeEntity) {
        if (node && node.entry) {
            const entry = node.entry;

            if (entry.isFile) {
                this.downloadFile(node);
            }

            if (entry.isFolder) {
                this.downloadZip([node]);
            }

            // Check if there's nodeId for Shared Files
            if (!entry.isFile && !entry.isFolder && (<any>entry).nodeId) {
                this.downloadFile(node);
            }
        }
    }

    private downloadFile(node: MinimalNodeEntity) {
        if (node && node.entry) {
            const contentApi = this.apiService.getInstance().content;

            const url = contentApi.getContentUrl(node.entry.id, true);
            const fileName = node.entry.name;

            this.download(url, fileName);
        }
    }

    private downloadZip(selection: Array<MinimalNodeEntity>) {
        if (selection && selection.length > 0) {
            // nodeId for Shared node
            const nodeIds = selection.map((node: any) => (node.entry.nodeId || node.entry.id));

            this.dialog.open(DownloadZipDialogComponent, {
                width: '600px',
                disableClose: true,
                data: {
                    nodeIds
                }
            });
        }
    }

    private download(url: string, fileName: string) {
        if (url && fileName) {
            const link = document.createElement('a');

            link.style.display = 'none';
            link.download = fileName;
            link.href = url;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
