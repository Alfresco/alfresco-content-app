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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageComponent, PageLayoutComponent, ToolbarActionComponent, ToolbarComponent } from '@alfresco/aca-shared';
import { concatMap, delay, filter, finalize, retryWhen, skipWhile, switchMap } from 'rxjs/operators';
import { AvatarComponent, ClipboardService, EmptyContentComponent, ThumbnailService, ToolbarModule, UnsavedChangesGuard } from '@alfresco/adf-core';
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
import { ViewNodeAction } from '@alfresco/aca-shared/store';
import { ViewerService } from '@alfresco/aca-content/viewer';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class SearchAiResultsComponent extends PageComponent implements OnInit {
  private _agentId: string;
  private _hasAnsweringError = false;
  private _hasError = false;
  private _loading = false;
  private _mimeTypeIconsByNodeId: { [key: string]: string } = {};
  private _nodes: Node[] = [];
  private openedViewer = false;
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
    private translateService: TranslateService,
    private unsavedChangesGuard: UnsavedChangesGuard,
    private modalAiService: ModalAiService,
    private viewerService: ViewerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.viewerService.customNodesOrder = JSON.parse(this.userPreferencesService.get('aiReferences', '[]'));
    this.route.queryParams
      .pipe(
        filter((params) => {
          const openedViewerPreviously = this.openedViewer;
          this.openedViewer = !!params.location;
          return !this.openedViewer && (!openedViewerPreviously || !this.queryAnswer);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((params) => {
        this._agentId = params.agentId;
        this._searchQuery = params.query ? decodeURIComponent(params.query) : '';
        const selectedNodesState = this.userPreferencesService.get('knowledgeRetrievalNodes');
        if (!this.searchQuery || !this.agentId || !selectedNodesState) {
          this._hasError = true;
          return;
        }
        this._selectedNodesState = JSON.parse(selectedNodesState);
        this.performAiSearch();
      });
    super.ngOnInit();

    this.unsavedChangesGuard.unsaved = this.route.snapshot?.queryParams?.query?.length > 0 && !this.hasError;
    this.unsavedChangesGuard.data = {
      descriptionText: 'KNOWLEDGE_RETRIEVAL.SEARCH.DISCARD_CHANGES.CONVERSATION_DISCARDED',
      confirmButtonText: 'KNOWLEDGE_RETRIEVAL.SEARCH.DISCARD_CHANGES.DISCARD_CONVERSATION',
      headerText: 'KNOWLEDGE_RETRIEVAL.SEARCH.DISCARD_CHANGES.WARNING',
      maxWidth: 'none'
    };
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
        switchMap((response) => {
          if (!response.entry?.answer) {
            return throwError((e) => e);
          }
          this._queryAnswer = response.entry;
          return forkJoin(this.queryAnswer.references.map((reference) => this.nodesApiService.getNode(reference.referenceId)));
        }),
        retryWhen((errors: Observable<Error>) => this.aiSearchRetryWhen(errors)),
        finalize(() => (this._loading = false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(
        (nodes) => {
          nodes.forEach((node) => {
            this._mimeTypeIconsByNodeId[node.id] = this.thumbnailService.getMimeTypeIcon(node.content?.mimeType);
          });
          this._nodes = nodes;
          const nodesIds = nodes.map((node) => node.id);
          this.viewerService.customNodesOrder = nodesIds;
          this.userPreferencesService.set('aiReferences', JSON.stringify(nodesIds));
        },
        () => (this._hasAnsweringError = true)
      );
  }

  openFile(id: string): void {
    this.store.dispatch(
      new ViewNodeAction(id, {
        location: this.router.url
      })
    );
  }

  private aiSearchRetryWhen(errors: Observable<Error>): Observable<Error> {
    this._hasAnsweringError = false;
    const delayBetweenRetries = 3000;
    const maxRetries = 9;

    return errors.pipe(
      skipWhile(() => this.hasAnsweringError),
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
