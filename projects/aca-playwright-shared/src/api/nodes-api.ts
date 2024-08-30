/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ApiClientFactory } from './api-client-factory';
import { NodeChildAssociationPaging, NodeEntry, NodePaging } from '@alfresco/js-api';
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
      return this.createNode('cm:folder', name, parentId, title, description, null, author, null, aspectNames);
    } catch (error) {
      console.error(`${this.constructor.name} ${this.createFolder.name}`, error);
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
      return this.createNode('cm:content', name, parentId, title, description, null, author, majorVersion, aspectNames);
    } catch (error) {
      console.error(`${this.constructor.name} ${this.createFile.name}`, error);
      return null;
    }
  }

  async createFiles(names: string[], relativePath = '/'): Promise<NodePaging> {
    try {
      return this.createContent({ files: names }, relativePath);
    } catch (error) {
      console.error(`${this.constructor.name} ${this.createFiles.name}: ${error}`);
      return null;
    }
  }

  async createFolders(names: string[], relativePath = '/'): Promise<NodePaging> {
    try {
      return this.createContent({ folders: names }, relativePath);
    } catch (error) {
      console.error(`${this.constructor.name} ${this.createFolders.name}: ${error}`);
      return null;
    }
  }

  async deleteDeletedNode(name: string): Promise<void> {
    try {
      await this.apiService.trashCan.deleteDeletedNode(name);
    } catch (error) {
      console.error(`${this.constructor.name} ${this.deleteDeletedNode.name}: ${error}`);
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
      return this.apiService.nodes.createNode(parentId, nodeBody, {
        majorVersion
      });
    } catch (error) {
      console.error(`${this.constructor.name} ${this.createNode.name}`, error);
      return null;
    }
  }

  async renameNode(nodeId: string, newName: string): Promise<NodeEntry | null> {
    try {
      return this.apiService.nodes.updateNode(nodeId, { name: newName });
    } catch (error) {
      console.error(`${this.constructor.name} ${this.renameNode.name}`, error);
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
      await this.apiService.nodes.deleteNodes(nodeIds, { permanent });
    } catch (error) {
      console.error(`${this.constructor.name} ${this.deleteNodes.name}`, error);
    }
  }

  /**
   * Delete all nodes of the currently logged in user
   * @param userNodeId The id of User node, all child nodes of "userNodeId" will be gathered as a list and deleted ( e.g.: "-my-" - User Homes folder)
   */
  async deleteCurrentUserNodes(): Promise<void> {
    try {
      const userNodes = (await this.getNodeChildren('-my-')).list.entries;
      const userNodesIds = userNodes.map((nodeChild) => nodeChild.entry.id);
      await this.deleteNodes(userNodesIds);
    } catch (error) {
      console.error(`${this.constructor.name} ${this.deleteCurrentUserNodes.name}`, error);
    }
  }

  async lockNodes(nodeIds: string[], lockType: string = 'ALLOW_OWNER_CHANGES') {
    try {
      for (const nodeId of nodeIds) {
        await this.apiService.nodes.lockNode(nodeId, { type: lockType });
      }
    } catch (error) {
      console.error(`${this.constructor.name} ${this.lockNodes.name}`, error);
    }
  }

  async unlockNodes(nodeIds: string[]) {
    try {
      for (const nodeId of nodeIds) {
        await this.apiService.nodes.unlockNode(nodeId);
      }
    } catch (error) {
      console.error(`${this.constructor.name} ${this.unlockNodes.name}`, error);
    }
  }

  async createContent(content: NodeContentTree, relativePath: string = '/'): Promise<NodePaging> {
    try {
      return this.apiService.nodes.createNode('-my-', flattenNodeContentTree(content, relativePath) as any);
    } catch (error) {
      console.error(`${this.constructor.name} ${this.createContent.name}`, error);
      return null;
    }
  }

  async getNodeById(id: string): Promise<NodeEntry | null> {
    try {
      return this.apiService.nodes.getNode(id);
    } catch (error) {
      console.error(`${this.constructor.name} ${this.getNodeById.name}`, error);
      return null;
    }
  }

  async getNodeIdFromParent(name: string, parentId: string): Promise<string> {
    try {
      const children = (await this.getNodeChildren(parentId)).list.entries;
      return children.find((elem) => elem.entry.name === name).entry.id || '';
    } catch (error) {
      console.error(`${this.constructor.name} ${this.getNodeIdFromParent.name}`, error);
      return '';
    }
  }

  private async getNodeChildren(nodeId: string): Promise<NodeChildAssociationPaging | null> {
    try {
      const opts = {
        include: ['properties']
      };
      return this.apiService.nodes.listNodeChildren(nodeId, opts);
    } catch (error) {
      console.error(`${this.constructor.name} ${this.getNodeChildren.name}`, error);
      return null;
    }
  }

  async deleteNodeById(id: string, permanent: boolean = true): Promise<void> {
    try {
      await this.apiService.nodes.deleteNode(id, { permanent });
    } catch (error) {
      console.error(`${this.constructor.name} ${this.deleteNodeById.name}`, error);
    }
  }

  async cleanupNodeTemplatesItems(nodeNames: string[]): Promise<void> {
    try {
      const templatesFolderId = await this.getNodeTemplatesFolderId();
      for (const nodeName of nodeNames) {
        const nodeId = await this.getNodeIdFromParent(nodeName, templatesFolderId);
        await this.deleteNodeById(nodeId);
      }
    } catch (error) {
      console.error('Admin Actions - cleanupNodeTemplatesItems failed : ', error);
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
      console.error('Admin Actions - cleanupSpaceTemplatesFolder failed : ', error);
    }
  }

  async getNodeTemplatesFolderId(): Promise<string> {
    try {
      return this.getNodeIdFromParent('Node Templates', await this.getDataDictionaryId());
    } catch (error) {
      console.error('Admin Actions - getNodeTemplatesFolderId failed : ', error);
      return '';
    }
  }

  async getSpaceTemplatesFolderId(): Promise<string> {
    try {
      return this.getNodeIdFromParent('Space Templates', await this.getDataDictionaryId());
    } catch (error) {
      console.error('Admin Actions - getSpaceTemplatesFolderId failed : ', error);
      return '';
    }
  }

  private async getDataDictionaryId(): Promise<string> {
    return this.getNodeIdFromParent('Data Dictionary', '-root-').catch((error) => {
      console.error('Admin Actions - getDataDictionaryId failed : ', error);
      return '';
    });
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
      return this.apiService.nodes.updateNode(nodeId, data);
    } catch (error) {
      console.error(`${this.constructor.name} ${this.setGranularPermission.name}`, error);
      return null;
    }
  }

  async removeUserAccessOnNodeTemplate(nodeName: string): Promise<NodeEntry> {
    try {
      const templatesRootFolderId = await this.getNodeTemplatesFolderId();
      const nodeId: string = await this.getNodeIdFromParent(nodeName, templatesRootFolderId);

      return this.setInheritPermissions(nodeId, false);
    } catch (error) {
      console.error('Admin Actions - removeUserAccessOnNodeTemplate failed : ', error);
      return null;
    }
  }

  async removeUserAccessOnSpaceTemplate(nodeName: string): Promise<NodeEntry> {
    try {
      const templatesRootFolderId = await this.getSpaceTemplatesFolderId();
      const nodeId: string = await this.getNodeIdFromParent(nodeName, templatesRootFolderId);

      return this.setInheritPermissions(nodeId, false);
    } catch (error) {
      console.error('Admin Actions - removeUserAccessOnSpaceTemplate failed : ', error);
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
      return this.apiService.nodes.updateNode(nodeId, data);
    } catch (error) {
      console.error(`${this.constructor.name} ${this.setInheritPermissions.name}`, error);
      return null;
    }
  }

  private async addAspects(nodeId: string, aspectNames: string[]): Promise<NodeEntry> {
    try {
      return this.apiService.nodes.updateNode(nodeId, { aspectNames });
    } catch (error) {
      console.error(`${this.constructor.name} ${this.addAspects.name}`, error);
      return null;
    }
  }

  async createFileLink(originalNodeId: string, destinationId: string): Promise<NodeEntry | null> {
    const name = (await this.getNodeById(originalNodeId)).entry.name;
    const nodeBody = {
      name: `Link to ${name}.url`,
      nodeType: 'app:filelink',
      properties: {
        'cm:destination': originalNodeId
      }
    };

    try {
      const link = await this.apiService.nodes.createNode(destinationId, nodeBody);
      await this.addAspects(originalNodeId, ['app:linked']);
      return link;
    } catch (error) {
      console.error(`${this.constructor.name} ${this.createFileLink.name}`, error);
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
      console.error(`${this.constructor.name} ${this.createFolderLink.name}`, error);
      return null;
    }
  }

  async createLinkToFileName(originalFileName: string, originalFileParentId: string, destinationParentId?: string): Promise<NodeEntry> {
    destinationParentId ??= originalFileParentId;

    try {
      const nodeId = await this.getNodeIdFromParent(originalFileName, originalFileParentId);

      return this.createFileLink(nodeId, destinationParentId);
    } catch (error) {
      console.error('Admin Actions - createLinkToFileName failed : ', error);
      return null;
    }
  }

  async createLinkToFolderName(originalFolderName: string, originalFolderParentId: string, destinationParentId?: string): Promise<NodeEntry> {
    destinationParentId ??= originalFolderParentId;

    try {
      const nodeId = await this.getNodeIdFromParent(originalFolderName, originalFolderParentId);
      return this.createFolderLink(nodeId, destinationParentId);
    } catch (error) {
      console.error('Admin Actions - createLinkToFolderName failed : ', error);
      return null;
    }
  }

  async getNodeProperty(nodeId: string, property: string): Promise<string> {
    try {
      const node = await this.getNodeById(nodeId);
      return node.entry.properties?.[property] || '';
    } catch (error) {
      console.error(`${this.constructor.name} ${this.getNodeProperty.name}`, error);
      return '';
    }
  }

  async isFileShared(nodeId: string): Promise<boolean> {
    try {
      const sharedId = await this.getNodeProperty(nodeId, 'qshare:sharedId');
      return sharedId !== '';
    } catch (error) {
      console.error(`${this.constructor.name} ${this.isFileShared.name}`, error);
      return null;
    }
  }

  private async getLockType(nodeId: string): Promise<string> {
    try {
      const lockType = await this.getNodeProperty(nodeId, 'cm:lockType');
      return lockType || '';
    } catch (error) {
      console.error(`${this.constructor.name} ${this.getLockType.name}`, error);
      return '';
    }
  }

  async isFileLockedWrite(nodeId: string): Promise<boolean> {
    try {
      return (await this.getLockType(nodeId)) === 'WRITE_LOCK';
    } catch (error) {
      console.error(`${this.constructor.name} ${this.isFileLockedWrite.name}`, error);
      return null;
    }
  }
}
