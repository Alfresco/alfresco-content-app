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

import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { DIALOG_COMPONENT_DATA, LocalizedDatePipe, TimeAgoPipe } from '@alfresco/adf-core';
import { Node } from '@alfresco/js-api';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ContentService } from '@alfresco/adf-content-services';

@Component({
  selector: 'app-folder-info',
  standalone: true,
  imports: [CommonModule, MatDividerModule, TimeAgoPipe, NgIf, TranslateModule, LocalizedDatePipe, LocalizedDatePipe],
  templateUrl: './folder-information.component.html',
  styleUrls: ['./folder-information.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-folder-info' }
})
export class FolderInformationComponent implements OnInit {
  readonly contentService = inject(ContentService);
  readonly translateService = inject(TranslateService);

  data: Node = inject(DIALOG_COMPONENT_DATA);
  name: string;
  size: string;
  location: string;
  created: Date;
  modified: Date;
  icon: string;

  ngOnInit() {
    this.name = this.data.name;
    this.size = this.translateService.instant('APP.FOLDER_INFO.CALCULATING');
    this.location = this.data.path.name;
    this.created = this.data.createdAt;
    this.modified = this.data.modifiedAt;
    this.icon = this.contentService.getNodeIcon(this.data);
  }
}
