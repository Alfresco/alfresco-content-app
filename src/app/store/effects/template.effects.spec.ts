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
import { AppTestingModule } from '../../testing/app-testing.module';
import { TemplateEffects } from './template.effects';
import { EffectsModule } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  CreateFileFromTemplate,
  SnackbarErrorAction
} from '@alfresco/aca-shared/store';
import { CreateFileFromTemplateService } from '../../services/create-file-from-template.service';
import { of } from 'rxjs';
import { AlfrescoApiServiceMock, AlfrescoApiService } from '@alfresco/adf-core';
import { ContentManagementService } from '../../services/content-management.service';
import { Node } from '@alfresco/js-api';

describe('TemplateEffects', () => {
  let store: Store<any>;
  let createFileFromTemplateService: CreateFileFromTemplateService;
  let alfrescoApiService: AlfrescoApiService;
  let contentManagementService: ContentManagementService;
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, EffectsModule.forRoot([TemplateEffects])],
      providers: [
        CreateFileFromTemplateService,
        { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
      ]
    });

    store = TestBed.get(Store);
    createFileFromTemplateService = TestBed.get(CreateFileFromTemplateService);
    alfrescoApiService = TestBed.get(AlfrescoApiService);
    contentManagementService = TestBed.get(ContentManagementService);

    spyOn(contentManagementService.reload, 'next');
    spyOn(store, 'select').and.returnValue(of({ id: 'parent-id' }));
    spyOn(createFileFromTemplateService, 'openTemplatesDialog').and.returnValue(
      of([{ id: 'template-id' }])
    );
  });

  it('should reload content on create file from template', fakeAsync(() => {
    spyOn(alfrescoApiService.getInstance().nodes, 'copyNode').and.returnValue(
      of({ entry: { id: 'node-id' } })
    );

    spyOn(alfrescoApiService.getInstance().nodes, 'updateNode').and.returnValue(
      of({})
    );

    spyOn(
      createFileFromTemplateService,
      'createTemplateDialog'
    ).and.returnValue({ afterClosed: () => of(node) });

    store.dispatch(new CreateFileFromTemplate());
    tick(300);

    expect(contentManagementService.reload.next).toHaveBeenCalled();
  }));

  it('should raise error when copyNode api fails', fakeAsync(() => {
    spyOn(store, 'dispatch').and.callThrough();
    spyOn(alfrescoApiService.getInstance().nodes, 'copyNode').and.returnValue(
      Promise.reject({
        message: `{ "error": { "statusCode": 404 } } `
      })
    );

    spyOn(
      createFileFromTemplateService,
      'createTemplateDialog'
    ).and.returnValue({ afterClosed: () => of(node) });

    store.dispatch(new CreateFileFromTemplate());
    tick(300);

    expect(contentManagementService.reload.next).not.toHaveBeenCalled();
    expect(store.dispatch['calls'].argsFor(1)[0]).toEqual(
      new SnackbarErrorAction('APP.MESSAGES.ERRORS.GENERIC')
    );
  }));

  it('should raise error when updateNode api fails', fakeAsync(() => {
    spyOn(store, 'dispatch').and.callThrough();
    spyOn(alfrescoApiService.getInstance().nodes, 'copyNode').and.returnValue(
      of({ entry: { id: 'node-id' } })
    );

    spyOn(alfrescoApiService.getInstance().nodes, 'updateNode').and.returnValue(
      Promise.reject({
        message: `{ "error": { "statusCode": 404 } } `
      })
    );

    spyOn(
      createFileFromTemplateService,
      'createTemplateDialog'
    ).and.returnValue({ afterClosed: () => of(node) });

    store.dispatch(new CreateFileFromTemplate());
    tick(300);

    expect(contentManagementService.reload.next).not.toHaveBeenCalled();
    expect(store.dispatch['calls'].argsFor(1)[0]).toEqual(
      new SnackbarErrorAction('APP.MESSAGES.ERRORS.GENERIC')
    );
  }));

  it('should update file from template with form data', () => {
    spyOn(alfrescoApiService.getInstance().nodes, 'copyNode').and.returnValue(
      of({ entry: { id: 'node-id' } })
    );

    spyOn(
      createFileFromTemplateService,
      'createTemplateDialog'
    ).and.returnValue({ afterClosed: () => of(node) });
  });
});
