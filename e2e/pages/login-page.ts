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

    loginWith(username: string, password?: string): promise.Promise<any> {
        const pass = password || username;
        return this.load()
            .then(() => this.login.enterCredentials(username, pass).submit())
            .then(() => super.waitForApp());
    }

    loginWithAdmin(): promise.Promise<any> {
        return this.load()
            .then(() => this.loginWith(ADMIN_USERNAME, ADMIN_PASSWORD));
    }

    tryLoginWith(username: string, password?: string): promise.Promise<void> {
        const pass = password || username;
        return this.load()
            .then(() => this.login.enterCredentials(username, pass).submit())
            .then(() => browser.wait(EC.presenceOf(this.login.errorMessage), BROWSER_WAIT_TIMEOUT));
    }
}
