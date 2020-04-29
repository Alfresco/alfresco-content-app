/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
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

import { browser, protractor, ElementFinder, ExpectedConditions as EC, by, logging, until } from 'protractor';
import { Logger } from '@alfresco/adf-testing';
import { BROWSER_WAIT_TIMEOUT, E2E_ROOT_PATH } from '../configs';

const path = require('path');
const fs = require('fs');
const StreamZip = require('node-stream-zip');

export async function typeText(element: ElementFinder, text: string) {
  await element.clear();
  await element.sendKeys(text);
}

export async function clearTextWithBackspace(element: ElementFinder) {
  await element.clear();
  await element.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
}

export async function waitElement(css: string, errorMessage?: string): Promise<any> {
  return browser.wait(
    until.elementLocated(by.css(css)),
    BROWSER_WAIT_TIMEOUT,
    errorMessage || 'Timeout waiting for element'
  );
}

export async function waitForClickable(
  element: ElementFinder,
  errorMessage?: string
): Promise<void> {
  return browser.wait(
    EC.elementToBeClickable(element),
    BROWSER_WAIT_TIMEOUT,
    errorMessage || 'Timeout waiting for element to be clickable'
  );
}

export async function waitForVisibility(
  element: ElementFinder,
  errorMessage?: string
): Promise<void> {
  return browser.wait(
    EC.visibilityOf(element),
    BROWSER_WAIT_TIMEOUT,
    errorMessage || 'Timeout waiting for element visibility'
  );
}

export async function waitForInvisibility(
  element: ElementFinder,
  errorMessage?: string
): Promise<void> {
  return browser.wait(
    EC.invisibilityOf(element),
    BROWSER_WAIT_TIMEOUT,
    errorMessage || 'Timeout waiting for element visibility'
  );
}

export async function waitForPresence(
  element: ElementFinder,
  errorMessage?: string
): Promise<void> {
  return browser.wait(
    EC.presenceOf(element),
    BROWSER_WAIT_TIMEOUT,
    errorMessage || 'Timeout waiting for element presence'
  );
}

export async function waitForStaleness(
  element: ElementFinder,
  errorMessage?: string
): Promise<void> {
  return browser.wait(
    EC.stalenessOf(element),
    BROWSER_WAIT_TIMEOUT,
    errorMessage || 'Timeout waiting element staleness'
  );
}

export const isPresentAndEnabled = async (element: ElementFinder): Promise<boolean> => {
  const isPresent = await element.isPresent();

  if (isPresent) {
    return element.isEnabled();
  }

  return false;
};

export const isPresentAndDisplayed = async (element: ElementFinder): Promise<boolean> => {
  const isPresent = await element.isPresent();

  if (isPresent) {
    return element.isDisplayed();
  }

  return false;
};

export class Utils {
  static string257 = 'assembly doctor offender limit clearance inspiration baker fraud active apples trait brainstorm concept breaks down presidential \
    reluctance summary communication patience books opponent banana economist head develop project swear unanimous read conservation';

  static string513 = 'great indirect brain tune other expectation fun silver drain tumble rhythm harmful wander picture distribute opera complication copyright \
    explosion snack ride pool machinery pair frog joint wrestle video referee drive window cage falsify happen tablet horror thank conception \
    extension decay dismiss platform respect ceremony applaud absorption presentation dominate race courtship soprano body \
    lighter track cinema tread tick climate lend summit singer radical flower visual negotiation promises cooperative live';

  static random(): string {
    return Math.random().toString(36).substring(5, 10).toLowerCase();
  }

  static async clearLocalStorage(): Promise<void> {
    await browser.executeScript('window.localStorage.clear();');
  }

  static async setSessionStorageFromConfig(configFileName: string): Promise<void> {
    const configFile = `${E2E_ROOT_PATH}/resources/extensibility-configs/${configFileName}`;
    const fileContent = JSON.stringify(fs.readFileSync(configFile, { encoding: 'utf8' }));

    await browser.executeScript(`window.sessionStorage.setItem('app.extension.config', ${fileContent});`);
  }

  static retryCall(fn: () => Promise<any>, retry: number = 30, delay: number = 1000): Promise<any> {
    const pause = duration => new Promise(res => setTimeout(res, duration));

    const run = retries => {
      return fn().catch(err => (retries > 1 ? pause(delay).then(() => run(retries - 1)) : Promise.reject(err)));
    }

    return run(retry);
  }

  static async clearFieldWithBackspace(elem: ElementFinder): Promise<void> {
    const text = await elem.getAttribute('value');
    for (let i = 0; i < text.length; i++) {
      await elem.sendKeys(protractor.Key.BACK_SPACE);
    }
  }

  static async fileExistsOnOS(fileName: string, folderName: string = '', subFolderName: string = ''): Promise<any> {
    const config = await browser.getProcessedConfig();
    const filePath = path.join(config.params.downloadFolder, folderName, subFolderName, fileName);

    let tries = 15;

    return new Promise(function(resolve) {
      const checkExist = setInterval(() => {
        fs.access(filePath, function(error) {
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

  static async renameFile(oldName: string, newName: string): Promise<void> {
    const config = await browser.getProcessedConfig();
    const oldFilePath = path.join(config.params.downloadFolder, oldName);
    const newFilePath = path.join(config.params.downloadFolder, newName);

    const fileExists = await this.fileExistsOnOS(oldName);

    if (fileExists) {
      fs.rename(oldFilePath, newFilePath, function (err) {
        if (err) {
          Logger.error('==== rename err: ', err);
        }
      });
    }
  }

  static async unzip(filename: string, unzippedName: string = ''): Promise<void> {
    const config = await browser.getProcessedConfig();
    const filePath = path.join(config.params.downloadFolder, filename);
    const output = path.join(config.params.downloadFolder, unzippedName ? unzippedName : '');

    const zip = new StreamZip({
      file: filePath,
      storeEntries: true
    });

    await zip.on('error', err => { Logger.error('=== unzip err: ', err) });

    await zip.on('ready', async () => {
      if (unzippedName) {
        await fs.mkdirSync(output);
      }
      await zip.extract(null, output, async () => {
        await zip.close();
      });
    });
  }

  static async pressEscape(): Promise<void> {
    await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
  }

  static async pressTab(): Promise<void> {
    await browser.actions().sendKeys(protractor.Key.TAB).perform();
  }

  static async pressCmd(): Promise<void> {
    await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
  }

  static async releaseKeyPressed(): Promise<void> {
    await browser.actions().sendKeys(protractor.Key.NULL).perform();
  }

  static async getBrowserLog(): Promise<logging.Entry[]> {
    return browser.manage().logs().get('browser');
  }

  static formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US');
  }

  static async uploadFileNewVersion(fileFromOS: string): Promise<void> {
    const el = browser.element(by.id('app-upload-file-version'));
    await el.sendKeys(`${E2E_ROOT_PATH}/resources/test-files/${fileFromOS}`);
  }

}
