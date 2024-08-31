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
import { ActivatedRoute } from '@angular/router';
import { PageComponent, PageLayoutComponent, ToolbarActionComponent, ToolbarComponent } from '@alfresco/aca-shared';
import { concatMap, delay, finalize, retryWhen, skipWhile, switchMap, takeUntil } from 'rxjs/operators';
import {
  AvatarComponent,
  ClipboardService,
  EmptyContentComponent,
  ThumbnailService,
  ToolbarModule,
  UnsavedChangesGuard,
  UserPreferencesService
} from '@alfresco/adf-core';
import { AiAnswer, Node } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { SearchAiInputContainerComponent } from '../search-ai-input-container/search-ai-input-container.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NodesApiService } from '@alfresco/adf-content-services';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { SelectionState } from '@alfresco/adf-extensions';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModalAiService } from '../../../../services/modal-ai.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    ToolbarActionComponent,
    ToolbarModule,
    ToolbarComponent,
    SearchAiInputContainerComponent,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    EmptyContentComponent,
    MatCardModule,
    AvatarComponent,
    MatTooltipModule
  ],
  selector: 'aca-search-ai-results',
  templateUrl: './search-ai-results.component.html',
  styleUrls: ['./search-ai-results.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-search-ai-results' }
})
export class SearchAiResultsComponent extends PageComponent implements OnInit, OnDestroy {
  private _agentId: string;
  private _hasAnsweringError = false;
  private _hasError = false;
  private _loading = false;
  private _mimeTypeIconsByNodeId: { [key: string]: string } = {};
  private _nodes: Node[] = [];
  private _selectedNodesState: SelectionState;
  private _searchQuery = '';
  private _queryAnswer: AiAnswer;

  get agentId(): string {
    return this._agentId;
  }

  get hasAnsweringError(): boolean {
    return this._hasAnsweringError;
  }

  get hasError(): boolean {
    return this._hasError;
  }

  get loading(): boolean {
    return this._loading;
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
    private clipboardService: ClipboardService,
    private thumbnailService: ThumbnailService,
    private nodesApiService: NodesApiService,
    private userPreferencesService: UserPreferencesService,
    private translateService: TranslateService,
    private unsavedChangesGuard: UnsavedChangesGuard,
    private modalAiService: ModalAiService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.onDestroy$)).subscribe((params) => {
      this._agentId = params.agentId;
      this._searchQuery = params.query ? decodeURIComponent(params.query) : '';
      if (!this.searchQuery || !this.agentId) {
        this._hasError = true;
        return;
      }
      this._selectedNodesState = JSON.parse(this.userPreferencesService.get('knowledgeRetrievalNodes'));
      this.performAiSearch();
    });
    super.ngOnInit();

    this.unsavedChangesGuard.unsaved = this.route.snapshot?.queryParams?.query?.length > 0;
    this.unsavedChangesGuard.data = {
      descriptionText: 'KNOWLEDGE_RETRIEVAL.SEARCH.DISCARD_CHANGES.CONVERSATION_DISCARDED',
      confirmButtonText: 'KNOWLEDGE_RETRIEVAL.SEARCH.DISCARD_CHANGES.OKAY',
      headerText: 'KNOWLEDGE_RETRIEVAL.SEARCH.DISCARD_CHANGES.WARNING'
    };
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  copyResponseToClipboard(): void {
    this.clipboardService.copyContentToClipboard(
      this.queryAnswer.answer,
      this.translateService.instant('KNOWLEDGE_RETRIEVAL.SEARCH.RESULTS_PAGE.COPY_MESSAGE')
    );
  }

  checkUnsavedChangesAndSearch(): void {
    this.modalAiService.openUnsavedChangesModal(() => this.performAiSearch());
  }

  performAiSearch(): void {
    this._loading = true;

    this.searchAiService
      .ask({
        question: this.searchQuery,
        nodeIds: this._selectedNodesState?.nodes?.length ? this._selectedNodesState.nodes.map((node) => node.entry.id) : [],
        agentId: this._agentId
      })
      .pipe(
        switchMap((response) => this.searchAiService.getAnswer(response.questionId)),
        retryWhen((errors) => this.aiSearchRetryWhen(errors)),
        switchMap((response) => {
          if (!response.list.entries[0].entry?.answer) {
            return throwError((e) => e);
          }
          this._queryAnswer = response.list.entries[0].entry;
          return forkJoin(this.queryAnswer.references.map((reference) => this.nodesApiService.getNode(reference.referenceId)));
        }),
        retryWhen((errors) => this.aiSearchRetryWhen(errors)),
        finalize(() => (this._loading = false)),
        takeUntil(this.onDestroy$)
      )
      .subscribe(
        (nodes) => {
          nodes.forEach((node) => {
            this._mimeTypeIconsByNodeId[node.id] = this.thumbnailService.getMimeTypeIcon(node.content?.mimeType);
          });
          this._nodes = nodes;
        },
        () => (this._hasAnsweringError = true)
      );
  }

  private aiSearchRetryWhen<T>(errors: Observable<T>): Observable<T> {
    const delayBetweenRetries = 3000;
    const maxRetries = 9;

    return errors.pipe(
      skipWhile(() => this._hasAnsweringError),
      delay(delayBetweenRetries),
      concatMap((e, index) => {
        if (index === maxRetries) {
          this._hasAnsweringError = true;
          this._loading = false;
          return throwError(e);
        }
        return of(null);
      })
    );
  }
}
