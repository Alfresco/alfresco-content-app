import { Injectable, Injector, ComponentRef, ElementRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { ContextMenuComponent } from './context-menu.component';
import { ContextmenuOverlayConfig } from './interfaces';

@Injectable()
export class ContextMenuService {
    constructor(
        private injector: Injector,
        private overlay: Overlay) { }

    open(config: ContextmenuOverlayConfig) {

        const overlay = this.createOverlay(config);

        const overlayRef = new ContextMenuOverlayRef(overlay);

        this.attachDialogContainer(overlay, config, overlayRef);

        overlay.backdropClick().subscribe(() => overlayRef.close());

        // prevent native contextmenu on overlay element if config.hasBackdrop is true
        if (config.hasBackdrop) {
            (<any>overlay)._backdropElement
                .addEventListener('contextmenu', () => {
                    event.preventDefault();
                    (<any>overlay)._backdropClick.next(null);
                }, true);
        }

        return overlayRef;
    }

    private createOverlay(config: ContextmenuOverlayConfig) {
        const overlayConfig = this.getOverlayConfig(config);
        return this.overlay.create(overlayConfig);
    }

    private attachDialogContainer(overlay: OverlayRef, config: ContextmenuOverlayConfig, contextmenuOverlayRef: ContextMenuOverlayRef) {
        const injector = this.createInjector(config, contextmenuOverlayRef);

        const containerPortal = new ComponentPortal(ContextMenuComponent, null, injector);
        const containerRef: ComponentRef<ContextMenuComponent> = overlay.attach(containerPortal);

        return containerRef.instance;
    }

    private createInjector(config: ContextmenuOverlayConfig, contextmenuOverlayRef: ContextMenuOverlayRef): PortalInjector {
        const injectionTokens = new WeakMap();

        injectionTokens.set(ContextMenuOverlayRef, contextmenuOverlayRef);

        return new PortalInjector(this.injector, injectionTokens);
    }

    private getOverlayConfig(config: ContextmenuOverlayConfig): OverlayConfig {
        const fakeElement: any = {
            getBoundingClientRect: (): ClientRect => ({
                bottom: config.source.clientY,
                height: 0,
                left: config.source.clientX,
                right: config.source.clientX,
                top: config.source.clientY,
                width: 0
            })
        };

        const positionStrategy = this.overlay.position()
            .connectedTo(
                new ElementRef(fakeElement),
                { originX: 'start', originY: 'bottom' },
                { overlayX: 'start', overlayY: 'top' })
            .withFallbackPosition(
                { originX: 'start', originY: 'top' },
                { overlayX: 'start', overlayY: 'bottom' })
            .withFallbackPosition(
                { originX: 'end', originY: 'top' },
                { overlayX: 'start', overlayY: 'top' })
            .withFallbackPosition(
                { originX: 'start', originY: 'top' },
                { overlayX: 'end', overlayY: 'top' })
            .withFallbackPosition(
                { originX: 'end', originY: 'center' },
                { overlayX: 'start', overlayY: 'center' })
            .withFallbackPosition(
                { originX: 'start', originY: 'center' },
                { overlayX: 'end', overlayY: 'center' }
            );

        const overlayConfig = new OverlayConfig({
            hasBackdrop: config.hasBackdrop,
            backdropClass: config.backdropClass,
            panelClass: config.panelClass,
            scrollStrategy: this.overlay.scrollStrategies.close(),
            positionStrategy
        });

        return overlayConfig;
    }
}
