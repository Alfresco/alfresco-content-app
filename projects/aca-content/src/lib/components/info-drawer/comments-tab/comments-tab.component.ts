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

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { NodePermissionService, isLocked } from '@alfresco/aca-shared';
import { MatCardModule } from '@angular/material/card';
import { NodeCommentsModule } from '@alfresco/adf-content-services';

@Component({
  standalone: true,
  imports: [MatCardModule, NodeCommentsModule],
  selector: 'app-comments-tab',
  template: `<mat-card class="adf-comments-tab-container" appearance="raised"
    ><adf-node-comments [readOnly]="!canUpdateNode" [nodeId]="node?.id"></adf-node-comments
  ></mat-card>`,
  styles: ['app-comments-tab mat-card { padding: 16px }'],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./comments-tab.component.scss']
})
export class CommentsTabComponent implements OnInit {
  @Input()
  node: Node;

  canUpdateNode = false;

  constructor(private permission: NodePermissionService) {}

  ngOnInit(): void {
    if (!this.node) {
      this.canUpdateNode = false;
    }
    if (this.node.isFolder || (this.node.isFile && !isLocked({ entry: this.node }))) {
      this.canUpdateNode = this.permission.check(this.node, ['update']);
    }
  }
}
