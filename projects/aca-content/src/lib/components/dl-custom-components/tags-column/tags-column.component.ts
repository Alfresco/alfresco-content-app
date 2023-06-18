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

import { TagModule } from '@alfresco/adf-content-services';
import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: true,
  imports: [TagModule],
  selector: 'aca-tags-column',
  template: `
    <adf-tag-node-list [showDelete]="false" [limitTagsDisplayed]="true" [nodeId]="nodeId" (results)="onTagsLoaded()"> </adf-tag-node-list>
  `,
  styleUrls: ['./tags-column.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'adf-datatable-content-cell aca-tags-name-column'
  }
})
export class TagsColumnComponent implements OnInit {
  @Input()
  context: any;

  nodeId: string;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.nodeId = this.context?.row?.id;
  }

  onTagsLoaded(): void {
    this.cd.detectChanges();
  }
}
