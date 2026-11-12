/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthenticationService, UnitTestingUtils } from '@alfresco/adf-core';
import {
  AlfrescoViewerComponent,
  DiscoveryApiService,
  DocumentListService,
  FileUploadCompleteEvent,
  NodesApiService,
  PeopleContentService,
  UploadService
} from '@alfresco/adf-content-services';
import { ClosePreviewAction, RefreshPreviewAction, SetSelectedNodesAction, ViewNodeAction } from '@alfresco/aca-shared/store';
import { AcaViewerComponent } from './viewer.component';
import { of, Subject } from 'rxjs';
import {
  AppHookService,
  ContentApiService,
  discoveryApiServiceMockValue,
  DocumentBasePageService,
  DocumentBasePageServiceMock,
  LibTestingModule
} from '@alfresco/aca-shared';
import { Store } from '@ngrx/store';
import { Node, PathElement } from '@alfresco/js-api';

const apiError = `{
"error": {
  "errorKey":"EntityNotFound",
  "statusCode":404,
  "briefSummary":"The entity with id: someId was not found",
  "stackTrace":"not displayed",
  "descriptionURL":"some url",
  "logId":"some logId"
  }
}`;

const fakeLocation = 'fakeLocation';

describe('AcaViewerComponent', () => {
  let fixture: ComponentFixture<AcaViewerComponent>;
  let component: AcaViewerComponent;
  let router: Router;
  let route: ActivatedRoute;
  let contentApi: ContentApiService;
  let uploadService: UploadService;
  let nodesApiService: NodesApiService;
  let appHookService: AppHookService;
  let documentListService: DocumentListService;
  let store: Store<any>;
  let testingUtils: UnitTestingUtils;

  const getAlfrescoViewerComponent = (): AlfrescoViewerComponent => testingUtils.getByDirective(AlfrescoViewerComponent).componentInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LibTestingModule, AcaViewerComponent],
      providers: [
        { provide: DocumentBasePageService, useClass: DocumentBasePageServiceMock },
        { provide: DiscoveryApiService, useValue: discoveryApiServiceMockValue },
        { provide: AuthenticationService, useValue: {} },
        {
          provide: PeopleContentService,
          useValue: {
            getCurrentPerson: () => of({ id: 'userId' })
          }
        }
      ]
    });

    fixture = TestBed.createComponent(AcaViewerComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    contentApi = TestBed.inject(ContentApiService);
    uploadService = TestBed.inject(UploadService);
    nodesApiService = TestBed.inject(NodesApiService);
    appHookService = TestBed.inject(AppHookService);
    documentListService = TestBed.inject(DocumentListService);
    store = TestBed.inject(Store);
    testingUtils = new UnitTestingUtils(fixture.debugElement);
  });

  it('should set folderId and call displayNode with nodeId upon init', () => {
    route.params = of({
      folderId: 'folder1',
      nodeId: 'node1'
    });
    spyOn(component, 'displayNode').and.stub();

    component.ngOnInit();

    expect(component.folderId).toBe('folder1');
    expect(component.displayNode).toHaveBeenCalledWith('node1');
  });

  it('should navigate to next and previous nodes', () => {
    spyOn(store, 'dispatch');
    spyOn<any>(component, 'getFileLocation').and.returnValue(fakeLocation);
    const clickEvent = new MouseEvent('click');

    component.previousNodeId = 'previous';
    component.onNavigateBefore(clickEvent);
    expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ ...new ViewNodeAction('previous', { location: fakeLocation }) }));

    component.nextNodeId = 'next';
    component.onNavigateNext(clickEvent);
    expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ ...new ViewNodeAction('next', { location: fakeLocation }) }));
  });

  describe('Navigate back to node location', () => {
    beforeEach(async () => {
      spyOn<any>(component, 'navigateToFileLocation').and.callThrough();
      component['navigationPath'] = fakeLocation;
      spyOn(router, 'navigateByUrl').and.stub();
    });

    it('should reload document list and navigate to node location upon close', async () => {
      spyOn(documentListService, 'reload');

      component.onViewerVisibilityChanged();

      expect(documentListService.reload).toHaveBeenCalled();
      expect(component['navigateToFileLocation']).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith(fakeLocation);
    });

    it('should navigate to node location if it is not a file', async () => {
      spyOn(contentApi, 'getNodeInfo').and.returnValue(
        of({
          isFile: false
        } as Node)
      );

      await component.displayNode('folder1');

      expect(contentApi.getNodeInfo).toHaveBeenCalledWith('folder1');
      expect(component['navigateToFileLocation']).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith(fakeLocation);
    });
  });

  it('should navigate to node location in case of Alfresco API errors', async () => {
    component['previewLocation'] = 'personal-files';
    spyOn(contentApi, 'getNodeInfo').and.throwError(apiError);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    await component.displayNode('folder1');

    expect(contentApi.getNodeInfo).toHaveBeenCalledWith('folder1');
    expect(router.navigate).toHaveBeenCalledWith(['personal-files', 'folder1']);
  });

  it('should emit nodeUpdated event on fileUploadComplete event', fakeAsync(() => {
    spyOn(nodesApiService.nodeUpdated, 'next');
    fixture.detectChanges();
    uploadService.fileUploadComplete.next({ data: { entry: {} } } as FileUploadCompleteEvent);
    tick(300);

    expect(nodesApiService.nodeUpdated.next).toHaveBeenCalled();
  }));

  it('should not switch the viewer to an uploaded file that is not currently displayed', fakeAsync(() => {
    spyOn(contentApi, 'getNodeInfo').and.returnValue(of({ id: 'displayed-node', isFile: true } as Node));
    fixture.detectChanges();
    component.nodeId = 'displayed-node';

    uploadService.fileUploadComplete.next({ data: { entry: { id: 'another-node' } } } as FileUploadCompleteEvent);
    tick(300);

    expect(contentApi.getNodeInfo).not.toHaveBeenCalled();
  }));

  it('should refresh the viewer when the currently displayed file finishes uploading', fakeAsync(() => {
    spyOn(contentApi, 'getNodeInfo').and.returnValue(of({ id: 'displayed-node', isFile: true } as Node));
    fixture.detectChanges();
    component.nodeId = 'displayed-node';

    uploadService.fileUploadComplete.next({ data: { entry: { id: 'displayed-node' } } } as FileUploadCompleteEvent);
    tick(300);

    expect(contentApi.getNodeInfo).toHaveBeenCalledWith('displayed-node');
  }));

  it('should navigate the viewer to the original node when a working copy is checked in on new version upload', fakeAsync(() => {
    spyOn(store, 'dispatch');
    spyOn(component, 'displayNode').and.stub();
    fixture.detectChanges();
    component.nodeId = 'working-copy-node';
    component.node = { id: 'working-copy-node', aspectNames: ['cm:workingcopy'] } as Node;

    uploadService.fileUploadComplete.next({
      file: { id: 'working-copy-node' },
      data: { entry: { id: 'original-node' } }
    } as FileUploadCompleteEvent);
    tick(300);

    expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ ...new ViewNodeAction('original-node', { location: router.url }) }));
    expect(component.displayNode).not.toHaveBeenCalled();
  }));

  describe('Alfresco viewer', () => {
    it('should set readOnly on the viewer when the node is a checked-out original (cm:checkedOut aspect)', () => {
      component.nodeId = 'checked-out-node';
      component.node = { id: 'checked-out-node', aspectNames: ['cm:checkedOut'] } as Node;
      fixture.detectChanges();

      expect(getAlfrescoViewerComponent().readOnly).toBe(true);
    });

    it('should not set readOnly on the viewer when the node is not checked out', () => {
      component.nodeId = 'regular-node';
      component.node = { id: 'regular-node', aspectNames: [] } as Node;
      fixture.detectChanges();

      expect(getAlfrescoViewerComponent().readOnly).toBe(false);
    });

    it('should have assigned true to showBreadcrumbs', () => {
      component.nodeId = 'regular-node';
      fixture.detectChanges();

      expect(getAlfrescoViewerComponent().showBreadcrumbs).toBeTrue();
    });

    it('should have assigned correct default value to breadcrumbsRoot', () => {
      component.nodeId = 'regular-node';
      fixture.detectChanges();

      expect(getAlfrescoViewerComponent().breadcrumbsRoot).toBe('APP.BROWSE.PERSONAL.TITLE');
    });

    describe('breadcrumbsRoot', () => {
      let personalPath: PathElement[];
      let sitePath: PathElement[];

      const displayNodeFrom = async (url: string, elements: PathElement[], navigationPath?: string): Promise<void> => {
        spyOnProperty(router, 'url').and.returnValue(url);
        spyOn(contentApi, 'getNodeInfo').and.returnValue(
          of({
            id: 'file',
            isFile: true,
            path: { elements }
          } as Node)
        );
        route.queryParams = of({ location: navigationPath });
        fixture.detectChanges();

        await component.displayNode('file');
      };

      beforeEach(() => {
        personalPath = [
          { id: 'root', name: 'Company Home' },
          { id: 'user-homes', name: 'User Homes' }
        ];
        sitePath = [
          { id: 'root', name: 'Company Home' },
          { id: 'sites', name: 'Sites', nodeType: 'st:sites' },
          { id: 'site', name: 'site' }
        ];
      });

      it('should be the repository title when viewer is opened from repository', async () => {
        await displayNodeFrom('/repository/folder/(viewer:view/file)', sitePath);

        expect(component.breadcrumbsRoot).toBe('APP.BROWSE.REPOSITORY_VIEW.TITLE');
      });

      it('should be the my libraries title when file from a library is opened from libraries', async () => {
        await displayNodeFrom('/libraries/folder/(viewer:view/file)', sitePath, '/libraries/folder');

        expect(component.breadcrumbsRoot).toBe('APP.BROWSE.LIBRARIES.MENU.MY_LIBRARIES.TITLE');
      });

      it('should be the favorite libraries title when file from a library is opened from favorite libraries', async () => {
        await displayNodeFrom('/favorite/libraries/folder/(viewer:view/file)', sitePath, '/favorite/libraries/folder');

        expect(component.breadcrumbsRoot).toBe('APP.BROWSE.LIBRARIES.MENU.FAVORITE_LIBRARIES.TITLE');
      });

      it('should be the my libraries title when file from a library is opened from favorites', async () => {
        await displayNodeFrom('/favorites/(viewer:view/file)', sitePath, '/favorites');

        expect(component.breadcrumbsRoot).toBe('APP.BROWSE.LIBRARIES.MENU.MY_LIBRARIES.TITLE');
      });

      it('should be the my libraries title when file from a library is opened from recent files', async () => {
        await displayNodeFrom('/recent-files/(viewer:view/file)', sitePath, '/recent-files');

        expect(component.breadcrumbsRoot).toBe('APP.BROWSE.LIBRARIES.MENU.MY_LIBRARIES.TITLE');
      });

      it('should be the personal files title when file from a library is opened from personal files', async () => {
        await displayNodeFrom('/personal-files/folder/(viewer:view/file)', sitePath, '/personal-files/folder');

        expect(component.breadcrumbsRoot).toBe('APP.BROWSE.PERSONAL.TITLE');
      });

      it('should be the personal files title when file outside of libraries is opened from recent files', async () => {
        await displayNodeFrom('/recent-files/(viewer:view/file)', personalPath, '/recent-files');

        expect(component.breadcrumbsRoot).toBe('APP.BROWSE.PERSONAL.TITLE');
      });
    });

    describe('breadcrumbNavigate event', () => {
      let personalPath: PathElement[];
      let sitePath: PathElement[];

      let navigatedUrl: string;

      const setup = (url: string, elements: PathElement[], parentId = elements[elements.length - 1].id): void => {
        spyOnProperty(router, 'url').and.returnValue(url);
        component.node = {
          id: 'file',
          parentId,
          path: { elements }
        } as Node;
        spyOn(router, 'navigateByUrl').and.callFake((urlToNavigate) => {
          navigatedUrl = urlToNavigate.toString();
          return Promise.resolve(true);
        });
        spyOn(router, 'navigate').and.resolveTo(true);
      };

      beforeEach(() => {
        const company: PathElement = { id: 'root', name: 'Company Home' };
        personalPath = [company, { id: 'user-homes', name: 'User Homes' }, { id: 'user', name: 'user' }, { id: 'folder', name: 'folder' }];
        sitePath = [
          company,
          { id: 'sites', name: 'Sites', nodeType: 'st:sites' },
          { id: 'site', name: 'site' },
          { id: 'doc-lib', name: 'documentLibrary' },
          { id: 'folder', name: 'folder' }
        ];
      });

      it('should not navigate when url has no primary segments', async () => {
        setup('/(viewer:view/file)', personalPath);

        await component.onBreadcrumbNavigate(personalPath[0]);

        expect(router.navigateByUrl).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
      });

      it('should navigate to the personal files list when root is clicked', async () => {
        setup('/personal-files/folder/(viewer:view/file)', personalPath);

        await component.onBreadcrumbNavigate(personalPath[0]);

        expect(router.navigateByUrl).toHaveBeenCalledWith('/personal-files');
      });

      it('should navigate to the repository page when root is clicked in repository', async () => {
        setup('/repository/folder/(viewer:view/file)', personalPath);

        await component.onBreadcrumbNavigate(personalPath[0]);

        expect(router.navigateByUrl).toHaveBeenCalledWith('/repository');
      });

      it('should navigate to the libraries list when root is clicked in libraries', async () => {
        setup('/libraries/folder/(viewer:view/file)', sitePath);

        await component.onBreadcrumbNavigate(sitePath[0]);

        expect(router.navigateByUrl).toHaveBeenCalledWith('/libraries');
      });

      it('should navigate to the documentLibrary when a site is clicked', async () => {
        setup('/libraries/doc-lib/(viewer:view/file)', sitePath, 'doc-lib');

        await component.onBreadcrumbNavigate(sitePath[2]);

        expect(router.navigateByUrl).toHaveBeenCalledWith('/libraries/doc-lib');
      });

      it('should navigate with an absolute url when parent folder of the file is clicked', async () => {
        setup('/personal-files/folder/(viewer:view/file)', personalPath);

        await component.onBreadcrumbNavigate(personalPath[3]);

        expect(router.navigateByUrl).toHaveBeenCalledWith('/personal-files/folder');
      });

      it('should navigate to the favorite libraries folder when parent folder is clicked in favorite libraries', async () => {
        setup('/favorite/libraries/folder/(viewer:view/file)', sitePath);

        await component.onBreadcrumbNavigate(sitePath[4]);

        expect(router.navigateByUrl).toHaveBeenCalledWith('/favorite/libraries/folder');
      });

      it('should navigate to personal files folder when a folder is clicked in an area without folder routes', async () => {
        setup('/recent-files/(viewer:view/file)', personalPath);

        await component.onBreadcrumbNavigate(personalPath[2]);

        expect(router.navigateByUrl).toHaveBeenCalledWith('/personal-files/user');
      });

      it('should navigate to libraries folder when a folder of a library is clicked in an area without folder routes', async () => {
        setup('/recent-files/(viewer:view/file)', sitePath);

        await component.onBreadcrumbNavigate(sitePath[3]);

        expect(router.navigateByUrl).toHaveBeenCalledWith('/libraries/doc-lib');
      });

      describe('when other folder than the parent is clicked', () => {
        it('should navigate to the clicked folder keeping the viewer url until its list is loaded', async () => {
          setup('/personal-files/folder/(viewer:view/file)', personalPath);

          await component.onBreadcrumbNavigate(personalPath[2]);

          expect(navigatedUrl).toContain('/personal-files/user');
          expect(navigatedUrl).toContain('viewer:view/file');
          expect(router.navigate).not.toHaveBeenCalled();

          appHookService.documentListReady$.next('user');
          expect(router.navigate).toHaveBeenCalledOnceWith(['personal-files', 'user'], { replaceUrl: true });
        });

        it('should not close the viewer when a list of another folder is loaded', async () => {
          setup('/personal-files/folder/(viewer:view/file)', personalPath);

          await component.onBreadcrumbNavigate(personalPath[2]);
          appHookService.documentListReady$.next('another-folder');

          expect(router.navigate).not.toHaveBeenCalled();
          appHookService.documentListReady$.next('user');
        });

        it('should close the viewer when the list is not loaded within the timeout', fakeAsync(() => {
          setup('/personal-files/folder/(viewer:view/file)', personalPath);

          component.onBreadcrumbNavigate(personalPath[2]).catch(fail);
          tick(5000);

          expect(router.navigate).toHaveBeenCalledOnceWith(['personal-files', 'user'], { replaceUrl: true });
        }));

        it('should use favorite libraries route when folder is clicked in favorite libraries', async () => {
          setup('/favorite/libraries/folder/(viewer:view/file)', sitePath);

          await component.onBreadcrumbNavigate(sitePath[3]);
          appHookService.documentListReady$.next('doc-lib');

          expect(navigatedUrl).toContain('/favorite/libraries/doc-lib');
          expect(router.navigate).toHaveBeenCalledOnceWith(['favorite', 'libraries', 'doc-lib'], { replaceUrl: true });
        });

        it('should restore the selection of the displayed file when navigation starts', async () => {
          setup('/personal-files/folder/(viewer:view/file)', personalPath);
          spyOn(store, 'dispatch');

          const navigation = component.onBreadcrumbNavigate(personalPath[2]);
          (router.events as Subject<unknown>).next(new NavigationStart(1, '/personal-files/user'));
          await navigation;

          expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ ...new SetSelectedNodesAction([{ entry: component.node }]) }));
          appHookService.documentListReady$.next('user');
        });
      });
    });
  });

  describe('return on event', () => {
    beforeEach(async () => {
      spyOn<any>(component, 'navigateToFileLocation');
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should return to parent folder on fileUploadDeleted event', async () => {
      uploadService.fileUploadDeleted.next({} as any);

      expect(component['navigateToFileLocation']).toHaveBeenCalled();
    });

    it('should return to parent folder when event emitted from extension', async () => {
      store.dispatch(new ClosePreviewAction());

      expect(component['navigateToFileLocation']).toHaveBeenCalled();
    });

    it('should return to parent folder on nodesDeleted event', async () => {
      appHookService.nodesDeleted.next();

      expect(component['navigateToFileLocation']).toHaveBeenCalled();
    });
  });

  it('should fetch navigation source from route', () => {
    route.snapshot.data = {
      navigateSource: 'personal-files'
    };

    component.ngOnInit();

    expect(component.navigateSource).toBe('personal-files');
  });

  it('should fetch only permitted navigation source from route', () => {
    route.snapshot.data = {
      navigateSource: 'personal-files'
    };

    component.navigationSources = ['shared'];
    component.ngOnInit();

    expect(component.navigateSource).toBeNull();
  });

  it('should fetch case-insensitive source from route', () => {
    route.snapshot.data = {
      navigateSource: 'PERSONAL-FILES'
    };

    component.navigationSources = ['personal-files'];
    component.ngOnInit();

    expect(component.navigateSource).toBe('PERSONAL-FILES');
  });

  it('should not navigate on keyboard event if target is child of sidebar container or cdk overlay', () => {
    component.nextNodeId = 'node';
    spyOn(router, 'navigate').and.stub();

    const parent = document.createElement('div');
    const child = document.createElement('button');
    child.addEventListener('keyup', function (e) {
      component.onNavigateNext(e);
    });
    parent.appendChild(child);
    document.body.appendChild(parent);

    parent.className = 'adf-viewer__sidebar';
    child.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
    expect(router.navigate).not.toHaveBeenCalled();

    parent.className = 'cdk-overlay-container';
    child.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should call node update after RefreshPreviewAction is triggered', () => {
    spyOn(nodesApiService.nodeUpdated, 'next');
    component.ngOnInit();
    const node = new Node();

    store.dispatch(new RefreshPreviewAction(node));
    expect(nodesApiService.nodeUpdated.next).toHaveBeenCalledWith(node);
  });
});
