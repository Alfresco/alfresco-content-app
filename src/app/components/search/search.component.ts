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

import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { MinimalNodeEntryEntity, NodePaging, Pagination } from 'alfresco-js-api';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SearchQueryBuilderService, SearchComponent as AdfSearchComponent } from '@alfresco/adf-content-services';
import { SearchConfigurationService } from '@alfresco/adf-core';
import { PageComponent } from '../page.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    @ViewChild('search')
    search: AdfSearchComponent;

    queryParamName = 'q';
    searchedWord = '';
    data: NodePaging;
    totalResults = 0;
    maxItems = 5;
    skipCount = 0;
    sorting = ['name', 'asc'];

    constructor(
        public router: Router,
        private queryBuilder: SearchQueryBuilderService,
        private searchConfiguration: SearchConfigurationService,
        @Optional() private route: ActivatedRoute) {
        queryBuilder.paging = {
            skipCount: 0,
            maxItems: 25
        };
    }

    ngOnInit() {
        this.sorting = this.getSorting();

        this.queryBuilder.updated.subscribe(() => {
            this.sorting = this.getSorting();
        });

        if (this.route) {
            this.route.params.forEach((params: Params) => {
                this.searchedWord = params.hasOwnProperty(this.queryParamName) ? params[this.queryParamName] : null;
                if (this.searchedWord) {
                    const queryBody = this.searchConfiguration.generateQueryBody(this.searchedWord, 0, 100);

                    this.queryBuilder.userQuery = queryBody.query.query;
                    this.queryBuilder.update();
                }
            });
        }
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
        this.maxItems = pagination.maxItems;
        this.skipCount = pagination.skipCount;

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

    onNodeDoubleClick(node: MinimalNodeEntryEntity) {
        if (node && PageComponent.isLockedNode(node)) {
            event.preventDefault();

        } else if (node && node.isFile) {
            this.router.navigate(['./preview', node.id], { relativeTo: this.route });
        }
    }
}
