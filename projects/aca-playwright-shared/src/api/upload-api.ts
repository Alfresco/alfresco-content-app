/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import * as fs from 'fs';
import * as path from 'path';
import { File as NodeFile } from 'node:buffer';
import { ApiClientFactory } from './api-client-factory';
import { logger } from '../utils';
import { NodeBodyCreate, NodeEntry } from '@alfresco/js-api';

const fileFixtureCache = new Map<string, Buffer>();

async function toUploadFile(fileLocation: string): Promise<NodeFile> {
  let buffer = fileFixtureCache.get(fileLocation);
  if (!buffer) {
    buffer = await fs.promises.readFile(fileLocation);
    fileFixtureCache.set(fileLocation, buffer);
  }
  return new NodeFile([new Uint8Array(buffer)], path.basename(fileLocation));
}

export class UploadApi {
  private readonly apiService: ApiClientFactory;

  constructor() {
    this.apiService = new ApiClientFactory();
  }

  static async initialize(userName: string, password?: string): Promise<UploadApi> {
    const classObj = new UploadApi();
    await classObj.apiService.setUpAcaBackend(userName, password);
    return classObj;
  }

  async uploadFile(fileLocation: string, fileName: string, parentFolderId: string): Promise<NodeEntry> {
    const file = await toUploadFile(fileLocation);
    try {
      const result = await this.apiService.upload.uploadFile(file, '', parentFolderId, undefined, {
        name: fileName,
        nodeType: 'cm:content',
        renditions: 'doclib'
      });
      logger.info(`File uploaded successfully: ${fileName}`);
      return result;
    } catch (error) {
      logger.error(`Failed to upload file: ${fileName}: ${JSON.stringify(error)}`);
      return Promise.reject(error);
    }
  }

  async uploadNewVersionFile(nodeId: string, fileLocation: string, newFileName: string, majorVersion = true, comment = ''): Promise<NodeEntry> {
    try {
      const existingNode = await this.apiService.nodes.getNode(nodeId);
      const parentId = existingNode.entry.parentId;

      if (newFileName !== existingNode.entry.name) {
        await this.apiService.nodes.updateNode(nodeId, { name: newFileName });
      }

      const file = await toUploadFile(fileLocation);
      await this.apiService.upload.uploadFile(file, '', parentId, undefined, {
        name: newFileName,
        nodeType: 'cm:content',
        renditions: 'doclib',
        overwrite: true,
        majorVersion,
        comment
      });

      logger.info(`New version uploaded successfully for node ${nodeId}: ${newFileName}`);
      return await this.apiService.nodes.getNode(nodeId);
    } catch (error) {
      const errorMessage = error instanceof Error ? (error.stack ?? error.message) : JSON.stringify(error);
      logger.error(`Failed to upload new version for node ${nodeId}: ${errorMessage}`);
      return Promise.reject(error);
    }
  }

  async uploadFileWithRename(
    fileLocation: string,
    newName: string,
    parentId: string = '-my-',
    title: string = '',
    description: string = ''
  ): Promise<NodeEntry> {
    const file = await toUploadFile(fileLocation);
    const nodeProps = {
      properties: {
        'cm:title': title,
        'cm:description': description
      }
    } as NodeBodyCreate;

    const opts = {
      name: newName,
      nodeType: 'cm:content'
    };

    try {
      const result = await this.apiService.upload.uploadFile(file, '', parentId, nodeProps, opts);
      logger.info(`File uploaded successfully: ${newName}`);
      return result;
    } catch (error) {
      logger.error(`Failed to upload file: ${newName}: ${error}`);
      return Promise.reject(error);
    }
  }
}
