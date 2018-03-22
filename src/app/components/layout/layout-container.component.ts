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

import { Component, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { sidenavAnimation, contentAnimation } from './animations';

@Component({
    selector: 'app-layout-container',
    templateUrl: './layout-container.component.html',
    styleUrls: ['./layout-container.component.scss'],
    animations: [ sidenavAnimation, contentAnimation ]
})
export class LayoutContainerComponent implements OnInit, OnDestroy {
    @Input() sidenavMin: number;
    @Input() sidenavMax: number;
    @Input() mediaQueryList: MediaQueryList;
    @Input() hideSidenav = false;

    @ViewChild(MatSidenav) sidenav: MatSidenav;

    sidenavAnimationState: any;
    contentAnimationState: any;

    SIDENAV_STATES = { EXPANDED: {}, COMPACT: {} };
    CONTENT_STATES = { MOBILE: {}, EXPANDED: {}, COMPACT: {} };

    constructor() {
        this.onMediaQueryChange = this.onMediaQueryChange.bind(this);
    }

    ngOnInit() {
        this.SIDENAV_STATES.EXPANDED = { value: 'expanded', params: { width: this.sidenavMax } };
        this.SIDENAV_STATES.COMPACT = { value: 'compact', params: {width: this.sidenavMin } };
        this.CONTENT_STATES.MOBILE = { value: 'expanded', params: { marginLeft: 0 } };
        this.CONTENT_STATES.EXPANDED = { value: 'expanded', params: { marginLeft: this.sidenavMin } };
        this.CONTENT_STATES.COMPACT = { value: 'compact', params: { marginLeft: this.sidenavMax } };

        this.mediaQueryList.addListener(this.onMediaQueryChange);

        this.sidenavAnimationState = this.SIDENAV_STATES.EXPANDED;
        this.contentAnimationState = this.CONTENT_STATES.COMPACT;
    }

    ngOnDestroy(): void {
        this.mediaQueryList.removeListener(this.onMediaQueryChange);
    }

    toggleMenu(): void {
        if (this.isMobileScreenSize) {
            this.sidenav.toggle();
        } else {
            this.sidenavAnimationState = this.toggledSidenavAnimation;
            this.contentAnimationState = this.toggledContentAnimation;
        }
    }

    private get toggledSidenavAnimation() {
        return this.sidenavAnimationState === this.SIDENAV_STATES.EXPANDED
            ? this.SIDENAV_STATES.COMPACT
            : this.SIDENAV_STATES.EXPANDED;
    }

    private get toggledContentAnimation() {
        if (this.isMobileScreenSize) {
            return this.CONTENT_STATES.MOBILE;
        }

        if (this.sidenavAnimationState === this.SIDENAV_STATES.EXPANDED) {
            return this.CONTENT_STATES.COMPACT;
        } else {
            return this.CONTENT_STATES.EXPANDED;
        }
    }

    private get isMobileScreenSize(): boolean {
        return this.mediaQueryList.matches;
    }

    private onMediaQueryChange() {
        this.sidenavAnimationState = this.SIDENAV_STATES.EXPANDED;
        this.contentAnimationState = this.toggledContentAnimation;
    }
}
