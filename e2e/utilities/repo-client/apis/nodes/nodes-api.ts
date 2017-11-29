/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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

    getNodeDescription(name: string): Promise<string> {
        return this.getNodeByPath(name)
            .then(response => response.data.entry.properties['cm:description'])
            .catch(() => Promise.resolve(''));
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

    createChildren(data: NodeBodyCreate[]): Promise<any> {
        return this
            .post(`/nodes/-my-/children`, { data })
            .catch(this.handleError);
    }

    createContent(content: NodeContentTree, relativePath: string = '/'): Promise<any> {
        return this.createChildren(flattenNodeContentTree(content, relativePath));
    }

    createNodeWithProperties(name: string, title?: string, description?: string, relativePath: string = '/'): Promise<any> {
        return this.createContent({ name, title, description }, relativePath);
    }

    createFolders(names: string[], relativePath: string = '/'): Promise<any> {
        return this.createContent({ folders: names }, relativePath);
    }

    createFiles(names: string[], relativePath: string = '/'): Promise<any> {
        return this.createContent({ files: names }, relativePath);
    }
}
