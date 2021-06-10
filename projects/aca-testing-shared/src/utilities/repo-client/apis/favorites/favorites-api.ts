/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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
import { Logger } from '@alfresco/adf-testing';
import { RepoClient } from './../../repo-client';
import { Utils } from '../../../../utilities/utils';
import { FavoritesApi as AdfFavoritesApi, SitesApi as AdfSiteApi, FavoriteEntry } from '@alfresco/js-api';

export class FavoritesApi extends RepoApi {
  favoritesApi = new AdfFavoritesApi(this.alfrescoJsApi);
  sitesApi = new AdfSiteApi(this.alfrescoJsApi);

  constructor(username?: string, password?: string) {
    super(username, password);
  }

  async addFavorite(api: RepoClient, nodeType: string, name: string, parentFolderId?: string) {
    try {
      const nodeId = (await api.nodes.getNodeByPath(name, parentFolderId)).entry.id;
      const data = {
        target: {
          [nodeType]: {
            guid: nodeId
          }
        }
      };
      return await this.favoritesApi.createFavorite('-me-', data);
    } catch (error) {
      this.handleError(`FavoritesApi addFavorite : catch : `, error);
      return null;
    }
  }

  async addFavoriteById(nodeType: 'file' | 'folder' | 'site', id: string): Promise<FavoriteEntry | null> {
    let guid;
    try {
      await this.apiAuth();
      if (nodeType === 'site') {
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
      return await this.favoritesApi.createFavorite('-me-', data);
    } catch (error) {
      this.handleError(`FavoritesApi addFavoriteById : catch : `, error);
      return null;
    }
  }

  async addFavoritesByIds(nodeType: 'file' | 'folder' | 'site', ids: string[]): Promise<FavoriteEntry[]> {
    const favorites: FavoriteEntry[] = [];
    try {
      if (ids && ids.length > 0) {
        for (const id of ids) {
          const favorite = await this.addFavoriteById(nodeType, id);
          favorites.push(favorite);
        }
      }
    } catch (error) {
      this.handleError(`FavoritesApi addFavoritesByIds : catch : `, error);
    }
    return favorites;
  }

  async getFavorites() {
    try {
      await this.apiAuth();
      return await this.favoritesApi.listFavorites(this.username);
    } catch (error) {
      this.handleError(`FavoritesApi getFavorites : catch : `, error);
      return null;
    }
  }

  async getFavoritesTotalItems(): Promise<number> {
    try {
      await this.apiAuth();
      return (await this.favoritesApi.listFavorites(this.username)).list.pagination.totalItems;
    } catch (error) {
      this.handleError(`FavoritesApi getFavoritesTotalItems : catch : `, error);
      return -1;
    }
  }

  async getFavoriteById(nodeId: string) {
    try {
      await this.apiAuth();
      return await this.favoritesApi.getFavorite('-me-', nodeId);
    } catch (error) {
      this.handleError(`FavoritesApi getFavoriteById : catch : `, error);
      return null;
    }
  }

  async isFavorite(nodeId: string) {
    try {
      return JSON.stringify((await this.getFavorites()).list.entries).includes(nodeId);
    } catch (error) {
      this.handleError(`FavoritesApi isFavorite : catch : `, error);
      return null;
    }
  }

  async isFavoriteWithRetry(nodeId: string, data: { expect: boolean }) {
    let isFavorite = false;
    try {
      const favorite = async () => {
        isFavorite = await this.isFavorite(nodeId);
        if (isFavorite !== data.expect) {
          return Promise.reject(isFavorite);
        } else {
          return Promise.resolve(isFavorite);
        }
      };
      return await Utils.retryCall(favorite);
    } catch (error) {}
    return isFavorite;
  }

  async removeFavoriteById(nodeId: string) {
    try {
      await this.apiAuth();
      return await this.favoritesApi.deleteFavorite('-me-', nodeId);
    } catch (error) {
      this.handleError(`FavoritesApi removeFavoriteById : catch : `, error);
    }
  }

  async removeFavoritesByIds(ids: string[]) {
    try {
      return await ids.reduce(async (previous, current) => {
        await previous;
        await this.removeFavoriteById(current);
      }, Promise.resolve());
    } catch (error) {
      this.handleError(`FavoritesApi removeFavoritesByIds : catch : `, error);
    }
  }

  async waitForApi(data: { expect: number }) {
    try {
      const favoriteFiles = async () => {
        const totalItems = await this.getFavoritesTotalItems();
        if (totalItems !== data.expect) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      };
      return await Utils.retryCall(favoriteFiles);
    } catch (error) {
      Logger.error(`FavoritesApi waitForApi :  catch : `);
      Logger.error(`\tExpected: ${data.expect} items, but found ${error}`);
    }
  }
}
