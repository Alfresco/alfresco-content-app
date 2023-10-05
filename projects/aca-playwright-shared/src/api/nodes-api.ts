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
import { NodeChildAssociationPaging, NodeEntry } from '@alfresco/js-api';
import { logger } from '@alfresco/adf-cli/scripts/logger';
import { NodeContentTree, flattenNodeContentTree } from './node-content-tree';

export class NodesApi {
  private apiService: ApiClientFactory;

  constructor() {
    this.apiService = new ApiClientFactory();
  }

  static async initialize(userName: string, password?: string): Promise<NodesApi> {
    const classObj = new NodesApi();
    await classObj.apiService.setUpAcaBackend(userName, password);
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

  /**
   * Delete multiple nodes.
   * @param nodeIds The list of node IDs to delete.
   * @param permanent Delete permanently, without moving to the trashcan? (default: true)
   */
  async deleteNodes(nodeIds: string[], permanent: boolean = true): Promise<any> {
    try {
      for (const nodeId of nodeIds) {
        await this.apiService.nodes.deleteNode(nodeId, { permanent });
      }
    } catch (error) {
      logger.error(`${this.constructor.name} ${this.deleteNodes.name}`, error);
    }
  }

  async lockNodes(nodeIds: string[], lockType: string = 'ALLOW_OWNER_CHANGES') {
    try {
      for (const nodeId of nodeIds) {
        await this.apiService.nodes.lockNode(nodeId, { type: lockType });
      }
    } catch (error) {
      logger.error(`${this.constructor.name} ${this.lockNodes.name}`, error);
    }
  }

  async createContent(content: NodeContentTree, relativePath: string = '/'): Promise<NodeEntry | any> {
    try {
      return await this.apiService.nodes.createNode('-my-', flattenNodeContentTree(content, relativePath) as any);
    } catch (error) {
      logger.error(`${this.constructor.name} ${this.createContent.name}`, error);
    }
  }

  async getNodeById(id: string): Promise<NodeEntry | null> {
    try {
      return await this.apiService.nodes.getNode(id);
    } catch (error) {
      logger.error(`${this.constructor.name} ${this.getNodeById.name}`, error);
      return null;
    }
  }

  async getNodeIdFromParent(name: string, parentId: string): Promise<string> {
    try {
      const children = (await this.getNodeChildren(parentId)).list.entries;
      return children.find((elem) => elem.entry.name === name).entry.id || '';
    } catch (error) {
      logger.error(`${this.constructor.name} ${this.getNodeIdFromParent.name}`, error);
      return '';
    }
  }

  private async getNodeChildren(nodeId: string): Promise<NodeChildAssociationPaging | null> {
    try {
      const opts = {
        include: ['properties']
      };
      return await this.apiService.nodes.listNodeChildren(nodeId, opts);
    } catch (error) {
      logger.error(`${this.constructor.name} ${this.getNodeChildren.name}`, error);
      return null;
    }
  }

  async deleteNodeById(id: string, permanent: boolean = true): Promise<void> {
    try {
      await this.apiService.nodes.deleteNode(id, { permanent });
    } catch (error) {
      logger.error(`${this.constructor.name} ${this.deleteNodeById.name}`, error);
    }
  }

  async cleanupSpaceTemplatesItems(nodeNames: string[]): Promise<void> {
    try {
      const spaceTemplatesNodeId = await this.getSpaceTemplatesFolderId();
      for (const nodeName of nodeNames) {
        const nodeId = await this.getNodeIdFromParent(nodeName, spaceTemplatesNodeId);
        await this.deleteNodeById(nodeId);
      }
    } catch (error) {
      logger.error('Admin Actions - cleanupSpaceTemplatesFolder failed : ', error);
    }
  }

  async getSpaceTemplatesFolderId(): Promise<string> {
    try {
      return this.getNodeIdFromParent('Space Templates', await this.getDataDictionaryId());
    } catch (error) {
      logger.error('Admin Actions - getSpaceTemplatesFolderId failed : ', error);
      return '';
    }
  }

  private async getDataDictionaryId(): Promise<string> {
    try {
      return this.getNodeIdFromParent('Data Dictionary', '-root-');
    } catch (error) {
      logger.error('Admin Actions - getDataDictionaryId failed : ', error);
      return '';
    }
  }

  async setGranularPermission(nodeId: string, inheritPermissions: boolean = false, username: string, role: string): Promise<NodeEntry | null> {
    const data = {
      permissions: {
        isInheritanceEnabled: inheritPermissions,
        locallySet: [
          {
            authorityId: username,
            name: role
          }
        ]
      }
    };

    try {
      return await this.apiService.nodes.updateNode(nodeId, data);
    } catch (error) {
      logger.error(`${this.constructor.name} ${this.setGranularPermission.name}`, error);
      return null;
    }
  }

  async removeUserAccessOnSpaceTemplate(nodeName: string): Promise<NodeEntry> {
    try {
      const templatesRootFolderId = await this.getSpaceTemplatesFolderId();
      const nodeId: string = await this.getNodeIdFromParent(nodeName, templatesRootFolderId);

      return this.setInheritPermissions(nodeId, false);
    } catch (error) {
      logger.error('Admin Actions - removeUserAccessOnSpaceTemplate failed : ', error);
      return null;
    }
  }

  async setInheritPermissions(nodeId: string, inheritPermissions: boolean): Promise<NodeEntry | null> {
    const data = {
      permissions: {
        isInheritanceEnabled: inheritPermissions
      }
    };

    try {
      return await this.apiService.nodes.updateNode(nodeId, data);
    } catch (error) {
      logger.error(`${this.constructor.name} ${this.setInheritPermissions.name}`, error);
      return null;
    }
  }

  private async addAspects(nodeId: string, aspectNames: string[]): Promise<NodeEntry> {
    try {
      return this.apiService.nodes.updateNode(nodeId, { aspectNames });
    } catch (error) {
      logger.error(`${this.constructor.name} ${this.addAspects.name}`, error);
      return null;
    }
  }

  async createFolderLink(originalNodeId: string, destinationId: string): Promise<NodeEntry | null> {
    const name = (await this.getNodeById(originalNodeId)).entry.name;
    const nodeBody = {
      name: `Link to ${name}.url`,
      nodeType: 'app:folderlink',
      properties: {
        'cm:title': `Link to ${name}.url`,
        'cm:destination': originalNodeId,
        'cm:description': `Link to ${name}.url`,
        'app:icon': 'space-icon-link'
      }
    };

    try {
      const link = await this.apiService.nodes.createNode(destinationId, nodeBody);
      await this.addAspects(originalNodeId, ['app:linked']);
      return link;
    } catch (error) {
      logger.error(`${this.constructor.name} ${this.createFolderLink.name}`, error);
      return null;
    }
  }

  async createLinkToFolderName(originalFolderName: string, originalFolderParentId: string, destinationParentId?: string): Promise<NodeEntry> {
    if (!destinationParentId) {
      destinationParentId = originalFolderParentId;
    }

    try {
      const nodeId = await this.getNodeIdFromParent(originalFolderName, originalFolderParentId);
      return this.createFolderLink(nodeId, destinationParentId);
    } catch (error) {
      logger.error('Admin Actions - createLinkToFolderName failed : ', error);
      return null;
    }
  }
}
