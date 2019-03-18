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

import { Injectable } from '@angular/core';
import { CustomResourcesService } from '@alfresco/adf-content-services';
import {
  PaginationModel,
  LogService,
  AlfrescoApiService
} from '@alfresco/adf-core';
import { Observable } from 'rxjs';
import { PersonEntry, SearchRequest, ResultSetPaging } from '@alfresco/js-api';

@Injectable({
  providedIn: 'root'
})
export class AppDataService extends CustomResourcesService {
  recentFileFilters = [
    'TYPE:"content"',
    '-PNAME:"0/wiki"',
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

  constructor(private api: AlfrescoApiService, logService: LogService) {
    super(api, logService);
  }

  getRecentFiles(
    personId: string,
    pagination: PaginationModel
  ): Observable<ResultSetPaging> {
    return new Observable(observer => {
      this.api.peopleApi.getPerson(personId).then(
        (person: PersonEntry) => {
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
            include: ['path', 'properties', 'allowableOperations'],
            sort: [
              {
                type: 'FIELD',
                field: 'cm:modified',
                ascending: false
              }
            ],
            paging: {
              maxItems: pagination.maxItems,
              skipCount: pagination.skipCount
            }
          };
          return this.api.searchApi.search(query).then(
            searchResult => {
              observer.next(searchResult);
              observer.complete();
            },
            err => {
              observer.error(err);
              observer.complete();
            }
          );
        },
        err => {
          observer.error(err);
          observer.complete();
        }
      );
    });
  }
}
