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

import { CoreModule } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DirectivesModule } from '../../directives/directives.module';
import { AppInfoDrawerModule } from '../info-drawer/info.drawer.module';
import { PreviewComponent } from './preview.component';
import { ContentDirectiveModule } from '@alfresco/adf-content-services';

import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.PDFJS.workerSrc = 'pdf.worker.js';
pdfjsLib.PDFJS.disableFontFace = true;

const routes: Routes = [
    {
        path: '',
        component: PreviewComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        CoreModule.forChild(),
        ContentDirectiveModule,
        DirectivesModule,
        AppInfoDrawerModule
    ],
    declarations: [
        PreviewComponent,
    ],
    exports: [
        PreviewComponent
    ]
})
export class PreviewModule {}
