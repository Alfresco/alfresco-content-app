/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { DocumentListPresetRef, DynamicColumnComponent } from '@alfresco/adf-extensions';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchInputComponent } from '../search-input/search-input.component';
import { CustomEmptyContentTemplateDirective, DataColumnComponent, DataColumnListComponent, PaginationComponent } from '@alfresco/adf-core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DocumentListDirective } from '../../../directives/document-list.directive';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { extractSearchedWordFromEncodedQuery } from '../../../utils/aca-search-utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [
    CommonModule,
    TranslatePipe,
    SearchInputComponent,
    MatProgressBarModule,
    PaginationComponent,
    InfoDrawerComponent,
    ContextActionsDirective,
    DocumentListDirective,
    PaginationDirective,
    PageLayoutComponent,
    ToolbarComponent,
    DynamicColumnComponent,
    DocumentListComponent,
    DataColumnListComponent,
    DataColumnComponent,
    CustomEmptyContentTemplateDirective
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
      this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
        const encodedQuery = params[this.queryParamName] || null;
        this.searchedWord = extractSearchedWordFromEncodedQuery(encodedQuery);
        if (this.searchedWord?.length > 1) {
          this.librariesQueryBuilder.paging.skipCount = 0;
          this.librariesQueryBuilder.userQuery = this.searchedWord;
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

  onSearchResultLoaded(nodePaging: NodePaging) {
    this.data = nodePaging;
    this.totalResults = this.getNumberOfResults();
  }

  getNumberOfResults() {
    if (this.data?.list?.pagination) {
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
    if (node?.entry?.guid) {
      this.store.dispatch(new NavigateLibraryAction(node.entry));
    }
  }

  handleNodeClick(event: Event) {
    this.navigateTo((event as CustomEvent).detail?.node);
  }
}
