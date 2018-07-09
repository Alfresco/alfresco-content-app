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
import { RouteExtension } from './route.extension';
import { ActionExtension } from './action.extension';
import { AppConfigService } from '@alfresco/adf-core';
import { ContentActionExtension } from './content-action.extension';
import { OpenWithExtension } from './open-with.extension';
import { AppStore, SelectionState } from '../store/states';
import { Store } from '@ngrx/store';
import { NavigationExtension } from './navigation.extension';
import { Route } from '@angular/router';
import { Node } from 'alfresco-js-api';

@Injectable()
export class ExtensionService {
    routes: Array<RouteExtension> = [];
    actions: Array<ActionExtension> = [];

    contentActions: Array<ContentActionExtension> = [];
    openWithActions: Array<OpenWithExtension> = [];
    createActions: Array<ContentActionExtension> = [];

    authGuards: { [key: string]: Type<{}> } = {};
    components: { [key: string]: Type<{}> } = {};

    constructor(
        private config: AppConfigService,
        private store: Store<AppStore>
    ) {}

    // initialise extension service
    // in future will also load and merge data from the external plugins
    init() {
        this.routes = this.config.get<Array<RouteExtension>>(
            'extensions.core.routes',
            []
        );

        this.actions = this.config.get<Array<ActionExtension>>(
            'extensions.core.actions',
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
    }

    getRouteById(id: string): RouteExtension {
        return this.routes.find(route => route.id === id);
    }

    getActionById(id: string): ActionExtension {
        return this.actions.find(action => action.id === id);
    }

    runActionById(id: string, context?: any) {
        const action = this.getActionById(id);
        if (action) {
            const { type, payload } = action;
            const expression = this.runExpression(payload, context);

            this.store.dispatch({ type, payload: expression });
        }
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

    getAuthGuards(ids: string[] = []): Array<Type<{}>> {
        return ids.map(id => this.authGuards[id]);
    }

    getComponentById(id: string): Type<{}> {
        return this.components[id];
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
        return this.createActions.filter(this.filterOutDisabled).map(action => {
            if (
                action.target &&
                action.target.permissions &&
                action.target.permissions.length > 0
            ) {
                return {
                    ...action,
                    disabled: !this.nodeHasPermissions(
                        folder,
                        action.target.permissions
                    ),
                    target: {
                        ...action.target
                    }
                };
            }
            return action;
        });
    }

    // evaluates content actions for the selection and parent folder node
    getSelectedContentActions(
        selection: SelectionState,
        parentNode: Node
    ): Array<ContentActionExtension> {
        return this.contentActions
            .filter(this.filterOutDisabled)
            .filter(action => action.target)
            .filter(action => this.filterByTarget(selection, action))
            .filter(action =>
                this.filterByPermission(selection, action, parentNode)
            );
    }

    private sortByOrder(
        a: { order?: number | undefined },
        b: { order?: number | undefined }
    ) {
        const left = a.order === undefined ? Number.MAX_SAFE_INTEGER : a.order;
        const right = b.order === undefined ? Number.MAX_SAFE_INTEGER : b.order;
        return left - right;
    }

    private filterOutDisabled(entry: { disabled?: boolean }): boolean {
        return !entry.disabled;
    }

    // todo: support multiple selected nodes
    private filterByTarget(
        selection: SelectionState,
        action: ContentActionExtension
    ): boolean {
        const types = action.target.types;

        if (!types || types.length === 0) {
            return true;
        }

        if (selection && !selection.isEmpty) {

            if (selection.nodes.length === 1) {
                if (selection.folder && types.includes('folder')) {
                    return true;
                }
                if (selection.file && types.includes('file')) {
                    return true;
                }
                return false;
            } else {
                if (types.length === 1) {
                    if (types.includes('folder')) {
                        if (action.target.multiple) {
                            return selection.nodes.every(node => node.entry.isFolder);
                        }
                        return false;
                    }
                    if (types.includes('file')) {
                        if (action.target.multiple) {
                            return selection.nodes.every(node => node.entry.isFile);
                        }
                        return false;
                    }
                } else {
                    return types.some(type => {
                        if (type === 'folder') {
                            return action.target.multiple
                                ? selection.nodes.some(node => node.entry.isFolder)
                                : selection.nodes.every(node => node.entry.isFolder);
                        }
                        if (type === 'file') {
                            return action.target.multiple
                                ? selection.nodes.some(node => node.entry.isFile)
                                : selection.nodes.every(node => node.entry.isFile);
                        }
                        return false;
                    });
                }
            }
        }

        return false;
    }

    // todo: support multiple selected nodes
    private filterByPermission(
        selection: SelectionState,
        action: ContentActionExtension,
        parentNode: Node
    ): boolean {
        const permissions = action.target.permissions;

        if (!permissions || permissions.length === 0) {
            return true;
        }

        return permissions.some(permission => {
            if (permission.startsWith('parent.')) {
                if (parentNode) {
                    const parentQuery = permission.split('.')[1];
                    // console.log(parentNode.allowableOperations, parentQuery);
                    return this.nodeHasPermissions(parentNode, [parentQuery]);
                }
                return false;
            }

            if (selection && selection.first) {
                return this.nodeHasPermissions(
                    selection.first.entry,
                    permissions
                );
            }

            return true;
        });

        return true;
    }

    private nodeHasPermissions(
        node: Node,
        permissions: string[] = []
    ): boolean {
        if (
            node &&
            node.allowableOperations &&
            node.allowableOperations.length > 0
        ) {
            return permissions.some(permission =>
                node.allowableOperations.includes(permission)
            );
        }
        return false;
    }
}
