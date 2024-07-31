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
import { Subject } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserPreferencesService } from '@alfresco/adf-core';
import { AppTestingModule } from '../../../../testing/app-testing.module';
import { MatDialogModule } from '@angular/material/dialog';

describe('SearchAiResultsComponent', () => {
  const knowledgeRetrievalNodes = '{"isEmpty":"false","nodes":[{"entry":{"id": "someId","isFolder":"true"}}]}';
  let fixture: ComponentFixture<SearchAiResultsComponent>;
  let component: SearchAiResultsComponent;
  let userPreferencesService: UserPreferencesService;
  let mockQueryParams = new Subject<Params>();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, SearchAiResultsComponent, MatSnackBarModule, MatDialogModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: mockQueryParams.asObservable()
          }
        }
      ]
    });

    fixture = TestBed.createComponent(SearchAiResultsComponent);
    userPreferencesService = TestBed.inject(UserPreferencesService);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  afterEach(() => {
    mockQueryParams = new Subject<Params>();
    fixture.destroy();
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

    it('should throw an error if selectedNodesState nodes not available', () => {
      spyOn(userPreferencesService, 'get').and.returnValue('{}');
      mockQueryParams.next({ query: 'test', agentId: 'agentId1' });

      expect(component.searchQuery).toBe('test');
      expect(component.agentId).toBe('agentId1');
      expect(component.hasError).toBeTrue();
    });

    it('should throw an error if agentId not available', () => {
      spyOn(userPreferencesService, 'get').and.returnValue(knowledgeRetrievalNodes);
      mockQueryParams.next({ query: 'test' });

      expect(component.searchQuery).toBe('test');
      expect(component.agentId).toBe(undefined);
      expect(component.hasError).toBeTrue();
    });
  });
});
