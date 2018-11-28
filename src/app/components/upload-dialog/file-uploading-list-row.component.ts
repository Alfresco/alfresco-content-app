/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { FileModel, FileUploadStatus } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-uploading-list-row',
  templateUrl: './file-uploading-list-row.component.html'
})
export class FileUploadingListRowComponent {
  @Input()
  file: FileModel;

  @Input()
  error: any;

  @Output()
  cancel: EventEmitter<FileModel> = new EventEmitter<FileModel>();

  @Output()
  remove: EventEmitter<FileModel> = new EventEmitter<FileModel>();

  FileUploadStatus = FileUploadStatus;

  onCancel(file: FileModel): void {
    this.cancel.emit(file);
  }

  onRemove(file: FileModel): void {
    this.remove.emit(file);
  }
}
