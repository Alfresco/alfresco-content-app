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
import { SearchAiService } from '@alfresco/adf-content-services';
import { By } from '@angular/platform-browser';
import { ModalAiService } from '../../../../services/modal-ai.service';

describe('SearchAiResultsComponent', () => {
  const knowledgeRetrievalNodes = '{"isEmpty":"false","nodes":[{"entry":{"id": "someId","isFolder":"true"}}]}';
  let fixture: ComponentFixture<SearchAiResultsComponent>;
  let component: SearchAiResultsComponent;
  let userPreferencesService: UserPreferencesService;
  let mockQueryParams = new Subject<Params>();

  afterEach(() => {
    mockQueryParams = new Subject<Params>();
    fixture.destroy();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, SearchAiResultsComponent, MatSnackBarModule, MatDialogModule, MatIconTestingModule],
      providers: [
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
    let searchAiService: SearchAiService;

    const getSkeletonElementsLength = (): number => {
      return fixture.nativeElement.querySelectorAll('.adf-skeleton').length;
    };

    beforeEach(() => {
      searchAiService = TestBed.inject(SearchAiService);
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

      spyOn(searchAiService, 'ask').and.returnValue(of({ question: 'test', questionId: 'testId', restrictionQuery: '' }));
      spyOn(searchAiService, 'getAnswer').and.returnValue(
        of({
          list: {
            entries: [],
            pagination: { hasMoreItems: false, maxItems: 0, totalItems: 0, skipCount: 0 }
          }
        })
      );

      component.performAiSearch();
      fixture.detectChanges();

      expect(component.loading).toBeFalse();
      expect(getSkeletonElementsLength()).toBe(0);
    });
  });

  describe('Unsaved Changes Modal', () => {
    let modalAi: ModalAiService;

    beforeEach(() => {
      modalAi = TestBed.inject(ModalAiService);
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
    });

    it('should open Unsaved Changes Modal', () => {
      const modalAiSpy = spyOn(modalAi, 'openUnsavedChangesModal').and.callFake((callback) => callback());

      fixture.detectChanges();

      fixture.debugElement.query(By.css(`[data-automation-id="aca-search-ai-results-regeneration-button"]`)).nativeElement.click();
      expect(modalAiSpy).toHaveBeenCalledWith(jasmine.any(Function));
    });
  });
});
