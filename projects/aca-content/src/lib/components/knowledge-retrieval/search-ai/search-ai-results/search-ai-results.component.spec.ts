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

import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { SearchAiResultsComponent } from './search-ai-results.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, of, Subject, throwError } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EmptyContentComponent, UnitTestingUtils, UnsavedChangesGuard, UserPreferencesService } from '@alfresco/adf-core';
import { MatDialogModule } from '@angular/material/dialog';
import { AppTestingModule } from '../../../../testing/app-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { AgentService, NodesApiService, SearchAiService } from '@alfresco/adf-content-services';
import { By } from '@angular/platform-browser';
import { ModalAiService } from '../../../../services/modal-ai.service';
import { delay } from 'rxjs/operators';
import { AiAnswerEntry, QuestionModel } from '@alfresco/js-api/typings';
import { SearchAiInputComponent } from '../search-ai-input/search-ai-input.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getAppSelection, getCurrentFolder, ViewNodeAction } from '@alfresco/aca-shared/store';
import { ViewerService } from '@alfresco/aca-content/viewer';
import { DebugElement } from '@angular/core';
import { MarkdownComponent, MarkdownModule, MARKED_OPTIONS } from 'ngx-markdown';
import { searchAiMarkedOptions } from './search-ai-marked-options';

const questionMock: QuestionModel = { question: 'test', questionId: 'testId', restrictionQuery: { nodesIds: [] } };
const getAiAnswerEntry = (noAnswer?: boolean): AiAnswerEntry => {
  return {
    entry: {
      answer: noAnswer ? '' : 'Some answer',
      question: 'some question',
      objectReferences: [],
      complete: true
    }
  };
};

