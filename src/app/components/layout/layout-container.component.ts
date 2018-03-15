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
import {MediaMatcher} from '@angular/cdk/layout';

import { miniSidenavAnimation } from './animations';

@Component({
    selector: 'app-layout-container',
    templateUrl: './layout-container.component.html',
    styleUrls: ['./layout-container.component.scss'],
    animations: [ miniSidenavAnimation ]
})
export class LayoutContainerComponent implements OnInit, OnDestroy {
    static STEP_OVER = 600;

    @Input() sidenavMin: number;
    @Input() sidenavMax: number;
    @Input() stepOver: number;
    @Input() hideSidenav: boolean = false;

    @ViewChild(MatSidenav) sidenav: MatSidenav;

    sidenavAnimationState: any;
    isMenuMinimized = false;
    mobileQuery: MediaQueryList;

    constructor(private mediaMatcher: MediaMatcher) {
        this.mobileQueryListener = this.mobileQueryListener.bind(this);
    }

    ngOnInit() {
        const stepOver = this.stepOver || LayoutContainerComponent.STEP_OVER;
        this.mobileQuery = this.mediaMatcher.matchMedia(`(max-width: ${stepOver}px)`);
        this.mobileQuery.addListener(this.mobileQueryListener);
        this.sidenavAnimationState = { value: 'expanded', params: { width: this.sidenavMax } };
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this.mobileQueryListener);
    }

    toggleMenu(): void {

        if (!this.mobileQuery.matches) {
            this.isMenuMinimized = !this.isMenuMinimized;

            this.sidenavAnimationState =
                this.sidenavAnimationState.value === 'expanded'
                    ? { value: 'compact', params: {width: this.sidenavMin } }
                    : { value: 'expanded', params: { width: this.sidenavMax } };

        } else {
            this.isMenuMinimized = false;
            this.sidenav.toggle();
        }
    }

    private mobileQueryListener() {
        this.isMenuMinimized = false;
        this.sidenavAnimationState = { value: 'expanded', params: { width: this.sidenavMax } };
    }
}
