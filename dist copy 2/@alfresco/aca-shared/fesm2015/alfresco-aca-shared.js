import { RouteReuseStrategy } from '@angular/router';
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
class PageLayoutContentComponent {
  constructor() {
    this.scrollable = false;
  }
}
PageLayoutContentComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'aca-page-layout-content',
        template: `
    <ng-content></ng-content>
  `,
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PageLayoutErrorComponent {}
PageLayoutErrorComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'aca-page-layout-error',
        template: `
    <ng-content></ng-content>
  `,
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
        host: { class: 'aca-page-layout-error' }
      }
    ]
  }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PageLayoutHeaderComponent {}
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PageLayoutComponent {
  constructor() {
    this.hasError = false;
  }
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class PageLayoutModule {}
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class LockedByComponent {
  constructor() {}
  /**
   * @return {?}
   */
  ngOnInit() {
    this.node = this.context.row.node;
  }
  /**
   * @return {?}
   */
  writeLockedBy() {
    return (
      this.node &&
      this.node.entry.properties &&
      this.node.entry.properties['cm:lockOwner'] &&
      this.node.entry.properties['cm:lockOwner'].displayName
    );
  }
}
LockedByComponent.decorators = [
  {
    type: Component,
    args: [
      {
        selector: 'aca-locked-by',
        template: `
    <mat-icon class="locked_by--icon">lock</mat-icon>
    <span class="locked_by--name">{{ writeLockedBy() }}</span>
  `,
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
LockedByComponent.ctorParameters = () => [];
LockedByComponent.propDecorators = {
  context: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class LockedByModule {}
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AppRouteReuseStrategy {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AppSharedRuleGuard {
  /**
   * @param {?} store
   */
  constructor(store) {
    this.isQuickShareEnabled$ = store.select(isQuickShareEnabled);
  }
  /**
   * @param {?} _
   * @return {?}
   */
  canActivate(_) {
    return this.isQuickShareEnabled$;
  }
  /**
   * @param {?} route
   * @return {?}
   */
  canActivateChild(route) {
    return this.canActivate(route);
  }
}
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
AppSharedRuleGuard.ctorParameters = () => [{ type: Store }];
/** @nocollapse */ AppSharedRuleGuard.ngInjectableDef = defineInjectable({
  factory: function AppSharedRuleGuard_Factory() {
    return new AppSharedRuleGuard(inject(Store));
  },
  token: AppSharedRuleGuard,
  providedIn: 'root'
});

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class AppService {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ContentApiService {
  /**
   * @param {?} api
   * @param {?} preferences
   */
  constructor(api, preferences) {
    this.api = api;
    this.preferences = preferences;
  }
  /**
   * Moves a node to the trashcan.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} Empty result that notifies when the deletion is complete
   */
  deleteNode(nodeId, options = {}) {
    return from(this.api.nodesApi.deleteNode(nodeId, options));
  }
  /**
   * Gets the stored information about a node.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} Node information
   */
  getNode(nodeId, options = {}) {
    /** @type {?} */
    const defaults = {
      include: ['path', 'properties', 'allowableOperations', 'permissions']
    };
    /** @type {?} */
    const queryOptions = Object.assign(defaults, options);
    return from(this.api.nodesApi.getNode(nodeId, queryOptions));
  }
  /**
   * @param {?} nodeId
   * @param {?=} options
   * @return {?}
   */
  getNodeInfo(nodeId, options) {
    /** @type {?} */
    const defaults = {
      include: ['isFavorite', 'allowableOperations', 'path']
    };
    /** @type {?} */
    const queryOptions = Object.assign(defaults, options || {});
    return from(this.api.nodesApi.getNodeInfo(nodeId, queryOptions));
  }
  /**
   * Gets the items contained in a folder node.
   * @param {?} nodeId ID of the target node
   * @param {?=} options Optional parameters supported by JS-API
   * @return {?} List of child items from the folder
   */
  getNodeChildren(nodeId, options = {}) {
    /** @type {?} */
    const defaults = {
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
    const queryOptions = Object.assign(defaults, options);
    return from(this.api.nodesApi.getNodeChildren(nodeId, queryOptions));
  }
  /**
   * @param {?} linkId
   * @return {?}
   */
  deleteSharedLink(linkId) {
    return from(this.api.sharedLinksApi.deleteSharedLink(linkId));
  }
  /**
   * @param {?=} options
   * @return {?}
   */
  getDeletedNodes(options = {}) {
    /** @type {?} */
    const defaults = {
      include: ['path']
    };
    /** @type {?} */
    const queryOptions = Object.assign(defaults, options);
    return from(this.api.nodesApi.getDeletedNodes(queryOptions));
  }
  /**
   * @param {?} nodeId
   * @return {?}
   */
  restoreNode(nodeId) {
    return from(this.api.nodesApi.restoreNode(nodeId));
  }
  /**
   * @param {?} nodeId
   * @return {?}
   */
  purgeDeletedNode(nodeId) {
    return from(this.api.nodesApi.purgeDeletedNode(nodeId));
  }
  /**
   * Gets information about a user identified by their username.
   * @param {?} personId ID of the target user
   * @param {?=} options
   * @return {?} User information
   */
  getPerson(personId, options) {
    return from(this.api.peopleApi.getPerson(personId, options));
  }
  /**
   * Copy a node to destination node
   *
   * @param {?} nodeId The id of the node to be copied
   * @param {?} targetParentId The id of the folder-node where the node have to be copied to
   * @param {?=} name The new name for the copy that would be added on the destination folder
   * @param {?=} opts
   * @return {?}
   */
  copyNode(nodeId, targetParentId, name, opts) {
    return from(
      this.api.nodesApi.copyNode(nodeId, { targetParentId, name }, opts)
    );
  }
  /**
   * Gets product information for Content Services.
   * @return {?} ProductVersionModel containing product details
   */
  getRepositoryInformation() {
    return from(
      this.api.getInstance().discovery.discoveryApi.getRepositoryInformation()
    );
  }
  /**
   * @param {?} personId
   * @param {?=} opts
   * @return {?}
   */
  getFavorites(personId, opts) {
    return from(this.api.favoritesApi.getFavorites(personId, opts));
  }
  /**
   * @param {?=} personId
   * @param {?=} opts
   * @return {?}
   */
  getFavoriteLibraries(personId = '-me-', opts) {
    return this.getFavorites(
      personId,
      Object.assign({}, opts, { where: '(EXISTS(target/site))' })
    ).pipe(
      map(response => {
        return {
          list: {
            entries: response.list.entries.map(({ entry }) => {
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
  }
  /**
   * @param {?=} opts
   * @return {?}
   */
  findSharedLinks(opts) {
    return from(this.api.sharedLinksApi.findSharedLinks(opts));
  }
  /**
   * @param {?} sharedId
   * @param {?=} attachment
   * @return {?}
   */
  getSharedLinkContent(sharedId, attachment) {
    return this.api.contentApi.getSharedLinkContentUrl(sharedId, attachment);
  }
  /**
   * @param {?} request
   * @return {?}
   */
  search(request) {
    return from(this.api.searchApi.search(request));
  }
  /**
   * @param {?} nodeId
   * @param {?=} attachment
   * @return {?}
   */
  getContentUrl(nodeId, attachment) {
    return this.api.contentApi.getContentUrl(nodeId, attachment);
  }
  /**
   * @param {?=} siteId
   * @param {?=} opts
   * @return {?}
   */
  deleteSite(siteId, opts) {
    return from(this.api.sitesApi.deleteSite(siteId, opts));
  }
  /**
   * @param {?=} siteId
   * @return {?}
   */
  leaveSite(siteId) {
    return from(this.api.sitesApi.removeSiteMember(siteId, '-me-'));
  }
  /**
   * @param {?} siteBody
   * @param {?=} opts
   * @return {?}
   */
  createSite(siteBody, opts) {
    return from(this.api.sitesApi.createSite(siteBody, opts));
  }
  /**
   * @param {?=} siteId
   * @param {?=} opts
   * @return {?}
   */
  getSite(siteId, opts) {
    return from(this.api.sitesApi.getSite(siteId, opts));
  }
  /**
   * @param {?} siteId
   * @param {?} siteBody
   * @return {?}
   */
  updateLibrary(siteId, siteBody) {
    return from(this.api.sitesApi.updateSite(siteId, siteBody));
  }
  /**
   * @param {?} nodes
   * @return {?}
   */
  addFavorite(nodes) {
    /** @type {?} */
    const payload = nodes.map(node => {
      const { isFolder, nodeId, id } = /** @type {?} */ (node.entry);
      /** @type {?} */
      const siteId = node.entry['guid'];
      /** @type {?} */
      const type = siteId ? 'site' : isFolder ? 'folder' : 'file';
      /** @type {?} */
      const guid = siteId || nodeId || id;
      return {
        target: {
          [type]: {
            guid
          }
        }
      };
    });
    return from(
      this.api.favoritesApi.addFavorite('-me-', /** @type {?} */ (payload))
    );
  }
  /**
   * @param {?} nodes
   * @return {?}
   */
  removeFavorite(nodes) {
    return from(
      Promise.all(
        nodes.map(node => {
          /** @type {?} */
          const id = node.entry.nodeId || node.entry.id;
          return this.api.favoritesApi.removeFavoriteSite('-me-', id);
        })
      )
    );
  }
  /**
   * @param {?} nodeId
   * @param {?=} opts
   * @return {?}
   */
  unlockNode(nodeId, opts) {
    return this.api.nodesApi.unlockNode(nodeId, opts);
  }
}
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
ContentApiService.ctorParameters = () => [
  { type: AlfrescoApiService },
  { type: UserPreferencesService }
];
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NodePermissionService {
  constructor() {
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
  check(source, permissions, options) {
    /** @type {?} */
    const opts = Object.assign({}, this.defaultOptions, options || {});
    if (!source) {
      return false;
    }
    if (Array.isArray(source)) {
      source = source.filter(item => item);
      if (source.length > 0) {
        return source.every(node =>
          this.isOperationAllowed(node, permissions, opts)
        );
      }
      return false;
    } else {
      return this.isOperationAllowed(source, permissions, opts);
    }
  }
  /**
   * @private
   * @param {?} node
   * @param {?} permissions
   * @param {?} options
   * @return {?}
   */
  isOperationAllowed(node, permissions, options) {
    /** @type {?} */
    const allowableOperations = this.getAllowableOperations(
      node,
      options.target
    );
    if (allowableOperations.length) {
      if (options.operation === NodePermissionService.DEFAULT_OPERATION) {
        return permissions.some(permission =>
          allowableOperations.includes(permission)
        );
      } else {
        return permissions.every(permission =>
          allowableOperations.includes(permission)
        );
      }
    }
    return false;
  }
  /**
   * @private
   * @param {?} node
   * @param {?=} property
   * @return {?}
   */
  getAllowableOperations(node, property) {
    /** @type {?} */
    let entry;
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
  }
}
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GenericErrorComponent {
  constructor() {
    this.text = 'APP.MESSAGES.ERRORS.MISSING_CONTENT';
  }
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GenericErrorModule {}
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ContextActionsDirective {
  /**
   * @param {?} store
   */
  constructor(store) {
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
  onContextMenuEvent(event) {
    if (event) {
      event.preventDefault();
      if (this.enabled) {
        /** @type {?} */
        const target = this.getTarget(event);
        if (target) {
          this.execute(event, target);
        }
      }
    }
  }
  /**
   * @return {?}
   */
  ngOnInit() {
    this.execute$
      .pipe(
        debounceTime(300),
        takeUntil(this.onDestroy$)
      )
      .subscribe(event => {
        this.store.dispatch(new ContextMenu(event));
      });
  }
  /**
   * @return {?}
   */
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  /**
   * @param {?} event
   * @param {?} target
   * @return {?}
   */
  execute(event, target) {
    if (!this.isSelected(target)) {
      target.dispatchEvent(new MouseEvent('click'));
    }
    this.execute$.next(event);
  }
  /**
   * @private
   * @param {?} event
   * @return {?}
   */
  getTarget(event) {
    return this.findAncestor(
      /** @type {?} */ (event.target),
      'adf-datatable-cell'
    );
  }
  /**
   * @private
   * @param {?} target
   * @return {?}
   */
  isSelected(target) {
    if (!target) {
      return false;
    }
    return this.findAncestor(target, 'adf-datatable-row').classList.contains(
      'adf-is-selected'
    );
  }
  /**
   * @private
   * @param {?} el
   * @param {?} className
   * @return {?}
   */
  findAncestor(el, className) {
    if (el.classList.contains(className)) {
      return el;
    }
    // tslint:disable-next-line:curly
    while ((el = el.parentElement) && !el.classList.contains(className));
    return el;
  }
}
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
ContextActionsDirective.ctorParameters = () => [{ type: Store }];
ContextActionsDirective.propDecorators = {
  enabled: [{ type: Input, args: ['acaContextEnable'] }],
  onContextMenuEvent: [
    { type: HostListener, args: ['contextmenu', ['$event']] }
  ]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ContextActionsModule {}
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
  const { entry } = node;
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
  const { entry } = node;
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
class SharedModule {
  /**
   * @return {?}
   */
  static forRoot() {
    return {
      ngModule: SharedModule,
      providers: [ContentApiService, NodePermissionService, AppService]
    };
  }
}
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
