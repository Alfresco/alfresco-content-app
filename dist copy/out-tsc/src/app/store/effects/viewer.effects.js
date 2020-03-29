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
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import {
  ViewerActionTypes,
  getCurrentFolder,
  getAppSelection
} from '@alfresco/aca-shared/store';
import { Router, PRIMARY_OUTLET } from '@angular/router';
import { Store, createSelector } from '@ngrx/store';
import { AppExtensionService } from '../../extensions/extension.service';
export var fileToPreview = createSelector(
  getAppSelection,
  getCurrentFolder,
  function(selection, folder) {
    return {
      selection: selection,
      folder: folder
    };
  }
);
var ViewerEffects = /** @class */ (function() {
  function ViewerEffects(store, actions$, router, extensions) {
    var _this = this;
    this.store = store;
    this.actions$ = actions$;
    this.router = router;
    this.extensions = extensions;
    this.fullscreenViewer$ = this.actions$.pipe(
      ofType(ViewerActionTypes.FullScreen),
      map(function() {
        _this.enterFullScreen();
      })
    );
    this.viewNode$ = this.actions$.pipe(
      ofType(ViewerActionTypes.ViewNode),
      map(function(action) {
        if (action.viewNodeExtras) {
          var _a = action.viewNodeExtras,
            location_1 = _a.location,
            path = _a.path;
          if (location_1) {
            var navigation = _this.getNavigationCommands(location_1);
            _this.router.navigate(
              navigation.concat([
                { outlets: { viewer: ['view', action.nodeId] } }
              ]),
              {
                queryParams: { location: location_1 }
              }
            );
          }
          if (path) {
            _this.router.navigate(
              ['view', { outlets: { viewer: [action.nodeId] } }],
              {
                queryParams: { path: path }
              }
            );
          }
        } else {
          _this.router.navigate([
            'view',
            { outlets: { viewer: [action.nodeId] } }
          ]);
        }
      })
    );
    this.viewFile$ = this.actions$.pipe(
      ofType(ViewerActionTypes.ViewFile),
      map(function(action) {
        if (action.payload && action.payload.entry) {
          var _a = action.payload.entry,
            id = _a.id,
            nodeId = _a.nodeId,
            isFile = _a.isFile;
          if (
            _this.extensions.canPreviewNode(action.payload) &&
            (isFile || nodeId)
          ) {
            _this.displayPreview(nodeId || id, action.parentId);
          }
        } else {
          _this.store
            .select(fileToPreview)
            .pipe(take(1))
            .subscribe(function(result) {
              if (result.selection && result.selection.file) {
                var _a = result.selection.file.entry,
                  id = _a.id,
                  nodeId = _a.nodeId,
                  isFile = _a.isFile;
                if (
                  _this.extensions.canPreviewNode(action.payload) &&
                  (isFile || nodeId)
                ) {
                  var parentId = result.folder ? result.folder.id : null;
                  _this.displayPreview(nodeId || id, parentId);
                }
              }
            });
        }
      })
    );
  }
  ViewerEffects.prototype.displayPreview = function(nodeId, parentId) {
    if (!nodeId) {
      return;
    }
    var previewLocation = this.router.url;
    if (previewLocation.lastIndexOf('/') > 0) {
      previewLocation = previewLocation.substr(
        0,
        this.router.url.indexOf('/', 1)
      );
    }
    previewLocation = previewLocation.replace(/\//g, '');
    var path = [previewLocation];
    if (parentId) {
      path.push(parentId);
    }
    path.push('preview', nodeId);
    this.router.navigateByUrl(path.join('/'));
  };
  ViewerEffects.prototype.enterFullScreen = function() {
    var container = document.documentElement.querySelector(
      '.adf-viewer__fullscreen-container'
    );
    if (container) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
    }
  };
  ViewerEffects.prototype.getNavigationCommands = function(url) {
    var urlTree = this.router.parseUrl(url);
    var urlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    if (!urlSegmentGroup) {
      return [url];
    }
    var urlSegments = urlSegmentGroup.segments;
    return urlSegments.reduce(function(acc, item) {
      acc.push(item.path, item.parameters);
      return acc;
    }, []);
  };
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    ViewerEffects.prototype,
    'fullscreenViewer$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    ViewerEffects.prototype,
    'viewNode$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    ViewerEffects.prototype,
    'viewFile$',
    void 0
  );
  ViewerEffects = tslib_1.__decorate(
    [
      Injectable(),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        Actions,
        Router,
        AppExtensionService
      ])
    ],
    ViewerEffects
  );
  return ViewerEffects;
})();
export { ViewerEffects };
//# sourceMappingURL=viewer.effects.js.map
