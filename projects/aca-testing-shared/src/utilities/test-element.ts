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

import { by, element, ElementFinder, protractor, $, browser } from 'protractor';
import { clearSendKeys, click, getInputValue } from './browser-actions';
import {
  waitUntilElementHasValue,
  waitUntilElementIsNotPresent,
  waitUntilElementIsNotVisible,
  waitUntilElementIsPresent,
  waitUntilElementIsVisible
} from './browser-visibility';

async function getAttribute(elementFinder: ElementFinder, attribute: string): Promise<string> {
  await waitUntilElementIsPresent(elementFinder);
  const attributeValue: string = await browser.executeScript(`return arguments[0].getAttribute(arguments[1])`, elementFinder, attribute);
  return attributeValue || '';
}

async function getText(elementFinder: ElementFinder): Promise<string> {
  const present = await waitUntilElementIsVisible(elementFinder);

  if (present) {
    let text = await elementFinder.getText();

    if (text === '') {
      // DO NOT REMOVE BUG sometime wrongly return empty text for cdk elements
      console.info(`Use backup get text script`);

      text = await this.getTextScript(elementFinder);
      return text?.trim();
    }

    return text;
  } else {
    console.error(`Get Text ${elementFinder.locator().toString()} not present`);
    return '';
  }
}

/**
 * Provides a wrapper for the most common operations with the page elements.
 */
export class TestElement {
  constructor(public elementFinder: ElementFinder) {}

  /**
   * Create a new instance with the element located by the id
   *
   * @param id The id of the element
   * @returns test element wrapper
   */
  static byId(id: string): TestElement {
    return new TestElement(element(by.id(id)));
  }

  /**
   * Create a new instance with the element located by the CSS class name
   *
   * @param selector The CSS class name to lookup
   * @returns test element wrapper
   */
  static byCss(selector: string): TestElement {
    return new TestElement($(selector));
  }

  /**
   * Create a new instance with the element that contains specific text
   *
   * @param selector the CSS selector
   * @param text the text within the target element
   * @returns test element wrapper
   */
  static byText(selector: string, text: string): TestElement {
    return new TestElement(element(by.cssContainingText(selector, text)));
  }

  /**
   * Create a new instance with the element with specific HTML tag name
   *
   * @param selector the HTML tag name
   * @returns test element wrapper
   */
  static byTag(selector: string): TestElement {
    return new TestElement(element(by.tagName(selector)));
  }

  /**
   * Performs a click on this element
   */
  async click() {
    return click(this.elementFinder);
  }

  /**
   * Checks that an element is present on the DOM of a page and visible
   *
   * @param waitTimeout How long to wait for the condition to be true
   */
  async isVisible(waitTimeout?: number): Promise<boolean> {
    try {
      await waitUntilElementIsVisible(this.elementFinder, waitTimeout);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Waits until the element is present on the DOM of a page and visible
   *
   * @param waitTimeout How long to wait for the condition to be true
   */
  async waitVisible(waitTimeout?: number): Promise<any> {
    return waitUntilElementIsVisible(this.elementFinder, waitTimeout);
  }

  /**
   * Waits until the element is either invisible or not present on the DOM
   *
   * @param waitTimeout How long to wait for the condition to be true
   */
  async waitNotVisible(waitTimeout?: number): Promise<any> {
    return waitUntilElementIsNotVisible(this.elementFinder, waitTimeout);
  }

  /**
   * Checks that an element is present on the DOM of a page
   *
   * @param waitTimeout How long to wait for the condition to be true
   */
  async isPresent(waitTimeout?: number): Promise<boolean> {
    try {
      await waitUntilElementIsPresent(this.elementFinder, waitTimeout);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Waits until the element is present on the DOM of a page
   *
   * @param waitTimeout How long to wait for the condition to be true
   */
  async waitPresent(waitTimeout?: number): Promise<any> {
    return waitUntilElementIsPresent(this.elementFinder, waitTimeout);
  }

  /**
   * Waits until the element is not attached to the DOM of a page
   *
   * @param waitTimeout How long to wait for the condition to be true
   */
  async waitNotPresent(waitTimeout?: number): Promise<any> {
    return waitUntilElementIsNotPresent(this.elementFinder, waitTimeout);
  }

  /**
   * Waits until the given text is present in the element’s value
   *
   * @param value the text to check
   */
  async waitHasValue(value: string): Promise<any> {
    return waitUntilElementHasValue(this.elementFinder, value);
  }

  /**
   * Query whether the DOM element represented by this instance is enabled.
   */
  async isEnabled(): Promise<boolean> {
    return this.elementFinder.isEnabled();
  }
  /**
   * Query whether the DOM element represented by this instance is disabled.
   */
  async isDisabled(): Promise<boolean> {
    return !(await this.elementFinder.isEnabled());
  }

  /**
   * Test whether this element is currently displayed.
   */
  async isDisplayed(): Promise<boolean> {
    try {
      await this.elementFinder.isDisplayed();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Query for the value of the given attribute of the element.
   *
   * @param attributeName The name of the attribute to query.
   */
  async getAttribute(attributeName: string): Promise<string> {
    return getAttribute(this.elementFinder, attributeName);
  }

  /**
   * Get the visible (i.e. not hidden by CSS) innerText of this element, including sub-elements, without any leading or trailing whitespace.
   */
  async getText(): Promise<string> {
    return getText(this.elementFinder);
  }

  /**
   * Gets the `value` attribute for the given input element
   *
   * @returns input value
   */
  getInputValue(): Promise<string> {
    return getInputValue(this.elementFinder);
  }

  /**
   * Enter the text
   *
   * @param text the text to enter
   */
  async typeText(text: string): Promise<void> {
    await clearSendKeys(this.elementFinder, text);
  }

  /**
   * Clears the input using Ctrl+A and Backspace combination
   */
  async clearInput() {
    await this.elementFinder.clear();
    await this.elementFinder.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
  }
}
