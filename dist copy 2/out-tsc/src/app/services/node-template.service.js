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
import { MatDialog } from '@angular/material';
import { CreateFromTemplateDialogComponent } from '../dialogs/node-template/create-from-template.dialog';
import { Subject, from, of } from 'rxjs';
import { AlfrescoApiService, TranslationService } from '@alfresco/adf-core';
import { switchMap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { SnackbarErrorAction } from '@alfresco/aca-shared/store';
import { ContentNodeSelectorComponent } from '@alfresco/adf-content-services';
var NodeTemplateService = /** @class */ (function() {
  function NodeTemplateService(store, alfrescoApiService, translation, dialog) {
    this.store = store;
    this.alfrescoApiService = alfrescoApiService;
    this.translation = translation;
    this.dialog = dialog;
    this.currentTemplateConfig = null;
  }
  NodeTemplateService.prototype.selectTemplateDialog = function(config) {
    var _this = this;
    this.currentTemplateConfig = config;
    var select = new Subject();
    select.subscribe({
      complete: this.close.bind(this)
    });
    var data = {
      title: this.title(config.selectionType),
      actionName: 'NEXT',
      dropdownHideMyFiles: true,
      currentFolderId: null,
      dropdownSiteList: null,
      breadcrumbTransform: this.transformNode.bind(this),
      select: select,
      showSearch: false,
      showDropdownSiteList: false,
      isSelectionValid: this.isSelectionValid.bind(this),
      rowFilter: this.rowFilter.bind(this)
    };
    from(
      this.alfrescoApiService.getInstance().nodes.getNodeInfo('-root-', {
        relativePath: config.relativePath
      })
    )
      .pipe(
        switchMap(function(node) {
          data.currentFolderId = node.id;
          return _this.dialog
            .open(ContentNodeSelectorComponent, {
              data: data,
              panelClass: [
                'adf-content-node-selector-dialog',
                'aca-template-node-selector-dialog'
              ],
              width: '630px'
            })
            .afterClosed();
        }),
        catchError(function(error) {
          _this.store.dispatch(
            new SnackbarErrorAction('APP.MESSAGES.ERRORS.GENERIC')
          );
          return of(error);
        })
      )
      .subscribe({
        next: function() {
          return select.complete();
        }
      });
    return select;
  };
  NodeTemplateService.prototype.createTemplateDialog = function(node) {
    return this.dialog.open(CreateFromTemplateDialogComponent, {
      data: node,
      panelClass: 'aca-create-from-template-dialog',
      width: '630px'
    });
  };
  NodeTemplateService.prototype.transformNode = function(node) {
    if (node && node.path && node.path && node.path.elements instanceof Array) {
      var _a = node.path.elements,
        elementsPath = _a === void 0 ? [] : _a;
      elementsPath = elementsPath.filter(function(path) {
        return path.name !== 'Company Home' && path.name !== 'Data Dictionary';
      });
      node.path.elements = elementsPath;
    }
    return node;
  };
  NodeTemplateService.prototype.isSelectionValid = function(node) {
    if (node.name === this.currentTemplateConfig.relativePath.split('/')[1]) {
      return false;
    }
    if (this.currentTemplateConfig.selectionType === 'folder') {
      return node.isFolder;
    }
    return node.isFile;
  };
  NodeTemplateService.prototype.close = function() {
    this.dialog.closeAll();
  };
  NodeTemplateService.prototype.title = function(selectionType) {
    if (selectionType === 'file') {
      return this.translation.instant(
        'NODE_SELECTOR.SELECT_FILE_TEMPLATE_TITLE'
      );
    }
    return this.translation.instant(
      'NODE_SELECTOR.SELECT_FOLDER_TEMPLATE_TITLE'
    );
  };
  NodeTemplateService.prototype.rowFilter = function(row) {
    var node = row.node.entry;
    return (
      node.nodeType !== 'app:filelink' && node.nodeType !== 'app:folderlink'
    );
  };
  NodeTemplateService = tslib_1.__decorate(
    [
      Injectable({
        providedIn: 'root'
      }),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        AlfrescoApiService,
        TranslationService,
        MatDialog
      ])
    ],
    NodeTemplateService
  );
  return NodeTemplateService;
})();
export { NodeTemplateService };
//# sourceMappingURL=node-template.service.js.map
