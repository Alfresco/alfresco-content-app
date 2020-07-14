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

import { RepoApi } from '../repo-api';
import { UploadApi as AdfUploadApi } from '@alfresco/js-api';
import { browser } from 'protractor';
import * as fs from 'fs';

export class UploadApi extends RepoApi {
  upload = new AdfUploadApi(this.alfrescoJsApi);
  e2eRootPath = browser.params.e2eRootPath;

  constructor(username?: string, password?: string) {
    super(username, password);
  }

  async uploadFile(fileName: string, parentFolderId: string = '-my-') {
    const file = fs.createReadStream(`${this.e2eRootPath}/resources/test-files/${fileName}`);
    const opts = {
      name: fileName,
      nodeType: 'cm:content'
    };

    try {
      await this.apiAuth();
      return await this.upload.uploadFile(file, '', parentFolderId, null, opts);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.uploadFile.name}`, error);
    }
  }

  async uploadFileWithRename(fileName: string, parentId: string = '-my-', newName: string, title: string = '', description: string = '') {
    const file = fs.createReadStream(`${this.e2eRootPath}/resources/test-files/${fileName}`);
    const nodeProps = {
      properties: {
        'cm:title': title,
        'cm:description': description
      }
    };

    const opts = {
      name: newName,
      nodeType: 'cm:content'
    };

    try {
      await this.apiAuth();
      return await this.upload.uploadFile(file, '', parentId, nodeProps, opts);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.uploadFileWithRename.name}`, error);
    }
  }
}
