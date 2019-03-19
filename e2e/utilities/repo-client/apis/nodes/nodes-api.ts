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

export class NodesApi extends RepoApi {
    nodesApi = new AdfNodeApi(this.alfrescoJsApi);

    constructor(username?, password?) {
        super(username, password);
    }

    async getNodeByPath(relativePath: string = '/') {
        await this.apiAuth();
        return await this.nodesApi.getNode('-my-', { relativePath });
    }

    async getNodeById(id: string) {
        await this.apiAuth();
        return await this.nodesApi.getNode(id);
    }

    async getNodeDescription(name: string, parentId: string) {
      const children = (await this.getNodeChildren(parentId)).list.entries;
      return children.find(elem => elem.entry.name === name).entry.properties['cm:description'];
    }

    async getNodeProperty(nodeId: string, property: string) {
      const node = await this.getNodeById(nodeId);
      if (node.entry.properties) {
        return node.entry.properties[property];
      }
      return '';
    }

    async getFileVersionType(nodeId: string) {
      const prop = await this.getNodeProperty(nodeId, 'cm:versionType');
      if ( prop ) {
        return prop;
      }
      return '';
    }
    async getFileVersionLabel(nodeId: string) {
      const prop = await this.getNodeProperty(nodeId, 'cm:versionLabel');
      if ( prop ) {
        return prop;
      }
      return '';
    }


    async getSharedId(nodeId: string) {
      return await this.getNodeProperty(nodeId, 'qshare:sharedId');
    }

    async getSharedExpiryDate(nodeId: string) {
      return await this.getNodeProperty(nodeId, 'qshare:expiryDate');
    }

    async isFileShared(nodeId: string) {
      return (await this.getSharedId(nodeId)) !== '';
    }

    async deleteNodeById(id: string, permanent: boolean = true) {
        await this.apiAuth();
        try {
          return await this.nodesApi.deleteNode(id, { permanent });
        } catch (error) {
          console.log('------ deleteNodeById failed ');
        }
    }

    async deleteNodeByPath(path: string, permanent: boolean = true) {
        const id = (await this.getNodeByPath(path)).entry.id;
        return await this.deleteNodeById(id, permanent);
    }

    async deleteNodes(names: string[], relativePath: string = '', permanent: boolean = true) {
        return await names.reduce(async (previous, current) => {
            await previous;
            return await this.deleteNodeByPath(`${relativePath}/${current}`, permanent);
        }, Promise.resolve());
    }

    async deleteNodesById(ids: string[], permanent: boolean = true) {
        return await ids.reduce(async (previous, current) => {
            await previous;
            return await this.deleteNodeById(current, permanent);
        }, Promise.resolve());
    }

    async getNodeChildren(nodeId: string) {
        const opts = {
          include: [ 'properties' ]
        };
        await this.apiAuth();
        return await this.nodesApi.listNodeChildren(nodeId, opts);
    }

    async deleteNodeChildren(parentId: string) {
      const listEntries = (await this.getNodeChildren(parentId)).list.entries;
      const nodeIds = listEntries.map(entries => entries.entry.id);
      return await this.deleteNodesById(nodeIds);
    }

    async createImageNode(nodeType: string, name: string, parentId: string = '-my-', title: string = '', description: string = '') {
      const imageProps = {
        'exif:pixelXDimension': 1000,
        'exif:pixelYDimension': 1200
      };
      return await this.createNode('cm:content', name, parentId, title, description, imageProps);
    }

    async createNode(nodeType: string, name: string, parentId: string = '-my-', title: string = '', description: string = '', imageProps: any = null, majorVersion: boolean = true) {
        const nodeBody = {
            name,
            nodeType,
            properties: {
                'cm:title': title,
                'cm:description': description
            }
        };
        if (imageProps) {
          nodeBody.properties = Object.assign(nodeBody.properties, imageProps);
        }

        await this.apiAuth();
        return await this.nodesApi.createNode(parentId, nodeBody, { majorVersion: true });
    }

    async createFile(name: string, parentId: string = '-my-', title: string = '', description: string = '', majorVersion: boolean = true) {
        return await this.createNode('cm:content', name, parentId, title, description, majorVersion);
    }

    async createImage(name: string, parentId: string = '-my-', title: string = '', description: string = '') {
        return await this.createImageNode('cm:content', name, parentId, title, description);
    }

    async createFolder(name: string, parentId: string = '-my-', title: string = '', description: string = '') {
        return await this.createNode('cm:folder', name, parentId, title, description);
    }

    async createChildren(data: NodeBodyCreate[]): Promise<any> {
        await this.apiAuth();
        return await this.nodesApi.createNode('-my-', <any>data);
    }

    async createContent(content: NodeContentTree, relativePath: string = '/') {
        return await this.createChildren(flattenNodeContentTree(content, relativePath));
    }

    async createFolders(names: string[], relativePath: string = '/') {
        return await this.createContent({ folders: names }, relativePath);
    }

    async createFiles(names: string[], relativePath: string = '/') {
        return await this.createContent({ files: names }, relativePath);
    }

    // node content
    async getNodeContent(nodeId: string) {
        await this.apiAuth();
        return await this.nodesApi.getNodeContent(nodeId);
    }

    async editNodeContent(nodeId: string, content: string) {
        await this.apiAuth();
        return await this.nodesApi.updateNodeContent(nodeId, content);
    }

    async renameNode(nodeId: string, newName: string) {
        await this.apiAuth();
        return this.nodesApi.updateNode(nodeId, { name: newName });
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

        await this.apiAuth();
        return await this.nodesApi.updateNode(nodeId, data);
    }

    async getNodePermissions(nodeId: string) {
        await this.apiAuth();
        return await this.nodesApi.getNode(nodeId, { include: ['permissions'] });
    }

    // lock node
    async lockFile(nodeId: string, lockType: string = 'ALLOW_OWNER_CHANGES') {
        const data = <NodeBodyLock>{
            type: lockType
        };

        await this.apiAuth();
        return await this.nodesApi.lockNode(nodeId, data );
    }

    async unlockFile(nodeId: string) {
        await this.apiAuth();
        return await this.nodesApi.unlockNode(nodeId);
    }

    async getLockType(nodeId: string) {
      return await this.getNodeProperty(nodeId, 'cm:lockType');
    }

    async getLockOwner(nodeId: string) {
      return await this.getNodeProperty(nodeId, 'cm:lockOwner');
    }

    async isFileLockedWrite(nodeId: string) {
        await this.apiAuth();
        return (await this.getLockType(nodeId)) === 'WRITE_LOCK';
    }
}
