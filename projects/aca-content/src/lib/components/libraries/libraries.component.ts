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

import { NavigateLibraryAction } from '@alfresco/aca-shared/store';
import { SiteEntry } from '@alfresco/js-api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AppHookService,
  ContextActionsDirective,
  InfoDrawerComponent,
  PageComponent,
  PageLayoutComponent,
  PaginationDirective,
  ToolbarComponent
} from '@alfresco/aca-shared';
import { DocumentListPresetRef, ExtensionsModule } from '@alfresco/adf-extensions';
import { CommonModule } from '@angular/common';
import { DocumentListModule } from '@alfresco/adf-content-services';
import { DataTableModule, PaginationModule, TemplateModule } from '@alfresco/adf-core';
import { DocumentListDirective } from '../../directives/document-list.directive';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DocumentListModule,
    DocumentListDirective,
    ContextActionsDirective,
    TemplateModule,
    DataTableModule,
    ExtensionsModule,
    PaginationModule,
    PaginationDirective,
    InfoDrawerComponent,
    PageLayoutComponent,
    TranslateModule,
    ToolbarComponent
  ],
  templateUrl: './libraries.component.html',
  encapsulation: ViewEncapsulation.None
})
export class LibrariesComponent extends PageComponent implements OnInit {
  columns: DocumentListPresetRef[] = [];

  constructor(private appHookService: AppHookService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.subscriptions.push(
      this.appHookService.libraryDeleted.subscribe(() => this.reload()),
      this.appHookService.libraryUpdated.subscribe(() => this.reload()),
      this.appHookService.libraryLeft.subscribe(() => this.reload())
    );

    this.columns = this.extensions.documentListPresets.libraries || [];
  }

  navigateTo(node: SiteEntry) {
    if (node && node.entry && node.entry.guid) {
      this.store.dispatch(new NavigateLibraryAction(node.entry.guid));
    }
  }

  handleNodeClick(event: Event) {
    this.navigateTo((event as CustomEvent).detail?.node);
  }
}
