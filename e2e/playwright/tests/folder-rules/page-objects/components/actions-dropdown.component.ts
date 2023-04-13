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

  private getOptionLocator = (optionName: string): Locator => this.page.locator('.mat-select-panel .mat-option-text', { hasText: optionName });
  private ruleActionLocator = this.getChild('aca-rule-action [data-automation-id="rule-action-card-view"]');
  private addActionButtonLocator = this.getChild('[data-automation-id="rule-action-list-add-action-button"]');
  private actionDropdownLocator = this.getChild('[data-automation-id="rule-action-select"]');
  private actionAspectNameLocator = '[data-automation-id="header-aspect-name"] mat-select';
  private actionCheckInInputLocator = '[data-automation-id="header-description"] input';
  private actionAutoDeclareLocator = '[data-automation-id="header-version"] mat-select';
  private actionSimpleWorkflowStepInputLocator = '[data-automation-id="header-approve-step"] input';
  private actionSimpleWorkflowApproveFolderLocator = `[data-automation-id="header-approve-folder"] input`;
  private actionSimpleWorkflowActionChoiceLocator = '[data-automation-id="content-node-selector-actions-choose"]';
  private actionSimpleWorkflowLabelApproveLocator = `[data-automation-id="card-boolean-label-approve-move"]`;
  private actionSimpleWorkflowSRejectStepLocator = '[data-automation-id="header-reject-step"] input';
  private actionSimpleWorkflowRejectFolderLocator = `[data-automation-id="header-reject-folder"] input`;

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
    await this.ruleActionLocator.nth(index).locator(this.actionCheckInInputLocator).type(checkInValue, { delay: 50 });
  }

  async insertAddAspectActionValues(AspectValue: string, index: number): Promise<void> {
    this.dropdownSelection(AspectValue, this.actionAspectNameLocator, index);
  }

  async insertAutoDeclareOptionsActionValues(autoDeclareOptionsValue: string, index: number): Promise<void> {
    this.dropdownSelection(autoDeclareOptionsValue, this.actionAutoDeclareLocator, index);
  }

  async insertSimpleWorkflowActionValues(stepValue: string, index: number): Promise<void> {
    await this.ruleActionLocator.nth(index).locator(this.actionSimpleWorkflowStepInputLocator).type(stepValue, { delay: 50 });
    await this.ruleActionLocator.nth(index).locator(this.actionSimpleWorkflowApproveFolderLocator).click();
    await this.page.locator(this.actionSimpleWorkflowActionChoiceLocator).click();
    await this.ruleActionLocator.nth(index).locator(this.actionSimpleWorkflowLabelApproveLocator).click();
    await this.ruleActionLocator.nth(index).locator(this.actionSimpleWorkflowSRejectStepLocator).type(stepValue, { delay: 50 });
    await this.ruleActionLocator.nth(index).locator(this.actionSimpleWorkflowRejectFolderLocator).click();
    await this.page.locator(this.actionSimpleWorkflowActionChoiceLocator).click();
  }
}
