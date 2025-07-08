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

import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageComponent, PageLayoutComponent } from '@alfresco/aca-shared';
import { concatMap, delay, filter, finalize, retryWhen, skipWhile, switchMap } from 'rxjs/operators';
import { ClipboardService, EmptyContentComponent, ThumbnailService, UnsavedChangesGuard } from '@alfresco/adf-core';
import { AiAnswer, Node } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { SearchAiInputContainerComponent } from '../search-ai-input-container/search-ai-input-container.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
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
import { MarkdownModule, MARKED_OPTIONS, provideMarkdown } from 'ngx-markdown';
import { searchAiMarkedOptions } from './search-ai-marked-options';

@Component({
  imports: [
    CommonModule,
    PageLayoutComponent,
    SearchAiInputContainerComponent,
    TranslatePipe,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    EmptyContentComponent,
    MatCardModule,
    MatTooltipModule,
    MarkdownModule
  ],
  providers: [
    provideMarkdown({
      markedOptions: {
        provide: MARKED_OPTIONS,
        useValue: searchAiMarkedOptions
      }
    })
  ],
  selector: 'aca-search-ai-results',
  templateUrl: './search-ai-results.component.html',
  styleUrls: ['./search-ai-results.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-search-ai-results' }
})
export class SearchAiResultsComponent extends PageComponent implements OnInit {
  private static readonly MERMAID_BLOCK_REGEX = /```mermaid([\s\S]*?)```/g;
  private static readonly LATEX_BLOCK_REGEX = /```latex([\s\S]*?)```/g;

  private _agentId: string;
  private _hasAnsweringError = false;
  private _hasError = false;
  private _loading = false;
  private _mimeTypeIconsByNodeId: { [key: string]: string } = {};
  private _nodes: Node[] = [];
  private openedViewer = false;
  private _selectedNodesState: SelectionState;
  private _searchQuery = '';
  private queryAnswer: AiAnswer;
  private _displayedAnswer: string;

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

  get searchQuery(): string {
    return this._searchQuery;
  }

  get displayedAnswer(): string {
    return this._displayedAnswer;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly clipboardService: ClipboardService,
    private readonly thumbnailService: ThumbnailService,
    private readonly nodesApiService: NodesApiService,
    private readonly translateService: TranslateService,
    private readonly unsavedChangesGuard: UnsavedChangesGuard,
    private readonly modalAiService: ModalAiService,
    private readonly viewerService: ViewerService,
    private readonly elementRef: ElementRef
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
          this.queryAnswer = response.entry;
          this._displayedAnswer = this.preprocessMarkdownFormat(response.entry.answer);
          return forkJoin(this.queryAnswer.objectReferences.map((reference) => this.nodesApiService.getNode(reference.objectId)));
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

  addSourceCodeTooltips(): void {
    this.setTooltip(SearchAiResultsComponent.MERMAID_BLOCK_REGEX, '.mermaid');
    this.setTooltip(SearchAiResultsComponent.LATEX_BLOCK_REGEX, '.katex');
  }

  private setTooltip(codeBlockRegexp: RegExp, targetElementsSelector: string): void {
    const codeBlocks = [...this.queryAnswer.answer.matchAll(codeBlockRegexp)].map((match) => match[0].trim());
    const elements: HTMLElement[] = this.elementRef.nativeElement.querySelectorAll(targetElementsSelector);
    for (let i = 0; i < elements.length; i++) {
      elements[i].title = codeBlocks[i];
    }
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

  private preprocessMarkdownFormat(answer: string): string {
    return this.transformLatex(this.transformMermaid(answer));
  }

  private transformMermaid(answer: string): string {
    return answer.replace(SearchAiResultsComponent.MERMAID_BLOCK_REGEX, (_mermaidBlockRegex, blockContent: string) => {
      const transformedLines = blockContent.split('\n').map((line) => {
        const label = 'label="';
        while (line.includes(label)) {
          const labelIndex = line.indexOf(label);
          const start = labelIndex + label.length;
          const end = line.indexOf('"', start);
          line = line.slice(0, labelIndex) + line.slice(start, end) + line.slice(end + 1);
        }
        return line;
      });

      return `\`\`\`mermaid\n${transformedLines.join('\n')}\n\`\`\``;
    });
  }

  private transformLatex(answer: string): string {
    return answer.replace(SearchAiResultsComponent.LATEX_BLOCK_REGEX, (_, latexContent: string) => `$$${latexContent.trim()}$$`);
  }
}
