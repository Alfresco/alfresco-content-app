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

import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AppStore } from '../../store/states/app.state';
import { SetUserAction } from '../../store/actions/user.actions';
import { selectUser } from '../../store/selectors/app.selectors';
import { PeopleContentService } from '@alfresco/adf-core';

@Injectable()
export class ProfileResolver implements Resolve<any> {
    constructor(private store: Store<AppStore>, private peopleApi: PeopleContentService) { }

    resolve(): Observable<any> {

        this.init();

        return this.profileLoaded();
    }

    profileLoaded(): Observable<any> {
        return this.store.select(selectUser).take(1);
    }

    init(): void {
        this.peopleApi.getCurrentPerson().subscribe((person: any) => {
            this.store.dispatch(new SetUserAction(person.entry));
        });
    }
}
