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

import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { Store } from '@ngrx/store';
import { AppStore } from '../../store/states/app.state';
import { selectUser } from '../../store/selectors/app.selectors';

@Component({
    selector: 'aca-current-user',
    templateUrl: './current-user.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'aca-current-user' }
})
export class CurrentUserComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    user: any = null;

    constructor(private store: Store<AppStore>) {}

    ngOnInit() {
        this.subscriptions = this.subscriptions.concat([
            this.store.select(selectUser).subscribe((user) => this.user = user)
        ]);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    get userFirstName(): string {
        const { user } = this;
        return user ? (user.firstName || '') : '';
    }

    get userLastName(): string {
        const { user } = this;
        return user ? (user.lastName || '') : '';
    }

    get userName(): string {
        const { userFirstName: first, userLastName: last } = this;
        return `${first} ${last}`;
    }

    get userInitials(): string {
        const { userFirstName: first, userLastName: last } = this;
        return [ first[0], last[0] ].join('');
    }
}
