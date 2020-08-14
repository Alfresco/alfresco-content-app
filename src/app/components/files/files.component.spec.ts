/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { TestBed, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NodeFavoriteDirective,
  DataTableComponent,
  UploadService,
  AppConfigPipe,
  AlfrescoApiService,
  AlfrescoApiServiceMock
} from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { NodeActionsService } from '../../services/node-actions.service';
import { FilesComponent } from './files.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ContentApiService } from '@alfresco/aca-shared';
import { of, throwError } from 'rxjs';

describe('FilesComponent', () => {
  let node;
  let fixture: ComponentFixture<FilesComponent>;
  let component: FilesComponent;
  let uploadService: UploadService;
  let nodeActionsService: NodeActionsService;
  let contentApi: ContentApiService;
  let router: any = {
    url: '',
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [FilesComponent, DataTableComponent, NodeFavoriteDirective, DocumentListComponent, AppConfigPipe],
      providers: [
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        {
          provide: Router,
          useValue: router
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: { preferencePrefix: 'prefix' } },
            params: of({ folderId: 'someId' }),
            queryParamMap: of({})
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(FilesComponent);
    component = fixture.componentInstance;

    uploadService = TestBed.inject(UploadService);
    router = TestBed.inject(Router);
    nodeActionsService = TestBed.inject(NodeActionsService);
    contentApi = TestBed.inject(ContentApiService);
  });

  beforeEach(() => {
    node = { id: 'node-id', isFolder: true };
  });

  describe('Current page is valid', () => {
    beforeEach(() => {
      fixture.detectChanges();
      spyOn(component.documentList, 'loadFolder').and.callFake(() => {});
    });

    it('should be a valid current page', fakeAsync(() => {
      spyOn(contentApi, 'getNode').and.returnValue(throwError(null));

      component.ngOnInit();
      fixture.detectChanges();
      tick();

      expect(component.isValidPath).toBe(false);
    }));

    it('should set current page as invalid path', fakeAsync(() => {
      spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));

      component.ngOnInit();
      fixture.detectChanges();
      tick();

      expect(component.isValidPath).toBe(true);
    }));
  });

  describe('OnInit', () => {
    beforeEach(() => {
      router.navigate['calls'].reset();
    });

    it('should set current node', () => {
      spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
      fixture.detectChanges();
      expect(component.node).toBe(node);
    });

    it('should navigate to parent if node is not a folder', () => {
      const nodeEntry = { isFolder: false, parentId: 'parent-id' };
      spyOn(contentApi, 'getNode').and.returnValue(of({ entry: nodeEntry } as any));

      fixture.detectChanges();

      expect(router.navigate['calls'].argsFor(0)[0]).toEqual(['/personal-files', 'parent-id']);
    });
  });

  describe('refresh on events', () => {
    beforeEach(() => {
      spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
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
      spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
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
      spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
      fixture.detectChanges();
    });

    it('should navigates to node when is more that one sub node', () => {
      router.url = '/personal-files/favourites';
      component.navigate(node.id);

      expect(router.navigate).toHaveBeenCalledWith(['personal-files', 'favourites', node.id]);
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
      component.node = {
        path: {
          elements: [{ id: 'node-id' }]
        }
      } as any;

      router.url = '/personal-files/895de2b3-1b69-4cc7-bff2-a0d7c86b7bc7';
      component.navigate(node.id);

      expect(router.navigate).toHaveBeenCalledWith(['personal-files']);
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
});
