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
/* tslint:disable:no-input-rename  */
import { Directive, HostListener, Input } from '@angular/core';
import { ContextMenuOverlayService } from './context-menu-overlay.service';
export class ContextMenuDirective {
  /**
   * @param {?} contextMenuService
   */
  constructor(contextMenuService) {
    this.contextMenuService = contextMenuService;
    /**
     * Is the menu enabled?
     */
    this.enabled = false;
  }
  /**
   * @param {?=} event
   * @return {?}
   */
  onShowContextMenu(event) {
    if (this.enabled) {
      if (event) {
        event.preventDefault();
      }
      if (this.links && this.links.length > 0) {
        this.contextMenuService.open({
          source: event,
          data: this.links
        });
      }
    }
  }
}
ContextMenuDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: '[adf-context-menu], [context-menu]'
      }
    ]
  }
];
/** @nocollapse */
ContextMenuDirective.ctorParameters = () => [
  { type: ContextMenuOverlayService }
];
ContextMenuDirective.propDecorators = {
  links: [{ type: Input, args: ['adf-context-menu'] }],
  enabled: [{ type: Input, args: ['adf-context-menu-enabled'] }],
  onShowContextMenu: [{ type: HostListener, args: ['contextmenu', ['$event']] }]
};
if (false) {
  /**
   * Items for the menu.
   * @type {?}
   */
  ContextMenuDirective.prototype.links;
  /**
   * Is the menu enabled?
   * @type {?}
   */
  ContextMenuDirective.prototype.enabled;
  /**
   * @type {?}
   * @private
   */
  ContextMenuDirective.prototype.contextMenuService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1tZW51LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImNvbnRleHQtbWVudS9jb250ZXh0LW1lbnUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0QsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFLM0UsTUFBTSxPQUFPLG9CQUFvQjs7OztJQVM3QixZQUFvQixrQkFBNkM7UUFBN0MsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUEyQjs7OztRQUZqRSxZQUFPLEdBQVksS0FBSyxDQUFDO0lBRTJDLENBQUM7Ozs7O0lBR3JFLGlCQUFpQixDQUFDLEtBQWtCO1FBQ2hDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLElBQUksS0FBSyxFQUFFO2dCQUNQLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUMxQjtZQUVELElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3JDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUM7b0JBQ3pCLE1BQU0sRUFBRSxLQUFLO29CQUNiLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSztpQkFDbkIsQ0FBQyxDQUFDO2FBQ047U0FDSjtJQUNMLENBQUM7OztZQTVCSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLG9DQUFvQzthQUNqRDs7OztZQUpRLHlCQUF5Qjs7O29CQU83QixLQUFLLFNBQUMsa0JBQWtCO3NCQUl4QixLQUFLLFNBQUMsMEJBQTBCO2dDQUtoQyxZQUFZLFNBQUMsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDOzs7Ozs7O0lBVHZDLHFDQUNhOzs7OztJQUdiLHVDQUN5Qjs7Ozs7SUFFYixrREFBcUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby1pbnB1dC1yZW5hbWUgICovXG5cbmltcG9ydCB7IERpcmVjdGl2ZSwgSG9zdExpc3RlbmVyLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udGV4dE1lbnVPdmVybGF5U2VydmljZSB9IGZyb20gJy4vY29udGV4dC1tZW51LW92ZXJsYXkuc2VydmljZSc7XG5cbkBEaXJlY3RpdmUoe1xuICAgIHNlbGVjdG9yOiAnW2FkZi1jb250ZXh0LW1lbnVdLCBbY29udGV4dC1tZW51XSdcbn0pXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnVEaXJlY3RpdmUge1xuICAgIC8qKiBJdGVtcyBmb3IgdGhlIG1lbnUuICovXG4gICAgQElucHV0KCdhZGYtY29udGV4dC1tZW51JylcbiAgICBsaW5rczogYW55W107XG5cbiAgICAvKiogSXMgdGhlIG1lbnUgZW5hYmxlZD8gKi9cbiAgICBASW5wdXQoJ2FkZi1jb250ZXh0LW1lbnUtZW5hYmxlZCcpXG4gICAgZW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb250ZXh0TWVudVNlcnZpY2U6IENvbnRleHRNZW51T3ZlcmxheVNlcnZpY2UpIHt9XG5cbiAgICBASG9zdExpc3RlbmVyKCdjb250ZXh0bWVudScsIFsnJGV2ZW50J10pXG4gICAgb25TaG93Q29udGV4dE1lbnUoZXZlbnQ/OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmtzICYmIHRoaXMubGlua3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLm9wZW4oe1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB0aGlzLmxpbmtzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
