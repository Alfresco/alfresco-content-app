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
import { PageComponent } from './document-base-page.component';
import { AppState, SetSelectedNodesAction, ViewNodeAction } from '@alfresco/aca-shared/store';
import { LibTestingModule, discoveryApiServiceMockValue, DocumentBasePageServiceMock } from '@alfresco/aca-shared';
import { NodeEntry, NodePaging } from '@alfresco/js-api';
import { DocumentBasePageService } from './document-base-page.service';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { DiscoveryApiService, DocumentListComponent, DocumentListService, SearchAiInputState, SearchAiService } from '@alfresco/adf-content-services';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideCoreAuth, UserPreferencesService } from '@alfresco/adf-core';
import { of, Subscription } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { NavigationHistoryService } from '../../services/navigation-history.service';
import { Router } from '@angular/router';

@Component({
  selector: 'aca-test',
  template: '',
  // eslint-disable-next-line
  standalone: false
})
class TestComponent extends PageComponent {
  node: any;

  addSubscription(entry: Subscription) {
    this.subscriptions.push(entry);
  }

  getSubscriptions(): Subscription[] {
    return this.subscriptions;
  }
}

describe('PageComponent', () => {
  const mockNodes = JSON.stringify({ node: 'mockNode' });

  let component: TestComponent;
  let store: Store<AppState>;
  let fixture: ComponentFixture<TestComponent>;
  let documentListService: DocumentListService;
  let userPreferencesService: jasmine.SpyObj<UserPreferencesService>;
  let navigationHistoryService: { shouldReturnLastSelection: jasmine.Spy };
  let searchAiService: SearchAiService;
  let router: { url: string };

  beforeEach(() => {
    userPreferencesService = jasmine.createSpyObj('UserPreferencesService', ['get', 'set']);
    navigationHistoryService = jasmine.createSpyObj('NavigationHistoryService', ['shouldReturnLastSelection']);
    router = { url: '/some-url' };
    searchAiService = jasmine.createSpyObj('SearchAiService', ['updateSearchAiInputState', 'toggleSearchAiInput$']);
    searchAiService.toggleSearchAiInput$ = of({ active: false });

    TestBed.configureTestingModule({
      imports: [LibTestingModule, MatDialogModule],
      declarations: [TestComponent],
      providers: [
        provideCoreAuth(),
        { provide: DocumentBasePageService, useClass: DocumentBasePageServiceMock },
        { provide: DiscoveryApiService, useValue: discoveryApiServiceMockValue },
        {
          provide: UserPreferencesService,
          useValue: userPreferencesService
        },
        {
          provide: NavigationHistoryService,
          useValue: navigationHistoryService
        },
        {
          provide: Router,
          useValue: router
        },
        { provide: SearchAiService, useValue: searchAiService }
      ]
    });

    store = TestBed.inject(Store);
    searchAiService = TestBed.inject(SearchAiService);
    documentListService = TestBed.inject(DocumentListService);
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('getParentNodeId()', () => {
    it('returns parent node id when node is set', () => {
      component.node = { id: 'node-id' };

      expect(component.getParentNodeId()).toBe('node-id');
    });

    it('returns null when node is not set', () => {
      component.node = null;

      expect(component.getParentNodeId()).toBe(null);
    });
  });

  describe('Reload', () => {
    const locationHref = location.href;

    afterEach(() => {
      window.history.pushState({}, null, locationHref);
    });

    it('should not reload if url contains viewer outlet', () => {
      window.history.pushState({}, null, `${locationHref}#test(viewer:view)`);
      spyOn(store, 'dispatch');

      component.reload();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should reload if url does not contain viewer outlet', () => {
      spyOn(documentListService, 'reload');

      component.reload();
      expect(documentListService.reload).toHaveBeenCalledWith();
    });

    it('should set selection after reload if node is passed', () => {
      const node = {
        entry: {
          id: 'node-id'
        }
      } as NodeEntry;
      spyOn(store, 'dispatch');

      component.reload(node);
      expect(store.dispatch['calls'].mostRecent().args[0]).toEqual(new SetSelectedNodesAction([node]));
    });

    it('should clear results onAllFilterCleared event', () => {
      spyOn(documentListService, 'reload');

      component.documentList = {
        node: {
          list: {
            pagination: {},
            entries: [{ entry: { id: 'new-node-id' } }]
          }
        } as NodePaging
      } as DocumentListComponent;
      spyOn(store, 'dispatch');

      component.onAllFilterCleared();
      expect(component.documentList.node).toBe(null);
      expect(documentListService.reload).toHaveBeenCalled();
    });

    it('should call onAllFilterCleared event if page is viewer outlet', () => {
      window.history.pushState({}, null, `${locationHref}#test(viewer:view)`);
      const nodePaging = {
        list: {
          pagination: {},
          entries: [{ entry: { id: 'new-node-id' } }]
        }
      } as NodePaging;

      component.documentList = { node: nodePaging } as DocumentListComponent;
      spyOn(store, 'dispatch');

      component.onAllFilterCleared();
      expect(component.documentList.node).toEqual(nodePaging);
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should call ViewNodeAction on showPreview for selected node', () => {
      spyOn(store, 'dispatch');
      const node = {
        entry: {
          id: 'node-id'
        }
      } as NodeEntry;

      component.showPreview(node);
      expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ ...new ViewNodeAction(node.entry.id) }));
    });

    it('should call ViewNodeAction on showPreview for `app:filelink` node type', () => {
      spyOn(store, 'dispatch');
      const linkNode = {
        entry: {
          id: 'node-id',
          nodeType: 'app:filelink',
          properties: {
            'cm:destination': 'original-node-id'
          }
        }
      } as NodeEntry;

      component.showPreview(linkNode);
      const id = linkNode.entry.properties['cm:destination'];
      expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ ...new ViewNodeAction(id) }));
    });
  });

  describe('setKnowledgeRetrievalState()', () => {
    it('should set selectedNodesState when nodes exist and last selection is valid', () => {
      userPreferencesService.get.and.returnValue(mockNodes);
      navigationHistoryService.shouldReturnLastSelection.and.returnValue(true);

      component.ngOnInit();

      expect(component.selectedNodesState).toEqual(JSON.parse(mockNodes));
    });

    it('should not set selectedNodesState when nodes do not exist', () => {
      userPreferencesService.get.and.returnValue(null);
      navigationHistoryService.shouldReturnLastSelection.and.returnValue(true);

      component.ngOnInit();

      expect(component.selectedNodesState).toBeUndefined();
    });

    it('should not set selectedNodesState when shouldReturnLastSelection returns false', () => {
      userPreferencesService.get.and.returnValue(mockNodes);
      navigationHistoryService.shouldReturnLastSelection.and.returnValue(false);

      component.ngOnInit();

      expect(component.selectedNodesState).toBeUndefined();
    });

    it('should update searchAiInputState when selectedNodesState is undefined and url does not start with /knowledge-retrieval', () => {
      userPreferencesService.get.and.returnValue(mockNodes);
      navigationHistoryService.shouldReturnLastSelection.and.returnValue(false);
      router.url = '/some-other-url';

      component.ngOnInit();

      expect(searchAiService.updateSearchAiInputState).toHaveBeenCalledWith({ active: false });
    });

    it('should not update searchAiInputState when url starts with /knowledge-retrieval', () => {
      userPreferencesService.get.and.returnValue(undefined);
      navigationHistoryService.shouldReturnLastSelection.and.returnValue(true);
      router.url = '/knowledge-retrieval';

      component.ngOnInit();

      expect(searchAiService.updateSearchAiInputState).not.toHaveBeenCalled();
    });

    it('should not update searchAiInputState when selectedNodesState in not null', () => {
      userPreferencesService.get.and.returnValue(mockNodes);
      navigationHistoryService.shouldReturnLastSelection.and.returnValue(true);
      router.url = '/other';

      component.ngOnInit();

      expect(searchAiService.updateSearchAiInputState).not.toHaveBeenCalled();
    });
  });

  describe('SearchAiService toggleSearchAiInput$ event handler', () => {
    it('should set searchAiInputState', () => {
      const initialSearchAiInputState = component.searchAiInputState;
      const searchAiInputState: SearchAiInputState = {
        active: true
      };
      searchAiService.toggleSearchAiInput$ = of(searchAiInputState);

      component.ngOnInit();
      expect(component.searchAiInputState).toBe(searchAiInputState);
      expect(initialSearchAiInputState).toEqual({
        active: false
      });
    });
  });
});

