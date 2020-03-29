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
import { Component, Input } from '@angular/core';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';
var VersionsTabComponent = /** @class */ (function() {
  function VersionsTabComponent() {
    this.isFileSelected = false;
  }
  VersionsTabComponent.prototype.ngOnInit = function() {
    this.updateState();
  };
  VersionsTabComponent.prototype.ngOnChanges = function() {
    this.updateState();
  };
  VersionsTabComponent.prototype.updateState = function() {
    if (this.node && this.node.nodeId) {
      // workaround for shared files type.
      this.isFileSelected = true;
    } else {
      this.isFileSelected = this.node.isFile;
    }
  };
  tslib_1.__decorate(
    [Input(), tslib_1.__metadata('design:type', MinimalNodeEntryEntity)],
    VersionsTabComponent.prototype,
    'node',
    void 0
  );
  VersionsTabComponent = tslib_1.__decorate(
    [
      Component({
        selector: 'app-versions-tab',
        template:
          '\n    <ng-container *ngIf="isFileSelected; else empty">\n      <adf-version-manager\n        [showComments]="\n          \'adf-version-manager.allowComments\' | adfAppConfig: true\n        "\n        [allowDownload]="\n          \'adf-version-manager.allowDownload\' | adfAppConfig: true\n        "\n        [node]="node"\n      >\n      </adf-version-manager>\n    </ng-container>\n\n    <ng-template #empty>\n      <div class="adf-manage-versions-empty">\n        <mat-icon class="adf-manage-versions-empty-icon">face</mat-icon>\n        {{ \'VERSION.SELECTION.EMPTY\' | translate }}\n      </div>\n    </ng-template>\n  '
      })
    ],
    VersionsTabComponent
  );
  return VersionsTabComponent;
})();
export { VersionsTabComponent };
//# sourceMappingURL=versions-tab.component.js.map
