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
import { CoreModule } from '@alfresco/adf-core';
import { AppTestingModule } from '../../testing/app-testing.module';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  NodeEntityEvent,
  UploadVersionButtonComponent,
  VersionComparisonComponent,
  VersionListComponent,
  VersionUploadComponent
} from '@alfresco/adf-content-services';
import { AppStore, UnlockWriteAction, ViewNodeExtras, ViewNodeVersionAction } from '@alfresco/aca-shared/store';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('NodeVersionsDialogComponent', () => {
  let fixture: ComponentFixture<NodeVersionsDialogComponent>;
  let component: NodeVersionsDialogComponent;
  let store: Store<AppStore>;
  const node = {
    id: '1234',
    name: 'TEST-NODE',
    isFile: true,
    nodeType: 'FAKE',
    isFolder: false,
    modifiedAt: new Date(),
    modifiedByUser: null,
    createdAt: new Date(),
    createdByUser: null,
    content: {
      mimeType: 'text/html',
      mimeTypeName: 'HTML',
      sizeInBytes: 13
    }
  };
  const showVersionsOnly = true;
  const file = {
    name: 'Fake New file',
    type: 'application/pdf',
    lastModified: 13,
    size: 1351,
    slice: null
  } as File;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule.forRoot(), TranslateModule.forRoot(), MatDialogModule, RouterTestingModule.withRoutes([]), AppTestingModule],
      declarations: [
        NodeVersionsDialogComponent,
        VersionListComponent,
        VersionUploadComponent,
        UploadVersionButtonComponent,
        VersionComparisonComponent
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close'),
            open: jasmine.createSpy('open')
          }
        },
        {
          provide: Store,
          useValue: {
            dispatch: jasmine.createSpy('dispatch')
          }
        },
        { provide: MAT_DIALOG_DATA, useValue: { node, showVersionsOnly, file } }
      ]
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(NodeVersionsDialogComponent);
    component = fixture.componentInstance;
  });

  it('should display adf upload version if isTypeList is passed as false from parent component', () => {
    component.data.showVersionsOnly = false;
    fixture.detectChanges();
    const adfVersionComponent = document.querySelector('#adf-version-upload-button');
    expect(adfVersionComponent).not.toEqual(null);
  });

  it('should display adf version comparison if isTypeList is passed as false from parent component', () => {
    component.data.showVersionsOnly = false;
    fixture.detectChanges();
    const adfVersionComparisonComponent = document.querySelector('#adf-version-comparison');
    expect(adfVersionComparisonComponent).not.toEqual(null);
  });

  it('should unlock node if is locked when uploading a file', () => {
    component.data.showVersionsOnly = false;
    const nodeEvent: NodeEntityEvent = new NodeEntityEvent({
      entry: {
        id: 'a8b2caff-a58c-40f1-8c47-0b8e63ceaa0e',
        isFavorite: false,
        isFile: true,
        isFolder: false,
        name: '84348838_3451105884918116_7819187244555567104_o.jpg',
        nodeType: 'cm:content',
        parentId: '72c65b52-b856-4a5c-b028-42ce03adb4fe',
        modifiedAt: null,
        createdByUser: null,
        createdAt: null,
        modifiedByUser: null,
        properties: { 'cm:lockType': 'WRITE_LOCK' }
      }
    });
    component.handleUpload(nodeEvent);
    expect(store.dispatch).toHaveBeenCalledWith(new UnlockWriteAction(nodeEvent.value));
  });

  it('should view a previous version of a node', () => {
    component.data.showVersionsOnly = false;
    const versionId = '1.0';
    const location: ViewNodeExtras = {
      location: '/'
    };
    component.onViewingVersion(versionId);
    expect(store.dispatch).toHaveBeenCalledWith(new ViewNodeVersionAction(component.data.node.id, versionId, location));
  });
});
