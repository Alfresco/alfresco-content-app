/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { falseIfMissing } from 'protractor/built/util';

export async function waitUntilElementIsVisible(
  elementToCheck: ElementFinder,
  waitTimeout: number = 10000,
  message: string = 'Element is not visible'
): Promise<any> {
  return browser.wait(protractor.ExpectedConditions.visibilityOf(elementToCheck), waitTimeout, message + elementToCheck.locator());
}

export async function waitUntilElementIsNotVisible(elementToCheck: ElementFinder, waitTimeout: number = 10000): Promise<any> {
  return browser.wait(
    protractor.ExpectedConditions.invisibilityOf(elementToCheck),
    waitTimeout,
    'Element is Visible and it should not' + elementToCheck.locator()
  );
}

export async function waitUntilElementIsClickable(elementToCheck: ElementFinder, waitTimeout: number = 10000): Promise<any> {
  return browser.wait(
    protractor.ExpectedConditions.elementToBeClickable(elementToCheck),
    waitTimeout,
    'Element is not Clickable ' + elementToCheck.locator()
  );
}

export async function waitUntilElementIsPresent(elementToCheck: ElementFinder, waitTimeout: number = 10000): Promise<any> {
  return browser.wait(protractor.ExpectedConditions.presenceOf(elementToCheck), waitTimeout, 'Element is not present ' + elementToCheck.locator());
}

export async function waitUntilElementIsNotPresent(elementToCheck: ElementFinder, waitTimeout: number = 10000): Promise<any> {
  return browser.wait(protractor.ExpectedConditions.stalenessOf(elementToCheck), waitTimeout, 'Element is present ' + elementToCheck.locator());
}

function textToBePresentInElementValue(elementFinder: ElementFinder, text: string) {
  const hasText = async () =>
    browser.executeScript(`return arguments[0].value`, elementFinder).then((actualText: string) => actualText.indexOf(text) > -1, falseIfMissing);
  return protractor.ExpectedConditions.and(protractor.ExpectedConditions.presenceOf(elementFinder), hasText);
}

export async function waitUntilElementHasValue(elementToCheck: ElementFinder, elementValue, waitTimeout: number = 10000): Promise<any> {
  return browser.wait(
    textToBePresentInElementValue(elementToCheck, elementValue),
    waitTimeout,
    `Element doesn't have a value ${elementValue} ${elementToCheck.locator()}`
  );
}

export async function waitUntilElementHasText(elementToCheck: ElementFinder, text, waitTimeout: number = 10000): Promise<any> {
  return browser.wait(
    protractor.ExpectedConditions.textToBePresentInElement(elementToCheck, text),
    waitTimeout,
    `Element doesn't have the text ${text}  ${elementToCheck.locator()}`
  );
}
