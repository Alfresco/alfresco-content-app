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
import { concatMap, takeUntil } from 'rxjs/operators';
import { ClipboardService, MaterialModule, ThumbnailService, ToolbarModule } from '@alfresco/adf-core';
import { AiAnswer, Node } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SearchAiInputContainerComponent } from '../search-ai-input-container/search-ai-input-container.component';
import { TranslateModule } from '@ngx-translate/core';
import { NodesApiService, SearchAiService } from '@alfresco/adf-content-services';
import { forkJoin } from 'rxjs';

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
  host: { class: 'aca-search-ai-results' }
})
export class SearchAiResultsComponent extends PageComponent implements OnInit, OnDestroy {
  private _agentId: string;
  private _mimeTypeIconsByNodeId: { [key: string]: string } = {};
  private _nodes: Node[];
  private restrictionQuery = '';
  private _searchQuery = '';
  private _queryAnswer: AiAnswer;

  get agentId(): string {
    return this._agentId;
  }

  get mimeTypeIconsByNodeId(): { [key: string]: string } {
    return this._mimeTypeIconsByNodeId;
  }

  get nodes(): Node[] {
    return this._nodes;
  }

  get queryAnswer(): AiAnswer {
    return this._queryAnswer;
  }

  get searchQuery(): string {
    return this._searchQuery;
  }

  constructor(
    private route: ActivatedRoute,
    private searchAiService: SearchAiService,
    private clipboardService: ClipboardService,
    private thumbnailService: ThumbnailService,
    private nodesApiService: NodesApiService
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
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  copyResponseToClipboard(): void {
    this.clipboardService.copyContentToClipboard(this.queryAnswer.answer, 'Copied response to clipboard');
  }

  performAiSearch(): void {
    this.searchAiService
      .ask({
        question: this.searchQuery,
        restrictionQuery: this.restrictionQuery
      })
      .pipe(
        concatMap((response) => this.searchAiService.getAnswer(response.questionId)),
        concatMap((response) => {
          this._queryAnswer = response.list.entries[0].entry;
          return forkJoin(this.queryAnswer.references.map((reference) => this.nodesApiService.getNode(reference.referenceId)));
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe((nodes) => {
        nodes.forEach((node) => {
          this._mimeTypeIconsByNodeId[node.id] = this.thumbnailService.getMimeTypeIcon(node.content?.mimeType);
        });
        this._nodes = nodes;
      });
  }
}
