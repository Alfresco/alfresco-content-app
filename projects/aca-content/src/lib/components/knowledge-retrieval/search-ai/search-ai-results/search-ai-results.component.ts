/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PageComponent, PageLayoutComponent, ToolbarActionComponent, ToolbarComponent } from '@alfresco/aca-shared';
import { takeUntil } from 'rxjs/operators';
import { AlfrescoApiService, ClipboardService, IconModule, MaterialModule, ThumbnailService, ToolbarModule } from '@alfresco/adf-core';
import { ResultSetPaging, ResultSetRowEntry } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SearchAiNavigationService } from '../../../../services/search-ai-navigation.service';
import { SearchAiService } from '../../../../services/search-ai.service';
import { AiSearchResultModel } from '../../../../services/ai-search-result.model';
import { SearchAiInputContainerComponent } from '../search-ai-input-container/search-ai-input-container.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    ToolbarActionComponent,
    IconModule,
    ToolbarModule,
    MaterialModule,
    ToolbarComponent,
    SearchAiInputContainerComponent
  ],
  providers: [provideAnimations()],
  selector: 'aca-search-ai-results',
  templateUrl: './search-ai-results.component.html',
  styleUrls: ['./search-ai-results.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-search-ai-results' },
  animations: [
    trigger('fadeIn', [
      transition('* => changed, :enter', [
        style({
          opacity: 0
        }),
        animate(
          '500ms ease-out',
          style({
            opacity: 1
          })
        )
      ])
    ]),
    trigger('fadeFromTop', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-10px)'
        }),
        animate(
          '500ms ease-out',
          style({
            opacity: 1,
            transform: 'translateY(0)'
          })
        )
      ])
    ]),
    trigger('fadeFromTopDelay', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-10px)'
        }),
        animate(
          '500ms 500ms ease-out',
          style({
            opacity: 1,
            transform: 'translateY(0)'
          })
        )
      ])
    ])
  ]
})
export class SearchAiResultsComponent extends PageComponent implements OnDestroy {
  aiSearchResult: AiSearchResultModel;
  nodeList: ResultSetRowEntry[];

  private _searchQuery = '';
  animateSearchQuery = false;
  get searchQuery(): string {
    return this._searchQuery;
  }

  set searchQuery(value: string) {
    this._searchQuery = value;
    this.animateSearchQuery = true;
  }

  restrictionQuery = '';
  hideAiToggle = false;

  readonly initialCardsNew = [
    {
      title: 'Metatdata organisation',
      content: 'Users can ask the model to automatically tag or categorize files based on their metadata, such as date, author, or keywords'
    },
    {
      title: 'Content recommendations',
      content: 'Based on user preferences and historical data, Generative AI can provide personalised content recommendations.'
    },
    {
      title: 'Content summarisation',
      content: 'Generative AI can generate summaries or abstracts of lengthy documents within the content management software'
    },
    {
      title: 'Content search & retrieval',
      content: 'Users can interact with Generative AI to search for specific content within the management software'
    }
  ];
  hasAiSearchTriggered = false;

  constructor(
    route: ActivatedRoute,
    private apiService: AlfrescoApiService,
    private searchAiService: SearchAiService,
    private clipboardService: ClipboardService,
    private thumbnailService: ThumbnailService,
    private searchNavigationService: SearchAiNavigationService
  ) {
    super();
    route.queryParams.pipe(takeUntil(this.onDestroy$)).subscribe((params: Params) => {
      this.hideAiToggle = params['hideAiToggle'];
      this.searchQuery = params['q'] ? decodeURIComponent(params['q']) : '';
      this.restrictionQuery = params['restrictionQuery'] ? params['restrictionQuery'] : '';
      if (this.searchQuery) {
        this.performAiSearch();
      }
    });
    this.searchNavigationService.hasAiSearchResults = false;
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  copyResponseToClipboard() {
    this.clipboardService.copyContentToClipboard(this.aiSearchResult.aiResponse, 'Copied response to clipboard');
  }

  onRegenerateClick() {
    this.searchNavigationService.openConfirmDialog().subscribe((confirm) => {
      if (confirm) {
        this.performAiSearch();
      }
    });
  }

  getMimeTypeIcon(node: ResultSetRowEntry): string {
    const mimeType = this.getMimeType(node);
    return this.thumbnailService.getMimeTypeIcon(mimeType);
  }

  getMimeType(node: ResultSetRowEntry): string {
    let mimeType: string;

    if (node.entry.content?.mimeType) {
      mimeType = node.entry.content.mimeType;
    }
    return mimeType;
  }

  performAiSearch() {
    this.hasAiSearchTriggered = true;
    this.aiSearchResult = null;
    const searchClient = this.apiService.getInstance().searchClient;
    const originalBasePath = searchClient.basePath;
    this.searchAiService.setSearchClientBasePath(`${searchClient.host}/alfresco/service/api`);
    this.searchAiService
      .executeAISearch(this.searchQuery, this.restrictionQuery)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((response: AiSearchResultModel) => {
        if (response) {
          this.aiSearchResult = new AiSearchResultModel();
          this.aiSearchResult.aiResponse = response.aiResponse;
          this.aiSearchResult.searchResult = this.formatSearchResultHighlights(response.searchResult);
          this.nodeList = this.aiSearchResult.searchResult.list.entries;

          this.searchNavigationService.hasAiSearchResults = true;
        }
      });
    this.searchAiService.setSearchClientBasePath(originalBasePath);
  }

  private formatSearchResultHighlights(searchResults: ResultSetPaging): ResultSetPaging {
    searchResults?.list?.entries?.forEach((result) => {
      const highlights = result.entry?.search?.highlight;
      if (highlights?.length > 0) {
        highlights[0].snippets = highlights[0].snippets.map((snippet) => '...' + snippet.replace(/\[b]/g, '<b>').replace(/\[\/b]/g, '</b>') + '...');
        result.entry.search.highlight = highlights;
      }
    });
    return searchResults;
  }
}
