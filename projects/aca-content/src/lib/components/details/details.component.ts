/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppHookService, ContentApiService, PageComponent, PageLayoutComponent, ToolbarComponent } from '@alfresco/aca-shared';
import { NavigateToFolder, NavigateToPreviousPage, SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { BreadcrumbComponent, ContentService, NodesApiService, PermissionListComponent } from '@alfresco/adf-content-services';
import { CommonModule, Location } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MetadataTabComponent } from '../info-drawer/metadata-tab/metadata-tab.component';
import { CommentsTabComponent } from '../info-drawer/comments-tab/comments-tab.component';
import { NodeEntry, PathElement } from '@alfresco/js-api';
import { first } from 'rxjs/operators';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { InfoDrawerButtonsDirective } from '@alfresco/adf-core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [
    CommonModule,
    TranslatePipe,
    MatIconModule,
    MatTabsModule,
    MatProgressBarModule,
    MatButtonModule,
    MetadataTabComponent,
    CommentsTabComponent,
    PageLayoutComponent,
    ToolbarComponent,
    InfoDrawerButtonsDirective,
    PermissionListComponent,
    BreadcrumbComponent
  ],
  selector: 'app-details-manager',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent extends PageComponent implements OnInit, OnDestroy {
  nodeId: string;
  isLoading: boolean;
  activeTab = 1;
  aspectActions: Array<ContentActionRef> = [];
  nodeIcon: string;
  canManagePermissions = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly contentApi: ContentApiService,
    private readonly contentService: ContentService,
    private readonly nodesApiService: NodesApiService,
    private readonly appHookService: AppHookService,
    private readonly location: Location
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.isLoading = true;
    const { route } = this;
    const { data } = route.snapshot;
    this.title = data.title;
    this.nodesApiService.nodeUpdated.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((node) => (this.node = { ...node }));
    this.appHookService.nodesDeleted.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.location.back());
    this.route.params.subscribe((params) => {
      this.isLoading = true;
      this.setActiveTab(params.activeTab);
      this.nodeId = params.nodeId;
      this.contentApi.getNode(this.nodeId).subscribe((node) => {
        this.node = node.entry;
        this.isLoading = false;
        this.canManagePermissions = !this.isSmartFolder();
        this.setActiveTab(params.activeTab);
        this.store.dispatch(new SetSelectedNodesAction([{ entry: this.node }]));
        this.nodeIcon = this.contentService.getNodeIcon(this.node);
      });
    });
    this.extensions
      .getAllowedSidebarActions()
      .pipe(first())
      .subscribe((aspectActions) => {
        this.aspectActions = aspectActions;
      });
  }

  setActiveTab(tabName: string) {
    switch (tabName) {
      case 'comments':
        this.activeTab = 1;
        break;
      case 'permissions':
        if (!this.canManagePermissions) {
          this.activeTab = 0;
          break;
        }
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
    super.ngOnDestroy();
  }

  private isSmartFolder(): boolean {
    if (!this.node?.isFolder) {
      return false;
    }
    const nodeAspects = this.node.aspectNames ?? [];
    return nodeAspects.includes('smf:customConfigSmartFolder') || nodeAspects.includes('smf:systemConfigSmartFolder');
  }
}
