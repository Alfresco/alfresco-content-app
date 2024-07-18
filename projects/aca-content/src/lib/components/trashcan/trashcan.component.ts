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

import { DocumentListPresetRef, DynamicColumnComponent } from '@alfresco/adf-extensions';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  ContextActionsDirective,
  PageComponent,
  PageLayoutComponent,
  PaginationDirective,
  ToolbarComponent,
  UserProfileService
} from '@alfresco/aca-shared';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DocumentListModule } from '@alfresco/adf-content-services';
import { DataTableModule, EmptyContentComponent, PaginationComponent } from '@alfresco/adf-core';
import { DocumentListDirective } from '../../directives/document-list.directive';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DocumentListModule,
    PaginationComponent,
    DataTableModule,
    DocumentListDirective,
    ContextActionsDirective,
    PaginationDirective,
    PageLayoutComponent,
    ToolbarComponent,
    EmptyContentComponent,
    DynamicColumnComponent
  ],
  templateUrl: './trashcan.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TrashcanComponent extends PageComponent implements OnInit {
  private userProfileService = inject(UserProfileService);

  user$ = this.userProfileService.userProfile$;
  columns: DocumentListPresetRef[] = [];

  ngOnInit() {
    super.ngOnInit();
    this.columns = this.extensions.documentListPresets.trashcan || [];
  }
}
