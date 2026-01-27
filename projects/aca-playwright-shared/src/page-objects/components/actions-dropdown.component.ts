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

import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';
import { timeouts } from '../../public-api';

export enum ActionType {
  AddAspect = 'Add aspect',
  SimpleWorkflow = 'Add simple workflow',
  IncrementCounter = 'Increment Counter',
  CheckIn = 'Check in',
  AutoDeclareOptions = 'Auto-Declare Options',
  CheckOut = 'Check out',
  Copy = 'Copy',
  ExecuteScript = 'Execute script',
  ExtractCommonMetadataFields = 'Extract common metadata fields',
  FileAsRecord = 'File as Record',
  FileVersionAsRecord = 'File Version as Record',
  HideRecord = 'Hide Record',
  Import = 'Import',
  Move = 'Move',
  RemoveAspect = 'Remove aspect',
  RequestAIRenditions = 'Request AI renditions',
  SendEmail = 'Send email',
  SetPropertyValue = 'Set property value',
  SpecialiseType = 'Specialise type',
  TransformAndCopyContent = 'Transform and copy content',
  TransformAndCopyImage = 'Transform and copy image'
}

export enum MimeType {
  AdobePDFDocument = 'Adobe PDF Document [application/pdf]',
  BitmapImage = 'Bitmap Image [image/bmp]',
  JPEGImage = 'JPEG Image [image/jpeg]',
  GIFImage = 'GIF Image [image/gif]',
  TIFFImage = 'TIFF Image [image/tiff]',
  PNGImage = 'PNG Image [image/png]'
}

export class ActionsDropdownComponent extends BaseComponent {
  private static rootElement = 'aca-edit-rule-dialog aca-rule-action-list';

  private getOptionLocator = (optionName: string): Locator =>
    this.page.locator('.mat-mdc-select-panel .mdc-list-item__primary-text', { hasText: optionName }).first();
  private ruleActionLocator = this.getChild('aca-rule-action');
  private addActionButtonLocator = this.getChild('[data-automation-id="rule-action-list-add-action-button"]');
  private actionDropdownLocator = this.getChild('[data-automation-id="rule-action-select"]');
  private actionAspectNameLocator = '[data-automation-id="header-aspect-name"] .adf-property-field';
  private actionCheckInInputLocator = '[data-automation-id="header-description"] input';
  private actionAutoDeclareLocator = '[data-automation-id="header-version"] mat-select';
  private actionSpecialiseTypeLocator = '[data-automation-id="header-type-name"] mat-select';
  private actionSimpleWorkflowStepInputLocator = '[data-automation-id="header-approve-step"] input';
  private actionSimpleWorkflowApproveFolderLocator = `[data-automation-id="header-approve-folder"] mat-icon`;
  private actionSimpleWorkflowActionChoiceLocator = '[data-automation-id="content-node-selector-actions-choose"]';
  private actionSimpleWorkflowLabelApproveLocator = `[data-automation-id="card-boolean-label-approve-move"]`;
  private actionSimpleWorkflowSRejectStepLocator = '[data-automation-id="header-reject-step"] input';
  private actionSimpleWorkflowRejectFolderLocator = `[data-automation-id="header-reject-folder"] input`;
  private readonly mimeTypeDropdownLocator = this.getChild('[data-automation-id="select-box"][aria-label="Mimetype *"]');
  private readonly actionTransformAndCopyContentDestinationFolderLocator = '[data-automation-id="card-textitem-value-destination-folder"]';
  private readonly contentNodeSelectorSearchInput = '[data-automation-id="content-node-selector-search-input"]';

  constructor(page: Page) {
    super(page, ActionsDropdownComponent.rootElement);
  }

  async selectAction(action: Partial<ActionType>, index: number): Promise<void> {
    if (index > 0) {
      await this.addActionButtonLocator.click();
    }
    await this.actionDropdownLocator.nth(index).hover({ timeout: 1000 });
    await this.actionDropdownLocator.nth(index).click();
    const option = this.getOptionLocator(action);
    await option.click();
  }

  async dropdownSelection(selectValue: string, locator: string, index: number): Promise<void> {
    await this.ruleActionLocator.nth(index).locator(locator).click();
    await this.getOptionLocator(selectValue).nth(0).click();
  }

