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

import { Subject } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AppExtensionService } from '../../extensions/extension.service';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states';
import { currentFolder } from '../../store/selectors/app.selectors';
import { takeUntil } from 'rxjs/operators';
import { ContentActionRef, NavBarGroupRef } from '@alfresco/adf-extensions';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
    @Input() showLabel: boolean;

    groups: Array<NavBarGroupRef> = [];
    createActions: Array<ContentActionRef> = [];
    onDestroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private store: Store<AppStore>,
        private extensions: AppExtensionService
    ) {}

    ngOnInit() {
        this.groups = this.extensions.getNavigationGroups();

        this.store
            .select(currentFolder)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                this.createActions = this.extensions.getCreateActions();
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    trackById(index: number, obj: { id: string }) {
        return obj.id;
    }
}
