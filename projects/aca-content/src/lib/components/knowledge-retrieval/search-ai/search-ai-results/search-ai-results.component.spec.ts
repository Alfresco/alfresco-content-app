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

import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { SearchAiResultsComponent } from './search-ai-results.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserPreferencesService } from '@alfresco/adf-core';
import { MatDialogModule } from '@angular/material/dialog';
import { AppTestingModule } from '../../../../testing/app-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { AgentService, NodesApiService, SearchAiService } from '@alfresco/adf-content-services';
import { By } from '@angular/platform-browser';
import { ModalAiService } from '../../../../services/modal-ai.service';
import { delay } from 'rxjs/operators';
import { AiAnswer, AiAnswerEntry, QuestionModel, QuestionRequest } from '@alfresco/js-api/typings';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getAppSelection, getCurrentFolder, SearchByTermAiAction } from '@alfresco/aca-shared/store';

const questionMock: QuestionModel = { question: 'test', questionId: 'testId', restrictionQuery: { nodesIds: [] } };
const aiAnswerMock: AiAnswer = { answer: 'Some answer', questionId: 'some id', references: [] };
const getAiAnswerEntry = (noAnswer?: boolean): AiAnswerEntry => {
  return { entry: { answer: noAnswer ? '' : 'Some answer', questionId: 'some id', references: [] } };
};

