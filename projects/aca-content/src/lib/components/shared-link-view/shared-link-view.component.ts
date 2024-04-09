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

import { AppStore, SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { AlfrescoApiService, ViewerModule } from '@alfresco/adf-core';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { SharedLinkEntry, SharedlinksApi } from '@alfresco/js-api';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { forkJoin, from, of, Subject } from 'rxjs';
import { catchError, mergeMap, takeUntil } from 'rxjs/operators';
import { AppExtensionService, AppService, ToolbarComponent } from '@alfresco/aca-shared';
import { CommonModule } from '@angular/common';
import { AlfrescoViewerModule } from '@alfresco/adf-content-services';

@Component({
  standalone: true,
  imports: [CommonModule, ViewerModule, AlfrescoViewerModule, ToolbarComponent],
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

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppStore>,
    private extensions: AppExtensionService,
    private alfrescoApiService: AlfrescoApiService,
    private appService: AppService
  ) {
    this.sharedLinksApi = new SharedlinksApi(this.alfrescoApiService.getInstance());
  }

  ngOnInit() {
    this.route.params
      .pipe(
        mergeMap((params) =>
          forkJoin([from(this.sharedLinksApi.getSharedLink(params.id)), of(params.id)]).pipe(catchError(() => of([null, params.id])))
        )
      )
      .subscribe(([sharedEntry, sharedId]: [SharedLinkEntry, string]) => {
        if (sharedEntry) {
          this.store.dispatch(new SetSelectedNodesAction([sharedEntry as any]));
          this.appService.openMobileAppDialog();
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

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
