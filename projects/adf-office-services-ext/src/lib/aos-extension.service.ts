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

/* cspell:disable */
import {
  AppConfigService,
  AuthenticationService,
  NotificationService
} from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';
import { supportedExtensions, getFileExtension } from './utils';

@Injectable({
  providedIn: 'root'
})
export class AosEditOnlineService {
  constructor(
    private alfrescoAuthenticationService: AuthenticationService,
    private appConfigService: AppConfigService,
    private notificationService: NotificationService
  ) {}

  onActionEditOnlineAos(node: MinimalNodeEntryEntity): void {
    if (node && node.isFile && node.properties) {
      if (node.isLocked) {
        // const checkedOut = node.aspectNames.find(
        //   (aspect: string) => aspect === 'cm:checkedOut'
        // );
        const checkedOut =
          node.properties['cm:lockType'] === 'WRITE_LOCK' ||
          node.properties['cm:lockType'] === 'READ_ONLY_LOCK';
        const lockOwner = node.properties['cm:lockOwner'];
        const differentLockOwner =
          lockOwner.id !== this.alfrescoAuthenticationService.getEcmUsername();

        if (checkedOut && differentLockOwner) {
          this.onAlreadyLockedNotification(node.id, lockOwner);
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
    return this.getUserAgent().indexOf('win') !== -1 ? true : false;
  }

  private isMacOs(): boolean {
    return this.getUserAgent().indexOf('mac') !== -1 ? true : false;
  }

  private onAlreadyLockedNotification(nodeId: string, lockOwner: string) {
    this.notificationService.openSnackMessage(
      `Document {nodeId} locked by {lockOwner}`,
      3000
    );
  }

  private getProtocolForFileExtension(fileExtension: string) {
    return supportedExtensions[fileExtension];
  }

  private triggerEditOnlineAos(node: MinimalNodeEntryEntity): void {
    const aosHost = this.appConfigService.get('aosHost');
    const url = `${aosHost}/_aos_nodeid/${node.id}/${encodeURIComponent(
      node.name
    )}`;
    const fileExtension = getFileExtension(node.name);
    const protocolHandler = this.getProtocolForFileExtension(fileExtension);

    if (protocolHandler === undefined) {
      this.notificationService.openSnackMessage(
        `No protocol handler found for {fileExtension}`,
        3000
      );
      return;
    }

    if (!this.isWindows() && !this.isMacOs()) {
      this.notificationService.openSnackMessage(
        'Only supported for Windows and Mac',
        3000
      );
    } else {
      this.aos_tryToLaunchOfficeByMsProtocolHandler(protocolHandler, url);
    }
  }

  private aos_tryToLaunchOfficeByMsProtocolHandler(
    protocolHandler: string,
    url: string
  ) {
    const protocolUrl = protocolHandler + ':ofe%7Cu%7C' + url;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = protocolUrl;

    document.body.appendChild(iframe);

    setTimeout(() => {
      if (iframe) {
        document.body.removeChild(iframe);
      }
    }, 500);
  }
}
