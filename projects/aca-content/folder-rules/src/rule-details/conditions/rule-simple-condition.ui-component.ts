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

import { Component, forwardRef, inject, Input, OnDestroy, OnInit, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { RuleSimpleCondition } from '../../model/rule-simple-condition.model';
import { comparatorHiddenForConditionFieldType, RuleConditionField, ruleConditionFields } from './rule-condition-fields';
import { RuleConditionComparator, ruleConditionComparators } from './rule-condition-comparators';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CategoryService, TagService } from '@alfresco/adf-content-services';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, first, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CategoryEntry } from '@alfresco/js-api';
import { AlfrescoMimeType, AppSettingsService } from '@alfresco/aca-shared';

interface AutoCompleteOption {
  displayLabel: string;
  value: string;
}

const AUTOCOMPLETE_OPTIONS_DEBOUNCE_TIME = 500;

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatOptionModule,
    MatProgressSpinnerModule
  ],
  selector: 'aca-rule-simple-condition',
  templateUrl: './rule-simple-condition.ui-component.html',
  styleUrls: ['./rule-simple-condition.ui-component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-rule-simple-condition' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => RuleSimpleConditionUiComponent)
    }
  ]
})
export class RuleSimpleConditionUiComponent implements OnInit, ControlValueAccessor, OnChanges, OnDestroy {
  private appSettings = inject(AppSettingsService);
  private categoryService = inject(CategoryService);
  private tagService = inject(TagService);

  form = new FormGroup({
    field: new FormControl('cm:name'),
    comparator: new FormControl('equals'),
    parameter: new FormControl()
  });

  mimeTypes: AlfrescoMimeType[] = [];
  autoCompleteOptions: AutoCompleteOption[] = [];
  showLoadingSpinner: boolean;

  @Input() readOnly = false;

  private onDestroy$ = new Subject<void>();
  private autoCompleteOptionsSubscription: Subscription;

  private readonly disabledTags = !this.tagService.areTagsEnabled();
  private readonly disabledCategories = !this.categoryService.areCategoriesEnabled();

  readonly fields = ruleConditionFields.filter(
    (condition) => !((this.disabledTags && condition.name === 'tag') || (this.disabledCategories && condition.name === 'category'))
  );

  constructor() {
    this.mimeTypes = this.appSettings.mimeTypes;
  }

  get isSelectedFieldKnown(): boolean {
    const selectedFieldName = this.form.get('field').value;
    return this.fields.findIndex((field: RuleConditionField) => selectedFieldName === field.name) > -1;
  }
  get selectedField(): RuleConditionField {
    const selectedFieldName = this.form.get('field').value;
    if (!this.isSelectedFieldKnown) {
      return {
        name: selectedFieldName,
        label: selectedFieldName,
        type: 'special'
      };
    }
    return this.fields.find((field) => field.name === selectedFieldName);
  }

  get selectedFieldComparators(): RuleConditionComparator[] {
    return ruleConditionComparators.filter((comparator) => Object.keys(comparator.labels).includes(this.selectedField.type));
  }
  get isComparatorHidden(): boolean {
    return comparatorHiddenForConditionFieldType.includes(this.selectedField?.type);
  }

  get comparatorControl(): AbstractControl {
    return this.form.get('comparator');
  }

  private get parameterControl(): AbstractControl<string> {
    return this.form.get('parameter');
  }

  onChange: (condition: RuleSimpleCondition) => void = () => undefined;
  onTouch: () => void = () => undefined;

  writeValue(value: RuleSimpleCondition) {
    this.form.setValue(value);
    if (value?.field === 'category') {
      this.showLoadingSpinner = true;
      this.categoryService
        .getCategory(value.parameter, { include: ['path'] })
        .pipe(first())
        .subscribe((category: CategoryEntry) => {
          this.showLoadingSpinner = false;
          const option = this.buildAutocompleteOptionFromCategory(category.entry.id, category.entry.path, category.entry.name);
          this.autoCompleteOptions.push(option);
          this.parameterControl.setValue(option.value);
        });
    }
  }

  registerOnChange(fn: () => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouch = fn;
  }

  onChangeField() {
    if (!this.selectedFieldComparators.find((comparator) => comparator.name === this.comparatorControl.value)) {
      this.comparatorControl.setValue('equals');
    }
    if (!this.parameterControl.value && this.selectedField?.type === 'mimeType') {
      this.parameterControl.setValue(this.mimeTypes[0]?.value);
    } else if (this.parameterControl.value) {
      this.parameterControl.setValue('');
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit() {
    this.form.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((value: RuleSimpleCondition) => {
      this.onChange(value);
      this.onTouch();
    });

    this.form
      .get('field')
      .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.onDestroy$))
      .subscribe((field: string) => {
        if (field === 'category') {
          this.autoCompleteOptionsSubscription = this.form
            .get('parameter')
            .valueChanges.pipe(distinctUntilChanged(), debounceTime(AUTOCOMPLETE_OPTIONS_DEBOUNCE_TIME), takeUntil(this.onDestroy$))
            .subscribe((categoryName) => {
              this.getCategories(categoryName);
            });
          this.parameterControl.setValue('');
        } else {
          this.autoCompleteOptionsSubscription?.unsubscribe();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    const readOnly = changes['readOnly']?.currentValue;

    if (readOnly !== undefined && readOnly !== null) {
      if (this.readOnly) {
        this.readOnly = true;
        this.form.disable();
      } else {
        this.readOnly = false;
        this.form.enable();
      }
    }
  }

  private getCategories(categoryName: string) {
    this.showLoadingSpinner = true;
    this.categoryService
      .searchCategories(categoryName)
      .pipe(first())
      .subscribe((existingCategoriesResult) => {
        this.showLoadingSpinner = false;
        const options: AutoCompleteOption[] = existingCategoriesResult?.list?.entries?.map((rowEntry) =>
          this.buildAutocompleteOptionFromCategory(rowEntry.entry.id, rowEntry.entry.path.name, rowEntry.entry.name)
        );
        if (options.length > 0) {
          this.autoCompleteOptions = this.sortAutoCompleteOptions(options);
        }
      });
  }

  private sortAutoCompleteOptions(autoCompleteOptions: AutoCompleteOption[]): AutoCompleteOption[] {
    return autoCompleteOptions.sort((option1, option2) => option1.displayLabel.localeCompare(option2.displayLabel));
  }

  autoCompleteDisplayFunction = (optionValue: string): string =>
    optionValue && this.autoCompleteOptions ? this.autoCompleteOptions.find((option) => option.value === optionValue)?.displayLabel : optionValue;

  autoSelectValidOption() {
    const currentValue = this.parameterControl.value;
    const isValidValueSelected = !!this.autoCompleteOptions?.find((option) => option.value === currentValue);
    if (!isValidValueSelected) {
      this.parameterControl.setValue(this.autoCompleteOptions?.[0].value);
    }
  }

  buildAutocompleteOptionFromCategory(categoryId: string, categoryPath: string, categoryName: string): AutoCompleteOption {
    const path = categoryPath.split('/').splice(3).join('/');
    return {
      value: categoryId,
      displayLabel: path ? `${path}/${categoryName}` : categoryName
    };
  }
}
