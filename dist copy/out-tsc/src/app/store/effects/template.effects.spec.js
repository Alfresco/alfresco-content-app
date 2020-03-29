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
import { AppTestingModule } from '../../testing/app-testing.module';
import { TemplateEffects } from './template.effects';
import { EffectsModule } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  CreateFromTemplate,
  CreateFromTemplateSuccess,
  FileFromTemplate,
  FolderFromTemplate,
  SnackbarErrorAction
} from '@alfresco/aca-shared/store';
import { NodeTemplateService } from '../../services/node-template.service';
import { of } from 'rxjs';
import { AlfrescoApiServiceMock, AlfrescoApiService } from '@alfresco/adf-core';
import { ContentManagementService } from '../../services/content-management.service';
import { MatDialog } from '@angular/material/dialog';
describe('TemplateEffects', function() {
  var store;
  var nodeTemplateService;
  var alfrescoApiService;
  var contentManagementService;
  var copyNodeSpy;
  var updateNodeSpy;
  var matDialog;
  var node = {
    name: 'node-name',
    id: 'node-id',
    nodeType: 'cm:content',
    isFolder: false,
    isFile: true,
    modifiedAt: null,
    modifiedByUser: null,
    createdAt: null,
    createdByUser: null,
    properties: {
      'cm:title': 'title',
      'cm:description': 'description'
    }
  };
  var fileTemplateConfig = {
    relativePath: 'Data Dictionary/Node Templates',
    selectionType: 'file'
  };
  var folderTemplateConfig = {
    relativePath: 'Data Dictionary/Space Templates',
    selectionType: 'folder'
  };
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, EffectsModule.forRoot([TemplateEffects])],
      providers: [
        NodeTemplateService,
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
        {
          provide: MatDialog,
          useValue: {
            closeAll: jasmine.createSpy('closeAll')
          }
        }
      ]
    });
    store = TestBed.get(Store);
    nodeTemplateService = TestBed.get(NodeTemplateService);
    alfrescoApiService = TestBed.get(AlfrescoApiService);
    contentManagementService = TestBed.get(ContentManagementService);
    matDialog = TestBed.get(MatDialog);
    spyOn(store, 'dispatch').and.callThrough();
    spyOn(contentManagementService.reload, 'next');
    spyOn(store, 'select').and.returnValue(of({ id: 'parent-id' }));
    spyOn(nodeTemplateService, 'selectTemplateDialog').and.returnValue(
      of([{ id: 'template-id' }])
    );
    copyNodeSpy = spyOn(alfrescoApiService.getInstance().nodes, 'copyNode');
    updateNodeSpy = spyOn(alfrescoApiService.getInstance().nodes, 'updateNode');
  });
  afterEach(function() {
    copyNodeSpy.calls.reset();
    updateNodeSpy.calls.reset();
  });
  it('should open dialog to select template files', fakeAsync(function() {
    spyOn(nodeTemplateService, 'createTemplateDialog').and.returnValue({
      afterClosed: function() {
        return of(node);
      }
    });
    store.dispatch(new FileFromTemplate());
    tick();
    expect(nodeTemplateService.selectTemplateDialog).toHaveBeenCalledWith(
      fileTemplateConfig
    );
  }));
  it('should open dialog to select template folders', fakeAsync(function() {
    spyOn(nodeTemplateService, 'createTemplateDialog').and.returnValue({
      afterClosed: function() {
        return of(node);
      }
    });
    store.dispatch(new FolderFromTemplate());
    tick();
    expect(nodeTemplateService.selectTemplateDialog).toHaveBeenCalledWith(
      folderTemplateConfig
    );
  }));
  it('should create node from template successful', fakeAsync(function() {
    copyNodeSpy.and.returnValue(
      of({ entry: { id: 'node-id', properties: {} } })
    );
    updateNodeSpy.and.returnValue(of({ entry: node }));
    store.dispatch(new CreateFromTemplate(node));
    tick();
    expect(store.dispatch['calls'].mostRecent().args[0]).toEqual(
      new CreateFromTemplateSuccess(node)
    );
  }));
  it('should raise generic error when copyNode api fails', fakeAsync(function() {
    copyNodeSpy.and.returnValue(
      Promise.reject({
        message: '{ "error": { "statusCode": 404 } } '
      })
    );
    store.dispatch(new CreateFromTemplate(node));
    tick();
    expect(store.dispatch['calls'].mostRecent().args[0]).not.toEqual(
      new CreateFromTemplateSuccess(node)
    );
    expect(store.dispatch['calls'].argsFor(1)[0]).toEqual(
      new SnackbarErrorAction('APP.MESSAGES.ERRORS.GENERIC')
    );
  }));
  it('should raise name conflict error when copyNode api returns 409', fakeAsync(function() {
    copyNodeSpy.and.returnValue(
      Promise.reject({
        message: '{ "error": { "statusCode": 409 } } '
      })
    );
    store.dispatch(new CreateFromTemplate(node));
    tick();
    expect(store.dispatch['calls'].mostRecent().args[0]).not.toEqual(
      new CreateFromTemplateSuccess(node)
    );
    expect(store.dispatch['calls'].argsFor(1)[0]).toEqual(
      new SnackbarErrorAction('APP.MESSAGES.ERRORS.CONFLICT')
    );
  }));
  it('should resolve error with current node value when updateNode api fails', fakeAsync(function() {
    var test_node = {
      entry: {
        id: 'test-node-id',
        properties: {
          'cm:title': 'test-node-title',
          'cm:description': 'test-node-description'
        }
      }
    };
    copyNodeSpy.and.returnValue(of(test_node));
    updateNodeSpy.and.returnValue(
      Promise.reject({
        message: '{ "error": { "statusCode": 404 } } '
      })
    );
    store.dispatch(new CreateFromTemplate(test_node.entry));
    tick();
    expect(store.dispatch['calls'].mostRecent().args[0]).toEqual(
      new CreateFromTemplateSuccess(test_node.entry)
    );
  }));
  it('should close dialog on create template success', fakeAsync(function() {
    store.dispatch(new CreateFromTemplateSuccess({}));
    tick();
    expect(matDialog.closeAll).toHaveBeenCalled();
  }));
  it('should should reload content on create template success', fakeAsync(function() {
    var test_node = { id: 'test-node-id' };
    store.dispatch(new CreateFromTemplateSuccess(test_node));
    tick();
    expect(contentManagementService.reload.next).toHaveBeenCalledWith(
      test_node
    );
  }));
});
//# sourceMappingURL=template.effects.spec.js.map
