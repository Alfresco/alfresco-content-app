/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import { NavigateLibraryAction, AppStore } from '@alfresco/aca-shared/store';
import { NodePaging, Pagination, SiteEntry } from '@alfresco/js-api';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { ContentManagementService } from '../../../services/content-management.service';
import { PageComponent } from '../../page.component';
import { SearchLibrariesQueryBuilderService } from './search-libraries-query-builder.service';
import { AppExtensionService, AppHookService } from '@alfresco/aca-shared';
import { DocumentListPresetRef } from '@alfresco/adf-extensions';

@Component({
  selector: 'aca-search-results',
  templateUrl: './search-libraries-results.component.html',
  styleUrls: ['./search-libraries-results.component.scss']
})
export class SearchLibrariesResultsComponent extends PageComponent implements OnInit {
  isSmallScreen = false;
  searchedWord: string;
  queryParamName = 'q';
  data: NodePaging;
  totalResults = 0;
  isLoading = false;
  columns: DocumentListPresetRef[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private librariesQueryBuilder: SearchLibrariesQueryBuilderService,
    private route: ActivatedRoute,
    private appHookService: AppHookService,
    store: Store<AppStore>,
    extensions: AppExtensionService,
    content: ContentManagementService
  ) {
    super(store, extensions, content);

    librariesQueryBuilder.paging = {
      skipCount: 0,
      maxItems: 25
    };
  }

  ngOnInit() {
    super.ngOnInit();

    this.columns = this.extensions.documentListPresets.searchLibraries || [];

    this.subscriptions.push(
      this.appHookService.libraryJoined.subscribe(() => this.librariesQueryBuilder.update()),
      this.appHookService.libraryDeleted.subscribe(() => this.librariesQueryBuilder.update()),
      this.appHookService.libraryLeft.subscribe(() => this.librariesQueryBuilder.update()),

      this.librariesQueryBuilder.updated.subscribe(() => {
        this.isLoading = true;

        this.librariesQueryBuilder.execute();
      }),

      this.librariesQueryBuilder.executed.subscribe((data) => {
        this.onSearchResultLoaded(data);
        this.isLoading = false;
      }),

      this.librariesQueryBuilder.hadError.subscribe((err) => {
        try {
          const {
            error: { statusCode }
          } = JSON.parse(err.message);
          if (statusCode === 400) {
            this.appHookService.library400Error.next();
          }
        } catch (e) {}
      }),

      this.breakpointObserver.observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape]).subscribe((result) => {
        this.isSmallScreen = result.matches;
      })
    );

    if (this.route) {
      this.route.params.forEach((params: Params) => {
        this.searchedWord = params.hasOwnProperty(this.queryParamName) ? params[this.queryParamName] : null;
        const query = this.formatSearchQuery(this.searchedWord);

        if (query && query.length > 1) {
          this.librariesQueryBuilder.paging.skipCount = 0;
          this.librariesQueryBuilder.userQuery = query;
          this.librariesQueryBuilder.update();
        } else {
          this.librariesQueryBuilder.userQuery = null;
          this.librariesQueryBuilder.executed.next({
            list: { pagination: { totalItems: 0 }, entries: [] }
          });
        }
      });
    }
  }

  private formatSearchQuery(userInput: string) {
    if (!userInput) {
      return null;
    }
    return userInput.trim();
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
    this.librariesQueryBuilder.paging = {
      maxItems: pagination.maxItems,
      skipCount: pagination.skipCount
    };
    this.librariesQueryBuilder.update();
  }

  navigateTo(node: SiteEntry) {
    if (node && node.entry && node.entry.guid) {
      this.store.dispatch(new NavigateLibraryAction(node.entry.guid));
    }
  }

  handleNodeClick(event: Event) {
    this.navigateTo((event as CustomEvent).detail?.node);
  }
}
