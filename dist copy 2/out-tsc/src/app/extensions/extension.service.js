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
import * as tslib_1 from 'tslib';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {
  getRuleContext,
  getLanguagePickerState,
  getProcessServicesState
} from '@alfresco/aca-shared/store';
import { NodePermissionService } from '@alfresco/aca-shared';
import {
  ContentActionType,
  ExtensionLoaderService,
  sortByOrder,
  reduceSeparators,
  reduceEmptyMenus,
  ExtensionService,
  mergeObjects
} from '@alfresco/adf-extensions';
import { AppConfigService, AuthenticationService } from '@alfresco/adf-core';
import { BehaviorSubject } from 'rxjs';
var AppExtensionService = /** @class */ (function() {
  function AppExtensionService(
    auth,
    store,
    loader,
    extensions,
    permissions,
    appConfig,
    matIconRegistry,
    sanitizer
  ) {
    var _this = this;
    this.auth = auth;
    this.store = store;
    this.loader = loader;
    this.extensions = extensions;
    this.permissions = permissions;
    this.appConfig = appConfig;
    this.matIconRegistry = matIconRegistry;
    this.sanitizer = sanitizer;
    this._references = new BehaviorSubject([]);
    this.defaults = {
      layout: 'app.layout.main',
      auth: ['app.auth']
    };
    this.headerActions = [];
    this.toolbarActions = [];
    this.viewerToolbarActions = [];
    this.sharedLinkViewerToolbarActions = [];
    this.contextMenuActions = [];
    this.openWithActions = [];
    this.createActions = [];
    this.navbar = [];
    this.sidebar = [];
    this.viewerRules = {};
    this.userActions = [];
    this.documentListPresets = {
      files: [],
      libraries: [],
      favoriteLibraries: [],
      shared: [],
      recent: [],
      favorites: [],
      trashcan: [],
      searchLibraries: []
    };
    this.references$ = this._references.asObservable();
    this.store.select(getRuleContext).subscribe(function(result) {
      _this.selection = result.selection;
      _this.navigation = result.navigation;
      _this.profile = result.profile;
      _this.repository = result.repository;
    });
    this.store.select(getLanguagePickerState).subscribe(function(result) {
      _this.languagePicker = result;
    });
    this.store.select(getProcessServicesState).subscribe(function(result) {
      _this.processServices = result;
    });
  }
  AppExtensionService.prototype.load = function() {
    return tslib_1.__awaiter(this, void 0, void 0, function() {
      var config;
      return tslib_1.__generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.extensions.load()];
          case 1:
            config = _a.sent();
            this.setup(config);
            return [2 /*return*/];
        }
      });
    });
  };
  AppExtensionService.prototype.setup = function(config) {
    if (!config) {
      console.error('Extension configuration not found');
      return;
    }
    this.headerActions = this.loader.getContentActions(
      config,
      'features.header'
    );
    this.toolbarActions = this.loader.getContentActions(
      config,
      'features.toolbar'
    );
    this.viewerToolbarActions = this.loader.getContentActions(
      config,
      'features.viewer.toolbarActions'
    );
    this.sharedLinkViewerToolbarActions = this.loader.getContentActions(
      config,
      'features.viewer.shared.toolbarActions'
    );
    this.contextMenuActions = this.loader.getContentActions(
      config,
      'features.contextMenu'
    );
    this.openWithActions = this.loader.getContentActions(
      config,
      'features.viewer.openWith'
    );
    this.createActions = this.loader.getElements(config, 'features.create');
    this.navbar = this.loadNavBar(config);
    this.sidebar = this.loader.getElements(config, 'features.sidebar');
    this.userActions = this.loader.getContentActions(
      config,
      'features.userActions'
    );
    this.contentMetadata = this.loadContentMetadata(config);
    this.documentListPresets = {
      files: this.getDocumentListPreset(config, 'files'),
      libraries: this.getDocumentListPreset(config, 'libraries'),
      favoriteLibraries: this.getDocumentListPreset(
        config,
        'favoriteLibraries'
      ),
      shared: this.getDocumentListPreset(config, 'shared'),
      recent: this.getDocumentListPreset(config, 'recent'),
      favorites: this.getDocumentListPreset(config, 'favorites'),
      trashcan: this.getDocumentListPreset(config, 'trashcan'),
      searchLibraries: this.getDocumentListPreset(config, 'search-libraries')
    };
    this.withCredentials = this.appConfig.get('auth.withCredentials', false);
    if (config.features && config.features.viewer) {
      this.viewerRules = config.features.viewer['rules'] || {};
    }
    this.registerIcons(config);
    var references = (config.$references || [])
      .filter(function(entry) {
        return typeof entry === 'object';
      })
      .map(function(entry) {
        return entry;
      });
    this._references.next(references);
  };
  AppExtensionService.prototype.registerIcons = function(config) {
    var icons = this.loader
      .getElements(config, 'features.icons')
      .filter(function(entry) {
        return !entry.disabled;
      });
    for (var _i = 0, icons_1 = icons; _i < icons_1.length; _i++) {
      var icon = icons_1[_i];
      var _a = icon.id.split(':'),
        ns = _a[0],
        id = _a[1];
      var value = icon.value;
      if (!value) {
        console.warn('Missing icon value for "' + icon.id + '".');
      } else if (!ns || !id) {
        console.warn('Incorrect icon id format: "' + icon.id + '".');
      } else {
        this.matIconRegistry.addSvgIconInNamespace(
          ns,
          id,
          this.sanitizer.bypassSecurityTrustResourceUrl(value)
        );
      }
    }
  };
  AppExtensionService.prototype.loadNavBar = function(config) {
    return this.loader.getElements(config, 'features.navbar');
  };
  AppExtensionService.prototype.getDocumentListPreset = function(config, key) {
    return this.loader
      .getElements(config, 'features.documentList.' + key)
      .filter(function(entry) {
        return !entry.disabled;
      });
  };
  AppExtensionService.prototype.getApplicationNavigation = function(elements) {
    var _this = this;
    return elements
      .filter(function(group) {
        return _this.filterVisible(group);
      })
      .map(function(group) {
        return tslib_1.__assign({}, group, {
          items: (group.items || [])
            .filter(function(entry) {
              return !entry.disabled;
            })
            .filter(function(item) {
              return _this.filterVisible(item);
            })
            .sort(sortByOrder)
            .map(function(item) {
              if (item.children && item.children.length > 0) {
                item.children = item.children
                  .filter(function(entry) {
                    return !entry.disabled;
                  })
                  .filter(function(child) {
                    return _this.filterVisible(child);
                  })
                  .sort(sortByOrder)
                  .map(function(child) {
                    if (child.component) {
                      return tslib_1.__assign({}, child);
                    }
                    if (!child.click) {
                      var childRouteRef = _this.extensions.getRouteById(
                        child.route
                      );
                      var childUrl =
                        '/' +
                        (childRouteRef ? childRouteRef.path : child.route);
                      return tslib_1.__assign({}, child, { url: childUrl });
                    }
                    return tslib_1.__assign({}, child, { action: child.click });
                  });
                return tslib_1.__assign({}, item);
              }
              if (item.component) {
                return tslib_1.__assign({}, item);
              }
              if (!item.click) {
                var routeRef = _this.extensions.getRouteById(item.route);
                var url = '/' + (routeRef ? routeRef.path : item.route);
                return tslib_1.__assign({}, item, { url: url });
              }
              return tslib_1.__assign({}, item, { action: item.click });
            })
            .reduce(reduceEmptyMenus, [])
        });
      });
  };
  AppExtensionService.prototype.loadContentMetadata = function(config) {
    var elements = this.loader.getElements(
      config,
      'features.content-metadata-presets'
    );
    if (!elements.length) {
      return null;
    }
    var presets = {};
    presets = this.filterDisabled(
      mergeObjects.apply(void 0, [presets].concat(elements))
    );
    try {
      this.appConfig.config['content-metadata'] = { presets: presets };
    } catch (error) {
      console.error(
        error,
        '- could not change content-metadata from app.config -'
      );
    }
    return { presets: presets };
  };
  AppExtensionService.prototype.filterDisabled = function(object) {
    var _this = this;
    if (Array.isArray(object)) {
      return object
        .filter(function(item) {
          return !item.disabled;
        })
        .map(function(item) {
          return _this.filterDisabled(item);
        });
    } else if (typeof object === 'object') {
      if (!object.disabled) {
        Object.keys(object).forEach(function(prop) {
          object[prop] = _this.filterDisabled(object[prop]);
        });
        return object;
      }
    } else {
      return object;
    }
  };
  AppExtensionService.prototype.getNavigationGroups = function() {
    return this.navbar;
  };
  AppExtensionService.prototype.getSidebarTabs = function() {
    var _this = this;
    return this.sidebar.filter(function(action) {
      return _this.filterVisible(action);
    });
  };
  AppExtensionService.prototype.getComponentById = function(id) {
    return this.extensions.getComponentById(id);
  };
  AppExtensionService.prototype.getApplicationRoutes = function() {
    var _this = this;
    return this.extensions.routes.map(function(route) {
      var guards = _this.extensions.getAuthGuards(
        route.auth && route.auth.length > 0 ? route.auth : _this.defaults.auth
      );
      return {
        path: route.path,
        component: _this.getComponentById(
          route.layout || _this.defaults.layout
        ),
        canActivateChild: guards,
        canActivate: guards,
        children: [
          {
            path: '',
            component: _this.getComponentById(route.component),
            data: route.data
          }
        ]
      };
    });
  };
  AppExtensionService.prototype.getCreateActions = function() {
    var _this = this;
    return this.createActions
      .filter(function(action) {
        return _this.filterVisible(action);
      })
      .map(function(action) {
        return _this.copyAction(action);
      })
      .map(function(action) {
        return _this.buildMenu(action);
      })
      .map(function(action) {
        var disabled = false;
        if (action.rules && action.rules.enabled) {
          disabled = !_this.extensions.evaluateRule(
            action.rules.enabled,
            _this
          );
        }
        return tslib_1.__assign({}, action, { disabled: disabled });
      });
  };
  AppExtensionService.prototype.buildMenu = function(actionRef) {
    var _this = this;
    if (
      actionRef.type === ContentActionType.menu &&
      actionRef.children &&
      actionRef.children.length > 0
    ) {
      var children = actionRef.children
        .filter(function(action) {
          return _this.filterVisible(action);
        })
        .map(function(action) {
          return _this.buildMenu(action);
        });
      actionRef.children = children
        .map(function(action) {
          var disabled = false;
          if (action.rules && action.rules.enabled) {
            disabled = !_this.extensions.evaluateRule(
              action.rules.enabled,
              _this
            );
          }
          return tslib_1.__assign({}, action, { disabled: disabled });
        })
        .sort(sortByOrder)
        .reduce(reduceEmptyMenus, [])
        .reduce(reduceSeparators, []);
    }
    return actionRef;
  };
  AppExtensionService.prototype.getAllowedActions = function(actions) {
    var _this = this;
    return (actions || [])
      .filter(function(action) {
        return _this.filterVisible(action);
      })
      .map(function(action) {
        if (action.type === ContentActionType.menu) {
          var copy = _this.copyAction(action);
          if (copy.children && copy.children.length > 0) {
            copy.children = copy.children
              .filter(function(entry) {
                return !entry.disabled;
              })
              .filter(function(childAction) {
                return _this.filterVisible(childAction);
              })
              .sort(sortByOrder)
              .reduce(reduceSeparators, []);
          }
          return copy;
        }
        return action;
      })
      .reduce(reduceEmptyMenus, [])
      .reduce(reduceSeparators, []);
  };
  AppExtensionService.prototype.getAllowedToolbarActions = function() {
    return this.getAllowedActions(this.toolbarActions);
  };
  AppExtensionService.prototype.getViewerToolbarActions = function() {
    return this.getAllowedActions(this.viewerToolbarActions);
  };
  AppExtensionService.prototype.getSharedLinkViewerToolbarActions = function() {
    return this.getAllowedActions(this.sharedLinkViewerToolbarActions);
  };
  AppExtensionService.prototype.getHeaderActions = function() {
    var _this = this;
    return this.headerActions.filter(function(action) {
      return _this.filterVisible(action);
    });
  };
  AppExtensionService.prototype.getAllowedContextMenuActions = function() {
    return this.getAllowedActions(this.contextMenuActions);
  };
  AppExtensionService.prototype.getUserActions = function() {
    var _this = this;
    return this.userActions
      .filter(function(action) {
        return _this.filterVisible(action);
      })
      .sort(sortByOrder);
  };
  AppExtensionService.prototype.copyAction = function(action) {
    var _this = this;
    return tslib_1.__assign({}, action, {
      children: (action.children || []).map(function(child) {
        return _this.copyAction(child);
      })
    });
  };
  AppExtensionService.prototype.filterVisible = function(action) {
    if (action && action.rules && action.rules.visible) {
      return this.extensions.evaluateRule(action.rules.visible, this);
    }
    return true;
  };
  AppExtensionService.prototype.isViewerExtensionDisabled = function(
    extension
  ) {
    if (extension) {
      if (extension.disabled) {
        return true;
      }
      if (extension.rules && extension.rules.disabled) {
        return this.extensions.evaluateRule(extension.rules.disabled, this);
      }
    }
    return false;
  };
  AppExtensionService.prototype.runActionById = function(id) {
    var action = this.extensions.getActionById(id);
    if (action) {
      var type = action.type,
        payload = action.payload;
      var context = {
        selection: this.selection
      };
      var expression = this.extensions.runExpression(payload, context);
      this.store.dispatch({ type: type, payload: expression });
    } else {
      this.store.dispatch({ type: id });
    }
  };
  // todo: move to ADF/RuleService
  AppExtensionService.prototype.isRuleDefined = function(ruleId) {
    return ruleId && this.getEvaluator(ruleId) ? true : false;
  };
  // todo: move to ADF/RuleService
  AppExtensionService.prototype.evaluateRule = function(ruleId) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    var evaluator = this.getEvaluator(ruleId);
    if (evaluator) {
      return evaluator.apply(void 0, [this].concat(args));
    }
    return false;
  };
  AppExtensionService.prototype.getEvaluator = function(key) {
    return this.extensions.getEvaluator(key);
  };
  AppExtensionService.prototype.canPreviewNode = function(node) {
    var rules = this.viewerRules;
    if (this.isRuleDefined(rules.canPreview)) {
      var canPreview = this.evaluateRule(rules.canPreview, node);
      if (!canPreview) {
        return false;
      }
    }
    return true;
  };
  AppExtensionService = tslib_1.__decorate(
    [
      Injectable({
        providedIn: 'root'
      }),
      tslib_1.__metadata('design:paramtypes', [
        AuthenticationService,
        Store,
        ExtensionLoaderService,
        ExtensionService,
        NodePermissionService,
        AppConfigService,
        MatIconRegistry,
        DomSanitizer
      ])
    ],
    AppExtensionService
  );
  return AppExtensionService;
})();
export { AppExtensionService };
//# sourceMappingURL=extension.service.js.map
