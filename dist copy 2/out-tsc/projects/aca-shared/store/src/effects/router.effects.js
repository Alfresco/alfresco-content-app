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
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { RouterActionTypes } from '../actions/router.actions';
import { SnackbarErrorAction } from '../actions/snackbar.actions';
var RouterEffects = /** @class */ (function() {
  function RouterEffects(store, actions$, router) {
    var _this = this;
    this.store = store;
    this.actions$ = actions$;
    this.router = router;
    this.navigateUrl$ = this.actions$.pipe(
      ofType(RouterActionTypes.NavigateUrl),
      map(function(action) {
        if (action.payload) {
          _this.router.navigateByUrl(action.payload);
        }
      })
    );
    this.navigateRoute$ = this.actions$.pipe(
      ofType(RouterActionTypes.NavigateRoute),
      map(function(action) {
        _this.router.navigate(action.payload);
      })
    );
    this.navigateToFolder$ = this.actions$.pipe(
      ofType(RouterActionTypes.NavigateFolder),
      map(function(action) {
        if (action.payload && action.payload.entry) {
          _this.navigateToFolder(action.payload.entry);
        }
      })
    );
    this.navigateToParentFolder$ = this.actions$.pipe(
      ofType(RouterActionTypes.NavigateParentFolder),
      map(function(action) {
        if (action.payload && action.payload.entry) {
          _this.navigateToParentFolder(action.payload.entry);
        }
      })
    );
  }
  RouterEffects.prototype.navigateToFolder = function(node) {
    var _this = this;
    var link = null;
    var path = node.path,
      id = node.id;
    if (path && path.name && path.elements) {
      var isLibraryPath = this.isLibraryContent(path);
      var parent_1 = path.elements[path.elements.length - 1];
      var area = isLibraryPath ? '/libraries' : '/personal-files';
      if (!isLibraryPath) {
        link = [area, id];
      } else {
        // parent.id could be 'Site' folder or child as 'documentLibrary'
        link = [area, parent_1.name === 'Sites' ? {} : id];
      }
      setTimeout(function() {
        _this.router.navigate(link);
      }, 10);
    } else {
      this.router.navigate(['/personal-files', node.id]);
    }
  };
  RouterEffects.prototype.navigateToParentFolder = function(node) {
    var _this = this;
    var link = null;
    var path = node.path;
    if (path && path.name && path.elements) {
      var isLibraryPath = this.isLibraryContent(path);
      var parent_2 = path.elements[path.elements.length - 1];
      var area = isLibraryPath ? '/libraries' : '/personal-files';
      if (!isLibraryPath) {
        link = [area, parent_2.id];
      } else {
        // parent.id could be 'Site' folder or child as 'documentLibrary'
        link = [area, parent_2.name === 'Sites' ? {} : parent_2.id];
      }
      setTimeout(function() {
        _this.router.navigate(link);
      }, 10);
    } else {
      this.store.dispatch(
        new SnackbarErrorAction('APP.MESSAGES.ERRORS.CANNOT_NAVIGATE_LOCATION')
      );
    }
  };
  RouterEffects.prototype.isLibraryContent = function(path) {
    if (
      path &&
      path.elements.length >= 2 &&
      path.elements[1].name === 'Sites'
    ) {
      return true;
    }
    return false;
  };
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    RouterEffects.prototype,
    'navigateUrl$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    RouterEffects.prototype,
    'navigateRoute$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    RouterEffects.prototype,
    'navigateToFolder$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    RouterEffects.prototype,
    'navigateToParentFolder$',
    void 0
  );
  RouterEffects = tslib_1.__decorate(
    [
      Injectable(),
      tslib_1.__metadata('design:paramtypes', [Store, Actions, Router])
    ],
    RouterEffects
  );
  return RouterEffects;
})();
export { RouterEffects };
//# sourceMappingURL=router.effects.js.map
