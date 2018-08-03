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

import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';

@Directive({
    selector: '[acaContextMenuItem]',
})
export class ContextMenuItemDirective implements OnDestroy, FocusableOption {
    constructor(
        private elementRef: ElementRef,
        private focusMonitor: FocusMonitor) {

        focusMonitor.monitor(this.getHostElement(), false);
    }

    ngOnDestroy() {
        this.focusMonitor.stopMonitoring(this.getHostElement());
    }

    focus(origin: FocusOrigin = 'keyboard'): void {
        this.focusMonitor.focusVia(this.getHostElement(), origin);
    }

    private getHostElement(): HTMLElement {
        return this.elementRef.nativeElement;
    }
}
