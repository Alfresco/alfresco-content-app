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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentsButtonComponent } from './agents-button.component';
import { AgentService, ContentTestingModule, SearchAiService } from '@alfresco/adf-content-services';
import { AgentPaging } from '@alfresco/js-api';
import { Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getAppSelection, SearchAiActionTypes, ToggleAISearchInput } from '@alfresco/aca-shared/store';
import { NotificationService } from '@alfresco/adf-core';
import { SelectionState } from '@alfresco/adf-extensions';
import { MatMenu, MatMenuPanel, MatMenuTrigger } from '@angular/material/menu';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectionListHarness } from '@angular/material/list/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MatSelectionList } from '@angular/material/list';

describe('AgentsButtonComponent', () => {
  let component: AgentsButtonComponent;
  let fixture: ComponentFixture<AgentsButtonComponent>;
  let agents$: Subject<AgentPaging>;
  let agentPaging: AgentPaging;
  let checkSearchAvailabilitySpy: jasmine.Spy<(selectedNodesState: SelectionState, maxSelectedNodes?: number) => string>;
  let store: MockStore;

  const getMenu = (): MatMenu => fixture.debugElement.query(By.directive(MatMenu)).componentInstance;

  const getAgentsButton = (): HTMLButtonElement => fixture.debugElement.query(By.css('.aca-agents-menu-button'))?.nativeElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AgentsButtonComponent, ContentTestingModule],
      providers: [provideMockStore()]
    });

    fixture = TestBed.createComponent(AgentsButtonComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    agents$ = new Subject<AgentPaging>();
    spyOn(TestBed.inject(AgentService), 'getAgents').and.returnValue(agents$);
    agentPaging = {
      list: {
        entries: [
          {
            entry: {
              id: '1',
              name: 'HR Agent'
            }
          },
          {
            entry: {
              id: '2',
              name: 'Policy Agent'
            }
          }
        ]
      }
    };
    checkSearchAvailabilitySpy = spyOn(TestBed.inject(SearchAiService), 'checkSearchAvailability');
  });

  describe('Button', () => {
    const getMenuTrigger = (): MatMenuPanel => fixture.debugElement.query(By.directive(MatMenuTrigger)).injector.get(MatMenuTrigger).menu;

    beforeEach(() => {
      store.overrideSelector(getAppSelection, {
        nodes: [],
        isEmpty: true,
        count: 0,
        libraries: []
      });
      fixture.detectChanges();
    });

    it('should be rendered if any agents are loaded', () => {
      agents$.next(agentPaging);
      fixture.detectChanges();

      expect(getAgentsButton()).toBeTruthy();
    });

    it('should not be rendered if none agent is loaded', () => {
      agentPaging.list.entries = [];
      agents$.next(agentPaging);

      fixture.detectChanges();
      expect(getAgentsButton()).toBeFalsy();
    });

    it('should have correct label', () => {
      agents$.next(agentPaging);
      fixture.detectChanges();

      expect(getAgentsButton().textContent.trim()).toBe('KNOWLEDGE_RETRIEVAL.SEARCH.AGENTS_BUTTON.LABEL');
    });

    it('should contain stars icon', () => {
      agents$.next(agentPaging);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.aca-agents-menu-button adf-icon')).componentInstance.value).toBe('adf:colored-stars-ai');
    });

    ['mouseup', 'keydown'].forEach((eventName) => {
      describe(`${eventName} event`, () => {
        let event: Event;

        beforeEach(() => {
          event =
            eventName === 'mouseup'
              ? new MouseEvent(eventName)
              : new KeyboardEvent(eventName, {
                  key: 'Enter'
                });
          agents$.next(agentPaging);
        });

        it('should display notification if checkSearchAvailability from SearchAiService returns message', () => {
          const message = 'Some message';
          checkSearchAvailabilitySpy.and.returnValue(message);
          const notificationService = TestBed.inject(NotificationService);
          spyOn(notificationService, 'showInfo');
          fixture.detectChanges();

          getAgentsButton().dispatchEvent(event);
          expect(notificationService.showInfo).toHaveBeenCalledWith(message);
        });

        it('should not display notification if checkSearchAvailability from SearchAiService returns empty message', () => {
          const message = '';
          checkSearchAvailabilitySpy.and.returnValue(message);
          const notificationService = TestBed.inject(NotificationService);
          spyOn(notificationService, 'showInfo');
          fixture.detectChanges();

          getAgentsButton().dispatchEvent(event);
          expect(notificationService.showInfo).not.toHaveBeenCalled();
        });

        it('should disable menu triggering if checkSearchAvailability from SearchAiService returns message', () => {
          checkSearchAvailabilitySpy.and.returnValue('Some message');
          fixture.detectChanges();

          getAgentsButton().dispatchEvent(event);
          fixture.detectChanges();
          expect(getMenuTrigger()).toBeNull();
        });

        it('should enable menu triggering if checkSearchAvailability from SearchAiService returns empty message', () => {
          checkSearchAvailabilitySpy.and.returnValue('');
          fixture.detectChanges();

          getAgentsButton().dispatchEvent(event);
          fixture.detectChanges();
          const menuTrigger = getMenuTrigger();
          expect(menuTrigger).toBeTruthy();
          expect(menuTrigger).toBe(getMenu());
        });
      });
    });
  });

  describe('Agents menu', () => {
    let loader: HarnessLoader;

    it('should have assigned before to xPosition', () => {
      expect(getMenu().xPosition).toBe('before');
    });

    describe('Agents list', () => {
      const selectAgent = async (): Promise<void> =>
        (await (await loader.getHarness(MatMenuHarness)).getHarness(MatSelectionListHarness)).selectItems({
          fullText: 'PA Policy Agent'
        });

      const getSelectionList = (): MatSelectionList => fixture.debugElement.query(By.directive(MatSelectionList)).componentInstance;

      beforeEach(() => {
        loader = TestbedHarnessEnvironment.loader(fixture);
        store.overrideSelector(getAppSelection, {
          nodes: [],
          isEmpty: true,
          count: 0,
          libraries: []
        });
        fixture.detectChanges();
        agents$.next(agentPaging);
        fixture.detectChanges();
        checkSearchAvailabilitySpy.and.returnValue('');
        const button = getAgentsButton();
        button.dispatchEvent(new MouseEvent('mouseup'));
        fixture.detectChanges();
        button.click();
        fixture.detectChanges();
      });

      it('should deselect selected agent after selecting other', async () => {
        component.data = {
          trigger: SearchAiActionTypes.ToggleAiSearchInput
        };
        const selectionList = getSelectionList();
        spyOn(selectionList, 'deselectAll');
        await selectAgent();

        expect(selectionList.deselectAll).toHaveBeenCalled();
      });

      it('should dispatch on store selected agent', async () => {
        component.data = {
          trigger: SearchAiActionTypes.ToggleAiSearchInput
        };
        spyOn(store, 'dispatch');
        await selectAgent();

        expect(store.dispatch<ToggleAISearchInput>).toHaveBeenCalledWith({
          type: SearchAiActionTypes.ToggleAiSearchInput,
          agentId: '2'
        });
      });

      it('should disallow selecting multiple agents', () => {
        expect(getSelectionList().multiple).toBeFalse();
      });

      it('should have hidden single selection indicator', () => {
        expect(getSelectionList().hideSingleSelectionIndicator).toBeTrue();
      });
    });
  });
});
