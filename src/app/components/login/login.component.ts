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

import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators } from '@angular/forms';
import { AuthenticationService, UserPreferencesService } from '@alfresco/adf-core';

const skipRedirectUrls: string[] = [
    '/logout',
    '/personal-files'
];

@Component({
    templateUrl: './login.component.html'
})
export class LoginComponent {

    private redirectUrl = '';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private auth: AuthenticationService,
        private userPreferences: UserPreferencesService
    ) {
        if (auth.isEcmLoggedIn()) {
            this.redirect();
        }

        route.params.subscribe((params: any) => {
            if (skipRedirectUrls.indexOf(params.redirect) > -1) {
                const remainingParams = Object.assign({}, params);

                delete remainingParams.redirect;

                router.navigate(['/login', remainingParams]);
            }

            this.redirectUrl = params.redirect;
        });
    }

    redirect() {
        this.router.navigateByUrl(this.redirectUrl || '');
    }

    onLoginSuccess(data) {
        if (data && data.username) {
            this.userPreferences.setStoragePrefix(data.username);
        }
        this.redirect();
    }
}
