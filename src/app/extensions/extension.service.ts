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
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Route } from '@angular/router';
import { ExtensionConfig } from './extension.config';
import { AppStore, SelectionState } from '../store/states';
import { NavigationState } from '../store/states/navigation.state';
import { selectionWithFolder } from '../store/selectors/app.selectors';
import { NavBarGroupRef } from './navbar.extensions';
import { RouteRef } from './routing.extensions';
import { RuleContext, RuleRef, RuleEvaluator } from './rule.extensions';
import { ActionRef, ContentActionRef, ContentActionType } from './action.extensions';
import * as core from './evaluators/core.evaluators';

@Injectable()
export class ExtensionService implements RuleContext {
    configPath = 'assets/app.extensions.json';
    pluginsPath = 'assets/plugins';

    defaults = {
        layout: 'app.layout.main',
        auth: ['app.auth']
    };

    rules: Array<RuleRef> = [];
    routes: Array<RouteRef> = [];
    actions: Array<ActionRef> = [];

    contentActions: Array<ContentActionRef> = [];
    openWithActions: Array<ContentActionRef> = [];
    createActions: Array<ContentActionRef> = [];
    navbar: Array<NavBarGroupRef> = [];

    authGuards: { [key: string]: Type<{}> } = {};
    components: { [key: string]: Type<{}> } = {};

    evaluators: { [key: string]: RuleEvaluator } = {};
    selection: SelectionState;
    navigation: NavigationState;

