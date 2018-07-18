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

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ShareDataRow } from '@alfresco/adf-content-services';

import { PageComponent } from '../page.component';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states/app.state';
import { DeleteLibraryAction, CreateLibraryAction } from '../../store/actions';
import { SiteEntry } from 'alfresco-js-api';
import { ContentManagementService } from '../../services/content-management.service';
import { ContentApiService } from '../../services/content-api.service';
import { ExtensionService } from '../../extensions/extension.service';

@Component({
    templateUrl: './libraries.component.html'
})
export class LibrariesComponent extends PageComponent implements OnInit {

    constructor(private route: ActivatedRoute,
                content: ContentManagementService,
                private contentApi: ContentApiService,
                store: Store<AppStore>,
                extensions: ExtensionService,
                private router: Router) {
        super(store, extensions, content);
    }

    ngOnInit() {
        super.ngOnInit();

        this.subscriptions.push(
            this.content.libraryDeleted.subscribe(() => this.reload()),
            this.content.libraryCreated.subscribe((node: SiteEntry) => {
                this.navigate(node.entry.guid);
            })
        );
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

    onNameClick(node: SiteEntry) {
        if (node && node.entry.guid) {
            this.navigate(node.entry.guid);
        }
    }

    navigate(libraryId: string) {
        if (libraryId) {
            this.contentApi
                .getNode(libraryId, { relativePath: '/documentLibrary' })
                .map(node => node.entry)
                .subscribe(documentLibrary => {
                    this.router.navigate([ './', documentLibrary.id ], { relativeTo: this.route });
                });
        }
    }

    deleteLibrary(node: SiteEntry) {
        if (node && node.entry) {
            this.store.dispatch(new DeleteLibraryAction(node.entry.id));
        }
    }

    createLibrary() {
        this.store.dispatch(new CreateLibraryAction());
    }
}
