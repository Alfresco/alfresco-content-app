/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { ApiClientFactory } from './api-client-factory';
import { FavoriteEntry, FavoritePaging } from '@alfresco/js-api';
import { Utils } from '../utils';

export class FavoritesPageApi {
  private apiService: ApiClientFactory;

  constructor() {
    this.apiService = new ApiClientFactory();
  }
  static async initialize(userName: string, password?: string): Promise<FavoritesPageApi> {
    const classObj = new FavoritesPageApi();
    await classObj.apiService.setUpAcaBackend(userName, password);
    return classObj;
  }
  async addFavoriteById(nodeType: 'file' | 'folder' | 'site', id: string): Promise<FavoriteEntry> {
    const guid = nodeType === 'site' ? (await this.apiService.sites.getSite(id)).entry.guid : id;
    const data = {
      target: {
        [nodeType]: {
          guid: guid
        }
      }
    };
    return this.apiService.favorites.createFavorite('-me-', data);
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
    } catch {}
    return favorites;
  }

  private async getFavorites(username: string): Promise<FavoritePaging> {
    try {
      return this.apiService.favorites.listFavorites(username);
    } catch {
      return new FavoritePaging();
    }
  }

  async isFavorite(username: string, nodeId: string): Promise<boolean> {
    try {
      return JSON.stringify((await this.getFavorites(username)).list.entries).includes(nodeId);
    } catch {
      return false;
    }
  }

  async isFavoriteWithRetry(username: string, nodeId: string, data: { expect: boolean }): Promise<boolean> {
    let isFavorite = false;
    try {
      const favorite = async () => {
        isFavorite = await this.isFavorite(username, nodeId);
        if (isFavorite !== data.expect) {
          return Promise.reject(isFavorite);
        } else {
          return Promise.resolve(isFavorite);
        }
      };
      return Utils.retryCall(favorite);
    } catch (error) {}
    return isFavorite;
  }

  async getFavoritesTotalItems(username: string): Promise<number> {
    try {
      return (await this.apiService.favorites.listFavorites(username)).list.pagination.totalItems;
    } catch {
      return -1;
    }
  }

  async waitForApi(username: string, data: { expect: number }) {
    try {
      const favoriteFiles = async () => {
        const totalItems = await this.getFavoritesTotalItems(username);
        if (totalItems !== data.expect) {
          return Promise.reject(totalItems);
        } else {
          return Promise.resolve(totalItems);
        }
      };
      return Utils.retryCall(favoriteFiles);
    } catch {}
  }

  async removeFavoritesByIds(username: string, ids: string[]): Promise<void> {
    try {
      if (ids && ids.length > 0) {
        for (const id of ids) {
          await this.apiService.favorites.deleteFavorite(username, id);
        }
      }
    } catch (error) {
      console.error('FavoritesApi: removeFavoritesByIds failed ', error);
    }
  }
}
