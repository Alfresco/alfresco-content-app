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

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppStore, getRepositoryStatus } from '@alfresco/aca-shared/store';
import { take, map, catchError, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ContentApiService } from '@alfresco/aca-shared';
import { DirectAccessUrlEntry } from '@alfresco/js-api';
import { ContentVersionService } from '@alfresco/adf-content-services';
import { AlfrescoApiService } from '@alfresco/adf-core';

@Injectable({ providedIn: 'root' })
export class ContentUrlService extends ContentVersionService {
  constructor(private store: Store<AppStore>, private contentApiService: ContentApiService, alfrescoApiService: AlfrescoApiService) {
    super(alfrescoApiService);
  }

  getNodeContentUrl(nodeId: string, attachment = true): Observable<string> {
    return this.isDirectAccessUrlEnabled().pipe(
      mergeMap((dauEnabled) => {
        if (dauEnabled) {
          return this.contentApiService.requestNodeDirectAccessUrl(nodeId).pipe(
            map((dauObj: DirectAccessUrlEntry) => dauObj.entry.contentUrl),
            catchError(() => of(this.contentApiService.getContentUrl(nodeId, true)))
          );
        } else {
          return of(this.contentApiService.getContentUrl(nodeId, attachment));
        }
      })
    );
  }

  getVersionContentUrl(nodeId: string, versionId: string, attachment = true): Observable<string> {
    return this.isDirectAccessUrlEnabled().pipe(
      mergeMap((dauEnabled) => {
        if (dauEnabled) {
          return this.contentApiService.requestVersionDirectAccessUrl(nodeId, versionId).pipe(
            map((dauObj: DirectAccessUrlEntry) => dauObj.entry.contentUrl),
            catchError(() => of(this.contentApiService.getVersionContentUrl(nodeId, versionId, true)))
          );
        } else {
          return of(this.contentApiService.getVersionContentUrl(nodeId, versionId, attachment));
        }
      })
    );
  }

  private isDirectAccessUrlEnabled(): Observable<boolean> {
    return this.store.select(getRepositoryStatus).pipe(
      take(1),
      map((repository) => !!repository?.status?.isDirectAccessUrlEnabled)
    );
  }
}
