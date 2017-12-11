/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2017 Alfresco Software Limited
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

import { DomSanitizer } from '@angular/platform-browser';
import { Component, ViewEncapsulation, SecurityContext } from '@angular/core';
import { AppConfigService } from '@alfresco/adf-core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: [ './header.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
    private defaultPath = '/assets/images/alfresco-logo-white.svg';
    private defaultBackgroundColor = '#2196F3';

    constructor(
        private appConfig: AppConfigService,
        private sanitizer: DomSanitizer
    ) {}

    get appName(): string {
        return <string>this.appConfig.get('application.name');
    }

    get logo() {
        return this.appConfig.get('application.logo', this.defaultPath);
    }

    get backgroundColor() {
        const color = this.appConfig.get('headerColor', this.defaultBackgroundColor);
        return this.sanitizer.sanitize(SecurityContext.STYLE, color);
    }
}
