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

import { ApiClientFactory } from './api-client-factory';
import { NodeEntry } from '@alfresco/js-api';
import { users } from '../base-config/global-variables';
import { logger } from '@alfresco/adf-cli/scripts/logger';

export class NodesApi extends ApiClientFactory {
  private apiService: ApiClientFactory;

  constructor() {
    super();
    this.apiService = new ApiClientFactory();
  }
  static async initialize(userProfile: keyof typeof users): Promise<NodesApi> {
    const classObj = new NodesApi();
    await classObj.apiService.setUpAcaBackend(userProfile);
    return classObj;
  }

  async createFolder(
    name: string,
    parentId: string = '-my-',
    title: string = '',
    description: string = '',
    author: string = '',
    aspectNames: string[] = null
  ): Promise<NodeEntry | null> {
    try {
      return await this.createNode('cm:folder', name, parentId, title, description, null, author, null, aspectNames);
    } catch (error) {
      logger.error(`${this.constructor.name} ${this.createFolder.name}`, error);
      return null;
    }
  }

  async createFile(
    name: string,
    parentId: string = '-my-',
    title: string = '',
    description: string = '',
    author: string = '',
    majorVersion: boolean = true,
    aspectNames: string[] = null
  ): Promise<NodeEntry> {
    try {
      return await this.createNode('cm:content', name, parentId, title, description, null, author, majorVersion, aspectNames);
    } catch (error) {
      logger.error(`${this.constructor.name} ${this.createFile.name}`, error);
      return null;
    }
  }

  private async createNode(
    nodeType: string,
    name: string,
    parentId: string = '-my-',
    title: string = '',
    description: string = '',
    imageProps: any = null,
    author: string = '',
    majorVersion: boolean = true,
    aspectNames: string[] = null
  ): Promise<NodeEntry | null> {
    if (!aspectNames) {
      aspectNames = ['cm:versionable']; // workaround for REPO-4772
    }
    const nodeBody = {
      name,
      nodeType,
      relativePath: '/',
      properties: {
        'cm:title': title,
        'cm:description': description,
        'cm:author': author
      },
      aspectNames
    };
    if (imageProps) {
      nodeBody.properties = Object.assign(nodeBody.properties, imageProps);
    }

    try {
      return await this.apiService.nodes.createNode(parentId, nodeBody, {
        majorVersion
      });
    } catch (error) {
      logger.error(`${this.constructor.name} ${this.createNode.name}`, error);
      return null;
    }
  }

  async renameNode(nodeId: string, newName: string): Promise<NodeEntry | null> {
    try {
      return this.apiService.nodes.updateNode(nodeId, { name: newName });
    } catch (error) {
      logger.error(`${this.constructor.name} ${this.renameNode.name}`, error);
      return null;
    }
  }
}
