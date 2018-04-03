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

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MinimalNodeEntity } from 'alfresco-js-api';

@Component({
    selector: 'app-search-input',
    templateUrl: 'search-input.component.html',
    styleUrls: ['search-input.component.scss']
})
export class SearchInputComponent {

    constructor(
        private router: Router) {
    }

    onItemClicked(node: MinimalNodeEntity) {
        if (node && node.entry) {
            if (node.entry.isFile) {
                this.router.navigate([`/personal-files/${node.entry.parentId}/preview/`, node.entry.id]);
            } else if (node.entry.isFolder) {
                this.router.navigate([ '/personal-files',  node.entry.id ]);
            }
        }
    }

    /**
     * Called when the user submits the search, e.g. hits enter or clicks submit
     *
     * @param event Parameters relating to the search
     */
    onSearchSubmit(event: KeyboardEvent) {
        const value = (event.target as HTMLInputElement).value;
        this.router.navigate(['/search', {
            q: value
        }]);
    }
}
