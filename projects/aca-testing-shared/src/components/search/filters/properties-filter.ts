import { GenericFilter } from './generic-filter';
import { by, element, ElementArrayFinder, ElementFinder } from 'protractor';

export enum SizeOperator {
  AT_LEAST = 'At Least',
  AT_MOST = 'At Most',
  EXACTLY = 'Exactly'
}

export class PropertiesFilter extends GenericFilter {
  private readonly locators = {
    fileSizeOperatorSelect: '[data-automation-id=adf-search-properties-file-size-operator-select]',
    fileSizeOperatorOption: '.mat-option-text',
    selectedFileSizeOperatorOption: '.mat-select-min-line',
    fileSizeInput: '[data-automation-id=adf-search-properties-file-size-input]',
    fileTypeInput: '[data-automation-id=adf-search-chip-autocomplete-input]',
    fileTypeOption: '.mat-option-text',
    selectedFileTypeOption: 'adf-search-chip-autocomplete-input .mat-chip span'
  };

  constructor() {
    super('Properties');
  }

  get fileTypeInput(): ElementFinder {
    return this.filterDialogOpened.element(by.css(this.locators.fileTypeInput));
  }

  get fileTypeOptions(): ElementArrayFinder {
    return element.all(by.css(this.locators.fileTypeOption));
  }

  get fileSizeInput(): ElementFinder {
    return this.filterDialogOpened.element(by.css(this.locators.fileSizeInput));
  }

  get fileSizeOperatorSelect(): ElementFinder {
    return this.filterDialogOpened.element(by.css(this.locators.fileSizeOperatorSelect));
  }

  get fileTypeOperatorOptions(): ElementArrayFinder {
    return element.all(by.css(this.locators.fileSizeOperatorOption));
  }

  get selectedFileTypeOperatorOption(): ElementFinder {
    return this.filterDialogOpened.element(by.css(this.locators.selectedFileSizeOperatorOption));
  }

  async getFileTypesValues(filterValue: string): Promise<string[]> {
    await this.fileTypeInput.sendKeys(filterValue);
    return this.fileTypeOptions.map((option) => option.getText());
  }

  async selectFileType(option: string): Promise<void> {
    await this.fileTypeInput.sendKeys(option);
    return this.fileTypeOptions.filter(async (element) => (await element.getText()) === option).click();
  }

  async getSelectedFileTypeOptions(): Promise<string[]> {
    return this.filterDialogOpened.all(by.css(this.locators.selectedFileTypeOption)).map((option) => option.getText());
  }

  async typeFileSize(fileSize: string): Promise<void> {
    await this.fileSizeInput.sendKeys(fileSize);
  }

  async selectFileSizeOperator(option: string): Promise<void> {
    await this.fileSizeOperatorSelect.click();
    await this.fileTypeOperatorOptions.filter(async (element) => (await element.getText() === option)).click();
  }

  async getFileSizeOperatorValue(): Promise<string> {
    return this.selectedFileTypeOperatorOption.getText();
  }

  async getFileSizeValue(): Promise<string> {
    return this.fileSizeInput.getAttribute('value');
  }
}
