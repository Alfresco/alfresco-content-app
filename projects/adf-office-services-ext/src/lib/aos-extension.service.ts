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
    let url: string;
    const pathElements = (node.path.elements || []).map(
      segment => segment.name
    );

    if (!pathElements.length) {
      url = `${aosHost}/Company Home/_aos_nodeid/${this.getNodeId(
        node
      )}/${encodeURIComponent(node.name)}`;
    }

    if (pathElements.length === 1) {
      url = `${aosHost}/${encodeURIComponent(node.name)}`;
    }

    if (pathElements.length > 1) {
      const root = pathElements[1];
      url = `${aosHost}/${root}/_aos_nodeid/${this.getNodeId(
        node
      )}/${encodeURIComponent(node.name)}`;
    }

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

  private getNodeId(node: MinimalNodeEntryEntity): string {
    return (<any>node).nodeId || (<any>node).guid || node.id;
  }
}
