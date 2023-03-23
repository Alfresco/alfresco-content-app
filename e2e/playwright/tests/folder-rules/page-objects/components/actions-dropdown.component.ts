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
  private static rootElement = 'aca-rule-action-list';

  public getOptionLocator = (optionName: string): Locator => this.page.locator('.mat-select-panel .mat-option-text', { hasText: optionName });
  private ruleActionLocator = this.getChild('aca-rule-action [data-automation-id="rule-action-card-view"]');
  private addActionButtonLocator = this.getChild('[data-automation-id="rule-action-list-add-action-button"]');
  private actionDropdownLocator = this.getChild('[data-automation-id="rule-action-select"]');
  private actionAspectNameLocatorText = '[data-automation-id="header-aspect-name"] mat-select';
  private actionCheckInInputLocatorText = '[data-automation-id="header-description"] input';
  private actionAutoDeclareLocatorText = '[data-automation-id="header-version"] mat-select';
  private actionSimpleWorkflowStepInputLocatorText = '[data-automation-id="header-approve-step"] input';
  private actionSimpleWorkflowApproveFolderText = `[data-automation-id="header-approve-folder"] input`;
  private actionSimpleWorkflowActionChoiceText = '[data-automation-id="content-node-selector-actions-choose"]';
  private actionSimpleWorkflowLabelApproveLocatorText = `[data-automation-id="card-boolean-label-approve-move"]`;
  private actionSimpleWorkflowSRejectStepLocatorText = '[data-automation-id="header-reject-step"] input';
  private actionSimpleWorkflowRejectFolderLocatorText = `[data-automation-id="header-reject-folder"] input`;

  constructor(page: Page) {
    super(page, ActionsDropdownComponent.rootElement);
  }

  async selectAction(action: Partial<ActionType>, index: number): Promise<void> {
    if (index > 0) {
      await this.addActionButtonLocator.click();
    }
    await this.actionDropdownLocator.nth(index).click();
    const option = this.getOptionLocator(action);
    await option.nth(0).click();
  }

  async dropdownSelection(selectValue: string, locator: string, index: number): Promise<void> {
    await this.ruleActionLocator.nth(index).locator(locator).click();
    const option = this.getOptionLocator(selectValue);
    await option.nth(0).click();
  }

  async insertCheckInActionValues(checkInValue: string, index: number): Promise<void> {
    await this.ruleActionLocator.nth(index).locator(this.actionCheckInInputLocatorText).type(checkInValue, { delay: 50 });
  }

  async insertAddAspectActionValues(AspectValue: string, index: number): Promise<void> {
    await this.dropdownSelection(AspectValue, this.actionAspectNameLocatorText, index);
  }

  async insertAutoDeclareOptionsActionValues(autoDeclareOptionsValue: string, index: number): Promise<void> {
    await this.dropdownSelection(autoDeclareOptionsValue, this.actionAutoDeclareLocatorText, index);
  }

  async insertSimpleWorkflowActionValues(stepValue: string, index: number): Promise<void> {
    await this.ruleActionLocator.nth(index).locator(this.actionSimpleWorkflowStepInputLocatorText).type(stepValue, { delay: 50 });
    await this.ruleActionLocator.nth(index).locator(this.actionSimpleWorkflowApproveFolderText).click();
    await this.page.locator(this.actionSimpleWorkflowActionChoiceText).click();
    await this.ruleActionLocator.nth(index).locator(this.actionSimpleWorkflowLabelApproveLocatorText).click();
    await this.ruleActionLocator.nth(index).locator(this.actionSimpleWorkflowSRejectStepLocatorText).type(stepValue, { delay: 50 });
    await this.ruleActionLocator.nth(index).locator(this.actionSimpleWorkflowRejectFolderLocatorText).click();
    await this.page.locator(this.actionSimpleWorkflowActionChoiceText).click();
  }
}
