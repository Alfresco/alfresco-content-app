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
import { UploadFilesAction, UPLOAD_FILES } from '../actions';
import { map, take } from 'rxjs/operators';
import { FileUtils, FileModel, UploadService } from '@alfresco/adf-core';
import { currentFolder } from '../selectors/app.selectors';
import { UploadFolderAction, UPLOAD_FOLDER } from '../actions/upload.actions';

@Injectable()
export class UploadEffects {
    private fileInput: HTMLInputElement;
    private folderInput: HTMLInputElement;

    constructor(
        private store: Store<AppStore>,
        private actions$: Actions,
        private ngZone: NgZone,
        private uploadService: UploadService,
        rendererFactory: RendererFactory2
    ) {
        const renderer = rendererFactory.createRenderer(null, null);

        this.fileInput = renderer.createElement('input') as HTMLInputElement;
        this.fileInput.id = 'app-upload-files';
        this.fileInput.type = 'file';
        this.fileInput.style.display = 'none';
        this.fileInput.setAttribute('multiple', '');
        this.fileInput.addEventListener('change', event => this.upload(event));
        renderer.appendChild(document.body, this.fileInput);


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

    private upload(event: any): void {
        this.store
            .select(currentFolder)
            .pipe(take(1))
            .subscribe(node => {
                if (node && node.id) {
                    const input = <HTMLInputElement>event.currentTarget;
                    const files = FileUtils.toFileArray(input.files).map(
                        file => {
                            return new FileModel(file, {
                                parentId: node.id,
                                path: (file.webkitRelativePath || '').replace(/\/[^\/]*$/, ''),
                                nodeType: 'cm:content'
                            });
                        }
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
}
