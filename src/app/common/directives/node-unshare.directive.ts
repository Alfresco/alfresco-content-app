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

import { Directive, HostListener, Input, ElementRef } from '@angular/core';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { MinimalNodeEntity } from 'alfresco-js-api';

@Directive({
    selector: '[acaUnshareNode]'
})
export class NodeUnshareDirective {

    // tslint:disable-next-line:no-input-rename
    @Input('acaUnshareNode')
    selection: MinimalNodeEntity[];

    constructor(
        private apiService: AlfrescoApiService,
        private el: ElementRef) {
    }

    @HostListener('click')
    onClick() {
        if (this.selection.length > 0) {
            this.unshareLinks(this.selection);
        }
    }

    private async unshareLinks(links: MinimalNodeEntity[]) {
        const promises = links.map(link => this.apiService.sharedLinksApi.deleteSharedLink(link.entry.id));
        await Promise.all(promises);
        this.emitDone();
    }

    private emitDone() {
        const e = new CustomEvent('links-unshared', { bubbles: true });
        this.el.nativeElement.dispatchEvent(e);
    }

}
