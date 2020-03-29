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
import { Directive, HostListener } from '@angular/core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPreferencesService } from '@alfresco/adf-core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { takeUntil, filter } from 'rxjs/operators';
import { ContentManagementService } from '../services/content-management.service';
var DocumentListDirective = /** @class */ (function() {
  function DocumentListDirective(
    store,
    content,
    documentList,
    preferences,
    route,
    router
  ) {
    this.store = store;
    this.content = content;
    this.documentList = documentList;
    this.preferences = preferences;
    this.route = route;
    this.router = router;
    this.isLibrary = false;
    this.onDestroy$ = new Subject();
  }
  Object.defineProperty(
    DocumentListDirective.prototype,
    'sortingPreferenceKey',
    {
      get: function() {
        return this.route.snapshot.data.sortingPreferenceKey;
      },
      enumerable: true,
      configurable: true
    }
  );
  DocumentListDirective.prototype.ngOnInit = function() {
    var _this = this;
    this.documentList.stickyHeader = true;
    this.documentList.includeFields = ['isFavorite', 'aspectNames'];
    this.isLibrary =
      this.documentList.currentFolderId === '-mysites-' ||
      // workaround for custom node list
      this.router.url.endsWith('/libraries') ||
      this.router.url.startsWith('/search-libraries');
    if (this.sortingPreferenceKey) {
      var current = this.documentList.sorting;
      var key = this.preferences.get(
        this.sortingPreferenceKey + '.sorting.key',
        current[0]
      );
      var direction = this.preferences.get(
        this.sortingPreferenceKey + '.sorting.direction',
        current[1]
      );
      this.documentList.sorting = [key, direction];
      // TODO: bug in ADF, the `sorting` binding is not updated when changed from code
      this.documentList.data.setSorting({ key: key, direction: direction });
    }
    this.documentList.ready
      .pipe(
        filter(function() {
          return !_this.router.url.includes('viewer:view');
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe(function() {
        return _this.onReady();
      });
    this.content.reload.pipe(takeUntil(this.onDestroy$)).subscribe(function() {
      _this.reload(_this.selectedNode);
    });
    this.content.reset.pipe(takeUntil(this.onDestroy$)).subscribe(function() {
      _this.reset();
    });
  };
  DocumentListDirective.prototype.ngOnDestroy = function() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  };
  DocumentListDirective.prototype.onSortingChanged = function(event) {
    if (this.sortingPreferenceKey) {
      this.preferences.set(
        this.sortingPreferenceKey + '.sorting.key',
        event.detail.key
      );
      this.preferences.set(
        this.sortingPreferenceKey + '.sorting.direction',
        event.detail.direction
      );
    }
  };
  DocumentListDirective.prototype.onNodeSelect = function(event) {
    if (!!event.detail && !!event.detail.node) {
      this.updateSelection();
      this.selectedNode = event.detail.node;
    }
  };
  DocumentListDirective.prototype.onNodeUnselect = function() {
    this.updateSelection();
  };
  DocumentListDirective.prototype.onReady = function() {
    this.updateSelection();
  };
  DocumentListDirective.prototype.updateSelection = function() {
    var _this = this;
    var selection = this.documentList.selection.map(function(node) {
      node['isLibrary'] = _this.isLibrary;
      return node;
    });
    this.store.dispatch(new SetSelectedNodesAction(selection));
  };
  DocumentListDirective.prototype.reload = function(selectedNode) {
    this.documentList.resetSelection();
    if (selectedNode) {
      this.store.dispatch(new SetSelectedNodesAction([selectedNode]));
    } else {
      this.store.dispatch(new SetSelectedNodesAction([]));
    }
    this.documentList.reload();
  };
  DocumentListDirective.prototype.reset = function() {
    this.documentList.resetSelection();
    this.store.dispatch(new SetSelectedNodesAction([]));
  };
  tslib_1.__decorate(
    [
      HostListener('sorting-changed', ['$event']),
      tslib_1.__metadata('design:type', Function),
      tslib_1.__metadata('design:paramtypes', [CustomEvent]),
      tslib_1.__metadata('design:returntype', void 0)
    ],
    DocumentListDirective.prototype,
    'onSortingChanged',
    null
  );
  tslib_1.__decorate(
    [
      HostListener('node-select', ['$event']),
      tslib_1.__metadata('design:type', Function),
      tslib_1.__metadata('design:paramtypes', [CustomEvent]),
      tslib_1.__metadata('design:returntype', void 0)
    ],
    DocumentListDirective.prototype,
    'onNodeSelect',
    null
  );
  tslib_1.__decorate(
    [
      HostListener('node-unselect'),
      tslib_1.__metadata('design:type', Function),
      tslib_1.__metadata('design:paramtypes', []),
      tslib_1.__metadata('design:returntype', void 0)
    ],
    DocumentListDirective.prototype,
    'onNodeUnselect',
    null
  );
  DocumentListDirective = tslib_1.__decorate(
    [
      Directive({
        selector: '[acaDocumentList]'
      }),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        ContentManagementService,
        DocumentListComponent,
        UserPreferencesService,
        ActivatedRoute,
        Router
      ])
    ],
    DocumentListDirective
  );
  return DocumentListDirective;
})();
export { DocumentListDirective };
//# sourceMappingURL=document-list.directive.js.map
