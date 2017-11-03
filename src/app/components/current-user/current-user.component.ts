/*!
 * @license
 * Copyright 2017 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { PeopleContentService, AppConfigService } from 'ng2-alfresco-core';
import { Subscription } from 'rxjs/Rx';

@Component({
    selector: 'app-current-user',
    templateUrl: './current-user.component.html',
    styleUrls: [ './current-user.component.scss' ]
})
export class CurrentUserComponent implements OnInit, OnDestroy {
    private personSubscription: Subscription;

    user: any = null;

    constructor(
        private peopleApi: PeopleContentService,
        private appConfig: AppConfigService
    ) {}

    ngOnInit() {
        this.personSubscription = this.peopleApi.getCurrentPerson()
            .subscribe((person: any) => {
                this.user = person.entry;
        });
    }

    ngOnDestroy() {
        this.personSubscription.unsubscribe();
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

    get showLanguagePicker() {
        return this.appConfig.get('languagePicker') || false;
    }
}
