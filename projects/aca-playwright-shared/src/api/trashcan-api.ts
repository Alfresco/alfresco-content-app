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

export class TrashcanApi {
  private apiService = new ApiClientFactory();

  static async initialize(userName: string, password?: string): Promise<TrashcanApi> {
    const classObj = new TrashcanApi();
    await classObj.apiService.setUpAcaBackend(userName, password);
    return classObj;
  }

  /**
   * Empties the trashcan. Uses multiple batches 1000 nodes each.
   */
  async emptyTrashcan(): Promise<void> {
    try {
      const nodes = await this.apiService.trashCan.listDeletedNodes({
        maxItems: 1000
      });

      if (nodes?.list?.entries?.length > 0) {
        const ids = nodes.list.entries.map((entries) => entries.entry.id);

        for (const nodeId of ids) {
          await this.apiService.trashCan.deleteDeletedNode(nodeId);
        }
      }
    } catch (error) {
      console.error('User Actions - emptyTrashcan failed : ', error);
    }
  }
}
