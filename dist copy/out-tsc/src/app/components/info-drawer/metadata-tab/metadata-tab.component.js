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
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';
import { NodePermissionService, isLocked } from '@alfresco/aca-shared';
import { infoDrawerMetadataAspect } from '@alfresco/aca-shared/store';
import { AppExtensionService } from '../../../extensions/extension.service';
import { AppConfigService, NotificationService } from '@alfresco/adf-core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { ContentMetadataService } from '@alfresco/adf-content-services';
import { takeUntil } from 'rxjs/operators';
var MetadataTabComponent = /** @class */ (function() {
  function MetadataTabComponent(
    permission,
    extensions,
    appConfig,
    store,
    notificationService,
    contentMetadataService
  ) {
    this.permission = permission;
    this.extensions = extensions;
    this.appConfig = appConfig;
    this.store = store;
    this.notificationService = notificationService;
    this.contentMetadataService = contentMetadataService;
    this.onDestroy$ = new Subject();
    if (this.extensions.contentMetadata) {
      this.appConfig.config[
        'content-metadata'
      ] = this.extensions.contentMetadata;
    }
    this.displayAspect$ = this.store.select(infoDrawerMetadataAspect);
  }
  Object.defineProperty(MetadataTabComponent.prototype, 'canUpdateNode', {
    get: function() {
      if (this.node && !isLocked({ entry: this.node })) {
        return this.permission.check(this.node, ['update']);
      }
      return false;
    },
    enumerable: true,
    configurable: true
  });
  MetadataTabComponent.prototype.ngOnInit = function() {
    var _this = this;
    this.contentMetadataService.error
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(function(err) {
        _this.notificationService.showError(err.message);
      });
  };
  MetadataTabComponent.prototype.ngOnDestroy = function() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', MinimalNodeEntryEntity)],
    MetadataTabComponent.prototype,
    'node',
    void 0
  );
  MetadataTabComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-metadata-tab',
        template:
          '\n    <adf-content-metadata-card\n      [readOnly]="!canUpdateNode"\n      [preset]="\'custom\'"\n      [node]="node"\n      [displayAspect]="displayAspect$ | async"\n    >\n    </adf-content-metadata-card>\n  ',
        encapsulation: ViewEncapsulation.None,
        host: { class: 'app-metadata-tab' }
      }),
      tslib_1.__metadata('design:paramtypes', [
        NodePermissionService,
        AppExtensionService,
        AppConfigService,
        Store,
        NotificationService,
        ContentMetadataService
      ])
    ],
    MetadataTabComponent
  );
  return MetadataTabComponent;
})();
export { MetadataTabComponent };
//# sourceMappingURL=metadata-tab.component.js.map
