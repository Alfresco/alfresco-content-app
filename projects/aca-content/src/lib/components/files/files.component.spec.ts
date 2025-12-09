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

import { TestBed, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { DocumentListService, FilterSearch, SearchHeaderQueryBuilderService, UploadService } from '@alfresco/adf-content-services';
import { NodeActionsService } from '../../services/node-actions.service';
import { FilesComponent } from './files.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { AppExtensionService, ContentApiService, DocumentBasePageService, GenericErrorComponent, initialState } from '@alfresco/aca-shared';
import { of, Subject, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NodeEntry, NodePaging, Node, PathElement } from '@alfresco/js-api';
import { DocumentListPresetRef } from '@alfresco/adf-extensions';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { testHeader } from '../../testing/document-base-page-utils';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { getCurrentFolder } from '@alfresco/aca-shared/store';
import { UnitTestingUtils } from '@alfresco/adf-core';
import { HttpErrorResponse } from '@angular/common/http';

describe('FilesComponent', () => {
  let node;
  let fixture: ComponentFixture<FilesComponent>;
  let component: FilesComponent;
  let uploadService: UploadService;
  let extensions: AppExtensionService;
  let nodeActionsService: NodeActionsService;
  let store: MockStore;
  let contentApi: ContentApiService;
  let route: ActivatedRoute;
  let router: any = {
    url: '',
    navigate: jasmine.createSpy('navigate'),
    events: new Subject()
  };

  let searchHeaderQueryBuilderService: SearchHeaderQueryBuilderService;

  let spyContent = null;
  let loadFolderByNodeIdSpy: jasmine.Spy;
  let unitTestingUtils: UnitTestingUtils;

  function verifyEmptyFilterTemplate() {
    const template = fixture.debugElement.query(By.css('.empty-search__block')).nativeElement as HTMLElement;
    expect(template).toBeDefined();
    expect(template.innerText).toBe('APP.BROWSE.SEARCH.NO_FILTER_RESULTS');
  }

  function verifyEmptyTemplate() {
    const template = fixture.debugElement.query(By.css('.adf-empty-list_template'));
    expect(template).not.toBeNull();
  }

  function getEncodedParamMap(initialQuery = { checkList: 'TYPE:"cm:folder"' }): ParamMap {
    const encoded = btoa(JSON.stringify(initialQuery));
    return convertToParamMap({ q: encoded });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, FilesComponent, MatSnackBarModule],
      providers: [
        {
          provide: Router,
          useValue: router
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: { preferencePrefix: 'prefix' }, paramMap: convertToParamMap({ folderId: undefined }) },
            params: of({ folderId: 'someId' }),
            queryParamMap: of(convertToParamMap({}))
          }
        },
        AppExtensionService,
        provideMockStore({ initialState })
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(FilesComponent);
    component = fixture.componentInstance;

    const documentListService: DocumentListService = TestBed.inject(DocumentListService);
    const fakeNodeEntry: NodeEntry = { entry: { id: 'fake-node-entry' } } as NodeEntry;
    const fakeNodePaging: NodePaging = { list: { pagination: { count: 10, maxItems: 10, skipCount: 0 } } };
    const documentLoaderNode = { children: fakeNodePaging, currentNode: fakeNodeEntry };
    loadFolderByNodeIdSpy = spyOn(documentListService, 'loadFolderByNodeId').and.returnValue(of(documentLoaderNode));

    uploadService = TestBed.inject(UploadService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    nodeActionsService = TestBed.inject(NodeActionsService);
    contentApi = TestBed.inject(ContentApiService);
    extensions = TestBed.inject(AppExtensionService);
    store = TestBed.inject(MockStore);
    spyContent = spyOn(contentApi, 'getNode');
    unitTestingUtils = new UnitTestingUtils(fixture.debugElement);

    searchHeaderQueryBuilderService = TestBed.inject(SearchHeaderQueryBuilderService);
    spyOn(searchHeaderQueryBuilderService, 'resetActiveFilters').and.stub();
    spyOn(searchHeaderQueryBuilderService.populateFilters, 'next').and.stub();
  });

  beforeEach(() => {
    node = { id: 'node-id', isFolder: true };
    spyContent.and.returnValue(of({ entry: node }));
  });

  describe('Current page is valid', () => {
    beforeEach(() => {
      fixture.detectChanges();
      spyContent.and.stub();
    });

    it('should be a valid current page', fakeAsync(() => {
      spyContent.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));

      component.ngOnInit();
      fixture.detectChanges();
      tick();

      expect(component.isValidPath).toBe(false);
    }));

    it('should set current page as invalid path', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(component.isValidPath).toBe(true);
    }));

    it('should set current page as invalid path when loadFolderByNodeId API fails', fakeAsync(() => {
      fixture.detectChanges();
      spyContent.and.returnValue(throwError(null));
      loadFolderByNodeIdSpy.and.returnValue(throwError(Error('error')));
      component.documentList.loadFolder();
      tick();

      expect(component.isValidPath).toBe(false);
    }));
  });

  describe('OnInit', () => {
    beforeEach(() => {
      router.navigate['calls'].reset();
    });

    it('should set current node', () => {
      fixture.detectChanges();
      expect(component.node).toBe(node);
    });

    it('should set columns', () => {
      const filesDocumentListPresetMock = [
        {
          id: 'app.files.modifiedOn',
          key: 'modifiedAt',
          type: 'date',
          sortable: true,
          desktopOnly: true,
          template: 'template',
          sortingKey: 'sorting-key'
        } as DocumentListPresetRef
      ];

      extensions.filesDocumentListPreset$ = of(filesDocumentListPresetMock);
      fixture.detectChanges();
      expect(component.columns).toEqual(filesDocumentListPresetMock);
    });

    it('should navigate to parent if node is not a folder', () => {
      const nodeEntry = { isFolder: false, parentId: 'parent-id' };
      spyContent.and.returnValue(of({ entry: nodeEntry } as any));

      fixture.detectChanges();

      expect(router.navigate['calls'].argsFor(0)[0]).toEqual(['/personal-files', 'parent-id']);
    });

    it('should set decoded query to components queryParams property and populate filters', () => {
      const initialQuery = { checkList: 'TYPE:"cm:folder"' };

      const mockParamMap = getEncodedParamMap(initialQuery);

      Object.defineProperty(route, 'queryParamMap', {
        value: of(mockParamMap)
      });

      fixture.detectChanges();

      expect(component.queryParams).toEqual(initialQuery);
      expect(searchHeaderQueryBuilderService.populateFilters.next).toHaveBeenCalledWith(initialQuery);
    });

    it('should call reset filters when queryParams is nullish', () => {
      Object.defineProperty(route, 'queryParamMap', {
        value: of(convertToParamMap({}))
      });

      fixture.detectChanges();

      expect(searchHeaderQueryBuilderService.resetActiveFilters).toHaveBeenCalled();
      expect(component.queryParams).toBeNull();
    });

    it('should check isFilterHeaderActive to be true when filters are present in queryParamMap', () => {
      const mockParamMap = getEncodedParamMap();

      Object.defineProperty(route, 'queryParamMap', {
        value: of(mockParamMap)
      });

      fixture.detectChanges();

      expect(component.isFilterHeaderActive).toBeTrue();
    });
  });

  describe('refresh on events', () => {
    beforeEach(() => {
      spyOn(component, 'reload');
      fixture.detectChanges();

      spyOn(component.documentList, 'loadFolder').and.callFake(() => {});
    });

    it('should call refresh onContentCopied event if parent is the same', () => {
      const nodes: any[] = [{ entry: { parentId: '1' } }, { entry: { parentId: '2' } }];

      component.node = { id: '1' } as any;

      nodeActionsService.contentCopied.next(nodes);

      expect(component.reload).toHaveBeenCalled();
    });

    it('should not call refresh onContentCopied event when parent mismatch', () => {
      const nodes: any[] = [{ entry: { parentId: '1' } }, { entry: { parentId: '2' } }];

      component.node = { id: '3' } as any;

      nodeActionsService.contentCopied.next(nodes);

      expect(component.reload).not.toHaveBeenCalled();
    });

    it('should call refresh on fileUploadComplete event if parent node match', fakeAsync(() => {
      const file: any = { file: { options: { parentId: 'parentId' } } };
      component.node = { id: 'parentId' } as any;

      uploadService.fileUploadComplete.next(file);

      tick(500);

      expect(component.reload).toHaveBeenCalled();
    }));

    it('should not call reload on fileUploadComplete event if file parent folder already displayed', fakeAsync(() => {
      spyOn(component.documentList.data, 'getRows').and.returnValue([{ node: { entry: { isFolder: true, name: 'files' } } }] as any);
      const file: any = { file: { options: { parentId: 'parentId', path: '/files' } } };
      component.node = { id: 'parentId' } as any;

      uploadService.fileUploadComplete.next(file);

      tick(500);

      expect(component.reload).not.toHaveBeenCalled();
    }));

    it('should not call refresh on fileUploadComplete event if parent mismatch', fakeAsync(() => {
      const file: any = { file: { options: { parentId: 'otherId' } } };
      component.node = { id: 'parentId' } as any;

      uploadService.fileUploadComplete.next(file);

      tick(500);

      expect(component.reload).not.toHaveBeenCalled();
    }));

    it('should call refresh on fileUploadDeleted event if parent node match', fakeAsync(() => {
      const file: any = { file: { options: { parentId: 'parentId' } } };
      component.node = { id: 'parentId' } as any;

      uploadService.fileUploadDeleted.next(file);

      tick(500);

      expect(component.reload).toHaveBeenCalled();
    }));

    it('should not call refresh on fileUploadDeleted event if parent mismatch', fakeAsync(() => {
      const file: any = { file: { options: { parentId: 'otherId' } } };
      component.node = { id: 'parentId' } as any;

      uploadService.fileUploadDeleted.next(file);

      tick(500);

      expect(component.reload).not.toHaveBeenCalled();
    }));
  });

  describe('onBreadcrumbNavigate()', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should navigates to node id', () => {
      const routeData: any = { id: 'some-where-over-the-rainbow' };
      spyOn(component, 'navigate');

      component.onBreadcrumbNavigate(routeData);

      expect(component.navigate).toHaveBeenCalledWith(routeData.id);
    });
  });

  describe('Node navigation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should navigates to node when is more that one sub node', () => {
      router.url = '/personal-files/favourites';
      component.navigate(node.id);

      expect(router.navigate).toHaveBeenCalledWith(['personal-files', 'favourites', node.id]);
    });

    it('should remove the header filters param on click of folders', () => {
      router.url = '/personal-files?name=abc';
      component.navigate(node.id);

      expect(router.navigate).toHaveBeenCalledWith(['personal-files', node.id]);
    });

    it('should navigates to node when id provided', () => {
      router.url = '/personal-files';
      component.navigate(node.id);

      expect(router.navigate).toHaveBeenCalledWith(['personal-files', node.id]);
    });

    it('should navigates to home when id not provided', () => {
      router.url = '/personal-files';
      component.navigate();

      expect(router.navigate).toHaveBeenCalledWith(['personal-files']);
    });

    it('should navigate home if node is root', () => {
      component.node = {
        path: {
          elements: [{ id: 'node-id' }]
        }
      } as any;

      router.url = '/personal-files';
      component.navigate(node.id);

      expect(router.navigate).toHaveBeenCalledWith(['personal-files']);
    });

    it('should navigate home if node is root also if it contain a uuid', () => {
      spyOn(route.snapshot.paramMap, 'get').and.returnValue('some-node-id');
      component.node = {
        path: {
          elements: [{ id: 'node-id' }]
        }
      } as any;

      router.url = '/personal-files/895de2b3-1b69-4cc7-bff2-a0d7c86b7bc7';
      component.navigate(node.id);

      expect(router.navigate).toHaveBeenCalledWith(['personal-files']);
    });

    it('should navigate to sub folder from a parent folder', () => {
      router.url = '/personal-files/parent-folder-node-id';
      const childFolderNodeId = node.id;
      spyOn(route.snapshot.paramMap, 'get').and.returnValue('parent-folder-node-id');
      component.navigate(childFolderNodeId);
      expect(router.navigate).toHaveBeenCalledWith(['personal-files', childFolderNodeId]);
    });

    it('should navigate to smart folder content', () => {
      router.url = '/libraries/vH1-6-1-1-115wji7092f0-41-MTg%3D-1-115hpo76l3h2e1f';
      spyOn(route.snapshot.paramMap, 'get').and.returnValue('vH1-6-1-1-115wji7092f0-41-MTg=-1-115hpo76l3h2e1f');
      component.navigate(node.id);
      expect(router.navigate).toHaveBeenCalledWith(['libraries', node.id]);
    });

    it('should navigate to destination folder if node is `app:folderlink`', () => {
      node = {
        entry: {
          id: 'folder-link-id',
          isFolder: true,
          nodeType: 'app:folderlink',
          properties: {
            'cm:destination': 'original-folder-id'
          }
        }
      } as any;

      router.url = '/personal-files';
      spyOn(route.snapshot.paramMap, 'get').and.returnValue('personal-files');
      component.navigateTo(node);
      expect(router.navigate).toHaveBeenCalledWith([node.entry.properties['cm:destination']]);
    });
  });

  describe('isSiteContainer', () => {
    it('should return false if node has no aspectNames', () => {
      const mock: any = { aspectNames: [] };

      expect(component.isSiteContainer(mock)).toBe(false);
    });

    it('should return false if node is not site container', () => {
      const mock: any = { aspectNames: ['something-else'] };

      expect(component.isSiteContainer(mock)).toBe(false);
    });

    it('should return true if node is a site container', () => {
      const mock: any = { aspectNames: ['st:siteContainer'] };

      expect(component.isSiteContainer(mock)).toBe(true);
    });
  });

  describe('empty template', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show custom empty template if filter headers are applied', async () => {
      component.onFilterSelected([{ key: 'name', value: 'aaa' } as FilterSearch]);
      fixture.detectChanges();
      await fixture.whenStable();

      verifyEmptyFilterTemplate();
    });

    it('should display custom empty template when no data available', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      verifyEmptyTemplate();
    });
  });

  it('[C308041] should have sticky headers', async () => {
    fixture.detectChanges();

    const nodeResult = {
      list: {
        entries: [{ entry: { id: '1', isFile: true } } as any, { entry: { id: '2', isFile: true } } as any],
        pagination: { count: 2 }
      }
    };
    const changes: SimpleChanges = { nodeResult: new SimpleChange(null, nodeResult, true) };

    fixture.componentInstance.ngOnChanges(changes);

    fixture.detectChanges();
    await fixture.whenStable();

    const header = fixture.nativeElement.querySelector('.adf-sticky-header');
    expect(header).not.toBeNull();
  });

  describe('Pagination reset when navigating', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should reset the pagination when navigating using the breadcrumb', () => {
      const resetNewFolderPaginationSpy = spyOn(component.documentList, 'resetNewFolderPagination');
      const breadcrumbRoute: PathElement = { id: 'fake-breadcrumb-route-id', name: 'fake' };
      component.onBreadcrumbNavigate(breadcrumbRoute);

      expect(resetNewFolderPaginationSpy).toHaveBeenCalled();
    });

    it('should reset the pagination when navigating to a folder', () => {
      const resetNewFolderPaginationSpy = spyOn(component.documentList, 'resetNewFolderPagination');
      const fakeFolderNode = new NodeEntry({ entry: { id: 'fakeFolderNode', isFolder: true, isFile: false } as Node });
      component.navigateTo(fakeFolderNode);

      expect(resetNewFolderPaginationSpy).toHaveBeenCalled();
    });

    it('should not reset the pagination when the node to navigate is not a folder', () => {
      const resetNewFolderPaginationSpy = spyOn(component.documentList, 'resetNewFolderPagination');
      const fakeFileNode = new NodeEntry({ entry: { id: 'fakeFileNode', isFolder: false, isFile: true } as Node });
      component.navigateTo(fakeFileNode);

      expect(resetNewFolderPaginationSpy).not.toHaveBeenCalled();
    });
  });

  describe('Document list', () => {
    let documentBasePageService: DocumentBasePageService;

    beforeEach(() => {
      documentBasePageService = TestBed.inject(DocumentBasePageService);
    });

    afterEach(() => {
      store.resetSelectors();
    });

    it('should have assigned displayDragAndDropHint to false if currentFolder is selected and uploading is not allowable', () => {
      store.overrideSelector(getCurrentFolder, node);
      spyOn(documentBasePageService, 'canUploadContent').and.returnValue(false);
      fixture.detectChanges();

      expect(component.documentList.displayDragAndDropHint).toBeFalse();
    });

    it('should have assigned displayDragAndDropHint to true if currentFolder is selected and uploading is allowable', () => {
      store.overrideSelector(getCurrentFolder, node);
      spyOn(documentBasePageService, 'canUploadContent').and.returnValue(true);
      fixture.detectChanges();

      expect(component.documentList.displayDragAndDropHint).toBeTrue();
      expect(documentBasePageService.canUploadContent).toHaveBeenCalledWith(node);
    });

    it('should have assigned displayDragAndDropHint to falsy if currentFolder is not selected and uploading is not allowable', () => {
      store.overrideSelector(getCurrentFolder, undefined);
      spyOn(documentBasePageService, 'canUploadContent').and.returnValue(false);
      fixture.detectChanges();

      expect(component.documentList.displayDragAndDropHint).toBeFalsy();
    });

    it('should have assigned displayDragAndDropHint to falsy if currentFolder is not selected and uploading is allowable', () => {
      store.overrideSelector(getCurrentFolder, undefined);
      spyOn(documentBasePageService, 'canUploadContent').and.returnValue(true);
      fixture.detectChanges();

      expect(component.documentList.displayDragAndDropHint).toBeFalsy();
    });

    it('should bind isDataProvidedExternally based on queryParams property truthiness', () => {
      fixture.detectChanges();

      component.queryParams = { checkList: 'TYPE:"cm:folder"' };
      fixture.detectChanges();

      expect(component.documentList.isDataProvidedExternally).toBe(true);

      component.queryParams = null;
      fixture.detectChanges();

      expect(component.documentList.isDataProvidedExternally).toBe(false);
    });
  });

  describe('Generic error', () => {
    const getGenericErrorText = () => unitTestingUtils.getByDirective(GenericErrorComponent).componentInstance.text;

    beforeEach(() => {
      router.url = '/libraries';
    });

    describe('error returned by getNode on contentApi', () => {
      it('should have set text to library no permission error if user does not have permission and actual url is libraries', () => {
        spyContent.and.returnValue(
          throwError(
            () =>
              new HttpErrorResponse({
                status: 403
              })
          )
        );
        fixture.detectChanges();

        expect(getGenericErrorText()).toBe('APP.BROWSE.LIBRARIES.LIBRARY_NO_PERMISSIONS_WARNING');
      });

      it('should have set text to library not found error if library does not exist and actual url is libraries', () => {
        spyContent.and.returnValue(
          throwError(
            () =>
              new HttpErrorResponse({
                status: 404
              })
          )
        );
        fixture.detectChanges();

        expect(getGenericErrorText()).toBe('APP.BROWSE.LIBRARIES.ERRORS.LIBRARY_NOT_FOUND');
      });

      it('should have set text to generic library loading error if there is different problem with loading of library and actual url is libraries', () => {
        spyContent.and.returnValue(
          throwError(
            () =>
              new HttpErrorResponse({
                status: 500
              })
          )
        );
        fixture.detectChanges();

        expect(getGenericErrorText()).toBe('APP.BROWSE.LIBRARIES.ERRORS.LIBRARY_LOADING_ERROR');
      });

      it('should have set text to generic error if user does not have permission and actual url is not libraries', () => {
        router.url = '/personal-files';
        spyContent.and.returnValue(
          throwError(
            () =>
              new HttpErrorResponse({
                status: 403
              })
          )
        );
        fixture.detectChanges();

        expect(getGenericErrorText()).toBe('APP.MESSAGES.ERRORS.MISSING_CONTENT');
      });

      it('should have set text to generic error if library does not exist and actual url is not libraries', () => {
        router.url = '/personal-files';
        spyContent.and.returnValue(
          throwError(
            () =>
              new HttpErrorResponse({
                status: 404
              })
          )
        );
        fixture.detectChanges();

        expect(getGenericErrorText()).toBe('APP.MESSAGES.ERRORS.MISSING_CONTENT');
      });

      it('should have set text to generic error if there is different problem with loading of node and actual url is not libraries', () => {
        router.url = '/personal-files';
        spyContent.and.returnValue(
          throwError(
            () =>
              new HttpErrorResponse({
                status: 500
              })
          )
        );
        fixture.detectChanges();

        expect(getGenericErrorText()).toBe('APP.MESSAGES.ERRORS.MISSING_CONTENT');
      });
    });

    describe('error emitted by error event', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should have set text to library no permission error if user does not have permission issue and actual url is libraries', () => {
        component.documentList.error.emit(
          new HttpErrorResponse({
            status: 403
          })
        );
        fixture.detectChanges();

        expect(getGenericErrorText()).toBe('APP.BROWSE.LIBRARIES.LIBRARY_NO_PERMISSIONS_WARNING');
      });

      it('should have set text to library not found error if library does not exist issue and actual url is libraries', () => {
        component.documentList.error.emit(
          new HttpErrorResponse({
            status: 404
          })
        );
        fixture.detectChanges();

        expect(getGenericErrorText()).toBe('APP.BROWSE.LIBRARIES.ERRORS.LIBRARY_NOT_FOUND');
      });

      it('should have set text to generic library loading error if there is different problem with loading of library and actual url is libraries', () => {
        component.documentList.error.emit(
          new HttpErrorResponse({
            status: 500
          })
        );
        fixture.detectChanges();

        expect(getGenericErrorText()).toBe('APP.BROWSE.LIBRARIES.ERRORS.LIBRARY_LOADING_ERROR');
      });

      it('should have set text to generic error if user does not have permission issue and actual url is not libraries', () => {
        router.url = '/personal-files';
        component.documentList.error.emit(
          new HttpErrorResponse({
            status: 403
          })
        );
        fixture.detectChanges();

        expect(getGenericErrorText()).toBe('APP.MESSAGES.ERRORS.MISSING_CONTENT');
      });

      it('should have set text to generic error if library does not exist issue and actual url is not libraries', () => {
        router.url = '/personal-files';
        component.documentList.error.emit(
          new HttpErrorResponse({
            status: 404
          })
        );
        fixture.detectChanges();

        expect(getGenericErrorText()).toBe('APP.MESSAGES.ERRORS.MISSING_CONTENT');
      });

      it('should have set text to generic error if there is different problem with loading of node and actual url is not libraries', () => {
        router.url = '/personal-files';
        component.documentList.error.emit(
          new HttpErrorResponse({
            status: 500
          })
        );
        fixture.detectChanges();

        expect(getGenericErrorText()).toBe('APP.MESSAGES.ERRORS.MISSING_CONTENT');
      });
    });
  });

  testHeader(FilesComponent);
});
