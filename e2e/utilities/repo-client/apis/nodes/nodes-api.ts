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
import { NodesApi as AdfNodeApi, NodeBodyLock} from '@alfresco/js-api';
import { Utils } from '../../../../utilities/utils';

export class NodesApi extends RepoApi {
  nodesApi = new AdfNodeApi(this.alfrescoJsApi);

  constructor(username?, password?) {
    super(username, password);
  }

  async getNodeByPath(relativePath: string = '/') {
    try {
      await this.apiAuth();
      return await this.nodesApi.getNode('-my-', { relativePath });
    } catch (error) {
      console.log('--- nodes api getNodeByPath catch error: ', error);
      return null;
    }
  }

  async getNodeById(id: string) {
    try {
      await this.apiAuth();
      return await this.nodesApi.getNode(id);
    } catch (error) {
      console.log('--- nodes api getNodeById catch error: ', error);
      return null;
    }
  }

  async getNodeIdFromParent(name: string, parentId: string) {
    try {
      const children = (await this.getNodeChildren(parentId)).list.entries;
      return children.find(elem => elem.entry.name === name).entry.id;
    } catch (error) {
      console.log('--- nodes api getNodeIdFromParent catch error: ', error);
      return null;
    }
  }

  async getNodeDescription(name: string, parentId: string) {
    try {
      const children = (await this.getNodeChildren(parentId)).list.entries;
      return children.find(elem => elem.entry.name === name).entry.properties['cm:description'];
    } catch (error) {
      console.log('--- nodes api getNodeDescription catch error: ', error);
      return '';
    }
  }

  async getNodeProperty(nodeId: string, property: string) {
    try {
      const node = await this.getNodeById(nodeId);
      if (node.entry.properties) {
        return node.entry.properties[property];
      }
    } catch (error) {
      console.log('--- nodes api getNodeProperty catch error: ', error);
      return '';
    }
  }

  async getFileVersionType(nodeId: string) {
    try {
      const prop = await this.getNodeProperty(nodeId, 'cm:versionType');
      if ( prop ) {
        return prop;
      }
    } catch (error) {
      console.log('--- nodes api getFileVersionType catch error: ', error);
      return '';
    }
  }

  async getFileVersionLabel(nodeId: string) {
    try {
      const prop = await this.getNodeProperty(nodeId, 'cm:versionLabel');
      if ( prop ) {
        return prop;
      }
    } catch (error) {
      console.log('--- nodes api getFileVersionLabel catch error: ', error);
      return '';
    }
  }

  async getSharedId(nodeId: string) {
    try {
      return await this.getNodeProperty(nodeId, 'qshare:sharedId');
    } catch (error) {
      console.log('--- nodes api getSharedId catch error: ', error);
    }
  }

  async getSharedExpiryDate(nodeId: string) {
    try {
      return await this.getNodeProperty(nodeId, 'qshare:expiryDate');
    } catch (error) {
      console.log('--- nodes api getSharedExpiryDate catch error: ', error);
    }
  }

  async isFileShared(nodeId: string) {
    try {
      return (await this.getSharedId(nodeId)) !== '';
    } catch (error) {
      console.log('--- nodes api isFileShared catch error: ', error);
      return null;
    }
  }

  async deleteNodeById(id: string, permanent: boolean = true) {
    try {
      await this.apiAuth();
      return await this.nodesApi.deleteNode(id, { permanent });
    } catch (error) {
      console.log('--- nodes api deleteNodeById catch error: ', error);
    }
  }

  async deleteNodeByPath(path: string, permanent: boolean = true) {
    try {
      const id = (await this.getNodeByPath(path)).entry.id;
      return await this.deleteNodeById(id, permanent);
    } catch (error) {
      console.log('--- nodes api deleteNodeByPath catch error: ', error);
    }
  }

  async deleteNodes(names: string[], relativePath: string = '', permanent: boolean = true) {
    try {
      return await names.reduce(async (previous, current) => {
        await previous;
        const req = await this.deleteNodeByPath(`${relativePath}/${current}`, permanent);
        return req;
      }, Promise.resolve());
    } catch (error) {
      console.log('--- nodes api deleteNodes catch error: ', error);
    }
  }

  async deleteNodesById(ids: string[], permanent: boolean = true) {
    try {
      return await ids.reduce(async (previous, current) => {
        await previous;
        const req = await this.deleteNodeById(current, permanent);
        return req;
      }, Promise.resolve());
    } catch (error) {
      console.log('--- nodes api deleteNodesById catch error: ', error);
    }
  }

  async getNodeChildren(nodeId: string) {
    try {
      const opts = {
        include: [ 'properties' ]
      };
      await this.apiAuth();
      return await this.nodesApi.listNodeChildren(nodeId, opts);
    } catch (error) {
      console.log('--- nodes api getNodeChildren catch error: ', error);
      return null;
    }
  }

  async deleteNodeChildren(parentId: string) {
    try {
      const listEntries = (await this.getNodeChildren(parentId)).list.entries;
      const nodeIds = listEntries.map(entries => entries.entry.id);
      return await this.deleteNodesById(nodeIds);
    } catch (error) {
      console.log('--- nodes api deleteNodeChildren catch error: ', error);
    }
  }

  async createImageNode(name: string, parentId: string = '-my-', title: string = '', description: string = '') {
    const imageProps = {
      'exif:pixelXDimension': 1000,
      'exif:pixelYDimension': 1200
    };
    try {
      return await this.createNode('cm:content', name, parentId, title, description, imageProps);
    } catch (error) {
      console.log('--- nodes api createImageNode catch error: ', error);
    }
  }

