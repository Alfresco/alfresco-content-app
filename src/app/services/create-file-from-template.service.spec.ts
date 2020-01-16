/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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
import { CreateFileFromTemplateService } from './create-file-from-template.service';
import { of } from 'rxjs';

describe('CreateFileFromTemplateService', () => {
  let dialog: MatDialog;
  let store: Store<AppStore>;
  let alfrescoApiService: AlfrescoApiService;
  let createFileFromTemplateService: CreateFileFromTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, EffectsModule.forRoot([TemplateEffects])],
      providers: [
        CreateFileFromTemplateService,
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
      ]
    });

    store = TestBed.get(Store);
    alfrescoApiService = TestBed.get(AlfrescoApiService);
    dialog = TestBed.get(MatDialog);
    createFileFromTemplateService = TestBed.get(CreateFileFromTemplateService);
  });

  it('should open dialog with `Node Templates` folder id as data property', () => {
    spyOn(
      alfrescoApiService.getInstance().nodes,
      'getNodeInfo'
    ).and.returnValue(of({ id: 'templates-folder-id' }));
    spyOn(dialog, 'open');

    createFileFromTemplateService.openTemplatesDialog();

    expect(dialog.open['calls'].argsFor(0)[1].data).toEqual(
      jasmine.objectContaining({ currentFolderId: 'templates-folder-id' })
    );
  });

  it('should remove parents for templates node breadcrumb path', () => {
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

    createFileFromTemplateService.openTemplatesDialog();

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

  it('should return false if selected node is not a template file', () => {
    spyOn(
      alfrescoApiService.getInstance().nodes,
      'getNodeInfo'
    ).and.returnValue(of({ id: 'templates-folder-id' }));
    spyOn(dialog, 'open');

    createFileFromTemplateService.openTemplatesDialog();

    const isSelectionValid = dialog.open['calls']
      .argsFor(0)[1]
      .data.isSelectionValid({
        isFile: false
      });

    expect(isSelectionValid).toBe(false);
  });

  it('should return true if selected node is a template file', () => {
    spyOn(
      alfrescoApiService.getInstance().nodes,
      'getNodeInfo'
    ).and.returnValue(of({ id: 'templates-folder-id' }));
    spyOn(dialog, 'open');

    createFileFromTemplateService.openTemplatesDialog();

    const isSelectionValid = dialog.open['calls']
      .argsFor(0)[1]
      .data.isSelectionValid({
        isFile: true
      });

    expect(isSelectionValid).toBe(true);
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

    createFileFromTemplateService.openTemplatesDialog();
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

    createFileFromTemplateService.openTemplatesDialog();

    expect(
      dialog.open['calls'].argsFor(0)[1].data.rowFilter({
        node: { entry: { nodeType: 'text' } }
      })
    ).toBe(true);
  });

  it('should return false if row is a `link` nodeType', () => {
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

    createFileFromTemplateService.openTemplatesDialog();

    expect(
      dialog.open['calls'].argsFor(0)[1].data.rowFilter({
        node: { entry: { nodeType: 'app:filelink' } }
      })
    ).toBe(false);
  });
});
