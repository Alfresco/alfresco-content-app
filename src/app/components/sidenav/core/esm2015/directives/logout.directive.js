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
import { Input, Directive, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
export class LogoutDirective {
  /**
   * @param {?} elementRef
   * @param {?} renderer
   * @param {?} router
   * @param {?} auth
   */
  constructor(elementRef, renderer, router, auth) {
    this.elementRef = elementRef;
    this.renderer = renderer;
    this.router = router;
    this.auth = auth;
    /**
     * URI to redirect to after logging out.
     */
    this.redirectUri = '/login';
    /**
     * Enable redirecting after logout
     */
    this.enableRedirect = true;
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    if (this.elementRef.nativeElement) {
      this.renderer.listen(
        this.elementRef.nativeElement,
        'click'
        /**
         * @param {?} evt
         * @return {?}
         */,
        evt => {
          evt.preventDefault();
          this.logout();
        }
      );
    }
  }
  /**
   * @return {?}
   */
  logout() {
    this.auth.logout().subscribe(
      /**
       * @return {?}
       */
      () => this.redirectToUri()
      /**
       * @return {?}
       */,
      () => this.redirectToUri()
    );
  }
  /**
   * @return {?}
   */
  redirectToUri() {
    if (this.enableRedirect) {
      this.router.navigate([this.redirectUri]);
    }
  }
}
LogoutDirective.decorators = [
  {
    type: Directive,
    args: [
      {
        selector: '[adf-logout]'
      }
    ]
  }
];
/** @nocollapse */
LogoutDirective.ctorParameters = () => [
  { type: ElementRef },
  { type: Renderer2 },
  { type: Router },
  { type: AuthenticationService }
];
LogoutDirective.propDecorators = {
  redirectUri: [{ type: Input }],
  enableRedirect: [{ type: Input }]
};
if (false) {
  /**
   * URI to redirect to after logging out.
   * @type {?}
   */
  LogoutDirective.prototype.redirectUri;
  /**
   * Enable redirecting after logout
   * @type {?}
   */
  LogoutDirective.prototype.enableRedirect;
  /**
   * @type {?}
   * @private
   */
  LogoutDirective.prototype.elementRef;
  /**
   * @type {?}
   * @private
   */
  LogoutDirective.prototype.renderer;
  /**
   * @type {?}
   * @private
   */
  LogoutDirective.prototype.router;
  /**
   * @type {?}
   * @private
   */
  LogoutDirective.prototype.auth;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nb3V0LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvbG9nb3V0LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQVUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUszRSxNQUFNLE9BQU8sZUFBZTs7Ozs7OztJQVV4QixZQUFvQixVQUFzQixFQUN0QixRQUFtQixFQUNuQixNQUFjLEVBQ2QsSUFBMkI7UUFIM0IsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxTQUFJLEdBQUosSUFBSSxDQUF1Qjs7OztRQVQvQyxnQkFBVyxHQUFXLFFBQVEsQ0FBQzs7OztRQUkvQixtQkFBYyxHQUFZLElBQUksQ0FBQztJQU0vQixDQUFDOzs7O0lBRUQsUUFBUTtRQUNKLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUU7WUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsT0FBTzs7OztZQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2pFLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDckIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2xCLENBQUMsRUFBQyxDQUFDO1NBQ047SUFDTCxDQUFDOzs7O0lBRUQsTUFBTTtRQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsU0FBUzs7O1FBQ3hCLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7OztRQUMxQixHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQzdCLENBQUM7SUFDTixDQUFDOzs7O0lBRUQsYUFBYTtRQUNULElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1NBQzVDO0lBQ0wsQ0FBQzs7O1lBdkNKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsY0FBYzthQUMzQjs7OztZQU4wQixVQUFVO1lBQVUsU0FBUztZQUMvQyxNQUFNO1lBQ04scUJBQXFCOzs7MEJBUXpCLEtBQUs7NkJBSUwsS0FBSzs7Ozs7OztJQUpOLHNDQUMrQjs7Ozs7SUFHL0IseUNBQytCOzs7OztJQUVuQixxQ0FBOEI7Ozs7O0lBQzlCLG1DQUEyQjs7Ozs7SUFDM0IsaUNBQXNCOzs7OztJQUN0QiwrQkFBbUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBJbnB1dCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBPbkluaXQsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEF1dGhlbnRpY2F0aW9uU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2F1dGhlbnRpY2F0aW9uLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1thZGYtbG9nb3V0XSdcbn0pXG5leHBvcnQgY2xhc3MgTG9nb3V0RGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0IHtcblxuICAgIC8qKiBVUkkgdG8gcmVkaXJlY3QgdG8gYWZ0ZXIgbG9nZ2luZyBvdXQuICovXG4gICAgQElucHV0KClcbiAgICByZWRpcmVjdFVyaTogc3RyaW5nID0gJy9sb2dpbic7XG5cbiAgICAvKiogRW5hYmxlIHJlZGlyZWN0aW5nIGFmdGVyIGxvZ291dCAqL1xuICAgIEBJbnB1dCgpXG4gICAgZW5hYmxlUmVkaXJlY3Q6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgYXV0aDogQXV0aGVudGljYXRpb25TZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdjbGljaycsIChldnQpID0+IHtcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ291dCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2dvdXQoKSB7XG4gICAgICAgIHRoaXMuYXV0aC5sb2dvdXQoKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoKSA9PiB0aGlzLnJlZGlyZWN0VG9VcmkoKSxcbiAgICAgICAgICAgICgpID0+IHRoaXMucmVkaXJlY3RUb1VyaSgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmVkaXJlY3RUb1VyaSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlUmVkaXJlY3QpIHtcbiAgICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLnJlZGlyZWN0VXJpXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
