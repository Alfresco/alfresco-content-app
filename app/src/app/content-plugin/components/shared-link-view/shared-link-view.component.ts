/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import { AppStore, SetSelectedNodesAction, getSharedUrl } from '@alfresco/aca-shared/store';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { SharedLinkEntry, SharedlinksApi } from '@alfresco/js-api';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { forkJoin, from, of, Subject } from 'rxjs';
import { catchError, mergeMap, take, takeUntil } from 'rxjs/operators';
import { AppExtensionService } from '@alfresco/aca-shared';

@Component({
  selector: 'app-shared-link-view',
  templateUrl: './shared-link-view.component.html',
  styleUrls: ['shared-link-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-shared-link-view' }
})
export class SharedLinkViewComponent implements OnInit, OnDestroy {
  private onDestroy$: Subject<boolean> = new Subject<boolean>();
  private sharedLinksApi: SharedlinksApi;
  sharedLinkId: string = null;
  viewerToolbarActions: Array<ContentActionRef> = [];
  sharedId: string = null;
  baseUrl: string = null;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppStore>,
    private extensions: AppExtensionService,
    private alfrescoApiService: AlfrescoApiService
  ) {
    this.sharedLinksApi = new SharedlinksApi(this.alfrescoApiService.getInstance());
  }

  ngOnInit() {
    this.store
      .select(getSharedUrl)
      .pipe(take(1))
      .subscribe((baseShareUrl) => {
        this.baseUrl = baseShareUrl;
      });

    this.route.params.subscribe((data) => {
      this.sharedId = data.id;
    });

    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.indexOf('android') > -1;
    const isIphone = ua.indexOf('iphone') > -1;

    if (isIphone === true) {
      window.location.href = 'com.alfresco.contentapp://iosamw';
      setTimeout(() => {
        this.previewData();
      }, 25);
    } else if (isAndroid === true) {
      window.location.href = 'com.alfresco.content.app://androidamw://' + this.baseUrl + this.sharedId;
      setTimeout(() => {
        this.previewData();
      }, 25);
    } else {
      this.previewData();
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  trackByActionId(_: number, action: ContentActionRef) {
    return action.id;
  }

  previewData() {
    this.route.params
      .pipe(
        mergeMap((params) =>
          forkJoin([from(this.sharedLinksApi.getSharedLink(params.id)), of(params.id)]).pipe(catchError(() => of([null, params.id])))
        )
      )
      .subscribe(([sharedEntry, sharedId]: [SharedLinkEntry, string]) => {
        if (sharedEntry) {
          this.store.dispatch(new SetSelectedNodesAction([sharedEntry as any]));
        }
        this.sharedLinkId = sharedId;
      });

    this.extensions
      .getSharedLinkViewerToolbarActions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((actions) => {
        this.viewerToolbarActions = actions;
      });
  }
}
