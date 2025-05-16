/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { TagBody, TagEntry, TagPaging } from '@alfresco/js-api';
import { ApiClientFactory } from './api-client-factory';

export class TagsApi {
  private apiService: ApiClientFactory;

  constructor() {
    this.apiService = new ApiClientFactory();
  }

  static async initialize(userName: string, password?: string): Promise<TagsApi> {
    const classObj = new TagsApi();
    await classObj.apiService.setUpAcaBackend(userName, password);
    return classObj;
  }

  async createTags(tags: TagBody[]): Promise<TagEntry | TagPaging> {
    try {
      return this.apiService.tagsApi.createTags(tags);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async assignTagToNode(nodeId: string, tag: TagBody): Promise<TagEntry> {
    try {
      return this.apiService.tagsApi.assignTagToNode(nodeId, tag);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteTags(tagIds: string[]): Promise<void> {
    try {
      for (const tagId of tagIds) {
        await this.apiService.tagsApi.deleteTag(tagId);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async listTagsForNode(nodeId: string): Promise<TagPaging> {
    try {
      return this.apiService.tagsApi.listTagsForNode(nodeId);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async listTags(params?: { tag?: string; matching?: boolean }): Promise<TagPaging> {
    try {
      return this.apiService.tagsApi.listTags(params);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteTagsByTagName(tagName: string): Promise<void> {
    try {
      const response = await this.listTags({ tag: tagName, matching: true });
      const tagIds = response.list.entries.map((entry) => entry.entry.id);
      await this.deleteTags(tagIds);
    } catch (error) {
      console.error(error);
    }
  }
}
