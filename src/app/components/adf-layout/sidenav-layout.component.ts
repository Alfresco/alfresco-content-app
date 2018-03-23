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

import { Component, ContentChild, Input, OnInit, TemplateRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppLayoutHeaderDirective } from './app-layout-header.directive';
import { AppLayoutNavigationDirective } from './app-layout-navigation.directive';
import { AppLayoutContentDirective } from './app-layout-content.directive';

@Component({
    selector: 'app-sidenav-layout',
    templateUrl: './sidenav-layout.component.html',
    styleUrls: ['./sidenav-layout.component.scss']
})
export class SidenavLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

    static STEP_OVER = 600;

    @Input() sidenavMin: number;
    @Input() sidenavMax: number;
    @Input() stepOver: number;
    @Input() hideSidenav = false;

    @ContentChild(AppLayoutHeaderDirective, {read: TemplateRef}) headerTemplate: TemplateRef<any>;
    @ContentChild(AppLayoutNavigationDirective, {read: TemplateRef}) navigationTemplate: TemplateRef<any>;
    @ContentChild(AppLayoutContentDirective, {read: TemplateRef}) contentTemplate: TemplateRef<any>;

    @ViewChild('container') container: any;

    mediaQueryList: MediaQueryList;
    isMenuMinimized = false;
    templateContext = {
        toggleMenu: () => {},
        isMenuMinimized: () => this.isMenuMinimized
    };

    constructor(private mediaMatcher: MediaMatcher) {
        this.onMediaQueryChange = this.onMediaQueryChange.bind(this);
    }

    ngOnInit() {
        const stepOver = this.stepOver || SidenavLayoutComponent.STEP_OVER;
        this.mediaQueryList = this.mediaMatcher.matchMedia(`(max-width: ${stepOver}px)`);
        this.mediaQueryList.addListener(this.onMediaQueryChange);
    }

    ngAfterViewInit() {
        this.templateContext.toggleMenu = this.toggleMenu.bind(this);
    }

    ngOnDestroy(): void {
        this.mediaQueryList.removeListener(this.onMediaQueryChange);
    }

    toggleMenu() {
        if (!this.mediaQueryList.matches) {
            this.isMenuMinimized = !this.isMenuMinimized;
        } else {
            this.isMenuMinimized = false;
        }

        this.container.toggleMenu();
    }

    get isHeaderInside() {
        return this.mediaQueryList.matches;
    }

    private onMediaQueryChange() {
        this.isMenuMinimized = false;
    }
}
