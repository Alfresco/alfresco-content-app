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
import { EffectsModule } from '@ngrx/effects';
import { AppStore, SnackbarErrorAction } from '@alfresco/aca-shared/store';
import { TemplateEffects } from '../store/effects/template.effects';
import { AppTestingModule } from '../testing/app-testing.module';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-core';
import { NodeTemplateService } from './node-template.service';
import { of } from 'rxjs';

describe('NodeTemplateService', () => {
  let dialog: MatDialog;
  let store: Store<AppStore>;
  let alfrescoApiService: AlfrescoApiService;
  let nodeTemplateService: NodeTemplateService;
  const fileTemplateConfig = {
    relativePath: 'relative-path/parent-file-templates',
    selectionType: 'file'
  };
  const folderTemplateConfig = {
    relativePath: 'relative-path/parent-folder-templates',
    selectionType: 'folder'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, EffectsModule.forRoot([TemplateEffects])],
      providers: [
        NodeTemplateService,
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
      ]
    });

    store = TestBed.get(Store);
    alfrescoApiService = TestBed.get(AlfrescoApiService);
    dialog = TestBed.get(MatDialog);
    nodeTemplateService = TestBed.get(NodeTemplateService);
  });

  it('should open dialog with parent node `id` as data property', () => {
    spyOn(
      alfrescoApiService.getInstance().nodes,
      'getNodeInfo'
    ).and.returnValue(of({ id: 'parent-node-id' }));
    spyOn(dialog, 'open');

    nodeTemplateService.selectTemplateDialog(fileTemplateConfig);

    expect(dialog.open['calls'].argsFor(0)[1].data).toEqual(
      jasmine.objectContaining({ currentFolderId: 'parent-node-id' })
    );
  });

  it('should remove parents for templates node breadcrumb path', () => {
    spyOn(
      alfrescoApiService.getInstance().nodes,
      'getNodeInfo'
    ).and.returnValue(
      of({
        id: 'parent-node-id',
        path: {
          elements: [],
          name: '/Company Home/Data Dictionary'
        }
      })
    );
    spyOn(dialog, 'open');

    nodeTemplateService.selectTemplateDialog(fileTemplateConfig);

    const breadcrumb = dialog.open['calls']
      .argsFor(0)[1]
      .data.breadcrumbTransform({
        name: 'Node Templates',
        path: {
          elements: [{ name: 'Company Home' }, { name: 'Data Dictionary' }],
          name: '/Company Home/Data Dictionary'
        }
      });

    expect(breadcrumb.path.elements).toEqual([]);
  });

  it('should raise an error when getNodeInfo fails', fakeAsync(() => {
    spyOn(
      alfrescoApiService.getInstance().nodes,
      'getNodeInfo'
    ).and.returnValue(
      Promise.reject({
        message: `{ "error": { "statusCode": 404 } } `
      })
    );
    spyOn(store, 'dispatch');

    nodeTemplateService.selectTemplateDialog(fileTemplateConfig);
    tick();

    expect(store.dispatch).toHaveBeenCalledWith(
      new SnackbarErrorAction('APP.MESSAGES.ERRORS.GENERIC')
    );
  }));

  it('should return true if row is not a `link` nodeType', () => {
    spyOn(
      alfrescoApiService.getInstance().nodes,
      'getNodeInfo'
    ).and.returnValue(
      of({
        id: 'templates-folder-id',
        path: {
          elements: [],
          name: '/Company Home/Data Dictionary'
        }
      })
    );
    spyOn(dialog, 'open');

    nodeTemplateService.selectTemplateDialog(fileTemplateConfig);

    expect(
      dialog.open['calls'].argsFor(0)[1].data.rowFilter({
        node: { entry: { nodeType: 'text' } }
      })
    ).toBe(true);
  });

  it('should return false if row is a `filelink` nodeType', () => {
    spyOn(
      alfrescoApiService.getInstance().nodes,
      'getNodeInfo'
    ).and.returnValue(
      of({
        id: 'templates-folder-id',
        path: {
          elements: [],
          name: '/Company Home/Data Dictionary'
        }
      })
    );
    spyOn(dialog, 'open');

    nodeTemplateService.selectTemplateDialog(fileTemplateConfig);

    expect(
      dialog.open['calls'].argsFor(0)[1].data.rowFilter({
        node: { entry: { nodeType: 'app:filelink' } }
      })
    ).toBe(false);
  });

  it('should return false if row is a `folderlink` nodeType', () => {
    spyOn(
      alfrescoApiService.getInstance().nodes,
      'getNodeInfo'
    ).and.returnValue(
      of({
        id: 'templates-folder-id',
        path: {
          elements: [],
          name: '/Company Home/Data Dictionary'
        }
      })
    );
    spyOn(dialog, 'open');

    nodeTemplateService.selectTemplateDialog(fileTemplateConfig);

    expect(
      dialog.open['calls'].argsFor(0)[1].data.rowFilter({
        node: { entry: { nodeType: 'app:folderlink' } }
      })
    ).toBe(false);
  });

  describe('File templates', () => {
    it('should return false if selected node is not a file', () => {
      spyOn(
        alfrescoApiService.getInstance().nodes,
        'getNodeInfo'
      ).and.returnValue(of({ id: 'templates-folder-id' }));
      spyOn(dialog, 'open');

      nodeTemplateService.selectTemplateDialog(fileTemplateConfig);

      const isSelectionValid = dialog.open['calls']
        .argsFor(0)[1]
        .data.isSelectionValid({
          name: 'some-folder-template',
          isFile: false,
          isFolder: true
        });

      expect(isSelectionValid).toBe(false);
    });

    it('should return true if selected node is a template file', () => {
      spyOn(
        alfrescoApiService.getInstance().nodes,
        'getNodeInfo'
      ).and.returnValue(of({ id: 'templates-folder-id' }));
      spyOn(dialog, 'open');

      nodeTemplateService.selectTemplateDialog(fileTemplateConfig);

      const isSelectionValid = dialog.open['calls']
        .argsFor(0)[1]
        .data.isSelectionValid({
          name: 'some-file-template',
          isFile: true,
          isFolder: false
        });

      expect(isSelectionValid).toBe(true);
    });

    it('should set dialog title for file templates', () => {
      spyOn(
        alfrescoApiService.getInstance().nodes,
        'getNodeInfo'
      ).and.returnValue(of({ id: 'templates-folder-id' }));
      spyOn(dialog, 'open');

      nodeTemplateService.selectTemplateDialog(fileTemplateConfig);

      const title = dialog.open['calls'].argsFor(0)[1].data.title;

      expect(title).toBe('NODE_SELECTOR.SELECT_FILE_TEMPLATE_TITLE');
    });
  });

  describe('Folder templates', () => {
    it('should return false if selected node is not a folder', () => {
      spyOn(
        alfrescoApiService.getInstance().nodes,
        'getNodeInfo'
      ).and.returnValue(of({ id: 'templates-folder-id' }));
      spyOn(dialog, 'open');

      nodeTemplateService.selectTemplateDialog(folderTemplateConfig);

      const isSelectionValid = dialog.open['calls']
        .argsFor(0)[1]
        .data.isSelectionValid({
          name: 'some-file-template',
          isFile: true,
          isFolder: false
        });

      expect(isSelectionValid).toBe(false);
    });

    it('should return false if current node is the parent folder', () => {
      spyOn(
        alfrescoApiService.getInstance().nodes,
        'getNodeInfo'
      ).and.returnValue(of({ id: 'templates-folder-id' }));
      spyOn(dialog, 'open');

      nodeTemplateService.selectTemplateDialog(folderTemplateConfig);

      const isSelectionValid = dialog.open['calls']
        .argsFor(0)[1]
        .data.isSelectionValid({
          name: 'parent-folder-templates',
          isFile: false,
          isFolder: true
        });

      expect(isSelectionValid).toBe(false);
    });

    it('should return true if selected node is a folder template', () => {
      spyOn(
        alfrescoApiService.getInstance().nodes,
        'getNodeInfo'
      ).and.returnValue(of({ id: 'templates-folder-id' }));
      spyOn(dialog, 'open');

      nodeTemplateService.selectTemplateDialog(folderTemplateConfig);

      const isSelectionValid = dialog.open['calls']
        .argsFor(0)[1]
        .data.isSelectionValid({
          name: 'some-folder-template',
          isFile: false,
          isFolder: true
        });

      expect(isSelectionValid).toBe(true);
    });

    it('should set dialog title for folder templates', () => {
      spyOn(
        alfrescoApiService.getInstance().nodes,
        'getNodeInfo'
      ).and.returnValue(of({ id: 'templates-folder-id' }));
      spyOn(dialog, 'open');

      nodeTemplateService.selectTemplateDialog(folderTemplateConfig);

      const title = dialog.open['calls'].argsFor(0)[1].data.title;

      expect(title).toBe('NODE_SELECTOR.SELECT_FOLDER_TEMPLATE_TITLE');
    });
  });
});
