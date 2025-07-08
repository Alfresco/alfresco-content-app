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
import { SearchAiInputComponent } from './search-ai-input.component';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AgentService, SearchAiService } from '@alfresco/adf-content-services';
import { getAppSelection, SearchByTermAiAction, ToggleAISearchInput } from '@alfresco/aca-shared/store';
import { of, Subject } from 'rxjs';
import { Agent, NodeEntry } from '@alfresco/js-api';
import { FormControlDirective } from '@angular/forms';
import { DebugElement } from '@angular/core';
import {
  AvatarComponent,
  IconComponent,
  NoopTranslateModule,
  NotificationService,
  UnsavedChangesDialogComponent,
  UserPreferencesService
} from '@alfresco/adf-core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatOptionHarness } from '@angular/material/core/testing';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatInputHarness } from '@angular/material/input/testing';
import { SelectionState } from '@alfresco/adf-extensions';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ModalAiService } from '../../../../services/modal-ai.service';
import { MatIconTestingModule } from '@angular/material/icon/testing';

describe('SearchAiInputComponent', () => {
  let component: SearchAiInputComponent;
  let fixture: ComponentFixture<SearchAiInputComponent>;
  let loader: HarnessLoader;
  let selectionState: SelectionState;
  let store: MockStore;
  let agents$: Subject<Agent[]>;
  let dialog: MatDialog;
  let activatedRoute: ActivatedRoute;
  let userPreferencesService: UserPreferencesService;
  let agentList: Agent[];

  const newSelectionState: SelectionState = {
    ...selectionState,
    file: {
      entry: {
        id: 'some-id'
      }
    } as NodeEntry
  };

  const prepareBeforeTest = (): void => {
    selectionState = {
      nodes: [],
      isEmpty: true,
      count: 0,
      libraries: []
    };
    store.overrideSelector(getAppSelection, selectionState);
    component.agentId = '2';
    component.ngOnInit();
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopTranslateModule, MatIconTestingModule, SearchAiInputComponent, MatSelectModule],
      providers: [
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: { query: 'some query' }
            }
          }
        }
      ]
    });

    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(SearchAiInputComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    loader = TestbedHarnessEnvironment.loader(fixture);
    agents$ = new Subject<Agent[]>();
    dialog = TestBed.inject(MatDialog);
    userPreferencesService = TestBed.inject(UserPreferencesService);
    spyOn(userPreferencesService, 'get').and.returnValue(JSON.stringify(newSelectionState));
    spyOn(userPreferencesService, 'set');
    spyOn(TestBed.inject(AgentService), 'getAgents').and.returnValue(agents$);
    agentList = [
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
    prepareBeforeTest();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  describe('Agent select box', () => {
    let selectElement: DebugElement;
    let notificationServiceSpy: jasmine.Spy<(message: string) => MatSnackBarRef<any>>;

    beforeEach(() => {
      selectElement = fixture.debugElement.query(By.directive(MatSelect));
      const notificationService = TestBed.inject(NotificationService);
      notificationServiceSpy = spyOn(notificationService, 'showError').and.callThrough();
    });

    it('should have assigned formControl', () => {
      expect(selectElement.injector.get(FormControlDirective).form).toBe(component.agentControl);
    });

    it('should have hidden single selection indicator', () => {
      expect(selectElement.componentInstance.hideSingleSelectionIndicator).toBeTrue();
    });

    it('should set queryControl value to searchTerm if searchTerm is defined', () => {
      const query = 'some new query';
      component.searchTerm = query;

      component.ngOnInit();

      expect(component.queryControl.value).toBe(query);
    });

    it('should set queryControl value to "some new query" if usedInAiResultsPage is equal to false', () => {
      const query = 'some new query';
      component.usedInAiResultsPage = false;
      component.searchTerm = query;

      component.ngOnInit();

      expect(component.queryControl.value).toBe('some new query');
    });

    it('should set queryControl value to empty string if usedInAiResultsPage is equal to true', () => {
      const query = 'some new query';
      component.usedInAiResultsPage = true;
      component.searchTerm = query;

      component.ngOnInit();

      expect(component.queryControl.value).toBe('');
    });

    it('should get agents on init', () => {
      agents$.next(agentList);
      component.ngOnInit();
      expect(component.agents).toEqual(agentList);
      expect(component.initialsByAgentId).toEqual({ 1: 'HA', 2: 'PA' });
      expect(notificationServiceSpy).not.toHaveBeenCalled();
    });

    it('should show notification on getAgents error', () => {
      agents$.error('error');
      component.ngOnInit();

      expect(component.agents).toEqual([]);
      expect(component.initialsByAgentId).toEqual({});
      expect(notificationServiceSpy).toHaveBeenCalledWith('KNOWLEDGE_RETRIEVAL.SEARCH.ERRORS.AGENTS_FETCHING');
    });

    it('should have selected correct agent', async () => {
      agentList[0].avatarUrl = 'some-url-1';
      agentList[1].avatarUrl = 'some-url-2';

      agents$.next(agentList);
      expect(await (await loader.getHarness(MatSelectHarness)).getValueText()).toBe('Policy Agent');
      const avatar = selectElement.query(By.directive(AvatarComponent))?.componentInstance;
      expect(avatar.initials).toBe('PA');
      expect(avatar.size).toBe('26px');
      expect(avatar.src).toBe('some-url-2');
    });

    describe('Agents options', () => {
      let options: MatOptionHarness[];

      const getAvatarForAgent = (agentId: string): AvatarComponent =>
        fixture.debugElement.query(By.css(`[data-automation-id=aca-search-ai-input-agent-${agentId}]`)).query(By.directive(AvatarComponent))
          .componentInstance;

      beforeEach(async () => {
        agents$.next(agentList);
        const selectHarness = await loader.getHarness(MatSelectHarness);
        await selectHarness.open();
        options = await selectHarness.getOptions();
      });

      it('should have correct number of agents', () => {
        expect(options.length).toBe(2);
      });

      it('should have correct agent names', async () => {
        expect(await options[0].getText()).toBe('HAHR Agent');
        expect(await options[1].getText()).toBe('PAPolicy Agent');
      });

      it('should display avatar for each agent', () => {
        expect(getAvatarForAgent('1')).toBeTruthy();
        expect(getAvatarForAgent('2')).toBeTruthy();
      });

      it('should have correct initials for avatars for each of agent', () => {
        expect(getAvatarForAgent('1').initials).toBe('HA');
        expect(getAvatarForAgent('2').initials).toBe('PA');
      });

      it('should have correct initials for avatars for each of agent', () => {
        agentList[0].avatarUrl = 'some-url-1';
        agentList[1].avatarUrl = 'some-url-2';

        fixture.detectChanges();
        expect(getAvatarForAgent('1').src).toBe('some-url-1');
        expect(getAvatarForAgent('2').src).toBe('some-url-2');
      });

      it('should assign correct initials to each avatar for each agent with single section name', () => {
        const newAgentList = [
          { ...agentList[0], name: 'Adam' },
          { ...agentList[1], name: 'Bob' }
        ];
        agents$.next(newAgentList);
        fixture.detectChanges();

        expect(getAvatarForAgent('1').initials).toBe('A');
        expect(getAvatarForAgent('2').initials).toBe('B');
      });
    });
  });

  describe('Agents popup', () => {
    it('should have selected correct agent', () => {
      agentList[0].avatarUrl = 'some-url-1';
      agentList[1].avatarUrl = 'some-url-2';
      agents$.next(agentList);

      fixture.detectChanges();
      fixture.debugElement.query(By.css('.aca-search-ai-input-agent-container')).nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
      expect(fixture.debugElement.query(By.css('.aca-search-ai-input-agent-popup-hover-card-container-title adf-avatar')).componentInstance.src).toBe(
        'some-url-2'
      );
    });
  });

  describe('Query input', () => {
    let queryInput: DebugElement;

    beforeEach(() => {
      queryInput = fixture.debugElement.query(By.directive(MatInput));
      agents$.next(agentList);
    });

    it('should have assigned formControl', () => {
      fixture.detectChanges();

      expect(queryInput.injector.get(FormControlDirective).form).toBe(component.queryControl);
    });

    it('should have assigned correct placeholder', () => {
      component.placeholder = 'Please ask your question with as much detail as possible...';

      expect(queryInput.componentInstance.placeholder).toBe(component.placeholder);
    });

    testSubmitting(false);
  });

  describe('Submit button', () => {
    let submitButton: DebugElement;
    let queryInput: MatInputHarness;

    beforeEach(async () => {
      submitButton = fixture.debugElement.query(By.directive(MatButton));
      queryInput = await loader.getHarness(MatInputHarness);
      agents$.next(agentList);
    });

    it('should be disabled by default', () => {
      activatedRoute.snapshot.queryParams = { query: '' };
      component.ngOnInit();
      fixture.detectChanges();

      expect(submitButton.nativeElement.disabled).toBeTrue();
    });

    it('should be enabled if query input is filled', async () => {
      await queryInput.setValue('Some question');

      expect(submitButton.nativeElement.disabled).toBeFalse();
    });

    it('should be disabled if query input was filled but after that it was emptied', async () => {
      await queryInput.setValue('Some question');
      await queryInput.setValue('');

      expect(submitButton.nativeElement.disabled).toBeTrue();
    });

    it('should contain stars icon', () => {
      expect(submitButton.query(By.directive(IconComponent)).componentInstance.value).toBe('adf:three_magic_stars_ai');
    });

    it('should have correct label', () => {
      expect(submitButton.nativeElement.textContent.trim()).toBe('KNOWLEDGE_RETRIEVAL.SEARCH.SEARCH_INPUT.ASK_BUTTON_LABEL');
    });

    testSubmitting();
  });

  function testSubmitting(useButton = true) {
    describe('Submitting', () => {
      let checkSearchAvailabilitySpy: jasmine.Spy<(selectedNodesState: SelectionState, maxSelectedNodes?: number) => string>;
      let notificationService: NotificationService;
      let submitButton: DebugElement;
      let queryInput: MatInputHarness;
      let submittingTrigger: () => void;
      const query = 'some query';
      let dialogOpenSpy: jasmine.Spy<<T, R>(component: typeof UnsavedChangesDialogComponent, config?: MatDialogConfig) => MatDialogRef<T, R>>;
      let modalAiService: ModalAiService;

      beforeEach(async () => {
        prepareBeforeTest();

        modalAiService = TestBed.inject(ModalAiService);
        checkSearchAvailabilitySpy = spyOn(TestBed.inject(SearchAiService), 'checkSearchAvailability');
        notificationService = TestBed.inject(NotificationService);
        spyOn(notificationService, 'showError');
        queryInput = await loader.getHarness(MatInputHarness);
        submitButton = fixture.debugElement.query(By.directive(MatButton));
        await queryInput.setValue(query);
        const inputElement = fixture.debugElement.query(By.directive(MatInput)).nativeElement;
        dialogOpenSpy = spyOn(dialog, 'open').and.returnValue({
          afterClosed: () => of(true)
        } as MatDialogRef<MatDialog>);
        submittingTrigger = useButton
          ? () => submitButton.nativeElement.click()
          : () =>
              inputElement.dispatchEvent(
                new KeyboardEvent('keyup', {
                  key: 'Enter'
                })
              );
      });

      it('should call showError on NotificationService if checkSearchAvailability from SearchAiService returns message', () => {
        const message = 'Some message';
        checkSearchAvailabilitySpy.and.returnValue(message);
        submittingTrigger();

        expect(notificationService.showError).toHaveBeenCalledWith(message);
      });

      it('should not call showError on NotificationService if checkSearchAvailability from SearchAiService returns empty message', () => {
        checkSearchAvailabilitySpy.and.returnValue('');
        submittingTrigger();

        expect(notificationService.showError).not.toHaveBeenCalled();
      });

      it('should call checkSearchAvailability on SearchAiService with parameter based on value returned by store', () => {
        submittingTrigger();

        expect(checkSearchAvailabilitySpy).toHaveBeenCalledWith(selectionState);
      });

      it('should call checkSearchAvailability on SearchAiService with parameter based on value returned by UserPreferencesService', () => {
        component.usedInAiResultsPage = true;
        component.ngOnInit();
        submittingTrigger();

        expect(checkSearchAvailabilitySpy).toHaveBeenCalledWith(newSelectionState);
        expect(userPreferencesService.get).toHaveBeenCalledWith('knowledgeRetrievalNodes');
      });

      it('should call set on UserPreferencesService with parameter based on value returned by store', () => {
        submittingTrigger();

        expect(userPreferencesService.set).toHaveBeenCalledWith('knowledgeRetrievalNodes', JSON.stringify(selectionState));
      });

      it('should call set on UserPreferencesService with parameter based on value returned by UserPreferencesService', () => {
        component.usedInAiResultsPage = true;
        component.ngOnInit();
        submittingTrigger();

        expect(userPreferencesService.get).toHaveBeenCalledWith('knowledgeRetrievalNodes');
        expect(userPreferencesService.set).toHaveBeenCalledWith('knowledgeRetrievalNodes', JSON.stringify(newSelectionState));
      });

      it('should call dispatch on store with correct parameter', () => {
        spyOn(store, 'dispatch');
        submittingTrigger();

        expect(store.dispatch).toHaveBeenCalledWith(
          jasmine.objectContaining({
            ...new SearchByTermAiAction({
              searchTerm: query,
              agentId: component.agentId
            })
          })
        );
        expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ ...new ToggleAISearchInput('2', 'some query') }));
      });

      it('should call dispatch on store with correct parameter if selected agent was changed', async () => {
        spyOn(store, 'dispatch');
        await (
          await loader.getHarness(MatSelectHarness)
        ).clickOptions({
          text: 'HAHR Agent'
        });
        submittingTrigger();

        expect(store.dispatch).toHaveBeenCalledWith(
          jasmine.objectContaining({
            ...new SearchByTermAiAction({
              searchTerm: query,
              agentId: '1'
            })
          })
        );
        expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ ...new ToggleAISearchInput('1', 'some query') }));
      });

      it('should call open modal if there was a previous search phrase in url', () => {
        submittingTrigger();

        expect(dialogOpenSpy).toHaveBeenCalled();
      });

      it('should open Unsaved Changes Modal and run callback successfully', () => {
        const modalAiSpy = spyOn(modalAiService, 'openUnsavedChangesModal').and.callThrough();

        fixture.detectChanges();

        submittingTrigger();
        expect(modalAiSpy).toHaveBeenCalledWith(jasmine.any(Function));
      });

      it('should call reset on queryControl', () => {
        spyOn(component.queryControl, 'reset');
        submittingTrigger();

        expect(component.queryControl.reset).toHaveBeenCalled();
      });
    });
  }
});
