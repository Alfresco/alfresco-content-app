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

import { Component, OnInit, ViewChild } from '@angular/core';
import {
    NavigationEnd, PRIMARY_OUTLET, Router, RouterEvent, UrlSegment, UrlSegmentGroup,
    UrlTree
} from '@angular/router';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { SearchControlComponent } from '@alfresco/adf-content-services';

@Component({
    selector: 'app-search-input',
    templateUrl: 'search-input.component.html',
    styleUrls: ['search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

    hasOneChange = false;
    hasNewChange = false;
    navigationTimer: any;

    @ViewChild('searchControl')
    searchControl: SearchControlComponent;

    constructor(private router: Router) {
        this.router.events.filter(e => e instanceof RouterEvent).subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.showInputValue();
            }
        });
    }

    ngOnInit() {
        this.showInputValue();
    }

    showInputValue() {
        if (this.onSearchResults) {

            let searchedWord = null;
            const urlTree: UrlTree = this.router.parseUrl(this.router.url);
            const urlSegmentGroup: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];

            if (urlSegmentGroup) {
                const urlSegments: UrlSegment[] = urlSegmentGroup.segments;
                searchedWord = urlSegments[0].parameters['q'];
            }

            this.searchControl.searchTerm = searchedWord;
            this.searchControl.subscriptAnimationState = 'no-animation';

        } else {
            if (this.searchControl.subscriptAnimationState === 'no-animation') {
                this.searchControl.subscriptAnimationState = 'active';
                this.searchControl.searchTerm = '';
                this.searchControl.toggleSearchBar();
            }
        }
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

    onSearchChange(event: string) {
        if (this.onSearchResults) {

            if (this.hasOneChange) {
                this.hasNewChange = true;
            } else {
                this.hasOneChange = true;
            }

            if (this.hasNewChange) {
                clearTimeout(this.navigationTimer);
                this.hasNewChange = false;
            }

            this.navigationTimer = setTimeout(() => {
                if (event) {
                    this.router.navigate(['/search', {q: event}]);
                }
                this.hasOneChange = false;
            }, 1000);
        }
    }

    get onSearchResults() {
        return this.router.url.indexOf('/search') === 0;
    }
}
