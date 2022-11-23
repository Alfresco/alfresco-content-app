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

import { AlfrescoApiService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { QueriesApi, SitePaging } from '@alfresco/js-api';
import { Subject } from 'rxjs';

export interface LibrarySearchQuery {
  term: string;
  opts: {
    skipCount: number;
    maxItems: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SearchLibrariesQueryBuilderService {
  _queriesApi: QueriesApi;
  get queriesApi(): QueriesApi {
    this._queriesApi = this._queriesApi ?? new QueriesApi(this.alfrescoApiService.getInstance());
    return this._queriesApi;
  }

  private _userQuery = '';

  updated: Subject<any> = new Subject();
  executed: Subject<any> = new Subject();
  hadError: Subject<any> = new Subject();

  paging: { maxItems?: number; skipCount?: number } = null;

  get userQuery(): string {
    return this._userQuery;
  }

  set userQuery(value: string) {
    this._userQuery = value ? value.trim() : '';
  }

  constructor(private alfrescoApiService: AlfrescoApiService) {}

  update(): void {
    const query = this.buildQuery();
    if (query) {
      this.updated.next(query);
    }
  }

  async execute() {
    const query = this.buildQuery();
    if (query) {
      const data = await this.findLibraries(query);
      this.executed.next(data);
    }
  }

  buildQuery(): LibrarySearchQuery {
    const query = this.userQuery;
    if (query && query.length > 1) {
      const resultQuery = {
        term: query,
        opts: {
          skipCount: this.paging && this.paging.skipCount,
          maxItems: this.paging && this.paging.maxItems
        }
      };
      return resultQuery;
    }
    return null;
  }

  private findLibraries(libraryQuery: LibrarySearchQuery): Promise<SitePaging> {
    return this.queriesApi.findSites(libraryQuery.term, libraryQuery.opts).catch((err) => {
      this.hadError.next(err);
      return { list: { pagination: { totalItems: 0 }, entries: [] } };
    });
  }
}
