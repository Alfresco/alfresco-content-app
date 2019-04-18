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

import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentActionRef, SelectionState } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import {
  appSelection,
  infoDrawerOpened
} from '../../store/selectors/app.selectors';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, from } from 'rxjs';
import { AppExtensionService } from '../../extensions/extension.service';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';
import { ContentApiService } from '../../services/content-api.service';
import { AppStore, SetSelectedNodesAction } from '@alfresco/aca-shared/store';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-viewer' }
})
export class AppViewerComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject<boolean>();

  nodeId: string = null;
  node: MinimalNodeEntryEntity;
  selection: SelectionState;
  infoDrawerOpened$: Observable<boolean>;

  showRightSide = false;
  openWith: ContentActionRef[] = [];
  toolbarActions: ContentActionRef[] = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppStore>,
    protected extensions: AppExtensionService,
    private contentApi: ContentApiService
  ) {}

  ngOnInit() {
    this.infoDrawerOpened$ = this.store.select(infoDrawerOpened);

    from(this.infoDrawerOpened$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(val => {
        this.showRightSide = val;
      });

    this.store
      .select(appSelection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(selection => {
        this.selection = selection;

        this.toolbarActions = this.extensions.getViewerToolbarActions();
        this.openWith = this.extensions.openWithActions;
      });

    this.route.params.subscribe(params => {
      const { nodeId } = params;
      if (nodeId) {
        this.displayNode(nodeId);
      }
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  trackById(_: number, obj: { id: string }) {
    return obj.id;
  }

  async displayNode(id: string) {
    if (id) {
      try {
        this.node = await this.contentApi.getNodeInfo(id).toPromise();
        this.store.dispatch(new SetSelectedNodesAction([{ entry: this.node }]));

        if (this.node && this.node.isFile) {
          this.nodeId = this.node.id;
          return;
        }
      } catch (err) {
        if (!err || err.status !== 401) {
          // this.router.navigate([this.previewLocation, id]);
        }
      }
    }
  }
}
