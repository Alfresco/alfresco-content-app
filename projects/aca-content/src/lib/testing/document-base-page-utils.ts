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

import { BehaviorSubject, Subject } from 'rxjs';
import { AgentService, SearchAiInputState, SearchAiService } from '@alfresco/adf-content-services';
import { DebugElement, Type } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SearchAiInputContainerComponent } from '../components/knowledge-retrieval/search-ai/search-ai-input-container/search-ai-input-container.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageComponent } from '@alfresco/aca-shared';
import { Agent } from '@alfresco/js-api/typings';

export const testHeader = <T extends PageComponent>(component: Type<T>, checkHeaderVisibility = true) => {
  describe('Header', () => {
    let fixture: ComponentFixture<T>;
    let toggleSearchAiInput$: BehaviorSubject<SearchAiInputState>;

    const getSearchAiInputElement = (): DebugElement => fixture.debugElement.query(By.directive(SearchAiInputContainerComponent));

    const getHeaderElement = (): DebugElement => fixture.debugElement.query(By.css('.aca-header-container'));

    beforeEach(() => {
      fixture = TestBed.createComponent(component);
      toggleSearchAiInput$ = new BehaviorSubject<SearchAiInputState>({
        searchTerm: ''
      } as SearchAiInputState);
      TestBed.inject(SearchAiService).toggleSearchAiInput$ = toggleSearchAiInput$;
      spyOn(TestBed.inject(AgentService), 'getAgents').and.returnValue(new Subject<Agent[]>());
      fixture.detectChanges();
    });

    it('should display ai input if input is active', () => {
      toggleSearchAiInput$.next({
        active: true,
        searchTerm: ''
      });

      fixture.detectChanges();
      expect(getSearchAiInputElement()).not.toBeNull();
    });

    it('should not display ai input if input is not active', () => {
      toggleSearchAiInput$.next({
        active: false,
        searchTerm: ''
      });

      fixture.detectChanges();
      expect(getSearchAiInputElement()).toBeNull();
    });

    it('should not display ai input by default', () => {
      expect(getSearchAiInputElement()).toBeNull();
    });

    if (checkHeaderVisibility) {
      it('should not display header if input is active', () => {
        toggleSearchAiInput$.next({
          active: true,
          searchTerm: ''
        });

        fixture.detectChanges();
        expect(getHeaderElement()).toBeNull();
      });

      it('should display header if input is not active', () => {
        toggleSearchAiInput$.next({
          active: false,
          searchTerm: ''
        });

        fixture.detectChanges();
        expect(getHeaderElement()).not.toBeNull();
      });

      it('should display header by default', () => {
        expect(getHeaderElement()).not.toBeNull();
      });
    }
  });
};
