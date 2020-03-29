import { RouteReuseStrategy } from '@angular/router';
import { __spread, __assign } from 'tslib';
import {
  AuthenticationService,
  AppConfigService,
  AlfrescoApiService,
  UserPreferencesService
} from '@alfresco/adf-core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { map, debounceTime, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, from, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { isQuickShareEnabled, ContextMenu } from '@alfresco/aca-shared/store';
import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
  NgModule,
  Injectable,
  Inject,
  Directive,
  HostListener,
  defineInjectable,
  inject
} from '@angular/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var PageLayoutContentComponent = /** @class */ (function() {
  function PageLayoutContentComponent() {
    this.scrollable = false;
  }
  PageLayoutContentComponent.decorators = [
    {
      type: Component,
      args: [
        {
          selector: 'aca-page-layout-content',
          template: '\n    <ng-content></ng-content>\n  ',
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          host: { class: 'aca-page-layout-content' }
        }
      ]
    }
  ];
  PageLayoutContentComponent.propDecorators = {
    scrollable: [
      { type: Input },
      { type: HostBinding, args: ['class.scrollable'] }
    ]
  };
  return PageLayoutContentComponent;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var PageLayoutErrorComponent = /** @class */ (function() {
  function PageLayoutErrorComponent() {}
  PageLayoutErrorComponent.decorators = [
    {
      type: Component,
      args: [
        {
          selector: 'aca-page-layout-error',
          template: '\n    <ng-content></ng-content>\n  ',
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          host: { class: 'aca-page-layout-error' }
        }
      ]
    }
  ];
  return PageLayoutErrorComponent;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var PageLayoutHeaderComponent = /** @class */ (function() {
  function PageLayoutHeaderComponent() {}
  PageLayoutHeaderComponent.decorators = [
    {
      type: Component,
      args: [
        {
          selector: 'aca-page-layout-header',
          template: '<ng-content></ng-content>',
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          host: { class: 'aca-page-layout-header' }
        }
      ]
    }
  ];
  return PageLayoutHeaderComponent;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var PageLayoutComponent = /** @class */ (function() {
  function PageLayoutComponent() {
    this.hasError = false;
  }
  PageLayoutComponent.decorators = [
    {
      type: Component,
      args: [
        {
          selector: 'aca-page-layout',
          template:
            '<ng-content select="aca-page-layout-header"></ng-content>\n<ng-content select="aca-page-layout-error" *ngIf="hasError"></ng-content>\n<ng-content select="aca-page-layout-content" *ngIf="!hasError"></ng-content>\n',
          encapsulation: ViewEncapsulation.None,
          host: { class: 'aca-page-layout' },
          changeDetection: ChangeDetectionStrategy.OnPush,
          styles: [
            '.aca-page-layout{display:flex;flex-direction:column;flex:1;height:100%;overflow:hidden;min-height:0}.aca-page-layout .aca-page-layout-header{display:flex;align-items:center;flex:0 0 65px;flex-basis:48px;background:#fafafa;border-bottom:1px solid var(--theme-border-color,rgba(0,0,0,.07));padding:0 24px}.aca-page-layout .aca-page-layout-content,.aca-page-layout .aca-page-layout-error{display:flex;flex-direction:row;flex:1;height:100%;overflow:hidden}.aca-page-layout .main-content{display:flex;flex-direction:column;flex:1;height:100%;overflow:hidden;min-height:0}.aca-page-layout .scrollable,.aca-page-layout .scrollable .main-content{overflow:auto!important}.aca-page-layout .sidebar{display:block;height:100%;overflow-y:scroll;max-width:350px;width:350px}[dir=rtl] .aca-page-layout .main-content{border-left:1px solid var(--theme-border-color,rgba(0,0,0,.07))}[dir=ltr] .aca-page-layout .main-content{border-right:1px solid var(--theme-border-color,rgba(0,0,0,.07))}'
          ]
        }
      ]
    }
  ];
  PageLayoutComponent.propDecorators = {
    hasError: [{ type: Input }]
  };
  return PageLayoutComponent;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var PageLayoutModule = /** @class */ (function() {
  function PageLayoutModule() {}
  PageLayoutModule.decorators = [
    {
      type: NgModule,
      args: [
        {
          imports: [CommonModule],
          declarations: [
            PageLayoutContentComponent,
            PageLayoutErrorComponent,
            PageLayoutHeaderComponent,
            PageLayoutComponent
          ],
          exports: [
            PageLayoutContentComponent,
            PageLayoutErrorComponent,
            PageLayoutHeaderComponent,
            PageLayoutComponent
          ]
        }
      ]
    }
  ];
  return PageLayoutModule;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var LockedByComponent = /** @class */ (function() {
  function LockedByComponent() {}
  /**
   * @return {?}
   */
  LockedByComponent.prototype.ngOnInit
  /**
   * @return {?}
   */ = function() {
    this.node = this.context.row.node;
  };
  /**
   * @return {?}
   */
  LockedByComponent.prototype.writeLockedBy
  /**
   * @return {?}
   */ = function() {
    return (
      this.node &&
      this.node.entry.properties &&
      this.node.entry.properties['cm:lockOwner'] &&
      this.node.entry.properties['cm:lockOwner'].displayName
    );
  };
  LockedByComponent.decorators = [
    {
      type: Component,
      args: [
        {
          selector: 'aca-locked-by',
          template:
            '\n    <mat-icon class="locked_by--icon">lock</mat-icon>\n    <span class="locked_by--name">{{ writeLockedBy() }}</span>\n  ',
          changeDetection: ChangeDetectionStrategy.OnPush,
          encapsulation: ViewEncapsulation.None,
          host: {
            class: 'aca-locked-by'
          },
          styles: [
            '.aca-locked-by{display:flex;align-items:center;padding:0 10px;color:var(--theme-text-color,rgba(0,0,0,.54))}.aca-locked-by .locked_by--icon{font-size:14px;width:14px;height:14px}.aca-locked-by .locked_by--name{font-size:12px;padding:0 2px}'
          ]
        }
      ]
    }
  ];
  /** @nocollapse */
  LockedByComponent.ctorParameters = function() {
    return [];
  };
  LockedByComponent.propDecorators = {
    context: [{ type: Input }]
  };
  return LockedByComponent;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var LockedByModule = /** @class */ (function() {
  function LockedByModule() {}
  LockedByModule.decorators = [
    {
      type: NgModule,
      args: [
        {
          imports: [CommonModule, MatIconModule],
          declarations: [LockedByComponent],
          exports: [LockedByComponent]
        }
      ]
    }
  ];
  return LockedByModule;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
      ? __spread(this.getFullRouteUrlPaths(route.parent), paths)
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
  /** @nocollapse */ AppSharedRuleGuard.ngInjectableDef = defineInjectable({
    factory: function AppSharedRuleGuard_Factory() {
      return new AppSharedRuleGuard(inject(Store));
    },
    token: AppSharedRuleGuard,
    providedIn: 'root'
  });
  return AppSharedRuleGuard;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var AppService = /** @class */ (function() {
  function AppService(auth, config, routeStrategy) {
    var _this = this;
    this.config = config;
    this.ready = new BehaviorSubject(auth.isLoggedIn() || this.withCredentials);
    this.ready$ = this.ready.asObservable();
    auth.onLogin.subscribe(function() {
      routeStrategy.resetCache();
      _this.ready.next(true);
    });
    auth.onLogout.subscribe(function() {
      routeStrategy.resetCache();
    });
  }
  Object.defineProperty(AppService.prototype, 'withCredentials', {
    /**
     * Whether `withCredentials` mode is enabled.
     * Usually means that `Kerberos` mode is used.
     */
    /**
     * Whether `withCredentials` mode is enabled.
     * Usually means that `Kerberos` mode is used.
     * @return {?}
     */
    get: function() {
      return this.config.get('auth.withCredentials', false);
    },
    enumerable: true,
    configurable: true
  });
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
  AppService.ctorParameters = function() {
    return [
      { type: AuthenticationService },
      { type: AppConfigService },
      {
        type: AppRouteReuseStrategy,
        decorators: [{ type: Inject, args: [RouteReuseStrategy] }]
      }
    ];
  };
  /** @nocollapse */ AppService.ngInjectableDef = defineInjectable({
    factory: function AppService_Factory() {
      return new AppService(
        inject(AuthenticationService),
        inject(AppConfigService),
        inject(RouteReuseStrategy)
      );
    },
    token: AppService,
    providedIn: 'root'
  });
  return AppService;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ContentApiService = /** @class */ (function() {
  function ContentApiService(api, preferences) {
    this.api = api;
    this.preferences = preferences;
  }
  /**
   * Moves a node to the trashcan.
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns Empty result that notifies when the deletion is complete
   */
  /**
   * Moves a node to the trashcan.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} Empty result that notifies when the deletion is complete
   */
  ContentApiService.prototype.deleteNode
  /**
   * Moves a node to the trashcan.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} Empty result that notifies when the deletion is complete
   */ = function(nodeId, options) {
    if (options === void 0) {
      options = {};
    }
    return from(this.api.nodesApi.deleteNode(nodeId, options));
  };
  /**
   * Gets the stored information about a node.
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns Node information
   */
  /**
   * Gets the stored information about a node.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} Node information
   */
  ContentApiService.prototype.getNode
  /**
   * Gets the stored information about a node.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} Node information
   */ = function(nodeId, options) {
    if (options === void 0) {
      options = {};
    }
    /** @type {?} */
    var defaults = {
      include: ['path', 'properties', 'allowableOperations', 'permissions']
    };
    /** @type {?} */
    var queryOptions = Object.assign(defaults, options);
    return from(this.api.nodesApi.getNode(nodeId, queryOptions));
  };
  /**
   * @param {?} nodeId
   * @param {?=} options
   * @return {?}
   */
  ContentApiService.prototype.getNodeInfo
  /**
   * @param {?} nodeId
   * @param {?=} options
   * @return {?}
   */ = function(nodeId, options) {
    /** @type {?} */
    var defaults = {
      include: ['isFavorite', 'allowableOperations', 'path']
    };
    /** @type {?} */
    var queryOptions = Object.assign(defaults, options || {});
    return from(this.api.nodesApi.getNodeInfo(nodeId, queryOptions));
  };
  /**
   * Gets the items contained in a folder node.
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns List of child items from the folder
   */
  /**
   * Gets the items contained in a folder node.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} List of child items from the folder
   */
  ContentApiService.prototype.getNodeChildren
  /**
   * Gets the items contained in a folder node.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} List of child items from the folder
   */ = function(nodeId, options) {
    if (options === void 0) {
      options = {};
    }
    /** @type {?} */
    var defaults = {
      maxItems: this.preferences.paginationSize,
      skipCount: 0,
      include: [
        'isLocked',
        'path',
        'properties',
        'allowableOperations',
        'permissions'
      ]
    };
    /** @type {?} */
    var queryOptions = Object.assign(defaults, options);
    return from(this.api.nodesApi.getNodeChildren(nodeId, queryOptions));
  };
  /**
   * @param {?} linkId
   * @return {?}
   */
  ContentApiService.prototype.deleteSharedLink
  /**
   * @param {?} linkId
   * @return {?}
   */ = function(linkId) {
    return from(this.api.sharedLinksApi.deleteSharedLink(linkId));
  };
  /**
   * @param {?=} options
   * @return {?}
   */
  ContentApiService.prototype.getDeletedNodes
  /**
   * @param {?=} options
   * @return {?}
   */ = function(options) {
    if (options === void 0) {
      options = {};
    }
    /** @type {?} */
    var defaults = {
      include: ['path']
    };
    /** @type {?} */
    var queryOptions = Object.assign(defaults, options);
    return from(this.api.nodesApi.getDeletedNodes(queryOptions));
  };
  /**
   * @param {?} nodeId
   * @return {?}
   */
  ContentApiService.prototype.restoreNode
  /**
   * @param {?} nodeId
   * @return {?}
   */ = function(nodeId) {
    return from(this.api.nodesApi.restoreNode(nodeId));
  };
  /**
   * @param {?} nodeId
   * @return {?}
   */
  ContentApiService.prototype.purgeDeletedNode
  /**
   * @param {?} nodeId
   * @return {?}
   */ = function(nodeId) {
    return from(this.api.nodesApi.purgeDeletedNode(nodeId));
  };
  /**
   * Gets information about a user identified by their username.
   * @param personId ID of the target user
   * @returns User information
   */
  /**
   * Gets information about a user identified by their username.
   * @param {?} personId ID of the target user
   * @param {?=} options
   * @return {?} User information
   */
  ContentApiService.prototype.getPerson
  /**
   * Gets information about a user identified by their username.
   * @param {?} personId ID of the target user
   * @param {?=} options
   * @return {?} User information
   */ = function(personId, options) {
    return from(this.api.peopleApi.getPerson(personId, options));
  };
  /**
   * Copy a node to destination node
   *
   * @param nodeId The id of the node to be copied
   * @param targetParentId The id of the folder-node where the node have to be copied to
   * @param name The new name for the copy that would be added on the destination folder
   */
  /**
   * Copy a node to destination node
   *
   * @param {?} nodeId The id of the node to be copied
   * @param {?} targetParentId The id of the folder-node where the node have to be copied to
   * @param {?=} name The new name for the copy that would be added on the destination folder
   * @param {?=} opts
   * @return {?}
   */
  ContentApiService.prototype.copyNode
  /**
   * Copy a node to destination node
   *
   * @param {?} nodeId The id of the node to be copied
   * @param {?} targetParentId The id of the folder-node where the node have to be copied to
   * @param {?=} name The new name for the copy that would be added on the destination folder
   * @param {?=} opts
   * @return {?}
   */ = function(nodeId, targetParentId, name, opts) {
    return from(
      this.api.nodesApi.copyNode(
        nodeId,
        { targetParentId: targetParentId, name: name },
        opts
      )
    );
  };
  /**
   * Gets product information for Content Services.
   * @returns ProductVersionModel containing product details
   */
  /**
   * Gets product information for Content Services.
   * @return {?} ProductVersionModel containing product details
   */
  ContentApiService.prototype.getRepositoryInformation
  /**
   * Gets product information for Content Services.
   * @return {?} ProductVersionModel containing product details
   */ = function() {
    return from(
      this.api.getInstance().discovery.discoveryApi.getRepositoryInformation()
    );
  };
  /**
   * @param {?} personId
   * @param {?=} opts
   * @return {?}
   */
  ContentApiService.prototype.getFavorites
  /**
   * @param {?} personId
   * @param {?=} opts
   * @return {?}
   */ = function(personId, opts) {
    return from(this.api.favoritesApi.getFavorites(personId, opts));
  };
  /**
   * @param {?=} personId
   * @param {?=} opts
   * @return {?}
   */
  ContentApiService.prototype.getFavoriteLibraries
  /**
   * @param {?=} personId
   * @param {?=} opts
   * @return {?}
   */ = function(personId, opts) {
    if (personId === void 0) {
      personId = '-me-';
    }
    return this.getFavorites(
      personId,
      __assign({}, opts, { where: '(EXISTS(target/site))' })
    ).pipe(
      map(function(response) {
        return {
          list: {
            entries: response.list.entries.map(function(_a) {
              var entry = _a.entry;
              entry.target.site.createdAt = entry.createdAt;
              return {
                entry: entry.target.site
              };
            }),
            pagination: response.list.pagination
          }
        };
      })
    );
  };
  /**
   * @param {?=} opts
   * @return {?}
   */
  ContentApiService.prototype.findSharedLinks
  /**
   * @param {?=} opts
   * @return {?}
   */ = function(opts) {
    return from(this.api.sharedLinksApi.findSharedLinks(opts));
  };
  /**
   * @param {?} sharedId
   * @param {?=} attachment
   * @return {?}
   */
  ContentApiService.prototype.getSharedLinkContent
  /**
   * @param {?} sharedId
   * @param {?=} attachment
   * @return {?}
   */ = function(sharedId, attachment) {
    return this.api.contentApi.getSharedLinkContentUrl(sharedId, attachment);
  };
  /**
   * @param {?} request
   * @return {?}
   */
  ContentApiService.prototype.search
  /**
   * @param {?} request
   * @return {?}
   */ = function(request) {
    return from(this.api.searchApi.search(request));
  };
  /**
   * @param {?} nodeId
   * @param {?=} attachment
   * @return {?}
   */
  ContentApiService.prototype.getContentUrl
  /**
   * @param {?} nodeId
   * @param {?=} attachment
   * @return {?}
   */ = function(nodeId, attachment) {
    return this.api.contentApi.getContentUrl(nodeId, attachment);
  };
  /**
   * @param {?=} siteId
   * @param {?=} opts
   * @return {?}
   */
  ContentApiService.prototype.deleteSite
  /**
   * @param {?=} siteId
   * @param {?=} opts
   * @return {?}
   */ = function(siteId, opts) {
    return from(this.api.sitesApi.deleteSite(siteId, opts));
  };
  /**
   * @param {?=} siteId
   * @return {?}
   */
  ContentApiService.prototype.leaveSite
  /**
   * @param {?=} siteId
   * @return {?}
   */ = function(siteId) {
    return from(this.api.sitesApi.removeSiteMember(siteId, '-me-'));
  };
  /**
   * @param {?} siteBody
   * @param {?=} opts
   * @return {?}
   */
  ContentApiService.prototype.createSite
  /**
   * @param {?} siteBody
   * @param {?=} opts
   * @return {?}
   */ = function(siteBody, opts) {
    return from(this.api.sitesApi.createSite(siteBody, opts));
  };
  /**
   * @param {?=} siteId
   * @param {?=} opts
   * @return {?}
   */
  ContentApiService.prototype.getSite
  /**
   * @param {?=} siteId
   * @param {?=} opts
   * @return {?}
   */ = function(siteId, opts) {
    return from(this.api.sitesApi.getSite(siteId, opts));
  };
  /**
   * @param {?} siteId
   * @param {?} siteBody
   * @return {?}
   */
  ContentApiService.prototype.updateLibrary
  /**
   * @param {?} siteId
   * @param {?} siteBody
   * @return {?}
   */ = function(siteId, siteBody) {
    return from(this.api.sitesApi.updateSite(siteId, siteBody));
  };
  /**
   * @param {?} nodes
   * @return {?}
   */
  ContentApiService.prototype.addFavorite
  /**
   * @param {?} nodes
   * @return {?}
   */ = function(nodes) {
    /** @type {?} */
    var payload = nodes.map(function(node) {
      var _a;
      var _b = /** @type {?} */ (node.entry),
        isFolder = _b.isFolder,
        nodeId = _b.nodeId,
        id = _b.id;
      /** @type {?} */
      var siteId = node.entry['guid'];
      /** @type {?} */
      var type = siteId ? 'site' : isFolder ? 'folder' : 'file';
      /** @type {?} */
      var guid = siteId || nodeId || id;
      return {
        target: ((_a = {}),
        (_a[type] = {
          guid: guid
        }),
        _a)
      };
    });
    return from(
      this.api.favoritesApi.addFavorite('-me-', /** @type {?} */ (payload))
    );
  };
  /**
   * @param {?} nodes
   * @return {?}
   */
  ContentApiService.prototype.removeFavorite
  /**
   * @param {?} nodes
   * @return {?}
   */ = function(nodes) {
    var _this = this;
    return from(
      Promise.all(
        nodes.map(function(node) {
          /** @type {?} */
          var id = node.entry.nodeId || node.entry.id;
          return _this.api.favoritesApi.removeFavoriteSite('-me-', id);
        })
      )
    );
  };
  /**
   * @param {?} nodeId
   * @param {?=} opts
   * @return {?}
   */
  ContentApiService.prototype.unlockNode
  /**
   * @param {?} nodeId
   * @param {?=} opts
   * @return {?}
   */ = function(nodeId, opts) {
    return this.api.nodesApi.unlockNode(nodeId, opts);
  };
  ContentApiService.decorators = [
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
  ContentApiService.ctorParameters = function() {
    return [{ type: AlfrescoApiService }, { type: UserPreferencesService }];
  };
  /** @nocollapse */ ContentApiService.ngInjectableDef = defineInjectable({
    factory: function ContentApiService_Factory() {
      return new ContentApiService(
        inject(AlfrescoApiService),
        inject(UserPreferencesService)
      );
    },
    token: ContentApiService,
    providedIn: 'root'
  });
  return ContentApiService;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NodePermissionService = /** @class */ (function() {
  function NodePermissionService() {
    this.defaultOptions = {
      operation: NodePermissionService.DEFAULT_OPERATION,
      target: null
    };
  }
  /**
   * @param {?} source
   * @param {?} permissions
   * @param {?=} options
   * @return {?}
   */
  NodePermissionService.prototype.check
  /**
   * @param {?} source
   * @param {?} permissions
   * @param {?=} options
   * @return {?}
   */ = function(source, permissions, options) {
    var _this = this;
    /** @type {?} */
    var opts = Object.assign({}, this.defaultOptions, options || {});
    if (!source) {
      return false;
    }
    if (Array.isArray(source)) {
      source = source.filter(function(item) {
        return item;
      });
      if (source.length > 0) {
        return source.every(function(node) {
          return _this.isOperationAllowed(node, permissions, opts);
        });
      }
      return false;
    } else {
      return this.isOperationAllowed(source, permissions, opts);
    }
  };
  /**
   * @private
   * @param {?} node
   * @param {?} permissions
   * @param {?} options
   * @return {?}
   */
  NodePermissionService.prototype.isOperationAllowed
  /**
   * @private
   * @param {?} node
   * @param {?} permissions
   * @param {?} options
   * @return {?}
   */ = function(node, permissions, options) {
    /** @type {?} */
    var allowableOperations = this.getAllowableOperations(node, options.target);
    if (allowableOperations.length) {
      if (options.operation === NodePermissionService.DEFAULT_OPERATION) {
        return permissions.some(function(permission) {
          return allowableOperations.includes(permission);
        });
      } else {
        return permissions.every(function(permission) {
          return allowableOperations.includes(permission);
        });
      }
    }
    return false;
  };
  /**
   * @private
   * @param {?} node
   * @param {?=} property
   * @return {?}
   */
  NodePermissionService.prototype.getAllowableOperations
  /**
   * @private
   * @param {?} node
   * @param {?=} property
   * @return {?}
   */ = function(node, property) {
    /** @type {?} */
    var entry;
    if ('entry' in node) {
      entry = node.entry;
    } else {
      entry = node;
    }
    if (property) {
      return entry[property] || [];
    }
    if ('allowableOperationsOnTarget' in entry) {
      return entry.allowableOperationsOnTarget || [];
    } else {
      return entry.allowableOperations || [];
    }
  };
  NodePermissionService.DEFAULT_OPERATION = 'OR';
  NodePermissionService.decorators = [
    {
      type: Injectable,
      args: [
        {
          providedIn: 'root'
        }
      ]
    }
  ];
  /** @nocollapse */ NodePermissionService.ngInjectableDef = defineInjectable({
    factory: function NodePermissionService_Factory() {
      return new NodePermissionService();
    },
    token: NodePermissionService,
    providedIn: 'root'
  });
  return NodePermissionService;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var GenericErrorComponent = /** @class */ (function() {
  function GenericErrorComponent() {
    this.text = 'APP.MESSAGES.ERRORS.MISSING_CONTENT';
  }
  GenericErrorComponent.decorators = [
    {
      type: Component,
      args: [
        {
          selector: 'aca-generic-error',
          template:
            '<mat-icon>error</mat-icon>\n<p class="generic-error__title">\n  {{ text | translate }}\n</p>\n',
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          host: { class: 'aca-generic-error' },
          styles: [
            '.aca-generic-error{color:var(--theme-text-color,rgba(0,0,0,.54));display:flex;align-items:center;justify-content:center;flex-direction:column;width:100%;height:100%}.aca-generic-error__title{font-size:16px}.aca-generic-error mat-icon{color:var(--theme-warn-color,#f44336);font-size:52px;height:52px;width:52px}'
          ]
        }
      ]
    }
  ];
  GenericErrorComponent.propDecorators = {
    text: [{ type: Input }]
  };
  return GenericErrorComponent;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var GenericErrorModule = /** @class */ (function() {
  function GenericErrorModule() {}
  GenericErrorModule.decorators = [
    {
      type: NgModule,
      args: [
        {
          imports: [CommonModule, MatIconModule, TranslateModule.forChild()],
          declarations: [GenericErrorComponent],
          exports: [GenericErrorComponent]
        }
      ]
    }
  ];
  return GenericErrorModule;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ContextActionsDirective = /** @class */ (function() {
  function ContextActionsDirective(store) {
    this.store = store;
    this.execute$ = new Subject();
    this.onDestroy$ = new Subject();
    // tslint:disable-next-line:no-input-rename
    this.enabled = true;
  }
  /**
   * @param {?} event
   * @return {?}
   */
  ContextActionsDirective.prototype.onContextMenuEvent
  /**
   * @param {?} event
   * @return {?}
   */ = function(event) {
    if (event) {
      event.preventDefault();
      if (this.enabled) {
        /** @type {?} */
        var target = this.getTarget(event);
        if (target) {
          this.execute(event, target);
        }
      }
    }
  };
  /**
   * @return {?}
   */
  ContextActionsDirective.prototype.ngOnInit
  /**
   * @return {?}
   */ = function() {
    var _this = this;
    this.execute$
      .pipe(
        debounceTime(300),
        takeUntil(this.onDestroy$)
      )
      .subscribe(function(event) {
        _this.store.dispatch(new ContextMenu(event));
      });
  };
  /**
   * @return {?}
   */
  ContextActionsDirective.prototype.ngOnDestroy
  /**
   * @return {?}
   */ = function() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  };
  /**
   * @param {?} event
   * @param {?} target
   * @return {?}
   */
  ContextActionsDirective.prototype.execute
  /**
   * @param {?} event
   * @param {?} target
   * @return {?}
   */ = function(event, target) {
    if (!this.isSelected(target)) {
      target.dispatchEvent(new MouseEvent('click'));
    }
    this.execute$.next(event);
  };
  /**
   * @private
   * @param {?} event
   * @return {?}
   */
  ContextActionsDirective.prototype.getTarget
  /**
   * @private
   * @param {?} event
   * @return {?}
   */ = function(event) {
    return this.findAncestor(
      /** @type {?} */ (event.target),
      'adf-datatable-cell'
    );
  };
  /**
   * @private
   * @param {?} target
   * @return {?}
   */
  ContextActionsDirective.prototype.isSelected
  /**
   * @private
   * @param {?} target
   * @return {?}
   */ = function(target) {
    if (!target) {
      return false;
    }
    return this.findAncestor(target, 'adf-datatable-row').classList.contains(
      'adf-is-selected'
    );
  };
  /**
   * @private
   * @param {?} el
   * @param {?} className
   * @return {?}
   */
  ContextActionsDirective.prototype.findAncestor
  /**
   * @private
   * @param {?} el
   * @param {?} className
   * @return {?}
   */ = function(el, className) {
    if (el.classList.contains(className)) {
      return el;
    }
    // tslint:disable-next-line:curly
    while ((el = el.parentElement) && !el.classList.contains(className));
    return el;
  };
  ContextActionsDirective.decorators = [
    {
      type: Directive,
      args: [
        {
          selector: '[acaContextActions]',
          exportAs: 'acaContextActions'
        }
      ]
    }
  ];
  /** @nocollapse */
  ContextActionsDirective.ctorParameters = function() {
    return [{ type: Store }];
  };
  ContextActionsDirective.propDecorators = {
    enabled: [{ type: Input, args: ['acaContextEnable'] }],
    onContextMenuEvent: [
      { type: HostListener, args: ['contextmenu', ['$event']] }
    ]
  };
  return ContextActionsDirective;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ContextActionsModule = /** @class */ (function() {
  function ContextActionsModule() {}
  ContextActionsModule.decorators = [
    {
      type: NgModule,
      args: [
        {
          declarations: [ContextActionsDirective],
          exports: [ContextActionsDirective]
        }
      ]
    }
  ];
  return ContextActionsModule;
})();

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
 * @param {?} node
 * @return {?}
 */
function isLocked(node) {
  var entry = node.entry;
  return (
    (entry && entry.isLocked) ||
    (entry.properties &&
      (entry.properties['cm:lockType'] === 'READ_ONLY_LOCK' ||
        entry.properties['cm:lockType'] === 'WRITE_LOCK'))
  );
}
/**
 * @param {?} node
 * @return {?}
 */
function isLibrary(node) {
  var entry = node.entry;
  return (
    (entry.guid &&
      entry.id &&
      entry.preset &&
      entry.title &&
      entry.visibility) ||
    entry.nodeType === 'st:site'
  );
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var SharedModule = /** @class */ (function() {
  function SharedModule() {}
  /**
   * @return {?}
   */
  SharedModule.forRoot
  /**
   * @return {?}
   */ = function() {
    return {
      ngModule: SharedModule,
      providers: [ContentApiService, NodePermissionService, AppService]
    };
  };
  SharedModule.decorators = [
    {
      type: NgModule,
      args: [
        {
          imports: [ContextActionsModule],
          exports: [ContextActionsModule]
        }
      ]
    }
  ];
  return SharedModule;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export {
  PageLayoutContentComponent,
  PageLayoutErrorComponent,
  PageLayoutHeaderComponent,
  PageLayoutComponent,
  PageLayoutModule,
  LockedByComponent,
  LockedByModule,
  AppRouteReuseStrategy,
  AppSharedRuleGuard,
  AppService,
  ContentApiService,
  NodePermissionService,
  GenericErrorComponent,
  GenericErrorModule,
  ContextActionsDirective,
  ContextActionsModule,
  isLocked,
  isLibrary,
  SharedModule
};

//# sourceMappingURL=alfresco-aca-shared.js.map
