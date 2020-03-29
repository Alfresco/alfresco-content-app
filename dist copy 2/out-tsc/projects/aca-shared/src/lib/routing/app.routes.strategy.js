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
var AppRouteReuseStrategy = /** @class */ (function() {
  function AppRouteReuseStrategy() {
    this.routeCache = new Map();
  }
  AppRouteReuseStrategy.prototype.resetCache = function() {
    var _this = this;
    this.routeCache.forEach(function(value) {
      _this.deactivateComponent(value.handle);
    });
    this.routeCache.clear();
  };
  AppRouteReuseStrategy.prototype.deactivateComponent = function(handle) {
    if (!handle) {
      return;
    }
    var componentRef = handle['componentRef'];
    if (componentRef) {
      componentRef.destroy();
    }
  };
  AppRouteReuseStrategy.prototype.shouldReuseRoute = function(future, curr) {
    var ret = future.routeConfig === curr.routeConfig;
    if (ret) {
      this.addRedirectsRecursively(future); // update redirects
    }
    return ret;
  };
  AppRouteReuseStrategy.prototype.shouldDetach = function(route) {
    var data = this.getRouteData(route);
    return data && data.reuse;
  };
  AppRouteReuseStrategy.prototype.store = function(route, handle) {
    var url = this.getFullRouteUrl(route);
    var data = this.getRouteData(route);
    this.routeCache.set(url, { handle: handle, data: data });
    this.addRedirectsRecursively(route);
  };
  AppRouteReuseStrategy.prototype.shouldAttach = function(route) {
    var url = this.getFullRouteUrl(route);
    return this.routeCache.has(url);
  };
  AppRouteReuseStrategy.prototype.retrieve = function(route) {
    var url = this.getFullRouteUrl(route);
    var data = this.getRouteData(route);
    return data && data.reuse && this.routeCache.has(url)
      ? this.routeCache.get(url).handle
      : null;
  };
  AppRouteReuseStrategy.prototype.addRedirectsRecursively = function(route) {
    var _this = this;
    var config = route.routeConfig;
    if (config) {
      if (!config.loadChildren) {
        var routeFirstChild = route.firstChild;
        var routeFirstChildUrl = routeFirstChild
          ? this.getRouteUrlPaths(routeFirstChild).join('/')
          : '';
        var childConfigs = config.children;
        if (childConfigs) {
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
  AppRouteReuseStrategy.prototype.getFullRouteUrl = function(route) {
    return this.getFullRouteUrlPaths(route)
      .filter(Boolean)
      .join('/');
  };
  AppRouteReuseStrategy.prototype.getFullRouteUrlPaths = function(route) {
    var paths = this.getRouteUrlPaths(route);
    return route.parent
      ? this.getFullRouteUrlPaths(route.parent).concat(paths)
      : paths;
  };
  AppRouteReuseStrategy.prototype.getRouteUrlPaths = function(route) {
    return route.url.map(function(urlSegment) {
      return urlSegment.path;
    });
  };
  AppRouteReuseStrategy.prototype.getRouteData = function(route) {
    return route.routeConfig && route.routeConfig.data;
  };
  return AppRouteReuseStrategy;
})();
export { AppRouteReuseStrategy };
//# sourceMappingURL=app.routes.strategy.js.map
