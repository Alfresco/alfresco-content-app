/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from 'tslib';
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
var AppRouteReuseStrategy = /** @class */ (function() {
  function AppRouteReuseStrategy() {
    this.routeCache = new Map();
  }
  /**
   * @return {?}
   */
  AppRouteReuseStrategy.prototype.resetCache
  /**
   * @return {?}
   */ = function() {
    var _this = this;
    this.routeCache.forEach(function(value) {
      _this.deactivateComponent(value.handle);
    });
    this.routeCache.clear();
  };
  /**
   * @private
   * @param {?} handle
   * @return {?}
   */
  AppRouteReuseStrategy.prototype.deactivateComponent
  /**
   * @private
   * @param {?} handle
   * @return {?}
   */ = function(handle) {
    if (!handle) {
      return;
    }
    /** @type {?} */
    var componentRef = handle['componentRef'];
    if (componentRef) {
      componentRef.destroy();
    }
  };
  /**
   * @param {?} future
   * @param {?} curr
   * @return {?}
   */
  AppRouteReuseStrategy.prototype.shouldReuseRoute
  /**
   * @param {?} future
   * @param {?} curr
   * @return {?}
   */ = function(future, curr) {
    /** @type {?} */
    var ret = future.routeConfig === curr.routeConfig;
    if (ret) {
      this.addRedirectsRecursively(future); // update redirects
    }
    return ret;
  };
  /**
   * @param {?} route
   * @return {?}
   */
  AppRouteReuseStrategy.prototype.shouldDetach
  /**
   * @param {?} route
   * @return {?}
   */ = function(route) {
    /** @type {?} */
    var data = this.getRouteData(route);
    return data && data.reuse;
  };
  /**
   * @param {?} route
   * @param {?} handle
   * @return {?}
   */
  AppRouteReuseStrategy.prototype.store
  /**
   * @param {?} route
   * @param {?} handle
   * @return {?}
   */ = function(route, handle) {
    /** @type {?} */
    var url = this.getFullRouteUrl(route);
    /** @type {?} */
    var data = this.getRouteData(route);
    this.routeCache.set(url, { handle: handle, data: data });
    this.addRedirectsRecursively(route);
  };
  /**
   * @param {?} route
   * @return {?}
   */
  AppRouteReuseStrategy.prototype.shouldAttach
  /**
   * @param {?} route
   * @return {?}
   */ = function(route) {
    /** @type {?} */
    var url = this.getFullRouteUrl(route);
    return this.routeCache.has(url);
  };
  /**
   * @param {?} route
   * @return {?}
   */
  AppRouteReuseStrategy.prototype.retrieve
  /**
   * @param {?} route
   * @return {?}
   */ = function(route) {
    /** @type {?} */
    var url = this.getFullRouteUrl(route);
    /** @type {?} */
    var data = this.getRouteData(route);
    return data && data.reuse && this.routeCache.has(url)
      ? this.routeCache.get(url).handle
      : null;
  };
  /**
   * @private
   * @param {?} route
   * @return {?}
   */
  AppRouteReuseStrategy.prototype.addRedirectsRecursively
  /**
   * @private
   * @param {?} route
   * @return {?}
   */ = function(route) {
    var _this = this;
    /** @type {?} */
    var config = route.routeConfig;
    if (config) {
      if (!config.loadChildren) {
        /** @type {?} */
        var routeFirstChild = route.firstChild;
        /** @type {?} */
        var routeFirstChildUrl = routeFirstChild
          ? this.getRouteUrlPaths(routeFirstChild).join('/')
          : '';
        /** @type {?} */
        var childConfigs = config.children;
        if (childConfigs) {
          /** @type {?} */
          var childConfigWithRedirect = childConfigs.find(function(c) {
            return c.path === '' && !!c.redirectTo;
          });
          if (childConfigWithRedirect) {
            childConfigWithRedirect.redirectTo = routeFirstChildUrl;
          }
        }
      }
      route.children.forEach(function(childRoute) {
        return _this.addRedirectsRecursively(childRoute);
      });
    }
  };
  /**
   * @private
   * @param {?} route
   * @return {?}
   */
  AppRouteReuseStrategy.prototype.getFullRouteUrl
  /**
   * @private
   * @param {?} route
   * @return {?}
   */ = function(route) {
    return this.getFullRouteUrlPaths(route)
      .filter(Boolean)
      .join('/');
  };
  /**
   * @private
   * @param {?} route
   * @return {?}
   */
  AppRouteReuseStrategy.prototype.getFullRouteUrlPaths
  /**
   * @private
   * @param {?} route
   * @return {?}
   */ = function(route) {
    /** @type {?} */
    var paths = this.getRouteUrlPaths(route);
    return route.parent
      ? tslib_1.__spread(this.getFullRouteUrlPaths(route.parent), paths)
      : paths;
  };
  /**
   * @private
   * @param {?} route
   * @return {?}
   */
  AppRouteReuseStrategy.prototype.getRouteUrlPaths
  /**
   * @private
   * @param {?} route
   * @return {?}
   */ = function(route) {
    return route.url.map(function(urlSegment) {
      return urlSegment.path;
    });
  };
  /**
   * @private
   * @param {?} route
   * @return {?}
   */
  AppRouteReuseStrategy.prototype.getRouteData
  /**
   * @private
   * @param {?} route
   * @return {?}
   */ = function(route) {
    return route.routeConfig && /** @type {?} */ (route.routeConfig.data);
  };
  return AppRouteReuseStrategy;
})();
export { AppRouteReuseStrategy };
if (false) {
  /**
   * @type {?}
   * @private
   */
  AppRouteReuseStrategy.prototype.routeCache;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnJvdXRlcy5zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hY2Etc2hhcmVkLyIsInNvdXJjZXMiOlsibGliL3JvdXRpbmcvYXBwLnJvdXRlcy5zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdDQSx3QkFFQzs7O0lBREMsMEJBQWU7Ozs7O0FBR2pCLHdCQUdDOzs7SUFGQywyQkFBNEI7O0lBQzVCLHlCQUFnQjs7QUFHbEI7SUFBQTtRQUNVLGVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBcUIsQ0FBQztJQW1HcEQsQ0FBQzs7OztJQWpHQywwQ0FBVTs7O0lBQVY7UUFBQSxpQkFLQztRQUpDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSztZQUMzQixLQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMxQixDQUFDOzs7Ozs7SUFFTyxtREFBbUI7Ozs7O0lBQTNCLFVBQTRCLE1BQTJCO1FBQ3JELElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxPQUFPO1NBQ1I7O1lBQ0ssWUFBWSxHQUFzQixNQUFNLENBQUMsY0FBYyxDQUFDO1FBQzlELElBQUksWUFBWSxFQUFFO1lBQ2hCLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUN4QjtJQUNILENBQUM7Ozs7OztJQUVELGdEQUFnQjs7Ozs7SUFBaEIsVUFDRSxNQUE4QixFQUM5QixJQUE0Qjs7WUFFdEIsR0FBRyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLFdBQVc7UUFDbkQsSUFBSSxHQUFHLEVBQUU7WUFDUCxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7U0FDMUQ7UUFDRCxPQUFP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QyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUM7UUFDMUMsT0FBTyxLQUFLLENBQUMsTUFBTTtZQUNqQixDQUFDLGtCQUFLLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUssS0FBSyxFQUN2RCxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ1osQ0FBQzs7Ozs7O0lBRU8sZ0RBQWdCOzs7OztJQUF4QixVQUF5QixLQUE2QjtRQUNwRCxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQUEsVUFBVSxJQUFJLE9BQUEsVUFBVSxDQUFDLElBQUksRUFBZixDQUFlLENBQUMsQ0FBQztJQUN0RCxDQUFDOzs7Ozs7SUFFTyw0Q0FBWTs7Ozs7SUFBcEIsVUFBcUIsS0FBNkI7UUFDaEQsT0FBTyxLQUFLLENBQUMsV0FBVyxJQUFJLENBQUMsbUJBQUEsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQWEsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFDSCw0QkFBQztBQUFELENBQUMsQUFwR0QsSUFvR0M7Ozs7Ozs7SUFuR0MsMkNBQWtEIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQWxmcmVzY28gRXhhbXBsZSBDb250ZW50IEFwcGxpY2F0aW9uXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDA1IC0gMjAyMCBBbGZyZXNjbyBTb2Z0d2FyZSBMaW1pdGVkXG4gKlxuICogVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbi5cbiAqIElmIHRoZSBzb2Z0d2FyZSB3YXMgcHVyY2hhc2VkIHVuZGVyIGEgcGFpZCBBbGZyZXNjbyBsaWNlbnNlLCB0aGUgdGVybXMgb2ZcbiAqIHRoZSBwYWlkIGxpY2Vuc2UgYWdyZWVtZW50IHdpbGwgcHJldmFpbC4gIE90aGVyd2lzZSwgdGhlIHNvZnR3YXJlIGlzXG4gKiBwcm92aWRlZCB1bmRlciB0aGUgZm9sbG93aW5nIG9wZW4gc291cmNlIGxpY2Vuc2UgdGVybXM6XG4gKlxuICogVGhlIEFsZnJlc2NvIEV4YW1wbGUgQ29udGVudCBBcHBsaWNhdGlvbiBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBMZXNzZXIgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqIFRoZSBBbGZyZXNjbyBFeGFtcGxlIENvbnRlbnQgQXBwbGljYXRpb24gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggQWxmcmVzY28uIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5pbXBvcnQge1xuICBSb3V0ZVJldXNlU3RyYXRlZ3ksXG4gIERldGFjaGVkUm91dGVIYW5kbGUsXG4gIEFjdGl2YXRlZFJvdXRlU25hcHNob3Rcbn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IENvbXBvbmVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbnRlcmZhY2UgUm91dGVEYXRhIHtcbiAgcmV1c2U6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBSb3V0ZUluZm8ge1xuICBoYW5kbGU6IERldGFjaGVkUm91dGVIYW5kbGU7XG4gIGRhdGE6IFJvdXRlRGF0YTtcbn1cblxuZXhwb3J0IGNsYXNzIEFwcFJvdXRlUmV1c2VTdHJhdGVneSBpbXBsZW1lbnRzIFJvdXRlUmV1c2VTdHJhdGVneSB7XG4gIHByaXZhdGUgcm91dGVDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBSb3V0ZUluZm8+KCk7XG5cbiAgcmVzZXRDYWNoZSgpIHtcbiAgICB0aGlzLnJvdXRlQ2FjaGUuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICB0aGlzLmRlYWN0aXZhdGVDb21wb25lbnQodmFsdWUuaGFuZGxlKTtcbiAgICB9KTtcbiAgICB0aGlzLnJvdXRlQ2FjaGUuY2xlYXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgZGVhY3RpdmF0ZUNvbXBvbmVudChoYW5kbGU6IERldGFjaGVkUm91dGVIYW5kbGUpOiB2b2lkIHtcbiAgICBpZiAoIWhhbmRsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxhbnk+ID0gaGFuZGxlWydjb21wb25lbnRSZWYnXTtcbiAgICBpZiAoY29tcG9uZW50UmVmKSB7XG4gICAgICBjb21wb25lbnRSZWYuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIHNob3VsZFJldXNlUm91dGUoXG4gICAgZnV0dXJlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LFxuICAgIGN1cnI6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RcbiAgKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcmV0ID0gZnV0dXJlLnJvdXRlQ29uZmlnID09PSBjdXJyLnJvdXRlQ29uZmlnO1xuICAgIGlmIChyZXQpIHtcbiAgICAgIHRoaXMuYWRkUmVkaXJlY3RzUmVjdXJzaXZlbHkoZnV0dXJlKTsgLy8gdXBkYXRlIHJlZGlyZWN0c1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgc2hvdWxkRGV0YWNoKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KTogYm9vbGVhbiB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZ2V0Um91dGVEYXRhKHJvdXRlKTtcbiAgICByZXR1cm4gZGF0YSAmJiBkYXRhLnJldXNlO1xuICB9XG5cbiAgc3RvcmUocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIGhhbmRsZTogRGV0YWNoZWRSb3V0ZUhhbmRsZSk6IHZvaWQge1xuICAgIGNvbnN0IHVybCA9IHRoaXMuZ2V0RnVsbFJvdXRlVXJsKHJvdXRlKTtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5nZXRSb3V0ZURhdGEocm91dGUpO1xuICAgIHRoaXMucm91dGVDYWNoZS5zZXQodXJsLCB7IGhhbmRsZSwgZGF0YSB9KTtcbiAgICB0aGlzLmFkZFJlZGlyZWN0c1JlY3Vyc2l2ZWx5KHJvdXRlKTtcbiAgfVxuXG4gIHNob3VsZEF0dGFjaChyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHVybCA9IHRoaXMuZ2V0RnVsbFJvdXRlVXJsKHJvdXRlKTtcbiAgICByZXR1cm4gdGhpcy5yb3V0ZUNhY2hlLmhhcyh1cmwpO1xuICB9XG5cbiAgcmV0cmlldmUocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBEZXRhY2hlZFJvdXRlSGFuZGxlIHtcbiAgICBjb25zdCB1cmwgPSB0aGlzLmdldEZ1bGxSb3V0ZVVybChyb3V0ZSk7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZ2V0Um91dGVEYXRhKHJvdXRlKTtcbiAgICByZXR1cm4gZGF0YSAmJiBkYXRhLnJldXNlICYmIHRoaXMucm91dGVDYWNoZS5oYXModXJsKVxuICAgICAgPyB0aGlzLnJvdXRlQ2FjaGUuZ2V0KHVybCkuaGFuZGxlXG4gICAgICA6IG51bGw7XG4gIH1cblxuICBwcml2YXRlIGFkZFJlZGlyZWN0c1JlY3Vyc2l2ZWx5KHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KTogdm9pZCB7XG4gICAgY29uc3QgY29uZmlnID0gcm91dGUucm91dGVDb25maWc7XG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgaWYgKCFjb25maWcubG9hZENoaWxkcmVuKSB7XG4gICAgICAgIGNvbnN0IHJvdXRlRmlyc3RDaGlsZCA9IHJvdXRlLmZpcnN0Q2hpbGQ7XG4gICAgICAgIGNvbnN0IHJvdXRlRmlyc3RDaGlsZFVybCA9IHJvdXRlRmlyc3RDaGlsZFxuICAgICAgICAgID8gdGhpcy5nZXRSb3V0ZVVybFBhdGhzKHJvdXRlRmlyc3RDaGlsZCkuam9pbignLycpXG4gICAgICAgICAgOiAnJztcbiAgICAgICAgY29uc3QgY2hpbGRDb25maWdzID0gY29uZmlnLmNoaWxkcmVuO1xuICAgICAgICBpZiAoY2hpbGRDb25maWdzKSB7XG4gICAgICAgICAgY29uc3QgY2hpbGRDb25maWdXaXRoUmVkaXJlY3QgPSBjaGlsZENvbmZpZ3MuZmluZChcbiAgICAgICAgICAgIGMgPT4gYy5wYXRoID09PSAnJyAmJiAhIWMucmVkaXJlY3RUb1xuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKGNoaWxkQ29uZmlnV2l0aFJlZGlyZWN0KSB7XG4gICAgICAgICAgICBjaGlsZENvbmZpZ1dpdGhSZWRpcmVjdC5yZWRpcmVjdFRvID0gcm91dGVGaXJzdENoaWxkVXJsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcm91dGUuY2hpbGRyZW4uZm9yRWFjaChjaGlsZFJvdXRlID0+XG4gICAgICAgIHRoaXMuYWRkUmVkaXJlY3RzUmVjdXJzaXZlbHkoY2hpbGRSb3V0ZSlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRGdWxsUm91dGVVcmwocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldEZ1bGxSb3V0ZVVybFBhdGhzKHJvdXRlKVxuICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgLmpvaW4oJy8nKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RnVsbFJvdXRlVXJsUGF0aHMocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgcGF0aHMgPSB0aGlzLmdldFJvdXRlVXJsUGF0aHMocm91dGUpO1xuICAgIHJldHVybiByb3V0ZS5wYXJlbnRcbiAgICAgID8gWy4uLnRoaXMuZ2V0RnVsbFJvdXRlVXJsUGF0aHMocm91dGUucGFyZW50KSwgLi4ucGF0aHNdXG4gICAgICA6IHBhdGhzO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSb3V0ZVVybFBhdGhzKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KTogc3RyaW5nW10ge1xuICAgIHJldHVybiByb3V0ZS51cmwubWFwKHVybFNlZ21lbnQgPT4gdXJsU2VnbWVudC5wYXRoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Um91dGVEYXRhKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KTogUm91dGVEYXRhIHtcbiAgICByZXR1cm4gcm91dGUucm91dGVDb25maWcgJiYgKHJvdXRlLnJvdXRlQ29uZmlnLmRhdGEgYXMgUm91dGVEYXRhKTtcbiAgfVxufVxuIl19
