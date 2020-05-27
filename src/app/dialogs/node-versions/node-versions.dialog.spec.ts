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

import { NodeVersionsDialogComponent } from './node-versions.dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AlfrescoApiService,
  AlfrescoApiServiceMock,
  CoreModule,
  TranslationMock
} from '@alfresco/adf-core';
import { AppTestingModule } from '../../testing/app-testing.module';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  UploadVersionButtonComponent,
  VersionListComponent,
  VersionUploadComponent
} from '@alfresco/adf-content-services';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';

describe('NodeVersionsDialogComponent', () => {
  let fixture: ComponentFixture<NodeVersionsDialogComponent>;
  let component: NodeVersionsDialogComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule.forRoot(),
        AppTestingModule,
        MatDialogModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      declarations: [
        NodeVersionsDialogComponent,
        VersionListComponent,
        VersionUploadComponent,
        UploadVersionButtonComponent
      ],
      providers: [
        {
          provide: AlfrescoApiService,
          useClass: AlfrescoApiServiceMock
        },
        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close'),
            open: jasmine.createSpy('open')
          }
        },
        {
          provide: TranslationMock,
          useValue: {
            instant: jasmine.createSpy('instant')
          }
        },
        {
          provide: Store,
          useValue: {
            dispatch: jasmine.createSpy('dispatch')
          }
        },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });

    fixture = TestBed.createComponent(NodeVersionsDialogComponent);
    component = fixture.componentInstance;
    component.node = {
      id: 'file1',
      properties: {}
    } as MinimalNodeEntryEntity;
  });

  it('should display adf upload version if isTypeList is passed as false from parent component', () => {
    component.isTypeList = false;
    fixture.detectChanges();
    const adfVersionComponent = document.querySelector(
      '#adf-version-upload-button'
    );
    expect(adfVersionComponent).toBeDefined();
  });
});
