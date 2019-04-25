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

import { Component, Input, OnChanges, OnInit, OnDestroy } from '@angular/core';
import {
  MinimalNodeEntity,
  MinimalNodeEntryEntity,
  SiteEntry
} from '@alfresco/js-api';
import { ContentApiService } from '@alfresco/aca-shared';
import { AppExtensionService } from '../../extensions/extension.service';
import { SidebarTabRef } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { SetInfoDrawerStateAction } from '@alfresco/aca-shared/store';

@Component({
  selector: 'aca-info-drawer',
  templateUrl: './info-drawer.component.html'
})
export class InfoDrawerComponent implements OnChanges, OnInit, OnDestroy {
  @Input()
  nodeId: string;
  @Input()
  node: MinimalNodeEntity;

  isLoading = false;
  displayNode: MinimalNodeEntryEntity | SiteEntry;
  tabs: Array<SidebarTabRef> = [];

  constructor(
    private store: Store<any>,
    private contentApi: ContentApiService,
    private extensions: AppExtensionService
  ) {}

  ngOnInit() {
    this.tabs = this.extensions.getSidebarTabs();
  }

  ngOnDestroy() {
    this.store.dispatch(new SetInfoDrawerStateAction(false));
  }

  ngOnChanges() {
    if (this.node) {
      if (this.node['isLibrary']) {
        return this.setDisplayNode(this.node);
      }

      const entry: any = this.node.entry;

      if (!entry.aspectNames) {
        const id = entry.nodeId || entry.id;
        return this.loadNodeInfo(id);
      }

      this.setDisplayNode(entry);
    }
  }

  private loadNodeInfo(nodeId: string) {
    if (nodeId) {
      this.isLoading = true;

      this.contentApi.getNodeInfo(nodeId).subscribe(
        entity => {
          this.setDisplayNode(entity);
          this.isLoading = false;
        },
        () => (this.isLoading = false)
      );
    }
  }

  private setDisplayNode(node: any) {
    this.displayNode = node;
  }
}
