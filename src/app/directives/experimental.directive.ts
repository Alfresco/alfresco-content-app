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

import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { AppConfigService } from '@alfresco/adf-core';
import { environment } from '../../environments/environment';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[ifExperimental]'
})
export class ExperimentalDirective {
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        private config: AppConfigService
    ) {}

    @Input() set ifExperimental(featureKey: string) {
        if (!environment.production) {
            const value = this.config.get<boolean>(`experimental.${featureKey}`);
            if (value) {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
                return;
            }
        }

        this.viewContainerRef.clear();
    }
}
