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

import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { UploadEffects } from './upload.effects';
import { AppTestingModule } from '../../testing/app-testing.module';
import { NgZone } from '@angular/core';
import {
  UploadService,
  FileUploadCompleteEvent,
  FileModel
} from '@alfresco/adf-core';
import {
  SetSelectedNodesAction,
  UnlockWriteAction,
  UploadFileVersionAction
} from '@alfresco/aca-shared/store';
import { ContentManagementService } from '../../services/content-management.service';
import { MinimalNodeEntity } from '@alfresco/js-api';

function createFileList(fileName, type = 'text/plain') {
  const data = new Blob([''], { type });
  const arrayOfBlob = new Array<Blob>();
  arrayOfBlob.push(data);
  const file = new File(arrayOfBlob, fileName);
  const files = [file];

  const reducer = (dataTransfer, currentFile) => {
    dataTransfer.items.add(currentFile);
    return dataTransfer;
  };
  return files.reduce(reducer, new DataTransfer()).files;
}

describe('UploadEffects', () => {
  let store: Store<any>;
  let uploadService: UploadService;
  let effects: UploadEffects;
  let zone: NgZone;
  let contentManagementService: ContentManagementService;
  let uploadVersionInput: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, EffectsModule.forRoot([UploadEffects])]
    });

    zone = TestBed.get(NgZone);
    spyOn(zone, 'run').and.callFake((fn: () => any) => {
      return fn();
    });

    contentManagementService = TestBed.get(ContentManagementService);
    store = TestBed.get(Store);
    uploadService = TestBed.get(UploadService);
    effects = TestBed.get(UploadEffects);
  });

  beforeEach(() => {
    uploadVersionInput = document.querySelector('#app-upload-file-version');
  });

  afterEach(() => {
    uploadVersionInput.remove();
  });

  describe('uploadAndUnlock()', () => {
    it('should not upload and unlock file if param not provided', () => {
      effects.uploadAndUnlock(null);
      expect(zone.run).not.toHaveBeenCalled();
    });

    it('should upload the file before unlocking', () => {
      const file: any = {};

      spyOn(uploadService, 'addToQueue').and.stub();
      spyOn(uploadService, 'uploadFilesInTheQueue').and.stub();

      effects.uploadAndUnlock(file);

      expect(uploadService.addToQueue).toHaveBeenCalled();
      expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalled();
    });

    it('should dispatch the unlock write action for a locked file', () => {
      const file: FileModel = new FileModel(
        { name: 'file1.png', size: 10 } as File,
        null,
        'file1'
      );

      file.data = {
        entry: {
          id: 'file1',
          properties: {
            'cm:lockType': 'WRITE_LOCK'
          }
        }
      };

      spyOn(uploadService, 'addToQueue').and.stub();
      spyOn(uploadService, 'uploadFilesInTheQueue').and.stub();
      spyOn(store, 'dispatch').and.stub();

      effects.uploadAndUnlock(file);
      uploadService.fileUploadComplete.next(
        new FileUploadCompleteEvent(file, 100, file.data)
      );

      expect(store.dispatch).toHaveBeenCalledWith(
        new UnlockWriteAction(file.data)
      );
    });

    it('should dispatch only one unlock action for a locked file', () => {
      const file: FileModel = new FileModel(
        { name: 'file1.png', size: 10 } as File,
        null,
        'file1'
      );

      file.data = {
        entry: {
          id: 'file1',
          properties: {
            'cm:lockType': 'WRITE_LOCK'
          }
        }
      };

      spyOn(uploadService, 'addToQueue').and.stub();
      spyOn(uploadService, 'uploadFilesInTheQueue').and.stub();
      spyOn(store, 'dispatch').and.stub();

      effects.uploadAndUnlock(file);

      const completeEvent = new FileUploadCompleteEvent(file, 100, file.data);
      uploadService.fileUploadComplete.next(completeEvent);
      uploadService.fileUploadComplete.next(completeEvent);
      uploadService.fileUploadComplete.next(completeEvent);

      expect(store.dispatch).toHaveBeenCalledWith(
        new UnlockWriteAction(file.data)
      );

      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });

    it('should dispatch no actions if file is not locked', () => {
      const file: FileModel = new FileModel(
        { name: 'file1.png', size: 10 } as File,
        null,
        'file1'
      );

      file.data = {
        entry: {
          id: 'file1',
          properties: {}
        }
      };

      spyOn(uploadService, 'addToQueue').and.stub();
      spyOn(uploadService, 'uploadFilesInTheQueue').and.stub();
      spyOn(store, 'dispatch').and.stub();

      effects.uploadAndUnlock(file);
      uploadService.fileUploadComplete.next(
        new FileUploadCompleteEvent(file, 100, file.data)
      );

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('upload file version', () => {
    beforeEach(() => {
      spyOn(contentManagementService, 'versionUpdateDialog');
    });

    it('should upload file from context menu', () => {
      spyOn(effects, 'uploadVersion');
      const node: MinimalNodeEntity = new MinimalNodeEntity({
        id: '1234',
        name: 'TEST-NODE',
        nodeType: 'FAKE',
        isFolder: false,
        isFile: true,
        modifiedAt: new Date(),
        modifiedByUser: null,
        createdAt: new Date(),
        createdByUser: null,
        content: {
          mimeType: 'text/html',
          mimeTypeName: 'HTML',
          sizeInBytes: 13
        }
      });
      uploadVersionInput.files = createFileList('bogus.txt');
      store.dispatch(new SetSelectedNodesAction([node]));
      uploadVersionInput.dispatchEvent(new CustomEvent('change'));
      expect(effects.uploadVersion).toHaveBeenCalled();
    });

    it('should upload file from dropping another file', () => {
      const fakeEvent = new CustomEvent('upload-files', {
        detail: {
          files: [
            {
              file: new FileModel({
                name: 'Fake New file',
                type: 'image/png',
                lastModified: 13,
                size: 1351,
                slice: null
              })
            }
          ],
          data: {
            node: {
              entry: {
                name: 'lights.jpg',
                id: 'f5e5cb54-200e-41a8-9c21-b5ee77da3992'
              }
            }
          }
        }
      });
      store.dispatch(new UploadFileVersionAction(fakeEvent));
      expect(contentManagementService.versionUpdateDialog).toHaveBeenCalled();
    });
  });
});
