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
import { map, switchMap, debounceTime, take, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  CreateFromTemplateSuccess,
  TemplateActionTypes,
  getCurrentFolder,
  SnackbarErrorAction
} from '@alfresco/aca-shared/store';
import { NodeTemplateService } from '../../services/node-template.service';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { ContentManagementService } from '../../services/content-management.service';
import { from, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
var TemplateEffects = /** @class */ (function() {
  function TemplateEffects(
    matDialog,
    content,
    store,
    apiService,
    actions$,
    nodeTemplateService
  ) {
    var _this = this;
    this.matDialog = matDialog;
    this.content = content;
    this.store = store;
    this.apiService = apiService;
    this.actions$ = actions$;
    this.nodeTemplateService = nodeTemplateService;
    this.fileFromTemplate$ = this.actions$.pipe(
      ofType(TemplateActionTypes.FileFromTemplate),
      map(function() {
        _this.openDialog({
          relativePath: 'Data Dictionary/Node Templates',
          selectionType: 'file'
        });
      })
    );
    this.folderFromTemplate$ = this.actions$.pipe(
      ofType(TemplateActionTypes.FolderFromTemplate),
      map(function() {
        return _this.openDialog({
          relativePath: 'Data Dictionary/Space Templates',
          selectionType: 'folder'
        });
      })
    );
    this.createFromTemplate$ = this.actions$.pipe(
      ofType(TemplateActionTypes.CreateFromTemplate),
      map(function(action) {
        _this.store
          .select(getCurrentFolder)
          .pipe(
            switchMap(function(folder) {
              return _this.copyNode(action.payload, folder.id);
            }),
            take(1)
          )
          .subscribe(function(node) {
            if (node) {
              _this.store.dispatch(new CreateFromTemplateSuccess(node.entry));
            }
          });
      })
    );
    this.createFromTemplateSuccess$ = this.actions$.pipe(
      ofType(TemplateActionTypes.CreateFromTemplateSuccess),
      map(function(payload) {
        _this.matDialog.closeAll();
        _this.content.reload.next(payload.node);
      })
    );
  }
  TemplateEffects.prototype.openDialog = function(config) {
    var _this = this;
    this.nodeTemplateService
      .selectTemplateDialog(config)
      .pipe(debounceTime(300))
      .subscribe(function(_a) {
        var node = _a[0];
        return _this.nodeTemplateService.createTemplateDialog(node);
      });
  };
  TemplateEffects.prototype.copyNode = function(source, parentId) {
    var _this = this;
    return from(
      this.apiService.getInstance().nodes.copyNode(source.id, {
        targetParentId: parentId,
        name: source.name
      })
    ).pipe(
      switchMap(function(node) {
        return _this.updateNode(node, {
          properties: {
            'cm:title': source.properties['cm:title'],
            'cm:description': source.properties['cm:description']
          }
        });
      }),
      catchError(function(error) {
        return _this.handleError(error);
      })
    );
  };
  TemplateEffects.prototype.updateNode = function(node, update) {
    return from(
      this.apiService.getInstance().nodes.updateNode(node.entry.id, update)
    ).pipe(
      catchError(function() {
        return of(node);
      })
    );
  };
  TemplateEffects.prototype.handleError = function(error) {
    var statusCode;
    try {
      statusCode = JSON.parse(error.message).error.statusCode;
    } catch (e) {
      statusCode = null;
    }
    if (statusCode !== 409) {
      this.store.dispatch(
        new SnackbarErrorAction('APP.MESSAGES.ERRORS.GENERIC')
      );
    } else {
      this.store.dispatch(
        new SnackbarErrorAction('APP.MESSAGES.ERRORS.CONFLICT')
      );
    }
    return of(null);
  };
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    TemplateEffects.prototype,
    'fileFromTemplate$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    TemplateEffects.prototype,
    'folderFromTemplate$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    TemplateEffects.prototype,
    'createFromTemplate$',
    void 0
  );
  tslib_1.__decorate(
    [Effect({ dispatch: false }), tslib_1.__metadata('design:type', Object)],
    TemplateEffects.prototype,
    'createFromTemplateSuccess$',
    void 0
  );
  TemplateEffects = tslib_1.__decorate(
    [
      Injectable(),
      tslib_1.__metadata('design:paramtypes', [
        MatDialog,
        ContentManagementService,
        Store,
        AlfrescoApiService,
        Actions,
        NodeTemplateService
      ])
    ],
    TemplateEffects
  );
  return TemplateEffects;
})();
export { TemplateEffects };
//# sourceMappingURL=template.effects.js.map
