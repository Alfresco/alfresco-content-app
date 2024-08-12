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
import { PageComponent } from './document-base-page.component';
import { AppState, SetSelectedNodesAction, ViewNodeAction } from '@alfresco/aca-shared/store';
import { AppExtensionService, LibTestingModule, discoveryApiServiceMockValue, DocumentBasePageServiceMock } from '@alfresco/aca-shared';
import { NodeEntry, NodePaging } from '@alfresco/js-api';
import { DocumentBasePageService } from './document-base-page.service';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { DiscoveryApiService, DocumentListComponent, DocumentListService } from '@alfresco/adf-content-services';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AuthModule } from '@alfresco/adf-core';
import { Subscription } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'aca-test',
  template: ''
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
  let component: TestComponent;
  let store: Store<AppState>;
  let fixture: ComponentFixture<TestComponent>;
  let documentListService: DocumentListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibTestingModule, AuthModule.forRoot(), MatDialogModule],
      declarations: [TestComponent],
      providers: [
        { provide: DocumentBasePageService, useClass: DocumentBasePageServiceMock },
        { provide: DiscoveryApiService, useValue: discoveryApiServiceMockValue },
        AppExtensionService
      ]
    });

    store = TestBed.inject(Store);
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
      expect(store.dispatch).toHaveBeenCalledWith(new ViewNodeAction(node.entry.id));
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
      expect(store.dispatch).toHaveBeenCalledWith(new ViewNodeAction(id));
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
      imports: [LibTestingModule, AuthModule.forRoot(), MatDialogModule],
      declarations: [TestComponent],
      providers: [
        { provide: DocumentBasePageService, useClass: DocumentBasePageServiceMock },
        AppExtensionService,
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
