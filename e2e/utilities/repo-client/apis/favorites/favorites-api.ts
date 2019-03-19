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
import { RepoClient } from './../../repo-client';
import { Utils } from '../../../../utilities/utils';
import { FavoritesApi as AdfFavoritesApi, SitesApi as AdfSiteApi } from '@alfresco/js-api';

export class FavoritesApi extends RepoApi {
    favoritesApi = new AdfFavoritesApi(this.alfrescoJsApi);
    sitesApi = new AdfSiteApi(this.alfrescoJsApi);

    constructor(username?, password?) {
        super(username, password);
    }

    async addFavorite(api: RepoClient, nodeType: string, name: string) {
        const nodeId = (await api.nodes.getNodeByPath(name)).entry.id;
        const data = {
            target: {
                [nodeType]: {
                    guid: nodeId
                }
            }
        };
        return await this.favoritesApi.createFavorite('-me-', data);
    }

    async addFavoriteById(nodeType: 'file' | 'folder' | 'site', id: string) {
        let guid;
        await this.apiAuth();

        if ( nodeType === 'site' ) {
            guid = (await this.sitesApi.getSite(id)).entry.guid;
        } else {
            guid = id;
        }
        const data = {
            target: {
                [nodeType]: {
                    guid: guid
                }
            }
        };
        try {
          return await this.favoritesApi.createFavorite('-me-', data);
        } catch (error) {
          // console.log('--- add favorite by id catch ');
        }
    }

    async addFavoritesByIds(nodeType: 'file' | 'folder' | 'site', ids: string[]) {
        return await ids.reduce(async (previous, current) => {
            await previous;
            await this.addFavoriteById(nodeType, current);
        }, Promise.resolve());
    }

    async getFavorites() {
        await this.apiAuth();
        return await this.favoritesApi.listFavorites(this.getUsername());
    }

    async getFavoriteById(nodeId: string) {
        await this.apiAuth();
        return await this.favoritesApi.getFavorite('-me-', nodeId);
    }

    async isFavorite(nodeId: string) {
        return JSON.stringify((await this.getFavorites()).list.entries).includes(nodeId);
    }

    async isFavoriteWithRetry(nodeId: string, data) {
      let isFavorite;
      try {
        const favorite = async () => {
          isFavorite = await this.isFavorite(nodeId);
          if ( isFavorite !== data.expect ) {
            return Promise.reject(isFavorite);
          } else {
            return Promise.resolve(isFavorite);
          }
        };

        return await Utils.retryCall(favorite);
      } catch (error) {
        console.log('-----> catch isFavoriteWithRetry: ', error);
      }
      return isFavorite;
    }

    async removeFavoriteById(nodeId: string) {
        await this.apiAuth();
        try {
          return await this.favoritesApi.deleteFavorite('-me-', nodeId);
        } catch (error) {
          // console.log('--- remove favorite by id catch ');
        }
    }

    async removeFavoritesByIds(ids: string[]) {
      return await ids.reduce(async (previous, current) => {
          await previous;
          await this.removeFavoriteById(current);
      }, Promise.resolve());
  }

    async waitForApi(data) {
      try {
        const favoriteFiles = async () => {
          const totalItems = (await this.getFavorites()).list.pagination.totalItems;
          if ( totalItems !== data.expect) {
              return Promise.reject(totalItems);
          } else {
              return Promise.resolve(totalItems);
          }
        };

        return await Utils.retryCall(favoriteFiles);
      } catch (error) {
        console.log('-----> catch favorites: ', error);
      }
    }
}
