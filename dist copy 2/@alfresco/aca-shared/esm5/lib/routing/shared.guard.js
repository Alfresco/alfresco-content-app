/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { isQuickShareEnabled } from '@alfresco/aca-shared/store';
import * as i0 from '@angular/core';
import * as i1 from '@ngrx/store';
var AppSharedRuleGuard = /** @class */ (function() {
  function AppSharedRuleGuard(store) {
    this.isQuickShareEnabled$ = store.select(isQuickShareEnabled);
  }
  /**
   * @param {?} _
   * @return {?}
   */
  AppSharedRuleGuard.prototype.canActivate
  /**
   * @param {?} _
   * @return {?}
   */ = function(_) {
    return this.isQuickShareEnabled$;
  };
  /**
   * @param {?} route
   * @return {?}
   */
  AppSharedRuleGuard.prototype.canActivateChild
  /**
   * @param {?} route
   * @return {?}
   */ = function(route) {
    return this.canActivate(route);
  };
  AppSharedRuleGuard.decorators = [
    {
      type: Injectable,
      args: [
        {
          providedIn: 'root'
        }
      ]
    }
  ];
  /** @nocollapse */
  AppSharedRuleGuard.ctorParameters = function() {
    return [{ type: Store }];
  };
  /** @nocollapse */ AppSharedRuleGuard.ngInjectableDef = i0.defineInjectable({
    factory: function AppSharedRuleGuard_Factory() {
      return new AppSharedRuleGuard(i0.inject(i1.Store));
    },
    token: AppSharedRuleGuard,
    providedIn: 'root'
  });
  return AppSharedRuleGuard;
})();
export { AppSharedRuleGuard };
if (false) {
  /** @type {?} */
  AppSharedRuleGuard.prototype.isQuickShareEnabled$;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmd1YXJkLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FjYS1zaGFyZWQvIiwic291cmNlcyI6WyJsaWIvcm91dGluZy9zaGFyZWQuZ3VhcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDcEMsT0FBTyxFQUFZLG1CQUFtQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7OztBQUUzRTtJQU1FLDRCQUFZLEtBQXNCO1FBQ2hDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDaEUsQ0FBQzs7Ozs7SUFFRCx3Q0FBVzs7OztJQUFYLFVBQ0UsQ0FBeUI7UUFFekIsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUM7SUFDbkMsQ0FBQzs7Ozs7SUFFRCw2Q0FBZ0I7Ozs7SUFBaEIsVUFDRSxLQUE2QjtRQUU3QixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQzs7Z0JBcEJGLFVBQVUsU0FBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7Ozs7Z0JBTFEsS0FBSzs7OzZCQTVCZDtDQW9EQyxBQXJCRCxJQXFCQztTQWxCWSxrQkFBa0I7OztJQUM3QixrREFBMEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb25cbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMDUgLSAyMDIwIEFsZnJlc2NvIFNvZnR3YXJlIExpbWl0ZWRcbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uLlxuICogSWYgdGhlIHNvZnR3YXJlIHdhcyBwdXJjaGFzZWQgdW5kZXIgYSBwYWlkIEFsZnJlc2NvIGxpY2Vuc2UsIHRoZSB0ZXJtcyBvZlxuICogdGhlIHBhaWQgbGljZW5zZSBhZ3JlZW1lbnQgd2lsbCBwcmV2YWlsLiAgT3RoZXJ3aXNlLCB0aGUgc29mdHdhcmUgaXNcbiAqIHByb3ZpZGVkIHVuZGVyIHRoZSBmb2xsb3dpbmcgb3BlbiBzb3VyY2UgbGljZW5zZSB0ZXJtczpcbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogYWxvbmcgd2l0aCBBbGZyZXNjby4gSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENhbkFjdGl2YXRlLCBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90IH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgQXBwU3RvcmUsIGlzUXVpY2tTaGFyZUVuYWJsZWQgfSBmcm9tICdAYWxmcmVzY28vYWNhLXNoYXJlZC9zdG9yZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEFwcFNoYXJlZFJ1bGVHdWFyZCBpbXBsZW1lbnRzIENhbkFjdGl2YXRlIHtcbiAgaXNRdWlja1NoYXJlRW5hYmxlZCQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG5cbiAgY29uc3RydWN0b3Ioc3RvcmU6IFN0b3JlPEFwcFN0b3JlPikge1xuICAgIHRoaXMuaXNRdWlja1NoYXJlRW5hYmxlZCQgPSBzdG9yZS5zZWxlY3QoaXNRdWlja1NoYXJlRW5hYmxlZCk7XG4gIH1cblxuICBjYW5BY3RpdmF0ZShcbiAgICBfOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90XG4gICk6IE9ic2VydmFibGU8Ym9vbGVhbj4gfCBQcm9taXNlPGJvb2xlYW4+IHwgYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXNRdWlja1NoYXJlRW5hYmxlZCQ7XG4gIH1cblxuICBjYW5BY3RpdmF0ZUNoaWxkKFxuICAgIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90XG4gICk6IE9ic2VydmFibGU8Ym9vbGVhbj4gfCBQcm9taXNlPGJvb2xlYW4+IHwgYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2FuQWN0aXZhdGUocm91dGUpO1xuICB9XG59XG4iXX0=
