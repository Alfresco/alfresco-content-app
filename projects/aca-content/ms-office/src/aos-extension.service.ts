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

/* cspell:disable */
import { AuthenticationService, NotificationService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { getFileExtension, supportedExtensions } from '@alfresco/aca-shared/rules';
import { AppSettingsService } from '@alfresco/aca-shared';

export interface IAosEditOnlineService {
  onActionEditOnlineAos(node: Node): void;
}

@Injectable({
  providedIn: 'root'
})
export class AosEditOnlineService implements IAosEditOnlineService {
  constructor(
    private authenticationService: AuthenticationService,
    private appSettings: AppSettingsService,
    private notificationService: NotificationService
  ) {}

  onActionEditOnlineAos(node: Node): void {
    if (node && this.isFile(node) && node.properties) {
      if (node.isLocked) {
        // const checkedOut = node.aspectNames.find(
        //   (aspect: string) => aspect === 'cm:checkedOut'
        // );
        const checkedOut = node.properties['cm:lockType'] === 'WRITE_LOCK' || node.properties['cm:lockType'] === 'READ_ONLY_LOCK';
        const lockOwner = node.properties['cm:lockOwner'];
        const differentLockOwner = lockOwner.id !== this.authenticationService.getEcmUsername();

        if (checkedOut && differentLockOwner) {
          this.onAlreadyLockedNotification(node.id, lockOwner.id);
        } else {
          this.triggerEditOnlineAos(node);
        }
      } else {
        this.triggerEditOnlineAos(node);
      }
    }
  }

  private getUserAgent(): string {
    return navigator.userAgent.toLowerCase();
  }

  private isWindows(): boolean {
    return this.getUserAgent().indexOf('win') !== -1;
  }

  private isMacOs(): boolean {
    return this.getUserAgent().indexOf('mac') !== -1;
  }

  private onAlreadyLockedNotification(nodeId: string, lockOwner: string) {
    this.notificationService.showError(`AOS.ERRORS.ALREADY_LOCKED`, null, {
      nodeId,
      lockOwner
    });
  }

  private getProtocolForFileExtension(fileExtension: string) {
    return fileExtension && supportedExtensions[fileExtension];
  }

  private triggerEditOnlineAos(node: Node): void {
    const aosHost = this.appSettings.aosHost;
    let url: string;
    const pathElements = (node.path?.elements || []).map((segment) => segment.name);

    if (!pathElements.length) {
      url = `${aosHost}/Company Home/_aos_nodeid/${this.getNodeId(node)}/${encodeURIComponent(node.name)}`;
    }

    if (pathElements.length === 1) {
      url = `${aosHost}/${encodeURIComponent(node.name)}`;
    }

    if (pathElements.length > 1) {
      const root = pathElements[1];
      url = `${aosHost}/${root}/_aos_nodeid/${this.getNodeId(node)}/${encodeURIComponent(node.name)}`;
    }

    const fileExtension = getFileExtension(node.name);
    const protocolHandler = this.getProtocolForFileExtension(fileExtension);

    if (protocolHandler === undefined) {
      this.notificationService.showError(`AOS.ERRORS.MISSING_PROTOCOL_HANDLER`, null, { nodeName: node.name });
      return;
    }

    if (!this.isWindows() && !this.isMacOs()) {
      this.notificationService.showError('AOS.ERRORS.UNSUPPORTED_PLATFORM');
    } else {
      this.openByUrl(protocolHandler, url);
    }
  }

  openByUrl(protocolHandler: string, url: string) {
    const finalUrl = protocolHandler + ':ofe%7Cu%7C' + url;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = finalUrl;

    document.body.appendChild(iframe);

    setTimeout(() => {
      if (iframe) {
        document.body.removeChild(iframe);
      }
    }, 500);
  }

  private isFile(node: Node): boolean {
    const implicitFile = (node as any).nodeId || (node as any).guid;

    return !!implicitFile || node.isFile;
  }

  private getNodeId(node: Node): string {
    return (node as any).nodeId || (node as any).guid || node.id;
  }
}
