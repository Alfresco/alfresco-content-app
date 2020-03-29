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
import * as tslib_1 from 'tslib';
import {
  SnackbarErrorAction,
  UnlockWriteAction,
  UploadActionTypes,
  getCurrentFolder
} from '@alfresco/aca-shared/store';
import { FileModel, FileUtils, UploadService } from '@alfresco/adf-core';
import { Injectable, NgZone, RendererFactory2 } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { tap, filter, catchError, flatMap, map, take } from 'rxjs/operators';
import { ContentManagementService } from '../../services/content-management.service';
var UploadEffects = /** @class */ (function() {
  function UploadEffects(
    store,
    actions$,
    ngZone,
    uploadService,
    rendererFactory,
    contentService
  ) {
    var _this = this;
    this.store = store;
    this.actions$ = actions$;
    this.ngZone = ngZone;
    this.uploadService = uploadService;
    this.contentService = contentService;
    this.uploadFiles$ = this.actions$.pipe(
      ofType(UploadActionTypes.UploadFiles),
      map(function() {
        _this.fileInput.click();
      })
    );
    this.uploadFolder$ = this.actions$.pipe(
      ofType(UploadActionTypes.UploadFolder),
      map(function() {
        _this.folderInput.click();
      })
    );
    this.uploadVersion$ = this.actions$.pipe(
      ofType(UploadActionTypes.UploadFileVersion),
      map(function() {
        _this.fileVersionInput.click();
      })
    );
    var renderer = rendererFactory.createRenderer(null, null);
    this.fileInput = renderer.createElement('input');
    this.fileInput.id = 'app-upload-files';
    this.fileInput.type = 'file';
    this.fileInput.style.display = 'none';
    this.fileInput.setAttribute('multiple', '');
    this.fileInput.addEventListener('change', function(event) {
      return _this.upload(event);
    });
    renderer.appendChild(document.body, this.fileInput);
    this.fileVersionInput = renderer.createElement('input');
    this.fileVersionInput.id = 'app-upload-file-version';
    this.fileVersionInput.type = 'file';
    this.fileVersionInput.style.display = 'none';
    this.fileVersionInput.addEventListener('change', function() {
      return _this.uploadVersion();
    });
    renderer.appendChild(document.body, this.fileVersionInput);
    this.folderInput = renderer.createElement('input');
    this.folderInput.id = 'app-upload-folder';
    this.folderInput.type = 'file';
    this.folderInput.style.display = 'none';
    this.folderInput.setAttribute('directory', '');
    this.folderInput.setAttribute('webkitdirectory', '');
    this.folderInput.addEventListener('change', function(event) {
      return _this.upload(event);
    });
    renderer.appendChild(document.body, this.folderInput);
  }
  UploadEffects.prototype.uploadVersion = function() {
    var _this = this;
    this.contentService
      .versionUploadDialog()
      .afterClosed()
      .pipe(
        tap(function(form) {
          if (!form) {
            _this.fileVersionInput.value = '';
          }
        }),
        filter(function(form) {
          return !!form;
        }),
        flatMap(function(form) {
          return forkJoin(
            of(form),
            _this.contentService.getNodeInfo().pipe(
              catchError(function(_) {
                _this.store.dispatch(
                  new SnackbarErrorAction('VERSION.ERROR.GENERIC')
                );
                return of(null);
              })
            )
          );
        })
      )
      .subscribe(function(_a) {
        var form = _a[0],
          node = _a[1];
        if (form && node) {
          var file = _this.fileVersionInput.files[0];
          var fileModel = new FileModel(
            file,
            {
              comment: form.comment,
              majorVersion: form.version,
              parentId: node.parentId,
              path: (file.webkitRelativePath || '').replace(/\/[^\/]*$/, ''),
              newVersion: true,
              nodeType: 'cm:content'
            },
            node.id
          );
          _this.uploadAndUnlock(fileModel);
        }
        _this.fileVersionInput.value = '';
      });
  };
  UploadEffects.prototype.upload = function(event) {
    var _this = this;
    this.store
      .select(getCurrentFolder)
      .pipe(take(1))
      .subscribe(function(node) {
        if (node && node.id) {
          var input = event.currentTarget;
          var files = FileUtils.toFileArray(input.files).map(function(file) {
            return new FileModel(file, {
              parentId: node.id,
              path: (file.webkitRelativePath || '').replace(/\/[^\/]*$/, ''),
              nodeType: 'cm:content'
            });
          });
          _this.uploadQueue(files);
          event.target.value = '';
        }
      });
  };
  UploadEffects.prototype.uploadQueue = function(files) {
    var _this = this;
    if (files.length > 0) {
      this.ngZone.run(function() {
        var _a;
        (_a = _this.uploadService).addToQueue.apply(_a, files);
        _this.uploadService.uploadFilesInTheQueue();
      });
    }
  };
  UploadEffects.prototype.uploadAndUnlock = function(file) {
    var _this = this;
    if (!file) {
      return;
    }
    this.ngZone.run(function() {
      _this.uploadService.addToQueue(file);
      _this.uploadService.uploadFilesInTheQueue();
      var subscription = _this.uploadService.fileUploadComplete.subscribe(
        function(completed) {
          if (
            file.data &&
            file.data.entry &&
            file.data.entry.properties &&
            file.data.entry.properties['cm:lockType'] === 'WRITE_LOCK' &&
            file.data.entry.id === completed.data.entry.id
          ) {
            _this.store.dispatch(new UnlockWriteAction(completed.data));
          }
          subscription.unsubscribe();
        }
      );
    });
  };
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    UploadEffects.prototype,
    'uploadFiles$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    UploadEffects.prototype,
    'uploadFolder$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    UploadEffects.prototype,
    'uploadVersion$',
    void 0
  );
  UploadEffects = tslib_1.__decorate(
    [
      Injectable(),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        Actions,
        NgZone,
        UploadService,
        RendererFactory2,
        ContentManagementService
      ])
    ],
    UploadEffects
  );
  return UploadEffects;
})();
export { UploadEffects };
//# sourceMappingURL=upload.effects.js.map
