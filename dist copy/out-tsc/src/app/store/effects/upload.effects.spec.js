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
  UnlockWriteAction,
  SnackbarErrorAction
} from '@alfresco/aca-shared/store';
import { ContentManagementService } from '../../services/content-management.service';
import { of, throwError } from 'rxjs';
function createFileList(fileName, type) {
  if (type === void 0) {
    type = 'text/plain';
  }
  var data = new Blob([''], { type: type });
  var arrayOfBlob = new Array();
  arrayOfBlob.push(data);
  var file = new File(arrayOfBlob, fileName);
  var files = [file];
  var reducer = function(dataTransfer, currentFile) {
    dataTransfer.items.add(currentFile);
    return dataTransfer;
  };
  return files.reduce(reducer, new DataTransfer()).files;
}
describe('UploadEffects', function() {
  var store;
  var uploadService;
  var effects;
  var zone;
  var contentManagementService;
  var uploadVersionInput;
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, EffectsModule.forRoot([UploadEffects])]
    });
    zone = TestBed.get(NgZone);
    spyOn(zone, 'run').and.callFake(function(fn) {
      return fn();
    });
    contentManagementService = TestBed.get(ContentManagementService);
    store = TestBed.get(Store);
    uploadService = TestBed.get(UploadService);
    effects = TestBed.get(UploadEffects);
  });
  beforeEach(function() {
    uploadVersionInput = document.querySelector('#app-upload-file-version');
  });
  afterEach(function() {
    uploadVersionInput.remove();
  });
  describe('uploadAndUnlock()', function() {
    it('should not upload and unlock file if param not provided', function() {
      effects.uploadAndUnlock(null);
      expect(zone.run).not.toHaveBeenCalled();
    });
    it('should upload the file before unlocking', function() {
      var file = {};
      spyOn(uploadService, 'addToQueue').and.stub();
      spyOn(uploadService, 'uploadFilesInTheQueue').and.stub();
      effects.uploadAndUnlock(file);
      expect(uploadService.addToQueue).toHaveBeenCalled();
      expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalled();
    });
    it('should dispatch the unlock write action for a locked file', function() {
      var file = new FileModel({ name: 'file1.png', size: 10 }, null, 'file1');
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
    it('should dispatch only one unlock action for a locked file', function() {
      var file = new FileModel({ name: 'file1.png', size: 10 }, null, 'file1');
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
      var completeEvent = new FileUploadCompleteEvent(file, 100, file.data);
      uploadService.fileUploadComplete.next(completeEvent);
      uploadService.fileUploadComplete.next(completeEvent);
      uploadService.fileUploadComplete.next(completeEvent);
      expect(store.dispatch).toHaveBeenCalledWith(
        new UnlockWriteAction(file.data)
      );
      expect(store.dispatch).toHaveBeenCalledTimes(1);
    });
    it('should dispatch no actions if file is not locked', function() {
      var file = new FileModel({ name: 'file1.png', size: 10 }, null, 'file1');
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
  describe('upload file version', function() {
    beforeEach(function() {
      var dialog = {
        afterClosed: function() {
          return of({});
        }
      };
      spyOn(contentManagementService, 'versionUploadDialog').and.returnValue(
        dialog
      );
      spyOn(effects, 'uploadAndUnlock').and.stub();
    });
    it('should upload file', function() {
      spyOn(contentManagementService, 'getNodeInfo').and.returnValue(
        of({
          entry: {
            id: 'file1',
            properties: {}
          }
        })
      );
      uploadVersionInput.files = createFileList('bogus.txt');
      uploadVersionInput.dispatchEvent(new CustomEvent('change'));
      expect(effects.uploadAndUnlock).toHaveBeenCalled();
    });
    it('should raise error when getNodeInfo fails', function() {
      spyOn(store, 'dispatch').and.stub();
      spyOn(contentManagementService, 'getNodeInfo').and.returnValue(
        throwError('error')
      );
      uploadVersionInput.files = createFileList('bogus.txt');
      uploadVersionInput.dispatchEvent(new CustomEvent('change'));
      expect(store.dispatch).toHaveBeenCalledWith(
        new SnackbarErrorAction('VERSION.ERROR.GENERIC')
      );
      expect(effects.uploadAndUnlock).not.toHaveBeenCalled();
    });
  });
});
//# sourceMappingURL=upload.effects.spec.js.map
