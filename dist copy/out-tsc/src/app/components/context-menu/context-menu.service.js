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
import { Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { ContextMenuComponent } from './context-menu.component';
import { UserPreferencesService } from '@alfresco/adf-core';
import { CONTEXT_MENU_DIRECTION } from './direction.token';
var ContextMenuService = /** @class */ (function() {
  function ContextMenuService(injector, overlay, userPreferenceService) {
    var _this = this;
    this.injector = injector;
    this.overlay = overlay;
    this.userPreferenceService = userPreferenceService;
    this.userPreferenceService
      .select('textOrientation')
      .subscribe(function(textOrientation) {
        _this.direction = textOrientation;
      });
  }
  ContextMenuService.prototype.open = function(config) {
    var overlay = this.createOverlay(config);
    var overlayRef = new ContextMenuOverlayRef(overlay);
    this.attachDialogContainer(overlay, overlayRef);
    return overlayRef;
  };
  ContextMenuService.prototype.createOverlay = function(config) {
    var overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  };
  ContextMenuService.prototype.attachDialogContainer = function(
    overlay,
    contextmenuOverlayRef
  ) {
    var injector = this.createInjector(contextmenuOverlayRef);
    var containerPortal = new ComponentPortal(
      ContextMenuComponent,
      null,
      injector
    );
    var containerRef = overlay.attach(containerPortal);
    return containerRef.instance;
  };
  ContextMenuService.prototype.createInjector = function(
    contextmenuOverlayRef
  ) {
    var injectionTokens = new WeakMap();
    injectionTokens.set(ContextMenuOverlayRef, contextmenuOverlayRef);
    injectionTokens.set(CONTEXT_MENU_DIRECTION, this.direction);
    return new PortalInjector(this.injector, injectionTokens);
  };
  ContextMenuService.prototype.getOverlayConfig = function(config) {
    var _a = config.source,
      x = _a.x,
      y = _a.y;
    var positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo({ x: x, y: y })
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        }
      ]);
    var overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy: positionStrategy,
      direction: this.direction
    });
    return overlayConfig;
  };
  ContextMenuService = tslib_1.__decorate(
    [
      Injectable({
        providedIn: 'root'
      }),
      tslib_1.__metadata('design:paramtypes', [
        Injector,
        Overlay,
        UserPreferencesService
      ])
    ],
    ContextMenuService
  );
  return ContextMenuService;
})();
export { ContextMenuService };
//# sourceMappingURL=context-menu.service.js.map
