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
import { NodePaging, Pagination } from 'alfresco-js-api';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SearchQueryBuilderService, SearchComponent as AdfSearchComponent } from '@alfresco/adf-content-services';

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
    maxItems = 5;
    skipCount = 0;
    // pagination: Pagination;

    constructor(
        public router: Router,
        private queryBuilder: SearchQueryBuilderService,
        @Optional() private route: ActivatedRoute) {
    }

    ngOnInit() {
        if (this.route) {
            this.route.params.forEach((params: Params) => {
                this.searchedWord = params.hasOwnProperty(this.queryParamName) ? params[this.queryParamName] : null;
                this.queryBuilder.queryFragments['queryName'] = `cm:name:'${this.searchedWord}'`;
                this.queryBuilder.update();
            });
        }
    }

    onSearchResultLoaded(nodePaging: NodePaging) {
        this.data = nodePaging;
        // this.pagination = nodePaging.list.pagination;
        // console.log(nodePaging);
    }

    onRefreshPagination(pagination: Pagination) {
        this.maxItems = pagination.maxItems;
        this.skipCount = pagination.skipCount;
    }
}
