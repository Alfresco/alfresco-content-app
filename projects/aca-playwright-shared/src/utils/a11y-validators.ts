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
  const ariaLabel = await element.getAttribute('aria-label');
  const title = await element.getAttribute('title');
  const text = await element.textContent();
  return Boolean(ariaLabel || title || text?.trim());
}

export async function hasAccessibleAttribute(element: Locator): Promise<boolean> {
  const ariaLabelledBy = await element.getAttribute('aria-labelledby');
  const ariaLabel = await element.getAttribute('aria-label');
  return Boolean(ariaLabelledBy || ariaLabel);
}

export async function isInteractiveElement(element: Locator): Promise<boolean> {
  const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
  const role = await element.getAttribute('role');
  const tabindex = await element.getAttribute('tabindex');

  return INTERACTIVE_TAG_NAMES.includes(tagName) || INTERACTIVE_ROLES.includes(role || '') || tabindex !== null;
}

export async function hasRole(element: Locator, expectedRole: string): Promise<boolean> {
  const role = await element.getAttribute('role');
  return role === expectedRole;
}

export async function hasRoleOrLabel(element: Locator, expectedRole: string): Promise<boolean> {
  const role = await element.getAttribute('role');
  const ariaLabel = await element.getAttribute('aria-label');
  return role === expectedRole || Boolean(ariaLabel);
}

export async function isFocusable(element: Locator): Promise<boolean> {
  return element.evaluate((el) => {
    const tabindex = el.getAttribute('tabindex');
    const isNaturallyFocusable = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName);
    return isNaturallyFocusable || (tabindex !== null && parseInt(tabindex || '0', 10) >= 0);
  });
}

export async function isValidDialog(element: Locator): Promise<boolean> {
  const role = await element.getAttribute('role');
  const hasLabel = await hasAccessibleAttribute(element);
  const isDialog = role === 'dialog' || role === 'alertdialog';
  return isDialog && hasLabel;
}

export async function getAccessibleName(element: Locator): Promise<string> {
  const ariaLabel = await element.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  const title = await element.getAttribute('title');
  if (title) {
    return title;
  }

  const text = await element.textContent();
  return text?.trim() || '';
}

export async function getElementInfo(element: Locator): Promise<string> {
  const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
  const role = await element.getAttribute('role');
  const name = await getAccessibleName(element);
  return `${tagName}[role="${role}"] "${name}"`;
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
  elementSelector: string = 'button, [role="button"], a'
): Promise<boolean> {
  const selector = regionSelector ? `${regionSelector} ${elementSelector}` : elementSelector;
  return verifyElementsHaveNames(page, selector);
}

export async function verifyFormInputsHaveLabels(page: Page, formSelector?: string): Promise<boolean> {
  const selector = formSelector ? `${formSelector} input, ${formSelector} textarea, ${formSelector} select` : 'input, textarea, select';
  const inputs = page.locator(selector);
  const count = await inputs.count();

  for (let i = 0; i < count; i++) {
    const input = inputs.nth(i);
    if (await input.isVisible()) {
      const inputId = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');

      if (!ariaLabel && !ariaLabelledBy && inputId) {
        const label = page.locator(`label[for="${inputId}"]`);
        if (!(await label.isVisible())) {
          return false;
        }
      } else if (!ariaLabel && !ariaLabelledBy) {
        return false;
      }
    }
  }
  return true;
}

export async function verifyHeadingHierarchy(page: Page, regionSelector?: string): Promise<{ isValid: boolean; issues: string[] }> {
  const selector = regionSelector
    ? `${regionSelector} h1, ${regionSelector} h2, ${regionSelector} h3, ${regionSelector} h4, ${regionSelector} h5, ${regionSelector} h6`
    : 'h1, h2, h3, h4, h5, h6';
  const headings = page.locator(selector);
  const count = await headings.count();
  const issues: string[] = [];

  let lastLevel = 0;
  for (let i = 0; i < count; i++) {
    const heading = headings.nth(i);
    const level = parseInt((await heading.evaluate((el) => el.tagName))[1], 10);
    const text = await heading.textContent();

    if (!text?.trim()) {
      issues.push(`Empty heading at position ${i + 1}`);
    }

    if (level > lastLevel + 1) {
      issues.push(`Heading hierarchy skipped from H${lastLevel} to H${level}`);
    }

    lastLevel = level;
  }

  return {
    isValid: issues.length === 0,
    issues
  };
}

export async function verifyLandmarks(page: Page): Promise<{
  hasMain: boolean;
  landmarks: string[];
}> {
  const landmarkRoles: Array<'main' | 'navigation' | 'contentinfo' | 'complementary' | 'region'> = [
    'main',
    'navigation',
    'contentinfo',
    'complementary',
    'region'
  ];
  const landmarks: string[] = [];

  for (const role of landmarkRoles) {
    const element = page.getByRole(role).first();
    if (await element.isVisible()) {
      landmarks.push(role);
    }
  }

  return {
    hasMain: landmarks.includes('main'),
    landmarks
  };
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
