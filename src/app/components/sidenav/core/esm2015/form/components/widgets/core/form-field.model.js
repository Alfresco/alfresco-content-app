/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* tslint:disable:component-selector  */
import moment from 'moment-es6';
import { WidgetVisibilityModel } from '../../../models/widget-visibility.model';
import { ContainerColumnModel } from './container-column.model';
import { ErrorMessageModel } from './error-message.model';
import { FormFieldTypes } from './form-field-types';
import { NumberFieldValidator } from './form-field-validator';
import { FormWidgetModel } from './form-widget.model';
// Maps to FormFieldRepresentation
export class FormFieldModel extends FormWidgetModel {
  /**
   * @param {?} form
   * @param {?=} json
   */
  constructor(form, json) {
    super(form, json);
    this._readOnly = false;
    this._isValid = true;
    this._required = false;
    this.defaultDateFormat = 'D-M-YYYY';
    this.defaultDateTimeFormat = 'D-M-YYYY hh:mm A';
    this.rowspan = 1;
    this.colspan = 1;
    this.placeholder = null;
    this.minLength = 0;
    this.maxLength = 0;
    this.options = [];
    this.params = {};
    this.isVisible = true;
    this.visibilityCondition = null;
    this.enableFractions = false;
    this.currency = null;
    this.dateDisplayFormat = this.defaultDateFormat;
    // container model members
    this.numberOfColumns = 1;
    this.fields = [];
    this.columns = [];
    if (json) {
      this.fieldType = json.fieldType;
      this.id = json.id;
      this.name = json.name;
      this.type = json.type;
      this.roles = json.roles;
      this._required = /** @type {?} */ (json.required);
      this._readOnly =
        /** @type {?} */ (json.readOnly) || json.type === 'readonly';
      this.overrideId = /** @type {?} */ (json.overrideId);
      this.tab = json.tab;
      this.restUrl = json.restUrl;
      this.restResponsePath = json.restResponsePath;
      this.restIdProperty = json.restIdProperty;
      this.restLabelProperty = json.restLabelProperty;
      this.colspan = /** @type {?} */ (json.colspan);
      this.minLength = /** @type {?} */ (json.minLength) || 0;
      this.maxLength = /** @type {?} */ (json.maxLength) || 0;
      this.minValue = json.minValue;
      this.maxValue = json.maxValue;
      this.regexPattern = json.regexPattern;
      this.options = /** @type {?} */ (json.options) || [];
      this.hasEmptyValue = /** @type {?} */ (json.hasEmptyValue);
      this.className = json.className;
      this.optionType = json.optionType;
      this.params = /** @type {?} */ (json.params) || {};
      this.hyperlinkUrl = json.hyperlinkUrl;
      this.displayText = json.displayText;
      this.visibilityCondition = json.visibilityCondition
        ? new WidgetVisibilityModel(json.visibilityCondition)
        : undefined;
      this.enableFractions = /** @type {?} */ (json.enableFractions);
      this.currency = json.currency;
      this.dateDisplayFormat =
        json.dateDisplayFormat || this.getDefaultDateFormat(json);
      this._value = this.parseValue(json);
      this.validationSummary = new ErrorMessageModel();
      if (
        json.placeholder &&
        json.placeholder !== '' &&
        json.placeholder !== 'null'
      ) {
        this.placeholder = json.placeholder;
      }
      if (FormFieldTypes.isReadOnlyType(this.type)) {
        if (this.params && this.params.field) {
          /** @type {?} */
          let valueFound = false;
          if (form.processVariables) {
            /** @type {?} */
            const processVariable = this.getProcessVariableValue(
              this.params.field,
              form
            );
            if (processVariable) {
              valueFound = true;
              this.value = processVariable;
            }
          }
          if (!valueFound && this.params.responseVariable) {
            /** @type {?} */
            const defaultValue = form.getFormVariableValue(
              this.params.field.name
            );
            if (defaultValue) {
              valueFound = true;
              this.value = defaultValue;
            }
          }
        }
      }
      if (FormFieldTypes.isContainerType(this.type)) {
        this.containerFactory(json, form);
      }
    }
    if (this.hasEmptyValue && this.options && this.options.length > 0) {
      this.emptyOption = this.options[0];
    }
    this.updateForm();
  }
  /**
   * @return {?}
   */
  get value() {
    return this._value;
  }
  /**
   * @param {?} v
   * @return {?}
   */
  set value(v) {
    this._value = v;
    this.updateForm();
  }
  /**
   * @return {?}
   */
  get readOnly() {
    if (this.form && this.form.readOnly) {
      return true;
    }
    return this._readOnly;
  }
  /**
   * @param {?} readOnly
   * @return {?}
   */
  set readOnly(readOnly) {
    this._readOnly = readOnly;
    this.updateForm();
  }
  /**
   * @return {?}
   */
  get required() {
    return this._required;
  }
  /**
   * @param {?} value
   * @return {?}
   */
  set required(value) {
    this._required = value;
    this.updateForm();
  }
  /**
   * @return {?}
   */
  get isValid() {
    return this._isValid;
  }
  /**
   * @return {?}
   */
  markAsInvalid() {
    this._isValid = false;
  }
  /**
   * @return {?}
   */
  validate() {
    this.validationSummary = new ErrorMessageModel();
    if (!this.readOnly) {
      /** @type {?} */
      const validators = this.form.fieldValidators || [];
      for (const validator of validators) {
        if (!validator.validate(this)) {
          this._isValid = false;
          return this._isValid;
        }
      }
    }
    this._isValid = true;
    return this._isValid;
  }
  /**
   * @private
   * @param {?} jsonField
   * @return {?}
   */
  getDefaultDateFormat(jsonField) {
    /** @type {?} */
    let originalType = jsonField.type;
    if (
      FormFieldTypes.isReadOnlyType(jsonField.type) &&
      jsonField.params &&
      jsonField.params.field
    ) {
      originalType = jsonField.params.field.type;
    }
    return originalType === FormFieldTypes.DATETIME
      ? this.defaultDateTimeFormat
      : this.defaultDateFormat;
  }
  /**
   * @private
   * @param {?} type
   * @return {?}
   */
  isTypeaheadFieldType(type) {
    return type === 'typeahead' ? true : false;
  }
  /**
   * @private
   * @param {?} name
   * @return {?}
   */
  getFieldNameWithLabel(name) {
    return (name += '_LABEL');
  }
  /**
   * @private
   * @param {?} field
   * @param {?} form
   * @return {?}
   */
  getProcessVariableValue(field, form) {
    /** @type {?} */
    let fieldName = field.name;
    if (this.isTypeaheadFieldType(field.type)) {
      fieldName = this.getFieldNameWithLabel(field.id);
    }
    return form.getProcessVariableValue(fieldName);
  }
  /**
   * @private
   * @param {?} json
   * @param {?} form
   * @return {?}
   */
  containerFactory(json, form) {
    this.numberOfColumns = /** @type {?} */ (json.numberOfColumns) || 1;
    this.fields = json.fields;
    this.rowspan = 1;
    this.colspan = 1;
    if (json.fields) {
      for (const currentField in json.fields) {
        if (json.fields.hasOwnProperty(currentField)) {
          /** @type {?} */
          const col = new ContainerColumnModel();
          /** @type {?} */
          const fields = (json.fields[currentField] || []).map(
            /**
             * @param {?} field
             * @return {?}
             */
            (field => new FormFieldModel(form, field))
          );
          col.fields = fields;
          col.rowspan = json.fields[currentField].length;
          col.fields.forEach(
            /**
             * @param {?} colFields
             * @return {?}
             */
            colFields => {
              this.colspan =
                colFields.colspan > this.colspan
                  ? colFields.colspan
                  : this.colspan;
            }
          );
          this.rowspan =
            this.rowspan < col.rowspan ? col.rowspan : this.rowspan;
          this.columns.push(col);
        }
      }
    }
  }
  /**
   * @param {?} json
   * @return {?}
   */
  parseValue(json) {
    /** @type {?} */
    let value = json.hasOwnProperty('value') ? json.value : null;
    /*
         This is needed due to Activiti issue related to reading dropdown values as value string
         but saving back as object: { id: <id>, name: <name> }
         */
    if (json.type === FormFieldTypes.DROPDOWN) {
      if (json.hasEmptyValue && json.options) {
        /** @type {?} */
        const options = /** @type {?} */ (json.options) || [];
        if (options.length > 0) {
          /** @type {?} */
          const emptyOption = json.options[0];
          if (
            value === '' ||
            value === emptyOption.id ||
            value === emptyOption.name
          ) {
            value = emptyOption.id;
          } else if (value.id && value.name) {
            value = value.id;
          }
        }
      }
    }
    /*
         This is needed due to Activiti issue related to reading radio button values as value string
         but saving back as object: { id: <id>, name: <name> }
         */
    if (json.type === FormFieldTypes.RADIO_BUTTONS) {
      // Activiti has a bug with default radio button value where initial selection passed as `name` value
      // so try resolving current one with a fallback to first entry via name or id
      // TODO: needs to be reported and fixed at Activiti side
      /** @type {?} */
      const entry = this.options.filter(
        /**
         * @param {?} opt
         * @return {?}
         */
        (opt =>
          opt.id === value ||
          opt.name === value ||
          (value && (opt.id === value.id || opt.name === value.name)))
      );
      if (entry.length > 0) {
        value = entry[0].id;
      }
    }
    /*
         This is needed due to Activiti displaying/editing dates in d-M-YYYY format
         but storing on server in ISO8601 format (i.e. 2013-02-04T22:44:30.652Z)
         */
    if (this.isDateField(json) || this.isDateTimeField(json)) {
      if (value) {
        /** @type {?} */
        let dateValue;
        if (NumberFieldValidator.isNumber(value)) {
          dateValue = moment(value);
        } else {
          dateValue = this.isDateTimeField(json)
            ? moment(value, 'YYYY-MM-DD hh:mm A')
            : moment(value.split('T')[0], 'YYYY-M-D');
        }
        if (dateValue && dateValue.isValid()) {
          value = dateValue.format(this.dateDisplayFormat);
        }
      }
    }
    return value;
  }
  /**
   * @return {?}
   */
  updateForm() {
    if (!this.form) {
      return;
    }
    switch (this.type) {
      case FormFieldTypes.DROPDOWN:
        /*
                 This is needed due to Activiti reading dropdown values as string
                 but saving back as object: { id: <id>, name: <name> }
                 */
        if (this.value === 'empty' || this.value === '') {
          this.form.values[this.id] = {};
        } else {
          /** @type {?} */
          const entry = this.options.filter(
            /**
             * @param {?} opt
             * @return {?}
             */
            (opt => opt.id === this.value)
          );
          if (entry.length > 0) {
            this.form.values[this.id] = entry[0];
          }
        }
        break;
      case FormFieldTypes.RADIO_BUTTONS:
        /*
                                 This is needed due to Activiti issue related to reading radio button values as value string
                                 but saving back as object: { id: <id>, name: <name> }
                                 */
        /** @type {?} */
        const radioButton = this.options.filter(
          /**
           * @param {?} opt
           * @return {?}
           */
          (opt => opt.id === this.value)
        );
        if (radioButton.length > 0) {
          this.form.values[this.id] = radioButton[0];
        }
        break;
      case FormFieldTypes.UPLOAD:
        this.form.hasUpload = true;
        if (this.value && this.value.length > 0) {
          this.form.values[this.id] = Array.isArray(this.value)
            ? this.value
                .map(
                  /**
                   * @param {?} elem
                   * @return {?}
                   */
                  elem => elem.id
                )
                .join(',')
            : [this.value];
        } else {
          this.form.values[this.id] = null;
        }
        break;
      case FormFieldTypes.TYPEAHEAD:
        /** @type {?} */
        const typeAheadEntry = this.options.filter(
          /**
           * @param {?} opt
           * @return {?}
           */
          (opt => opt.id === this.value || opt.name === this.value)
        );
        if (typeAheadEntry.length > 0) {
          this.form.values[this.id] = typeAheadEntry[0];
        } else if (this.options.length > 0) {
          this.form.values[this.id] = null;
        }
        break;
      case FormFieldTypes.DATE:
        /** @type {?} */
        const dateValue = moment(this.value, this.dateDisplayFormat, true);
        if (dateValue && dateValue.isValid()) {
          this.form.values[this.id] = `${dateValue.format(
            'YYYY-MM-DD'
          )}T00:00:00.000Z`;
        } else {
          this.form.values[this.id] = null;
          this._value = this.value;
        }
        break;
      case FormFieldTypes.DATETIME:
        /** @type {?} */
        const dateTimeValue = moment(
          this.value,
          this.dateDisplayFormat,
          true
        ).utc();
        if (dateTimeValue && dateTimeValue.isValid()) {
          /* cspell:disable-next-line */
          this.form.values[this.id] = `${dateTimeValue.format(
            'YYYY-MM-DDTHH:mm:ss'
          )}.000Z`;
        } else {
          this.form.values[this.id] = null;
          this._value = this.value;
        }
        break;
      case FormFieldTypes.NUMBER:
        this.form.values[this.id] = parseInt(this.value, 10);
        break;
      case FormFieldTypes.AMOUNT:
        this.form.values[this.id] = this.enableFractions
          ? parseFloat(this.value)
          : parseInt(this.value, 10);
        break;
      case FormFieldTypes.BOOLEAN:
        this.form.values[this.id] =
          this.value !== null && this.value !== undefined ? this.value : false;
        break;
      case FormFieldTypes.PEOPLE:
        this.form.values[this.id] =
          this.value !== null && this.value !== undefined ? this.value : [];
        break;
      case FormFieldTypes.FUNCTIONAL_GROUP:
        this.form.values[this.id] =
          this.value !== null && this.value !== undefined ? this.value : [];
        break;
      default:
        if (
          !FormFieldTypes.isReadOnlyType(this.type) &&
          !this.isInvalidFieldType(this.type)
        ) {
          this.form.values[this.id] = this.value;
        }
    }
    this.form.onFormFieldChanged(this);
  }
  /**
   * Skip the invalid field type
   * @param {?} type
   * @return {?}
   */
  isInvalidFieldType(type) {
    if (type === 'container') {
      return true;
    } else {
      return false;
    }
  }
  /**
   * @return {?}
   */
  getOptionName() {
    /** @type {?} */
    const option = this.options.find(
      /**
       * @param {?} opt
       * @return {?}
       */
      (opt => opt.id === this.value)
    );
    return option ? option.name : null;
  }
  /**
   * @return {?}
   */
  hasOptions() {
    return this.options && this.options.length > 0;
  }
  /**
   * @private
   * @param {?} json
   * @return {?}
   */
  isDateField(json) {
    return (
      (json.params &&
        json.params.field &&
        json.params.field.type === FormFieldTypes.DATE) ||
      json.type === FormFieldTypes.DATE
    );
  }
  /**
   * @private
   * @param {?} json
   * @return {?}
   */
  isDateTimeField(json) {
    return (
      (json.params &&
        json.params.field &&
        json.params.field.type === FormFieldTypes.DATETIME) ||
      json.type === FormFieldTypes.DATETIME
    );
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  FormFieldModel.prototype._value;
  /**
   * @type {?}
   * @private
   */
  FormFieldModel.prototype._readOnly;
  /**
   * @type {?}
   * @private
   */
  FormFieldModel.prototype._isValid;
  /**
   * @type {?}
   * @private
   */
  FormFieldModel.prototype._required;
  /** @type {?} */
  FormFieldModel.prototype.defaultDateFormat;
  /** @type {?} */
  FormFieldModel.prototype.defaultDateTimeFormat;
  /** @type {?} */
  FormFieldModel.prototype.fieldType;
  /** @type {?} */
  FormFieldModel.prototype.id;
  /** @type {?} */
  FormFieldModel.prototype.name;
  /** @type {?} */
  FormFieldModel.prototype.type;
  /** @type {?} */
  FormFieldModel.prototype.overrideId;
  /** @type {?} */
  FormFieldModel.prototype.tab;
  /** @type {?} */
  FormFieldModel.prototype.rowspan;
  /** @type {?} */
  FormFieldModel.prototype.colspan;
  /** @type {?} */
  FormFieldModel.prototype.placeholder;
  /** @type {?} */
  FormFieldModel.prototype.minLength;
  /** @type {?} */
  FormFieldModel.prototype.maxLength;
  /** @type {?} */
  FormFieldModel.prototype.minValue;
  /** @type {?} */
  FormFieldModel.prototype.maxValue;
  /** @type {?} */
  FormFieldModel.prototype.regexPattern;
  /** @type {?} */
  FormFieldModel.prototype.options;
  /** @type {?} */
  FormFieldModel.prototype.restUrl;
  /** @type {?} */
  FormFieldModel.prototype.roles;
  /** @type {?} */
  FormFieldModel.prototype.restResponsePath;
  /** @type {?} */
  FormFieldModel.prototype.restIdProperty;
  /** @type {?} */
  FormFieldModel.prototype.restLabelProperty;
  /** @type {?} */
  FormFieldModel.prototype.hasEmptyValue;
  /** @type {?} */
  FormFieldModel.prototype.className;
  /** @type {?} */
  FormFieldModel.prototype.optionType;
  /** @type {?} */
  FormFieldModel.prototype.params;
  /** @type {?} */
  FormFieldModel.prototype.hyperlinkUrl;
  /** @type {?} */
  FormFieldModel.prototype.displayText;
  /** @type {?} */
  FormFieldModel.prototype.isVisible;
  /** @type {?} */
  FormFieldModel.prototype.visibilityCondition;
  /** @type {?} */
  FormFieldModel.prototype.enableFractions;
  /** @type {?} */
  FormFieldModel.prototype.currency;
  /** @type {?} */
  FormFieldModel.prototype.dateDisplayFormat;
  /** @type {?} */
  FormFieldModel.prototype.numberOfColumns;
  /** @type {?} */
  FormFieldModel.prototype.fields;
  /** @type {?} */
  FormFieldModel.prototype.columns;
  /** @type {?} */
  FormFieldModel.prototype.emptyOption;
  /** @type {?} */
  FormFieldModel.prototype.validationSummary;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImZvcm0vY29tcG9uZW50cy93aWRnZXRzL2NvcmUvZm9ybS1maWVsZC5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkEsT0FBTyxNQUFNLE1BQU0sWUFBWSxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRzFELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM5RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7O0FBSXRELE1BQU0sT0FBTyxjQUFlLFNBQVEsZUFBZTs7Ozs7SUEwRy9DLFlBQVksSUFBZSxFQUFFLElBQVU7UUFDbkMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQXhHZCxjQUFTLEdBQVksS0FBSyxDQUFDO1FBQzNCLGFBQVEsR0FBWSxJQUFJLENBQUM7UUFDekIsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUUxQixzQkFBaUIsR0FBVyxVQUFVLENBQUM7UUFDdkMsMEJBQXFCLEdBQVcsa0JBQWtCLENBQUM7UUFTNUQsWUFBTyxHQUFXLENBQUMsQ0FBQztRQUNwQixZQUFPLEdBQVcsQ0FBQyxDQUFDO1FBQ3BCLGdCQUFXLEdBQVcsSUFBSSxDQUFDO1FBQzNCLGNBQVMsR0FBVyxDQUFDLENBQUM7UUFDdEIsY0FBUyxHQUFXLENBQUMsQ0FBQztRQUl0QixZQUFPLEdBQXNCLEVBQUUsQ0FBQztRQVNoQyxXQUFNLEdBQXNC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Q2hELCtDQUE0RDs7SUFHNUQsbUNBQWtCOztJQUNsQiw0QkFBVzs7SUFDWCw4QkFBYTs7SUFDYiw4QkFBYTs7SUFDYixvQ0FBb0I7O0lBQ3BCLDZCQUFZOztJQUNaLGlDQUFvQjs7SUFDcEIsaUNBQW9COztJQUNwQixxQ0FBMkI7O0lBQzNCLG1DQUFzQjs7SUFDdEIsbUNBQXNCOztJQUN0QixrQ0FBaUI7O0lBQ2pCLGtDQUFpQjs7SUFDakIsc0NBQXFCOztJQUNyQixpQ0FBZ0M7O0lBQ2hDLGlDQUFnQjs7SUFDaEIsK0JBQWdCOztJQUNoQiwwQ0FBeUI7O0lBQ3pCLHdDQUF1Qjs7SUFDdkIsMkNBQTBCOztJQUMxQix1Q0FBdUI7O0lBQ3ZCLG1DQUFrQjs7SUFDbEIsb0NBQW1COztJQUNuQixnQ0FBK0I7O0lBQy9CLHNDQUFxQjs7SUFDckIscUNBQW9COztJQUNwQixtQ0FBMEI7O0lBQzFCLDZDQUFrRDs7SUFDbEQseUNBQWlDOztJQUNqQyxrQ0FBd0I7O0lBQ3hCLDJDQUFtRDs7SUFHbkQseUNBQTRCOztJQUM1QixnQ0FBOEI7O0lBQzlCLGlDQUFxQzs7SUFHckMscUNBQTZCOztJQUM3QiwyQ0FBcUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTpjb21wb25lbnQtc2VsZWN0b3IgICovXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudC1lczYnO1xuaW1wb3J0IHsgV2lkZ2V0VmlzaWJpbGl0eU1vZGVsIH0gZnJvbSAnLi4vLi4vLi4vbW9kZWxzL3dpZGdldC12aXNpYmlsaXR5Lm1vZGVsJztcbmltcG9ydCB7IENvbnRhaW5lckNvbHVtbk1vZGVsIH0gZnJvbSAnLi9jb250YWluZXItY29sdW1uLm1vZGVsJztcbmltcG9ydCB7IEVycm9yTWVzc2FnZU1vZGVsIH0gZnJvbSAnLi9lcnJvci1tZXNzYWdlLm1vZGVsJztcbmltcG9ydCB7IEZvcm1GaWVsZE1ldGFkYXRhIH0gZnJvbSAnLi9mb3JtLWZpZWxkLW1ldGFkYXRhJztcbmltcG9ydCB7IEZvcm1GaWVsZE9wdGlvbiB9IGZyb20gJy4vZm9ybS1maWVsZC1vcHRpb24nO1xuaW1wb3J0IHsgRm9ybUZpZWxkVHlwZXMgfSBmcm9tICcuL2Zvcm0tZmllbGQtdHlwZXMnO1xuaW1wb3J0IHsgTnVtYmVyRmllbGRWYWxpZGF0b3IgfSBmcm9tICcuL2Zvcm0tZmllbGQtdmFsaWRhdG9yJztcbmltcG9ydCB7IEZvcm1XaWRnZXRNb2RlbCB9IGZyb20gJy4vZm9ybS13aWRnZXQubW9kZWwnO1xuaW1wb3J0IHsgRm9ybU1vZGVsIH0gZnJvbSAnLi9mb3JtLm1vZGVsJztcblxuLy8gTWFwcyB0byBGb3JtRmllbGRSZXByZXNlbnRhdGlvblxuZXhwb3J0IGNsYXNzIEZvcm1GaWVsZE1vZGVsIGV4dGVuZHMgRm9ybVdpZGdldE1vZGVsIHtcblxuICAgIHByaXZhdGUgX3ZhbHVlOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfcmVhZE9ubHk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIF9pc1ZhbGlkOiBib29sZWFuID0gdHJ1ZTtcbiAgICBwcml2YXRlIF9yZXF1aXJlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcmVhZG9ubHkgZGVmYXVsdERhdGVGb3JtYXQ6IHN0cmluZyA9ICdELU0tWVlZWSc7XG4gICAgcmVhZG9ubHkgZGVmYXVsdERhdGVUaW1lRm9ybWF0OiBzdHJpbmcgPSAnRC1NLVlZWVkgaGg6bW0gQSc7XG5cbiAgICAvLyBtb2RlbCBtZW1iZXJzXG4gICAgZmllbGRUeXBlOiBzdHJpbmc7XG4gICAgaWQ6IHN0cmluZztcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIG92ZXJyaWRlSWQ6IGJvb2xlYW47XG4gICAgdGFiOiBzdHJpbmc7XG4gICAgcm93c3BhbjogbnVtYmVyID0gMTtcbiAgICBjb2xzcGFuOiBudW1iZXIgPSAxO1xuICAgIHBsYWNlaG9sZGVyOiBzdHJpbmcgPSBudWxsO1xuICAgIG1pbkxlbmd0aDogbnVtYmVyID0gMDtcbiAgICBtYXhMZW5ndGg6IG51bWJlciA9IDA7XG4gICAgbWluVmFsdWU6IHN0cmluZztcbiAgICBtYXhWYWx1ZTogc3RyaW5nO1xuICAgIHJlZ2V4UGF0dGVybjogc3RyaW5nO1xuICAgIG9wdGlvbnM6IEZvcm1GaWVsZE9wdGlvbltdID0gW107XG4gICAgcmVzdFVybDogc3RyaW5nO1xuICAgIHJvbGVzOiBzdHJpbmdbXTtcbiAgICByZXN0UmVzcG9uc2VQYXRoOiBzdHJpbmc7XG4gICAgcmVzdElkUHJvcGVydHk6IHN0cmluZztcbiAgICByZXN0TGFiZWxQcm9wZXJ0eTogc3RyaW5nO1xuICAgIGhhc0VtcHR5VmFsdWU6IGJvb2xlYW47XG4gICAgY2xhc3NOYW1lOiBzdHJpbmc7XG4gICAgb3B0aW9uVHlwZTogc3RyaW5nO1xuICAgIHBhcmFtczogRm9ybUZpZWxkTWV0YWRhdGEgPSB7fTtcbiAgICBoeXBlcmxpbmtVcmw6IHN0cmluZztcbiAgICBkaXNwbGF5VGV4dDogc3RyaW5nO1xuICAgIGlzVmlzaWJsZTogYm9vbGVhbiA9IHRydWU7XG4gICAgdmlzaWJpbGl0eUNvbmRpdGlvbjogV2lkZ2V0VmlzaWJpbGl0eU1vZGVsID0gbnVsbDtcbiAgICBlbmFibGVGcmFjdGlvbnM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBjdXJyZW5jeTogc3RyaW5nID0gbnVsbDtcbiAgICBkYXRlRGlzcGxheUZvcm1hdDogc3RyaW5nID0gdGhpcy5kZWZhdWx0RGF0ZUZvcm1hdDtcblxuICAgIC8vIGNvbnRhaW5lciBtb2RlbCBtZW1iZXJzXG4gICAgbnVtYmVyT2ZDb2x1bW5zOiBudW1iZXIgPSAxO1xuICAgIGZpZWxkczogRm9ybUZpZWxkTW9kZWxbXSA9IFtdO1xuICAgIGNvbHVtbnM6IENvbnRhaW5lckNvbHVtbk1vZGVsW10gPSBbXTtcblxuICAgIC8vIHV0aWwgbWVtYmVyc1xuICAgIGVtcHR5T3B0aW9uOiBGb3JtRmllbGRPcHRpb247XG4gICAgdmFsaWRhdGlvblN1bW1hcnk6IEVycm9yTWVzc2FnZU1vZGVsO1xuXG4gICAgZ2V0IHZhbHVlKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG5cbiAgICBzZXQgdmFsdWUodjogYW55KSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdjtcbiAgICAgICAgdGhpcy51cGRhdGVGb3JtKCk7XG4gICAgfVxuXG4gICAgZ2V0IHJlYWRPbmx5KCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy5mb3JtICYmIHRoaXMuZm9ybS5yZWFkT25seSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWRPbmx5O1xuICAgIH1cblxuICAgIHNldCByZWFkT25seShyZWFkT25seTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9yZWFkT25seSA9IHJlYWRPbmx5O1xuICAgICAgICB0aGlzLnVwZGF0ZUZvcm0oKTtcbiAgICB9XG5cbiAgICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yZXF1aXJlZDtcbiAgICB9XG5cbiAgICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fcmVxdWlyZWQgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVGb3JtKCk7XG4gICAgfVxuXG4gICAgZ2V0IGlzVmFsaWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1ZhbGlkO1xuICAgIH1cblxuICAgIG1hcmtBc0ludmFsaWQoKSB7XG4gICAgICAgIHRoaXMuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZSgpOiBib29sZWFuIHtcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uU3VtbWFyeSA9IG5ldyBFcnJvck1lc3NhZ2VNb2RlbCgpO1xuXG4gICAgICAgIGlmICghdGhpcy5yZWFkT25seSkge1xuICAgICAgICAgICAgY29uc3QgdmFsaWRhdG9ycyA9IHRoaXMuZm9ybS5maWVsZFZhbGlkYXRvcnMgfHwgW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHZhbGlkYXRvciBvZiB2YWxpZGF0b3JzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF2YWxpZGF0b3IudmFsaWRhdGUodGhpcykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faXNWYWxpZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faXNWYWxpZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1ZhbGlkO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGZvcm06IEZvcm1Nb2RlbCwganNvbj86IGFueSkge1xuICAgICAgICBzdXBlcihmb3JtLCBqc29uKTtcbiAgICAgICAgaWYgKGpzb24pIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGRUeXBlID0ganNvbi5maWVsZFR5cGU7XG4gICAgICAgICAgICB0aGlzLmlkID0ganNvbi5pZDtcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IGpzb24ubmFtZTtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IGpzb24udHlwZTtcbiAgICAgICAgICAgIHRoaXMucm9sZXMgPSBqc29uLnJvbGVzO1xuICAgICAgICAgICAgdGhpcy5fcmVxdWlyZWQgPSA8Ym9vbGVhbj4ganNvbi5yZXF1aXJlZDtcbiAgICAgICAgICAgIHRoaXMuX3JlYWRPbmx5ID0gPGJvb2xlYW4+IGpzb24ucmVhZE9ubHkgfHwganNvbi50eXBlID09PSAncmVhZG9ubHknO1xuICAgICAgICAgICAgdGhpcy5vdmVycmlkZUlkID0gPGJvb2xlYW4+IGpzb24ub3ZlcnJpZGVJZDtcbiAgICAgICAgICAgIHRoaXMudGFiID0ganNvbi50YWI7XG4gICAgICAgICAgICB0aGlzLnJlc3RVcmwgPSBqc29uLnJlc3RVcmw7XG4gICAgICAgICAgICB0aGlzLnJlc3RSZXNwb25zZVBhdGggPSBqc29uLnJlc3RSZXNwb25zZVBhdGg7XG4gICAgICAgICAgICB0aGlzLnJlc3RJZFByb3BlcnR5ID0ganNvbi5yZXN0SWRQcm9wZXJ0eTtcbiAgICAgICAgICAgIHRoaXMucmVzdExhYmVsUHJvcGVydHkgPSBqc29uLnJlc3RMYWJlbFByb3BlcnR5O1xuICAgICAgICAgICAgdGhpcy5jb2xzcGFuID0gPG51bWJlcj4ganNvbi5jb2xzcGFuO1xuICAgICAgICAgICAgdGhpcy5taW5MZW5ndGggPSA8bnVtYmVyPiBqc29uLm1pbkxlbmd0aCB8fCAwO1xuICAgICAgICAgICAgdGhpcy5tYXhMZW5ndGggPSA8bnVtYmVyPiBqc29uLm1heExlbmd0aCB8fCAwO1xuICAgICAgICAgICAgdGhpcy5taW5WYWx1ZSA9IGpzb24ubWluVmFsdWU7XG4gICAgICAgICAgICB0aGlzLm1heFZhbHVlID0ganNvbi5tYXhWYWx1ZTtcbiAgICAgICAgICAgIHRoaXMucmVnZXhQYXR0ZXJuID0ganNvbi5yZWdleFBhdHRlcm47XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSA8Rm9ybUZpZWxkT3B0aW9uW10+IGpzb24ub3B0aW9ucyB8fCBbXTtcbiAgICAgICAgICAgIHRoaXMuaGFzRW1wdHlWYWx1ZSA9IDxib29sZWFuPiBqc29uLmhhc0VtcHR5VmFsdWU7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IGpzb24uY2xhc3NOYW1lO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25UeXBlID0ganNvbi5vcHRpb25UeXBlO1xuICAgICAgICAgICAgdGhpcy5wYXJhbXMgPSA8Rm9ybUZpZWxkTWV0YWRhdGE+IGpzb24ucGFyYW1zIHx8IHt9O1xuICAgICAgICAgICAgdGhpcy5oeXBlcmxpbmtVcmwgPSBqc29uLmh5cGVybGlua1VybDtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheVRleHQgPSBqc29uLmRpc3BsYXlUZXh0O1xuICAgICAgICAgICAgdGhpcy52aXNpYmlsaXR5Q29uZGl0aW9uID0ganNvbi52aXNpYmlsaXR5Q29uZGl0aW9uID8gbmV3IFdpZGdldFZpc2liaWxpdHlNb2RlbChqc29uLnZpc2liaWxpdHlDb25kaXRpb24pIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5lbmFibGVGcmFjdGlvbnMgPSA8Ym9vbGVhbj4ganNvbi5lbmFibGVGcmFjdGlvbnM7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbmN5ID0ganNvbi5jdXJyZW5jeTtcbiAgICAgICAgICAgIHRoaXMuZGF0ZURpc3BsYXlGb3JtYXQgPSBqc29uLmRhdGVEaXNwbGF5Rm9ybWF0IHx8IHRoaXMuZ2V0RGVmYXVsdERhdGVGb3JtYXQoanNvbik7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHRoaXMucGFyc2VWYWx1ZShqc29uKTtcbiAgICAgICAgICAgIHRoaXMudmFsaWRhdGlvblN1bW1hcnkgPSBuZXcgRXJyb3JNZXNzYWdlTW9kZWwoKTtcblxuICAgICAgICAgICAgaWYgKGpzb24ucGxhY2Vob2xkZXIgJiYganNvbi5wbGFjZWhvbGRlciAhPT0gJycgJiYganNvbi5wbGFjZWhvbGRlciAhPT0gJ251bGwnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGFjZWhvbGRlciA9IGpzb24ucGxhY2Vob2xkZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChGb3JtRmllbGRUeXBlcy5pc1JlYWRPbmx5VHlwZSh0aGlzLnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyYW1zICYmIHRoaXMucGFyYW1zLmZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZUZvdW5kID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvcm0ucHJvY2Vzc1ZhcmlhYmxlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvY2Vzc1ZhcmlhYmxlID0gdGhpcy5nZXRQcm9jZXNzVmFyaWFibGVWYWx1ZSh0aGlzLnBhcmFtcy5maWVsZCwgZm9ybSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9jZXNzVmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZUZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gcHJvY2Vzc1ZhcmlhYmxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWx1ZUZvdW5kICYmIHRoaXMucGFyYW1zLnJlc3BvbnNlVmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IGZvcm0uZ2V0Rm9ybVZhcmlhYmxlVmFsdWUodGhpcy5wYXJhbXMuZmllbGQubmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZUZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gZGVmYXVsdFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoRm9ybUZpZWxkVHlwZXMuaXNDb250YWluZXJUeXBlKHRoaXMudHlwZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lckZhY3RvcnkoanNvbiwgZm9ybSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5oYXNFbXB0eVZhbHVlICYmIHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5lbXB0eU9wdGlvbiA9IHRoaXMub3B0aW9uc1swXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlRm9ybSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RGVmYXVsdERhdGVGb3JtYXQoanNvbkZpZWxkOiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBsZXQgb3JpZ2luYWxUeXBlID0ganNvbkZpZWxkLnR5cGU7XG4gICAgICAgIGlmIChGb3JtRmllbGRUeXBlcy5pc1JlYWRPbmx5VHlwZShqc29uRmllbGQudHlwZSkgJiZcbiAgICAgICAgICAgIGpzb25GaWVsZC5wYXJhbXMgJiZcbiAgICAgICAgICAgIGpzb25GaWVsZC5wYXJhbXMuZmllbGQpIHtcbiAgICAgICAgICAgIG9yaWdpbmFsVHlwZSA9IGpzb25GaWVsZC5wYXJhbXMuZmllbGQudHlwZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3JpZ2luYWxUeXBlID09PSBGb3JtRmllbGRUeXBlcy5EQVRFVElNRSA/IHRoaXMuZGVmYXVsdERhdGVUaW1lRm9ybWF0IDogdGhpcy5kZWZhdWx0RGF0ZUZvcm1hdDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzVHlwZWFoZWFkRmllbGRUeXBlKHR5cGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdHlwZSA9PT0gJ3R5cGVhaGVhZCcgPyB0cnVlIDogZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRGaWVsZE5hbWVXaXRoTGFiZWwobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIG5hbWUgKz0gJ19MQUJFTCc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRQcm9jZXNzVmFyaWFibGVWYWx1ZShmaWVsZDogYW55LCBmb3JtOiBGb3JtTW9kZWwpOiBhbnkge1xuICAgICAgICBsZXQgZmllbGROYW1lID0gZmllbGQubmFtZTtcbiAgICAgICAgaWYgKHRoaXMuaXNUeXBlYWhlYWRGaWVsZFR5cGUoZmllbGQudHlwZSkpIHtcbiAgICAgICAgICAgIGZpZWxkTmFtZSA9IHRoaXMuZ2V0RmllbGROYW1lV2l0aExhYmVsKGZpZWxkLmlkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZm9ybS5nZXRQcm9jZXNzVmFyaWFibGVWYWx1ZShmaWVsZE5hbWUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29udGFpbmVyRmFjdG9yeShqc29uOiBhbnksIGZvcm06IEZvcm1Nb2RlbCk6IHZvaWQge1xuICAgICAgICB0aGlzLm51bWJlck9mQ29sdW1ucyA9IDxudW1iZXI+IGpzb24ubnVtYmVyT2ZDb2x1bW5zIHx8IDE7XG5cbiAgICAgICAgdGhpcy5maWVsZHMgPSBqc29uLmZpZWxkcztcblxuICAgICAgICB0aGlzLnJvd3NwYW4gPSAxO1xuICAgICAgICB0aGlzLmNvbHNwYW4gPSAxO1xuXG4gICAgICAgIGlmIChqc29uLmZpZWxkcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjdXJyZW50RmllbGQgaW4ganNvbi5maWVsZHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoanNvbi5maWVsZHMuaGFzT3duUHJvcGVydHkoY3VycmVudEZpZWxkKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2wgPSBuZXcgQ29udGFpbmVyQ29sdW1uTW9kZWwoKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWVsZHM6IEZvcm1GaWVsZE1vZGVsW10gPSAoanNvbi5maWVsZHNbY3VycmVudEZpZWxkXSB8fCBbXSkubWFwKChmaWVsZCkgPT4gbmV3IEZvcm1GaWVsZE1vZGVsKGZvcm0sIGZpZWxkKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbC5maWVsZHMgPSBmaWVsZHM7XG4gICAgICAgICAgICAgICAgICAgIGNvbC5yb3dzcGFuID0ganNvbi5maWVsZHNbY3VycmVudEZpZWxkXS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgY29sLmZpZWxkcy5mb3JFYWNoKChjb2xGaWVsZHM6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xzcGFuID0gY29sRmllbGRzLmNvbHNwYW4gPiB0aGlzLmNvbHNwYW4gPyBjb2xGaWVsZHMuY29sc3BhbiA6IHRoaXMuY29sc3BhbjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3dzcGFuID0gdGhpcy5yb3dzcGFuIDwgY29sLnJvd3NwYW4gPyBjb2wucm93c3BhbiA6IHRoaXMucm93c3BhbjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2x1bW5zLnB1c2goY29sKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZVZhbHVlKGpzb246IGFueSk6IGFueSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGpzb24uaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykgPyBqc29uLnZhbHVlIDogbnVsbDtcblxuICAgICAgICAvKlxuICAgICAgICAgVGhpcyBpcyBuZWVkZWQgZHVlIHRvIEFjdGl2aXRpIGlzc3VlIHJlbGF0ZWQgdG8gcmVhZGluZyBkcm9wZG93biB2YWx1ZXMgYXMgdmFsdWUgc3RyaW5nXG4gICAgICAgICBidXQgc2F2aW5nIGJhY2sgYXMgb2JqZWN0OiB7IGlkOiA8aWQ+LCBuYW1lOiA8bmFtZT4gfVxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKGpzb24udHlwZSA9PT0gRm9ybUZpZWxkVHlwZXMuRFJPUERPV04pIHtcbiAgICAgICAgICAgIGlmIChqc29uLmhhc0VtcHR5VmFsdWUgJiYganNvbi5vcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IDxGb3JtRmllbGRPcHRpb25bXT4ganNvbi5vcHRpb25zIHx8IFtdO1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW1wdHlPcHRpb24gPSBqc29uLm9wdGlvbnNbMF07XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09IGVtcHR5T3B0aW9uLmlkIHx8IHZhbHVlID09PSBlbXB0eU9wdGlvbi5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGVtcHR5T3B0aW9uLmlkO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLmlkICYmIHZhbHVlLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuaWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICAgVGhpcyBpcyBuZWVkZWQgZHVlIHRvIEFjdGl2aXRpIGlzc3VlIHJlbGF0ZWQgdG8gcmVhZGluZyByYWRpbyBidXR0b24gdmFsdWVzIGFzIHZhbHVlIHN0cmluZ1xuICAgICAgICAgYnV0IHNhdmluZyBiYWNrIGFzIG9iamVjdDogeyBpZDogPGlkPiwgbmFtZTogPG5hbWU+IH1cbiAgICAgICAgICovXG4gICAgICAgIGlmIChqc29uLnR5cGUgPT09IEZvcm1GaWVsZFR5cGVzLlJBRElPX0JVVFRPTlMpIHtcbiAgICAgICAgICAgIC8vIEFjdGl2aXRpIGhhcyBhIGJ1ZyB3aXRoIGRlZmF1bHQgcmFkaW8gYnV0dG9uIHZhbHVlIHdoZXJlIGluaXRpYWwgc2VsZWN0aW9uIHBhc3NlZCBhcyBgbmFtZWAgdmFsdWVcbiAgICAgICAgICAgIC8vIHNvIHRyeSByZXNvbHZpbmcgY3VycmVudCBvbmUgd2l0aCBhIGZhbGxiYWNrIHRvIGZpcnN0IGVudHJ5IHZpYSBuYW1lIG9yIGlkXG4gICAgICAgICAgICAvLyBUT0RPOiBuZWVkcyB0byBiZSByZXBvcnRlZCBhbmQgZml4ZWQgYXQgQWN0aXZpdGkgc2lkZVxuICAgICAgICAgICAgY29uc3QgZW50cnk6IEZvcm1GaWVsZE9wdGlvbltdID0gdGhpcy5vcHRpb25zLmZpbHRlcigob3B0KSA9PlxuICAgICAgICAgICAgICAgIG9wdC5pZCA9PT0gdmFsdWUgfHwgb3B0Lm5hbWUgPT09IHZhbHVlIHx8ICh2YWx1ZSAmJiAob3B0LmlkID09PSB2YWx1ZS5pZCB8fCBvcHQubmFtZSA9PT0gdmFsdWUubmFtZSkpKTtcbiAgICAgICAgICAgIGlmIChlbnRyeS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBlbnRyeVswXS5pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICBUaGlzIGlzIG5lZWRlZCBkdWUgdG8gQWN0aXZpdGkgZGlzcGxheWluZy9lZGl0aW5nIGRhdGVzIGluIGQtTS1ZWVlZIGZvcm1hdFxuICAgICAgICAgYnV0IHN0b3Jpbmcgb24gc2VydmVyIGluIElTTzg2MDEgZm9ybWF0IChpLmUuIDIwMTMtMDItMDRUMjI6NDQ6MzAuNjUyWilcbiAgICAgICAgICovXG4gICAgICAgIGlmICh0aGlzLmlzRGF0ZUZpZWxkKGpzb24pIHx8IHRoaXMuaXNEYXRlVGltZUZpZWxkKGpzb24pKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBsZXQgZGF0ZVZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChOdW1iZXJGaWVsZFZhbGlkYXRvci5pc051bWJlcih2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0ZVZhbHVlID0gbW9tZW50KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRlVmFsdWUgPSB0aGlzLmlzRGF0ZVRpbWVGaWVsZChqc29uKSA/IG1vbWVudCh2YWx1ZSwgJ1lZWVktTU0tREQgaGg6bW0gQScpIDogbW9tZW50KHZhbHVlLnNwbGl0KCdUJylbMF0sICdZWVlZLU0tRCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZGF0ZVZhbHVlICYmIGRhdGVWYWx1ZS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBkYXRlVmFsdWUuZm9ybWF0KHRoaXMuZGF0ZURpc3BsYXlGb3JtYXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICB1cGRhdGVGb3JtKCkge1xuICAgICAgICBpZiAoIXRoaXMuZm9ybSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgRm9ybUZpZWxkVHlwZXMuRFJPUERPV046XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgVGhpcyBpcyBuZWVkZWQgZHVlIHRvIEFjdGl2aXRpIHJlYWRpbmcgZHJvcGRvd24gdmFsdWVzIGFzIHN0cmluZ1xuICAgICAgICAgICAgICAgICBidXQgc2F2aW5nIGJhY2sgYXMgb2JqZWN0OiB7IGlkOiA8aWQ+LCBuYW1lOiA8bmFtZT4gfVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlID09PSAnZW1wdHknIHx8IHRoaXMudmFsdWUgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9ybS52YWx1ZXNbdGhpcy5pZF0gPSB7fTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbnRyeTogRm9ybUZpZWxkT3B0aW9uW10gPSB0aGlzLm9wdGlvbnMuZmlsdGVyKChvcHQpID0+IG9wdC5pZCA9PT0gdGhpcy52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbnRyeS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcm0udmFsdWVzW3RoaXMuaWRdID0gZW50cnlbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEZvcm1GaWVsZFR5cGVzLlJBRElPX0JVVFRPTlM6XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgVGhpcyBpcyBuZWVkZWQgZHVlIHRvIEFjdGl2aXRpIGlzc3VlIHJlbGF0ZWQgdG8gcmVhZGluZyByYWRpbyBidXR0b24gdmFsdWVzIGFzIHZhbHVlIHN0cmluZ1xuICAgICAgICAgICAgICAgICBidXQgc2F2aW5nIGJhY2sgYXMgb2JqZWN0OiB7IGlkOiA8aWQ+LCBuYW1lOiA8bmFtZT4gfVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhZGlvQnV0dG9uOiBGb3JtRmllbGRPcHRpb25bXSA9IHRoaXMub3B0aW9ucy5maWx0ZXIoKG9wdCkgPT4gb3B0LmlkID09PSB0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAocmFkaW9CdXR0b24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcm0udmFsdWVzW3RoaXMuaWRdID0gcmFkaW9CdXR0b25bMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBGb3JtRmllbGRUeXBlcy5VUExPQUQ6XG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtLmhhc1VwbG9hZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgJiYgdGhpcy52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9ybS52YWx1ZXNbdGhpcy5pZF0gPSBBcnJheS5pc0FycmF5KHRoaXMudmFsdWUpID8gdGhpcy52YWx1ZS5tYXAoKGVsZW0pID0+IGVsZW0uaWQpLmpvaW4oJywnKSA6IFt0aGlzLnZhbHVlXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcm0udmFsdWVzW3RoaXMuaWRdID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEZvcm1GaWVsZFR5cGVzLlRZUEVBSEVBRDpcbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlQWhlYWRFbnRyeTogRm9ybUZpZWxkT3B0aW9uW10gPSB0aGlzLm9wdGlvbnMuZmlsdGVyKChvcHQpID0+IG9wdC5pZCA9PT0gdGhpcy52YWx1ZSB8fCBvcHQubmFtZSA9PT0gdGhpcy52YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVBaGVhZEVudHJ5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JtLnZhbHVlc1t0aGlzLmlkXSA9IHR5cGVBaGVhZEVudHJ5WzBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JtLnZhbHVlc1t0aGlzLmlkXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBGb3JtRmllbGRUeXBlcy5EQVRFOlxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVWYWx1ZSA9IG1vbWVudCh0aGlzLnZhbHVlLCB0aGlzLmRhdGVEaXNwbGF5Rm9ybWF0LCB0cnVlKTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0ZVZhbHVlICYmIGRhdGVWYWx1ZS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JtLnZhbHVlc1t0aGlzLmlkXSA9IGAke2RhdGVWYWx1ZS5mb3JtYXQoJ1lZWVktTU0tREQnKX1UMDA6MDA6MDAuMDAwWmA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mb3JtLnZhbHVlc1t0aGlzLmlkXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEZvcm1GaWVsZFR5cGVzLkRBVEVUSU1FOlxuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVUaW1lVmFsdWUgPSBtb21lbnQodGhpcy52YWx1ZSwgdGhpcy5kYXRlRGlzcGxheUZvcm1hdCwgdHJ1ZSkudXRjKCk7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGVUaW1lVmFsdWUgJiYgZGF0ZVRpbWVWYWx1ZS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogY3NwZWxsOmRpc2FibGUtbmV4dC1saW5lICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9ybS52YWx1ZXNbdGhpcy5pZF0gPSBgJHtkYXRlVGltZVZhbHVlLmZvcm1hdCgnWVlZWS1NTS1ERFRISDptbTpzcycpfS4wMDBaYDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcm0udmFsdWVzW3RoaXMuaWRdID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgRm9ybUZpZWxkVHlwZXMuTlVNQkVSOlxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybS52YWx1ZXNbdGhpcy5pZF0gPSBwYXJzZUludCh0aGlzLnZhbHVlLCAxMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEZvcm1GaWVsZFR5cGVzLkFNT1VOVDpcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm0udmFsdWVzW3RoaXMuaWRdID0gdGhpcy5lbmFibGVGcmFjdGlvbnMgPyBwYXJzZUZsb2F0KHRoaXMudmFsdWUpIDogcGFyc2VJbnQodGhpcy52YWx1ZSwgMTApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBGb3JtRmllbGRUeXBlcy5CT09MRUFOOlxuICAgICAgICAgICAgICAgIHRoaXMuZm9ybS52YWx1ZXNbdGhpcy5pZF0gPSAodGhpcy52YWx1ZSAhPT0gbnVsbCAmJiB0aGlzLnZhbHVlICE9PSB1bmRlZmluZWQpID8gdGhpcy52YWx1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBGb3JtRmllbGRUeXBlcy5QRU9QTEU6XG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtLnZhbHVlc1t0aGlzLmlkXSA9ICh0aGlzLnZhbHVlICE9PSBudWxsICYmIHRoaXMudmFsdWUgIT09IHVuZGVmaW5lZCkgPyB0aGlzLnZhbHVlIDogW107XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEZvcm1GaWVsZFR5cGVzLkZVTkNUSU9OQUxfR1JPVVA6XG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtLnZhbHVlc1t0aGlzLmlkXSA9ICh0aGlzLnZhbHVlICE9PSBudWxsICYmIHRoaXMudmFsdWUgIT09IHVuZGVmaW5lZCkgPyB0aGlzLnZhbHVlIDogW107XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGlmICghRm9ybUZpZWxkVHlwZXMuaXNSZWFkT25seVR5cGUodGhpcy50eXBlKSAmJiAhdGhpcy5pc0ludmFsaWRGaWVsZFR5cGUodGhpcy50eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZvcm0udmFsdWVzW3RoaXMuaWRdID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZvcm0ub25Gb3JtRmllbGRDaGFuZ2VkKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNraXAgdGhlIGludmFsaWQgZmllbGQgdHlwZVxuICAgICAqIEBwYXJhbSB0eXBlXG4gICAgICovXG4gICAgaXNJbnZhbGlkRmllbGRUeXBlKHR5cGU6IHN0cmluZykge1xuICAgICAgICBpZiAodHlwZSA9PT0gJ2NvbnRhaW5lcicpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0T3B0aW9uTmFtZSgpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBvcHRpb246IEZvcm1GaWVsZE9wdGlvbiA9IHRoaXMub3B0aW9ucy5maW5kKChvcHQpID0+IG9wdC5pZCA9PT0gdGhpcy52YWx1ZSk7XG4gICAgICAgIHJldHVybiBvcHRpb24gPyBvcHRpb24ubmFtZSA6IG51bGw7XG4gICAgfVxuXG4gICAgaGFzT3B0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzRGF0ZUZpZWxkKGpzb246IGFueSkge1xuICAgICAgICByZXR1cm4gKGpzb24ucGFyYW1zICYmXG4gICAgICAgICAgICBqc29uLnBhcmFtcy5maWVsZCAmJlxuICAgICAgICAgICAganNvbi5wYXJhbXMuZmllbGQudHlwZSA9PT0gRm9ybUZpZWxkVHlwZXMuREFURSkgfHxcbiAgICAgICAgICAgIGpzb24udHlwZSA9PT0gRm9ybUZpZWxkVHlwZXMuREFURTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzRGF0ZVRpbWVGaWVsZChqc29uOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChqc29uLnBhcmFtcyAmJlxuICAgICAgICAgICAganNvbi5wYXJhbXMuZmllbGQgJiZcbiAgICAgICAgICAgIGpzb24ucGFyYW1zLmZpZWxkLnR5cGUgPT09IEZvcm1GaWVsZFR5cGVzLkRBVEVUSU1FKSB8fFxuICAgICAgICAgICAganNvbi50eXBlID09PSBGb3JtRmllbGRUeXBlcy5EQVRFVElNRTtcbiAgICB9XG5cbn1cbiJdfQ==
