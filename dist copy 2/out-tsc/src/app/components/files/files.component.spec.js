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
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  NodeFavoriteDirective,
  DataTableComponent,
  UploadService,
  AppConfigPipe
} from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { NodeActionsService } from '../../services/node-actions.service';
import { FilesComponent } from './files.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { ContentApiService } from '@alfresco/aca-shared';
import { of, throwError } from 'rxjs';
describe('FilesComponent', function() {
  var node;
  var fixture;
  var component;
  var uploadService;
  var nodeActionsService;
  var contentApi;
  var router = {
    url: '',
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      declarations: [
        FilesComponent,
        DataTableComponent,
        NodeFavoriteDirective,
        DocumentListComponent,
        AppConfigPipe
      ],
      providers: [
        {
          provide: Router,
          useValue: router
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: { preferencePrefix: 'prefix' } },
            params: of({ folderId: 'someId' })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(FilesComponent);
    component = fixture.componentInstance;
    uploadService = TestBed.get(UploadService);
    router = TestBed.get(Router);
    nodeActionsService = TestBed.get(NodeActionsService);
    contentApi = TestBed.get(ContentApiService);
  });
  beforeEach(function() {
    node = { id: 'node-id', isFolder: true };
    spyOn(component.documentList, 'loadFolder').and.callFake(function() {});
  });
  describe('Current page is valid', function() {
    it('should be a valid current page', fakeAsync(function() {
      spyOn(contentApi, 'getNode').and.returnValue(throwError(null));
      component.ngOnInit();
      fixture.detectChanges();
      tick();
      expect(component.isValidPath).toBe(false);
    }));
    it('should set current page as invalid path', fakeAsync(function() {
      spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
      component.ngOnInit();
      tick();
      fixture.detectChanges();
      expect(component.isValidPath).toBe(true);
    }));
  });
  describe('OnInit', function() {
    it('should set current node', function() {
      spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
      fixture.detectChanges();
      expect(component.node).toBe(node);
    });
    it('if should navigate to parent if node is not a folder', function() {
      node.isFolder = false;
      node.parentId = 'parent-id';
      spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
      fixture.detectChanges();
      expect(router.navigate['calls'].argsFor(0)[0]).toEqual([
        '/personal-files',
        'parent-id'
      ]);
    });
  });
  describe('refresh on events', function() {
    beforeEach(function() {
      spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
      spyOn(component, 'reload');
      fixture.detectChanges();
    });
    it('should call refresh onContentCopied event if parent is the same', function() {
      var nodes = [{ entry: { parentId: '1' } }, { entry: { parentId: '2' } }];
      component.node = { id: '1' };
      nodeActionsService.contentCopied.next(nodes);
      expect(component.reload).toHaveBeenCalled();
    });
    it('should not call refresh onContentCopied event when parent mismatch', function() {
      var nodes = [{ entry: { parentId: '1' } }, { entry: { parentId: '2' } }];
      component.node = { id: '3' };
      nodeActionsService.contentCopied.next(nodes);
      expect(component.reload).not.toHaveBeenCalled();
    });
    it('should call refresh on fileUploadComplete event if parent node match', fakeAsync(function() {
      var file = { file: { options: { parentId: 'parentId' } } };
      component.node = { id: 'parentId' };
      uploadService.fileUploadComplete.next(file);
      tick(500);
      expect(component.reload).toHaveBeenCalled();
    }));
    it('should not call refresh on fileUploadComplete event if parent mismatch', fakeAsync(function() {
      var file = { file: { options: { parentId: 'otherId' } } };
      component.node = { id: 'parentId' };
      uploadService.fileUploadComplete.next(file);
      tick(500);
      expect(component.reload).not.toHaveBeenCalled();
    }));
    it('should call refresh on fileUploadDeleted event if parent node match', fakeAsync(function() {
      var file = { file: { options: { parentId: 'parentId' } } };
      component.node = { id: 'parentId' };
      uploadService.fileUploadDeleted.next(file);
      tick(500);
      expect(component.reload).toHaveBeenCalled();
    }));
    it('should not call refresh on fileUploadDeleted event if parent mismatch', fakeAsync(function() {
      var file = { file: { options: { parentId: 'otherId' } } };
      component.node = { id: 'parentId' };
      uploadService.fileUploadDeleted.next(file);
      tick(500);
      expect(component.reload).not.toHaveBeenCalled();
    }));
  });
  describe('onBreadcrumbNavigate()', function() {
    beforeEach(function() {
      spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
      fixture.detectChanges();
    });
    it('should navigates to node id', function() {
      var routeData = { id: 'some-where-over-the-rainbow' };
      spyOn(component, 'navigate');
      component.onBreadcrumbNavigate(routeData);
      expect(component.navigate).toHaveBeenCalledWith(routeData.id);
    });
  });
  describe('Node navigation', function() {
    beforeEach(function() {
      spyOn(contentApi, 'getNode').and.returnValue(of({ entry: node }));
      fixture.detectChanges();
    });
    it('should navigates to node when id provided', function() {
      router.url = '/personal-files';
      component.navigate(node.id);
      expect(router.navigate).toHaveBeenCalledWith([
        '/personal-files',
        node.id
      ]);
    });
    it('should navigates to home when id not provided', function() {
      router.url = '/personal-files';
      component.navigate();
      expect(router.navigate).toHaveBeenCalledWith(['/personal-files']);
    });
    it('should navigate home if node is root', function() {
      component.node = {
        path: {
          elements: [{ id: 'node-id' }]
        }
      };
      router.url = '/personal-files';
      component.navigate(node.id);
      expect(router.navigate).toHaveBeenCalledWith(['/personal-files']);
    });
  });
  describe('isSiteContainer', function() {
    it('should return false if node has no aspectNames', function() {
      var mock = { aspectNames: [] };
      expect(component.isSiteContainer(mock)).toBe(false);
    });
    it('should return false if node is not site container', function() {
      var mock = { aspectNames: ['something-else'] };
      expect(component.isSiteContainer(mock)).toBe(false);
    });
    it('should return true if node is a site container', function() {
      var mock = { aspectNames: ['st:siteContainer'] };
      expect(component.isSiteContainer(mock)).toBe(true);
    });
  });
});
//# sourceMappingURL=files.component.spec.js.map
