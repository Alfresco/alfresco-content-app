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

import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { MinimalNodeEntity, MinimalNodeEntryEntity, Node } from 'alfresco-js-api';

@Directive({
    selector: '[app-node-info]',
    exportAs: 'nodeInfo'
})

export class NodeInfoDirective {
    @Input('app-node-info') selection: MinimalNodeEntity[];
    @Output() changed: EventEmitter<null|Node> = new EventEmitter<null|Node>();
    @Output() error: EventEmitter<null> = new EventEmitter<null>();

    node: Node;
    loading: boolean = null;

    @HostListener('document:click', ['$event'])
    onClick(event) {
        this.nodeInfo();
    }

    constructor(private apiService: AlfrescoApiService) {}

    nodeInfo() {
        if (!this.selection.length) {
            this.node = null;
            this.loading = false;
            this.changed.emit(null);
            return;
        }

        const node = this.selection[this.selection.length - 1];

        if (node) {
            this.loading = true;

            this.apiService.getInstance().nodes
                .getNodeInfo((<any>node.entry).nodeId || node.entry.id)
                .then((data: MinimalNodeEntryEntity) => {
                    this.node = data;
                    this.changed.emit(data);
                    this.loading = false;
                })
                .catch(() => {
                    this.error.emit();
                    this.loading = false;
                });
        }
    }
}
