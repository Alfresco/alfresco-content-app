/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { NodeEntry, NodeBodyLock, SharedLinkEntry } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { isLocked } from '../utils/node.utils';

@Directive({
  selector: '[acaLockNode]',
  exportAs: 'lockNode'
})
export class LockNodeDirective {
  @Input('acaLockNode')
  node: NodeEntry = null;

  @Output() toggle: EventEmitter<any> = new EventEmitter();
  @Output() lockError: EventEmitter<any> = new EventEmitter();
  @Output() unlockError: EventEmitter<any> = new EventEmitter();

  @HostListener('click')
  onClick() {
    this.toggleLock(this.node);
  }

  constructor(private alfrescoApiService: AlfrescoApiService) {}

  isNodeLocked(): boolean {
    return !!(this.node && isLocked(this.node));
  }

  private async toggleLock(node: NodeEntry | SharedLinkEntry) {
    const id = (<SharedLinkEntry>node).entry.nodeId || node.entry.id;

    if (isLocked(this.node)) {
      try {
        const response = await this.unlockNode(id);

        this.update(response.entry);
        this.toggle.emit(false);
      } catch (error) {
        this.unlockError.emit(error);
      }
    } else {
      try {
        const response = await this.lockNode(id);

        this.update(response.entry);
        this.toggle.emit(true);
      } catch (error) {
        this.lockError.emit(error);
      }
    }
  }

  private lockNode(nodeId: string) {
    return this.alfrescoApiService.nodesApi.lockNode(nodeId, <NodeBodyLock>{
      type: 'ALLOW_OWNER_CHANGES',
      lifetime: 'PERSISTENT'
    });
  }

  private unlockNode(nodeId: string) {
    return this.alfrescoApiService.nodesApi.unlockNode(nodeId);
  }

  private update(data) {
    const properties = this.node.entry.properties || {};

    properties['cm:lockLifetime'] = data.properties['cm:lockLifetime'];
    properties['cm:lockOwner'] = data.properties['cm:lockOwner'];
    properties['cm:lockType'] = data.properties['cm:lockType'];
  }
}
