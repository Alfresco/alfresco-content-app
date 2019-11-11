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
import { NodeBodyCreate } from './node-body-create';
import { NodeContentTree, flattenNodeContentTree } from './node-content-tree';
import { NodesApi as AdfNodeApi, NodeBodyLock, NodeEntry, NodeChildAssociationPaging } from '@alfresco/js-api';
import { Utils } from '../../../../utilities/utils';

export class NodesApi extends RepoApi {
  nodesApi = new AdfNodeApi(this.alfrescoJsApi);

  constructor(username?, password?) {
    super(username, password);
  }

  async getNodeByPath(relativePath: string = '/'): Promise<NodeEntry> {
    try {
      await this.apiAuth();
      return await this.nodesApi.getNode('-my-', { relativePath });
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getNodeByPath.name}`, error);
      return null;
    }
  }

  async getNodeById(id: string): Promise<NodeEntry> {
    try {
      await this.apiAuth();
      const node = await this.nodesApi.getNode(id);
      return node;
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getNodeById.name}`, error);
      return null;
    }
  }

  async getNodeIdFromParent(name: string, parentId: string): Promise<string> {
    try {
      const children = (await this.getNodeChildren(parentId)).list.entries;
      return children.find(elem => elem.entry.name === name).entry.id || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getNodeIdFromParent.name}`, error);
      return '';
    }
  }

  async getNodeDescription(name: string, parentId: string): Promise<string> {
    try {
      const children = (await this.getNodeChildren(parentId)).list.entries;
      return children.find(elem => elem.entry.name === name).entry.properties['cm:description'] || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getNodeDescription.name}`, error);
      return '';
    }
  }

  async getNodeProperty(nodeId: string, property: string): Promise<any> {
    try {
      const node = await this.getNodeById(nodeId);
      return (node.entry.properties && node.entry.properties[property]) || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getNodeProperty.name}`, error);
      return '';
    }
  }

  async getFileVersionType(nodeId: string): Promise<string> {
    try {
      const prop = await this.getNodeProperty(nodeId, 'cm:versionType');
      return prop || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getFileVersionType.name}`, error);
      return '';
    }
  }

  async getFileVersionLabel(nodeId: string): Promise<string> {
    try {
      const prop = await this.getNodeProperty(nodeId, 'cm:versionLabel');
      return prop || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getFileVersionLabel.name}`, error);
      return '';
    }
  }

  async getSharedId(nodeId: string): Promise<string> {
    try {
      const sharedId = await this.getNodeProperty(nodeId, 'qshare:sharedId');
      return sharedId || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getSharedId.name}`, error);
      return '';
    }
  }

  async getSharedExpiryDate(nodeId: string): Promise<string> {
    try {
      const expiryDate = await this.getNodeProperty(nodeId, 'qshare:expiryDate');
      return expiryDate || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getSharedExpiryDate.name}`, error);
      return '';
    }
  }

  async isFileShared(nodeId: string): Promise<boolean> {
    try {
      const sharedId = await this.getSharedId(nodeId);
      return sharedId !== '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.isFileShared.name}`, error);
      return null;
    }
  }

  async deleteNodeById(id: string, permanent: boolean = true): Promise<void> {
    try {
      await this.apiAuth();
      await this.nodesApi.deleteNode(id, { permanent });
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.deleteNodeById.name}`, error);
    }
  }

  async deleteNodeByPath(path: string, permanent: boolean = true): Promise<void> {
    try {
      const id = (await this.getNodeByPath(path)).entry.id;
      await this.deleteNodeById(id, permanent);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.deleteNodeByPath.name}`, error);
    }
  }

  async deleteNodes(names: string[], relativePath: string = '', permanent: boolean = true): Promise<void> {
    try {
      await names.reduce(async (previous, current) => {
        await previous;
        const req = await this.deleteNodeByPath(`${relativePath}/${current}`, permanent);
        return req;
      }, Promise.resolve());
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.deleteNodes.name}`, error);
    }
  }

  async deleteNodesById(ids: string[], permanent: boolean = true): Promise<void> {
    try {
      await ids.reduce(async (previous, current) => {
        await previous;
        const req = await this.deleteNodeById(current, permanent);
        return req;
      }, Promise.resolve());
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.deleteNodesById.name}`, error);
    }
  }

  async getNodeChildren(nodeId: string): Promise<NodeChildAssociationPaging> {
    try {
      const opts = {
        include: [ 'properties' ]
      };
      await this.apiAuth();
      return await this.nodesApi.listNodeChildren(nodeId, opts);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getNodeChildren.name}`, error);
      return null;
    }
  }

  async deleteNodeChildren(parentId: string): Promise<void> {
    try {
      const listEntries = (await this.getNodeChildren(parentId)).list.entries;
      const nodeIds = listEntries.map(entries => entries.entry.id);
      await this.deleteNodesById(nodeIds);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.deleteNodeChildren.name}`, error);
    }
  }

  async createImageNode(name: string, parentId: string = '-my-', title: string = '', description: string = ''): Promise<any> {
    const imageProps = {
      'exif:pixelXDimension': 1000,
      'exif:pixelYDimension': 1200
    };
    try {
      return await this.createNode('cm:content', name, parentId, title, description, imageProps);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createImageNode.name}`, error);
    }
  }

  async createNode(nodeType: string, name: string, parentId: string = '-my-', title: string = '', description: string = '', imageProps: any = null, author: string = '', majorVersion: boolean = true): Promise<any> {
    const nodeBody = {
        name,
        nodeType,
        properties: {
            'cm:title': title,
            'cm:description': description,
            'cm:author': author
        },
        aspectNames: ['cm:versionable'] // workaround for REPO-4772
    };
    if (imageProps) {
      nodeBody.properties = Object.assign(nodeBody.properties, imageProps);
    }

    try {
      await this.apiAuth();
      return await this.nodesApi.createNode(parentId, nodeBody, { majorVersion });
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createNode.name}`, error);
    }
  }

  async createFile(name: string, parentId: string = '-my-', title: string = '', description: string = '', author: string = '', majorVersion: boolean = true): Promise<any> {
    try {
      return await this.createNode('cm:content', name, parentId, title, description, null, author, majorVersion);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createFile.name}`, error);
    }
  }

  async createImage(name: string, parentId: string = '-my-', title: string = '', description: string = ''): Promise<any> {
    try {
      return await this.createImageNode(name, parentId, title, description);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createImage.name}`, error);
    }
  }

  async createFolder(name: string, parentId: string = '-my-', title: string = '', description: string = '', author: string = ''): Promise<any> {
    try {
      return await this.createNode('cm:folder', name, parentId, title, description, null, author);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createFolder.name}`, error);
    }
  }

  async createChildren(data: NodeBodyCreate[]): Promise<any> {
    try {
      await this.apiAuth();
      return await this.nodesApi.createNode('-my-', <any>data);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createChildren.name}`, error);
    }
  }

  async createContent(content: NodeContentTree, relativePath: string = '/'): Promise<any> {
    try {
      return await this.createChildren(flattenNodeContentTree(content, relativePath));
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createContent.name}`, error);
    }
  }

  async createFolders(names: string[], relativePath: string = '/'): Promise<any> {
    try {
      return await this.createContent({ folders: names }, relativePath);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createFolders.name}`, error);
    }
  }

  async createFiles(names: string[], relativePath: string = '/'): Promise<any> {
    try {
      return await this.createContent({ files: names }, relativePath);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createFiles.name}`, error);
    }
  }

  // node content
  async getNodeContent(nodeId: string): Promise<any> {
    try {
      await this.apiAuth();
      return await this.nodesApi.getNodeContent(nodeId);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getNodeContent.name}`, error);
    }
  }

  async editNodeContent(nodeId: string, content: string): Promise<NodeEntry|null> {
    try {
      await this.apiAuth();
      return await this.nodesApi.updateNodeContent(nodeId, content);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.editNodeContent.name}`, error);
      return null;
    }
  }

  async renameNode(nodeId: string, newName: string): Promise<NodeEntry|null> {
    try {
      await this.apiAuth();
      return this.nodesApi.updateNode(nodeId, { name: newName });
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.renameNode.name}`, error);
      return null;
    }
  }

  // node permissions
  async setGranularPermission(nodeId: string, inheritPermissions: boolean = false, username: string, role: string): Promise<NodeEntry|null> {
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
      await this.apiAuth();
      return await this.nodesApi.updateNode(nodeId, data);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.setGranularPermission.name}`, error);
      return null;
    }
  }

  // lock node
  async lockFile(nodeId: string, lockType: string = 'ALLOW_OWNER_CHANGES'): Promise<NodeEntry|null> {
    const data = <NodeBodyLock>{
        type: lockType
    };

    try {
      await this.apiAuth();
      return await this.nodesApi.lockNode(nodeId, data );
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.lockFile.name}`, error);
      return null;
    }
  }

  async unlockFile(nodeId: string): Promise<NodeEntry|null> {
    try {
      await this.apiAuth();
      return await this.nodesApi.unlockNode(nodeId);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.unlockFile.name}`, error);
      return null;
    }
  }

  async getLockType(nodeId: string): Promise<any> {
    try {
      const lockType = await this.getNodeProperty(nodeId, 'cm:lockType');
      return lockType || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getLockType.name}`, error);
      return '';
    }
  }

  async getLockOwner(nodeId: string): Promise<any> {
    try {
      const lockOwner = await this.getNodeProperty(nodeId, 'cm:lockOwner');
      return lockOwner || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getLockOwner.name}`, error);
      return '';
    }
  }

  async isFileLockedWrite(nodeId: string): Promise<boolean> {
    try {
      return (await this.getLockType(nodeId)) === 'WRITE_LOCK';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.isFileLockedWrite.name}`, error);
      return null;
    }
  }

  async isFileLockedWriteWithRetry(nodeId: string, expect: boolean): Promise<boolean> {
    const data = {
      expect: expect,
      retry: 5
    };
    let isLocked: boolean;
    try {
      const locked = async () => {
        isLocked = (await this.getLockType(nodeId)) === 'WRITE_LOCK';
        if ( isLocked !== data.expect ) {
          return Promise.reject(isLocked);
        } else {
          return Promise.resolve(isLocked);
        }
      }
      return await Utils.retryCall(locked, data.retry);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.isFileLockedWriteWithRetry.name}`, error);
    }
    return isLocked;
  }

  async isFileLockedByName(fileName: string, parentId: string): Promise<boolean> {
    try {
      const id = await this.getNodeIdFromParent(fileName, parentId);
      return await this.isFileLockedWrite(id);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.isFileLockedByName.name}`, error);
      return null;
    }
  }
}
