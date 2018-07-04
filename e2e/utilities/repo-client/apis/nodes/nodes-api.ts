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

import { RepoApi } from '../repo-api';
import { NodeBodyCreate, NODE_TYPE_FILE, NODE_TYPE_FOLDER } from './node-body-create';
import { NodeContentTree, flattenNodeContentTree } from './node-content-tree';

export class NodesApi extends RepoApi {
    // nodes
    getNodeByPath(relativePath: string = '/'): Promise<any> {
        return this
            .get(`/nodes/-my-`, { parameters: { relativePath } })
            .catch(this.handleError);
    }

    getNodeById(id: string): Promise<any> {
        return this
            .get(`/nodes/${id}`)
            .catch(this.handleError);
    }

    getNodeDescription(name: string, relativePath: string = '/') {
        relativePath = (relativePath === '/')
            ? `${name}`
            : `${relativePath}/${name}`;

        return this.getNodeByPath(`${relativePath}`)
            .then(response => response.data.entry.properties['cm:description']);
    }

    deleteNodeById(id: string, permanent: boolean = true): Promise<any> {
        return this
            .delete(`/nodes/${id}?permanent=${permanent}`)
            .catch(this.handleError);
    }

    deleteNodeByPath(path: string, permanent: boolean = true): Promise<any> {
        return this
            .getNodeByPath(path)
            .then((response: any): string => response.data.entry.id)
            .then((id: string): any => this.deleteNodeById(id, permanent))
            .catch(this.handleError);
    }

    deleteNodes(names: string[], relativePath: string = '', permanent: boolean = true): Promise<any[]> {
        return names.reduce((previous, current) => (
            previous.then(() => this.deleteNodeByPath(`${relativePath}/${current}`, permanent))
        ), Promise.resolve());
    }

    deleteNodesById(ids: string[], permanent: boolean = true): Promise<any[]> {
        return ids.reduce((previous, current) => (
            previous.then(() => this.deleteNodeById(current, permanent))
        ), Promise.resolve());
    }

    // children
    getNodeChildren(nodeId: string): Promise<any> {
        return this
            .get(`/nodes/${nodeId}/children`)
            .catch(this.handleError);
    }

    createNode(nodeType: string, name: string, parentId: string = '-my-', title: string = '', description: string = ''): Promise<any> {
        const data = {
            name: name,
            nodeType: nodeType,
            properties: {
                'cm:title': title, 'cm:description': description
            }
        };

        return this
            .post(`/nodes/${parentId}/children`, { data })
            .catch(this.handleError);
    }

    createFile(name: string, parentId: string = '-my-', title: string = '', description: string = ''): Promise<any> {
        return this.createNode('cm:content', name, parentId, title, description);
    }

    createFolder(name: string, parentId: string = '-my-', title: string = '', description: string = ''): Promise<any> {
        return this.createNode('cm:folder', name, parentId, title, description);
    }

    createChildren(data: NodeBodyCreate[]): Promise<any> {
        return this
            .post(`/nodes/-my-/children`, { data })
            .catch(this.handleError);
    }

    createContent(content: NodeContentTree, relativePath: string = '/'): Promise<any> {
        return this.createChildren(flattenNodeContentTree(content, relativePath));
    }

    createFolders(names: string[], relativePath: string = '/'): Promise<any> {
        return this.createContent({ folders: names }, relativePath);
    }

    createFiles(names: string[], relativePath: string = '/'): Promise<any> {
        return this.createContent({ files: names }, relativePath);
    }

    // node content
    getNodeContent(nodeId: string): Promise<any> {
        return this
            .get(`/nodes/${nodeId}/content`)
            .catch(this.handleError);
    }

    editNodeContent(nodeId: string, content: string): Promise<any> {
        return this
            .put(`/nodes/${nodeId}/content`, { data: content })
            .catch(this.handleError);
    }

    renameNode(nodeId: string, newName: string): Promise<any> {
        return this
            .put(`/nodes/${nodeId}`, { data: { name: newName } })
            .catch(this.handleError);
    }

    // node permissions
    setGranularPermission(nodeId: string, inheritPermissions: boolean = false, username: string, role: string): Promise<any> {
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

        return this
            .put(`/nodes/${nodeId}`, { data })
            .catch(this.handleError);
    }

    getNodePermissions(nodeId: string): Promise<any> {
        return this
            .get(`/nodes/${nodeId}?include=permissions`)
            .catch(this.handleError);
    }

    // lock node
    lockFile(nodeId: string, lockType: string = 'FULL') {
        return this
            .post(`/nodes/${nodeId}/lock?include=isLocked`, { data: { 'type': lockType } })
            .catch(this.handleError);
    }

    unlockFile(nodeId: string) {
        return this
            .post(`/nodes/${nodeId}/unlock`)
            .catch(this.handleError);
    }
}
