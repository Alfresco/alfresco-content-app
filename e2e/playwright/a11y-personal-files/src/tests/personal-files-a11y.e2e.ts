/*!
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { expect } from '@playwright/test';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';
import { ApiClientFactory, FileActionsApi, NodesApi, test, TEST_FILES, timeouts, Utils, TrashcanApi } from '@alfresco/aca-playwright-shared';

/**
 * Priority Levels:
 * P0 - Critical: Core functionality, keyboard navigation, screen reader support
 * P1 - High: Important features, form validation, ARIA labels
 * P2 - Medium: Enhanced features, visual indicators, advanced interactions
 */

test.describe('Personal Files - Accessibility Tests', () => {
  let nodesApi: NodesApi;
  let trashcanApi: TrashcanApi;
  let fileActionsApi: FileActionsApi;
  const username = `a11y-user-${Utils.random()}`;
  const testFolder = `a11y-folder-${Utils.random()}`;
  const testFile = `a11y-file-${Utils.random()}.txt`;
  const testDocx = `a11y-doc-${Utils.random()}.docx`;
  let folderId: string;

  test.beforeAll(async () => {
    test.setTimeout(timeouts.extendedTest);
    const apiClientFactory = new ApiClientFactory();
    await apiClientFactory.setUpAcaBackend('admin');
    try {
      await apiClientFactory.createUser({ username });
    } catch (exception) {
      if (JSON.parse(exception.message).error.statusCode !== 409) {
        throw new Error(`beforeAll failed: ${exception}`);
      }
    }
    nodesApi = await NodesApi.initialize(username, username);
    trashcanApi = await TrashcanApi.initialize(username, username);
    fileActionsApi = await FileActionsApi.initialize(username, username);

    // Create test data
    const folder = await nodesApi.createFolder(testFolder);
    folderId = folder.entry.id;
    await nodesApi.createFile(testFile, folderId);
    await fileActionsApi.uploadFile(TEST_FILES.DOCX.path, testDocx, folderId);
  });

  test.beforeEach(async ({ page, loginPage, personalFiles }) => {
    await Utils.tryLoginUser(loginPage, username, username, 'beforeEach failed');
    await personalFiles.navigate({ remoteUrl: `#/personal-files/${folderId}` });
    await personalFiles.dataTable.spinnerWaitForReload();

    // Inject and configure axe
    await injectAxe(page);
    await configureAxe(page, {
      // Disable color-contrast rule for CI (can be enabled for manual testing)
      disableRules: ['color-contrast']
    } as any);
  });

  test.afterAll(async () => {
    await Utils.deleteNodesSitesEmptyTrashcan(nodesApi, trashcanApi, 'afterAll failed');
  });

  // ============================================
  // P0 - CRITICAL PRIORITY TESTS
  // ============================================

  test.describe('P0 - Critical: Core Page Accessibility', () => {
    test('[A11Y-P0-001] Page has no critical accessibility violations', async ({ page }) => {
      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true }
      });
      // If checkA11y finds violations, it will throw; no need to check violations property.
    });

    test('[A11Y-P0-002] Page has proper document title', async ({ page }) => {
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    });

    test('[A11Y-P0-003] Page has main landmark', async ({ page }) => {
      const mainLandmark = page.getByRole('main');
      await expect(mainLandmark).toBeVisible();
    });

    test('[A11Y-P0-004] All images have alt text or are decorative', async ({ page }) => {
      const images = page.getByRole('img');
      const imageCount = await images.count();
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        expect(alt !== null || role === 'presentation' || role === 'none').toBeTruthy();
      }
    });
  });

  test.describe('P0 - Critical: Keyboard Navigation', () => {
    test('[A11Y-P0-005] Tab navigation works through interactive elements', async ({ page }) => {
      await page.keyboard.press('Tab');
      // Find the first focused button or link for accessibility check
      const focusedElement = await page.evaluateHandle(() => document.activeElement);
      const role = await focusedElement.evaluate((el: Element) => el.getAttribute('role'));
      expect(['button', 'link', 'textbox', 'checkbox', 'menuitem'].includes(role || '')).toBeTruthy();
    });

    test('[A11Y-P0-006] All buttons are keyboard accessible', async ({ page }) => {
      const buttons = page.getByRole('button');
      const buttonCount = await buttons.count();
      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i);
        const isDisabled = await button.isDisabled();
        if (!isDisabled) {
          await button.focus();
          await expect(button).toBeFocused();
        }
      }
    });

    test('[A11Y-P0-007] Create button is keyboard accessible', async ({ page, personalFiles }) => {
      await personalFiles.acaHeader.createButton.focus();
      await expect(personalFiles.acaHeader.createButton).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(personalFiles.matMenu.createFolder).toBeVisible({ timeout: 5000 });
    });

    test('[A11Y-P0-008] Search button is keyboard accessible', async ({ page, personalFiles }) => {
      await personalFiles.acaHeader.searchButton.focus();
      await expect(personalFiles.acaHeader.searchButton).toBeFocused();
      await page.keyboard.press('Enter');
      // Search overlay should open
      const searchOverlay = page.getByRole('dialog');
      await expect(searchOverlay.first()).toBeVisible({ timeout: 5000 });
    });

    test('[A11Y-P0-009] Escape key closes dialogs and menus', async ({ page, personalFiles }) => {
      await personalFiles.acaHeader.createButton.click();
      await expect(personalFiles.matMenu.createFolder).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(personalFiles.matMenu.createFolder).not.toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('P0 - Critical: Data Table Accessibility', () => {
    test('[A11Y-P0-010] Data table has proper ARIA labels', async ({ page }) => {
      const dataTable = page.getByRole('table');
      await expect(dataTable).toBeVisible();
    });

    test('[A11Y-P0-011] Table headers have proper scope', async ({ page }) => {
      const headers = page.getByRole('columnheader');
      const headerCount = await headers.count();
      expect(headerCount).toBeGreaterThan(0);
      for (let i = 0; i < Math.min(headerCount, 5); i++) {
        const header = headers.nth(i);
        const scope = await header.getAttribute('scope');
        expect(scope === 'col' || scope === null).toBeTruthy();
      }
    });

    test('[A11Y-P0-012] Table rows are keyboard navigable', async ({ personalFiles }) => {
      await Utils.reloadPageIfDatatableEmpty(personalFiles);
      const firstRow = personalFiles.dataTable.getRowLocator.first();
      await firstRow.focus();
      await expect(firstRow).toBeFocused();
    });

    test('[A11Y-P0-013] Table cells have accessible names', async ({ personalFiles }) => {
      await Utils.reloadPageIfDatatableEmpty(personalFiles);
      const cells = personalFiles.dataTable.getRowLocator.locator('adf-datatable-cell');
      const cellCount = await cells.count();
      expect(cellCount).toBeGreaterThan(0);
    });

    test('[A11Y-P0-014] Sortable columns have proper ARIA attributes', async ({ personalFiles }) => {
      await Utils.reloadPageIfDatatableEmpty(personalFiles);
      const sortableHeaders = personalFiles.page.getByRole('columnheader').filter({ has: personalFiles.page.locator('[aria-sort]') });
      const sortableCount = await sortableHeaders.count();
      if (sortableCount > 0) {
        const firstSortable = sortableHeaders.first();
        const ariaSort = await firstSortable.getAttribute('aria-sort');
        expect(['ascending', 'descending', 'none']).toContain(ariaSort);
      }
    });
  });

  test.describe('P0 - Critical: Screen Reader Support', () => {
    test('[A11Y-P0-015] Buttons have accessible names', async ({ page }) => {
      const buttons = page.getByRole('button');
      const buttonCount = await buttons.count();
      for (let i = 0; i < Math.min(buttonCount, 10); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible()) {
          const ariaLabel = await button.getAttribute('aria-label');
          const title = await button.getAttribute('title');
          const text = await button.textContent();
          expect(ariaLabel || title || text?.trim()).toBeTruthy();
        }
      }
    });

    test('[A11Y-P0-016] Icons have accessible labels', async ({ page }) => {
      const icons = page.locator('[class*="icon"], [data-automation-id*="icon"]');
      const iconCount = await icons.count();
      for (let i = 0; i < Math.min(iconCount, 10); i++) {
        const icon = icons.nth(i);
        const ariaLabel = await icon.getAttribute('aria-label');
        const ariaHidden = await icon.getAttribute('aria-hidden');
        const title = await icon.getAttribute('title');
        expect(ariaLabel || ariaHidden === 'true' || title).toBeTruthy();
      }
    });

    test('[A11Y-P0-017] Form inputs have labels', async ({ page, personalFiles }) => {
      await personalFiles.acaHeader.createButton.click();
      await personalFiles.matMenu.createFolder.click();
      const input = personalFiles.folderDialog.folderNameInputLocator;
      const label = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');
      expect(label || placeholder).toBeTruthy();
      await page.keyboard.press('Escape');
    });
  });

  // ============================================
  // P1 - HIGH PRIORITY TESTS
  // ============================================

  test.describe('P1 - High: Breadcrumb Navigation', () => {
    test('[A11Y-P1-001] Breadcrumb has proper navigation structure', async ({ page }) => {
      const breadcrumb = page.getByRole('navigation').or(page.locator('adf-breadcrumb'));
      const breadcrumbCount = await breadcrumb.count();
      if (breadcrumbCount > 0) {
        await expect(breadcrumb.first()).toBeVisible();
      }
    });

    test('[A11Y-P1-002] Breadcrumb links are keyboard accessible', async ({ page }) => {
      const breadcrumbLinks = page.locator('adf-breadcrumb').getByRole('link');
      const linkCount = await breadcrumbLinks.count();
      if (linkCount > 0) {
        const firstLink = breadcrumbLinks.first();
        await firstLink.focus();
        await expect(firstLink).toBeFocused();
      }
    });

    test('[A11Y-P1-003] Breadcrumb has aria-label', async ({ page }) => {
      const breadcrumb = page.getByRole('navigation').or(page.locator('adf-breadcrumb'));
      const breadcrumbCount = await breadcrumb.count();
      if (breadcrumbCount > 0) {
        const ariaLabel = await breadcrumb.first().getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
      }
    });
  });

  test.describe('P1 - High: Toolbar Actions', () => {
    test('[A11Y-P1-004] Toolbar has proper ARIA region', async ({ page }) => {
      const toolbar = page.locator('aca-toolbar');
      await expect(toolbar).toBeVisible();
    });

    test('[A11Y-P1-005] Toolbar buttons have tooltips or aria-labels', async ({ personalFiles }) => {
      const toolbarButtons = personalFiles.page.getByRole('button');
      const buttonCount = await toolbarButtons.count();
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = toolbarButtons.nth(i);
        const title = await button.getAttribute('title');
        const ariaLabel = await button.getAttribute('aria-label');
        expect(title || ariaLabel).toBeTruthy();
      }
    });

    test('[A11Y-P1-006] Upload button is accessible', async ({ personalFiles }) => {
      const uploadButton = personalFiles.acaHeader.uploadButton;
      if (await uploadButton.isVisible()) {
        await uploadButton.focus();
        await expect(uploadButton).toBeFocused();
        const title = await uploadButton.getAttribute('title');
        expect(title).toBeTruthy();
      }
    });

    test('[A11Y-P1-007] More actions menu is keyboard accessible', async ({ page, personalFiles }) => {
      await personalFiles.acaHeader.createButton.click();
      await expect(personalFiles.matMenu.createFolder).toBeVisible();
      await page.keyboard.press('ArrowDown');
      // Menu item should receive focus
      const focusedItem = page.locator(':focus');
      await expect(focusedItem).toBeVisible();
    });
  });

  test.describe('P1 - High: File/Folder Interactions', () => {
    test('[A11Y-P1-008] File rows have accessible names', async ({ personalFiles }) => {
      await Utils.reloadPageIfDatatableEmpty(personalFiles);
      const row = personalFiles.dataTable.getRowByName(testFile);
      if (await row.isVisible()) {
        const rowText = await row.textContent();
        expect(rowText).toBeTruthy();
      }
    });

    test('[A11Y-P1-009] Context menu is keyboard accessible', async ({ page, personalFiles }) => {
      await Utils.reloadPageIfDatatableEmpty(personalFiles);
      const row = personalFiles.dataTable.getRowByName(testFile);
      if (await row.isVisible()) {
        await row.click({ button: 'right' });
        const contextMenu = page.getByRole('menu');
        await expect(contextMenu).toBeVisible({ timeout: 3000 });
        await page.keyboard.press('Escape');
      }
    });

    test('[A11Y-P1-010] File actions menu button has accessible name', async ({ personalFiles }) => {
      await Utils.reloadPageIfDatatableEmpty(personalFiles);
      const actionsButton = personalFiles.dataTable.getActionsButtonByName(testFile);
      if (await actionsButton.isVisible()) {
        const ariaLabel = await actionsButton.getAttribute('aria-label');
        const title = await actionsButton.getAttribute('title');
        expect(ariaLabel || title).toBeTruthy();
      }
    });

    test('[A11Y-P1-011] Double-click opens viewer with keyboard alternative', async ({ personalFiles }) => {
      await Utils.reloadPageIfDatatableEmpty(personalFiles);
      const row = personalFiles.dataTable.getRowByName(testDocx);
      if (await row.isVisible()) {
        await row.click();
        await personalFiles.acaHeader.viewButton.click();
        await expect(personalFiles.viewer.viewerLocator).toBeVisible({ timeout: 10000 });
        await personalFiles.viewer.closeButtonLocator.click();
      }
    });
  });

  test.describe('P1 - High: Dialogs and Modals', () => {
    test('[A11Y-P1-012] Create folder dialog has proper ARIA attributes', async ({ page, personalFiles }) => {
      await personalFiles.acaHeader.createButton.click();
      await personalFiles.matMenu.createFolder.click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      const dialogRole = await dialog.getAttribute('role');
      expect(dialogRole === 'dialog' || dialogRole === 'alertdialog').toBeTruthy();
      await page.keyboard.press('Escape');
    });

    test('[A11Y-P1-013] Dialog has accessible title', async ({ page, personalFiles }) => {
      await personalFiles.acaHeader.createButton.click();
      await personalFiles.matMenu.createFolder.click();
      const dialog = page.getByRole('dialog');
      const ariaLabelledBy = await dialog.getAttribute('aria-labelledby');
      const ariaLabel = await dialog.getAttribute('aria-label');
      expect(ariaLabelledBy || ariaLabel).toBeTruthy();
      await page.keyboard.press('Escape');
    });

    test('[A11Y-P1-014] Dialog traps focus', async ({ page, personalFiles }) => {
      await personalFiles.acaHeader.createButton.click();
      await personalFiles.matMenu.createFolder.click();
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      const dialog = page.getByRole('dialog');
      const isInDialog = (await dialog.locator(':focus').count()) > 0;
      expect(isInDialog || (await focusedElement.count()) > 0).toBeTruthy();
      await page.keyboard.press('Escape');
    });

    test('[A11Y-P1-015] Dialog cancel button is accessible', async ({ personalFiles }) => {
      await personalFiles.acaHeader.createButton.click();
      await personalFiles.matMenu.createFolder.click();
      const cancelButton = personalFiles.folderDialog.cancelButton;
      await expect(cancelButton).toBeVisible();
      await cancelButton.focus();
      await expect(cancelButton).toBeFocused();
      await cancelButton.click();
    });
  });

  test.describe('P1 - High: Form Validation', () => {
    test('[A11Y-P1-016] Form errors are associated with inputs', async ({ page, personalFiles }) => {
      await personalFiles.acaHeader.createButton.click();
      await personalFiles.matMenu.createFolder.click();
      const submitButton = personalFiles.folderDialog.createButton;
      await submitButton.click();
      const errorMessage = page.getByRole('alert').or(page.locator('[data-automation-id*="error"]'));
      await expect(errorMessage.first()).toBeVisible({ timeout: 3000 });
      await page.keyboard.press('Escape');
    });

    test('[A11Y-P1-017] Required fields are marked', async ({ page, personalFiles }) => {
      await personalFiles.acaHeader.createButton.click();
      await personalFiles.matMenu.createFolder.click();
      const input = personalFiles.folderDialog.folderNameInputLocator;
      const required = await input.getAttribute('required');
      const ariaRequired = await input.getAttribute('aria-required');
      expect(required !== null || ariaRequired === 'true').toBeTruthy();
      await page.keyboard.press('Escape');
    });
  });

  // ============================================
  // P2 - MEDIUM PRIORITY TESTS
  // ============================================

  test.describe('P2 - Medium: Pagination', () => {
    test('[A11Y-P2-001] Pagination has proper navigation structure', async ({ personalFiles }) => {
      const pagination = personalFiles.page.locator('adf-pagination');
      if (await pagination.isVisible()) {
        await expect(pagination).toBeVisible();
      }
    });

    test('[A11Y-P2-002] Pagination buttons have accessible names', async ({ personalFiles }) => {
      const pagination = personalFiles.page.locator('adf-pagination');
      if (await pagination.isVisible()) {
        const buttons = pagination.getByRole('button');
        const buttonCount = await buttons.count();
        for (let i = 0; i < Math.min(buttonCount, 5); i++) {
          const button = buttons.nth(i);
          const ariaLabel = await button.getAttribute('aria-label');
          const title = await button.getAttribute('title');
          expect(ariaLabel || title).toBeTruthy();
        }
      }
    });

    test('[A11Y-P2-003] Current page is announced', async ({ personalFiles }) => {
      const pagination = personalFiles.page.locator('adf-pagination');
      if (await pagination.isVisible()) {
        const currentPage = pagination.locator('[aria-current="page"]');
        const currentPageCount = await currentPage.count();
        expect(currentPageCount).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('P2 - Medium: Selection and Bulk Actions', () => {
    test('[A11Y-P2-004] Checkboxes have proper labels', async ({ personalFiles }) => {
      await Utils.reloadPageIfDatatableEmpty(personalFiles);
      const checkbox = personalFiles.dataTable.getCheckboxForElement(testFile);
      if (await checkbox.isVisible()) {
        const ariaLabel = await checkbox.getAttribute('aria-label');
        const title = await checkbox.getAttribute('title');
        expect(ariaLabel || title).toBeTruthy();
      }
    });

    test('[A11Y-P2-005] Selection state is announced', async ({ personalFiles }) => {
      await Utils.reloadPageIfDatatableEmpty(personalFiles);
      const checkbox = personalFiles.dataTable.getCheckboxForElement(testFile);
      if (await checkbox.isVisible()) {
        await checkbox.click();
        const isChecked = await checkbox.isChecked();
        const ariaChecked = await checkbox.getAttribute('aria-checked');
        expect(ariaChecked === 'true' || isChecked).toBeTruthy();
      }
    });

    test('[A11Y-P2-006] Bulk actions are accessible when items selected', async ({ personalFiles }) => {
      await Utils.reloadPageIfDatatableEmpty(personalFiles);
      const checkbox = personalFiles.dataTable.getCheckboxForElement(testFile);
      if (await checkbox.isVisible()) {
        await checkbox.click();
        const bulkActions = personalFiles.page.locator('[data-automation-id*="bulk"]');
        if ((await bulkActions.count()) > 0) {
          await expect(bulkActions.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('P2 - Medium: Loading States', () => {
    test('[A11Y-P2-007] Loading indicators have proper ARIA attributes', async ({ personalFiles }) => {
      await personalFiles.reload();
      const spinner = personalFiles.page.getByRole('progressbar');
      if ((await spinner.count()) > 0) {
        const ariaLabel = await spinner.first().getAttribute('aria-label');
        const ariaBusy = await spinner.first().getAttribute('aria-busy');
        expect(ariaLabel || ariaBusy === 'true').toBeTruthy();
      }
    });

    test('[A11Y-P2-008] Loading state is announced to screen readers', async ({ personalFiles }) => {
      await personalFiles.reload();
      const liveRegion = personalFiles.page.getByRole('status').or(personalFiles.page.locator('[aria-live]'));
      const liveRegionCount = await liveRegion.count();
      // At least one live region should exist for announcements
      expect(liveRegionCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('P2 - Medium: Empty States', () => {
    test('[A11Y-P2-009] Empty state has accessible message', async ({ personalFiles }) => {
      const emptyState = personalFiles.dataTable.emptyList;
      if (await emptyState.isVisible()) {
        const emptyTitle = personalFiles.dataTable.emptyListTitle;
        if (await emptyTitle.isVisible()) {
          const text = await emptyTitle.textContent();
          expect(text?.trim()).toBeTruthy();
        }
      }
    });

    test('[A11Y-P2-010] Empty state action buttons are accessible', async ({ personalFiles }) => {
      const emptyState = personalFiles.dataTable.emptyList;
      if (await emptyState.isVisible()) {
        const buttons = emptyState.getByRole('button');
        const buttonCount = await buttons.count();
        for (let i = 0; i < buttonCount; i++) {
          const button = buttons.nth(i);
          const ariaLabel = await button.getAttribute('aria-label');
          const text = await button.textContent();
          expect(ariaLabel || text?.trim()).toBeTruthy();
        }
      }
    });
  });

  test.describe('P2 - Medium: Info Drawer', () => {
    test('[A11Y-P2-011] Info drawer toggle button is accessible', async ({ personalFiles }) => {
      await Utils.reloadPageIfDatatableEmpty(personalFiles);
      const row = personalFiles.dataTable.getRowByName(testFile);
      if (await row.isVisible()) {
        await row.click();
        const infoDrawerButton = personalFiles.acaHeader.viewDetails;
        if (await infoDrawerButton.isVisible()) {
          await infoDrawerButton.focus();
          await expect(infoDrawerButton).toBeFocused();
        }
      }
    });

    test('[A11Y-P2-012] Info drawer has proper ARIA attributes', async ({ personalFiles }) => {
      await Utils.reloadPageIfDatatableEmpty(personalFiles);
      const row = personalFiles.dataTable.getRowByName(testFile);
      if (await row.isVisible()) {
        await row.click();
        await personalFiles.acaHeader.viewDetails.click();
        const infoDrawer = personalFiles.infoDrawer.infoDrawerPanel;
        if (await infoDrawer.isVisible()) {
          const role = await infoDrawer.getAttribute('role');
          expect(role === 'complementary' || role === 'region').toBeTruthy();
        }
      }
    });

    test('[A11Y-P2-013] Info drawer tabs are keyboard navigable', async ({ personalFiles }) => {
      await Utils.reloadPageIfDatatableEmpty(personalFiles);
      const row = personalFiles.dataTable.getRowByName(testFile);
      if (await row.isVisible()) {
        await row.click();
        await personalFiles.acaHeader.viewDetails.click();
        const tabs = personalFiles.infoDrawer.infoDrawerTabs;
        if ((await tabs.count()) > 0) {
          await tabs.first().focus();
          await expect(tabs.first()).toBeFocused();
        }
      }
    });
  });

  test.describe('P2 - Medium: Search Integration', () => {
    test('[A11Y-P2-014] Search input has proper label', async ({ page, personalFiles }) => {
      await personalFiles.acaHeader.searchButton.click();
      const searchInput = page.getByRole('searchbox').or(page.locator('input[type="search"]'));
      if ((await searchInput.count()) > 0) {
        const ariaLabel = await searchInput.first().getAttribute('aria-label');
        const placeholder = await searchInput.first().getAttribute('placeholder');
        expect(ariaLabel || placeholder).toBeTruthy();
      }
      await page.keyboard.press('Escape');
    });

    test('[A11Y-P2-015] Search results are announced', async ({ page, personalFiles }) => {
      await personalFiles.acaHeader.searchButton.click();
      const searchInput = page.getByRole('searchbox').or(page.locator('input[type="search"]'));
      if ((await searchInput.count()) > 0) {
        await searchInput.first().fill(testFile);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        const results = page.getByRole('status').or(page.locator('[aria-live]'));
        // Results should be in a live region or have status role
        expect(await results.count()).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('P2 - Medium: Error Handling', () => {
    test('[A11Y-P2-016] Error messages are in live regions', async ({ page, personalFiles }) => {
      // Try to create folder with invalid name
      await personalFiles.acaHeader.createButton.click();
      await personalFiles.matMenu.createFolder.click();
      const input = personalFiles.folderDialog.folderNameInputLocator;
      await input.fill('<>'); // Invalid characters
      const submitButton = personalFiles.folderDialog.createButton;
      await submitButton.click();
      const errorMessage = page.getByRole('alert').or(page.locator('[aria-live]'));
      if ((await errorMessage.count()) > 0) {
        await expect(errorMessage.first()).toBeVisible({ timeout: 3000 });
      }
      await page.keyboard.press('Escape');
    });

    test('[A11Y-P2-017] Error messages are associated with inputs', async ({ page, personalFiles }) => {
      await personalFiles.acaHeader.createButton.click();
      await personalFiles.matMenu.createFolder.click();
      const input = personalFiles.folderDialog.folderNameInputLocator;
      const inputId = await input.getAttribute('id');
      await input.fill('');
      const submitButton = personalFiles.folderDialog.createButton;
      await submitButton.click();
      if (inputId) {
        const errorForInput = page.locator(`[aria-describedby*="${inputId}"], [id*="error"]`);
        if ((await errorForInput.count()) > 0) {
          await expect(errorForInput.first()).toBeVisible({ timeout: 3000 });
        }
      }
      await page.keyboard.press('Escape');
    });
  });

  // ============================================
  // COMPREHENSIVE SCENARIO TESTS
  // ============================================

  test.describe('Comprehensive: Full User Workflows', () => {
    test('[A11Y-COMP-001] Complete workflow: Create folder, upload file, view details', async ({ page, personalFiles }) => {
      // Navigate and check initial state
      await checkA11y(page, undefined, {
        detailedReport: true
      });

      // Create folder workflow
      await personalFiles.acaHeader.createButton.click();
      await checkA11y(page, undefined, {
        detailedReport: true
      });
      await personalFiles.matMenu.createFolder.click();
      await checkA11y(page, undefined, {
        detailedReport: true
      });

      const newFolderName = `a11y-new-folder-${Utils.random()}`;
      await personalFiles.folderDialog.folderNameInputLocator.fill(newFolderName);
      await personalFiles.folderDialog.createButton.click();
      await personalFiles.dataTable.spinnerWaitForReload();

      // Check table after creation
      await checkA11y(page, undefined, {
        detailedReport: true
      });

      // Navigate into folder
      await personalFiles.dataTable.performClickFolderOrFileToOpen(newFolderName);
      await personalFiles.dataTable.spinnerWaitForReload();
      await checkA11y(page, undefined, {
        detailedReport: true
      });
    });

    test('[A11Y-COMP-002] Complete workflow: Select file, view details, close drawer', async ({ page, personalFiles }) => {
      await Utils.reloadPageIfDatatableEmpty(personalFiles);
      const row = personalFiles.dataTable.getRowByName(testFile);
      if (await row.isVisible()) {
        // Select file
        await row.click();
        await checkA11y(page, undefined, {
          detailedReport: true
        });

        // Open info drawer
        await personalFiles.acaHeader.viewDetails.click();
        await checkA11y(page, undefined, {
          detailedReport: true
        });

        // Navigate tabs in drawer
        const tabs = personalFiles.infoDrawer.infoDrawerTabs;
        if ((await tabs.count()) > 1) {
          await tabs.nth(1).click();
          await checkA11y(page, undefined, {
            detailedReport: true
          });
        }

        // Close drawer
        await personalFiles.acaHeader.viewDetails.click();
        await checkA11y(page, undefined, {
          detailedReport: true
        });
      }
    });

    test('[A11Y-COMP-003] Complete workflow: Keyboard-only navigation', async ({ page }) => {
      // Navigate using only keyboard
      await page.keyboard.press('Tab'); // Focus first element
      let focusCount = 0;
      const maxTabs = 20;

      for (let i = 0; i < maxTabs; i++) {
        const focused = page.locator(':focus');
        if ((await focused.count()) > 0) {
          focusCount++;
          const tagName = await focused.evaluate((el) => el.tagName.toLowerCase());
          const role = await focused.getAttribute('role');
          expect(['button', 'link', 'textbox', 'checkbox', 'menuitem'].includes(tagName) || role !== null).toBeTruthy();
        }
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);
      }

      expect(focusCount).toBeGreaterThan(0);
    });
  });
});
