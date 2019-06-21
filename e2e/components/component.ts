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
  by,
  ElementArrayFinder
} from 'protractor';
import { BROWSER_WAIT_TIMEOUT } from '../configs';

export abstract class Component {
  component: ElementFinder;

  constructor(selector: string, ancestor?: ElementFinder) {
    const locator = selector;

    this.component = ancestor
      ? ancestor.$$(locator).first()
      : browser.$$(locator).first();
  }

  /**
   * Wait for element presence
   * @param element Element finder
   * @param message Message
   */
  async wait(element?: ElementFinder, message?: string) {
    await browser.wait(
      EC.presenceOf(element || this.component),
      BROWSER_WAIT_TIMEOUT,
      message
    );
  }

  /**
   * Wait for element absence
   * @param element Element finder
   * @param message Message
   */
  async waitStale(element?: ElementFinder, message?: string) {
    await browser.wait(
      EC.stalenessOf(element || this.component),
      BROWSER_WAIT_TIMEOUT,
      message
    );
  }

  /**
   * Get an element finder based on a CSS selector
   * @param selector CSS selector value
   */
  protected getByCss(selector: string): ElementFinder {
    return this.component.element(by.css(selector));
  }

  /**
   * Get an array of element finders based on a CSS selector
   * @param selector CSS selector value
   */
  protected getAllByCss(selector: string): ElementArrayFinder {
    return this.component.all(by.css(selector));
  }

  /**
   * Get an element by ID
   * @param id ID value
   */
  protected getById(id: string): ElementFinder {
    return this.component.element(by.id(id));
  }

  /**
   * Get an element by the containing text
   * @param selector Selector
   * @param text Text
   */
  protected getByText(selector: string, text: string): ElementFinder {
    return this.component.element(by.cssContainingText(selector, text));
  }
}
