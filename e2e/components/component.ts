/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2019 Alfresco Software Limited
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

import {
  ElementFinder,
  ExpectedConditions as EC,
  browser,
  protractor
} from 'protractor';

/**
 * @deprecated Use ADF implementation instead.
 */
export abstract class Component {
  component: ElementFinder;

  waitTimeout = 10000;

  constructor(selector: string, ancestor?: ElementFinder) {
    const locator = selector;

    this.component = ancestor
      ? ancestor.$$(locator).first()
      : browser.$$(locator).first();
  }

  async wait() {
    await browser.wait(EC.presenceOf(this.component), this.waitTimeout);
  }

  async waitUntilElementClickable(element: ElementFinder) {
    return await browser
      .wait(EC.elementToBeClickable(element), this.waitTimeout)
      .catch(Error);
  }

  async typeInField(elem: ElementFinder, value: string) {
    for (let i = 0; i < value.length; i++) {
      const c = value.charAt(i);
      await elem.sendKeys(c);
      await browser.sleep(100);
    }
  }

  async pressEscape() {
    return await browser
      .actions()
      .sendKeys(protractor.Key.ESCAPE)
      .perform();
  }

  async pressTab() {
    return await browser
      .actions()
      .sendKeys(protractor.Key.TAB)
      .perform();
  }
}
