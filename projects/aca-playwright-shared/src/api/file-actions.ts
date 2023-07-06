/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import * as path from 'path';
import * as fs from 'fs';
import { NodeEntry } from '@alfresco/js-api';
import { ApiClientFactory } from './api-client-factory';
import { users } from '../base-config/global-variables';
import { logger } from '@alfresco/adf-cli/scripts/logger';

export class FileActionsApi extends ApiClientFactory {
    private apiService: ApiClientFactory;
    private logPrefix = `[API Client Factory]`;

    constructor() {
      super();
        this.apiService = new ApiClientFactory();
    }

    static async initialize(
        userProfile: keyof typeof users
    ): Promise<FileActionsApi> {
        const classObj = new FileActionsApi();
        await classObj.apiService.setUpAcaBackend(userProfile);
        return classObj;
    }

    async uploadFile(fileLocation: string, fileName: string, parentFolderId: string): Promise<any> {
        const file = fs.createReadStream(fileLocation);
        logger.info(`${this.logPrefix} Uploading File ${fileName} to ${parentFolderId}`);
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
