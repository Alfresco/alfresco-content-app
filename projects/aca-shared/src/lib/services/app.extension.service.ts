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
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AppStore, getRuleContext } from '@alfresco/aca-shared/store';
import {
  SelectionState,
  NavigationState,
  ExtensionConfig,
  RuleEvaluator,
  ContentActionRef,
  ContentActionType,
  ExtensionLoaderService,
  SidebarTabRef,
  NavBarGroupRef,
  sortByOrder,
  reduceSeparators,
  reduceEmptyMenus,
  ExtensionService,
  ProfileState,
  mergeObjects,
  ExtensionRef,
  RuleContext,
  DocumentListPresetRef,
  IconRef
} from '@alfresco/adf-extensions';
import { AppConfigService, AuthenticationService, LogService } from '@alfresco/adf-core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RepositoryInfo, NodeEntry } from '@alfresco/js-api';
import { ViewerRules } from '../models/viewer.rules';
import { SettingsGroupRef } from '../models/types';
import { NodePermissionService } from '../services/node-permission.service';

@Injectable({
  providedIn: 'root'
})
export class AppExtensionService implements RuleContext {
  private _references = new BehaviorSubject<ExtensionRef[]>([]);

  headerActions: Array<ContentActionRef> = [];
  toolbarActions: Array<ContentActionRef> = [];
  viewerToolbarActions: Array<ContentActionRef> = [];
  sharedLinkViewerToolbarActions: Array<ContentActionRef> = [];
  contextMenuActions: Array<ContentActionRef> = [];
  openWithActions: Array<ContentActionRef> = [];
  createActions: Array<ContentActionRef> = [];
  navbar: Array<NavBarGroupRef> = [];
  sidebarTabs: Array<SidebarTabRef> = [];
  sidebarActions: Array<ContentActionRef> = [];
  contentMetadata: any;
  viewerRules: ViewerRules = {};
  settingGroups: Array<SettingsGroupRef> = [];

  documentListPresets: {
    files: Array<DocumentListPresetRef>;
    libraries: Array<DocumentListPresetRef>;
    favoriteLibraries: Array<DocumentListPresetRef>;
    shared: Array<DocumentListPresetRef>;
    recent: Array<DocumentListPresetRef>;
    favorites: Array<DocumentListPresetRef>;
    trashcan: Array<DocumentListPresetRef>;
    searchLibraries: Array<DocumentListPresetRef>;
  } = {
    files: [],
    libraries: [],
    favoriteLibraries: [],
    shared: [],
    recent: [],
    favorites: [],
    trashcan: [],
    searchLibraries: []
  };

  selection: SelectionState;
  navigation: NavigationState;
  profile: ProfileState;
  repository: RepositoryInfo;
  withCredentials: boolean;

  references$: Observable<ExtensionRef[]>;

  constructor(
    public auth: AuthenticationService,
    protected store: Store<AppStore>,
    protected loader: ExtensionLoaderService,
    protected extensions: ExtensionService,
    public permissions: NodePermissionService,
    protected appConfig: AppConfigService,
    protected matIconRegistry: MatIconRegistry,
    protected sanitizer: DomSanitizer,
    protected logger: LogService
  ) {
    this.references$ = this._references.asObservable();

    this.store.select(getRuleContext).subscribe((result) => {
      this.selection = result.selection;
      this.navigation = result.navigation;
      this.profile = result.profile;
      this.repository = result.repository;
    });
  }

  async load() {
    const config = await this.extensions.load();
    this.setup(config);
  }

  setup(config: ExtensionConfig) {
    if (!config) {
      this.logger.error('Extension configuration not found');
      return;
    }

    this.settingGroups = this.loader.getElements<SettingsGroupRef>(config, 'settings');

    this.headerActions = this.loader.getContentActions(config, 'features.header');
    this.sidebarActions = this.loader.getContentActions(config, 'features.sidebar.toolbar');
    this.toolbarActions = this.loader.getContentActions(config, 'features.toolbar');
    this.viewerToolbarActions = this.loader.getContentActions(config, 'features.viewer.toolbarActions');
    this.sharedLinkViewerToolbarActions = this.loader.getContentActions(config, 'features.viewer.shared.toolbarActions');

    this.contextMenuActions = this.loader.getContentActions(config, 'features.contextMenu');
    this.openWithActions = this.loader.getContentActions(config, 'features.viewer.openWith');
    this.createActions = this.loader.getElements<ContentActionRef>(config, 'features.create');
    this.navbar = this.loadNavBar(config);
    this.sidebarTabs = this.loader.getElements<SidebarTabRef>(config, 'features.sidebar.tabs');
    this.contentMetadata = this.loadContentMetadata(config);

    this.documentListPresets = {
      files: this.getDocumentListPreset(config, 'files'),
      libraries: this.getDocumentListPreset(config, 'libraries'),
      favoriteLibraries: this.getDocumentListPreset(config, 'favoriteLibraries'),
      shared: this.getDocumentListPreset(config, 'shared'),
      recent: this.getDocumentListPreset(config, 'recent'),
      favorites: this.getDocumentListPreset(config, 'favorites'),
      trashcan: this.getDocumentListPreset(config, 'trashcan'),
      searchLibraries: this.getDocumentListPreset(config, 'search-libraries')
    };

    this.withCredentials = this.appConfig.get<boolean>('auth.withCredentials', false);

    if (config.features && config.features.viewer) {
      this.viewerRules = (config.features.viewer['rules'] as ViewerRules) || {};
    }

    this.registerIcons(config);

    const references = (config.$references || []).filter((entry) => typeof entry === 'object').map((entry) => entry as ExtensionRef);
    this._references.next(references);
  }