describe('SearchAiResultsComponent', () => {
  const knowledgeRetrievalNodes = '{"isEmpty":"false","nodes":[{"entry":{"id": "someId","isFolder":"true"}}]}';
  let fixture: ComponentFixture<SearchAiResultsComponent>;
  let component: SearchAiResultsComponent;
  let userPreferencesService: UserPreferencesService;
  let mockQueryParams = new Subject<Params>();
  let modalAiService: ModalAiService;
  let searchAiService: SearchAiService;
  let askSpy: jasmine.Spy<(questionRequest: QuestionRequest) => void>;
  let store: MockStore;

  afterEach(() => {
    mockQueryParams = new Subject<Params>();
    fixture.destroy();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, SearchAiResultsComponent, MatSnackBarModule, MatDialogModule, MatIconTestingModule],
      providers: [
        provideMockStore(),
        {
          provide: NodesApiService,
          useValue: {
            getNode: () => of({ entry: { id: 'someId', isFolder: true } }).pipe(delay(50))
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
        }
      ]
    });

    fixture = TestBed.createComponent(SearchAiResultsComponent);
    modalAiService = TestBed.inject(ModalAiService);
    searchAiService = TestBed.inject(SearchAiService);
    userPreferencesService = TestBed.inject(UserPreferencesService);
    spyOn(TestBed.inject(AgentService), 'getAgents').and.returnValue(of([]));
    TestBed.inject(Router);
    store = TestBed.inject(MockStore);

    store.overrideSelector(getCurrentFolder, {
      isFolder: true,
      id: 'folder1',
      name: '',
      nodeType: '',
      isFile: false,
      modifiedAt: undefined,
      modifiedByUser: undefined,
      createdAt: undefined,
      createdByUser: undefined
    });
    store.overrideSelector(getAppSelection, {
      nodes: [],
      isEmpty: true,
      count: 0,
      libraries: []
    });

    askSpy = spyOn(searchAiService, 'ask').and.returnValue(of(questionMock));
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  describe('edit query input', () => {
    let textArea: HTMLTextAreaElement;
    let toggleTriggerContainer: HTMLElement;

    const getToggleEditInputButton = (): HTMLButtonElement | undefined => {
      return fixture.debugElement.query(By.css('[data-automation-id="toggle-edit-input-button"]'))?.nativeElement;
    };

    const getToggleEditInputTextArea = (): HTMLTextAreaElement | undefined => {
      return fixture.debugElement.query(By.css('[data-automation-id="toggle-edit-input-textarea"]'))?.nativeElement;
    };

    const getCancelEditInputButton = (): HTMLButtonElement => {
      return fixture.debugElement.query(By.css('[data-automation-id="cancel-input-button"]'))?.nativeElement;
    };

    const getUpdateInputButton = (): HTMLButtonElement => {
      return fixture.debugElement.query(By.css('[data-automation-id="update-input-button"]'))?.nativeElement;
    };

    const insertTextIntoTextArea = (text = 'new query') => {
      toggleTriggerContainer.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();
      getToggleEditInputButton().dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      textArea = getToggleEditInputTextArea();
      textArea.value = text;
      textArea.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };

    const inputAreaUnchangedTest = () => {
      expect(getToggleEditInputTextArea()).toBeUndefined();
      expect(component.editing).toBeFalse();
      expect(component.searchQuery).toBe('test');
    };

    beforeEach(() => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      spyOn(searchAiService, 'getAnswer').and.returnValue(of({ entry: { answer: 'Some answer', questionId: 'some id', references: [] } }));
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });
      fixture.detectChanges();
      toggleTriggerContainer = fixture.debugElement.query(By.css('[data-automation-id="toggle-edit-trigger-container"]')).nativeElement;
    });

    it('should show toggle edit input button on mouseenter', () => {
      toggleTriggerContainer.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();

      expect(getToggleEditInputButton()).toBeTruthy();
    });

    it('should hide toggle edit input button on mouseleave', () => {
      toggleTriggerContainer.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();
      toggleTriggerContainer.dispatchEvent(new MouseEvent('mouseleave'));
      fixture.detectChanges();

      expect(getToggleEditInputButton()).toBeFalsy();
    });

    it('should search for a new results after typing new query and clicking update button', () => {
      insertTextIntoTextArea();
      spyOn(store, 'dispatch');

      getUpdateInputButton().dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      expect(store.dispatch<SearchByTermAiAction>).toHaveBeenCalledWith(new SearchByTermAiAction({ searchTerm: 'new query', agentId: 'agentId1' }));
      expect(getToggleEditInputTextArea()).toBeUndefined();
      expect(component.editing).toBeFalse();
      expect(component.searchQuery).toBe('new query');
      expect(askSpy).toHaveBeenCalledWith({ question: 'new query', nodeIds: ['someId'], agentId: 'agentId1' });
    });

    it('should not search for a new results after typing new query and clicking update button if the query is the same', () => {
      insertTextIntoTextArea('test');

      getUpdateInputButton().dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      inputAreaUnchangedTest();
      expect(askSpy).not.toHaveBeenCalledWith({ question: 'new query', nodeIds: ['someId'], agentId: 'agentId1' });
    });

    it('should reset query to initial after clicking update button if the query is empty string', () => {
      insertTextIntoTextArea('');

      getUpdateInputButton().dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      inputAreaUnchangedTest();
      expect(askSpy).not.toHaveBeenCalledWith({ question: 'new query', nodeIds: ['someId'], agentId: 'agentId1' });
    });

    it('should search for a new results after typing new query and pressing enter', () => {
      insertTextIntoTextArea();

      textArea.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
      fixture.detectChanges();

      expect(askSpy).toHaveBeenCalledWith({ question: 'new query', nodeIds: ['someId'], agentId: 'agentId1' });
    });

    it('should reset query and hide text area after clicking cancel button', () => {
      insertTextIntoTextArea();

      getCancelEditInputButton().dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      inputAreaUnchangedTest();
      expect(askSpy).not.toHaveBeenCalledWith({ question: 'new query', nodeIds: ['someId'], agentId: 'agentId1' });
    });

    it('should toggle the edit input button disabled state', () => {
      toggleTriggerContainer.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();
      const toggleEditButton = getToggleEditInputButton();
      expect(toggleEditButton.disabled).toBeFalse();

      toggleEditButton.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      expect(getToggleEditInputButton().disabled).toBeTrue();

      getCancelEditInputButton().dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      expect(getToggleEditInputButton()).toBeUndefined();
    });
  });

  describe('query params change', () => {
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

      expect(component.queryAnswer).toBeUndefined();
      expect(component.hasAnsweringError).toBeTrue();
      expect(component.loading).toBeFalse();
    }));

    it('should get query answer and not display an error when getAnswer throws one error and one successful response', fakeAsync(() => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      spyOn(searchAiService, 'getAnswer').and.returnValues(throwError('error'), of(getAiAnswerEntry()));
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      tick(3000);

      expect(component.queryAnswer).toEqual({ answer: 'Some answer', questionId: 'some id', references: [] });
      expect(component.hasAnsweringError).toBeFalse();
    }));

    it('should display and answer and not display an error when getAnswer throws nine errors and one successful response', fakeAsync(() => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      spyOn(searchAiService, 'getAnswer').and.returnValues(...Array(9).fill(throwError('error')), of(getAiAnswerEntry()));
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      tick(50000);

      expect(component.queryAnswer).toEqual({ answer: 'Some answer', questionId: 'some id', references: [] });
      expect(component.hasAnsweringError).toBeFalse();
    }));

    it('should not display an answer and display an error when getAnswer throws ten errors', fakeAsync(() => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      spyOn(searchAiService, 'getAnswer').and.returnValues(...Array(14).fill(throwError('error')), of(getAiAnswerEntry(true)));
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      tick(30000);

      expect(component.queryAnswer).toBeUndefined();
      expect(component.hasAnsweringError).toBeTrue();
      expect(component.loading).toBeFalse();
    }));

    it('should not display answer and display an error if received AiAnswerPaging without answer ten times', fakeAsync(() => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      spyOn(searchAiService, 'getAnswer').and.returnValues(...Array(10).fill(of(getAiAnswerEntry(true))));
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      tick(30000);

      expect(component.queryAnswer).toBeUndefined();
      expect(component.hasAnsweringError).toBeTrue();
      expect(component.loading).toBeFalse();
    }));

    it('should not display error and display and answer if received AiAnswerPaging without answer nine times and with answer one time', fakeAsync(() => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      spyOn(searchAiService, 'getAnswer').and.returnValues(...Array(9).fill(of(getAiAnswerEntry(true))), of(getAiAnswerEntry()));
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      tick(30000);

      expect(component.queryAnswer).toEqual({ answer: 'Some answer', questionId: 'some id', references: [] });
      expect(component.hasAnsweringError).toBeFalse();
    }));
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
      expect(component.queryAnswer).toEqual(aiAnswerMock);
    });
  });
});
