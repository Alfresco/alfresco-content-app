import {
  AppConfigService,
  AuthenticationService,
  NotificationService
} from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';

@Injectable({
  providedIn: 'root'
})
export class AosEditOnlineService {
  static ECM_HOST_CONFIG_KEY = 'ecmHost';
  static AOS_EDITONLINE_ACTION_HANDLER_KEY = 'aos-editonline';
  static MS_PROTOCOL_NAMES: any = {
    doc: 'ms-word',
    docx: 'ms-word',
    docm: 'ms-word',
    dot: 'ms-word',
    dotx: 'ms-word',
    dotm: 'ms-word',
    xls: 'ms-excel',
    xlsx: 'ms-excel',
    xlsb: 'ms-excel',
    xlsm: 'ms-excel',
    xlt: 'ms-excel',
    xltx: 'ms-excel',
    xltm: 'ms-excel',
    ppt: 'ms-powerpoint',
    pptx: 'ms-powerpoint',
    pot: 'ms-powerpoint',
    potx: 'ms-powerpoint',
    potm: 'ms-powerpoint',
    pptm: 'ms-powerpoint',
    pps: 'ms-powerpoint',
    ppsx: 'ms-powerpoint',
    ppam: 'ms-powerpoint',
    ppsm: 'ms-powerpoint',
    sldx: 'ms-powerpoint',
    sldm: 'ms-powerpoint'
  };

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
    return AosEditOnlineService.MS_PROTOCOL_NAMES[fileExtension];
  }

  private triggerEditOnlineAos(node: MinimalNodeEntryEntity): void {
    const ecmHost = this.appConfigService.get<string>(
      AosEditOnlineService.ECM_HOST_CONFIG_KEY
    );
    const url =
      ecmHost +
      '/alfresco/aos/' +
      '_aos_nodeid' +
      '/' +
      node.id +
      '/' +
      node.name;

    const fileExtension =
      node.name.split('.').pop() !== null
        ? node.name
            .split('.')
            .pop()
            .toLowerCase()
        : '';
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
