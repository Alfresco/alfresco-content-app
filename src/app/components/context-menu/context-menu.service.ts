import { Injectable, Injector, ComponentRef, ElementRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { ContextMenuComponent } from './context-menu.component';
import { ContextmenuOverlayConfig } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {
  constructor(private injector: Injector, private overlay: Overlay) {}

  open(config: ContextmenuOverlayConfig) {
    const overlay = this.createOverlay(config);
    const overlayRef = new ContextMenuOverlayRef(overlay);

    this.attachDialogContainer(overlay, overlayRef);

    return overlayRef;
  }

  private createOverlay(config: ContextmenuOverlayConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(
    overlay: OverlayRef,
    contextmenuOverlayRef: ContextMenuOverlayRef
  ) {
    const injector = this.createInjector(contextmenuOverlayRef);

    const containerPortal = new ComponentPortal(
      ContextMenuComponent,
      null,
      injector
    );
    const containerRef: ComponentRef<ContextMenuComponent> = overlay.attach(
      containerPortal
    );

    return containerRef.instance;
  }

  private createInjector(
    contextmenuOverlayRef: ContextMenuOverlayRef
  ): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(ContextMenuOverlayRef, contextmenuOverlayRef);

    return new PortalInjector(this.injector, injectionTokens);
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
