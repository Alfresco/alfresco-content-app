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

import { NgModule } from '@angular/core';
import { Dynamic1Component } from './dynamic1.component';
import { Dynamic2Component } from './dynamic2.component';
import { PluginService } from '../services/plugin.service';
import { EffectsModule } from '@ngrx/effects';
import { DynamicEffects } from './dynamic.effect';
import { Store } from '@ngrx/store';
import { DynamicAction } from './dynamic.actions';

@NgModule({
    imports: [
        EffectsModule.forFeature([DynamicEffects])
    ],
    declarations: [Dynamic1Component, Dynamic2Component],
    entryComponents: [Dynamic1Component, Dynamic2Component]
})
export class DynamicComponentModule {
    constructor(plugins: PluginService, store: Store<any>) {
        plugins.components['dynamic1'] = Dynamic1Component;
        plugins.components['dynamic2'] = Dynamic2Component;
        store.dispatch(new DynamicAction('hello world'));
    }
}
