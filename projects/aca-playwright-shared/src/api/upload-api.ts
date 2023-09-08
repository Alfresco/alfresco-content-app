/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import * as fs from 'fs';
import { users } from '../base-config';
import { ApiClientFactory } from './api-client-factory';

export class UploadApi {
  private apiService: ApiClientFactory;

  constructor(userProfile?: keyof typeof users) {
    this.apiService = new ApiClientFactory();
    this.apiService.setUpAcaBackend(userProfile ?? 'hruser');
  }

  static async initialize(userName: string, password?: string): Promise<UploadApi> {
    const classObj = new UploadApi();
    await classObj.apiService.setUpAcaBackend(userName, password);
    return classObj;
  }

  async uploadFile(fileLocation: string, fileName: string, parentFolderId: string): Promise<any> {
    const file = fs.createReadStream(fileLocation);
    return this.apiService.upload.uploadFile(
        file,
        '',
        parentFolderId,
        null,
        {
            name: fileName,
            nodeType: 'cm:content',
            renditions: 'doclib'
        }
    );
  }

}
