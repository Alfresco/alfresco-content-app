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

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PageComponent, PageLayoutComponent, ToolbarActionComponent, ToolbarComponent } from '@alfresco/aca-shared';
import { takeUntil } from 'rxjs/operators';
import { ClipboardService, MaterialModule, ThumbnailService, ToolbarModule } from '@alfresco/adf-core';
import { ResultSetPaging, ResultSetRowEntry } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SearchAiNavigationService } from '../../../../services/search-ai-navigation.service';
import { AiSearchResultModel } from '../../../../services/ai-search-result.model';
import { SearchAiInputContainerComponent } from '../search-ai-input-container/search-ai-input-container.component';
import { TranslateModule } from '@ngx-translate/core';
import { SearchAiService } from '@alfresco/adf-content-services';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    ToolbarActionComponent,
    ToolbarModule,
    MaterialModule,
    ToolbarComponent,
    SearchAiInputContainerComponent,
    TranslateModule
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
export class SearchAiResultsComponent extends PageComponent implements OnInit, OnDestroy {
  private _agentId: string;
  private _nodes: ResultSetRowEntry[];
  private restrictionQuery = '';
  private _searchResult: AiSearchResultModel;
  private _searchQuery = '';

  get agentId(): string {
    return this._agentId;
  }

  get nodes(): ResultSetRowEntry[] {
    return this._nodes;
  }

  get searchResult(): AiSearchResultModel {
    return this._searchResult;
  }

  get searchQuery(): string {
    return this._searchQuery;
  }

  constructor(
    private route: ActivatedRoute,
    private searchAiService: SearchAiService,
    private clipboardService: ClipboardService,
    private thumbnailService: ThumbnailService,
    private searchNavigationService: SearchAiNavigationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.onDestroy$)).subscribe((params: Params) => {
      this._agentId = params.agentId;
      this._searchQuery = params.query ? decodeURIComponent(params.query) : '';
      this.restrictionQuery = params.restrictionQuery || '';
      if (this.searchQuery) {
        this.performAiSearch();
      }
    });
    this.searchNavigationService.hasAiSearchResults = false;
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  copyResponseToClipboard(): void {
    this.clipboardService.copyContentToClipboard(this.searchResult.aiResponse, 'Copied response to clipboard');
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

  performAiSearch(): void {
    this._searchResult = null;
    this.searchAiService
      .ask({
        question: this.searchQuery,
        restrictionQuery: this.restrictionQuery
      })
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((response: any) => {
        if (response) {
          this._searchResult = new AiSearchResultModel();
          this.searchResult.aiResponse = response.aiResponse;
          this.searchResult.searchResult = this.formatSearchResultHighlights(response.searchResult);
          this._nodes = this.searchResult.searchResult.list.entries;

          this.searchNavigationService.hasAiSearchResults = true;
        }
      });
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
