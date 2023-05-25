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

import { Component, OnInit, ViewEncapsulation, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentApiService, PageComponent } from '@alfresco/aca-shared';
import { NavigateToPreviousPage, SetSelectedNodesAction } from '@alfresco/aca-shared/store';

@Component({
  selector: 'app-details-manager',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent extends PageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private contentApi = inject(ContentApiService);

  nodeId: string;
  isLoading: boolean;
  activeTab = 1;

  ngOnInit(): void {
    super.ngOnInit();

    this.isLoading = true;
    const { data } = this.route.snapshot;
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

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
