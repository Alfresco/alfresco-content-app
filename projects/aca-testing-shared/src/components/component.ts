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

import { ElementFinder, browser, by, ElementArrayFinder, ProtractorBrowser } from 'protractor';
import { waitForPresence } from '../utilities/utils';

export abstract class Component {
  component: ElementFinder;

  protected byCss(css: string, root: ElementFinder | ProtractorBrowser = this.component): ElementFinder {
    return root.element(by.css(css));
  }

  protected byCssText(css: string, text: string, root: ElementFinder | ProtractorBrowser = this.component): ElementFinder {
    return root.element(by.cssContainingText(css, text));
  }

  protected byId(css: string, root: ElementFinder | ProtractorBrowser = this.component): ElementFinder {
    return root.element(by.id(css));
  }

  protected byTitleAttr(title: string, root: ElementFinder | ProtractorBrowser = this.component): ElementFinder {
    return root.element(by.css(`[title=${title}]`));
  }

  protected allByCss(css: string, root: ElementFinder | ProtractorBrowser = this.component): ElementArrayFinder {
    return root.all(by.css(css));
  }

  protected constructor(selector: string, ancestor?: string) {
    const locator = selector;

    this.component = ancestor ? browser.$$(ancestor).first().$$(locator).first() : browser.$$(locator).first();
  }

  async wait() {
    await waitForPresence(this.component);
  }
}
