/*
 * Copyright © 2005 - 2023 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '@alfresco/playwright-shared';

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

export class ActionsDropdownComponent extends BaseComponent {
  private static rootElement = '.mat-select-panel';

  public getOptionLocator = (optionName: string): Locator => this.getChild('.mat-option-text', { hasText: optionName });
  private ruleActionLocator = this.page.locator('aca-rule-action [data-automation-id="rule-action-card-view"]');

  constructor(page: Page) {
    super(page, ActionsDropdownComponent.rootElement);
  }

  async selectAction(action: Partial<ActionType>, index: number): Promise<void> {
    if (index > 0) {
      await this.page.locator(`xpath=//span[text()="Add action"]`).click();
    }
    await this.page.locator(`aca-edit-rule-dialog [data-automation-id="rule-action-select"]`).nth(index).click();
    const option = this.getOptionLocator(action);
    await option.nth(0).click();
  }

  async dropdownSelection(selectValue: string, locator: string, index: number): Promise<void> {
    await this.ruleActionLocator.nth(index).locator(locator).click();
    const option = this.getOptionLocator(selectValue);
    await option.nth(0).click();
  }

  async insertCheckInActionValues(checkInValue: string, index: number): Promise<void> {
    await this.ruleActionLocator.nth(index).locator('[data-automation-id="header-description"] input').type(checkInValue, { delay: 50 });
  }

  async insertAddAspectActionValues(AspectValue: string, index: number): Promise<void> {
    await this.dropdownSelection(AspectValue, '[data-automation-id="header-aspect-name"] mat-select', index);
  }

  async insertAutoDeclareOptionsActionValues(autoDeclareOptionsValue: string, index: number): Promise<void> {
    await this.dropdownSelection(autoDeclareOptionsValue, '[data-automation-id="header-version"] mat-select', index);
  }

  async insertSimpleWorkflowActionValues(stepValue: string, index: number): Promise<void> {
    await this.ruleActionLocator.nth(index).locator('[data-automation-id="header-approve-step"] input').type(stepValue, { delay: 50 });
    await this.ruleActionLocator.nth(index).locator(`[data-automation-id="header-approve-folder"] input`).click();
    await this.page.locator('[data-automation-id="content-node-selector-actions-choose"]').click();
    await this.ruleActionLocator.nth(index).locator(`[data-automation-id="card-boolean-label-approve-move"]`).click();
    await this.ruleActionLocator.nth(index).locator('[data-automation-id="header-reject-step"] input').type(stepValue, { delay: 50 });
    await this.ruleActionLocator.nth(index).locator(`[data-automation-id="header-reject-folder"] input`).click();
    await this.page.locator('[data-automation-id="content-node-selector-actions-choose"]').click();
  }
}
