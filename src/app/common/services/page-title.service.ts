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

import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppConfigService, TranslationService } from '@alfresco/adf-core';

@Injectable()
export class PageTitleService {

    private originalTitle = '';
    private translatedTitle = '';

    constructor(
        private titleService: Title,
        private appConfig: AppConfigService,
        private translationService: TranslationService) {
        translationService.translate.onLangChange.subscribe(() => this.onLanguageChanged());
        // TODO: contribute this fix to ADF 2.5.0
        translationService.translate.onTranslationChange.subscribe(() => this.onLanguageChanged());
    }

    /**
     * Sets the page title.
     * @param value The new title
     */
    setTitle(value: string = '') {
        this.originalTitle = value;
        this.translatedTitle = this.translationService.instant(value);

        this.updateTitle();
    }

    private onLanguageChanged() {
        this.translatedTitle = this.translationService.instant(this.originalTitle);
        this.updateTitle();
    }

    private updateTitle() {
        const name = this.appConfig.get('application.name') || 'Alfresco ADF Application';

        const title = this.translatedTitle ? `${this.translatedTitle} - ${name}` : `${name}`;
        this.titleService.setTitle(title);
    }
}
