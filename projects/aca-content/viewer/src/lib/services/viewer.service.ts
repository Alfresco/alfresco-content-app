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

import { ObjectUtils, UserPreferencesService } from '@alfresco/adf-core';
import { FavoritePaging, Node, NodePaging, SearchRequest, ResultSetPaging, SharedLink, SharedLinkPaging } from '@alfresco/js-api';
import { Injectable } from '@angular/core';
import { ContentApiService } from '@alfresco/aca-shared';

interface AdjacentFiles {
  left: string;
  right: string;
}

@Injectable({
  providedIn: 'root'
})
export class ViewerService {
  constructor(private preferences: UserPreferencesService, private contentApi: ContentApiService) {}

  recentFileFilters = [
    'TYPE:"content"',
    '-PATH:"//cm:wiki/*"',
    '-TYPE:"app:filelink"',
    '-TYPE:"fm:post"',
    '-TYPE:"cm:thumbnail"',
    '-TYPE:"cm:failedThumbnail"',
    '-TYPE:"cm:rating"',
    '-TYPE:"dl:dataList"',
    '-TYPE:"dl:todoList"',
    '-TYPE:"dl:issue"',
    '-TYPE:"dl:contact"',
    '-TYPE:"dl:eventAgenda"',
    '-TYPE:"dl:event"',
    '-TYPE:"dl:task"',
    '-TYPE:"dl:simpletask"',
    '-TYPE:"dl:meetingAgenda"',
    '-TYPE:"dl:location"',
    '-TYPE:"fm:topic"',
    '-TYPE:"fm:post"',
    '-TYPE:"ia:calendarEvent"',
    '-TYPE:"lnk:link"'
  ];

  /**
   * Retrieves nearest node information for the given node and folder.
   *
   * @param nodeId Unique identifier of the document node
   * @param folderId Unique identifier of the containing folder node.
   * @param source Data source name. Returns file ids for personal-files, libraries, favorites, shared and recent-files, otherwise returns empty.
   */
  async getNearestNodes(nodeId: string, folderId: string, source: string): Promise<AdjacentFiles> {
    const empty: AdjacentFiles = {
      left: null,
      right: null
    };

    if (nodeId && folderId) {
      try {
        const ids = await this.getFileIds(source, folderId);
        const idx = ids.indexOf(nodeId);

        if (idx >= 0) {
          return {
            left: ids[idx - 1] || null,
            right: ids[idx + 1] || null
          };
        }
      } catch {}
    }
    return empty;
  }

  /**
   * Retrieves a list of node identifiers for the folder and data source.
   *
   * @param source Data source name. Returns file ids for personal-files, libraries, favorites, shared and recent-files, otherwise returns empty.
   * @param folderId Optional parameter containing folder node identifier for 'personal-files' and 'libraries' sources.
   */
  async getFileIds(source: string, folderId?: string): Promise<string[]> {
    if (source === 'libraries') {
      source = 'libraries-files';
    }
    const isClient = this.preferences.get(`${source}.sorting.mode`) === 'client';
    const [sortKey, sortDirection, previousSortKey, previousSortDir] = this.getSortKeyDir(source);
    let entries: Node[] | SharedLink[] = [];
    let nodes: NodePaging | FavoritePaging | SharedLinkPaging | ResultSetPaging;

    if (source === 'personal-files' || source === 'libraries-files') {
      if (!folderId) {
        return [];
      }
      const orderBy = isClient ? null : ['isFolder desc', `${sortKey} ${sortDirection}`];
      nodes = await this.contentApi
        .getNodeChildren(folderId, {
          orderBy: orderBy,
          fields: this.getFields(sortKey, previousSortKey),
          where: '(isFile=true)'
        })
        .toPromise();
    }

    if (source === 'favorites') {
      nodes = await this.contentApi
        .getFavorites('-me-', {
          where: '(EXISTS(target/file))',
          fields: ['target']
        })
        .toPromise();
    }

    if (source === 'shared') {
      nodes = await this.contentApi
        .findSharedLinks({
          fields: ['nodeId', this.getRootField(sortKey)]
        })
        .toPromise();
    }

    if (source === 'recent-files') {
      const person = await this.contentApi.getPerson('-me-').toPromise();
      const username = person.entry.id;
      const query: SearchRequest = {
        query: {
          query: '*',
          language: 'afts'
        },
        filterQueries: [
          { query: `cm:modified:[NOW/DAY-30DAYS TO NOW/DAY+1DAY]` },
          { query: `cm:modifier:${username} OR cm:creator:${username}` },
          {
            query: this.recentFileFilters.join(' AND ')
          }
        ],
        fields: this.getFields(sortKey, previousSortKey),
        include: ['path', 'properties', 'allowableOperations'],
        sort: [
          {
            type: 'FIELD',
            field: 'cm:modified',
            ascending: false
          }
        ]
      };
      nodes = await this.contentApi.search(query).toPromise();
    }

    entries = nodes.list.entries.map((obj) => obj.entry.target?.file ?? obj.entry);
    if (isClient) {
      if (previousSortKey) {
        this.sort(entries, previousSortKey, previousSortDir);
      }
      this.sort(entries, sortKey, sortDirection);
    }
    return entries.map((entry) => entry.id ?? entry.nodeId);
  }

  /**
   * Get the root field name from the property path.
   * Example: 'property1.some.child.property' => 'property1'
   *
   * @param path Property path
   */
  getRootField(path: string): string {
    if (path) {
      return path.split('.')[0];
    }
    return path;
  }

  private sort(items: Node[] | SharedLink[], key: string, direction: string) {
    const options: Intl.CollatorOptions = {};
    if (key.includes('sizeInBytes') || key === 'name') {
      options.numeric = true;
    }

    items.sort((a: Node | SharedLink, b: Node | SharedLink) => {
      let left = ObjectUtils.getValue(a, key) ?? '';
      left = left instanceof Date ? left.valueOf().toString() : left.toString();

      let right = ObjectUtils.getValue(b, key) ?? '';
      right = right instanceof Date ? right.valueOf().toString() : right.toString();

      return direction === 'asc' ? left.localeCompare(right, undefined, options) : right.localeCompare(left, undefined, options);
    });
  }

  private getFields(sortKey: string, previousSortKey?: string): string[] {
    return ['id', this.getRootField(sortKey), this.getRootField(previousSortKey)];
  }

  private getSortKeyDir(source: string): string[] {
    const previousSortKey = this.preferences.get(`${source}.sorting.previousKey`);
    const previousSortDir = this.preferences.get(`${source}.sorting.previousDirection`);
    const sortKey = this.preferences.get(`${source}.sorting.key`) || this.getDefaults(source)[0];
    const sortDirection = this.preferences.get(`${source}.sorting.direction`) || this.getDefaults(source)[1];
    return [sortKey, sortDirection, previousSortKey, previousSortDir];
  }

  private getDefaults(source: string): string[] {
    if (source === 'personal-files' || source === 'libraries-files') {
      return ['name', 'asc'];
    } else {
      return ['modifiedAt', 'desc'];
    }
  }
}
