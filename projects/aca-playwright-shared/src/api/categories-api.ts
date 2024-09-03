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
import { CategoryEntry, CategoryBody, CategoryQuery, CategoryPaging, CategoryLinkBody } from '@alfresco/js-api';

export class CategoriesApi {
  private apiService: ApiClientFactory;

  constructor() {
    this.apiService = new ApiClientFactory();
  }

  static async initialize(userName: string, password?: string): Promise<CategoriesApi> {
    const classObj = new CategoriesApi();
    await classObj.apiService.setUpAcaBackend(userName, password);
    return classObj;
  }

  async createCategory(categoryId: string, categoryBodyCreate: CategoryBody[], opts?: CategoryQuery): Promise<CategoryPaging | CategoryEntry> {
    try {
      return this.apiService.categoriesApi.createSubcategories(categoryId, categoryBodyCreate, opts);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    if (categoryId === null) {
      console.error('categoryId is null, skipping deletion');
      return;
    }

    try {
      await this.apiService.categoriesApi.deleteCategory(categoryId);
    } catch (error) {
      console.error(`${this.constructor.name} ${this.deleteCategory.name}: ${error}`);
    }
  }

  async linkNodeToCategory(
    nodeId: string,
    categoryLinkBodyCreate: CategoryLinkBody[],
    opts?: CategoryQuery
  ): Promise<CategoryPaging | CategoryEntry> {
    try {
      return this.apiService.categoriesApi.linkNodeToCategory(nodeId, categoryLinkBodyCreate, opts);
    } catch (error) {
      console.error(`${this.constructor.name} ${this.linkNodeToCategory.name}: ${error}`);
      return null;
    }
  }
}
