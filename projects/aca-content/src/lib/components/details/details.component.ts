/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentApiService, PageComponent, PageLayoutComponent, ToolbarComponent } from '@alfresco/aca-shared';
import { NavigateToFolder, NavigateToPreviousPage, SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { Subject } from 'rxjs';
import { BreadcrumbModule, PermissionManagerModule } from '@alfresco/adf-content-services';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MetadataTabComponent } from '../info-drawer/metadata-tab/metadata-tab.component';
import { CommentsTabComponent } from '../info-drawer/comments-tab/comments-tab.component';
import { NodeEntry, PathElement } from '@alfresco/js-api';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    PermissionManagerModule,
    BreadcrumbModule,
    MatIconModule,
    MatTabsModule,
    MatProgressBarModule,
    MatButtonModule,
    MetadataTabComponent,
    CommentsTabComponent,
    PageLayoutComponent,
    ToolbarComponent
  ],
  selector: 'app-details-manager',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent extends PageComponent implements OnInit, OnDestroy {
  nodeId: string;
  isLoading: boolean;
  onDestroy$ = new Subject<boolean>();
  activeTab = 1;

  constructor(private route: ActivatedRoute, private contentApi: ContentApiService) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.isLoading = true;
    const { route } = this;
    const { data } = route.snapshot;
    this.title = data.title;

    this.route.params.subscribe((params) => {
      this.isLoading = true;
      this.setActiveTab(params.activeTab);
      this.nodeId = params.nodeId;
      this.contentApi.getNode(this.nodeId).subscribe((node) => {
        this.node = node.entry;
        this.isLoading = false;
        this.store.dispatch(new SetSelectedNodesAction([{ entry: this.node }]));
      });
    });
  }

  setActiveTab(tabName: string) {
    switch (tabName) {
      case 'comments':
        this.activeTab = 1;
        break;
      case 'permissions':
        this.activeTab = 2;
        break;
      case 'metadata':
      default:
        this.activeTab = 0;
    }
  }

  goBack() {
    this.store.dispatch(new NavigateToPreviousPage());
  }

  onBreadcrumbNavigate(path: PathElement) {
    this.store.dispatch(new NavigateToFolder({ entry: path } as NodeEntry));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new SetSelectedNodesAction([]));
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
