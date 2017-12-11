/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2017 Alfresco Software Limited
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

import { promise } from 'protractor';
import { RepoApi } from '../repo-api';
import { NodesApi } from '../nodes/nodes-api';
import { RepoClient } from './../../repo-client';

export class FavoritesApi extends RepoApi {

    addFavorite(api: RepoClient, nodeType: string, name: string): Promise<any> {
        return api.nodes.getNodeByPath(name)
            .then((response) => {
                const { id } = response.data.entry;
                return ([{
                    target: {
                        [nodeType]: {
                            guid: id
                        }
                    }
                }]);
            })
            .then((data) => {
                return this.post(`/people/-me-/favorites`, { data });
            })
            .catch(this.handleError);
    }

    addFavoriteById(nodeType: string, id: string): Promise<any> {
        const data = [{
            target: {
                [nodeType]: {
                    guid: id
                }
            }
        }];
        return this.post(`/people/-me-/favorites`, { data })
            .catch(this.handleError);
    }

    addFavoritesByIds(nodeType: string, ids: string[]): Promise<any[]> {
        return ids.reduce((previous, current) => (
            previous.then(() => this.addFavoriteById(nodeType, current))
        ), Promise.resolve());
    }

    getFavorite(api: RepoClient, name: string): Promise<any> {
        return api.nodes.getNodeByPath(name)
            .then((response) => {
                const { id } = response.data.entry;
                return this.get(`/people/-me-/favorites/${id}`);
            })
            .catch((response) => Promise.resolve(response));
    }

    removeFavorite(api: RepoClient, nodeType: string, name: string): Promise<any> {
        return api.nodes.getNodeByPath(name)
            .then((response) => {
                const { id } = response.data.entry;
                return this.delete(`/people/-me-/favorites/${id}`);
            })
            .catch(this.handleError);
    }
}
