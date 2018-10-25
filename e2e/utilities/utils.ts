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

import { browser, protractor, promise, ElementFinder, ExpectedConditions as EC } from 'protractor';
import { BROWSER_WAIT_TIMEOUT, E2E_ROOT_PATH, EXTENSIBILITY_CONFIGS } from '../configs';
const path = require('path');
const fs = require('fs');

export class Utils {
  // generate a random value
  static random() {
    return Math.random().toString(36).substring(5, 10).toLowerCase();
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

  static setSessionStorageFromConfig(key: string, configFileName: string) {
    const configFile = `${E2E_ROOT_PATH}/resources/extensibility-configs/${configFileName}`;
    const fileContent = JSON.stringify(fs.readFileSync(configFile, { encoding: 'utf8' }));

    return browser.executeScript(`window.sessionStorage.setItem(${key}, ${fileContent});`);
  }

  static resetExtensionConfig() {
    const defConfig = `${E2E_ROOT_PATH}/resources/extensibility-configs/${EXTENSIBILITY_CONFIGS.DEFAULT_EXTENSIONS_CONFIG}`;

    return this.setSessionStorageFromConfig('"aca.extension.config"', defConfig);
  }

  static retryCall(fn: () => Promise<any>, retry: number = 30, delay: number = 1000): Promise<any> {
    const pause = duration => new Promise(res => setTimeout(res, duration));

    const run = retries => fn().catch(err => (retries > 1 ? pause(delay).then(() => run(retries - 1)) : Promise.reject(err)));

    return run(retry);
  }

  static async waitUntilElementClickable(element: ElementFinder) {
    return await browser.wait(EC.elementToBeClickable(element), BROWSER_WAIT_TIMEOUT).catch(Error);
  // static waitUntilElementClickable(element: ElementFinder) {
  //   return browser.wait(EC.elementToBeClickable(element), BROWSER_WAIT_TIMEOUT);
  }

  static async typeInField(elem: ElementFinder, value: string) {
    for (let i = 0; i < value.length; i++) {
      const c = value.charAt(i);
      await elem.sendKeys(c);
      await browser.sleep(100);
    }
  }

  static async fileExistsOnOS(fileName: string) {
    const config = await browser.getProcessedConfig();
    const filePath = path.join(config.params.downloadFolder, fileName);

    let tries = 5;

    return new Promise(function(resolve) {
      const checkExist = setInterval(() => {
        fs.stat(filePath, function(error) {
          tries--;

          if (error && tries === 0) {
            clearInterval(checkExist);
            resolve(false);
          }

          if (!error) {
            clearInterval(checkExist);
            resolve(true);
          }
        });
      }, 500);
    });
  }

  static pressEscape() {
    return browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
  }

  static getBrowserLog() {
    return browser.manage().logs().get('browser');
  }

  static formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US');
  }
}
