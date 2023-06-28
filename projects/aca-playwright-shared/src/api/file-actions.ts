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

    async createEmptyFiles(emptyFileNames: string[], parentFolderId): Promise<NodeEntry> {
        const filesRequest = [];

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < emptyFileNames.length; i++) {
            const jsonItem = {};
            jsonItem['name'] = emptyFileNames[i];
            jsonItem['nodeType'] = 'cm:content';
            filesRequest.push(jsonItem);
        }

        return this.apiService.nodes.createNode(parentFolderId, filesRequest as any, {});
    }

    async createFolder(folderName: string, parentFolderId: string): Promise<NodeEntry> {
        logger.info(`${this.logPrefix} Creating folder ${folderName} in ${parentFolderId}`);
        return this.apiService.nodes.createNode(parentFolderId, {
            name: folderName,
            nodeType: 'cm:folder'
        }, {});
    }

    async uploadFolder(sourcePath, folder) {
        const files = fs.readdirSync(sourcePath);
        let uploadedFiles;
        const promises = [];

        if (files && files.length > 0) {
            for (const fileName of files) {
                const pathFile = path.join(sourcePath, fileName);
                promises.push(this.uploadFile(pathFile, fileName, folder));
            }
            uploadedFiles = await Promise.all(promises);
        }

        return uploadedFiles;
    }

}
