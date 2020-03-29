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
import { Component, HostListener, Input } from '@angular/core';
import { MinimalNodeEntity } from '@alfresco/js-api';
import { ContentApiService } from '@alfresco/aca-shared';
import { AppExtensionService } from '../../extensions/extension.service';
import { Store } from '@ngrx/store';
import {
  SetInfoDrawerStateAction,
  ToggleInfoDrawerAction
} from '@alfresco/aca-shared/store';
var InfoDrawerComponent = /** @class */ (function() {
  function InfoDrawerComponent(store, contentApi, extensions) {
    this.store = store;
    this.contentApi = contentApi;
    this.extensions = extensions;
    this.isLoading = false;
    this.tabs = [];
  }
  InfoDrawerComponent.prototype.onEscapeKeyboardEvent = function(event) {
    this.close();
  };
  InfoDrawerComponent.prototype.ngOnInit = function() {
    this.tabs = this.extensions.getSidebarTabs();
  };
  InfoDrawerComponent.prototype.ngOnDestroy = function() {
    this.store.dispatch(new SetInfoDrawerStateAction(false));
  };
  InfoDrawerComponent.prototype.ngOnChanges = function() {
    if (this.node) {
      if (this.node['isLibrary']) {
        return this.setDisplayNode(this.node);
      }
      var entry = this.node.entry;
      var id = entry.nodeId || entry.id;
      return this.loadNodeInfo(id);
    }
  };
  InfoDrawerComponent.prototype.close = function() {
    this.store.dispatch(new ToggleInfoDrawerAction());
  };
  InfoDrawerComponent.prototype.loadNodeInfo = function(nodeId) {
    var _this = this;
    if (nodeId) {
      this.isLoading = true;
      this.contentApi.getNodeInfo(nodeId).subscribe(
        function(entity) {
          _this.setDisplayNode(entity);
          _this.isLoading = false;
        },
        function() {
          return (_this.isLoading = false);
        }
      );
    }
  };
  InfoDrawerComponent.prototype.setDisplayNode = function(node) {
    this.displayNode = node;
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', String)],
    InfoDrawerComponent.prototype,
    'nodeId',
    void 0
  );
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', MinimalNodeEntity)],
    InfoDrawerComponent.prototype,
    'node',
    void 0
  );
  tslib_1.__decorate(
    [
      HostListener('keydown.escape', ['$event']),
      tslib_1.__metadata('design:type', Function),
      tslib_1.__metadata('design:paramtypes', [KeyboardEvent]),
      tslib_1.__metadata('design:returntype', void 0)
    ],
    InfoDrawerComponent.prototype,
    'onEscapeKeyboardEvent',
    null
  );
  InfoDrawerComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'aca-info-drawer',
        templateUrl: './info-drawer.component.html'
      }),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        ContentApiService,
        AppExtensionService
      ])
    ],
    InfoDrawerComponent
  );
  return InfoDrawerComponent;
})();
export { InfoDrawerComponent };
//# sourceMappingURL=info-drawer.component.js.map
