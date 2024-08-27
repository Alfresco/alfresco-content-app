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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SearchAiResultsComponent } from './search-ai-results.component';
import { ActivatedRoute, Params } from '@angular/router';
import { of, Subject } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserPreferencesService } from '@alfresco/adf-core';
import { MatDialogModule } from '@angular/material/dialog';
import { AppTestingModule } from '../../../../testing/app-testing.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NodesApiService, SearchAiService } from '@alfresco/adf-content-services';
import { By } from '@angular/platform-browser';
import { ModalAiService } from '../../../../services/modal-ai.service';
import { delay } from 'rxjs/operators';
import { AiAnswer, AiAnswerPaging, QuestionModel } from '@alfresco/js-api/typings';

const questionMock: QuestionModel = { question: 'test', questionId: 'testId', restrictionQuery: '' };
const aiAnswerMock: AiAnswer = { answer: 'Some answer', questionId: 'some id', references: [] };
const getAiAnswerPaging = (withEntry: boolean): AiAnswerPaging => {
  return {
    list: {
      entries: withEntry ? [{ entry: { answer: 'Some answer', questionId: 'some id', references: [] } }] : [],
      pagination: { hasMoreItems: false, maxItems: 0, totalItems: 0, skipCount: 0 }
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

  afterEach(() => {
    mockQueryParams = new Subject<Params>();
    fixture.destroy();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, SearchAiResultsComponent, MatSnackBarModule, MatDialogModule, MatIconTestingModule],
      providers: [
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
    component = fixture.componentInstance;
    component.ngOnInit();
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

    it('should not display skeleton when loading is false', () => {
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      spyOn(searchAiService, 'ask').and.returnValue(of(questionMock));
      spyOn(searchAiService, 'getAnswer').and.returnValue(of(getAiAnswerPaging(false)));

      component.performAiSearch();
      fixture.detectChanges();

      expect(component.loading).toBeFalse();
      expect(getSkeletonElementsLength()).toBe(0);
    });
  });

  describe('Unsaved Changes Modal', () => {
    beforeEach(() => {
      spyOn(userPreferencesService, 'get').and.returnValue('true');
    });

    it('should open Unsaved Changes Modal and run callback successfully', () => {
      const modalAiSpy = spyOn(modalAiService, 'openUnsavedChangesModal').and.callThrough();

      spyOn(searchAiService, 'ask').and.returnValue(of(questionMock));
      spyOn(searchAiService, 'getAnswer').and.returnValue(of(getAiAnswerPaging(true)));

      fixture.detectChanges();

      fixture.debugElement.query(By.css(`[data-automation-id="aca-search-ai-results-regeneration-button"]`)).nativeElement.click();
      expect(modalAiSpy).toHaveBeenCalledWith(jasmine.any(Function));
      expect(component.queryAnswer).toEqual(aiAnswerMock);
    });
  });
});
