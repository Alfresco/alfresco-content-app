/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { NavigateLibraryAction } from '@alfresco/aca-shared/store';
import { NodePaging, Pagination, SiteEntry } from '@alfresco/js-api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SearchLibrariesQueryBuilderService } from './search-libraries-query-builder.service';
import {
  AppHookService,
  AppService,
  ContextActionsDirective,
  InfoDrawerComponent,
  PageComponent,
  PageLayoutComponent,
  PaginationDirective,
  ToolbarComponent
} from '@alfresco/aca-shared';
import { DocumentListPresetRef, ExtensionsModule } from '@alfresco/adf-extensions';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SearchInputComponent } from '../search-input/search-input.component';
import { DataTableModule, PaginationModule } from '@alfresco/adf-core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DocumentListModule } from '@alfresco/adf-content-services';
import { DocumentListDirective } from '../../../directives/document-list.directive';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SearchInputComponent,
    MatProgressBarModule,
    DocumentListModule,
    DataTableModule,
    ExtensionsModule,
    PaginationModule,
    InfoDrawerComponent,
    ContextActionsDirective,
    DocumentListDirective,
    PaginationDirective,
    PageLayoutComponent,
    ToolbarComponent
  ],
  selector: 'aca-search-results',
  templateUrl: './search-libraries-results.component.html',
  styleUrls: ['./search-libraries-results.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchLibrariesResultsComponent extends PageComponent implements OnInit {
  searchedWord: string;
  queryParamName = 'q';
  data: NodePaging;
  totalResults = 0;
  isLoading = false;
  columns: DocumentListPresetRef[] = [];

  constructor(
    private librariesQueryBuilder: SearchLibrariesQueryBuilderService,
    private route: ActivatedRoute,
    private appHookService: AppHookService,
    private appService: AppService
  ) {
    super();

    librariesQueryBuilder.paging = {
      skipCount: 0,
      maxItems: 25
    };
  }

  ngOnInit() {
    this.appService.setAppNavbarMode('collapsed');
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
      })
    );

    if (this.route) {
      this.route.params.forEach((params: Params) => {
        // eslint-disable-next-line no-prototype-builtins
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
