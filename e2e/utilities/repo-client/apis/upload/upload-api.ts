/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import { RepoApi } from '../repo-api';
import { E2E_ROOT_PATH } from '../../../../configs';
import { UploadApi as AdfUploadApi } from '@alfresco/js-api';

const fs = require('fs');

export class UploadApi extends RepoApi {
  upload = new AdfUploadApi(this.alfrescoJsApi);

  constructor(username?, password?) {
    super(username, password);
  }

  async uploadFile(fileName: string, parentFolderId: string = '-my-') {
    const file = fs.createReadStream(`${E2E_ROOT_PATH}/resources/test-files/${fileName}`);
    const opts = {
      name: file.name,
      nodeType: 'cm:content'
    };

    try {
      await this.apiAuth();
      return await this.upload.uploadFile(file, '', parentFolderId, null, opts);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.uploadFile.name}`, error);
    }
  }

  async uploadFileWithRename(fileName: string, parentFolderId: string = '-my-', newName: string) {
    const file = fs.createReadStream(`${E2E_ROOT_PATH}/resources/test-files/${fileName}`);
    const opts = {
        name: newName,
        nodeType: 'cm:content'
    };

    try {
      await this.apiAuth();
      return await this.upload.uploadFile(file, '', parentFolderId, null, opts);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.uploadFileWithRename.name}`, error);
    }
  }

}
