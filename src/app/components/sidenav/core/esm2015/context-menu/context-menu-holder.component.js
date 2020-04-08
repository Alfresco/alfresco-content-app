/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { OverlayContainer } from '@angular/cdk/overlay';
import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  Component,
  HostListener,
  Input,
  Renderer2,
  ViewChild
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { ContextMenuService } from './context-menu.service';
export class ContextMenuHolderComponent {
  /**
   * @param {?} viewport
   * @param {?} overlayContainer
   * @param {?} contextMenuService
   * @param {?} renderer
   */
  constructor(viewport, overlayContainer, contextMenuService, renderer) {
    this.viewport = viewport;
    this.overlayContainer = overlayContainer;
    this.contextMenuService = contextMenuService;
    this.renderer = renderer;
    this.links = [];
    this.mouseLocation = { left: 0, top: 0 };
    this.menuElement = null;
    this.subscriptions = [];
    this.showIcons = false;
  }
  /**
   * @param {?=} event
   * @return {?}
   */
  onShowContextMenu(event) {
    if (event) {
      event.preventDefault();
    }
  }
  /**
   * @return {?}
   */
  onResize() {
    if (this.mdMenuElement) {
      this.updatePosition();
    }
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    this.subscriptions.push(
      this.contextMenuService.show.subscribe(
        /**
         * @param {?} mouseEvent
         * @return {?}
         */
        mouseEvent => this.showMenu(mouseEvent.event, mouseEvent.obj)
      ),
      this.menuTrigger.menuOpened.subscribe(
        /**
         * @return {?}
         */
        () => {
          /** @type {?} */
          const container = this.overlayContainer.getContainerElement();
          if (container) {
            this.contextMenuListenerFn = this.renderer.listen(
              container,
              'contextmenu'
              /**
               * @param {?} contextmenuEvent
               * @return {?}
               */,
              contextmenuEvent => {
                contextmenuEvent.preventDefault();
              }
            );
          }
          this.menuElement = this.getContextMenuElement();
        }
      ),
      this.menuTrigger.menuClosed.subscribe(
        /**
         * @return {?}
         */
        () => {
          this.menuElement = null;
          if (this.contextMenuListenerFn) {
            this.contextMenuListenerFn();
          }
        }
      )
    );
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    if (this.contextMenuListenerFn) {
      this.contextMenuListenerFn();
    }
    this.subscriptions.forEach(
      /**
       * @param {?} subscription
       * @return {?}
       */
      subscription => subscription.unsubscribe()
    );
    this.subscriptions = [];
    this.menuElement = null;
  }
  /**
   * @param {?} event
   * @param {?} menuItem
   * @return {?}
   */
  onMenuItemClick(event, menuItem) {
    if (menuItem && menuItem.model && menuItem.model.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    menuItem.subject.next(menuItem);
  }
  /**
   * @param {?} mouseEvent
   * @param {?} links
   * @return {?}
   */
  showMenu(mouseEvent, links) {
    this.links = links;
    if (mouseEvent) {
      this.mouseLocation = {
        left: mouseEvent.clientX,
        top: mouseEvent.clientY
      };
    }
    this.menuTrigger.openMenu();
    if (this.mdMenuElement) {
      this.updatePosition();
    }
  }
  /**
   * @return {?}
   */
  get mdMenuElement() {
    return this.menuElement;
  }
  /**
   * @private
   * @return {?}
   */
  locationCss() {
    return {
      left: this.mouseLocation.left + 'px',
      top: this.mouseLocation.top + 'px'
    };
  }
  /**
   * @private
   * @return {?}
   */
  updatePosition() {
    setTimeout(
      /**
       * @return {?}
       */
      () => {
        if (this.mdMenuElement.parentElement) {
          if (
            this.mdMenuElement.clientWidth + this.mouseLocation.left >
            this.viewport.getViewportRect().width
          ) {
            this.menuTrigger.menu.xPosition = 'before';
            this.mdMenuElement.parentElement.style.left =
              this.mouseLocation.left - this.mdMenuElement.clientWidth + 'px';
          } else {
            this.menuTrigger.menu.xPosition = 'after';
            this.mdMenuElement.parentElement.style.left = this.locationCss().left;
          }
          if (
            this.mdMenuElement.clientHeight + this.mouseLocation.top >
            this.viewport.getViewportRect().height
          ) {
            this.menuTrigger.menu.yPosition = 'above';
            this.mdMenuElement.parentElement.style.top =
              this.mouseLocation.top - this.mdMenuElement.clientHeight + 'px';
          } else {
            this.menuTrigger.menu.yPosition = 'below';
            this.mdMenuElement.parentElement.style.top = this.locationCss().top;
          }
        }
      },
      0
    );
  }
  /**
   * @private
   * @return {?}
   */
  getContextMenuElement() {
    return this.overlayContainer
      .getContainerElement()
      .querySelector('.context-menu');
  }
}
ContextMenuHolderComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-context-menu-holder',
        template: `
        <button mat-button [matMenuTriggerFor]="contextMenu"></button>
        <mat-menu #contextMenu="matMenu" class="context-menu">
            <ng-container *ngFor="let link of links">
                <button *ngIf="link.model?.visible"
                        [attr.data-automation-id]="'context-'+((link.title || link.model?.title) | translate)"
                        mat-menu-item
                        [disabled]="link.model?.disabled"
                        (click)="onMenuItemClick($event, link)">
                    <mat-icon *ngIf="showIcons && link.model?.icon">{{ link.model.icon }}</mat-icon>
                    {{ (link.title || link.model?.title) | translate }}
                </button>
            </ng-container>
        </mat-menu>
    `
      }
    ]
  }
];
/** @nocollapse */
ContextMenuHolderComponent.ctorParameters = () => [
  { type: ViewportRuler },
  { type: OverlayContainer },
  { type: ContextMenuService },
  { type: Renderer2 }
];
ContextMenuHolderComponent.propDecorators = {
  showIcons: [{ type: Input }],
  menuTrigger: [{ type: ViewChild, args: [MatMenuTrigger] }],
  onShowContextMenu: [
    { type: HostListener, args: ['contextmenu', ['$event']] }
  ],
  onResize: [{ type: HostListener, args: ['window:resize'] }]
};
if (false) {
  /** @type {?} */
  ContextMenuHolderComponent.prototype.links;
  /**
   * @type {?}
   * @private
   */
  ContextMenuHolderComponent.prototype.mouseLocation;
  /**
   * @type {?}
   * @private
   */
  ContextMenuHolderComponent.prototype.menuElement;
  /**
   * @type {?}
   * @private
   */
  ContextMenuHolderComponent.prototype.subscriptions;
  /**
   * @type {?}
   * @private
   */
  ContextMenuHolderComponent.prototype.contextMenuListenerFn;
  /** @type {?} */
  ContextMenuHolderComponent.prototype.showIcons;
  /** @type {?} */
  ContextMenuHolderComponent.prototype.menuTrigger;
  /**
   * @type {?}
   * @private
   */
  ContextMenuHolderComponent.prototype.viewport;
  /**
   * @type {?}
   * @private
   */
  ContextMenuHolderComponent.prototype.overlayContainer;
  /**
   * @type {?}
   * @private
   */
  ContextMenuHolderComponent.prototype.contextMenuService;
  /**
   * @type {?}
   * @private
   */
  ContextMenuHolderComponent.prototype.renderer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1tZW51LWhvbGRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJjb250ZXh0LW1lbnUvY29udGV4dC1tZW51LWhvbGRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN4RyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFbkQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFvQjVELE1BQU0sT0FBTywwQkFBMEI7Ozs7Ozs7SUE0Qm5DLFlBQ1ksUUFBdUIsRUFDdkIsZ0JBQWtDLEVBQ2xDLGtCQUFzQyxFQUN0QyxRQUFtQjtRQUhuQixhQUFRLEdBQVIsUUFBUSxDQUFlO1FBQ3ZCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFDbEMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUN0QyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBL0IvQixVQUFLLEdBQUcsRUFBRSxDQUFDO1FBRUgsa0JBQWEsR0FBa0MsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNuRSxnQkFBVyxHQUFHLElBQUksQ0FBQztRQUNuQixrQkFBYSxHQUFtQixFQUFFLENBQUM7UUFJM0MsY0FBUyxHQUFZLEtBQUssQ0FBQztJQXlCM0IsQ0FBQzs7Ozs7SUFuQkQsaUJBQWlCLENBQUMsS0FBa0I7UUFDaEMsSUFBSSxLQUFLLEVBQUU7WUFDUCxL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YSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7aUJBQ2hIO3FCQUFNO29CQUNILElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7b0JBQzFDLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQztpQkFDdkU7YUFDSjtRQUNMLENBQUMsR0FBRSxDQUFDLENBQUMsQ0FBQztJQUNWLENBQUM7Ozs7O0lBRU8scUJBQXFCO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixFQUFFLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7OztZQXJKSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLHlCQUF5QjtnQkFDbkMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7OztLQWNUO2FBQ0o7Ozs7WUF2QlEsYUFBYTtZQURiLGdCQUFnQjtZQUtoQixrQkFBa0I7WUFIaUMsU0FBUzs7O3dCQStCaEUsS0FBSzswQkFHTCxTQUFTLFNBQUMsY0FBYztnQ0FHeEIsWUFBWSxTQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQzt1QkFPdEMsWUFBWSxTQUFDLGVBQWU7Ozs7SUFwQjdCLDJDQUFXOzs7OztJQUVYLG1EQUEyRTs7Ozs7SUFDM0UsaURBQTJCOzs7OztJQUMzQixtREFBMkM7Ozs7O0lBQzNDLDJEQUEwQzs7SUFFMUMsK0NBQzJCOztJQUUzQixpREFDNEI7Ozs7O0lBaUJ4Qiw4Q0FBK0I7Ozs7O0lBQy9CLHNEQUEwQzs7Ozs7SUFDMUMsd0RBQThDOzs7OztJQUM5Qyw4Q0FBMkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBPdmVybGF5Q29udGFpbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgVmlld3BvcnRSdWxlciB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHsgQ29tcG9uZW50LCBIb3N0TGlzdGVuZXIsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgUmVuZGVyZXIyLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdE1lbnVUcmlnZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBDb250ZXh0TWVudVNlcnZpY2UgfSBmcm9tICcuL2NvbnRleHQtbWVudS5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhZGYtY29udGV4dC1tZW51LWhvbGRlcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGJ1dHRvbiBtYXQtYnV0dG9uIFttYXRNZW51VHJpZ2dlckZvcl09XCJjb250ZXh0TWVudVwiPjwvYnV0dG9uPlxuICAgICAgICA8bWF0LW1lbnUgI2NvbnRleHRNZW51PVwibWF0TWVudVwiIGNsYXNzPVwiY29udGV4dC1tZW51XCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBsaW5rIG9mIGxpbmtzXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cImxpbmsubW9kZWw/LnZpc2libGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuZGF0YS1hdXRvbWF0aW9uLWlkXT1cIidjb250ZXh0LScrKChsaW5rLnRpdGxlIHx8IGxpbmsubW9kZWw/LnRpdGxlKSB8IHRyYW5zbGF0ZSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0LW1lbnUtaXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cImxpbmsubW9kZWw/LmRpc2FibGVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJvbk1lbnVJdGVtQ2xpY2soJGV2ZW50LCBsaW5rKVwiPlxuICAgICAgICAgICAgICAgICAgICA8bWF0LWljb24gKm5nSWY9XCJzaG93SWNvbnMgJiYgbGluay5tb2RlbD8uaWNvblwiPnt7IGxpbmsubW9kZWwuaWNvbiB9fTwvbWF0LWljb24+XG4gICAgICAgICAgICAgICAgICAgIHt7IChsaW5rLnRpdGxlIHx8IGxpbmsubW9kZWw/LnRpdGxlKSB8IHRyYW5zbGF0ZSB9fVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvbWF0LW1lbnU+XG4gICAgYFxufSlcbmV4cG9ydCBjbGFzcyBDb250ZXh0TWVudUhvbGRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICBsaW5rcyA9IFtdO1xuXG4gICAgcHJpdmF0ZSBtb3VzZUxvY2F0aW9uOiB7IGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIgfSA9IHsgbGVmdDogMCwgdG9wOiAwIH07XG4gICAgcHJpdmF0ZSBtZW51RWxlbWVudCA9IG51bGw7XG4gICAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICAgIHByaXZhdGUgY29udGV4dE1lbnVMaXN0ZW5lckZuOiAoKSA9PiB2b2lkO1xuXG4gICAgQElucHV0KClcbiAgICBzaG93SWNvbnM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBWaWV3Q2hpbGQoTWF0TWVudVRyaWdnZXIpXG4gICAgbWVudVRyaWdnZXI6IE1hdE1lbnVUcmlnZ2VyO1xuXG4gICAgQEhvc3RMaXN0ZW5lcignY29udGV4dG1lbnUnLCBbJyRldmVudCddKVxuICAgIG9uU2hvd0NvbnRleHRNZW51KGV2ZW50PzogTW91c2VFdmVudCkge1xuICAgICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJylcbiAgICBvblJlc2l6ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubWRNZW51RWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgdmlld3BvcnQ6IFZpZXdwb3J0UnVsZXIsXG4gICAgICAgIHByaXZhdGUgb3ZlcmxheUNvbnRhaW5lcjogT3ZlcmxheUNvbnRhaW5lcixcbiAgICAgICAgcHJpdmF0ZSBjb250ZXh0TWVudVNlcnZpY2U6IENvbnRleHRNZW51U2VydmljZSxcbiAgICAgICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyXG4gICAgKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2Uuc2hvdy5zdWJzY3JpYmUoKG1vdXNlRXZlbnQpID0+IHRoaXMuc2hvd01lbnUobW91c2VFdmVudC5ldmVudCwgbW91c2VFdmVudC5vYmopKSxcblxuICAgICAgICAgICAgdGhpcy5tZW51VHJpZ2dlci5tZW51T3BlbmVkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5vdmVybGF5Q29udGFpbmVyLmdldENvbnRhaW5lckVsZW1lbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnVMaXN0ZW5lckZuID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oY29udGFpbmVyLCAnY29udGV4dG1lbnUnLCAoY29udGV4dG1lbnVFdmVudDogRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHRtZW51RXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMubWVudUVsZW1lbnQgPSB0aGlzLmdldENvbnRleHRNZW51RWxlbWVudCgpO1xuICAgICAgICAgICAgfSksXG5cbiAgICAgICAgICAgIHRoaXMubWVudVRyaWdnZXIubWVudUNsb3NlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubWVudUVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRleHRNZW51TGlzdGVuZXJGbikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51TGlzdGVuZXJGbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRleHRNZW51TGlzdGVuZXJGbikge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudUxpc3RlbmVyRm4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKChzdWJzY3JpcHRpb24pID0+IHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gW107XG5cbiAgICAgICAgdGhpcy5tZW51RWxlbWVudCA9IG51bGw7XG4gICAgfVxuXG4gICAgb25NZW51SXRlbUNsaWNrKGV2ZW50OiBFdmVudCwgbWVudUl0ZW06IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAobWVudUl0ZW0gJiYgbWVudUl0ZW0ubW9kZWwgJiYgbWVudUl0ZW0ubW9kZWwuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBtZW51SXRlbS5zdWJqZWN0Lm5leHQobWVudUl0ZW0pO1xuICAgIH1cblxuICAgIHNob3dNZW51KG1vdXNlRXZlbnQsIGxpbmtzKSB7XG4gICAgICAgIHRoaXMubGlua3MgPSBsaW5rcztcblxuICAgICAgICBpZiAobW91c2VFdmVudCkge1xuICAgICAgICAgICAgdGhpcy5tb3VzZUxvY2F0aW9uID0ge1xuICAgICAgICAgICAgICAgIGxlZnQ6IG1vdXNlRXZlbnQuY2xpZW50WCxcbiAgICAgICAgICAgICAgICB0b3A6IG1vdXNlRXZlbnQuY2xpZW50WVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWVudVRyaWdnZXIub3Blbk1lbnUoKTtcblxuICAgICAgICBpZiAodGhpcy5tZE1lbnVFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgbWRNZW51RWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWVudUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2NhdGlvbkNzcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMubW91c2VMb2NhdGlvbi5sZWZ0ICsgJ3B4JyxcbiAgICAgICAgICAgIHRvcDogdGhpcy5tb3VzZUxvY2F0aW9uLnRvcCArICdweCdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVBvc2l0aW9uKCkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1kTWVudUVsZW1lbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1kTWVudUVsZW1lbnQuY2xpZW50V2lkdGggKyB0aGlzLm1vdXNlTG9jYXRpb24ubGVmdCA+IHRoaXMudmlld3BvcnQuZ2V0Vmlld3BvcnRSZWN0KCkud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZW51VHJpZ2dlci5tZW51LnhQb3NpdGlvbiA9ICdiZWZvcmUnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1kTWVudUVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS5sZWZ0ID0gdGhpcy5tb3VzZUxvY2F0aW9uLmxlZnQgLSB0aGlzLm1kTWVudUVsZW1lbnQuY2xpZW50V2lkdGggKyAncHgnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWVudVRyaWdnZXIubWVudS54UG9zaXRpb24gPSAnYWZ0ZXInO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1kTWVudUVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS5sZWZ0ID0gdGhpcy5sb2NhdGlvbkNzcygpLmxlZnQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWRNZW51RWxlbWVudC5jbGllbnRIZWlnaHQgKyB0aGlzLm1vdXNlTG9jYXRpb24udG9wID4gdGhpcy52aWV3cG9ydC5nZXRWaWV3cG9ydFJlY3QoKS5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZW51VHJpZ2dlci5tZW51LnlQb3NpdGlvbiA9ICdhYm92ZSc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWRNZW51RWxlbWVudC5wYXJlbnRFbGVtZW50LnN0eWxlLnRvcCA9IHRoaXMubW91c2VMb2NhdGlvbi50b3AgLSB0aGlzLm1kTWVudUVsZW1lbnQuY2xpZW50SGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lbnVUcmlnZ2VyLm1lbnUueVBvc2l0aW9uID0gJ2JlbG93JztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZE1lbnVFbGVtZW50LnBhcmVudEVsZW1lbnQuc3R5bGUudG9wID0gdGhpcy5sb2NhdGlvbkNzcygpLnRvcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q29udGV4dE1lbnVFbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vdmVybGF5Q29udGFpbmVyLmdldENvbnRhaW5lckVsZW1lbnQoKS5xdWVyeVNlbGVjdG9yKCcuY29udGV4dC1tZW51Jyk7XG4gICAgfVxufVxuIl19
