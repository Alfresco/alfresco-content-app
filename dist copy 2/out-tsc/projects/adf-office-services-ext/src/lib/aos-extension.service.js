/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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
import * as tslib_1 from 'tslib';
/* cspell:disable */
import {
  AppConfigService,
  AuthenticationService,
  NotificationService
} from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { supportedExtensions, getFileExtension } from './utils';
var AosEditOnlineService = /** @class */ (function() {
  function AosEditOnlineService(
    alfrescoAuthenticationService,
    appConfigService,
    notificationService
  ) {
    this.alfrescoAuthenticationService = alfrescoAuthenticationService;
    this.appConfigService = appConfigService;
    this.notificationService = notificationService;
  }
  AosEditOnlineService.prototype.onActionEditOnlineAos = function(node) {
    if (node && this.isFile(node) && node.properties) {
      if (node.isLocked) {
        // const checkedOut = node.aspectNames.find(
        //   (aspect: string) => aspect === 'cm:checkedOut'
        // );
        var checkedOut =
          node.properties['cm:lockType'] === 'WRITE_LOCK' ||
          node.properties['cm:lockType'] === 'READ_ONLY_LOCK';
        var lockOwner = node.properties['cm:lockOwner'];
        var differentLockOwner =
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
  };
  AosEditOnlineService.prototype.getUserAgent = function() {
    return navigator.userAgent.toLowerCase();
  };
  AosEditOnlineService.prototype.isWindows = function() {
    return this.getUserAgent().indexOf('win') !== -1 ? true : false;
  };
  AosEditOnlineService.prototype.isMacOs = function() {
    return this.getUserAgent().indexOf('mac') !== -1 ? true : false;
  };
  AosEditOnlineService.prototype.onAlreadyLockedNotification = function(
    nodeId,
    lockOwner
  ) {
    this.notificationService.openSnackMessage(
      'Document {nodeId} locked by {lockOwner}',
      3000
    );
  };
  AosEditOnlineService.prototype.getProtocolForFileExtension = function(
    fileExtension
  ) {
    return supportedExtensions[fileExtension];
  };
  AosEditOnlineService.prototype.triggerEditOnlineAos = function(node) {
    var aosHost = this.appConfigService.get('aosHost');
    var url;
    var pathElements = (node.path.elements || []).map(function(segment) {
      return segment.name;
    });
    if (!pathElements.length) {
      url =
        aosHost +
        '/Company Home/_aos_nodeid/' +
        this.getNodeId(node) +
        '/' +
        encodeURIComponent(node.name);
    }
    if (pathElements.length === 1) {
      url = aosHost + '/' + encodeURIComponent(node.name);
    }
    if (pathElements.length > 1) {
      var root = pathElements[1];
      url =
        aosHost +
        '/' +
        root +
        '/_aos_nodeid/' +
        this.getNodeId(node) +
        '/' +
        encodeURIComponent(node.name);
    }
    var fileExtension = getFileExtension(node.name);
    var protocolHandler = this.getProtocolForFileExtension(fileExtension);
    if (protocolHandler === undefined) {
      this.notificationService.openSnackMessage(
        'No protocol handler found for {fileExtension}',
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
  };
  AosEditOnlineService.prototype.aos_tryToLaunchOfficeByMsProtocolHandler = function(
    protocolHandler,
    url
  ) {
    var protocolUrl = protocolHandler + ':ofe%7Cu%7C' + url;
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = protocolUrl;
    document.body.appendChild(iframe);
    setTimeout(function() {
      if (iframe) {
        document.body.removeChild(iframe);
      }
    }, 500);
  };
  AosEditOnlineService.prototype.isFile = function(node) {
    var implicitFile = node.nodeId || node.guid;
    return !!implicitFile || node.isFile;
  };
  AosEditOnlineService.prototype.getNodeId = function(node) {
    return node.nodeId || node.guid || node.id;
  };
  AosEditOnlineService = tslib_1.__decorate(
    [
      Injectable({
        providedIn: 'root'
      }),
      tslib_1.__metadata('design:paramtypes', [
        AuthenticationService,
        AppConfigService,
        NotificationService
      ])
    ],
    AosEditOnlineService
  );
  return AosEditOnlineService;
})();
export { AosEditOnlineService };
//# sourceMappingURL=aos-extension.service.js.map
