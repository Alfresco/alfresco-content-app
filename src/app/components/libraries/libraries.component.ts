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

import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NodesApiService } from '@alfresco/adf-core';
import { DocumentListComponent, ShareDataRow } from '@alfresco/adf-content-services';

import { PageComponent } from '../page.component';

@Component({
    templateUrl: './libraries.component.html'
})
export class LibrariesComponent extends PageComponent {

    @ViewChild(DocumentListComponent)
    documentList: DocumentListComponent;

    constructor(
        private nodesApi: NodesApiService,
        private route: ActivatedRoute,
        private router: Router) {
        super();
    }

    makeLibraryTooltip(library: any): string {
        const { description, title } = library;

        return description || title || '';
    }

    makeLibraryTitle(library: any): string {
        const rows = this.documentList.data.getRows();
        const entries  = rows.map((r: ShareDataRow) => r.node.entry);
        const { title, id } = library;

        let isDuplicate = false;

        if (entries) {
            isDuplicate = entries
                .some((entry: any) => {
                    return (entry.id !== id && entry.title === title);
                });
        }

        return isDuplicate ? `${title} (${id})` : `${title}`;
    }

    onNodeDoubleClick(e: CustomEvent) {
        const node: any = e.detail.node.entry;

        if (node && node.guid) {
            this.navigate(node.guid);
        }
    }

    navigate(libraryId: string) {
        if (libraryId) {
            this.nodesApi
                .getNode(libraryId, { relativePath: '/documentLibrary' })
                .subscribe(documentLibrary => {
                    this.router.navigate([ './', documentLibrary.id ], { relativeTo: this.route });
                });
        }
    }

    fetchNodes(): void {
        // todo: remove once all views migrate to native data source
    }
}
