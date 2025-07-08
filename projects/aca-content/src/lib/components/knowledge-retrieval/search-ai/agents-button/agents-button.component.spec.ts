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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentsButtonComponent } from './agents-button.component';
import { AgentService, SearchAiService } from '@alfresco/adf-content-services';
import { Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getAppSelection, SearchAiActionTypes } from '@alfresco/aca-shared/store';
import { AvatarComponent, NoopTranslateModule, NotificationService } from '@alfresco/adf-core';
import { SelectionState } from '@alfresco/adf-extensions';
import { MatMenu, MatMenuPanel, MatMenuTrigger } from '@angular/material/menu';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectionListHarness } from '@angular/material/list/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MatSelectionList } from '@angular/material/list';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { Agent, KnowledgeRetrievalConfigEntry } from '@alfresco/js-api';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('AgentsButtonComponent', () => {
  let component: AgentsButtonComponent;
  let fixture: ComponentFixture<AgentsButtonComponent>;
  let agents$: Subject<Agent[]>;
  let agentsMock: Agent[];
  let checkSearchAvailabilitySpy: jasmine.Spy<(selectedNodesState: SelectionState, maxSelectedNodes?: number) => string>;
  let selectionState: SelectionState;
  let store: MockStore;
  let config$: Subject<KnowledgeRetrievalConfigEntry>;

  const knowledgeRetrievalUrl = 'some url';

  const getMenu = (): MatMenu => fixture.debugElement.query(By.directive(MatMenu)).componentInstance;

  const getAgentsButton = (): HTMLButtonElement => fixture.debugElement.query(By.css('.aca-agents-menu-button'))?.nativeElement;

  const runButtonActions = (eventName: string): void => {
    let event: Event;
    let notificationService: NotificationService;
    let message: string;

    beforeEach(() => {
      config$.next({
        entry: {
          knowledgeRetrievalUrl
        }
      });
      config$.complete();
      event =
        eventName === 'mouseup'
          ? new MouseEvent(eventName)
          : new KeyboardEvent(eventName, {
              key: 'Enter'
            });
      agents$.next(agentsMock);
      agents$.complete();
      spyOn(window, 'open');
      notificationService = TestBed.inject(NotificationService);
      spyOn(notificationService, 'showError');
      message = 'Some message';
    });

    const getMenuTrigger = (): MatMenuPanel => fixture.debugElement.query(By.directive(MatMenuTrigger)).injector.get(MatMenuTrigger).menu;

    const testButtonActions = (): void => {
      it('should not display notification if checkSearchAvailability from SearchAiService returns empty message', () => {
        message = '';
        checkSearchAvailabilitySpy.and.returnValue(message);

        getAgentsButton().dispatchEvent(event);
        expect(notificationService.showError).not.toHaveBeenCalled();
      });

      it('should disable menu triggering if checkSearchAvailability from SearchAiService returns message', () => {
        checkSearchAvailabilitySpy.and.returnValue('Some message');

        getAgentsButton().dispatchEvent(event);
        fixture.detectChanges();
        expect(getMenuTrigger()).toBeNull();
      });
    };

    describe('with selected nodes', () => {
      beforeEach(() => {
        selectionState.isEmpty = false;
      });

      it('should display notification if checkSearchAvailability from SearchAiService returns message', () => {
        checkSearchAvailabilitySpy.and.returnValue(message);

        getAgentsButton().dispatchEvent(event);
        expect(notificationService.showError).toHaveBeenCalledWith(message);
      });

      testButtonActions();

      it('should enable menu triggering if checkSearchAvailability from SearchAiService returns empty message', () => {
        checkSearchAvailabilitySpy.and.returnValue('');

        getAgentsButton().dispatchEvent(event);
        fixture.detectChanges();
        const menuTrigger = getMenuTrigger();
        expect(menuTrigger).toBeTruthy();
        expect(menuTrigger).toBe(getMenu());
      });

      it('should call checkSearchAvailability from SearchAiService with correct parameter', () => {
        getAgentsButton().dispatchEvent(event);

        expect(checkSearchAvailabilitySpy).toHaveBeenCalledWith(selectionState);
      });

      it('should not open new tab for url loaded from config', () => {
        getAgentsButton().dispatchEvent(event);

        expect(window.open).not.toHaveBeenCalled();
      });
    });

    describe('without selected nodes', () => {
      it('should not display notification if checkSearchAvailability from SearchAiService returns message', () => {
        checkSearchAvailabilitySpy.and.returnValue(message);

        getAgentsButton().dispatchEvent(event);
        expect(notificationService.showError).not.toHaveBeenCalled();
      });

      testButtonActions();

      it('should disable menu triggering if checkSearchAvailability from SearchAiService returns empty message', () => {
        checkSearchAvailabilitySpy.and.returnValue('');

        getAgentsButton().dispatchEvent(event);
        fixture.detectChanges();
        expect(getMenuTrigger()).toBeNull();
      });

      it('should not call checkSearchAvailability from SearchAiService', () => {
        getAgentsButton().dispatchEvent(event);

        expect(checkSearchAvailabilitySpy).not.toHaveBeenCalled();
      });

      it('should open new tab for url loaded from config', () => {
        getAgentsButton().dispatchEvent(event);

        expect(window.open).toHaveBeenCalledWith(knowledgeRetrievalUrl);
      });
    });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, MatIconTestingModule, AgentsButtonComponent],
      providers: [provideMockStore({})]
    });

    fixture = TestBed.createComponent(AgentsButtonComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    agents$ = new Subject<Agent[]>();
    spyOn(TestBed.inject(AgentService), 'getAgents').and.returnValue(agents$);
    agentsMock = [
      {
        id: '1',
        name: 'HR Agent',
        description: 'Test 1',
        avatarUrl: undefined
      },
      {
        id: '2',
        name: 'Policy Agent',
        description: 'Test 2',
        avatarUrl: undefined
      }
    ];
    const searchAiService = TestBed.inject(SearchAiService);
    checkSearchAvailabilitySpy = spyOn(searchAiService, 'checkSearchAvailability');
    config$ = new Subject<KnowledgeRetrievalConfigEntry>();
    spyOn(searchAiService, 'getConfig').and.returnValue(config$);
    selectionState = {
      nodes: [],
      isEmpty: true,
      count: 0,
      libraries: []
    };
    store.overrideSelector(getAppSelection, selectionState);
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  describe('Button', () => {
    let notificationServiceSpy: jasmine.Spy<(message: string) => MatSnackBarRef<any>>;

    beforeEach(() => {
      const notificationService = TestBed.inject(NotificationService);
      notificationServiceSpy = spyOn(notificationService, 'showError').and.callThrough();
    });

    describe('loaded config', () => {
      beforeEach(() => {
        config$.next({
          entry: {
            knowledgeRetrievalUrl
          }
        });
        config$.complete();
      });

      it('should be rendered if any agentsMock are loaded', () => {
        agents$.next(agentsMock);
        agents$.complete();
        fixture.detectChanges();

        expect(getAgentsButton()).toBeTruthy();
      });

      it('should get agentsMock on component init', () => {
        agents$.next(agentsMock);
        agents$.complete();
        component.ngOnInit();

        expect(component.initialsByAgentId).toEqual({ 1: 'HA', 2: 'PA' });
        expect(component.agents).toEqual(agentsMock);
        expect(notificationServiceSpy).not.toHaveBeenCalled();
      });

      it('should run detectChanges when getting the agentsMock', () => {
        const changeDetectorRef2 = fixture.debugElement.injector.get(ChangeDetectorRef);
        const detectChangesSpy = spyOn(changeDetectorRef2.constructor.prototype, 'detectChanges');

        component.ngOnInit();
        agents$.next(agentsMock);

        expect(detectChangesSpy).toHaveBeenCalled();
      });

      it('should show notification error on getAgents error', () => {
        agents$.error('error');
        component.ngOnInit();

        expect(component.agents).toEqual([]);
        expect(component.initialsByAgentId).toEqual({});
        expect(notificationServiceSpy).toHaveBeenCalledWith('KNOWLEDGE_RETRIEVAL.SEARCH.ERRORS.AGENTS_FETCHING');
      });

      it('should not be rendered if none agent is loaded', () => {
        agentsMock = [];
        agents$.next(agentsMock);
        agents$.complete();

        fixture.detectChanges();
        expect(getAgentsButton()).toBeFalsy();
      });

      it('should have correct label', () => {
        agents$.next(agentsMock);
        agents$.complete();
        fixture.detectChanges();

        expect(getAgentsButton().textContent.trim()).toBe('KNOWLEDGE_RETRIEVAL.SEARCH.AGENTS_BUTTON.LABEL');
      });

      it('should contain stars icon', () => {
        agents$.next(agentsMock);
        agents$.complete();
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('.aca-agents-menu-button adf-icon')).componentInstance.value).toBe('adf:colored-stars-ai');
      });
    });

    describe('loaded config with error', () => {
      beforeEach(() => {
        config$.error('error');
        config$.complete();
      });

      it('should not be rendered', () => {
        agents$.next(agentsMock);
        agents$.complete();
        fixture.detectChanges();

        expect(getAgentsButton()).toBeFalsy();
      });

      it('should show notification error', () => {
        agents$.next(agentsMock);
        agents$.complete();
        component.ngOnInit();

        expect(component.hxInsightUrl).toBeUndefined();
        expect(notificationServiceSpy).toHaveBeenCalledWith('KNOWLEDGE_RETRIEVAL.SEARCH.ERRORS.HX_INSIGHT_URL_FETCHING');
      });
    });
  });

  const buttonKeyboardActions = (eventName: string): void => {
    describe(`Button action - ${eventName} event`, () => {
      runButtonActions(eventName);
    });
  };

  ['mouseup', 'keydown'].forEach((eventName) => {
    buttonKeyboardActions(eventName);
  });

  describe('Agents menu', () => {
    let loader: HarnessLoader;

    const prepareData = (agents: Agent[]): void => {
      config$.next({
        entry: {
          knowledgeRetrievalUrl
        }
      });
      config$.complete();
      loader = TestbedHarnessEnvironment.loader(fixture);
      agents$.next(agents);
      selectionState.isEmpty = false;
      checkSearchAvailabilitySpy.and.returnValue('');
      const button = getAgentsButton();
      button.dispatchEvent(new MouseEvent('mouseup'));
      fixture.detectChanges();
      button.click();
      fixture.detectChanges();
    };

    const getAvatar = (agentId: string): AvatarComponent =>
      fixture.debugElement.query(By.css(`[data-automation-id=aca-agents-button-agent-${agentId}]`)).query(By.directive(AvatarComponent))
        .componentInstance;

    describe('Agents position', () => {
      it('should have assigned before to xPosition', () => {
        prepareData(agentsMock);
        agents$.complete();
        expect(getMenu().xPosition).toBe('before');
      });
    });

    describe('Agents multi words name', () => {
      beforeEach(() => {
        prepareData(agentsMock);
        agents$.complete();
      });

      const getAgentsListHarness = async (): Promise<MatSelectionListHarness> =>
        (await loader.getHarness(MatMenuHarness)).getHarness(MatSelectionListHarness);

      const selectAgent = async (): Promise<void> =>
        (await getAgentsListHarness()).selectItems({
          fullText: 'PA Policy Agent'
        });

      const getAgentsList = (): MatSelectionList => fixture.debugElement.query(By.directive(MatSelectionList)).componentInstance;

      it('should deselect selected agent after selecting other', async () => {
        component.data = {
          trigger: SearchAiActionTypes.ToggleAiSearchInput
        };
        const selectionList = getAgentsList();
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

        expect(store.dispatch).toHaveBeenCalledWith(
          jasmine.objectContaining({
            type: SearchAiActionTypes.ToggleAiSearchInput,
            agentId: '2'
          })
        );
      });

      it('should disallow selecting multiple agentsMock', () => {
        expect(getAgentsList().multiple).toBeFalse();
      });

      it('should have hidden single selection indicator', () => {
        expect(getAgentsList().hideSingleSelectionIndicator).toBeTrue();
      });

      it('should display option for each agent', async () => {
        const agents = await (await getAgentsListHarness()).getItems();
        expect(agents.length).toBe(2);
        expect(await agents[0].getFullText()).toBe('HA HR Agent');
        expect(await agents[1].getFullText()).toBe('PA Policy Agent');
      });

      it('should display avatar for each agent', () => {
        expect(getAvatar('1')).toBeTruthy();
        expect(getAvatar('2')).toBeTruthy();
      });

      it('should assign correct initials to each avatar for each agent with double section name', () => {
        expect(getAvatar('1').initials).toBe('HA');
        expect(getAvatar('2').initials).toBe('PA');
      });

      it('should assign correct src to each avatar', () => {
        agentsMock[0].avatarUrl = 'some-url-1';
        agentsMock[1].avatarUrl = 'some-url-2';

        fixture.detectChanges();
        expect(getAvatar('1').src).toBe('some-url-1');
        expect(getAvatar('2').src).toBe('some-url-2');
      });
    });

    describe('Agents single word name', () => {
      it('should assign correct initials to each avatar for each agent with single section name', () => {
        agentsMock = [
          {
            id: '1',
            name: 'HR Agent',
            description: 'Test 1',
            avatarUrl: undefined
          },
          {
            id: '2',
            name: 'Policy Agent',
            description: 'Test 2',
            avatarUrl: undefined
          }
        ];
        agentsMock[0].name = 'Adam';
        agentsMock[1].name = 'Bob';
        prepareData(agentsMock);

        expect(getAvatar('1').initials).toBe('A');
        expect(getAvatar('2').initials).toBe('B');
      });
    });
  });
});
