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

import { Component, OnInit } from '@angular/core';
import { ContentManagementService } from '../../common/services/content-management.service';
import { PageComponent } from '../page.component';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/selectors/app.selectors';
import { AppStore } from '../../store/states/app.state';
import { ProfileState } from '../../store/states/profile.state';
import { ExtensionService } from '../../extensions/extension.service';

@Component({
    templateUrl: './trashcan.component.html'
})
export class TrashcanComponent extends PageComponent implements OnInit {
    user: ProfileState;

    constructor(private contentManagementService: ContentManagementService,
                extensions: ExtensionService,
                store: Store<AppStore>) {
        super(store, extensions);
    }

    ngOnInit() {
        super.ngOnInit();

        this.subscriptions.push(
            this.contentManagementService.nodesRestored.subscribe(() => this.reload()),
            this.contentManagementService.nodesPurged.subscribe(() => this.reload()),
            this.contentManagementService.nodesRestored.subscribe(() => this.reload()),
            this.store.select(selectUser).subscribe((user) => this.user = user)
        );
    }
 }
