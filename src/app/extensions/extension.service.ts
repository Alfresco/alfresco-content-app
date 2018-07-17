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
import { AppConfigService } from '@alfresco/adf-core';
import {
    ContentActionExtension,
    ContentActionType
} from './content-action.extension';
import { OpenWithExtension } from './open-with.extension';
import { NavigationExtension } from './navigation.extension';
import { Route } from '@angular/router';
import { Node } from 'alfresco-js-api';
import { RuleService } from './rules/rule.service';
import { ActionService } from './actions/action.service';
import { ActionRef } from './actions/action-ref';
import { RouteRef } from './route-ref';

@Injectable()
export class ExtensionService {

    contentActions: Array<ContentActionExtension> = [];
    openWithActions: Array<OpenWithExtension> = [];
    createActions: Array<ContentActionExtension> = [];

    protected routes: Array<RouteRef> = [];
    protected authGuards: { [key: string]: Type<{}> } = {};
    protected components: { [key: string]: Type<{}> } = {};

    constructor(
        private config: AppConfigService,
        private ruleService: RuleService,
        private actionService: ActionService
    ) {}

    // initialise extension service
    // in future will also load and merge data from the external plugins
    init() {
        this.routes = this.config.get<Array<RouteRef>>(
            'extensions.core.routes',
            []
        );

        this.contentActions = this.config
            .get<Array<ContentActionExtension>>(
                'extensions.core.features.content.actions',
                []
            )
            .sort(this.sortByOrder);

        this.openWithActions = this.config
            .get<Array<OpenWithExtension>>(
                'extensions.core.features.viewer.open-with',
                []
            )
            .filter(entry => !entry.disabled)
            .sort(this.sortByOrder);

        this.createActions = this.config
            .get<Array<ContentActionExtension>>(
                'extensions.core.features.create',
                []
            )
            .sort(this.sortByOrder);

        this.ruleService.init();
        this.actionService.init();
    }

    setAuthGuard(key: string, value: Type<{}>): ExtensionService {
        this.authGuards[key] = value;
        return this;
    }

    getRouteById(id: string): RouteRef {
        return this.routes.find(route => route.id === id);
    }

    getActionById(id: string): ActionRef {
        return this.actionService.getActionById(id);
    }

    runActionById(id: string, context?: any) {
        this.actionService.runActionById(id, context);
    }

    getAuthGuards(ids: string[]): Array<Type<{}>> {
        return (ids || [])
            .map(id => this.authGuards[id])
            .filter(guard => guard);
    }

    getNavigationGroups(): Array<NavigationExtension[]> {
        const settings = this.config.get<any>(
            'extensions.core.features.navigation'
        );
        if (settings) {
            const groups = Object.keys(settings).map(key => {
                return settings[key]
                    .map(group => {
                        const customRoute = this.getRouteById(group.route);
                        const route = `/${
                            customRoute ? customRoute.path : group.route
                        }`;

                        return {
                            ...group,
                            route
                        };
                    })
                    .filter(entry => !entry.disabled);
            });

            return groups;
        }

        return [];
    }

    setComponent(id: string, value: Type<{}>): ExtensionService {
        this.components[id] = value;
        return this;
    }

    getComponentById(id: string): Type<{}> {
        return this.components[id];
    }

    getApplicationRoutes(): Array<Route> {
        return this.routes.map(route => {
            const guards = this.getAuthGuards(route.auth);

            return {
                path: route.path,
                component: this.getComponentById(route.layout),
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

    // evaluates create actions for the folder node
    getFolderCreateActions(folder: Node): Array<ContentActionExtension> {
        return this.createActions
            .filter(this.filterEnabled)
            .filter(action => this.filterByRules(action))
            .map(action => {
                let disabled = false;

                if (action.rules && action.rules.enabled) {
                    disabled = !this.ruleService.evaluateRule(action.rules.enabled);
                }

                return {
                    ...action,
                    disabled
                };
        });
    }

    // evaluates content actions for the selection and parent folder node
    getAllowedContentActions(): Array<ContentActionExtension> {
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
        acc: ContentActionExtension[],
        el: ContentActionExtension,
        i: number,
        arr: ContentActionExtension[]
    ): ContentActionExtension[] {
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
        acc: ContentActionExtension[],
        el: ContentActionExtension
    ): ContentActionExtension[] {
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

    copyAction(action: ContentActionExtension): ContentActionExtension {
        return {
            ...action,
            children: (action.children || []).map(child =>
                this.copyAction(child)
            )
        };
    }

    filterByRules(action: ContentActionExtension): boolean {
        if (action && action.rules && action.rules.visible) {
            return this.ruleService.evaluateRule(action.rules.visible);
        }
        return true;
    }
}
