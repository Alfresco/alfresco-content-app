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
import { NodeActionTypes, getAppSelection } from '@alfresco/aca-shared/store';
import { DownloadZipDialogComponent } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { ContentApiService } from '@alfresco/aca-shared';
var DownloadEffects = /** @class */ (function() {
  function DownloadEffects(store, actions$, contentApi, dialog) {
    var _this = this;
    this.store = store;
    this.actions$ = actions$;
    this.contentApi = contentApi;
    this.dialog = dialog;
    this.downloadNode$ = this.actions$.pipe(
      ofType(NodeActionTypes.Download),
      map(function(action) {
        if (action.payload && action.payload.length > 0) {
          _this.downloadNodes(action.payload);
        } else {
          _this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe(function(selection) {
              if (selection && !selection.isEmpty) {
                _this.downloadNodes(selection.nodes);
              }
            });
        }
      })
    );
  }
  DownloadEffects.prototype.downloadNodes = function(toDownload) {
    var _this = this;
    var nodes = toDownload.map(function(node) {
      var _a = node.entry,
        id = _a.id,
        nodeId = _a.nodeId,
        name = _a.name,
        isFile = _a.isFile,
        isFolder = _a.isFolder;
      return {
        id: _this.isSharedLinkPreview ? id : nodeId || id,
        name: name,
        isFile: isFile,
        isFolder: isFolder
      };
    });
    if (!nodes || nodes.length === 0) {
      return;
    }
    if (nodes.length === 1) {
      this.downloadNode(nodes[0]);
    } else {
      this.downloadZip(nodes);
    }
  };
  DownloadEffects.prototype.downloadNode = function(node) {
    if (node) {
      if (node.isFolder) {
        this.downloadZip([node]);
      } else {
        this.downloadFile(node);
      }
    }
  };
  DownloadEffects.prototype.downloadFile = function(node) {
    if (node && !this.isSharedLinkPreview) {
      this.download(this.contentApi.getContentUrl(node.id, true), node.name);
    }
    if (node && this.isSharedLinkPreview) {
      this.download(
        this.contentApi.getSharedLinkContent(node.id, false),
        node.name
      );
    }
  };
  DownloadEffects.prototype.downloadZip = function(nodes) {
    if (nodes && nodes.length > 0) {
      var nodeIds = nodes.map(function(node) {
        return node.id;
      });
      this.dialog.open(DownloadZipDialogComponent, {
        width: '600px',
        disableClose: true,
        data: {
          nodeIds: nodeIds
        }
      });
    }
  };
  DownloadEffects.prototype.download = function(url, fileName) {
    if (url && fileName) {
      var link = document.createElement('a');
      link.style.display = 'none';
      link.download = fileName;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  Object.defineProperty(DownloadEffects.prototype, 'isSharedLinkPreview', {
    get: function() {
      return location.href.includes('/preview/s/');
    },
    enumerable: true,
    configurable: true
  });
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    DownloadEffects.prototype,
    'downloadNode$',
    void 0
  );
  DownloadEffects = tslib_1.__decorate(
    [
      Injectable(),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        Actions,
        ContentApiService,
        MatDialog
      ])
    ],
    DownloadEffects
  );
  return DownloadEffects;
})();
export { DownloadEffects };
//# sourceMappingURL=download.effects.js.map