describe('SearchAiResultsComponent', () => {
  const knowledgeRetrievalNodes = '{"isEmpty":"false","nodes":[{"entry":{"id": "someId","isFolder":"true"}}]}';
  let fixture: ComponentFixture<SearchAiResultsComponent>;
  let component: SearchAiResultsComponent;
  let userPreferencesService: UserPreferencesService;
  let mockQueryParams = new Subject<Params>();
  let modalAiService: ModalAiService;
  let searchAiService: SearchAiService;
  let store: MockStore;
  let viewerService: ViewerService;
  let unsavedChangesGuard: UnsavedChangesGuard;
  let unitTestingUtils: UnitTestingUtils;

  afterEach(() => {
    store.resetSelectors();
    mockQueryParams = new Subject<Params>();
    fixture.destroy();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, SearchAiResultsComponent, MatSnackBarModule, MatDialogModule, MatIconTestingModule, MarkdownModule.forRoot()],
      providers: [
        {
          provide: NodesApiService,
          useValue: {
            getNode: () => of({ id: 'someId', isFolder: true }).pipe(delay(50))
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: mockQueryParams.asObservable(),
            snapshot: {
              queryParams: { query: 'testQuery' }
            }
          }
        },
        {
          provide: UnsavedChangesGuard,
          useValue: {
            unsaved: false
          }
        },
        provideMockStore()
      ]
    });

    fixture = TestBed.createComponent(SearchAiResultsComponent);
    modalAiService = TestBed.inject(ModalAiService);
    searchAiService = TestBed.inject(SearchAiService);
    userPreferencesService = TestBed.inject(UserPreferencesService);
    viewerService = TestBed.inject(ViewerService);
    unsavedChangesGuard = TestBed.inject(UnsavedChangesGuard);
    store = TestBed.inject(MockStore);
    store.overrideSelector(getAppSelection, {
      nodes: [],
      isEmpty: true,
      count: 0,
      libraries: []
    });
    store.overrideSelector(getCurrentFolder, null);
    spyOn(searchAiService, 'ask').and.returnValue(of(questionMock));
    spyOn(TestBed.inject(AgentService), 'getAgents').and.returnValue(of([]));
    component = fixture.componentInstance;
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
    component.ngOnInit();
  });

  describe('query params change', () => {
    const getEmptyContentElement = (): DebugElement => fixture.debugElement.query(By.directive(EmptyContentComponent));

    it('should perform ai search and sets agents on query params change', () => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      expect(component.searchQuery).toBe('test');
      expect(component.agentId).toBe('agentId1');
      expect(component.hasError).toBeFalse();
    });

    it('should throw an error if searchQuery not available', () => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      mockQueryParams.next({ agentId: 'agentId1' });

      expect(component.searchQuery).toBe('');
      expect(component.agentId).toBe('agentId1');
      expect(component.hasError).toBeTrue();
    });

    it('should not throw an error if selectedNodesState nodes not available', () => {
      spyOn(userPreferencesService, 'get').and.returnValue('{}');
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      expect(component.searchQuery).toBe('test');
      expect(component.agentId).toBe('agentId1');
      expect(component.hasError).toBeFalse();
    });

    it('should throw an error if agentId not available', () => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      mockQueryParams.next({ query: 'test' });

      expect(component.searchQuery).toBe('test');
      expect(component.agentId).toBe(undefined);
      expect(component.hasError).toBeTrue();
    });

    it('should not get query answer and display an error when getAnswer throws error', fakeAsync(() => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      spyOn(searchAiService, 'getAnswer').and.returnValue(throwError('error').pipe(delay(100)));
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      tick(30000);

      expect(component.displayedAnswer).toBeUndefined();
      expect(component.hasAnsweringError).toBeTrue();
      expect(component.loading).toBeFalse();
    }));

    it('should get query answer and not display an error when getAnswer throws one error and one successful response', fakeAsync(() => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      spyOn(searchAiService, 'getAnswer').and.returnValues(throwError('error'), of(getAiAnswerEntry()));
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      tick(3000);

      expect(component.displayedAnswer).toEqual('Some answer');
      expect(component.hasAnsweringError).toBeFalse();
    }));

    it('should display and answer and not display an error when getAnswer throws nine errors and one successful response', fakeAsync(() => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      spyOn(searchAiService, 'getAnswer').and.returnValues(...Array(9).fill(throwError('error')), of(getAiAnswerEntry()));
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      tick(50000);

      expect(component.displayedAnswer).toEqual('Some answer');
      expect(component.hasAnsweringError).toBeFalse();
    }));

    it('should not display an answer and display an error when getAnswer throws ten errors', fakeAsync(() => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      spyOn(searchAiService, 'getAnswer').and.returnValues(...Array(14).fill(throwError('error')), of(getAiAnswerEntry(true)));
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      tick(30000);

      expect(component.displayedAnswer).toBeUndefined();
      expect(component.hasAnsweringError).toBeTrue();
      expect(component.loading).toBeFalse();
    }));

    it('should not display answer and display an error if received AiAnswerPaging without answer ten times', fakeAsync(() => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      spyOn(searchAiService, 'getAnswer').and.returnValues(...Array(10).fill(of(getAiAnswerEntry(true))));
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      tick(30000);

      expect(component.displayedAnswer).toBeUndefined();
      expect(component.hasAnsweringError).toBeTrue();
      expect(component.loading).toBeFalse();
    }));

    it('should not display error and display and answer if received AiAnswerPaging without answer nine times and with answer one time', fakeAsync(() => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      spyOn(searchAiService, 'getAnswer').and.returnValues(...Array(9).fill(of(getAiAnswerEntry(true))), of(getAiAnswerEntry()));
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      tick(30000);

      expect(component.displayedAnswer).toEqual('Some answer');
      expect(component.hasAnsweringError).toBeFalse();
    }));

    it('should render empty content when there are not selected nodes', () => {
      mockQueryParams.next({
        query: 'test',
        agentId: 'agentId1'
      });

      fixture.detectChanges();
      expect(getEmptyContentElement()).not.toBeNull();
    });

    it('should not render empty content when there are selected nodes', () => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      mockQueryParams.next({
        query: 'test',
        agentId: 'agentId1'
      });

      fixture.detectChanges();
      expect(getEmptyContentElement()).toBeNull();
    });

    describe('when query params contains location', () => {
      let params: Params;

      beforeEach(() => {
        params = {
          query: 'test',
          agentId: 'agentId1',
          location: 'some-location'
        };
      });

      it('should not render search ai input container', () => {
        mockQueryParams.next(params);

        fixture.detectChanges();
        expect(fixture.debugElement.query(By.directive(SearchAiInputComponent))).toBeNull();
      });

      it('should not render empty content', () => {
        mockQueryParams.next({
          location: 'some-location'
        });

        fixture.detectChanges();
        expect(getEmptyContentElement()).toBeNull();
      });

      it('should not display search query', () => {
        mockQueryParams.next(params);

        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css(`[data-automation-id="aca-search-ai-results-query"]`)).nativeElement.textContent.trim()).toBe('');
      });

      it('should not call searchAiService.ask', () => {
        mockQueryParams.next(params);

        fixture.detectChanges();
        expect(searchAiService.ask).not.toHaveBeenCalled();
      });
    });
  });

  describe('skeleton loader', () => {
    const getSkeletonElementsLength = (): number => {
      return fixture.nativeElement.querySelectorAll('.adf-skeleton').length;
    };

    beforeEach(() => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
    });

    it('should display skeleton when loading is true', () => {
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      component.performAiSearch();
      fixture.detectChanges();

      expect(component.loading).toBeTrue();
      expect(getSkeletonElementsLength()).toBe(3);
    });

    it('should not display skeleton when loading is false', fakeAsync(() => {
      spyOn(searchAiService, 'getAnswer').and.returnValue(of(getAiAnswerEntry()));
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      component.performAiSearch();
      tick(30000);

      expect(component.loading).toBeFalse();
      expect(getSkeletonElementsLength()).toBe(0);
    }));
  });

  describe('Unsaved Changes Modal', () => {
    beforeEach(() => {
      spyOn(userPreferencesService, 'get').and.returnValue('true');
    });

    it('should open Unsaved Changes Modal and run callback successfully', () => {
      const modalAiSpy = spyOn(modalAiService, 'openUnsavedChangesModal').and.callThrough();

      spyOn(searchAiService, 'getAnswer').and.returnValue(of(getAiAnswerEntry()));

      fixture.detectChanges();

      fixture.debugElement.query(By.css(`[data-automation-id="aca-search-ai-results-regeneration-button"]`)).nativeElement.click();
      expect(modalAiSpy).toHaveBeenCalledWith(jasmine.any(Function));
      expect(component.displayedAnswer).toEqual('Some answer');
    });
  });

  describe('Markdown', () => {
    const getMarkdown = (): MarkdownComponent => unitTestingUtils.getByDirective(MarkdownComponent)?.componentInstance;

    const removeTabs = (answer: string): string =>
      answer
        .split('\n')
        .map((line) => line.trim())
        .join('\n');

    let queryParams: Params;
    let getAnswerSpyAnd: jasmine.SpyAnd<(questionId: string) => Observable<AiAnswerEntry>>;
    let answerEntry: AiAnswerEntry;

    beforeEach(() => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      queryParams = {
        query: 'test',
        agentId: 'agentId1'
      };
      getAnswerSpyAnd = spyOn(searchAiService, 'getAnswer').and;
      answerEntry = getAiAnswerEntry();
    });

    it('should have correct marked options', () => {
      expect(fixture.debugElement.injector.get(MARKED_OPTIONS)).toBe(searchAiMarkedOptions);
    });

    it('should be rendered when answer is loaded successfully', fakeAsync(() => {
      getAnswerSpyAnd.returnValues(
        throwError(() => 'error'),
        of(answerEntry)
      );
      mockQueryParams.next(queryParams);

      tick(3000);
      fixture.detectChanges();
      expect(getMarkdown()).toBeTruthy();
    }));

    it('should not be rendered when answer loading is failed', fakeAsync(() => {
      getAnswerSpyAnd.returnValue(throwError(() => 'error').pipe(delay(100)));
      mockQueryParams.next(queryParams);

      tick(30000);
      fixture.detectChanges();
      expect(getMarkdown()).toBeUndefined();
    }));

    it('should have assigned mermaid to true', fakeAsync(() => {
      getAnswerSpyAnd.returnValues(
        throwError(() => 'error'),
        of(answerEntry)
      );
      mockQueryParams.next(queryParams);

      tick(3000);
      fixture.detectChanges();
      expect(getMarkdown().mermaid).toBeTrue();
    }));

    it('should have assigned katex to true', fakeAsync(() => {
      getAnswerSpyAnd.returnValues(
        throwError(() => 'error'),
        of(answerEntry)
      );
      mockQueryParams.next(queryParams);

      tick(3000);
      fixture.detectChanges();
      expect(getMarkdown().katex).toBeTrue();
    }));

    it('should have assigned correct data', fakeAsync(() => {
      const answer = '#### Some title\n\nSome description';
      answerEntry.entry.answer = answer;
      getAnswerSpyAnd.returnValues(
        throwError(() => 'error'),
        of(answerEntry)
      );
      mockQueryParams.next(queryParams);

      tick(3000);
      fixture.detectChanges();
      expect(getMarkdown().data).toEqual(answer);
    }));

    it('should have assigned correct data when answer contains mermaids', fakeAsync(() => {
      answerEntry.entry.answer =
        'First example:\\n\\n```mermaid\\ngraph LR\\n    animal --> dog\\n    animal --> cat\\n```\\n\\n' +
        'Second example:\\n\\n```mermaid\\ngraph LR\\n    animal[label="Animal"] --> dog[label="Dog"]\\n    animal[label="Animal"] --> cat[label="Cat"]\\n```\\n\\n';
      getAnswerSpyAnd.returnValues(
        throwError(() => 'error'),
        of(answerEntry)
      );
      mockQueryParams.next(queryParams);

      tick(3000);
      fixture.detectChanges();
      expect(removeTabs(getMarkdown().data)).toEqual(
        removeTabs(`First example:\\n\\n\`\`\`mermaid
      \\ngraph LR\\n    animal --> dog\\n    animal --> cat\\n
      \`\`\`\\n\\nSecond example:\\n\\n\`\`\`mermaid
      \\ngraph LR\\n    animal[Animal] --> dog[Dog]\\n    animal[Animal] --> cat[Cat]\\n
      \`\`\`\\n\\n`)
      );
    }));

    it('should have assigned correct data when answer contains latex', fakeAsync(() => {
      answerEntry.entry.answer = '\n\n### Mathematical Formula\n\n```latex\nf(x) = Vint_{-\\infty}^{\\infty} \\hat{f}(lxi) e^{2 (pi i Ixi x} dx\n```';
      getAnswerSpyAnd.returnValues(
        throwError(() => 'error'),
        of(answerEntry)
      );
      mockQueryParams.next(queryParams);

      tick(3000);
      fixture.detectChanges();
      expect(getMarkdown().data).toEqual('\n\n### Mathematical Formula\n\n$$f(x) = Vint_{-\\infty}^{\\infty} \\hat{f}(lxi) e^{2 (pi i Ixi x} dx$$');
    }));

    it('should set source code tooltip for mermaid when answer contains mermaid', fakeAsync(() => {
      answerEntry.entry.answer =
        'First example:\\n\\n```mermaid\\ngraph LR\\n    animal --> dog\\n    animal --> cat\\n```\\n\\n' +
        'Second example:\\n\\n```mermaid\\ngraph LR\\n    animal[label="Animal"] --> dog[label="Dog"]\\n    animal[label="Animal"] --> cat[label="Cat"]\\n```\\n\\n';
      getAnswerSpyAnd.returnValues(
        throwError(() => 'error'),
        of(answerEntry)
      );
      mockQueryParams.next(queryParams);
      tick(3000);
      fixture.detectChanges();
      const elements = [document.createElement('div'), document.createElement('div')];
      spyOn(fixture.nativeElement, 'querySelectorAll').withArgs('.mermaid').and.returnValue(elements).and.returnValue([]);

      getMarkdown().ready.emit();
      expect(elements[0].title).toBe('```mermaid\\ngraph LR\\n    animal --> dog\\n    animal --> cat\\n```');
      expect(elements[1].title).toBe(
        '```mermaid\\ngraph LR\\n    animal[label="Animal"] --> dog[label="Dog"]\\n    animal[label="Animal"] --> cat[label="Cat"]\\n```'
      );
    }));

    it('should set source code tooltip for mermaid when answer contains latex', fakeAsync(() => {
      answerEntry.entry.answer =
        '\n\n### Mathematical Formula 1\n\n```latex\nf(x) = Vint_{-\\infty}^{\\infty} \\hat{f}(lxi) e^{2 (pi i Ixi x} dx\n```' +
        '\n\n### Mathematical Formula 2\n\n```latex\nf(x) = Vint_{-\\infty}^{\\infty} \\hat{f}(lxi) e^{5 (pi i Ixi x} dx\n```';
      getAnswerSpyAnd.returnValues(
        throwError(() => 'error'),
        of(answerEntry)
      );
      mockQueryParams.next(queryParams);
      tick(3000);
      fixture.detectChanges();
      const elements = [document.createElement('div'), document.createElement('div')];
      spyOn(fixture.nativeElement, 'querySelectorAll').withArgs('.katex').and.returnValue(elements).and.returnValue([]);

      getMarkdown().ready.emit();
      expect(elements[0].title).toBe('```latex\nf(x) = Vint_{-\\infty}^{\\infty} \\hat{f}(lxi) e^{2 (pi i Ixi x} dx\n```');
      expect(elements[1].title).toBe('```latex\nf(x) = Vint_{-\\infty}^{\\infty} \\hat{f}(lxi) e^{5 (pi i Ixi x} dx\n```');
    }));
  });

  describe('References', () => {
    let documentElement: HTMLDivElement;
    let nodesOrder: string[];

    const nodeId = 'someId';
    const url = 'some-url';

    beforeEach(fakeAsync(() => {
      spyOnProperty(viewerService, 'customNodesOrder', 'set').and.callFake((passedNodesOrder) => (nodesOrder ??= passedNodesOrder));
      spyOn(userPreferencesService, 'set');
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      const answer = getAiAnswerEntry();
      answer.entry.objectReferences = [
        {
          objectId: nodeId,
          references: []
        }
      ];
      spyOn(searchAiService, 'getAnswer').and.returnValues(throwError('error'), of(answer));
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      tick(3051);
      fixture.detectChanges();
      documentElement = fixture.debugElement.query(By.css(`[data-automation-id="aca-search-ai-results-someId-document"]`)).nativeElement;
      spyOn(store, 'dispatch');
      spyOnProperty(TestBed.inject(Router), 'url').and.returnValue(url);
    }));

    it('should dispatch ViewNodeAction on store when clicked', () => {
      documentElement.click();
      expect(store.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          ...new ViewNodeAction(nodeId, {
            location: url
          })
        })
      );
    });

    it('should dispatch ViewNodeAction on store when pressed enter', () => {
      documentElement.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: 'Enter'
        })
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          ...new ViewNodeAction(nodeId, {
            location: url
          })
        })
      );
    });

    it('should assign nodes ids to customNodesOrder for ViewerService', () => {
      expect(nodesOrder).toEqual([nodeId]);
    });

    it('should call set on userPreferencesService with correct parameters', () => {
      expect(userPreferencesService.set).toHaveBeenCalledWith('aiReferences', JSON.stringify([nodeId]));
    });
  });

  describe('ngOnInit', () => {
    it('should set customNodesOrder on ViewerService', () => {
      spyOn(userPreferencesService, 'get').and.returnValue('["node1", "node2"]');
      let nodesOrder: string[];
      spyOnProperty(viewerService, 'customNodesOrder', 'set').and.callFake((passedNodesOrder) => (nodesOrder = passedNodesOrder));

      component.ngOnInit();

      expect(nodesOrder).toEqual(['node1', 'node2']);
    });

    it('should set unsaved on UnsavedChangesGuard to false when there are no selected nodes', () => {
      mockQueryParams.next({
        query: 'test',
        agentId: 'agentId1'
      });

      component.ngOnInit();
      expect(unsavedChangesGuard.unsaved).toBeFalse();
    });

    it('should set unsaved on UnsavedChangesGuard to true when there are selected nodes', () => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      mockQueryParams.next({
        query: 'test',
        agentId: 'agentId1'
      });

      component.ngOnInit();
      expect(unsavedChangesGuard.unsaved).toBeTrue();
    });

    it('should set correct data on unsavedChangesGuard', () => {
      component.ngOnInit();
      expect(unsavedChangesGuard.data).toEqual({
        descriptionText: 'KNOWLEDGE_RETRIEVAL.SEARCH.DISCARD_CHANGES.CONVERSATION_DISCARDED',
        confirmButtonText: 'KNOWLEDGE_RETRIEVAL.SEARCH.DISCARD_CHANGES.DISCARD_CONVERSATION',
        headerText: 'KNOWLEDGE_RETRIEVAL.SEARCH.DISCARD_CHANGES.WARNING',
        maxWidth: 'none'
      });
    });
  });
});
