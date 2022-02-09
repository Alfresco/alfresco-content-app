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

import {
  AppStore,
  SnackbarErrorAction,
  UnlockWriteAction,
  UploadActionTypes,
  UploadFilesAction,
  UploadFileVersionAction,
  UploadFolderAction,
  getCurrentFolder
} from '@alfresco/aca-shared/store';
import { FileModel, FileUtils, UploadService } from '@alfresco/adf-core';
import { Injectable, NgZone, RendererFactory2 } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { ContentManagementService } from '../../services/content-management.service';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';

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
    this.fileInput.addEventListener('change', (event) => this.upload(event));
    renderer.appendChild(document.body, this.fileInput);

    this.fileVersionInput = renderer.createElement('input') as HTMLInputElement;
    this.fileVersionInput.id = 'app-upload-file-version';
    this.fileVersionInput.type = 'file';
    this.fileVersionInput.style.display = 'none';
    this.fileVersionInput.addEventListener('change', () => {
      this.uploadVersion();
    });
    renderer.appendChild(document.body, this.fileVersionInput);

    this.folderInput = renderer.createElement('input') as HTMLInputElement;
    this.folderInput.id = 'app-upload-folder';
    this.folderInput.type = 'file';
    this.folderInput.style.display = 'none';
    this.folderInput.setAttribute('directory', '');
    this.folderInput.setAttribute('webkitdirectory', '');
    this.folderInput.addEventListener('change', (event) => this.upload(event));
    renderer.appendChild(document.body, this.folderInput);
  }

  @Effect({ dispatch: false })
  uploadFiles$ = this.actions$.pipe(
    ofType<UploadFilesAction>(UploadActionTypes.UploadFiles),
    map(() => {
      this.fileInput.click();
    })
  );

  @Effect({ dispatch: false })
  uploadFolder$ = this.actions$.pipe(
    ofType<UploadFolderAction>(UploadActionTypes.UploadFolder),
    map(() => {
      this.folderInput.click();
    })
  );

  @Effect({ dispatch: false })
  uploadVersion$ = this.actions$.pipe(
    ofType<UploadFileVersionAction>(UploadActionTypes.UploadFileVersion),
    map((action) => {
      if (action?.payload) {
        const node = action?.payload?.detail?.data?.node?.entry;
        const file: any = action?.payload?.detail?.files[0]?.file;
        this.contentService.versionUpdateDialog(node, file);
      } else if (!action?.payload) {
        this.fileVersionInput.click();
      }
    })
  );

  uploadVersion() {
    this.contentService
      .getNodeInfo()
      .pipe(
        catchError((_) => {
          this.store.dispatch(new SnackbarErrorAction('VERSION.ERROR.GENERIC'));
          return of(null);
        })
      )
      .subscribe((node: MinimalNodeEntryEntity) => {
        if (node) {
          this.contentService.versionUpdateDialog(node, this.fileVersionInput.files[0]);
          this.fileVersionInput.value = '';
        }
      });
  }

  private upload(event: any): void {
    this.store
      .select(getCurrentFolder)
      .pipe(take(1))
      .subscribe((node) => {
        if (node && node.id) {
          const input = event.currentTarget as HTMLInputElement;
          const files = FileUtils.toFileArray(input.files).map(
            (file: any) =>
              new FileModel(file, {
                parentId: node.id,
                path: (file.webkitRelativePath || '').replace(/\/[^\/]*$/, ''),
                nodeType: 'cm:content'
              })
          );

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

  uploadAndUnlock(file: FileModel) {
    if (!file) {
      return;
    }

    this.ngZone.run(() => {
      this.uploadService.addToQueue(file);
      this.uploadService.uploadFilesInTheQueue();

      const subscription = this.uploadService.fileUploadComplete.subscribe((completed) => {
        if (
          file.data &&
          file.data.entry &&
          file.data.entry.properties &&
          file.data.entry.properties['cm:lockType'] === 'WRITE_LOCK' &&
          file.data.entry.id === completed.data.entry.id
        ) {
          this.store.dispatch(new UnlockWriteAction(completed.data));
        }

        subscription.unsubscribe();
      });
    });
  }
}
