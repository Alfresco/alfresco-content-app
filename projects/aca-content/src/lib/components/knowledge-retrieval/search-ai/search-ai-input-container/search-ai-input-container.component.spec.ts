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

import { SearchAiInputContainerComponent } from './search-ai-input-container.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchAiInputComponent } from '../search-ai-input/search-ai-input.component';
import { By } from '@angular/platform-browser';
import { AgentService, ContentTestingModule, SearchAiService } from '@alfresco/adf-content-services';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getAppSelection } from '@alfresco/aca-shared/store';
import { of } from 'rxjs';
import { MatDivider } from '@angular/material/divider';
import { DebugElement } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

describe('SearchAiInputContainerComponent', () => {
  let component: SearchAiInputContainerComponent;
  let fixture: ComponentFixture<SearchAiInputContainerComponent>;
  let searchAiService: SearchAiService;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchAiInputContainerComponent, ContentTestingModule],
      providers: [
        provideMockStore(),
        {
          provide: AgentService,
          useValue: {
            getAgents: () =>
              of({
                list: {
                  entries: [
                    {
                      entry: {
                        id: '1',
                        name: 'HR Agent'
                      }
                    }
                  ]
                }
              })
          }
        }
      ]
    });

    fixture = TestBed.createComponent(SearchAiInputContainerComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    searchAiService = TestBed.inject(SearchAiService);
    store.overrideSelector(getAppSelection, {
      nodes: [],
      isEmpty: true,
      count: 0,
      libraries: []
    });
    component.agentId = '1';
  });

  describe('Search ai input', () => {
    let inputComponent: SearchAiInputComponent;

    beforeEach(() => {
      fixture.detectChanges();
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

    it('should have assigned correct useStoredNodes flag', () => {
      component.useStoredNodes = true;
      fixture.detectChanges();

      expect(inputComponent.useStoredNodes).toBeTrue();
    });

    it('should call updateSearchAiInputState on SearchAiService when triggered searchSubmitted event', () => {
      spyOn(searchAiService, 'updateSearchAiInputState');
      inputComponent.searchSubmitted.emit();

      expect(searchAiService.updateSearchAiInputState).toHaveBeenCalledWith({
        active: false
      });
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
      fixture.detectChanges();
      button = fixture.debugElement.query(By.directive(MatIconButton));
    });

    it('should have correct title', () => {
      expect(button.nativeElement.title).toBe('KNOWLEDGE_RETRIEVAL.SEARCH.SEARCH_INPUT.HIDE_INPUT');
    });

    it('should contain close icon', () => {
      expect(button.query(By.directive(MatIcon)).nativeElement.textContent).toBe('close');
    });

    it('should call updateSearchAiInputState on SearchAiService when clicked', () => {
      spyOn(searchAiService, 'updateSearchAiInputState');
      button.nativeElement.click();

      expect(searchAiService.updateSearchAiInputState).toHaveBeenCalledWith({
        active: false
      });
    });
  });
});
