/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { NgModule } from '@angular/core';
import { AcaFolderRulesModule } from '@alfresco/aca-content/folder-rules';
import { AosExtensionModule } from '@alfresco/aca-content/ms-office';
import { AcaAboutModule, DEV_MODE_TOKEN, PACKAGE_JSON } from '@alfresco/aca-content/about';
import { environment } from '../environments/environment';
import packageJson from 'package.json';

@NgModule({
  imports: [AosExtensionModule, AcaAboutModule, AcaFolderRulesModule],
  providers: [
    { provide: PACKAGE_JSON, useValue: packageJson },
    { provide: DEV_MODE_TOKEN, useValue: !environment.production }
  ]
})
export class AppExtensionsModule {}
