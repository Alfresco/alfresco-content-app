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

import { promise } from 'protractor';
import { RepoApi } from '../repo-api';
import { NodesApi } from '../nodes/nodes-api';
import { RepoClient } from './../../repo-client';

export class FavoritesApi extends RepoApi {

    addFavorite(api: RepoClient, nodeType: string, name: string): Promise<any> {
        let data = [];

        return api.nodes.getNodeByPath(name)
            .then((response: any): string => {
                return response.data.entry.id;
            })
            .then((id: string) => {
                data = data.concat([{
                    target: {
                        [nodeType]: {
                            guid: id
                        }
                    }
                }]);
            })
            .then(() => {
                return this.post(`/people/-me-/favorites`, { data });
            })
            .catch(this.handleError);
    }

    getFavorite(api: RepoClient, name: string): Promise<any> {
        return api.nodes.getNodeByPath(name)
            .then((resp: any) => {
                const { id } = resp.data.entry;
                return this.get(`/people/-me-/favorites/${id}`);
            })
            .catch((response) => Promise.resolve(response));
    }

    removeFavorite(api: RepoClient, nodeType: string, name: string): Promise<any> {
        return api.nodes.getNodeByPath(name)
            .then((response: any): string => {
                return response.data.entry.id;
            })
            .then((id: string) => {
                return this.delete(`/people/-me-/favorites/${id}`);
            })
            .catch(this.handleError);
    }
}
