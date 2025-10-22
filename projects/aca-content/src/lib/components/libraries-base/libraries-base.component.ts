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

import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewEncapsulation, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  ContextActionsDirective,
  ToolbarComponent,
  InfoDrawerComponent,
  PageLayoutComponent,
  PageComponent,
  AppHookService
} from '@alfresco/aca-shared';
import { DocumentListDirective } from '../../directives/document-list.directive';
import {
  CustomEmptyContentTemplateDirective,
  DataColumnComponent,
  DataColumnListComponent,
  EmptyContentComponent,
  PaginationComponent
} from '@alfresco/adf-core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { DocumentListPresetRef, DynamicColumnComponent } from '@alfresco/adf-extensions';
import { NavigateLibraryAction } from '@alfresco/aca-shared/store';
import { FavoritePaging, Pagination, SiteEntry, SitePaging } from '@alfresco/js-api';

@Component({
  selector: 'aca-libraries-base',
  standalone: true,
  templateUrl: './libraries-base.component.html',
  imports: [
    CommonModule,
    TranslatePipe,
    ToolbarComponent,
    InfoDrawerComponent,
    PageLayoutComponent,
    DocumentListDirective,
    ContextActionsDirective,
    DocumentListComponent,
    DataColumnListComponent,
    DataColumnComponent,
    DynamicColumnComponent,
    CustomEmptyContentTemplateDirective,
    EmptyContentComponent,
    PaginationComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export class LibrariesBaseComponent extends PageComponent {
  @Input() titleKey: string;
  @Input() list: SitePaging | FavoritePaging;
  @Input() isLoading: boolean;
  @Input() emptyTitleKey: string;
  @Input() emptySubtitleKey: string;
  @Input() pagination: Pagination;
  @Input() currentFolderId: string;
  @Input() columns: DocumentListPresetRef[];
  @Input() navigateRoute: string;

  @Output() changePageSize = new EventEmitter<Pagination>();
  @Output() changePageNumber = new EventEmitter<Pagination>();
  @Output() nextPage = new EventEmitter<Pagination>();
  @Output() prevPage = new EventEmitter<Pagination>();

  protected appHookService = inject(AppHookService);

  private navigateTo(node: SiteEntry) {
    if (node?.entry?.guid) {
      this.store.dispatch(new NavigateLibraryAction(node.entry, this.navigateRoute));
    }
  }

  handleNodeClick(event: Event) {
    this.navigateTo((event as CustomEvent).detail?.node);
  }
}
