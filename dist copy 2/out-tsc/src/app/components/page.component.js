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
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import {
  ReloadDocumentListAction,
  getCurrentFolder,
  getAppSelection,
  getDocumentDisplayMode,
  isInfoDrawerOpened,
  getSharedUrl,
  ViewNodeAction,
  SetSelectedNodesAction
} from '@alfresco/aca-shared/store';
import { isLocked, isLibrary } from '@alfresco/aca-shared';
var PageComponent = /** @class */ (function() {
  function PageComponent(store, extensions, content) {
    this.store = store;
    this.extensions = extensions;
    this.content = content;
    this.onDestroy$ = new Subject();
    this.title = 'Page';
    this.actions = [];
    this.viewerToolbarActions = [];
    this.canUpdateNode = false;
    this.canUpload = false;
    this.subscriptions = [];
  }
  PageComponent.prototype.ngOnInit = function() {
    var _this = this;
    this.sharedPreviewUrl$ = this.store.select(getSharedUrl);
    this.infoDrawerOpened$ = this.store.select(isInfoDrawerOpened).pipe(
      map(function(infoDrawerState) {
        return !_this.isOutletPreviewUrl() && infoDrawerState;
      })
    );
    this.documentDisplayMode$ = this.store.select(getDocumentDisplayMode);
    this.store
      .select(getAppSelection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(function(selection) {
        _this.selection = selection;
        _this.actions = _this.extensions.getAllowedToolbarActions();
        _this.viewerToolbarActions = _this.extensions.getViewerToolbarActions();
        _this.canUpdateNode =
          _this.selection.count === 1 &&
          _this.content.canUpdateNode(selection.first);
      });
    this.store
      .select(getCurrentFolder)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(function(node) {
        _this.canUpload = node && _this.content.canUploadContent(node);
      });
  };
  PageComponent.prototype.ngOnDestroy = function() {
    this.subscriptions.forEach(function(subscription) {
      return subscription.unsubscribe();
    });
    this.subscriptions = [];
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  };
  PageComponent.prototype.showPreview = function(node, extras) {
    if (node && node.entry) {
      var id = node.entry.nodeId || node.entry.guid || node.entry.id;
      this.store.dispatch(new ViewNodeAction(id, extras));
    }
  };
  PageComponent.prototype.getParentNodeId = function() {
    return this.node ? this.node.id : null;
  };
  PageComponent.prototype.imageResolver = function(row) {
    if (isLocked(row.node)) {
      return 'assets/images/baseline-lock-24px.svg';
    }
    if (isLibrary(row.node)) {
      return 'assets/images/baseline-library_books-24px.svg';
    }
    return null;
  };
  PageComponent.prototype.reload = function(selectedNode) {
    if (this.isOutletPreviewUrl()) {
      return;
    }
    this.store.dispatch(new ReloadDocumentListAction());
    if (selectedNode) {
      this.store.dispatch(new SetSelectedNodesAction([selectedNode]));
    }
  };
  PageComponent.prototype.trackByActionId = function(_, action) {
    return action.id;
  };
  PageComponent.prototype.trackById = function(_, obj) {
    return obj.id;
  };
  PageComponent.prototype.isOutletPreviewUrl = function() {
    return location.href.includes('viewer:view');
  };
  tslib_1.__decorate(
    [
      ViewChild(DocumentListComponent),
      tslib_1.__metadata('design:type', DocumentListComponent)
    ],
    PageComponent.prototype,
    'documentList',
    void 0
  );
  return PageComponent;
})();
export { PageComponent };
//# sourceMappingURL=page.component.js.map
