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

import { Component, ViewEncapsulation, SecurityContext, OnInit } from '@angular/core';
import { AppConfigService, StorageService, SettingsService } from '@alfresco/adf-core';
import { DomSanitizer } from '@angular/platform-browser';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'aca-settings',
    templateUrl: './settings.component.html',
    encapsulation: ViewEncapsulation.None,
    // tslint:disable-next-line:use-host-property-decorator
    host: { class: 'aca-settings' }
})
export class SettingsComponent implements OnInit {

    private defaultPath = '/assets/images/alfresco-logo-white.svg';
    private defaultBackgroundColor = '#2196F3';

    form: FormGroup;

    constructor(
        private appConfig: AppConfigService,
        private sanitizer: DomSanitizer,
        private settingsService: SettingsService,
        private storage: StorageService,
        private fb: FormBuilder) {

        }

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

    ngOnInit() {
        this.form = this.fb.group({
            ecmHost: ['', [Validators.required, Validators.pattern('^(http|https):\/\/.*[^/]$')]]
        });

        this.reset();
    }

    apply(model: any, isValid: boolean) {
        if (isValid) {
            this.storage.setItem('ecmHost', model.ecmHost);
            // window.location.reload(true);
        }
    }

    reset() {
        this.form.reset({
            ecmHost: this.storage.getItem('ecmHost') || this.settingsService.ecmHost
        });
    }
}
