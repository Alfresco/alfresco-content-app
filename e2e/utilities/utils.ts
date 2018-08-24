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

import { browser, promise, ElementFinder, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT, E2E_ROOT_PATH, EXTENSIBILITY_CONFIGS } from '../configs';

const fs = require('fs');

export class Utils {
    // generate a random value
    static random(): string {
        return Math.random().toString(36).substring(3, 10).toLowerCase();
    }

    // local storage
    static clearLocalStorage(): promise.Promise<any> {
        return browser.executeScript('window.localStorage.clear();');
    }

    // session storage
    static clearSessionStorage(): promise.Promise<any> {
        return browser.executeScript('window.sessionStorage.clear();');
    }

    static getSessionStorage() {
        return browser.executeScript('return window.sessionStorage.getItem("aca.extension.config");');
    }

    static async setSessionStorageFromConfig(key: string, configFileName: string) {
        const configFile = `${E2E_ROOT_PATH}/resources/extensibility-configs/${configFileName}`;
        const fileContent = JSON.stringify(fs.readFileSync(configFile, { encoding: 'utf8' }));

        return await browser.executeScript(`window.sessionStorage.setItem(${key}, ${fileContent});`);
    }

    static async resetExtensionConfig() {
        const defConfig = `${E2E_ROOT_PATH}/resources/extensibility-configs/${EXTENSIBILITY_CONFIGS.DEFAULT_EXTENSIONS_CONFIG}`;

        return await this.setSessionStorageFromConfig('"aca.extension.config"', defConfig);
    }

    static retryCall(fn: () => Promise <any>, retry: number = 30, delay: number = 1000): Promise<any> {
        const pause = (duration) => new Promise(res => setTimeout(res, duration));

        const run = (retries) =>
            fn().catch(err => retries > 1
                ? pause(delay).then(() => run(retries - 1))
                : Promise.reject(err));

        return run(retry);
    }

    static waitUntilElementClickable(element: ElementFinder) {
        return browser.wait(EC.elementToBeClickable(element), BROWSER_WAIT_TIMEOUT);
    }

    static typeInField(elem: ElementFinder, value: string) {
        for ( let i = 0; i < value.length; i++ ) {
            const c = value.charAt(i);
            elem.sendKeys(c);
            browser.sleep(100);
        }
    }
}
