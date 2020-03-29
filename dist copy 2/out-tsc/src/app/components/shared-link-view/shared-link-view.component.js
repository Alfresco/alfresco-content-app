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
  SetSelectedNodesAction,
  getAppSelection
} from '@alfresco/aca-shared/store';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { forkJoin, from, of } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { AppExtensionService } from '../../extensions/extension.service';
var SharedLinkViewComponent = /** @class */ (function() {
  function SharedLinkViewComponent(
    route,
    store,
    extensions,
    alfrescoApiService
  ) {
    this.route = route;
    this.store = store;
    this.extensions = extensions;
    this.alfrescoApiService = alfrescoApiService;
    this.sharedLinkId = null;
    this.viewerToolbarActions = [];
  }
  SharedLinkViewComponent.prototype.ngOnInit = function() {
    var _this = this;
    this.route.params
      .pipe(
        flatMap(function(params) {
          return forkJoin(
            from(
              _this.alfrescoApiService.sharedLinksApi.getSharedLink(params.id)
            ),
            of(params.id)
          ).pipe(
            catchError(function() {
              return of([null, params.id]);
            })
          );
        })
      )
      .subscribe(function(_a) {
        var sharedEntry = _a[0],
          sharedId = _a[1];
        if (sharedEntry) {
          _this.store.dispatch(new SetSelectedNodesAction([sharedEntry]));
        }
        _this.sharedLinkId = sharedId;
      });
    this.store.select(getAppSelection).subscribe(function(selection) {
      if (!selection.isEmpty)
        _this.viewerToolbarActions = _this.extensions.getSharedLinkViewerToolbarActions();
    });
  };
  SharedLinkViewComponent.prototype.trackByActionId = function(_, action) {
    return action.id;
  };
  SharedLinkViewComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-shared-link-view',
        templateUrl: 'shared-link-view.component.html',
        styleUrls: ['shared-link-view.component.scss'],
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-shared-link-view' }
      }),
      tslib_1.__metadata('design:paramtypes', [
        ActivatedRoute,
        Store,
        AppExtensionService,
        AlfrescoApiService
      ])
    ],
    SharedLinkViewComponent
  );
  return SharedLinkViewComponent;
})();
export { SharedLinkViewComponent };
//# sourceMappingURL=shared-link-view.component.js.map
