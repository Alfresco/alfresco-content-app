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
    if (node.isFile) {
      if (node.isLocked) {
        const checkedOut = node.aspectNames.find(
          (aspect: string) => aspect === 'cm:checkedOut'
        );
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
    const url = `${aosHost}/_aos_nodeid/${node.id}/${node.name}`;
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

    const input = document.createElement('input');
    const inputTop = document.body.scrollTop + 10;
    input.setAttribute(
      'style',
      'z-index: 1000; background-color: rgba(0, 0, 0, 0); ' +
        'border: none; outline: none; position: absolute; left: 10px; top: ' +
        inputTop +
        'px;'
    );
    document.getElementsByTagName('body')[0].appendChild(input);
    input.focus();
    location.href = protocolUrl;

    setTimeout(function() {
      input.onblur = null;
      input.remove();
    }, 500);
  }
}
