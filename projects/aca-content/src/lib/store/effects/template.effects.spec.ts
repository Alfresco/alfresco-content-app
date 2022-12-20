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

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppTestingModule } from '../../testing/app-testing.module';
import { TemplateEffects } from './template.effects';
import { EffectsModule } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CreateFromTemplate, CreateFromTemplateSuccess, FileFromTemplate, FolderFromTemplate, SnackbarErrorAction } from '@alfresco/aca-shared/store';
import { NodeTemplateService } from '../../services/node-template.service';
import { of, Subject } from 'rxjs';
import { Node, NodeEntry } from '@alfresco/js-api';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateFromTemplateDialogComponent } from '../../dialogs/node-template/create-from-template.dialog';
import { AppHookService } from '@alfresco/aca-shared';

describe('TemplateEffects', () => {
  let store: Store<any>;
  let nodeTemplateService: NodeTemplateService;
  let appHookService: AppHookService;
  let templateEffects: TemplateEffects;
  let copyNodeSpy;
  let updateNodeSpy;
  let matDialog: MatDialog;
  const node: Node = {
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
  const fileTemplateConfig = {
    primaryPathName: 'app:node_templates',
    selectionType: 'file'
  };

  const folderTemplateConfig = {
    primaryPathName: 'app:space_templates',
    selectionType: 'folder'
  };

  let subject: Subject<Node[]>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, EffectsModule.forRoot([TemplateEffects])],
      providers: [
        NodeTemplateService,
        {
          provide: MatDialog,
          useValue: {
            closeAll: jasmine.createSpy('closeAll')
          }
        }
      ]
    });

    store = TestBed.inject(Store);
    nodeTemplateService = TestBed.inject(NodeTemplateService);
    templateEffects = TestBed.inject(TemplateEffects);
    appHookService = TestBed.inject(AppHookService);
    matDialog = TestBed.inject(MatDialog);
    subject = new Subject<Node[]>();

    spyOn(store, 'dispatch').and.callThrough();
    spyOn(appHookService.reload, 'next');
    spyOn(store, 'select').and.returnValue(of({ id: 'parent-id' }));
    spyOn(nodeTemplateService, 'selectTemplateDialog').and.returnValue(subject);

    copyNodeSpy = spyOn(templateEffects['nodesApi'], 'copyNode');
    updateNodeSpy = spyOn(templateEffects['nodesApi'], 'updateNode');
  });

  afterEach(() => {
    copyNodeSpy.calls.reset();
    updateNodeSpy.calls.reset();
  });

  it('should call createTemplateDialog on FileFromTemplate action', fakeAsync(() => {
    spyOn(nodeTemplateService, 'createTemplateDialog');
    store.dispatch(new FileFromTemplate());
    subject.next([node]);
    tick(300);

    expect(nodeTemplateService.createTemplateDialog).toHaveBeenCalledWith(node);
  }));

  it('should call createTemplateDialog on FolderFromTemplate action', fakeAsync(() => {
    spyOn(nodeTemplateService, 'createTemplateDialog');
    store.dispatch(new FolderFromTemplate());
    subject.next([node]);
    tick(300);

    expect(nodeTemplateService.createTemplateDialog).toHaveBeenCalledWith(node);
  }));

  it('should open dialog to select template files', fakeAsync(() => {
    spyOn(nodeTemplateService, 'createTemplateDialog').and.returnValue({
      afterClosed: () => of(node)
    } as MatDialogRef<CreateFromTemplateDialogComponent>);

    store.dispatch(new FileFromTemplate());
    tick();

    expect(nodeTemplateService.selectTemplateDialog).toHaveBeenCalledWith(fileTemplateConfig);
  }));

  it('should open dialog to select template folders', fakeAsync(() => {
    spyOn(nodeTemplateService, 'createTemplateDialog').and.returnValue({
      afterClosed: () => of(node)
    } as MatDialogRef<CreateFromTemplateDialogComponent>);

    store.dispatch(new FolderFromTemplate());
    tick();

    expect(nodeTemplateService.selectTemplateDialog).toHaveBeenCalledWith(folderTemplateConfig);
  }));

  it('should create node from template successful', fakeAsync(() => {
    copyNodeSpy.and.returnValue(of({ entry: { id: 'node-id', properties: {} } }));
    updateNodeSpy.and.returnValue(of({ entry: node }));

    store.dispatch(new CreateFromTemplate(node));
    tick();

    expect(store.dispatch['calls'].mostRecent().args[0]).toEqual(new CreateFromTemplateSuccess(node));
  }));

  it('should raise generic error when copyNode api fails', fakeAsync(() => {
    copyNodeSpy.and.returnValue(
      Promise.reject({
        message: `{ "error": { "statusCode": 404 } } `
      })
    );

    store.dispatch(new CreateFromTemplate(node));
    tick();

    expect(store.dispatch['calls'].mostRecent().args[0]).not.toEqual(new CreateFromTemplateSuccess(node));
    expect(store.dispatch['calls'].argsFor(1)[0]).toEqual(new SnackbarErrorAction('APP.MESSAGES.ERRORS.GENERIC'));
  }));

  it('should raise name conflict error when copyNode api returns 409', fakeAsync(() => {
    copyNodeSpy.and.returnValue(
      Promise.reject({
        message: `{ "error": { "statusCode": 409 } } `
      })
    );

    store.dispatch(new CreateFromTemplate(node));
    tick();

    expect(store.dispatch['calls'].mostRecent().args[0]).not.toEqual(new CreateFromTemplateSuccess(node));
    expect(store.dispatch['calls'].argsFor(1)[0]).toEqual(new SnackbarErrorAction('APP.MESSAGES.ERRORS.CONFLICT'));
  }));

  it('should resolve error with current node value when updateNode api fails', fakeAsync(() => {
    const TEST_NODE = {
      entry: {
        id: 'test-node-id',
        properties: {
          'cm:title': 'test-node-title',
          'cm:description': 'test-node-description'
        }
      }
    } as NodeEntry;
    copyNodeSpy.and.returnValue(of(TEST_NODE));

    updateNodeSpy.and.returnValue(
      Promise.reject({
        message: `{ "error": { "statusCode": 404 } } `
      })
    );

    store.dispatch(new CreateFromTemplate(TEST_NODE.entry));
    tick();

    expect(store.dispatch['calls'].mostRecent().args[0]).toEqual(new CreateFromTemplateSuccess(TEST_NODE.entry));
  }));

  it('should close dialog on create template success', fakeAsync(() => {
    store.dispatch(new CreateFromTemplateSuccess({} as Node));
    tick();
    expect(matDialog.closeAll).toHaveBeenCalled();
  }));

  it('should should reload content on create template success', fakeAsync(() => {
    const TEST_NODE = { id: 'test-node-id' } as Node;
    store.dispatch(new CreateFromTemplateSuccess(TEST_NODE));
    tick();
    expect(appHookService.reload.next).toHaveBeenCalledWith(TEST_NODE);
  }));
});
