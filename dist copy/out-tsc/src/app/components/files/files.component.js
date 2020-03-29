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
import { UploadService } from '@alfresco/adf-core';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ContentManagementService } from '../../services/content-management.service';
import { NodeActionsService } from '../../services/node-actions.service';
import { PageComponent } from '../page.component';
import { ContentApiService } from '@alfresco/aca-shared';
import { AppExtensionService } from '../../extensions/extension.service';
import { SetCurrentFolderAction, isAdmin } from '@alfresco/aca-shared/store';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { debounceTime, takeUntil } from 'rxjs/operators';
var FilesComponent = /** @class */ (function(_super) {
  tslib_1.__extends(FilesComponent, _super);
  function FilesComponent(
    router,
    route,
    contentApi,
    store,
    nodeActionsService,
    uploadService,
    content,
    extensions,
    breakpointObserver
  ) {
    var _this = _super.call(this, store, extensions, content) || this;
    _this.router = router;
    _this.route = route;
    _this.contentApi = contentApi;
    _this.nodeActionsService = nodeActionsService;
    _this.uploadService = uploadService;
    _this.breakpointObserver = breakpointObserver;
    _this.isValidPath = true;
    _this.isSmallScreen = false;
    _this.isAdmin = false;
    _this.columns = [];
    return _this;
  }
  FilesComponent.prototype.ngOnInit = function() {
    var _this = this;
    _super.prototype.ngOnInit.call(this);
    var _a = this,
      route = _a.route,
      nodeActionsService = _a.nodeActionsService,
      uploadService = _a.uploadService;
    var data = route.snapshot.data;
    this.title = data.title;
    route.params.subscribe(function(_a) {
      var folderId = _a.folderId;
      var nodeId = folderId || data.defaultNodeId;
      _this.contentApi.getNode(nodeId).subscribe(
        function(node) {
          _this.isValidPath = true;
          if (node.entry && node.entry.isFolder) {
            _this.updateCurrentNode(node.entry);
          } else {
            _this.router.navigate(['/personal-files', node.entry.parentId], {
              replaceUrl: true
            });
          }
        },
        function() {
          return (_this.isValidPath = false);
        }
      );
    });
    this.subscriptions = this.subscriptions.concat([
      nodeActionsService.contentCopied.subscribe(function(nodes) {
        return _this.onContentCopied(nodes);
      }),
      uploadService.fileUploadComplete
        .pipe(debounceTime(300))
        .subscribe(function(file) {
          return _this.onFileUploadedEvent(file);
        }),
      uploadService.fileUploadDeleted
        .pipe(debounceTime(300))
        .subscribe(function(file) {
          return _this.onFileUploadedEvent(file);
        }),
      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
        .subscribe(function(result) {
          _this.isSmallScreen = result.matches;
        })
    ]);
    this.store
      .select(isAdmin)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(function(value) {
        _this.isAdmin = value;
      });
    this.columns = this.extensions.documentListPresets.files || [];
  };
  FilesComponent.prototype.ngOnDestroy = function() {
    _super.prototype.ngOnDestroy.call(this);
    this.store.dispatch(new SetCurrentFolderAction(null));
  };
  FilesComponent.prototype.navigate = function(nodeId) {
    if (nodeId === void 0) {
      nodeId = null;
    }
    var location = this.router.url.match(/.*?(?=\/|$)/g)[1];
    var commands = ['/' + location];
    if (nodeId && !this.isRootNode(nodeId)) {
      commands.push(nodeId);
    }
    this.router.navigate(commands);
  };
  FilesComponent.prototype.navigateTo = function(node) {
    if (node && node.entry) {
      this.selectedNode = node;
      var _a = node.entry,
        id = _a.id,
        isFolder = _a.isFolder;
      if (isFolder) {
        this.navigate(id);
        return;
      }
      this.showPreview(node, { location: this.router.url });
    }
  };
  FilesComponent.prototype.onBreadcrumbNavigate = function(route) {
    // todo: review this approach once 5.2.3 is out
    if (this.nodePath && this.nodePath.length > 2) {
      if (
        this.nodePath[1].name === 'Sites' &&
        this.nodePath[2].id === route.id
      ) {
        return this.navigate(this.nodePath[3].id);
      }
    }
    this.navigate(route.id);
  };
  FilesComponent.prototype.onFileUploadedEvent = function(event) {
    var node = event.file.data;
    // check root and child nodes
    if (node && node.entry && node.entry.parentId === this.getParentNodeId()) {
      this.reload(this.selectedNode);
      return;
    }
    // check the child nodes to show dropped folder
    if (event && event.file.options.parentId === this.getParentNodeId()) {
      this.displayFolderParent(event.file.options.path, 0);
      return;
    }
    if (event && event.file.options.parentId) {
      if (this.nodePath) {
        var correspondingNodePath = this.nodePath.find(function(pathItem) {
          return pathItem.id === event.file.options.parentId;
        });
        // check if the current folder has the 'trigger-upload-folder' as one of its parents
        if (correspondingNodePath) {
          var correspondingIndex =
            this.nodePath.length - this.nodePath.indexOf(correspondingNodePath);
          this.displayFolderParent(event.file.options.path, correspondingIndex);
        }
      }
    }
  };
  FilesComponent.prototype.displayFolderParent = function(filePath, index) {
    if (filePath === void 0) {
      filePath = '';
    }
    var parentName = filePath.split('/')[index];
    var currentFoldersDisplayed = this.documentList.data.getRows() || [];
    var alreadyDisplayedParentFolder = currentFoldersDisplayed.find(function(
      row
    ) {
      return row.node.entry.isFolder && row.node.entry.name === parentName;
    });
    if (alreadyDisplayedParentFolder) {
      return;
    }
    this.reload(this.selectedNode);
  };
  FilesComponent.prototype.onContentCopied = function(nodes) {
    var _this = this;
    var newNode = nodes.find(function(node) {
      return (
        node && node.entry && node.entry.parentId === _this.getParentNodeId()
      );
    });
    if (newNode) {
      this.reload(this.selectedNode);
    }
  };
  // todo: review this approach once 5.2.3 is out
  FilesComponent.prototype.updateCurrentNode = function(node) {
    return tslib_1.__awaiter(this, void 0, void 0, function() {
      var elements;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            this.nodePath = null;
            if (!(node && node.path && node.path.elements))
              return [3 /*break*/, 3];
            elements = node.path.elements;
            this.nodePath = elements.map(function(pathElement) {
              return Object.assign({}, pathElement);
            });
            if (!(elements.length > 1)) return [3 /*break*/, 3];
            if (!(elements[1].name === 'User Homes')) return [3 /*break*/, 1];
            if (!this.isAdmin) {
              elements.splice(0, 2);
            }
            return [3 /*break*/, 3];
          case 1:
            if (!(elements[1].name === 'Sites')) return [3 /*break*/, 3];
            return [4 /*yield*/, this.normalizeSitePath(node)];
          case 2:
            _a.sent();
            _a.label = 3;
          case 3:
            this.node = node;
            this.store.dispatch(new SetCurrentFolderAction(node));
            return [2 /*return*/];
        }
      });
    });
  };
  // todo: review this approach once 5.2.3 is out
  FilesComponent.prototype.normalizeSitePath = function(node) {
    return tslib_1.__awaiter(this, void 0, void 0, function() {
      var elements, parentNode, docLib, siteFragment, siteNode;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            elements = node.path.elements;
            // remove 'Sites'
            elements.splice(1, 1);
            if (!this.isSiteContainer(node)) return [3 /*break*/, 2];
            return [
              4 /*yield*/,
              this.contentApi.getNodeInfo(node.parentId).toPromise()
            ];
          case 1:
            parentNode = _a.sent();
            node.name = parentNode.properties['cm:title'] || parentNode.name;
            // remove the site entry
            elements.splice(1, 1);
            return [3 /*break*/, 4];
          case 2:
            docLib = elements.findIndex(function(el) {
              return el.name === 'documentLibrary';
            });
            if (!(docLib > -1)) return [3 /*break*/, 4];
            siteFragment = elements[docLib - 1];
            return [
              4 /*yield*/,
              this.contentApi.getNodeInfo(siteFragment.id).toPromise()
            ];
          case 3:
            siteNode = _a.sent();
            // apply Site Name to the parent fragment
            siteFragment.name =
              siteNode.properties['cm:title'] || siteNode.name;
            elements.splice(docLib, 1);
            _a.label = 4;
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  FilesComponent.prototype.isSiteContainer = function(node) {
    if (node && node.aspectNames && node.aspectNames.length > 0) {
      return node.aspectNames.indexOf('st:siteContainer') >= 0;
    }
    return false;
  };
  FilesComponent.prototype.isRootNode = function(nodeId) {
    if (
      this.node &&
      this.node.path &&
      this.node.path.elements &&
      this.node.path.elements.length > 0
    ) {
      return this.node.path.elements[0].id === nodeId;
    }
    return false;
  };
  FilesComponent = tslib_1.__decorate(
    [
      Component({
        templateUrl: './files.component.html'
      }),
      tslib_1.__metadata('design:paramtypes', [
        Router,
        ActivatedRoute,
        ContentApiService,
        Store,
        NodeActionsService,
        UploadService,
        ContentManagementService,
        AppExtensionService,
        BreakpointObserver
      ])
    ],
    FilesComponent
  );
  return FilesComponent;
})(PageComponent);
export { FilesComponent };
//# sourceMappingURL=files.component.js.map
