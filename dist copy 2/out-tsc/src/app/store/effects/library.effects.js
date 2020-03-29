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
  LibraryActionTypes,
  NavigateLibraryAction,
  NavigateRouteAction,
  SnackbarErrorAction,
  getAppSelection
} from '@alfresco/aca-shared/store';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, take } from 'rxjs/operators';
import { ContentApiService } from '@alfresco/aca-shared';
import { ContentManagementService } from '../../services/content-management.service';
var LibraryEffects = /** @class */ (function() {
  function LibraryEffects(store, actions$, content, contentApi) {
    var _this = this;
    this.store = store;
    this.actions$ = actions$;
    this.content = content;
    this.contentApi = contentApi;
    this.deleteLibrary$ = this.actions$.pipe(
      ofType(LibraryActionTypes.Delete),
      map(function(action) {
        if (action.payload) {
          _this.content.deleteLibrary(action.payload);
        } else {
          _this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe(function(selection) {
              if (selection && selection.library) {
                _this.content.deleteLibrary(selection.library.entry.id);
              }
            });
        }
      })
    );
    this.leaveLibrary$ = this.actions$.pipe(
      ofType(LibraryActionTypes.Leave),
      map(function(action) {
        if (action.payload) {
          _this.content.leaveLibrary(action.payload);
        } else {
          _this.store
            .select(getAppSelection)
            .pipe(take(1))
            .subscribe(function(selection) {
              if (selection && selection.library) {
                _this.content.leaveLibrary(selection.library.entry.id);
              }
            });
        }
      })
    );
    this.createLibrary$ = this.actions$.pipe(
      ofType(LibraryActionTypes.Create),
      mergeMap(function() {
        return _this.content.createLibrary();
      }),
      map(function(libraryId) {
        return new NavigateLibraryAction(libraryId);
      })
    );
    this.navigateLibrary$ = this.actions$.pipe(
      ofType(LibraryActionTypes.Navigate),
      map(function(action) {
        var libraryId = action.payload;
        if (libraryId) {
          _this.contentApi
            .getNode(libraryId, { relativePath: '/documentLibrary' })
            .pipe(
              map(function(node) {
                return node.entry.id;
              })
            )
            .subscribe(
              function(id) {
                _this.store.dispatch(
                  new NavigateRouteAction(['libraries', id])
                );
              },
              function() {
                _this.store.dispatch(
                  new SnackbarErrorAction('APP.MESSAGES.ERRORS.MISSING_CONTENT')
                );
              }
            );
        }
      })
    );
    this.updateLibrary$ = this.actions$.pipe(
      ofType(LibraryActionTypes.Update),
      map(function(action) {
        _this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(function(selection) {
            if (selection && selection.library) {
              var id = selection.library.entry.id;
              var _a = action.payload,
                title = _a.title,
                description = _a.description,
                visibility = _a.visibility;
              var siteBody = {
                title: title,
                description: description,
                visibility: visibility
              };
              _this.content.updateLibrary(id, siteBody);
            }
          });
      })
    );
  }
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    LibraryEffects.prototype,
    'deleteLibrary$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    LibraryEffects.prototype,
    'leaveLibrary$',
    void 0
  );
  tslib_1.__decorate(
    [Effect(), tslib_1.__metadata('design:type', Object)],
    LibraryEffects.prototype,
    'createLibrary$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    LibraryEffects.prototype,
    'navigateLibrary$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    LibraryEffects.prototype,
    'updateLibrary$',
    void 0
  );
  LibraryEffects = tslib_1.__decorate(
    [
      Injectable(),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        Actions,
        ContentManagementService,
        ContentApiService
      ])
    ],
    LibraryEffects
  );
  return LibraryEffects;
})();
export { LibraryEffects };
//# sourceMappingURL=library.effects.js.map
