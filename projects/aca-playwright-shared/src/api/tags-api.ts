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

import { TagBody, TagEntry, TagPaging, Tag } from '@alfresco/js-api';
import { ApiClientFactory } from './api-client-factory';
import { logger } from '../utils';

export class TagsApi {
  private readonly apiService: ApiClientFactory;

  constructor() {
    this.apiService = new ApiClientFactory();
  }

  static async initialize(userName: string, password?: string): Promise<TagsApi> {
    const classObj = new TagsApi();
    await classObj.apiService.setUpAcaBackend(userName, password);
    return classObj;
  }

  async createTags(...tagNames: string[]): Promise<TagEntry[]> {
    try {
      const results: TagEntry[] = [];
      for (const tag of tagNames) {
        const result = await this.apiService.tagsApi.createTags([{ tag }]);
        let created: TagEntry;
        if ('entry' in result) {
          created = result as TagEntry;
        } else if ('list' in result) {
          const firstEntry = result.list?.entries?.[0];
          if (!firstEntry) {
            throw new Error(`createTags returned a paging result with no entries for tag "${tag}"`);
          }
          created = firstEntry;
        } else {
          throw new Error(`createTags returned an unexpected response format for tag "${tag}"`);
        }
        logger.info(`Tag created: "${created.entry.tag}" (id: ${created.entry.id})`);
        results.push(created);
      }
      return results;
    } catch (error) {
      throw new Error(`Failed to create tags: ${error}`);
    }
  }

  async assignTagToNode(nodeId: string, tag: TagBody): Promise<TagEntry> {
    try {
      return this.apiService.tagsApi.assignTagToNode(nodeId, tag);
    } catch (error) {
      throw new Error(`Failed to assign tag to node: ${error}`);
    }
  }

  async deleteTags(...tags: Tag[]): Promise<void> {
    try {
      for (const { id, tag } of tags) {
        await this.apiService.tagsApi.deleteTag(id);
        const tagLabel = tag ? `"${tag}" ` : '';
        logger.info(`Tag deleted: ${tagLabel}(id: ${id})`);
      }
    } catch (error) {
      throw new Error(`Failed to delete tags: ${error}`);
    }
  }

  async listTagsForNode(nodeId: string): Promise<TagPaging> {
    try {
      return this.apiService.tagsApi.listTagsForNode(nodeId);
    } catch (error) {
      throw new Error(`Failed to list tags for node: ${error}`);
    }
  }

  async listTags(params?: { tag?: string; matching?: boolean }): Promise<TagPaging> {
    try {
      return this.apiService.tagsApi.listTags(params);
    } catch (error) {
      throw new Error(`Failed to list tags: ${error}`);
    }
  }

  async deleteTagByTagName(tagName: string): Promise<void> {
    try {
      const response = await this.listTags({ tag: tagName, matching: true });
      const tags = response.list?.entries.map((entry) => entry.entry) || [];
      await this.deleteTags(...tags);
    } catch (error) {
      throw new Error(`Failed to delete tags by tag name: ${error}`);
    }
  }
}
