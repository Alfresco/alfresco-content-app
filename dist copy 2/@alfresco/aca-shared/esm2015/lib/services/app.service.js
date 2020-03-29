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
import { Injectable, Inject } from '@angular/core';
import { AuthenticationService, AppConfigService } from '@alfresco/adf-core';
import { BehaviorSubject } from 'rxjs';
import { RouteReuseStrategy } from '@angular/router';
import { AppRouteReuseStrategy } from '../routing/app.routes.strategy';
import * as i0 from '@angular/core';
import * as i1 from '@alfresco/adf-core';
import * as i2 from '@angular/router';
export class AppService {
  /**
   * @param {?} auth
   * @param {?} config
   * @param {?} routeStrategy
   */
  constructor(auth, config, routeStrategy) {
    this.config = config;
    this.ready = new BehaviorSubject(auth.isLoggedIn() || this.withCredentials);
    this.ready$ = this.ready.asObservable();
    auth.onLogin.subscribe(() => {
      routeStrategy.resetCache();
      this.ready.next(true);
    });
    auth.onLogout.subscribe(() => {
      routeStrategy.resetCache();
    });
  }
  /**
   * Whether `withCredentials` mode is enabled.
   * Usually means that `Kerberos` mode is used.
   * @return {?}
   */
  get withCredentials() {
    return this.config.get('auth.withCredentials', false);
  }
}
AppService.decorators = [
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
AppService.ctorParameters = () => [
  { type: AuthenticationService },
  { type: AppConfigService },
  {
    type: AppRouteReuseStrategy,
    decorators: [{ type: Inject, args: [RouteReuseStrategy] }]
  }
];
/** @nocollapse */ AppService.ngInjectableDef = i0.defineInjectable({
  factory: function AppService_Factory() {
    return new AppService(
      i0.inject(i1.AuthenticationService),
      i0.inject(i1.AppConfigService),
      i0.inject(i2.RouteReuseStrategy)
    );
  },
  token: AppService,
  providedIn: 'root'
});
if (false) {
  /**
   * @type {?}
   * @private
   */
  AppService.prototype.ready;
  /** @type {?} */
  AppService.prototype.ready$;
  /**
   * @type {?}
   * @private
   */
  AppService.prototype.config;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWNhLXNoYXJlZC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9hcHAuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzdFLE9BQU8sRUFBYyxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbkQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDckQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7Ozs7QUFLdkUsTUFBTSxPQUFPLFVBQVU7Ozs7OztJQVlyQixZQUNFLElBQTJCLEVBQ25CLE1BQXdCLEVBQ0osYUFBb0M7UUFEeEQsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7UUFHaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzVFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUV4QyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDMUIsYUFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQzNCLGFBQWEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Ozs7OztJQXBCRCxJQUFJLGVBQWU7UUFDakIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBVSxzQkFBc0IsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNqRSxDQUFDOzs7WUFiRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7WUFQUSxxQkFBcUI7WUFBRSxnQkFBZ0I7WUFHdkMscUJBQXFCLHVCQW9CekIsTUFBTSxTQUFDLGtCQUFrQjs7Ozs7Ozs7SUFkNUIsMkJBQXdDOztJQUN4Qyw0QkFBNEI7Ozs7O0lBWTFCLDRCQUFnQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvblxuICpcbiAqIENvcHlyaWdodCAoQykgMjAwNSAtIDIwMjAgQWxmcmVzY28gU29mdHdhcmUgTGltaXRlZFxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24uXG4gKiBJZiB0aGUgc29mdHdhcmUgd2FzIHB1cmNoYXNlZCB1bmRlciBhIHBhaWQgQWxmcmVzY28gbGljZW5zZSwgdGhlIHRlcm1zIG9mXG4gKiB0aGUgcGFpZCBsaWNlbnNlIGFncmVlbWVudCB3aWxsIHByZXZhaWwuICBPdGhlcndpc2UsIHRoZSBzb2Z0d2FyZSBpc1xuICogcHJvdmlkZWQgdW5kZXIgdGhlIGZvbGxvd2luZyBvcGVuIHNvdXJjZSBsaWNlbnNlIHRlcm1zOlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBUaGUgQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIExlc3NlciBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEFsZnJlc2NvLiBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBdXRoZW50aWNhdGlvblNlcnZpY2UsIEFwcENvbmZpZ1NlcnZpY2UgfSBmcm9tICdAYWxmcmVzY28vYWRmLWNvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBSb3V0ZVJldXNlU3RyYXRlZ3kgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQXBwUm91dGVSZXVzZVN0cmF0ZWd5IH0gZnJvbSAnLi4vcm91dGluZy9hcHAucm91dGVzLnN0cmF0ZWd5JztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQXBwU2VydmljZSB7XG4gIHByaXZhdGUgcmVhZHk6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPjtcbiAgcmVhZHkkOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGB3aXRoQ3JlZGVudGlhbHNgIG1vZGUgaXMgZW5hYmxlZC5cbiAgICogVXN1YWxseSBtZWFucyB0aGF0IGBLZXJiZXJvc2AgbW9kZSBpcyB1c2VkLlxuICAgKi9cbiAgZ2V0IHdpdGhDcmVkZW50aWFscygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWcuZ2V0PGJvb2xlYW4+KCdhdXRoLndpdGhDcmVkZW50aWFscycsIGZhbHNlKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGF1dGg6IEF1dGhlbnRpY2F0aW9uU2VydmljZSxcbiAgICBwcml2YXRlIGNvbmZpZzogQXBwQ29uZmlnU2VydmljZSxcbiAgICBASW5qZWN0KFJvdXRlUmV1c2VTdHJhdGVneSkgcm91dGVTdHJhdGVneTogQXBwUm91dGVSZXVzZVN0cmF0ZWd5XG4gICkge1xuICAgIHRoaXMucmVhZHkgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGF1dGguaXNMb2dnZWRJbigpIHx8IHRoaXMud2l0aENyZWRlbnRpYWxzKTtcbiAgICB0aGlzLnJlYWR5JCA9IHRoaXMucmVhZHkuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICBhdXRoLm9uTG9naW4uc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHJvdXRlU3RyYXRlZ3kucmVzZXRDYWNoZSgpO1xuICAgICAgdGhpcy5yZWFkeS5uZXh0KHRydWUpO1xuICAgIH0pO1xuXG4gICAgYXV0aC5vbkxvZ291dC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgcm91dGVTdHJhdGVneS5yZXNldENhY2hlKCk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==
