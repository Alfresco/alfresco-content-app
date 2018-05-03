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

import { promise } from 'protractor';
import { RepoApi } from '../repo-api';
import { NodesApi } from '../nodes/nodes-api';
import { RepoClient } from './../../repo-client';
import { Utils } from '../../../../utilities/utils';

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

    addFavoriteById(nodeType: 'file' | 'folder', id: string): Promise<any> {
        const data = [{
            target: {
                [nodeType]: {
                    guid: id
                }
            }
        }];
        return this
            .post(`/people/-me-/favorites`, { data })
            .catch(this.handleError);
    }

    addFavoritesByIds(nodeType: 'file' | 'folder', ids: string[]): Promise<any[]> {
        return ids.reduce((previous, current) => (
            previous.then(() => this.addFavoriteById(nodeType, current))
        ), Promise.resolve());
    }

    getFavorites(): Promise<any> {
        return this
            .get('/people/-me-/favorites')
            .catch(this.handleError);
    }

    getFavoriteById(nodeId: string): Promise<any> {
        return this
            .get(`/people/-me-/favorites/${nodeId}`)
            .catch(this.handleError);
    }

    isFavorite(nodeId: string) {
        return this.getFavorites()
            .then(resp => JSON.stringify(resp.data.list.entries).includes(nodeId));
    }

    removeFavorite(api: RepoClient, nodeType: string, name: string): Promise<any> {
        return api.nodes.getNodeByPath(name)
            .then((response) => {
                const { id } = response.data.entry;
                return this.delete(`/people/-me-/favorites/${id}`);
            })
            .catch(this.handleError);
    }

    removeFavoriteById(nodeId: string) {
        return this
            .delete(`/people/-me-/favorites/${nodeId}`)
            .catch(this.handleError);
    }

    waitForApi(data) {
        const favoriteFiles = () => {
            return this.getFavorites()
                .then(response => response.data.list.pagination.totalItems)
                .then(totalItems => {
                    if ( totalItems === data.expect) {
                        return Promise.resolve(totalItems);
                    } else {
                        return Promise.reject(totalItems);
                    }
                });
        };

        return Utils.retryCall(favoriteFiles);
    }
}
