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

import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { NodePermissionService } from '../../services/node-permission.service';
import { SidenavViewsManagerDirective } from './sidenav-views-manager.directive';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states';
import {
    currentFolder,
    selectAppName,
    selectHeaderColor,
    selectLogoPath
} from '../../store/selectors/app.selectors';
import { takeUntil } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'app-layout' }
})
export class LayoutComponent implements OnInit, OnDestroy {
    @ViewChild(SidenavViewsManagerDirective)
    manager: SidenavViewsManagerDirective;

    onDestroy$: Subject<boolean> = new Subject<boolean>();
    expandedSidenav: boolean;
    node: MinimalNodeEntryEntity;
    canUpload = false;

    appName$: Observable<string>;
    headerColor$: Observable<string>;
    logo$: Observable<string>;

    isSmallScreen = false;

    constructor(
        protected store: Store<AppStore>,
        private permission: NodePermissionService,
        private breakpointObserver: BreakpointObserver
    ) {
        this.headerColor$ = store.select(selectHeaderColor);
        this.appName$ = store.select(selectAppName);
        this.logo$ = store.select(selectLogoPath);
    }

    ngOnInit() {
        if (!this.manager.minimizeSidenav) {
            this.expandedSidenav = this.manager.sidenavState;
        } else {
            this.expandedSidenav = false;
        }

        this.manager.run(true);

        this.store
            .select(currentFolder)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(node => {
                this.node = node;
                this.canUpload =
                    node && this.permission.check(node, ['create']);
            });

        this.breakpointObserver
            .observe([
                Breakpoints.HandsetPortrait,
                Breakpoints.HandsetLandscape
            ])
            .subscribe(result => {
                this.isSmallScreen = result.matches;
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
