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

import {
  ElementFinder,
  ExpectedConditions as EC,
  browser,
  by,
  ElementArrayFinder,
  ProtractorBrowser,
  until
} from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../configs';

export abstract class Component {
  component: ElementFinder;

  protected byCss(
    css: string,
    root: ElementFinder | ProtractorBrowser = this.component
  ): ElementFinder {
    return root.element(by.css(css));
  }

  protected byCssText(
    css: string,
    text: string,
    root: ElementFinder | ProtractorBrowser = this.component
  ): ElementFinder {
    return root.element(by.cssContainingText(css, text));
  }

  protected byId(
    css: string,
    root: ElementFinder | ProtractorBrowser = this.component
  ): ElementFinder {
    return root.element(by.id(css));
  }

  protected allByCss(
    css: string,
    root: ElementFinder | ProtractorBrowser = this.component
  ): ElementArrayFinder {
    return root.all(by.css(css));
  }

  constructor(selector: string, ancestor?: string) {
    const locator = selector;

    this.component = ancestor
      ? browser
          .$$(ancestor)
          .first()
          .$$(locator)
          .first()
      : browser.$$(locator).first();
  }

  async wait() {
    await browser.wait(EC.presenceOf(this.component), BROWSER_WAIT_TIMEOUT);
  }

  async waitCss(css: string, errorMessage?: string): Promise<void> {
    await browser.wait(
      until.elementLocated(by.css(css)),
      BROWSER_WAIT_TIMEOUT,
      errorMessage || 'Timeout waiting for CSS selector'
    );
  }

  protected async waitForVisibility(
    element: ElementFinder,
    errorMessage?: string
  ) {
    return browser.wait(
      EC.visibilityOf(element),
      BROWSER_WAIT_TIMEOUT,
      errorMessage || 'Timeout waiting for element visibility'
    );
  }

  protected async waitForPresence(
    element: ElementFinder,
    errorMessage?: string
  ): Promise<void> {
    return browser.wait(
      EC.presenceOf(element),
      BROWSER_WAIT_TIMEOUT,
      errorMessage || 'Timeout waiting for element presence'
    );
  }

  protected async waitForStaleness(
    element: ElementFinder,
    errorMessage?: string
  ): Promise<void> {
    return browser.wait(
      EC.stalenessOf(element),
      BROWSER_WAIT_TIMEOUT,
      errorMessage || 'Timeout waiting element staleness'
    );
  }
}
