/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { browser, ElementFinder, protractor } from 'protractor';
import { waitUntilElementHasValue, waitUntilElementIsClickable, waitUntilElementIsVisible } from './browser-visibility';

export async function click(elementToClick: ElementFinder): Promise<void> {
  try {
    await waitUntilElementIsVisible(elementToClick);
    await waitUntilElementIsClickable(elementToClick);
    await elementToClick.click();
  } catch (clickErr) {
    await clickScript(elementToClick);
  }
}

export async function rightClick(elementFinder: ElementFinder): Promise<void> {
  await browser.actions().mouseMove(elementFinder).mouseDown().mouseMove(elementFinder).perform();
  await browser.actions().click(elementFinder, protractor.Button.RIGHT).perform();
}

async function clickScript(elementToClick: ElementFinder): Promise<void> {
  await browser.executeScript(`arguments[0].scrollIntoView();`, elementToClick);
  await browser.executeScript(`arguments[0].click();`, elementToClick);
}

export async function getInputValue(elementFinder: ElementFinder): Promise<string> {
  const present = await waitUntilElementIsVisible(elementFinder);
  if (present) {
    return browser.executeScript(`return arguments[0].value`, elementFinder);
  } else {
    console.error(`Get Input value ${elementFinder.locator().toString()} not present`);
    return '';
  }
}

export async function getUrl(url: string, timeout: number = 10000): Promise<any> {
  return browser.get(url, timeout);
}

export async function clearSendKeys(elementFinder: ElementFinder, text: string = '', sleepTime: number = 0): Promise<void> {
  await this.click(elementFinder);
  await elementFinder.sendKeys('');
  await elementFinder.clear();

  if (sleepTime === 0) {
    await elementFinder.sendKeys(text);
  } else {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < text.length; i++) {
      await elementFinder.sendKeys(text[i]);
      await browser.sleep(sleepTime);
    }
  }

  try {
    if (text !== protractor.Key.SPACE && text !== protractor.Key.ENTER) {
      await waitUntilElementHasValue(elementFinder, text, 1000);
    }
  } catch (e) {
    console.info(`Set value different from the input`);
  }
}