  async insertCheckInActionValues(checkInValue: string, index: number): Promise<void> {
    await this.ruleActionLocator.nth(index).locator(this.actionCheckInInputLocator).fill(checkInValue);
  }

  async insertAddAspectActionValues(AspectValue: string, index: number): Promise<void> {
    await this.dropdownSelection(AspectValue, this.actionAspectNameLocator, index);
  }

  async insertAutoDeclareOptionsActionValues(autoDeclareOptionsValue: string, index: number): Promise<void> {
    await this.dropdownSelection(autoDeclareOptionsValue, this.actionAutoDeclareLocator, index);
  }

  async insertSpecialiseTypeActionValues(specialiseTypeValue: string, index: number): Promise<void> {
    await this.dropdownSelection(specialiseTypeValue, this.actionSpecialiseTypeLocator, index);
  }

  async insertSimpleWorkflowActionValues(stepValue: string, index: number): Promise<void> {
    await this.ruleActionLocator.nth(index).locator(this.actionSimpleWorkflowStepInputLocator).fill(stepValue);
    await this.ruleActionLocator.nth(index).locator(this.actionSimpleWorkflowApproveFolderLocator).click();
    await this.page.locator(this.actionSimpleWorkflowActionChoiceLocator).click();
    await this.ruleActionLocator.nth(index).locator(this.actionSimpleWorkflowLabelApproveLocator).click();
    await this.ruleActionLocator.nth(index).locator(this.actionSimpleWorkflowSRejectStepLocator).fill(stepValue);
    await this.ruleActionLocator.nth(index).locator(this.actionSimpleWorkflowRejectFolderLocator).click();
    await this.page.locator(this.actionSimpleWorkflowActionChoiceLocator).click();
  }

  /**
   * Selects a MIME type from the dropdown for content transformation actions.
   * This method is typically used when configuring folder rules with transform actions
   * (e.g., Transform and Copy Content) to specify the target format for file conversion.
   *
   * @param mimeType - The MIME type to select (e.g., MimeType.AdobePDFDocument for PDF conversion)
   * @param index - The zero-based index of the action dropdown (use 0 for the first action, 1 for the second, etc.)
   *
   * @example
   * ```typescript
   * // Select PDF as the target format for the first transform action
   * await actionsDropdown.selectMimeType(MimeType.AdobePDFDocument, 0);
   * ```
   */
  async selectMimeType(mimeType: Partial<MimeType>, index: number): Promise<void> {
    await this.mimeTypeDropdownLocator.nth(index).hover({ timeout: timeouts.short });
    await this.mimeTypeDropdownLocator.nth(index).click();
    const option = this.getOptionLocator(mimeType);
    await option.click();
  }

  /**
   * Selects a destination folder for the Transform and Copy Content action.
   * This method opens the folder picker dialog, searches for a folder by name,
   * and selects it as the destination where transformed files will be copied.
   *
   * The method performs the following steps:
   * 1. Clicks the destination folder field to open the content node selector dialog
   * 2. Fills the search input with the provided search term
   * 3. Waits for search results to load
   * 4. Clicks on the first matching folder from the results
   * 5. Confirms the selection by clicking the Choose button
   *
   * @param index - The zero-based index of the action dropdown (use 0 for the first action, 1 for the second, etc.)
   * @param searchTerm - The name or partial name of the destination folder to search for (e.g., 'TO_PDF')
   *
   * @example
   * ```typescript
   * // Select 'TO_PDF' folder as the destination for transformed files
   * await actionsDropdown.selectDestinationFolderTransformAndCopyContent(0, 'TO_PDF');
   * ```
   */
  async selectDestinationFolderTransformAndCopyContent(index: number, searchTerm: string): Promise<void> {
    // Click on the destination folder input field to open the folder picker dialog
    await this.ruleActionLocator.nth(index).locator(this.actionTransformAndCopyContentDestinationFolderLocator).click();

    // Locate and fill the search input field within the content node selector
    const searchInput = this.page.locator(this.contentNodeSelectorSearchInput);
    await searchInput.fill(searchTerm);

    // Click on the folder from the search results (first match if multiple)
    const folderRow = this.page.locator('.adf-datatable-body .adf-name-location-cell-name', { hasText: searchTerm }).first();
    await folderRow.click();

    // Click the Choose button to confirm selection
    await this.page.locator(this.actionSimpleWorkflowActionChoiceLocator).click();
  }
}
