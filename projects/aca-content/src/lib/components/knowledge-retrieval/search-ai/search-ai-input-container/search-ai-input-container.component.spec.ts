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

import { SearchAiInputContainerComponent } from './search-ai-input-container.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchAiInputComponent } from '../search-ai-input/search-ai-input.component';
import { By } from '@angular/platform-browser';
import { AgentService, SearchAiService } from '@alfresco/adf-content-services';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of, Subject } from 'rxjs';
import { MatDivider } from '@angular/material/divider';
import { DebugElement } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SearchAiNavigationService } from '../../../../services/search-ai-navigation.service';
import { NavigationEnd, provideRouter, Router, RouterEvent } from '@angular/router';
import { getAppSelection } from '@alfresco/aca-shared/store';
import { NoopTranslateModule } from '@alfresco/adf-core';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('SearchAiInputContainerComponent', () => {
  const routingEvents$: Subject<RouterEvent> = new Subject();

  let component: SearchAiInputContainerComponent;
  let fixture: ComponentFixture<SearchAiInputContainerComponent>;
  let searchAiService: SearchAiService;
  let store: MockStore;
  let mockSearchAiService: jasmine.SpyObj<SearchAiService>;
  let searchNavigationService: SearchAiNavigationService;
  let mockRouter: any;

  beforeEach(() => {
    mockSearchAiService = jasmine.createSpyObj('SearchAiService', ['updateSearchAiInputState'], {
      toggleSearchAiInput$: of(true)
    });

    mockRouter = {
      url: '/some-url',
      events: routingEvents$.asObservable(),
      routerState: {
        root: {}
      },
      snapshot: {}
    };

    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, MatIconTestingModule, SearchAiInputContainerComponent],
      providers: [
        provideRouter([]),
        { provide: Router, useValue: mockRouter },
        provideMockStore(),
        { provide: SearchAiService, useValue: mockSearchAiService },
        {
          provide: AgentService,
          useValue: {
            getAgents: () =>
              of([
                {
                  id: '1',
                  name: 'HR Agent',
                  description: 'HR Agent',
                  avatar: 'avatar1'
                }
              ])
          }
        }
      ]
    });

    fixture = TestBed.createComponent(SearchAiInputContainerComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    searchAiService = TestBed.inject(SearchAiService);
    searchNavigationService = TestBed.inject(SearchAiNavigationService);
    store.overrideSelector(getAppSelection, {
      nodes: [],
      isEmpty: true,
      count: 0,
      libraries: []
    });
    component.agentId = '1';
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  describe('Search ai input', () => {
    let inputComponent: SearchAiInputComponent;

    beforeEach(() => {
      inputComponent = fixture.debugElement.query(By.directive(SearchAiInputComponent)).componentInstance;
    });

    it('should have assigned correct default placeholder', () => {
      expect(inputComponent.placeholder).toBe('KNOWLEDGE_RETRIEVAL.SEARCH.SEARCH_INPUT.DEFAULT_PLACEHOLDER');
    });

    it('should have assigned correct placeholder if placeholder has been changed', () => {
      component.placeholder = 'Some placeholder';
      fixture.detectChanges();

      expect(inputComponent.placeholder).toBe(component.placeholder);
    });

    it('should have assigned correct agentId', () => {
      expect(inputComponent.agentId).toBe(component.agentId);
    });

    it('should have assigned correct usedInAiResultsPage flag', () => {
      component.usedInAiResultsPage = true;
      fixture.detectChanges();

      expect(inputComponent.usedInAiResultsPage).toBeTrue();
    });

    it('should set inputState$ to toggleSearchAiInput$ from the service on ngOnInit', () => {
      component.ngOnInit();

      expect(component.inputState$).toBe(mockSearchAiService.toggleSearchAiInput$);
    });
  });

  describe('Divider', () => {
    it('should have a vertical divider', () => {
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.directive(MatDivider)).componentInstance.vertical).toBeTrue();
    });
  });

  describe('Leaving button', () => {
    let button: DebugElement;

    beforeEach(() => {
      button = fixture.debugElement.query(By.directive(MatIconButton));
    });

    it('should have correct title when page is not knowledge-retrieval', () => {
      mockRouter.url = '/other-page';

      component.ngOnInit();

      expect(button.nativeElement.title).toBe('KNOWLEDGE_RETRIEVAL.SEARCH.SEARCH_INPUT.HIDE_INPUT');
    });

    it('should have correct title when page is knowledge-retrieval', () => {
      mockRouter.url = '/knowledge-retrieval/some-data';

      component.ngOnInit();
      fixture.detectChanges();

      expect(button.nativeElement.title).toBe('KNOWLEDGE_RETRIEVAL.SEARCH.SEARCH_INPUT.HIDE_ANSWER');
    });

    it('should contain close icon', () => {
      expect(button.query(By.directive(MatIcon)).nativeElement.textContent).toBe('close');
    });

    it('should call navigateToPreviousRoute on SearchAiService when clicked', () => {
      spyOn(searchNavigationService, 'navigateToPreviousRouteOrCloseInput');
      button.nativeElement.click();

      expect(searchNavigationService.navigateToPreviousRouteOrCloseInput).toHaveBeenCalled();
    });

    it('should not call updateSearchAiInputState on SearchAiService when there is different event than navigation starts', () => {
      routingEvents$.next(new NavigationEnd(1, '', ''));

      expect(searchAiService.updateSearchAiInputState).not.toHaveBeenCalled();
    });
  });
});
