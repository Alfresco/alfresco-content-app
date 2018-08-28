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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActionRef, ContentActionRef, ContentActionType } from '../config/action.extensions';
import { ExtensionElement } from '../config/extension-element';
import { filterEnabled, getValue, mergeObjects, sortByOrder } from '../config/extension-utils';
import { ExtensionConfig } from '../config/extension.config';
import { RouteRef } from '../config/routing.extensions';
import { RuleRef } from '../config/rule.extensions';

@Injectable({
    providedIn: 'root'
})
export class ExtensionLoaderService {
    constructor(private http: HttpClient) {}

    load(configPath: string, pluginsPath: string): Promise<ExtensionConfig> {
        return new Promise<any>(resolve => {
            this.loadConfig(configPath, 0).then(result => {
                let config = result.config;

                const override = sessionStorage.getItem('aca.extension.config');
                if (override) {
                    console.log('overriding extension config');
                    config = JSON.parse(override);
                }

                const externalPlugins =
                    localStorage.getItem('experimental.external-plugins') ===
                    'true';

                if (
                    externalPlugins &&
                    config.$references &&
                    config.$references.length > 0
                ) {
                    const plugins = config.$references.map((name, idx) =>
                        this.loadConfig(`${pluginsPath}/${name}`, idx)
                    );

                    Promise.all(plugins).then(results => {
                        const configs = results
                            .filter(entry => entry)
                            .sort(sortByOrder)
                            .map(entry => entry.config);

                        if (configs.length > 0) {
                            config = mergeObjects(config, ...configs);
                        }

                        resolve(config);
                    });
                } else {
                    resolve(config);
                }
            });
        });
    }

    protected loadConfig(
        url: string,
        order: number
    ): Promise<{ order: number; config: ExtensionConfig }> {
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

    getElements<T extends ExtensionElement>(
        config: ExtensionConfig,
        key: string,
        fallback: Array<T> = []
    ): Array<T> {
        const values = getValue(config, key) || fallback || [];
        return values.filter(filterEnabled).sort(sortByOrder);
    }

    getContentActions(
        config: ExtensionConfig,
        key: string
    ): Array<ContentActionRef> {
        return this.getElements(config, key).map(this.setActionDefaults);
    }

    getRules(config: ExtensionConfig): Array<RuleRef> {
        if (config && config.rules) {
            return config.rules;
        }
        return [];
    }

    getRoutes(config: ExtensionConfig): Array<RouteRef> {
        if (config) {
            return config.routes || [];
        }
        return [];
    }

    getActions(config: ExtensionConfig): Array<ActionRef> {
        if (config) {
            return config.actions || [];
        }
        return [];
    }

    protected setActionDefaults(action: ContentActionRef): ContentActionRef {
        if (action) {
            action.type = action.type || ContentActionType.default;
            action.icon = action.icon || 'extension';
        }
        return action;
    }
}
