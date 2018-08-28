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
import { selectionWithFolder } from '../store/selectors/app.selectors';
import * as core from './evaluators/core.evaluators';
import { NodePermissionService } from '../services/node-permission.service';
import { ProfileResolver } from '../services/profile.resolver';
import {
    SelectionState, NavigationState, ExtensionConfig, RouteRef,
    RuleContext, RuleRef, RuleEvaluator, RuleParameter, ViewerExtensionRef,
    ActionRef, ContentActionRef, ContentActionType,
    ExtensionLoaderService,
    SidebarTabRef, NavBarGroupRef,
    sortByOrder, filterEnabled, reduceSeparators, reduceEmptyMenus
} from '@alfresco/adf-extensions';

@Injectable()
export class AppExtensionService implements RuleContext {
    configPath = 'assets/app.extensions.json';
    pluginsPath = 'assets/plugins';

    defaults = {
        layout: 'app.layout.main',
        auth: ['app.auth']
    };

    rules: Array<RuleRef> = [];
    routes: Array<RouteRef> = [];
    actions: Array<ActionRef> = [];

    toolbarActions: Array<ContentActionRef> = [];
    viewerToolbarActions: Array<ContentActionRef> = [];
    viewerContentExtensions: Array<ViewerExtensionRef> = [];
    contextMenuActions: Array<ContentActionRef> = [];
    openWithActions: Array<ContentActionRef> = [];
    createActions: Array<ContentActionRef> = [];
    navbar: Array<NavBarGroupRef> = [];
    sidebar: Array<SidebarTabRef> = [];

    authGuards: { [key: string]: Type<{}> } = {};
    components: { [key: string]: Type<{}> } = {};

    evaluators: { [key: string]: RuleEvaluator } = {};
    selection: SelectionState;
    navigation: NavigationState;

    constructor(
        private store: Store<AppStore>,
        private loader: ExtensionLoaderService,
        public permissions: NodePermissionService) {

        this.evaluators = {
            'core.every': core.every,
            'core.some': core.some,
            'core.not': core.not
        };

        this.store.select(selectionWithFolder).subscribe(result => {
            this.selection = result.selection;
            this.navigation = result.navigation;
        });
    }

    async load() {
        const config = await this.loader.load(this.configPath, this.pluginsPath);
        this.setup(config);
    }

    setup(config: ExtensionConfig) {
        if (!config) {
            console.error('Extension configuration not found');
            return;
        }

        this.rules = this.loader.getRules(config);
        this.actions = this.loader.getActions(config);
        this.routes = this.loader.getRoutes(config);
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
                        const routeRef = this.getRouteById(item.route);
                        const url = `/${routeRef ? routeRef.path : item.route}`;
                        return {
                            ...item,
                            url
                        };
                    })
            };
        });
    }

    setEvaluators(values: { [key: string]: RuleEvaluator }) {
        if (values) {
            this.evaluators = Object.assign({}, this.evaluators, values);
        }
    }

    setAuthGuards(values: { [key: string]: Type<{}> }) {
        if (values) {
            this.authGuards = Object.assign({}, this.authGuards, values);
        }
    }

    setComponents(values: { [key: string]: Type<{}> }) {
        if (values) {
            this.components = Object.assign({}, this.components, values);
        }
    }

    getRouteById(id: string): RouteRef {
        return this.routes.find(route => route.id === id);
    }

    getAuthGuards(ids: string[]): Array<Type<{}>> {
        return (ids || [])
            .map(id => this.authGuards[id])
            .filter(guard => guard);
    }

    getNavigationGroups(): Array<NavBarGroupRef> {
        return this.navbar;
    }

    getSidebarTabs(): Array<SidebarTabRef> {
        return this.sidebar;
    }

    getComponentById(id: string): Type<{}> {
        return this.components[id];
    }

    getApplicationRoutes(): Array<Route> {
        return this.routes.map(route => {
            const guards = this.getAuthGuards(
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
            .filter(filterEnabled)
            .filter(action => this.filterByRules(action))
            .map(action => {
                let disabled = false;

                if (action.rules && action.rules.enabled) {
                    disabled = !this.evaluateRule(action.rules.enabled);
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
            .filter(filterEnabled)
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
            .filter(filterEnabled)
            .filter(action => this.filterByRules(action));
    }

    getAllowedContextMenuActions(): Array<ContentActionRef> {
        return this.contextMenuActions
            .filter(filterEnabled)
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
            return this.evaluateRule(action.rules.visible);
        }
        return true;
    }

    getActionById(id: string): ActionRef {
        return this.actions.find(action => action.id === id);
    }

    runActionById(id: string, context?: any) {
        const action = this.getActionById(id);
        if (action) {
            const { type, payload } = action;
            const expression = this.runExpression(payload, context);

            this.store.dispatch({ type, payload: expression });
        } else {
            this.store.dispatch({ type: id });
        }
    }

    runExpression(value: string, context?: any) {
        const pattern = new RegExp(/\$\((.*\)?)\)/g);
        const matches = pattern.exec(value);

        if (matches && matches.length > 1) {
            const expression = matches[1];
            const fn = new Function('context', `return ${expression}`);
            const result = fn(context);

            return result;
        }

        return value;
    }

    getEvaluator(key: string): RuleEvaluator {
        if (key && key.startsWith('!')) {
            const fn = this.evaluators[key.substring(1)];
            return (context: RuleContext, ...args: RuleParameter[]): boolean => {
                return !fn(context, ...args);
            };
        }
        return this.evaluators[key];
    }

    evaluateRule(ruleId: string): boolean {
        const ruleRef = this.rules.find(ref => ref.id === ruleId);

        if (ruleRef) {
            const evaluator = this.getEvaluator(ruleRef.type);
            if (evaluator) {
                return evaluator(this, ...ruleRef.parameters);
            }
        } else {
            const evaluator = this.getEvaluator(ruleId);
            if (evaluator) {
                return evaluator(this);
            }
        }
        return false;
    }
}
