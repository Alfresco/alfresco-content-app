/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { ApiClientFactory } from './api-client-factory';
import { FavoritePaging, SharedLinkEntry } from '@alfresco/js-api';
import { logger } from '@alfresco/adf-cli/scripts/logger';

export class SharedLinksApi {
  private apiService: ApiClientFactory;

  constructor() {
    this.apiService = new ApiClientFactory();
  }
  static async initialize(userName: string, password?: string): Promise<SharedLinksApi> {
    const classObj = new SharedLinksApi();
    await classObj.apiService.setUpAcaBackend(userName, password);
    return classObj;
  }

  async shareFileById(id: string, expireDate?: Date): Promise<SharedLinkEntry | null> {
    try {
      const data = {
        nodeId: id,
        expiresAt: expireDate
      };
      return await this.apiService.share.createSharedLink(data);
    } catch (error) {
      return null;
    }
  }

  private async getFavorites(userName: string): Promise<FavoritePaging> {
    try {
      return await this.apiService.favorites.listFavorites(userName);
    } catch (error) {
      logger.error(`\n--- Error while fetching favourites list ${error} :`);
      return null;
    }
  }

  async isFavorite(nodeId: string, userName: string): Promise<boolean> {
    try {
      return JSON.stringify((await this.getFavorites(userName)).list.entries).includes(nodeId);
    } catch (error) {
      logger.error(`\n--- Error while checking favourite node ${error} ${error} :`);
      return null;
    }
  }
}