describe('Info Drawer state', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  let store: MockStore<{ app: Partial<AppState> }>;
  let appState: Partial<AppState> = {};

  beforeEach(() => {
    appState = {
      selection: {
        count: 2,
        isEmpty: false,
        libraries: [],
        nodes: []
      },
      navigation: {},
      infoDrawerOpened: false
    };

    TestBed.configureTestingModule({
      imports: [LibTestingModule, MatDialogModule],
      declarations: [TestComponent],
      providers: [
        provideCoreAuth(),
        { provide: DocumentBasePageService, useClass: DocumentBasePageServiceMock },
        { provide: DiscoveryApiService, useValue: discoveryApiServiceMockValue },
        provideMockStore({
          initialState: { app: appState }
        })
      ]
    });

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  const locationHref = location.href;

  afterEach(() => {
    window.history.pushState({}, null, locationHref);
  });

  it('should open info drawer on action event', (done) => {
    window.history.pushState({}, null, `${locationHref}#test`);
    fixture.detectChanges();

    void fixture.whenStable().then(() => {
      component.infoDrawerOpened$.subscribe((state) => {
        expect(state).toBe(true);
        done();
      });
    });

    store.setState({
      app: {
        ...appState,
        infoDrawerOpened: true
      }
    });
  });

  it('should open info drawer even if viewer outlet is active', (done) => {
    window.history.pushState({}, null, `${locationHref}#test(viewer:view)`);
    fixture.detectChanges();

    void fixture.whenStable().then(() => {
      component.infoDrawerOpened$.subscribe((state) => {
        expect(state).toBe(true);
        done();
      });
    });

    store.setState({
      app: {
        ...appState,
        infoDrawerOpened: true
      }
    });
  });

  it('should not resolve custom image', () => {
    expect(component.imageResolver(null)).toBe(null);
  });

  it('should resolve custom image for locked node', () => {
    const row: any = {
      node: {
        entry: {
          isLocked: true
        }
      }
    };

    expect(component.imageResolver(row)).toBe('material-icons://lock');
  });

  it('should resolve custom image for a library', () => {
    const row: any = {
      node: {
        entry: {
          nodeType: 'st:site'
        }
      }
    };

    expect(component.imageResolver(row)).toBe('material-icons://library_books');
  });

  it('should track elements by action id ', () => {
    const action: any = { id: 'action1' };
    expect(component.trackByActionId(0, action)).toBe('action1');
  });

  it('should track elements by id ', () => {
    const action: any = { id: 'action1' };
    expect(component.trackById(0, action)).toBe('action1');
  });

  it('should track elements by column id ', () => {
    const action: any = { id: 'action1' };
    expect(component.trackByColumnId(0, action)).toBe('action1');
  });

  it('should cleanup subscriptions on destroy', () => {
    const sub = jasmine.createSpyObj('sub', ['unsubscribe']);

    expect(component.getSubscriptions().length).toBe(0);

    component.addSubscription(sub);
    expect(component.getSubscriptions().length).toBe(1);

    component.ngOnDestroy();
    expect(sub.unsubscribe).toHaveBeenCalled();
    expect(component.getSubscriptions().length).toBe(0);
  });

  it('should update filter sorting', () => {
    const event = new CustomEvent('sorting-changed', { detail: { key: 'name', direction: 'asc' } });
    component.onSortingChanged(event);
    expect(component.filterSorting).toBe('name-asc');
  });
});