    constructor(private http: HttpClient, private store: Store<AppStore>) {

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

    load(): Promise<boolean> {
        return new Promise<any>(resolve => {
            this.loadConfig(this.configPath, 0).then(result => {
                let config = result.config;

                if (config.$references && config.$references.length > 0) {
                    const plugins = config.$references.map(
                        (name, idx) => this.loadConfig(`${this.pluginsPath}/${name}`, idx)
                    );

                    Promise.all(plugins).then((results => {
                        const configs = results
                            .filter(entry => entry)
                            .sort(this.sortByOrder)
                            .map(entry => entry.config);

                        if (configs.length > 0) {
                            config = this.mergeObjects(config, ...configs);
                        }

                        this.setup(config);
                        resolve(true);
                    }));
                } else {
                    this.setup(config);
                    resolve(true);
                }
            });
        });
    }

    setup(config: ExtensionConfig) {
        if (!config) {
            console.error('Extension configuration not found');
            return;
        }

        this.rules = this.loadRules(config);
        this.actions = this.loadActions(config);
        this.routes = this.loadRoutes(config);
        this.contentActions = this.loadContentActions(config);
        this.openWithActions = this.loadViewerOpenWith(config);
        this.createActions = this.loadCreateActions(config);
        this.navbar = this.loadNavBar(config);
    }

    protected loadConfig(url: string, order: number): Promise<{ order: number, config: ExtensionConfig }> {
        return new Promise(resolve => {
            this.http.get<ExtensionConfig>(url).subscribe(
                config => {
                    resolve({
                        order,
                        config
                    });
                },
                error => {
                    console.log(error);
                    resolve(null);
                }
            );
        });
    }

    protected loadCreateActions(config: ExtensionConfig): Array<ContentActionRef> {
        if (config && config.features) {
            return (config.features.create || []).sort(
                this.sortByOrder
            );
        }
        return [];
    }

    protected loadContentActions(config: ExtensionConfig) {
        if (config && config.features && config.features.content) {
            return (config.features.content.actions || []).sort(
                this.sortByOrder
            );
        }
        return [];
    }

    protected loadNavBar(config: ExtensionConfig): any {
        if (config && config.features) {
            return (config.features.navbar || [])
                .filter(entry => !entry.disabled)
                .sort(this.sortByOrder)
                .map(group => {
                    return {
                        ...group,
                        items: (group.items || [])
                            .filter(item => !item.disabled)
                            .sort(this.sortByOrder)
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
        return {};
    }

    protected loadViewerOpenWith(config: ExtensionConfig): Array<ContentActionRef> {
        if (config && config.features && config.features.viewer) {
            return (config.features.viewer.openWith || [])
                .filter(entry => !entry.disabled)
                .sort(this.sortByOrder);
        }
        return [];
    }

    protected loadRules(config: ExtensionConfig): Array<RuleRef> {
        if (config && config.rules) {
            return config.rules;
        }
        return [];
    }

    protected loadRoutes(config: ExtensionConfig): Array<RouteRef> {
        if (config) {
            return config.routes || [];
        }
        return [];
    }

    protected loadActions(config: ExtensionConfig): Array<ActionRef> {
        if (config) {
            return config.actions || [];
        }
        return [];
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
            .filter(this.filterEnabled)
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
    getAllowedContentActions(): Array<ContentActionRef> {
        return this.contentActions
            .filter(this.filterEnabled)
            .filter(action => this.filterByRules(action))
            .reduce(this.reduceSeparators, [])
            .map(action => {
                if (action.type === ContentActionType.menu) {
                    const copy = this.copyAction(action);
                    if (copy.children && copy.children.length > 0) {
                        copy.children = copy.children
                            .filter(childAction =>
                                this.filterByRules(childAction)
                            )
                            .reduce(this.reduceSeparators, []);
                    }
                    return copy;
                }
                return action;
            })
            .reduce(this.reduceEmptyMenus, []);
    }

    reduceSeparators(
        acc: ContentActionRef[],
        el: ContentActionRef,
        i: number,
        arr: ContentActionRef[]
    ): ContentActionRef[] {
        // remove duplicate separators
        if (i > 0) {
            const prev = arr[i - 1];
            if (
                prev.type === ContentActionType.separator &&
                el.type === ContentActionType.separator
            ) {
                return acc;
            }

            // remove trailing separator
            if (i === arr.length - 1) {
                if (el.type === ContentActionType.separator) {
                    return acc;
                }
            }
        }

        return acc.concat(el);
    }

    reduceEmptyMenus(
        acc: ContentActionRef[],
        el: ContentActionRef
    ): ContentActionRef[] {
        if (el.type === ContentActionType.menu) {
            if ((el.children || []).length === 0) {
                return acc;
            }
        }
        return acc.concat(el);
    }

    sortByOrder(
        a: { order?: number | undefined },
        b: { order?: number | undefined }
    ) {
        const left = a.order === undefined ? Number.MAX_SAFE_INTEGER : a.order;
        const right = b.order === undefined ? Number.MAX_SAFE_INTEGER : b.order;
        return left - right;
    }

    filterEnabled(entry: { disabled?: boolean }): boolean {
        return !entry.disabled;
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

    evaluateRule(ruleId: string): boolean {
        const ruleRef = this.rules.find(ref => ref.id === ruleId);

        if (ruleRef) {
            const evaluator = this.evaluators[ruleRef.type];
            if (evaluator) {
                return evaluator(this, ...ruleRef.parameters);
            }
        } else {
            const evaluator = this.evaluators[ruleId];
            if (evaluator) {
                return evaluator(this);
            }
        }
        return false;
    }

    mergeObjects(...objects): any {
        const result = {};

        objects.forEach(source => {
            Object.keys(source).forEach(prop => {
                if (!prop.startsWith('$')) {
                    if (prop in result && Array.isArray(result[prop])) {
                        // result[prop] = result[prop].concat(source[prop]);
                        result[prop] = this.mergeArrays(result[prop], source[prop]);
                    } else if (prop in result && typeof result[prop] === 'object') {
                        result[prop] = this.mergeObjects(result[prop], source[prop]);
                    } else {
                        result[prop] = source[prop];
                    }
                }
            });
        });

        return result;
    }

    mergeArrays(left: any[], right: any[]): any[] {
        const result = [];
        const map = {};

        (left || []).forEach(entry => {
            const element = entry;
            if (element && element.hasOwnProperty('id')) {
                map[element.id] = element;
            } else {
                result.push(element);
            }
        });

        (right || []).forEach(entry => {
            const element = entry;
            if (element && element.hasOwnProperty('id') && map[element.id]) {
                const merged = this.mergeObjects(map[element.id], element);
                map[element.id] = merged;
            } else {
                result.push(element);
            }
        });

        return Object.values(map).concat(result);
    }
}