  protected registerIcons(config: ExtensionConfig) {
    const icons: Array<IconRef> = this.loader.getElements<IconRef>(config, 'features.icons').filter((entry) => !entry.disabled);

    for (const icon of icons) {
      const [ns, id] = icon.id.split(':');
      const value = icon.value;

      if (!value) {
        console.warn(`Missing icon value for "${icon.id}".`);
      } else if (!ns || !id) {
        console.warn(`Incorrect icon id format: "${icon.id}".`);
      } else {
        this.matIconRegistry.addSvgIconInNamespace(ns, id, this.sanitizer.bypassSecurityTrustResourceUrl(value));
      }
    }
  }

  protected loadNavBar(config: ExtensionConfig): Array<NavBarGroupRef> {
    return this.loader.getElements<NavBarGroupRef>(config, 'features.navbar');
  }

  protected getDocumentListPreset(config: ExtensionConfig, key: string): DocumentListPresetRef[] {
    return this.loader
      .getElements<DocumentListPresetRef>(config, `features.documentList.${key}`)
      .filter((entry) => !entry.disabled)
      .sort(sortByOrder);
  }

  getApplicationNavigation(elements): Array<NavBarGroupRef> {
    return elements
      .filter((group) => this.filterVisible(group))
      .map((group) => {
        return {
          ...group,
          items: (group.items || [])
            .filter((entry) => !entry.disabled)
            .filter((item) => this.filterVisible(item))
            .sort(sortByOrder)
            .map((item) => {
              if (item.children && item.children.length > 0) {
                item.children = item.children
                  .filter((entry) => !entry.disabled)
                  .filter((child) => this.filterVisible(child))
                  .sort(sortByOrder)
                  .map((child) => {
                    if (child.component) {
                      return {
                        ...child
                      };
                    }

                    if (!child.click) {
                      const childRouteRef = this.extensions.getRouteById(child.route);
                      const childUrl = `/${childRouteRef ? childRouteRef.path : child.route}`;
                      return {
                        ...child,
                        url: childUrl
                      };
                    }

                    return {
                      ...child,
                      action: child.click
                    };
                  });

                return {
                  ...item
                };
              }

              if (item.component) {
                return { ...item };
              }

              if (!item.click) {
                const routeRef = this.extensions.getRouteById(item.route);
                const url = `/${routeRef ? routeRef.path : item.route}`;
                return {
                  ...item,
                  url
                };
              }

              return {
                ...item,
                action: item.click
              };
            })
            .reduce(reduceEmptyMenus, [])
        };
      });
  }

  loadContentMetadata(config: ExtensionConfig): any {
    const elements = this.loader.getElements<any>(config, 'features.content-metadata-presets');
    if (!elements.length) {
      return null;
    }

    let presets = {};
    presets = this.filterDisabled(mergeObjects(presets, ...elements));

    try {
      this.appConfig.config['content-metadata'].presets = presets;
    } catch (error) {
      this.logger.error(error, '- could not change content-metadata presets from app.config -');
    }

    return { presets };
  }

  filterDisabled(object: Array<{ disabled: boolean }> | { disabled: boolean }) {
    if (Array.isArray(object)) {
      return object.filter((item) => !item.disabled).map((item) => this.filterDisabled(item));
    } else if (typeof object === 'object') {
      if (!object.disabled) {
        Object.keys(object).forEach((prop) => {
          object[prop] = this.filterDisabled(object[prop]);
        });
        return object;
      }
    } else {
      return object;
    }
  }

  getNavigationGroups(): Array<NavBarGroupRef> {
    return this.navbar;
  }

  getSidebarTabs(): Array<SidebarTabRef> {
    return this.sidebarTabs.filter((action) => this.filterVisible(action));
  }

  getCreateActions(): Array<ContentActionRef> {
    return this.createActions
      .filter((action) => this.filterVisible(action))
      .map((action) => this.copyAction(action))
      .map((action) => this.buildMenu(action))
      .map((action) => {
        let disabled = false;

        if (action.rules && action.rules.enabled) {
          disabled = !this.extensions.evaluateRule(action.rules.enabled, this);
        }

        return {
          ...action,
          disabled
        };
      });
  }

