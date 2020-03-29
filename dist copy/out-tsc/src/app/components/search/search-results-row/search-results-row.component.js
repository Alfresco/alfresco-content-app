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
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { ViewNodeAction, NavigateToFolder } from '@alfresco/aca-shared/store';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
var SearchResultsRowComponent = /** @class */ (function() {
  function SearchResultsRowComponent(store, alfrescoApiService, router) {
    this.store = store;
    this.alfrescoApiService = alfrescoApiService;
    this.router = router;
    this.onDestroy$ = new Subject();
    this.name$ = new BehaviorSubject('');
    this.title$ = new BehaviorSubject('');
  }
  SearchResultsRowComponent.prototype.ngOnInit = function() {
    var _this = this;
    this.updateValues();
    this.alfrescoApiService.nodeUpdated
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(function(node) {
        var row = _this.context.row;
        if (row) {
          var entry = row.node.entry;
          if (entry.id === node.id) {
            entry.name = node.name;
            entry.properties = Object.assign({}, node.properties);
            _this.updateValues();
          }
        }
      });
  };
  SearchResultsRowComponent.prototype.updateValues = function() {
    this.node = this.context.row.node;
    var _a = this.node.entry,
      name = _a.name,
      properties = _a.properties;
    var title = properties ? properties['cm:title'] : '';
    this.name$.next(name);
    if (title !== name) {
      this.title$.next(title ? '( ' + title + ' )' : '');
    }
  };
  SearchResultsRowComponent.prototype.ngOnDestroy = function() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  };
  Object.defineProperty(SearchResultsRowComponent.prototype, 'description', {
    get: function() {
      var properties = this.node.entry.properties;
      return properties ? properties['cm:description'] : '';
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(SearchResultsRowComponent.prototype, 'modifiedAt', {
    get: function() {
      return this.node.entry.modifiedAt;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(SearchResultsRowComponent.prototype, 'size', {
    get: function() {
      var content = this.node.entry.content;
      return content ? content.sizeInBytes : null;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(SearchResultsRowComponent.prototype, 'user', {
    get: function() {
      return this.node.entry.modifiedByUser.displayName;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(SearchResultsRowComponent.prototype, 'isFile', {
    get: function() {
      return this.node.entry.isFile;
    },
    enumerable: true,
    configurable: true
  });
  SearchResultsRowComponent.prototype.showPreview = function(event) {
    event.stopPropagation();
    this.store.dispatch(
      new ViewNodeAction(this.node.entry.id, { location: this.router.url })
    );
  };
  SearchResultsRowComponent.prototype.navigate = function(event) {
    event.stopPropagation();
    this.store.dispatch(new NavigateToFolder(this.node));
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', Object)],
    SearchResultsRowComponent.prototype,
    'context',
    void 0
  );
  SearchResultsRowComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'aca-search-results-row',
        templateUrl: './search-results-row.component.html',
        styleUrls: ['./search-results-row.component.scss'],
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
        host: { class: 'aca-search-results-row' }
      }),
      tslib_1.__metadata('design:paramtypes', [
        Store,
        AlfrescoApiService,
        Router
      ])
    ],
    SearchResultsRowComponent
  );
  return SearchResultsRowComponent;
})();
export { SearchResultsRowComponent };
//# sourceMappingURL=search-results-row.component.js.map
