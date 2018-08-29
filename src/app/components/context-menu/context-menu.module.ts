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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { MatMenuModule, MatListModule, MatIconModule, MatButtonModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@alfresco/adf-core';
import { CoreExtensionsModule } from '../../extensions/core.extensions.module';

import { ContextActionsDirective } from './context-menu.directive';
import { ContextMenuService } from './context-menu.service';
import { ContextMenuComponent } from './context-menu.component';
import { ContextMenuItemDirective } from './context-menu-item.directive';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { OutsideEventDirective } from './context-menu-outside-event.directive';

@NgModule({
    imports: [
        MatMenuModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        BrowserModule,
        CoreExtensionsModule.forChild(),
        CoreModule.forChild(),
        ExtensionsModule.forChild()
    ],
    declarations: [
        ContextActionsDirective,
        ContextMenuComponent,
        ContextMenuItemDirective,
        OutsideEventDirective
    ],
    exports: [
        OutsideEventDirective,
        ContextActionsDirective,
        ContextMenuComponent
    ],
    entryComponents: [
        ContextMenuComponent
    ]
})
export class ContextMenuModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ContextMenuModule,
            providers: [
                ContextMenuService
            ]
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: ContextMenuModule
        };
    }
}