  private buildMenu(actionRef: ContentActionRef): ContentActionRef {
    if (actionRef.type === ContentActionType.menu && actionRef.children && actionRef.children.length > 0) {
      const children = actionRef.children.filter((action) => this.filterVisible(action)).map((action) => this.buildMenu(action));

      actionRef.children = children
        .map((action) => {
          let disabled = false;

          if (action.rules && action.rules.enabled) {
            disabled = !this.extensions.evaluateRule(action.rules.enabled, this);
          }

          return {
            ...action,
            disabled
          };
        })
        .sort(sortByOrder)
        .reduce(reduceEmptyMenus, [])
        .reduce(reduceSeparators, []);
    }

    return actionRef;
  }

  private getAllowedActions(actions: ContentActionRef[]): ContentActionRef[] {
    return (actions || [])
      .filter((action) => this.filterVisible(action))
      .map((action) => {
        if (action.type === ContentActionType.menu) {
          const copy = this.copyAction(action);
          if (copy.children && copy.children.length > 0) {
            copy.children = copy.children
              .filter((entry) => !entry.disabled)
              .filter((childAction) => this.filterVisible(childAction))
              .sort(sortByOrder)
              .reduce(reduceSeparators, []);
          }
          return copy;
        }
        return action;
      })
      .reduce(reduceEmptyMenus, [])
      .reduce(reduceSeparators, []);
  }

  getAllowedSidebarActions(): Array<ContentActionRef> {
    return this.getAllowedActions(this.sidebarActions);
  }

  getAllowedToolbarActions(): Array<ContentActionRef> {
    return this.getAllowedActions(this.toolbarActions);
  }

  getViewerToolbarActions(): Array<ContentActionRef> {
    return this.getAllowedActions(this.viewerToolbarActions);
  }

  getSharedLinkViewerToolbarActions(): Array<ContentActionRef> {
    return this.getAllowedActions(this.sharedLinkViewerToolbarActions);
  }

  getHeaderActions(): Array<ContentActionRef> {
    return this.headerActions
      .filter((action) => this.filterVisible(action))
      .map((action) => {
        if (action.type === ContentActionType.menu) {
          const copy = this.copyAction(action);
          if (copy.children && copy.children.length > 0) {
            copy.children = copy.children
              .filter((childAction) => this.filterVisible(childAction))
              .sort(sortByOrder)
              .reduce(reduceEmptyMenus, [])
              .reduce(reduceSeparators, []);
          }
          return copy;
        }

        return action;
      })
      .sort(sortByOrder)
      .reduce(reduceEmptyMenus, [])
      .reduce(reduceSeparators, []);
  }

  getAllowedContextMenuActions(): Array<ContentActionRef> {
    return this.getAllowedActions(this.contextMenuActions);
  }

  getSettingsGroups(): Array<SettingsGroupRef> {
    return this.settingGroups.filter((group) => this.filterVisible(group));
  }

  copyAction(action: ContentActionRef): ContentActionRef {
    return {
      ...action,
      children: (action.children || []).map((child) => this.copyAction(child))
    };
  }

  filterVisible(action: ContentActionRef | SettingsGroupRef | SidebarTabRef): boolean {
    if (action && action.rules && action.rules.visible) {
      return this.extensions.evaluateRule(action.rules.visible, this);
    }
    return true;
  }

  isViewerExtensionDisabled(extension: any): boolean {
    if (extension) {
      if (extension.disabled) {
        return true;
      }

      if (extension.rules && extension.rules.disabled) {
        return this.extensions.evaluateRule(extension.rules.disabled, this);
      }
    }

    return false;
  }

  runActionById(id: string) {
    const action = this.extensions.getActionById(id);
    if (action) {
      const { type, payload } = action;
      const context = {
        selection: this.selection
      };
      const expression = this.extensions.runExpression(payload, context);

      this.store.dispatch({ type, payload: expression });
    } else {
      this.store.dispatch({ type: id });
    }
  }

  // todo: move to ADF/RuleService
  isRuleDefined(ruleId: string): boolean {
    return !!(ruleId && this.getEvaluator(ruleId));
  }

  // todo: move to ADF/RuleService
  evaluateRule(ruleId: string, ...args: any[]): boolean {
    const evaluator = this.getEvaluator(ruleId);

    if (evaluator) {
      return evaluator(this, ...args);
    }

    return false;
  }

  getEvaluator(key: string): RuleEvaluator {
    return this.extensions.getEvaluator(key);
  }

  canPreviewNode(node: NodeEntry) {
    const rules = this.viewerRules;

    if (this.isRuleDefined(rules.canPreview)) {
      const canPreview = this.evaluateRule(rules.canPreview, node);

      if (!canPreview) {
        return false;
      }
    }

    return true;
  }

  canShowViewerNavigation(node: NodeEntry) {
    const rules = this.viewerRules;

    if (this.isRuleDefined(rules.showNavigation)) {
      const showNavigation = this.evaluateRule(rules.showNavigation, node);
      if (!showNavigation) {
        return false;
      }
    }

    return true;
  }
}
