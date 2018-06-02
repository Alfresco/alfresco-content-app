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

import { Directive, Input, OnInit, HostListener } from '@angular/core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { UserPreferencesService } from '@alfresco/adf-core';

@Directive({
    selector: '[acaSortingPreferenceKey]',
})
export class SortingPreferenceKeyDirective implements OnInit {

    // tslint:disable-next-line:no-input-rename
    @Input('acaSortingPreferenceKey')
    preferenceKey: string;

    constructor(
        private documentList: DocumentListComponent,
        private userPreferencesService: UserPreferencesService) {
    }

    @HostListener('sorting-changed', ['$event'])
    onSortingChanged(event: CustomEvent) {
        if (this.preferenceKey) {
            this.userPreferencesService.set(`${this.preferenceKey}.sorting.key`, event.detail.key);
            this.userPreferencesService.set(`${this.preferenceKey}.sorting.direction`, event.detail.direction);
        }
    }

    ngOnInit() {
        if (this.preferenceKey) {
            const current = this.documentList.sorting;

            const key = this.userPreferencesService.get(`${this.preferenceKey}.sorting.key`, current[0]);
            const direction = this.userPreferencesService.get(`${this.preferenceKey}.sorting.direction`, current[1]);

            this.documentList.sorting = [key, direction];
            // TODO: bug in ADF, the `sorting` binding is not updated when changed from code
            this.documentList.data.setSorting({ key, direction });
        }
    }
}
