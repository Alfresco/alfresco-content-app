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
/**
 * @record
 */
function RouteData() {}
if (false) {
  /** @type {?} */
  RouteData.prototype.reuse;
}
/**
 * @record
 */
function RouteInfo() {}
if (false) {
  /** @type {?} */
  RouteInfo.prototype.handle;
  /** @type {?} */
  RouteInfo.prototype.data;
}
export class AppRouteReuseStrategy {
  constructor() {
    this.routeCache = new Map();
  }
  /**
   * @return {?}
   */
  resetCache() {
    this.routeCache.forEach(value => {
      this.deactivateComponent(value.handle);
    });
    this.routeCache.clear();
  }
  /**
   * @private
   * @param {?} handle
   * @return {?}
   */
  deactivateComponent(handle) {
    if (!handle) {
      return;
    }
    /** @type {?} */
    const componentRef = handle['componentRef'];
    if (componentRef) {
      componentRef.destroy();
    }
  }
  /**
   * @param {?} future
   * @param {?} curr
   * @return {?}
   */
  shouldReuseRoute(future, curr) {
    /** @type {?} */
    const ret = future.routeConfig === curr.routeConfig;
    if (ret) {
      this.addRedirectsRecursively(future); // update redirects
    }
    return ret;
  }
  /**
   * @param {?} route
   * @return {?}
   */
  shouldDetach(route) {
    /** @type {?} */
    const data = this.getRouteData(route);
    return data && data.reuse;
  }
  /**
   * @param {?} route
   * @param {?} handle
   * @return {?}
   */
  store(route, handle) {
    /** @type {?} */
    const url = this.getFullRouteUrl(route);
    /** @type {?} */
    const data = this.getRouteData(route);
    this.routeCache.set(url, { handle, data });
    this.addRedirectsRecursively(route);
  }
  /**
   * @param {?} route
   * @return {?}
   */
  shouldAttach(route) {
    /** @type {?} */
    const url = this.getFullRouteUrl(route);
    return this.routeCache.has(url);
  }
  /**
   * @param {?} route
   * @return {?}
   */
  retrieve(route) {
    /** @type {?} */
    const url = this.getFullRouteUrl(route);
    /** @type {?} */
    const data = this.getRouteData(route);
    return data && data.reuse && this.routeCache.has(url)
      ? this.routeCache.get(url).handle
      : null;
  }
  /**
   * @private
   * @param {?} route
   * @return {?}
   */
  addRedirectsRecursively(route) {
    /** @type {?} */
    const config = route.routeConfig;
    if (config) {
      if (!config.loadChildren) {
        /** @type {?} */
        const routeFirstChild = route.firstChild;
        /** @type {?} */
        const routeFirstChildUrl = routeFirstChild
          ? this.getRouteUrlPaths(routeFirstChild).join('/')
          : '';
        /** @type {?} */
        const childConfigs = config.children;
        if (childConfigs) {
          /** @type {?} */
          const childConfigWithRedirect = childConfigs.find(
            c => c.path === '' && !!c.redirectTo
          );
          if (childConfigWithRedirect) {
            childConfigWithRedirect.redirectTo = routeFirstChildUrl;
          }
        }
      }
      route.children.forEach(childRoute =>
        this.addRedirectsRecursively(childRoute)
      );
    }
  }
  /**
   * @private
   * @param {?} route
   * @return {?}
   */
  getFullRouteUrl(route) {
    return this.getFullRouteUrlPaths(route)
      .filter(Boolean)
      .join('/');
  }
  /**
   * @private
   * @param {?} route
   * @return {?}
   */
  getFullRouteUrlPaths(route) {
    /** @type {?} */
    const paths = this.getRouteUrlPaths(route);
    return route.parent
      ? [...this.getFullRouteUrlPaths(route.parent), ...paths]
      : paths;
  }
  /**
   * @private
   * @param {?} route
   * @return {?}
   */
  getRouteUrlPaths(route) {
    return route.url.map(urlSegment => urlSegment.path);
  }
  /**
   * @private
   * @param {?} route
   * @return {?}
   */
  getRouteData(route) {
    return route.routeConfig && /** @type {?} */ (route.routeConfig.data);
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  AppRouteReuseStrategy.prototype.routeCache;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnJvdXRlcy5zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hY2Etc2hhcmVkLyIsInNvdXJjZXMiOlsibGliL3JvdXRpbmcvYXBwLnJvdXRlcy5zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0NBLHdCQUVDOzs7SUFEQywwQkFBZTs7Ozs7QUFHakIsd0JBR0M7OztJQUZDLDJCQUE0Qjs7SUFDNUIseUJBQWdCOztBQUdsQixNQUFNLE9BQU8scUJBQXFCO0lBQWxDO1FBQ1UsZUFBVSxHQUFHLElBQUksR0FBRyxFQUFxQixDQUFDO0lBbUdwRCxDQUFDOzs7O0lBakdDLFVBQVU7UUFDUixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM5QixJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMxQixDQUFDOzs7Ozs7SUFFTyxtQkFBbUIsQ0FBQyxNQUEyQjtRQUNyRCxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsT0FBTztTQUNSOztjQUNLLFlBQVksR0FBc0IsTUFBTSxDQUFDLGNBQWMsQ0FBQztRQUM5RCxJQUFJLFlBQVksRUFBRTtZQUNoQixZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDeEI7SUFDSCxDQUFDOzs7Ozs7SUFFRCxnQkFBZ0IsQ0FDZCxNQUE4QixFQUM5QixJQUE0Qjs7Y0FFdEIsR0FBRyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLFdBQVc7UUFDbkQsSUFBSSxHQUFHLEVBQUU7WUFDUCxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7U0FDMUQ7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENB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O1lBQ3hELENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDWixDQUFDOzs7Ozs7SUFFTyxnQkFBZ0IsQ0FBQyxLQUE2QjtRQUNwRCxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RELENBQUM7Ozs7OztJQUVPLFlBQVksQ0FBQyxLQUE2QjtRQUNoRCxPQUFPLEtBQUssQ0FBQyxXQUFXLElBQUksQ0FBQyxtQkFBQSxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksRUFBYSxDQUFDLENBQUM7SUFDcEUsQ0FBQztDQUNGOzs7Ozs7SUFuR0MsMkNBQWtEIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDA1IC0gMjAyMCBBbGZyZXNjbyBTb2Z0d2FyZSBMaW1pdGVkXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbi5cbiAqIElmIHRoZSBzb2Z0d2FyZSB3YXMgcHVyY2hhc2VkIHVuZGVyIGEgcGFpZCBBbGZyZXNjbyBsaWNlbnNlLCB0aGUgdGVybXMgb2ZcbiAqIHRoZSBwYWlkIGxpY2Vuc2UgYWdyZWVtZW50IHdpbGwgcHJldmFpbC4gIE90aGVyd2lzZSwgdGhlIHNvZnR3YXJlIGlzXG4gKiBwcm92aWRlZCB1bmRlciB0aGUgZm9sbG93aW5nIG9wZW4gc291cmNlIGxpY2Vuc2UgdGVybXM6XG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggQWxmcmVzY28uIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQge1xuICBSb3V0ZVJldXNlU3RyYXRlZ3ksXG4gIERldGFjaGVkUm91dGVIYW5kbGUsXG4gIEFjdGl2YXRlZFJvdXRlU25hcHNob3Rcbn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IENvbXBvbmVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbnRlcmZhY2UgUm91dGVEYXRhIHtcbiAgcmV1c2U6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBSb3V0ZUluZm8ge1xuICBoYW5kbGU6IERldGFjaGVkUm91dGVIYW5kbGU7XG4gIGRhdGE6IFJvdXRlRGF0YTtcbn1cblxuZXhwb3J0IGNsYXNzIEFwcFJvdXRlUmV1c2VTdHJhdGVneSBpbXBsZW1lbnRzIFJvdXRlUmV1c2VTdHJhdGVneSB7XG4gIHByaXZhdGUgcm91dGVDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBSb3V0ZUluZm8+KCk7XG5cbiAgcmVzZXRDYWNoZSgpIHtcbiAgICB0aGlzLnJvdXRlQ2FjaGUuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICB0aGlzLmRlYWN0aXZhdGVDb21wb25lbnQodmFsdWUuaGFuZGxlKTtcbiAgICB9KTtcbiAgICB0aGlzLnJvdXRlQ2FjaGUuY2xlYXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgZGVhY3RpdmF0ZUNvbXBvbmVudChoYW5kbGU6IERldGFjaGVkUm91dGVIYW5kbGUpOiB2b2lkIHtcbiAgICBpZiAoIWhhbmRsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxhbnk+ID0gaGFuZGxlWydjb21wb25lbnRSZWYnXTtcbiAgICBpZiAoY29tcG9uZW50UmVmKSB7XG4gICAgICBjb21wb25lbnRSZWYuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIHNob3VsZFJldXNlUm91dGUoXG4gICAgZnV0dXJlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LFxuICAgIGN1cnI6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RcbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcmV0ID0gZnV0dXJlLnJvdXRlQ29uZmlnID09PSBjdXJyLnJvdXRlQ29uZmlnO1xuICAgIGlmIChyZXQpIHtcbiAgICAgIHRoaXMuYWRkUmVkaXJlY3RzUmVjdXJzaXZlbHkoZnV0dXJlKTsgLy8gdXBkYXRlIHJlZGlyZWN0c1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgc2hvdWxkRGV0YWNoKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KTogYm9vbGVhbiB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZ2V0Um91dGVEYXRhKHJvdXRlKTtcbiAgICByZXR1cm4gZGF0YSAmJiBkYXRhLnJldXNlO1xuICB9XG5cbiAgc3RvcmUocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIGhhbmRsZTogRGV0YWNoZWRSb3V0ZUhhbmRsZSk6IHZvaWQge1xuICAgIGNvbnN0IHVybCA9IHRoaXMuZ2V0RnVsbFJvdXRlVXJsKHJvdXRlKTtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5nZXRSb3V0ZURhdGEocm91dGUpO1xuICAgIHRoaXMucm91dGVDYWNoZS5zZXQodXJsLCB7IGhhbmRsZSwgZGF0YSB9KTtcbiAgICB0aGlzLmFkZFJlZGlyZWN0c1JlY3Vyc2l2ZWx5KHJvdXRlKTtcbiAgfVxuXG4gIHNob3VsZEF0dGFjaChyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHVybCA9IHRoaXMuZ2V0RnVsbFJvdXRlVXJsKHJvdXRlKTtcbiAgICByZXR1cm4gdGhpcy5yb3V0ZUNhY2hlLmhhcyh1cmwpO1xuICB9XG5cbiAgcmV0cmlldmUocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBEZXRhY2hlZFJvdXRlSGFuZGxlIHtcbiAgICBjb25zdCB1cmwgPSB0aGlzLmdldEZ1bGxSb3V0ZVVybChyb3V0ZSk7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZ2V0Um91dGVEYXRhKHJvdXRlKTtcbiAgICByZXR1cm4gZGF0YSAmJiBkYXRhLnJldXNlICYmIHRoaXMucm91dGVDYWNoZS5oYXModXJsKVxuICAgICAgPyB0aGlzLnJvdXRlQ2FjaGUuZ2V0KHVybCkuaGFuZGxlXG4gICAgICA6IG51bGw7XG4gIH1cblxuICBwcml2YXRlIGFkZFJlZGlyZWN0c1JlY3Vyc2l2ZWx5KHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KTogdm9pZCB7XG4gICAgY29uc3QgY29uZmlnID0gcm91dGUucm91dGVDb25maWc7XG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgaWYgKCFjb25maWcubG9hZENoaWxkcmVuKSB7XG4gICAgICAgIGNvbnN0IHJvdXRlRmlyc3RDaGlsZCA9IHJvdXRlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIGNvbnN0IHJvdXRlRmlyc3RDaGlsZFVybCA9IHJvdXRlRmlyc3RDaGlsZFxuICAgICAgICAgID8gdGhpcy5nZXRSb3V0ZVVybFBhdGhzKHJvdXRlRmlyc3RDaGlsZCkuam9pbignLycpXG4gICAgICAgICAgOiAnJztcbiAgICAgICAgY29uc3QgY2hpbGRDb25maWdzID0gY29uZmlnLmNoaWxkcmVuO1xuICAgICAgICBpZiAoY2hpbGRDb25maWdzKSB7XG4gICAgICAgICAgY29uc3QgY2hpbGRDb25maWdXaXRoUmVkaXJlY3QgPSBjaGlsZENvbmZpZ3MuZmluZChcbiAgICAgICAgICAgIGMgPT4gYy5wYXRoID09PSAnJyAmJiAhIWMucmVkaXJlY3RUb1xuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKGNoaWxkQ29uZmlnV2l0aFJlZGlyZWN0KSB7XG4gICAgICAgICAgICBjaGlsZENvbmZpZ1dpdGhSZWRpcmVjdC5yZWRpcmVjdFRvID0gcm91dGVGaXJzdENoaWxkVXJsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcm91dGUuY2hpbGRyZW4uZm9yRWFjaChjaGlsZFJvdXRlID0+XG4gICAgICAgIHRoaXMuYWRkUmVkaXJlY3RzUmVjdXJzaXZlbHkoY2hpbGRSb3V0ZSlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRGdWxsUm91dGVVcmwocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldEZ1bGxSb3V0ZVVybFBhdGhzKHJvdXRlKVxuICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgLmpvaW4oJy8nKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RnVsbFJvdXRlVXJsUGF0aHMocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgcGF0aHMgPSB0aGlzLmdldFJvdXRlVXJsUGF0aHMocm91dGUpO1xuICAgIHJldHVybiByb3V0ZS5wYXJlbnRcbiAgICAgID8gWy4uLnRoaXMuZ2V0RnVsbFJvdXRlVXJsUGF0aHMocm91dGUucGFyZW50KSwgLi4ucGF0aHNdXG4gICAgICA6IHBhdGhzO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSb3V0ZVVybFBhdGhzKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KTogc3RyaW5nW10ge1xuICAgIHJldHVybiByb3V0ZS51cmwubWFwKHVybFNlZ21lbnQgPT4gdXJsU2VnbWVudC5wYXRoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Um91dGVEYXRhKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KTogUm91dGVEYXRhIHtcbiAgICByZXR1cm4gcm91dGUucm91dGVDb25maWcgJiYgKHJvdXRlLnJvdXRlQ29uZmlnLmRhdGEgYXMgUm91dGVEYXRhKTtcbiAgfVxufVxuIl19
