/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
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

import { Injectable, Type } from '@angular/core';
import { Store } from '@ngrx/store';
import { Route } from '@angular/router';
import { AppStore } from '../store/states';
import { ruleContext } from '../store/selectors/app.selectors';
import { NodePermissionService } from '../services/node-permission.service';
import { ProfileResolver } from '../services/profile.resolver';
import {
    SelectionState, NavigationState, ExtensionConfig,
    RuleContext, RuleEvaluator, ViewerExtensionRef,
    ContentActionRef, ContentActionType,
    ExtensionLoaderService,
    SidebarTabRef, NavBarGroupRef,
    sortByOrder, reduceSeparators, reduceEmptyMenus,
    ExtensionService,
    ProfileState
} from '@alfresco/adf-extensions';

@Injectable()
export class AppExtensionService implements RuleContext {
    defaults = {
        layout: 'app.layout.main',
        auth: ['app.auth']
    };

    toolbarActions: Array<ContentActionRef> = [];
    viewerToolbarActions: Array<ContentActionRef> = [];
    viewerContentExtensions: Array<ViewerExtensionRef> = [];
    contextMenuActions: Array<ContentActionRef> = [];
    openWithActions: Array<ContentActionRef> = [];
    createActions: Array<ContentActionRef> = [];
    navbar: Array<NavBarGroupRef> = [];
    sidebar: Array<SidebarTabRef> = [];

    selection: SelectionState;
    navigation: NavigationState;
    profile: ProfileState;

    constructor(
        private store: Store<AppStore>,
        private loader: ExtensionLoaderService,
        private extensions: ExtensionService,
        public permissions: NodePermissionService) {

        this.store.select(ruleContext).subscribe(result => {
            this.selection = result.selection;
            this.navigation = result.navigation;
            this.profile = result.profile;
        });
    }

    async load() {
        const config = await this.extensions.load();
        this.setup(config);
    }

    setup(config: ExtensionConfig) {
        if (!config) {
            console.error('Extension configuration not found');
            return;
        }

        this.toolbarActions = this.loader.getContentActions(config, 'features.toolbar');
        this.viewerToolbarActions = this.loader.getContentActions(config, 'features.viewer.toolbar');
        this.viewerContentExtensions = this.loader.getElements<ViewerExtensionRef>(config, 'features.viewer.content');
        this.contextMenuActions = this.loader.getContentActions(config, 'features.contextMenu');
        this.openWithActions = this.loader.getContentActions(config, 'features.viewer.openWith');
        this.createActions = this.loader.getElements<ContentActionRef>(config, 'features.create');
        this.navbar = this.loadNavBar(config);
        this.sidebar = this.loader.getElements<SidebarTabRef>(config, 'features.sidebar');
    }

    protected loadNavBar(config: ExtensionConfig): Array<NavBarGroupRef> {
        const elements = this.loader.getElements<NavBarGroupRef>(config, 'features.navbar');

        return elements.map(group => {
            return {
                ...group,
                items: (group.items || [])
                    .filter(item => !item.disabled)
                    .sort(sortByOrder)
                    .map(item => {
                        const routeRef = this.extensions.getRouteById(item.route);
                        const url = `/${routeRef ? routeRef.path : item.route}`;
                        return {
                            ...item,
                            url
                        };
                    })
            };
        });
    }

    getNavigationGroups(): Array<NavBarGroupRef> {
        return this.navbar;
    }

    getSidebarTabs(): Array<SidebarTabRef> {
        return this.sidebar;
    }

    getComponentById(id: string): Type<{}> {
        return this.extensions.getComponentById(id);
    }

    getApplicationRoutes(): Array<Route> {
        return this.extensions.routes.map(route => {
            const guards = this.extensions.getAuthGuards(
                route.auth && route.auth.length > 0
                    ? route.auth
                    : this.defaults.auth
            );

            return {
                path: route.path,
                component: this.getComponentById(route.layout || this.defaults.layout),
                canActivateChild: guards,
                canActivate: guards,
                resolve: { profile: ProfileResolver },
                children: [
                    {
                        path: '',
                        component: this.getComponentById(route.component),
                        data: route.data
                    }
                ]
            };
        });
    }

    getCreateActions(): Array<ContentActionRef> {
        return this.createActions
            .filter(action => this.filterByRules(action))
            .map(action => {
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

    // evaluates content actions for the selection and parent folder node
    getAllowedToolbarActions(): Array<ContentActionRef> {
        return this.toolbarActions
            .filter(action => this.filterByRules(action))
            .map(action => {
                if (action.type === ContentActionType.menu) {
                    const copy = this.copyAction(action);
                    if (copy.children && copy.children.length > 0) {
                        copy.children = copy.children
                            .filter(childAction =>
                                this.filterByRules(childAction)
                            )
                            .reduce(reduceSeparators, []);
                    }
                    return copy;
                }
                return action;
            })
            .reduce(reduceEmptyMenus, [])
            .reduce(reduceSeparators, []);
    }

    getViewerToolbarActions(): Array<ContentActionRef> {
        return this.viewerToolbarActions
            .filter(action => this.filterByRules(action));
    }

    getAllowedContextMenuActions(): Array<ContentActionRef> {
        return this.contextMenuActions
            .filter(action => this.filterByRules(action));
    }

    copyAction(action: ContentActionRef): ContentActionRef {
        return {
            ...action,
            children: (action.children || []).map(child =>
                this.copyAction(child)
            )
        };
    }

    filterByRules(action: ContentActionRef): boolean {
        if (action && action.rules && action.rules.visible) {
            return this.extensions.evaluateRule(action.rules.visible, this);
        }
        return true;
    }

    runActionById(id: string, context?: any) {
        const action = this.extensions.getActionById(id);
        if (action) {
            const { type, payload } = action;
            const expression = this.extensions.runExpression(payload, context);

            this.store.dispatch({ type, payload: expression });
        } else {
            this.store.dispatch({ type: id });
        }
    }

    getEvaluator(key: string): RuleEvaluator {
        return this.extensions.getEvaluator(key);
    }
}
