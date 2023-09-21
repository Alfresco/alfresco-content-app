/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { PageComponent } from './document-base-page.component';
import { ReloadDocumentListAction, SetSelectedNodesAction, AppState, ViewNodeAction } from '@alfresco/aca-shared/store';
import { AppExtensionService } from '@alfresco/aca-shared';
import { NodeEntry, NodePaging, RepositoryInfo, VersionInfo } from '@alfresco/js-api';
import { DocumentBasePageService } from './document-base-page.service';
import { Store, StoreModule } from '@ngrx/store';
import { Component, Injectable } from '@angular/core';
import { DiscoveryApiService, DocumentListComponent } from '@alfresco/adf-content-services';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MaterialModule, PipeModule } from '@alfresco/adf-core';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';

export const INITIAL_APP_STATE: AppState = {
  appName: 'Alfresco Content Application',
  logoPath: 'assets/images/alfresco-logo-white.svg',
  customCssPath: '',
  webFontPath: '',
  sharedUrl: '',
  user: {
    isAdmin: null,
    id: null,
    firstName: '',
    lastName: ''
  },
  selection: {
    nodes: [],
    libraries: [],
    isEmpty: true,
    count: 0
  },
  navigation: {
    currentFolder: null
  },
  currentNodeVersion: null,
  infoDrawerOpened: false,
  infoDrawerPreview: false,
  infoDrawerMetadataAspect: '',
  showFacetFilter: true,
  fileUploadingDialog: true,
  showLoader: false,
  repository: {
    status: {
      isQuickShareEnabled: true
    }
  } as any
};

@Injectable()
class DocumentBasePageServiceMock extends DocumentBasePageService {
  canUpdateNode(): boolean {
    return true;
  }
  canUploadContent(): boolean {
    return true;
  }
}

@Component({
  selector: 'aca-test',
  template: ''
})
class TestComponent extends PageComponent {
  node: any;

  constructor() {
    super();
  }

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientModule,
        RouterTestingModule,
        MaterialModule,
        StoreModule.forRoot(
          { app: (state) => state },
          {
            initialState: {
              app: INITIAL_APP_STATE
            },
            runtimeChecks: {
              strictStateImmutability: false,
              strictActionImmutability: false
            }
          }
        ),
        EffectsModule.forRoot([]),
        PipeModule
      ],
      declarations: [TestComponent],
      providers: [
        {
          provide: DocumentBasePageService,
          useClass: DocumentBasePageServiceMock
        },
        {
          provide: DiscoveryApiService,
          useValue: {
            ecmProductInfo$: new BehaviorSubject<RepositoryInfo | null>(null),
            getEcmProductInfo: (): Observable<RepositoryInfo> =>
              of(
                new RepositoryInfo({
                  version: {
                    major: '10.0.0'
                  } as VersionInfo
                })
              )
          }
        },
        AppExtensionService
      ]
    });

    store = TestBed.inject(Store);
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
      spyOn(store, 'dispatch');

      component.reload();
      expect(store.dispatch).toHaveBeenCalledWith(new ReloadDocumentListAction());
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
      expect(store.dispatch['calls'].mostRecent().args[0]).toEqual(new ReloadDocumentListAction());
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
      imports: [NoopAnimationsModule, HttpClientModule, RouterTestingModule, MaterialModule],
      declarations: [TestComponent],
      providers: [
        { provide: DocumentBasePageService, useClass: DocumentBasePageServiceMock },
        AppExtensionService,
        {
          provide: DiscoveryApiService,
          useValue: {
            ecmProductInfo$: new BehaviorSubject<RepositoryInfo | null>(null),
            getEcmProductInfo: (): Observable<RepositoryInfo> =>
              of(
                new RepositoryInfo({
                  version: {
                    major: '10.0.0'
                  } as VersionInfo
                })
              )
          }
        },
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

    fixture.whenStable().then(() => {
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

    fixture.whenStable().then(() => {
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

    expect(component.imageResolver(row)).toBe('assets/images/baseline-lock-24px.svg');
  });

  it('should resolve custom image for a library', () => {
    const row: any = {
      node: {
        entry: {
          nodeType: 'st:site'
        }
      }
    };

    expect(component.imageResolver(row)).toBe('assets/images/baseline-library_books-24px.svg');
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
