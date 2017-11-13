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

import { browser, ExpectedConditions as EC, promise } from 'protractor';
import { LoginComponent } from '../components/components';
import { Page } from './page';
import { Utils } from '../utilities/utils';

import {
    ADMIN_USERNAME,
    ADMIN_PASSWORD,
    BROWSER_WAIT_TIMEOUT,
    APP_ROUTES
} from '../configs';

export class LoginPage extends Page {
    login: LoginComponent = new LoginComponent(this.app);

    /** @override */
    constructor() {
        super(APP_ROUTES.LOGIN);
    }

    /** @override */
    load(): promise.Promise<any> {
        return super.load().then(() => {
            const { submitButton } = this.login;
            const hasSubmitButton = EC.presenceOf(submitButton);

            return browser.wait(hasSubmitButton, BROWSER_WAIT_TIMEOUT)
                .then(() => Utils.clearLocalStorage())
                .then(() => browser.manage().deleteAllCookies());
        });
    }

    loginWith(username: string, password?: string): promise.Promise<void> {
        const pass = password || username;
        return this.login.enterCredentials(username, pass).submit()
            .then(() => {
                super.waitForApp();
            });
    }

    loginWithAdmin(): promise.Promise<any> {
        return this.loginWith(ADMIN_USERNAME, ADMIN_PASSWORD);
    }
}
