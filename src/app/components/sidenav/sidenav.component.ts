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

import { Subject } from 'rxjs/Rx';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Node } from 'alfresco-js-api';
import { NodePermissionService } from '../../common/services/node-permission.service';
import { ExtensionService } from '../../extensions/extension.service';
import { NavigationExtension } from '../../extensions/navigation.extension';
import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states';
import { CreateFolderAction } from '../../store/actions';
import { currentFolder } from '../../store/selectors/app.selectors';
import { takeUntil } from 'rxjs/operators';
import { ContentActionExtension } from '../../extensions/content-action.extension';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
    @Input() showLabel: boolean;

    node: Node = null;
    groups: Array<NavigationExtension[]> = [];
    createActions: Array<ContentActionExtension> = [];
    canCreateContent = false;
    onDestroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private store: Store<AppStore>,
        private permission: NodePermissionService,
        private extensions: ExtensionService
    ) {
    }

    ngOnInit() {
        this.groups = this.extensions.getNavigationGroups();

        this.store.select(currentFolder)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(node => {
                this.node = node;
                this.createActions = this.extensions.getFolderCreateActions(node);
                this.canCreateContent = node && this.permission.check(node, ['create']);
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    createNewFolder() {
        if (this.node && this.node.id) {
            this.store.dispatch(new CreateFolderAction(this.node.id));
        }
    }

    // this is where each application decides how to treat an action and what to do
    // the ACA maps actions to the NgRx actions as an example
    runAction(actionId: string) {
        this.extensions.runActionById(actionId);
    }
}
