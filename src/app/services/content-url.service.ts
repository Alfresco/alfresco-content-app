import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppStore, getRepositoryStatus } from '@alfresco/aca-shared/store';
import { take, map, catchError, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ContentApiService } from '@alfresco/aca-shared';
import { DirectAccessUrlEntry } from '@alfresco/js-api';

@Injectable({ providedIn: 'root' })
export class ContentUrlService {

  constructor(private store: Store<AppStore>, private contentApiService: ContentApiService) {}

  getNodeContentUrl(nodeId: string, attachment = true): Observable<string> {
    return this.isDirectAccessUrlEnabled().pipe(
      mergeMap(dauEnabled => {
        if (dauEnabled) {
          return this.contentApiService.requestNodeDirectAccessUrl(nodeId).pipe(
            catchError(() => of(this.contentApiService.getContentUrl(nodeId, true))),
            map((dauObj: DirectAccessUrlEntry) => dauObj.entry.contentUrl)
          )
        } else {
          return of(this.contentApiService.getContentUrl(nodeId, attachment));
        }
      })
    );
  }

  getVersionContentUrl(nodeId: string, versionId: string, attachment = true): Observable<string> {
    return this.isDirectAccessUrlEnabled().pipe(
      mergeMap(dauEnabled => {
        if (dauEnabled) {
          return this.contentApiService.requestVersionDirectAccessUrl(nodeId, versionId).pipe(
            catchError(() => of(this.contentApiService.getVersionContentUrl(nodeId, versionId, true))),
            map((dauObj: DirectAccessUrlEntry) => dauObj.entry.contentUrl)
          )
        } else {
          return of(this.contentApiService.getVersionContentUrl(nodeId, versionId, attachment));
        }
      })
    );
  }

  private isDirectAccessUrlEnabled(): Observable<boolean> {
    return this.store.select(getRepositoryStatus).pipe(
      take(1),
      map(repository => !!repository?.status?.isDirectAccessUrlEnabled)
    );
  }

}
