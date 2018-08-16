/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { NodeBodyLock } from 'alfresco-js-api-node';
import { RepoApi } from '../repo-api';
import { NodeBodyCreate } from './node-body-create';
import { NodeContentTree, flattenNodeContentTree } from './node-content-tree';

export class NodesApi extends RepoApi {

    constructor(username?, password?) {
        super(username, password);
    }

    // nodes

    async getNodeByPath(relativePath: string = '/') {
        await this.apiAuth();
        return await this.alfrescoJsApi.core.nodesApi.getNode('-my-', { relativePath });
    }

    async getNodeById(id: string) {
        await this.apiAuth();
        return await this.alfrescoJsApi.core.nodesApi.getNode(id);
    }

    async getNodeDescription(name: string, relativePath: string = '/') {
        relativePath = (relativePath === '/')
            ? `${name}`
            : `${relativePath}/${name}`;

        return (await this.getNodeByPath(`${relativePath}`)).entry.properties['cm:description'];
    }

    async deleteNodeById(id: string, permanent: boolean = true) {
        await this.apiAuth();
        return await this.alfrescoJsApi.core.nodesApi.deleteNode(id, { permanent });
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

    // children

    async getNodeChildren(nodeId: string) {
        await this.apiAuth();
        return await this.alfrescoJsApi.core.nodesApi.getNodeChildren(nodeId);
    }

    async createNode(nodeType: string, name: string, parentId: string = '-my-', title: string = '', description: string = '') {
        const nodeBody = {
            name,
            nodeType,
            properties: {
                'cm:title': title,
                'cm:description': description
            }
        };

        await this.apiAuth();
        return await this.alfrescoJsApi.core.nodesApi.addNode(parentId, nodeBody);
    }

    async createFile(name: string, parentId: string = '-my-', title: string = '', description: string = '') {
        return await this.createNode('cm:content', name, parentId, title, description);
    }

    async createFolder(name: string, parentId: string = '-my-', title: string = '', description: string = '') {
        return await this.createNode('cm:folder', name, parentId, title, description);
    }

    async createChildren(data: NodeBodyCreate[]): Promise<any> {
        await this.apiAuth();
        return await this.alfrescoJsApi.core.nodesApi.addNode('-my-', data);
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
        return await this.alfrescoJsApi.core.nodesApi.getNodeContent(nodeId);
    }

    async editNodeContent(nodeId: string, content: string) {
        await this.apiAuth();
        return await this.alfrescoJsApi.core.nodesApi.updateNodeContent(nodeId, content);
    }

    async renameNode(nodeId: string, newName: string) {
        await this.apiAuth();
        return this.alfrescoJsApi.core.nodesApi.updateNode(nodeId, { name: newName });
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
        return await this.alfrescoJsApi.core.nodesApi.updateNode(nodeId, data);
    }

    async getNodePermissions(nodeId: string) {
        await this.apiAuth();
        return await this.alfrescoJsApi.core.nodesApi.getNode(nodeId, { include: ['permissions'] });
    }

    // lock node
    async lockFile(nodeId: string, lockType: string = 'FULL') {
        const data = <NodeBodyLock>{
            type: lockType
        };
        await this.apiAuth();
        return await this.alfrescoJsApi.core.nodesApi.lockNode(nodeId, data );
    }

    async unlockFile(nodeId: string) {
        await this.apiAuth();
        return await this.alfrescoJsApi.core.nodesApi.unlockNode(nodeId);
    }
}
