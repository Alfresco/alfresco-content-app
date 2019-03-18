/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component } from '@angular/core';
import { FileUploadingListRowComponent } from '@alfresco/adf-content-services';
@Component({
  selector: 'app-file-uploading-list-row',
  templateUrl: './file-uploading-list-row.component.html'
})
export class AppFileUploadingListRowComponent extends FileUploadingListRowComponent {
  isUploadVersion() {
    return (
      !!this.file.data &&
      this.file.options &&
      this.file.options.newVersion &&
      this.file.data.entry.properties &&
      this.file.data.entry.properties['cm:versionLabel']
    );
  }

  // todo: move to ADF 3.x.x
  get versionNumber() {
    return this.file.data.entry.properties['cm:versionLabel'];
  }

  // todo: move to ADF 3.x.x
  get mimeType(): string {
    if (this.file && this.file.file && this.file.file.type) {
      return this.file.file.type;
    }

    return 'default';
  }
}
