/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RuleSimpleConditionUiComponent } from './rule-simple-condition.ui-component';
import { CoreTestingModule } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { tagMock, mimeTypeMock, simpleConditionUnknownFieldMock, categoriesListMock } from '../../mock/conditions.mock';
import { CategoryService, TagService } from '@alfresco/adf-content-services';
import { of } from 'rxjs';
import { RuleSimpleCondition } from '../../model/rule-simple-condition.model';
import { delay } from 'rxjs/operators';
import { RuleConditionField, ruleConditionFields } from './rule-condition-fields';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { AlfrescoMimeType } from '@alfresco/aca-shared';

describe('RuleSimpleConditionUiComponent', () => {
  let fixture: ComponentFixture<RuleSimpleConditionUiComponent>;
  let categoryService: CategoryService;
  let loader: HarnessLoader;

  const fieldSelectAutomationId = 'field-select';
  const folderRulesBaseLabel = 'ACA_FOLDER_RULES.RULE_DETAILS.COMPARATORS';

  const getByDataAutomationId = (dataAutomationId: string): DebugElement =>
    fixture.debugElement.query(By.css(`[data-automation-id="${dataAutomationId}"]`));

  const changeMatSelectValue = async (dataAutomationId: string, value: string) => {
    const matSelect = await loader.getHarness(MatSelectHarness.with({ selector: `[data-automation-id="${dataAutomationId}"]` }));
    await matSelect.clickOptions({ selector: `[ng-reflect-value="${value}"]` });
    fixture.detectChanges();
  };

  const changeMatAutocompleteValue = async (value: string) => {
    const matAutocomplete = await loader.getHarness(MatAutocompleteHarness);
    await matAutocomplete.selectOption({ selector: `[ng-reflect-value="${value}"]` });
    fixture.detectChanges();
  };

  const setValueInInputField = (inputFieldDataAutomationId: string, value: string) => {
    const inputField = fixture.debugElement.query(By.css(`[data-automation-id="${inputFieldDataAutomationId}"]`)).nativeElement;
    inputField.value = value;
    inputField.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  const expectConditionFieldsDisplayedAsOptions = async (conditionFields: RuleConditionField[]): Promise<void> => {
    loader = TestbedHarnessEnvironment.loader(fixture);
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    const options = await select.getOptions();
    await Promise.all(
      conditionFields.map(async (field, i) => {
        expect(field.label).toEqual(await options[i].getText());
      })
    );
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule, RuleSimpleConditionUiComponent]
    });

    fixture = TestBed.createComponent(RuleSimpleConditionUiComponent);
    categoryService = TestBed.inject(CategoryService);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should default the field to the name, the comparator to equals and the value empty', () => {
    fixture.detectChanges();

    expect(getByDataAutomationId(fieldSelectAutomationId).componentInstance.value).toBe('cm:name');
    expect(getByDataAutomationId('comparator-select').componentInstance.value).toBe('equals');
    expect(getByDataAutomationId('value-input').nativeElement.value).toBe('');
  });

  it('should hide the comparator select box if the type of the field is mimeType', async () => {
    fixture.componentInstance.mimeTypes = [{ value: '', label: '' } as AlfrescoMimeType];
    fixture.detectChanges();
    const comparatorFormField = getByDataAutomationId('comparator-form-field').nativeElement;

    expect(fixture.componentInstance.isComparatorHidden).toBeFalsy();
    expect(getComputedStyle(comparatorFormField).display).not.toBe('none');

    await changeMatSelectValue(fieldSelectAutomationId, 'mimetype');

    expect(fixture.componentInstance.isComparatorHidden).toBeTruthy();
    expect(getComputedStyle(comparatorFormField).display).toBe('none');
  });

  it('should set the comparator to equals if the field is set to a type with different comparators', async () => {
    spyOn(fixture.componentInstance, 'onChangeField').and.callThrough();
    const comparatorSelect = await loader.getHarness(MatSelectHarness.with({ selector: '[data-automation-id="comparator-select"]' }));

    await changeMatSelectValue('comparator-select', 'contains');
    expect(await comparatorSelect.getValueText()).toBe(folderRulesBaseLabel + '.CONTAINS');

    await changeMatSelectValue(fieldSelectAutomationId, 'size');
    expect(await comparatorSelect.getValueText()).toBe(folderRulesBaseLabel + '.EQUALS');
    expect(fixture.componentInstance.onChangeField).toHaveBeenCalled();
  });

  it('should display an additional option for a currently selected unknown field', () => {
    fixture.componentInstance.writeValue(simpleConditionUnknownFieldMock);
    fixture.detectChanges();

    expect(getByDataAutomationId(fieldSelectAutomationId).componentInstance.value).toBe(simpleConditionUnknownFieldMock.field);
    const matSelect = getByDataAutomationId(fieldSelectAutomationId).nativeElement;
    matSelect.click();
    fixture.detectChanges();

    const unknownOptionMatOption = getByDataAutomationId('unknown-field-option');
    expect(unknownOptionMatOption).not.toBeNull();
    expect((unknownOptionMatOption.nativeElement as HTMLElement).innerText.trim()).toBe(simpleConditionUnknownFieldMock.field);
  });

  it('should remove the option for the unknown field as soon as another option is selected', async () => {
    fixture.componentInstance.writeValue(simpleConditionUnknownFieldMock);
    fixture.detectChanges();
    await changeMatSelectValue(fieldSelectAutomationId, 'cm:name');
    const matSelect = getByDataAutomationId(fieldSelectAutomationId).nativeElement;
    matSelect.click();
    fixture.detectChanges();

    const unknownOptionMatOption = getByDataAutomationId('unknown-field-option');
    expect(unknownOptionMatOption).toBeNull();
  });

  it('should provide select option when mimeType is selected and value filled', () => {
    const mockMimeTypes: AlfrescoMimeType[] = [
      {
        value: 'video/3gpp',
        label: '3G Video'
      },
      {
        value: 'video/3gpp2',
        label: '3G2 Video'
      },
      {
        value: 'application/vnd.alfresco.ai.features.v1+json',
        label: 'AI-Features'
      },
      {
        value: 'application/vnd.alfresco.ai.labels.v1+json',
        label: 'AI-Labels'
      }
    ];

    fixture.componentInstance.writeValue(mimeTypeMock);
    fixture.componentInstance.mimeTypes = mockMimeTypes;

    fixture.componentInstance.onChangeField();
    fixture.detectChanges();

    expect(getByDataAutomationId('simple-condition-value-select')).toBeTruthy();
    expect(fixture.componentInstance.form.get('parameter').value).toEqual(mockMimeTypes[0].value);
  });

  it('should set value to empty when any condition is selected after mimeType', () => {
    fixture.componentInstance.writeValue(mimeTypeMock);
    fixture.detectChanges();

    expect(getByDataAutomationId('simple-condition-value-select')).toBeTruthy();

    fixture.componentInstance.writeValue(tagMock);
    fixture.detectChanges();

    expect(getByDataAutomationId('value-input').nativeElement.value).toBe('');
  });

  it('should show loading spinner while auto-complete options are fetched, and then remove it once it is received', fakeAsync(async () => {
    spyOn(categoryService, 'searchCategories').and.returnValue(of(categoriesListMock).pipe(delay(1000)));
    fixture.detectChanges();
    await changeMatSelectValue(fieldSelectAutomationId, 'category');
    tick(500);
    getByDataAutomationId('auto-complete-input-field')?.nativeElement?.click();
    let loadingSpinner = getByDataAutomationId('auto-complete-loading-spinner');
    expect(loadingSpinner).not.toBeNull();
    tick(1000);
    fixture.detectChanges();
    loadingSpinner = getByDataAutomationId('auto-complete-loading-spinner');
    expect(loadingSpinner).toBeNull();
    discardPeriodicTasks();
  }));

  describe('With categories option selected', () => {
    beforeEach(() => {
      spyOn(categoryService, 'searchCategories').and.returnValue(of(categoriesListMock));
    });

    it('should hide the comparator select box if the type of the field is autoComplete', async () => {
      const autoCompleteField = 'category';
      fixture.detectChanges();
      const comparatorFormField = getByDataAutomationId('comparator-form-field').nativeElement;

      expect(fixture.componentInstance.isComparatorHidden).toBeFalsy();
      expect(getComputedStyle(comparatorFormField).display).not.toBe('none');

      await changeMatSelectValue(fieldSelectAutomationId, autoCompleteField);

      expect(fixture.componentInstance.isComparatorHidden).toBeTruthy();
      expect(getComputedStyle(comparatorFormField).display).toBe('none');
    });

    it('should hide the comparator select box if the type of the field is special', async () => {
      fixture.detectChanges();
      const comparatorFormField = getByDataAutomationId('comparator-form-field').nativeElement;

      expect(fixture.componentInstance.isComparatorHidden).toBeFalsy();
      expect(getComputedStyle(comparatorFormField).display).not.toBe('none');

      await changeMatSelectValue(fieldSelectAutomationId, 'category');

      expect(fixture.componentInstance.isComparatorHidden).toBeTruthy();
      expect(getComputedStyle(comparatorFormField).display).toBe('none');
    });

    it('should provide auto-complete option when category is selected', async () => {
      fixture.detectChanges();
      await changeMatSelectValue(fieldSelectAutomationId, 'category');

      expect(getByDataAutomationId('auto-complete-input-field')).toBeTruthy();
      expect(fixture.componentInstance.form.get('parameter').value).toEqual('');
    });

    it('should fetch category list when category option is selected', fakeAsync(async () => {
      fixture.detectChanges();
      await changeMatSelectValue(fieldSelectAutomationId, 'category');
      tick(500);

      expect(categoryService.searchCategories).toHaveBeenCalledWith('');
    }));

    it('should fetch new category list with user input when user types into parameter field after category option is select', fakeAsync(async () => {
      const categoryValue = 'a new category';

      fixture.detectChanges();
      await changeMatSelectValue(fieldSelectAutomationId, 'category');
      tick(500);
      expect(categoryService.searchCategories).toHaveBeenCalledWith('');

      setValueInInputField('auto-complete-input-field', categoryValue);
      tick(500);
      expect(categoryService.searchCategories).toHaveBeenCalledWith(categoryValue);
    }));

    it('should display correct label for category when user selects a category from auto-complete dropdown', fakeAsync(async () => {
      fixture.detectChanges();
      await changeMatSelectValue(fieldSelectAutomationId, 'category');
      tick(500);
      getByDataAutomationId('auto-complete-input-field')?.nativeElement?.click();
      await changeMatAutocompleteValue(categoriesListMock.list.entries[0].entry.id);
      const displayValue = getByDataAutomationId('auto-complete-input-field')?.nativeElement?.value;
      expect(displayValue).toBe('category/path/1/FakeCategory1');
      discardPeriodicTasks();
    }));

    it('should automatically select first category when user focuses out of parameter form field with category option selected', fakeAsync(async () => {
      fixture.detectChanges();
      await changeMatSelectValue(fieldSelectAutomationId, 'category');
      tick(500);
      const autoCompleteInputField = getByDataAutomationId('auto-complete-input-field')?.nativeElement;
      autoCompleteInputField.value = 'FakeCat';
      autoCompleteInputField.dispatchEvent(new Event('focusout'));
      const parameterValue = fixture.componentInstance.form.get('parameter').value;
      expect(parameterValue).toEqual(categoriesListMock.list.entries[0].entry.id);
      discardPeriodicTasks();
    }));
  });

  it('should fetch category details when a saved rule with category condition is edited', () => {
    const savedCategoryMock: RuleSimpleCondition = {
      field: 'category',
      comparator: 'equals',
      parameter: 'a-fake-category-id'
    };

    const fakeCategory = {
      entry: {
        path: '/a/fake/category/path',
        hasChildren: false,
        name: 'FakeCategory',
        id: 'fake-category-id-1'
      }
    };
    spyOn(categoryService, 'getCategory').and.returnValue(of(fakeCategory));

    fixture.componentInstance.writeValue(savedCategoryMock);
    fixture.detectChanges();

    expect(categoryService.getCategory).toHaveBeenCalledWith(savedCategoryMock.parameter, { include: ['path'] });
  });

  it('should display correct condition field options when tagService.areTagsEnabled returns true', async () => {
    const tagService = TestBed.inject(TagService);
    spyOn(tagService, 'areTagsEnabled').and.returnValue(true);
    fixture = TestBed.createComponent(RuleSimpleConditionUiComponent);

    expect(tagService.areTagsEnabled).toHaveBeenCalled();
    await expectConditionFieldsDisplayedAsOptions(ruleConditionFields);
  });

  it('should display correct condition field options when tagService.areTagsEnabled returns false', async () => {
    const tagService = TestBed.inject(TagService);
    spyOn(tagService, 'areTagsEnabled').and.returnValue(false);
    fixture = TestBed.createComponent(RuleSimpleConditionUiComponent);

    expect(tagService.areTagsEnabled).toHaveBeenCalled();
    await expectConditionFieldsDisplayedAsOptions(ruleConditionFields.filter((field) => field.name !== 'tag'));
  });

  it('should display correct condition field options when categoryService.areCategoriesEnabled returns true', async () => {
    spyOn(categoryService, 'areCategoriesEnabled').and.returnValue(true);
    fixture = TestBed.createComponent(RuleSimpleConditionUiComponent);

    expect(categoryService.areCategoriesEnabled).toHaveBeenCalled();
    await expectConditionFieldsDisplayedAsOptions(ruleConditionFields);
  });

  it('should display correct condition field options when categoryService.areCategoriesEnabled returns false', async () => {
    spyOn(categoryService, 'areCategoriesEnabled').and.returnValue(false);
    fixture = TestBed.createComponent(RuleSimpleConditionUiComponent);

    expect(categoryService.areCategoriesEnabled).toHaveBeenCalled();
    await expectConditionFieldsDisplayedAsOptions(ruleConditionFields.filter((field) => field.name !== 'category'));
  });
});
