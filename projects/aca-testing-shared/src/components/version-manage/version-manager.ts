import { BrowserActions, BrowserVisibility } from '@alfresco/adf-testing';
import { by, element, ElementFinder } from 'protractor';

export class VersionManagePage {
  async clickActionButton(version: string): Promise<void> {
    await BrowserActions.click(element(by.id(`adf-version-list-action-menu-button-${version}`)));
    await BrowserVisibility.waitUntilElementIsVisible(element(by.css('.cdk-overlay-container .mat-menu-content')));
  }

  async viewFileVersion(version): Promise<void> {
    await this.clickActionButton(version);
    const viewButton: ElementFinder = element(by.id(`adf-version-list-action-view-${version}`));
    await BrowserActions.click(viewButton);
  }
}
