/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { Injectable, RendererFactory2, NgZone } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppStore } from '../states';
import {
  UploadFilesAction,
  UPLOAD_FILES,
  UploadFolderAction,
  UPLOAD_FOLDER,
  UPLOAD_FILE_VERSION,
  UploadFileVersionAction,
  SnackbarErrorAction,
  UnlockWriteAction
} from '../actions';
import {
  map,
  take,
  flatMap,
  distinctUntilChanged,
  catchError,
  switchMap
} from 'rxjs/operators';
import { FileUtils, FileModel, UploadService } from '@alfresco/adf-core';
import { currentFolder } from '../selectors/app.selectors';
import { fromEvent, of, forkJoin } from 'rxjs';
import { ContentManagementService } from '../../services/content-management.service';

@Injectable()
export class UploadEffects {
  private fileInput: HTMLInputElement;
  private folderInput: HTMLInputElement;
  private fileVersionInput: HTMLInputElement;

  constructor(
    private store: Store<AppStore>,
    private actions$: Actions,
    private ngZone: NgZone,
    private uploadService: UploadService,
    rendererFactory: RendererFactory2,
    private contentService: ContentManagementService
  ) {
    const renderer = rendererFactory.createRenderer(null, null);

    this.fileInput = renderer.createElement('input') as HTMLInputElement;
    this.fileInput.id = 'app-upload-files';
    this.fileInput.type = 'file';
    this.fileInput.style.display = 'none';
    this.fileInput.setAttribute('multiple', '');
    this.fileInput.addEventListener('change', event => this.upload(event));
    renderer.appendChild(document.body, this.fileInput);

    this.fileVersionInput = renderer.createElement('input') as HTMLInputElement;
    this.fileVersionInput.id = 'app-upload-file-version';
    this.fileVersionInput.type = 'file';
    this.fileVersionInput.style.display = 'none';
    this.fileVersionInput.addEventListener('change', event => event);
    renderer.appendChild(document.body, this.fileVersionInput);

    this.folderInput = renderer.createElement('input') as HTMLInputElement;
    this.folderInput.id = 'app-upload-folder';
    this.folderInput.type = 'file';
    this.folderInput.style.display = 'none';
    this.folderInput.setAttribute('directory', '');
    this.folderInput.setAttribute('webkitdirectory', '');
    this.folderInput.addEventListener('change', event => this.upload(event));
    renderer.appendChild(document.body, this.folderInput);
  }

  @Effect({ dispatch: false })
  uploadFiles$ = this.actions$.pipe(
    ofType<UploadFilesAction>(UPLOAD_FILES),
    map(() => {
      this.fileInput.click();
    })
  );

  @Effect({ dispatch: false })
  uploadFolder$ = this.actions$.pipe(
    ofType<UploadFolderAction>(UPLOAD_FOLDER),
    map(() => {
      this.folderInput.click();
    })
  );

  @Effect({ dispatch: false })
  uploadVersion$ = this.actions$.pipe(
    ofType<UploadFileVersionAction>(UPLOAD_FILE_VERSION),
    switchMap(() => {
      this.fileVersionInput.click();
      return fromEvent(this.fileVersionInput, 'change').pipe(
        distinctUntilChanged(),
        flatMap(() => this.contentService.versionUploadDialog().afterClosed()),
        flatMap(form => forkJoin(of(form), this.contentService.getNodeInfo())),
        map(([form, node]) => {
          const file = this.fileVersionInput.files[0];
          const fileModel = new FileModel(
            file,
            {
              comment: form.comment,
              majorVersion: form.major ? true : false,
              parentId: node.parentId,
              path: ((<any>file).webkitRelativePath || '').replace(
                /\/[^\/]*$/,
                ''
              ),
              newVersion: true,
              nodeType: 'cm:content'
            },
            node.id
          );

          this.fileVersionInput.value = '';
          this.uploadVersion(fileModel);
        }),
        catchError(error => {
          this.fileVersionInput.value = '';
          return of(new SnackbarErrorAction('VERSION.ERROR.GENERIC'));
        })
      );
    })
  );

  private upload(event: any): void {
    this.store
      .select(currentFolder)
      .pipe(take(1))
      .subscribe(node => {
        if (node && node.id) {
          const input = <HTMLInputElement>event.currentTarget;
          const files = FileUtils.toFileArray(input.files).map(file => {
            return new FileModel(file, {
              parentId: node.id,
              path: ((<any>file).webkitRelativePath || '').replace(
                /\/[^\/]*$/,
                ''
              ),
              nodeType: 'cm:content'
            });
          });

          this.uploadQueue(files);
          event.target.value = '';
        }
      });
  }

  private uploadQueue(files: FileModel[]) {
    if (files.length > 0) {
      this.ngZone.run(() => {
        this.uploadService.addToQueue(...files);
        this.uploadService.uploadFilesInTheQueue();
      });
    }
  }

  private uploadVersion(file: FileModel) {
    this.ngZone.run(() => {
      this.uploadService.addToQueue(file);
      this.uploadService.uploadFilesInTheQueue();

      this.uploadService.fileUploadComplete.subscribe(completed => {
        if (completed.data.entry.id === file.data.entry.id) {
          this.store.dispatch(new UnlockWriteAction(completed.data));
        }
      });
    });
  }
}
