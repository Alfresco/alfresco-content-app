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
import {
  Component,
  ViewEncapsulation,
  HostListener,
  Optional,
  Inject,
  QueryList,
  ViewChildren
} from '@angular/core';
import { trigger } from '@angular/animations';
import { DOWN_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { MatMenuItem } from '@angular/material';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { contextMenuAnimation } from './animations';
import { CONTEXT_MENU_DATA } from './context-menu.tokens';
export class ContextMenuListComponent {
  /**
   * @param {?} contextMenuOverlayRef
   * @param {?} data
   */
  constructor(contextMenuOverlayRef, data) {
    this.contextMenuOverlayRef = contextMenuOverlayRef;
    this.data = data;
    this.links = this.data;
  }
  /**
   * @param {?} event
   * @return {?}
   */
  handleKeydownEscape(event) {
    if (event) {
      this.contextMenuOverlayRef.close();
    }
  }
  /**
   * @param {?} event
   * @return {?}
   */
  handleKeydownEvent(event) {
    if (event) {
      /** @type {?} */
      const keyCode = event.keyCode;
      if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
        this.keyManager.onKeydown(event);
      }
    }
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
    this.contextMenuOverlayRef.close();
  }
  /**
   * @return {?}
   */
  ngAfterViewInit() {
    this.keyManager = new FocusKeyManager(this.items);
    this.keyManager.setFirstItemActive();
  }
}
ContextMenuListComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'adf-context-menu',
        template: `
        <div mat-menu class="mat-menu-panel" @panelAnimation>
            <div id="adf-context-menu-content" class="mat-menu-content">
                <ng-container *ngFor="let link of links">
                    <button *ngIf="link.model?.visible"
                            [attr.data-automation-id]="'context-'+((link.title || link.model?.title) | translate)"
                            mat-menu-item
                            [disabled]="link.model?.disabled"
                            (click)="onMenuItemClick($event, link)">
                        <mat-icon *ngIf="link.model?.icon">{{ link.model.icon }}</mat-icon>
                        <span>{{ (link.title || link.model?.title) | translate }}</span>
                    </button>
                </ng-container>
            </div>
        </div>
    `,
        host: {
          role: 'menu',
          class: 'adf-context-menu'
        },
        encapsulation: ViewEncapsulation.None,
        animations: [trigger('panelAnimation', contextMenuAnimation)]
      }
    ]
  }
];
/** @nocollapse */
ContextMenuListComponent.ctorParameters = () => [
  {
    type: ContextMenuOverlayRef,
    decorators: [{ type: Inject, args: [ContextMenuOverlayRef] }]
  },
  {
    type: undefined,
    decorators: [
      { type: Optional },
      { type: Inject, args: [CONTEXT_MENU_DATA] }
    ]
  }
];
ContextMenuListComponent.propDecorators = {
  items: [{ type: ViewChildren, args: [MatMenuItem] }],
  handleKeydownEscape: [
    { type: HostListener, args: ['document:keydown.Escape', ['$event']] }
  ],
  handleKeydownEvent: [
    { type: HostListener, args: ['document:keydown', ['$event']] }
  ]
};
if (false) {
  /**
   * @type {?}
   * @private
   */
  ContextMenuListComponent.prototype.keyManager;
  /** @type {?} */
  ContextMenuListComponent.prototype.items;
  /** @type {?} */
  ContextMenuListComponent.prototype.links;
  /**
   * @type {?}
   * @private
   */
  ContextMenuListComponent.prototype.contextMenuOverlayRef;
  /**
   * @type {?}
   * @private
   */
  ContextMenuListComponent.prototype.data;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1tZW51LWxpc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiY29udGV4dC1tZW51L2NvbnRleHQtbWVudS1saXN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQ0gsU0FBUyxFQUFFLGlCQUFpQixFQUFFLFlBQVksRUFDMUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUM1QyxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQy9ELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNwRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQTZCMUQsTUFBTSxPQUFPLHdCQUF3Qjs7Ozs7SUFzQmpDLFlBQzJDLHFCQUE0QyxFQUNwQyxJQUFTO1FBRGpCLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFDcEMsU0FBSSxHQUFKLElBQUksQ0FBSztRQUV4RCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDM0IsQ0FBQzs7Ozs7SUFyQkQsbUJBQW1CLENBQUMsS0FBb0I7UUFDcEMsSUFBSSxLQUFLLEVBQUU7WUFDUCxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDdEM7SUFDTCxDQUFDOzs7OztJQUdELGtCQUFrQixDQUFDLEtBQW9CO1FBQ25DLElBQUksS0FBSyxFQUFFOztrQkFDRCxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU87WUFDN0IsSUFBSSxPQUFPLEtBQUssUUFBUSxJQUFJLE9BQU8sS0FBSyxVQUFVLEVBQUU7Z0JBQ2hELElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3BDO1NBQ0o7SUFDTCxDQUFDOzs7Ozs7SUFTRCxlQUFlLENBQUMsS0FBWSxFQUFFLFFBQWE7UUFDdkMsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUN2RCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsS0FBSyxDQUFDLHdCQUF3QixFQUFFLENBQUM7WUFDakMsT0FBTztTQUNWO1FBRUQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3ZDLENBQUM7Ozs7SUFFRCxlQUFlO1FBQ1gsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLGVBQWUsQ0FBYyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQ3pDLENBQUM7OztZQXRFSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7S0FlVDtnQkFDRCxJQUFJLEVBQUU7b0JBQ0YsSUFBSSxFQUFFLE1BQU07b0JBQ1osS0FBSyxFQUFFLGtCQUFrQjtpQkFDNUI7Z0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLFVBQVUsRUFBRTtvQkFDUixPQUFPLENBQUMsZ0JBQWdCLEVBQUUsb0JBQW9CLENBQUM7aUJBQ2xEO2FBQ0o7Ozs7WUE5QlEscUJBQXFCLHVCQXNEckIsTUFBTSxTQUFDLHFCQUFxQjs0Q0FDNUIsUUFBUSxZQUFJLE1BQU0sU0FBQyxpQkFBaUI7OztvQkF0QnhDLFlBQVksU0FBQyxXQUFXO2tDQUd4QixZQUFZLFNBQUMseUJBQXlCLEVBQUUsQ0FBQyxRQUFRLENBQUM7aUNBT2xELFlBQVksU0FBQyxrQkFBa0IsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7Ozs7OztJQVg1Qyw4Q0FBaUQ7O0lBQ2pELHlDQUF5RDs7SUFDekQseUNBQWE7Ozs7O0lBb0JULHlEQUFtRjs7Ozs7SUFDbkYsd0NBQXdEIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtcbiAgICBDb21wb25lbnQsIFZpZXdFbmNhcHN1bGF0aW9uLCBIb3N0TGlzdGVuZXIsIEFmdGVyVmlld0luaXQsXG4gICAgT3B0aW9uYWwsIEluamVjdCwgUXVlcnlMaXN0LCBWaWV3Q2hpbGRyZW5cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyB0cmlnZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBET1dOX0FSUk9XLCBVUF9BUlJPVyB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQgeyBGb2N1c0tleU1hbmFnZXIgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBNYXRNZW51SXRlbSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IENvbnRleHRNZW51T3ZlcmxheVJlZiB9IGZyb20gJy4vY29udGV4dC1tZW51LW92ZXJsYXknO1xuaW1wb3J0IHsgY29udGV4dE1lbnVBbmltYXRpb24gfSBmcm9tICcuL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgQ09OVEVYVF9NRU5VX0RBVEEgfSBmcm9tICcuL2NvbnRleHQtbWVudS50b2tlbnMnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2FkZi1jb250ZXh0LW1lbnUnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgbWF0LW1lbnUgY2xhc3M9XCJtYXQtbWVudS1wYW5lbFwiIEBwYW5lbEFuaW1hdGlvbj5cbiAgICAgICAgICAgIDxkaXYgaWQ9XCJhZGYtY29udGV4dC1tZW51LWNvbnRlbnRcIiBjbGFzcz1cIm1hdC1tZW51LWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBsaW5rIG9mIGxpbmtzXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gKm5nSWY9XCJsaW5rLm1vZGVsPy52aXNpYmxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5kYXRhLWF1dG9tYXRpb24taWRdPVwiJ2NvbnRleHQtJysoKGxpbmsudGl0bGUgfHwgbGluay5tb2RlbD8udGl0bGUpIHwgdHJhbnNsYXRlKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0LW1lbnUtaXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJsaW5rLm1vZGVsPy5kaXNhYmxlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cIm9uTWVudUl0ZW1DbGljaygkZXZlbnQsIGxpbmspXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bWF0LWljb24gKm5nSWY9XCJsaW5rLm1vZGVsPy5pY29uXCI+e3sgbGluay5tb2RlbC5pY29uIH19PC9tYXQtaWNvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPnt7IChsaW5rLnRpdGxlIHx8IGxpbmsubW9kZWw/LnRpdGxlKSB8IHRyYW5zbGF0ZSB9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBob3N0OiB7XG4gICAgICAgIHJvbGU6ICdtZW51JyxcbiAgICAgICAgY2xhc3M6ICdhZGYtY29udGV4dC1tZW51J1xuICAgIH0sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBhbmltYXRpb25zOiBbXG4gICAgICAgIHRyaWdnZXIoJ3BhbmVsQW5pbWF0aW9uJywgY29udGV4dE1lbnVBbmltYXRpb24pXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBDb250ZXh0TWVudUxpc3RDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgICBwcml2YXRlIGtleU1hbmFnZXI6IEZvY3VzS2V5TWFuYWdlcjxNYXRNZW51SXRlbT47XG4gICAgQFZpZXdDaGlsZHJlbihNYXRNZW51SXRlbSkgaXRlbXM6IFF1ZXJ5TGlzdDxNYXRNZW51SXRlbT47XG4gICAgbGlua3M6IGFueVtdO1xuXG4gICAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6a2V5ZG93bi5Fc2NhcGUnLCBbJyRldmVudCddKVxuICAgIGhhbmRsZUtleWRvd25Fc2NhcGUoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51T3ZlcmxheVJlZi5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6a2V5ZG93bicsIFsnJGV2ZW50J10pXG4gICAgaGFuZGxlS2V5ZG93bkV2ZW50KGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgICAgICAgICBpZiAoa2V5Q29kZSA9PT0gVVBfQVJST1cgfHwga2V5Q29kZSA9PT0gRE9XTl9BUlJPVykge1xuICAgICAgICAgICAgICAgIHRoaXMua2V5TWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIEBJbmplY3QoQ29udGV4dE1lbnVPdmVybGF5UmVmKSBwcml2YXRlIGNvbnRleHRNZW51T3ZlcmxheVJlZjogQ29udGV4dE1lbnVPdmVybGF5UmVmLFxuICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KENPTlRFWFRfTUVOVV9EQVRBKSBwcml2YXRlIGRhdGE6IGFueVxuICAgICkge1xuICAgICAgICB0aGlzLmxpbmtzID0gdGhpcy5kYXRhO1xuICAgIH1cblxuICAgIG9uTWVudUl0ZW1DbGljayhldmVudDogRXZlbnQsIG1lbnVJdGVtOiBhbnkpIHtcbiAgICAgICAgaWYgKG1lbnVJdGVtICYmIG1lbnVJdGVtLm1vZGVsICYmIG1lbnVJdGVtLm1vZGVsLmRpc2FibGVkKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBtZW51SXRlbS5zdWJqZWN0Lm5leHQobWVudUl0ZW0pO1xuICAgICAgICB0aGlzLmNvbnRleHRNZW51T3ZlcmxheVJlZi5jbG9zZSgpO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5rZXlNYW5hZ2VyID0gbmV3IEZvY3VzS2V5TWFuYWdlcjxNYXRNZW51SXRlbT4odGhpcy5pdGVtcyk7XG4gICAgICAgIHRoaXMua2V5TWFuYWdlci5zZXRGaXJzdEl0ZW1BY3RpdmUoKTtcbiAgICB9XG59XG4iXX0=
