/*!
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { Page, Locator } from '@playwright/test';

const INTERACTIVE_TAG_NAMES = ['button', 'a', 'input', 'select', 'textarea'];
const INTERACTIVE_ROLES = ['button', 'link', 'menuitem', 'checkbox', 'radio', 'tab', 'switch', 'option'];

export async function hasAccessibleName(element: Locator): Promise<boolean> {
  const ariaLabelledBy = await element.getAttribute('aria-labelledby');
  const ariaLabel = await element.getAttribute('aria-label');
  const title = await element.getAttribute('title');
  const text = await element.textContent();
  return Boolean(ariaLabelledBy || ariaLabel || title || text?.trim());
}

export async function hasAccessibleAttribute(element: Locator): Promise<boolean> {
  const ariaLabelledBy = await element.getAttribute('aria-labelledby');
  const ariaLabel = await element.getAttribute('aria-label');
  return Boolean(ariaLabelledBy || ariaLabel);
}

export async function isInteractiveElement(element: Locator): Promise<boolean> {
  const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
  const role = await element.getAttribute('role');
  const tabindexAttr = await element.getAttribute('tabindex');
  const tabindex = tabindexAttr === null ? null : parseInt(tabindexAttr, 10);
  const hasFocusableTabIndex = tabindex !== null && !Number.isNaN(tabindex) && tabindex >= 0;

  return INTERACTIVE_TAG_NAMES.includes(tagName) || INTERACTIVE_ROLES.includes(role || '') || hasFocusableTabIndex;
}

export async function getAccessibleName(element: Locator): Promise<string> {
  const text = await element.textContent();
  return (await element.getAttribute('aria-label')) || (await element.getAttribute('title')) || text?.trim() || '';
}

export async function verifyElementsHaveNames(page: Page, selector: string): Promise<boolean> {
  const elements = page.locator(selector);
  const count = await elements.count();

  for (let i = 0; i < count; i++) {
    const element = elements.nth(i);
    if (await element.isVisible()) {
      const hasName = await hasAccessibleName(element);
      if (!hasName) {
        return false;
      }
    }
  }
  return true;
}

export async function verifyRegionAccessibleNames(
  page: Page,
  regionSelector: string,
  elementSelector = 'button, [role="button"], a'
): Promise<boolean> {
  const selector = regionSelector ? `${regionSelector} ${elementSelector}` : elementSelector;
  return verifyElementsHaveNames(page, selector);
}

export async function verifyDataTableAccessibility(page: Page, tableSelector = 'adf-datatable, [role="grid"]'): Promise<void> {
  const table = page.locator(tableSelector).first();

  if (!(await table.isVisible().catch(() => false))) {
    throw new Error(`Table not visible with selector: ${tableSelector}`);
  }

  const headers = table.locator('[role="columnheader"]');
  const headerCount = await headers.count();
  if (headerCount === 0) {
    throw new Error('Table has no columnheader elements');
  }

  const firstHeader = headers.first();
  if (!(await hasAccessibleName(firstHeader))) {
    throw new Error('First header lacks accessible name (aria-label, title, or text content)');
  }

  const firstDataRow = table.locator('[role="row"]').nth(1);
  if (await firstDataRow.isVisible({ timeout: 3000 }).catch(() => false)) {
    const cells = firstDataRow.locator('[role="gridcell"]');
    const cellCount = await cells.count();

    if (cellCount !== headerCount) {
      throw new Error(`First data row has ${cellCount} cells but ${headerCount} headers`);
    }

    const firstCell = cells.first();
    if (!(await hasAccessibleName(firstCell))) {
      throw new Error('First cell lacks accessible name');
    }
  }

  const checkboxes = table.locator('[role="checkbox"]');
  const checkboxCount = await checkboxes.count();
  if (checkboxCount > 0) {
    const firstCheckbox = checkboxes.first();
    if (!(await hasAccessibleName(firstCheckbox))) {
      throw new Error('Checkbox lacks accessible name');
    }
  }
}
