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

import { Injectable, Injector, ComponentRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { ContextMenuComponent } from './context-menu.component';
import { ContextmenuOverlayConfig } from './interfaces';
import { UserPreferencesService } from '@alfresco/adf-core';
import { Directionality } from '@angular/cdk/bidi';
import { CONTEXT_MENU_DIRECTION } from './direction.token';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {
  private direction: Directionality;

  constructor(private injector: Injector, private overlay: Overlay, private userPreferenceService: UserPreferencesService) {
    this.userPreferenceService.select('textOrientation').subscribe((textOrientation) => {
      this.direction = textOrientation;
    });
  }

  open(config: ContextmenuOverlayConfig): ContextMenuOverlayRef {
    const overlay = this.createOverlay(config);
    const overlayRef = new ContextMenuOverlayRef(overlay);

    this.attachDialogContainer(overlay, overlayRef);

    return overlayRef;
  }

  private createOverlay(config: ContextmenuOverlayConfig): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(overlay: OverlayRef, contextmenuOverlayRef: ContextMenuOverlayRef): ContextMenuComponent {
    const injector = this.createInjector(contextmenuOverlayRef);

    const containerPortal = new ComponentPortal(ContextMenuComponent, null, injector);
    const containerRef: ComponentRef<ContextMenuComponent> = overlay.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(contextmenuOverlayRef: ContextMenuOverlayRef): Injector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(ContextMenuOverlayRef, contextmenuOverlayRef);
    injectionTokens.set(CONTEXT_MENU_DIRECTION, this.direction);

    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: ContextMenuOverlayRef, useValue: contextmenuOverlayRef },
        { provide: CONTEXT_MENU_DIRECTION, useValue: this.direction }
      ]
    });
  }

  private getOverlayConfig(config: ContextmenuOverlayConfig): OverlayConfig {
    const { x, y } = config.source;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo({ x, y })
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        }
      ]);

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy,
      direction: this.direction
    });

    return overlayConfig;
  }
}
