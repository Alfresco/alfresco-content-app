
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

import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageComponent } from '../page.component';
import { AppExtensionService, ContentApiService } from '@alfresco/aca-shared';
import { AppStore, NavigateRouteAction, NavigateToPreviousPage, SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { Store } from '@ngrx/store';
import { PathElementEntity } from '@alfresco/adf-content-services';
import { ContentManagementService } from '../../services/content-management.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-details-manager',
  templateUrl: './details.component.html',
  styleUrls: ['details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent extends PageComponent implements OnInit, OnDestroy {
  nodeId: string;
  isLoading: boolean;
  onDestroy$ = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private contentApi: ContentApiService,
    store: Store<AppStore>,
    content: ContentManagementService,
    extensions: AppExtensionService
  ) {
    super(store, extensions, content);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.isLoading = true;
    const { route } = this;
    const { data } = route.snapshot;
    this.title = data.title;

    this.route.params.subscribe((params) => {
      this.isLoading = true;
      this.nodeId = params.nodeId;
      this.contentApi.getNode(this.nodeId).subscribe((node) => {
        this.node = node.entry;
        this.isLoading = false;
        this.store.dispatch(new SetSelectedNodesAction([{ entry: this.node }]));
      });
    });
  }

  goBack() {
    this.store.dispatch(new NavigateToPreviousPage());
  }

  onBreadcrumbNavigate(route: PathElementEntity) {
    this.store.dispatch(new NavigateRouteAction(['personal-files', route.id]));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new SetSelectedNodesAction([]));
    this.onDestroy$.next();
    this.onDestroy$.complete();
}
}
