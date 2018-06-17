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
import { NodePaging, Pagination, MinimalNodeEntity } from 'alfresco-js-api';
import { ActivatedRoute, Params } from '@angular/router';
import { SearchQueryBuilderService, SearchComponent as AdfSearchComponent, NodePermissionService } from '@alfresco/adf-content-services';
import { UserPreferencesService } from '@alfresco/adf-core';
import { PageComponent } from '../page.component';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states/app.state';
import { NavigateToParentFolder } from '../../store/actions';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [SearchQueryBuilderService]
})
export class SearchComponent extends PageComponent implements OnInit {

    @ViewChild('search')
    search: AdfSearchComponent;

    searchedWord: string;
    queryParamName = 'q';
    data: NodePaging;
    totalResults = 0;
    sorting = ['name', 'asc'];

    constructor(
        public permission: NodePermissionService,
        private queryBuilder: SearchQueryBuilderService,
        store: Store<AppStore>,
        preferences: UserPreferencesService,
        route: ActivatedRoute) {
        super(preferences, route, store);

        queryBuilder.paging = {
            skipCount: 0,
            maxItems: 25
        };
    }

    ngOnInit() {
        super.ngOnInit();

        this.sorting = this.getSorting();

        this.subscriptions.push(
            this.queryBuilder.updated.subscribe(() => {
                this.sorting = this.getSorting();
            }),

            this.queryBuilder.executed.subscribe(data => {
                this.onSearchResultLoaded(data);
            })
        );

        if (this.route) {
            this.route.params.forEach((params: Params) => {
                this.searchedWord = params.hasOwnProperty(this.queryParamName) ? params[this.queryParamName] : null;
                const query = this.formatSearchQuery(this.searchedWord);

                if (query) {
                    this.queryBuilder.userQuery = query;
                    this.queryBuilder.update();
                }
            });
        }
    }

    private formatSearchQuery(userInput: string) {
        if (!userInput) {
            return null;
        }

        const suffix = userInput.lastIndexOf('*') >= 0 ? '' : '*';
        const query = `${userInput}${suffix} OR name:${userInput}${suffix}`;

        return query;
    }

    onSearchResultLoaded(nodePaging: NodePaging) {
        this.data = nodePaging;
        this.totalResults = this.getNumberOfResults();
    }

    getNumberOfResults() {
        if (this.data && this.data.list && this.data.list.pagination) {
            return this.data.list.pagination.totalItems;
        }
        return 0;
    }

    onPaginationChanged(pagination: Pagination) {
        this.queryBuilder.paging = {
            maxItems: pagination.maxItems,
            skipCount: pagination.skipCount
        };
        this.queryBuilder.update();
    }

    private getSorting(): string[] {
        const primary = this.queryBuilder.getPrimarySorting();

        if (primary) {
            return [primary.key, primary.ascending ? 'asc' : 'desc'];
        }

        return ['name', 'asc'];
    }

    onNodeDoubleClick(node: MinimalNodeEntity) {
        if (node && node.entry) {
            if (node.entry.isFolder) {
                this.store.dispatch(new NavigateToParentFolder(node));
                return;
            }

            if (PageComponent.isLockedNode(node.entry)) {
                event.preventDefault();
                return;
            }

            this.showPreview(node);
        }
    }
}