  async createNode(nodeType: string, name: string, parentId: string = '-my-', title: string = '', description: string = '', imageProps: any = null, author: string = '', majorVersion: boolean = true) {
    const nodeBody = {
        name,
        nodeType,
        properties: {
            'cm:title': title,
            'cm:description': description,
            'cm:author': author
        }
    };
    if (imageProps) {
      nodeBody.properties = Object.assign(nodeBody.properties, imageProps);
    }

    try {
      await this.apiAuth();
      return await this.nodesApi.createNode(parentId, nodeBody, { majorVersion });
    } catch (error) {
      console.log('--- nodes api createNode catch error: ', error);
    }
  }

  async createFile(name: string, parentId: string = '-my-', title: string = '', description: string = '', author: string = '', majorVersion: boolean = true) {
    try {
      return await this.createNode('cm:content', name, parentId, title, description, null, author, majorVersion);
    } catch (error) {
      console.log('--- nodes api createFile catch error: ', error);
    }
  }

  async createImage(name: string, parentId: string = '-my-', title: string = '', description: string = '') {
    try {
      return await this.createImageNode(name, parentId, title, description);
    } catch (error) {
      console.log('--- nodes api createImage catch error: ', error);
    }
  }

  async createFolder(name: string, parentId: string = '-my-', title: string = '', description: string = '', author: string = '') {
    try {
      return await this.createNode('cm:folder', name, parentId, title, description, null, author);
    } catch (error) {
      console.log('--- nodes api createFolder catch error: ', error);
    }
  }

  async createChildren(data: NodeBodyCreate[]) {
    try {
      await this.apiAuth();
      return await this.nodesApi.createNode('-my-', <any>data);
    } catch (error) {
      console.log('--- nodes api createChildren catch error: ', error);
    }
  }

  async createContent(content: NodeContentTree, relativePath: string = '/') {
    try {
      return await this.createChildren(flattenNodeContentTree(content, relativePath));
    } catch (error) {
      console.log('--- nodes api createContent catch error: ', error);
    }
  }

  async createFolders(names: string[], relativePath: string = '/') {
    try {
      return await this.createContent({ folders: names }, relativePath);
    } catch (error) {
      console.log('--- nodes api createFolders catch error: ', error);
    }
  }

  async createFiles(names: string[], relativePath: string = '/') {
    try {
      return await this.createContent({ files: names }, relativePath);
    } catch (error) {
      console.log('--- nodes api createFiles catch error: ', error);
    }
  }

  // node content
  async getNodeContent(nodeId: string) {
    try {
      await this.apiAuth();
      return await this.nodesApi.getNodeContent(nodeId);
    } catch (error) {
      console.log('--- nodes api getNodeContent catch error: ', error);
    }
  }

  async editNodeContent(nodeId: string, content: string) {
    try {
      await this.apiAuth();
      return await this.nodesApi.updateNodeContent(nodeId, content);
    } catch (error) {
      console.log('--- nodes api editNodeContent catch error: ', error);
      return null;
    }
  }

  async renameNode(nodeId: string, newName: string) {
    try {
      await this.apiAuth();
      return this.nodesApi.updateNode(nodeId, { name: newName });
    } catch (error) {
      console.log('--- nodes api renameNode catch error: ', error);
      return null;
    }
  }

  // node permissions
  async setGranularPermission(nodeId: string, inheritPermissions: boolean = false, username: string, role: string) {
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
      console.log('--- nodes api setGranularPermission catch error: ', error);
      return null;
    }
  }

  async getNodePermissions(nodeId: string) {
    try {
      await this.apiAuth();
      return await this.nodesApi.getNode(nodeId, { include: ['permissions'] });
    } catch (error) {
      console.log('--- nodes api getNodePermissions catch error: ', error);
      return null;
    }
  }

  // lock node
  async lockFile(nodeId: string, lockType: string = 'ALLOW_OWNER_CHANGES') {
    const data = <NodeBodyLock>{
        type: lockType
    };

    try {
      await this.apiAuth();
      return await this.nodesApi.lockNode(nodeId, data );
    } catch (error) {
      console.log('--- nodes api lockFile catch error: ', error);
      return null;
    }
  }

  async unlockFile(nodeId: string) {
    try {
      await this.apiAuth();
      return await this.nodesApi.unlockNode(nodeId);
    } catch (error) {
      console.log('--- nodes api unlockFile catch error: ', error);
      return null;
    }
  }

  async getLockType(nodeId: string) {
    try {
      return await this.getNodeProperty(nodeId, 'cm:lockType');
    } catch (error) {
      console.log('--- nodes api getLockType catch error: ', error);
    }
  }

  async getLockOwner(nodeId: string) {
    try {
      return await this.getNodeProperty(nodeId, 'cm:lockOwner');
    } catch (error) {
      console.log('--- nodes api getLockOwner catch error: ', error);
    }
  }

  async isFileLockedWrite(nodeId: string) {
    try {
      return (await this.getLockType(nodeId)) === 'WRITE_LOCK';
    } catch (error) {
      console.log('--- nodes api isFileLockedWrite catch error: ', error);
      return null;
    }
  }

  async isFileLockedWriteWithRetry(nodeId: string, expect: boolean) {
    const data = {
      expect: expect,
      retry: 5
    };
    let isLocked;
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
      console.log('--- nodes api isFileLockedWriteWithRetry catch error: ', error);
    }
    return isLocked;
  }

  async isFileLockedByName(fileName: string, parentId: string) {
    try {
      const id = await this.getNodeIdFromParent(fileName, parentId);
      return await this.isFileLockedWrite(id);
    } catch (error) {
      console.log('--- nodes api isFileLockedByName catch error: ', error);
      return null;
    }
  }
}
