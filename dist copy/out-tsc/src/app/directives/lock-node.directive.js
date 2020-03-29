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
import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { NodeEntry } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { isLocked } from '@alfresco/aca-shared';
var LockNodeDirective = /** @class */ (function() {
  function LockNodeDirective(alfrescoApiService) {
    this.alfrescoApiService = alfrescoApiService;
    this.node = null;
    this.toggle = new EventEmitter();
    this.lockError = new EventEmitter();
    this.unlockError = new EventEmitter();
  }
  LockNodeDirective.prototype.onClick = function() {
    this.toggleLock(this.node);
  };
  LockNodeDirective.prototype.isNodeLocked = function() {
    return !!(this.node && isLocked(this.node));
  };
  LockNodeDirective.prototype.toggleLock = function(node) {
    return tslib_1.__awaiter(this, void 0, void 0, function() {
      var id, response, error_1, response, error_2;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            id = node.entry.nodeId || node.entry.id;
            if (!isLocked(this.node)) return [3 /*break*/, 5];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [4 /*yield*/, this.unlockNode(id)];
          case 2:
            response = _a.sent();
            this.update(response.entry);
            this.toggle.emit(false);
            return [3 /*break*/, 4];
          case 3:
            error_1 = _a.sent();
            this.unlockError.emit(error_1);
            return [3 /*break*/, 4];
          case 4:
            return [3 /*break*/, 8];
          case 5:
            _a.trys.push([5, 7, , 8]);
            return [4 /*yield*/, this.lockNode(id)];
          case 6:
            response = _a.sent();
            this.update(response.entry);
            this.toggle.emit(true);
            return [3 /*break*/, 8];
          case 7:
            error_2 = _a.sent();
            this.lockError.emit(error_2);
            return [3 /*break*/, 8];
          case 8:
            return [2 /*return*/];
        }
      });
    });
  };
  LockNodeDirective.prototype.lockNode = function(nodeId) {
    return this.alfrescoApiService.nodesApi.lockNode(nodeId, {
      type: 'ALLOW_OWNER_CHANGES',
      lifetime: 'PERSISTENT'
    });
  };
  LockNodeDirective.prototype.unlockNode = function(nodeId) {
    return this.alfrescoApiService.nodesApi.unlockNode(nodeId);
  };
  LockNodeDirective.prototype.update = function(data) {
    var properties = this.node.entry.properties || {};
    properties['cm:lockLifetime'] = data.properties['cm:lockLifetime'];
    properties['cm:lockOwner'] = data.properties['cm:lockOwner'];
    properties['cm:lockType'] = data.properties['cm:lockType'];
  };
  tslib_1.__decorate(
    [Input('acaLockNode'), tslib_1.__metadata('design:type', NodeEntry)],
    LockNodeDirective.prototype,
    'node',
    void 0
  );
  tslib_1.__decorate(
    [Output(), tslib_1.__metadata('design:type', EventEmitter)],
    LockNodeDirective.prototype,
    'toggle',
    void 0
  );
  tslib_1.__decorate(
    [Output(), tslib_1.__metadata('design:type', EventEmitter)],
    LockNodeDirective.prototype,
    'lockError',
    void 0
  );
  tslib_1.__decorate(
    [Output(), tslib_1.__metadata('design:type', EventEmitter)],
    LockNodeDirective.prototype,
    'unlockError',
    void 0
  );
  tslib_1.__decorate(
    [
      HostListener('click'),
      tslib_1.__metadata('design:type', Function),
      tslib_1.__metadata('design:paramtypes', []),
      tslib_1.__metadata('design:returntype', void 0)
    ],
    LockNodeDirective.prototype,
    'onClick',
    null
  );
  LockNodeDirective = tslib_1.__decorate(
    [
      Directive({
        selector: '[acaLockNode]',
        exportAs: 'lockNode'
      }),
      tslib_1.__metadata('design:paramtypes', [AlfrescoApiService])
    ],
    LockNodeDirective
  );
  return LockNodeDirective;
})();
export { LockNodeDirective };
//# sourceMappingURL=lock-node.directive.js.map
