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
import { FormFieldTypes } from './form-field-types';
/**
 * @record
 */
export function FormFieldValidator() {}
if (false) {
  /**
   * @param {?} field
   * @return {?}
   */
  FormFieldValidator.prototype.isSupported = function(field) {};
  /**
   * @param {?} field
   * @return {?}
   */
  FormFieldValidator.prototype.validate = function(field) {};
}
export class RequiredFieldValidator {
  constructor() {
    this.supportedTypes = [
      FormFieldTypes.TEXT,
      FormFieldTypes.MULTILINE_TEXT,
      FormFieldTypes.NUMBER,
      FormFieldTypes.BOOLEAN,
      FormFieldTypes.TYPEAHEAD,
      FormFieldTypes.DROPDOWN,
      FormFieldTypes.PEOPLE,
      FormFieldTypes.FUNCTIONAL_GROUP,
      FormFieldTypes.RADIO_BUTTONS,
      FormFieldTypes.UPLOAD,
      FormFieldTypes.AMOUNT,
      FormFieldTypes.DYNAMIC_TABLE,
      FormFieldTypes.DATE,
      FormFieldTypes.DATETIME,
      FormFieldTypes.ATTACH_FOLDER
    ];
  }
  /**
   * @param {?} field
   * @return {?}
   */
  isSupported(field) {
    return (
      field && this.supportedTypes.indexOf(field.type) > -1 && field.required
    );
  }
  /**
   * @param {?} field
   * @return {?}
   */
  validate(field) {
    if (this.isSupported(field) && field.isVisible) {
      if (field.type === FormFieldTypes.DROPDOWN) {
        if (field.hasEmptyValue && field.emptyOption) {
          if (field.value === field.emptyOption.id) {
            return false;
          }
        }
      }
      if (field.type === FormFieldTypes.RADIO_BUTTONS) {
        /** @type {?} */
        const option = field.options.find(
          /**
           * @param {?} opt
           * @return {?}
           */
          (opt => opt.id === field.value)
        );
        return !!option;
      }
      if (field.type === FormFieldTypes.UPLOAD) {
        return field.value && field.value.length > 0;
      }
      if (field.type === FormFieldTypes.DYNAMIC_TABLE) {
        return (
          field.value && field.value instanceof Array && field.value.length > 0
        );
      }
      if (field.type === FormFieldTypes.BOOLEAN) {
        return field.value ? true : false;
      }
      if (
        field.value === null ||
        field.value === undefined ||
        field.value === ''
      ) {
        return false;
      }
    }
    return true;
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  RequiredFieldValidator.prototype.supportedTypes;
}
export class NumberFieldValidator {
  constructor() {
    this.supportedTypes = [FormFieldTypes.NUMBER, FormFieldTypes.AMOUNT];
  }
  /**
   * @param {?} value
   * @return {?}
   */
  static isNumber(value) {
    if (value === null || value === undefined || value === '') {
      return false;
    }
    return !isNaN(+value);
  }
  /**
   * @param {?} field
   * @return {?}
   */
  isSupported(field) {
    return field && this.supportedTypes.indexOf(field.type) > -1;
  }
  /**
   * @param {?} field
   * @return {?}
   */
  validate(field) {
    if (this.isSupported(field) && field.isVisible) {
      if (
        field.value === null ||
        field.value === undefined ||
        field.value === ''
      ) {
        return true;
      }
      /** @type {?} */
      const valueStr = '' + field.value;
      /** @type {?} */
      let pattern = new RegExp(/^-?\d+$/);
      if (field.enableFractions) {
        pattern = new RegExp(/^-?[0-9]+(\.[0-9]{1,2})?$/);
      }
      if (valueStr.match(pattern)) {
        return true;
      }
      field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_NUMBER';
      return false;
    }
    return true;
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  NumberFieldValidator.prototype.supportedTypes;
}
export class DateFieldValidator {
  constructor() {
    this.supportedTypes = [FormFieldTypes.DATE];
  }
  // Validates that the input string is a valid date formatted as <dateFormat> (default D-M-YYYY)
  /**
   * @param {?} inputDate
   * @param {?=} dateFormat
   * @return {?}
   */
  static isValidDate(inputDate, dateFormat = 'D-M-YYYY') {
    if (inputDate) {
      /** @type {?} */
      const d = moment(inputDate, dateFormat, true);
      return d.isValid();
    }
    return false;
  }
  /**
   * @param {?} field
   * @return {?}
   */
  isSupported(field) {
    return field && this.supportedTypes.indexOf(field.type) > -1;
  }
  /**
   * @param {?} field
   * @return {?}
   */
  validate(field) {
    if (this.isSupported(field) && field.value && field.isVisible) {
      if (
        DateFieldValidator.isValidDate(field.value, field.dateDisplayFormat)
      ) {
        return true;
      }
      field.validationSummary.message = field.dateDisplayFormat;
      return false;
    }
    return true;
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  DateFieldValidator.prototype.supportedTypes;
}
/**
 * @abstract
 */
export class BoundaryDateFieldValidator {
  constructor() {
    this.DATE_FORMAT_CLOUD = 'YYYY-MM-DD';
    this.DATE_FORMAT = 'DD-MM-YYYY';
    this.supportedTypes = [FormFieldTypes.DATE];
  }
  /**
   * @param {?} field
   * @return {?}
   */
  validate(field) {
    /** @type {?} */
    let isValid = true;
    if (this.isSupported(field) && field.value && field.isVisible) {
      /** @type {?} */
      const dateFormat = field.dateDisplayFormat;
      if (!DateFieldValidator.isValidDate(field.value, dateFormat)) {
        field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_DATE';
        isValid = false;
      } else {
        isValid = this.checkDate(field, dateFormat);
      }
    }
    return isValid;
  }
  /**
   * @param {?} date
   * @return {?}
   */
  extractDateFormat(date) {
    /** @type {?} */
    const brokenDownDate = date.split('-');
    return brokenDownDate[0].length === 4
      ? this.DATE_FORMAT_CLOUD
      : this.DATE_FORMAT;
  }
}
if (false) {
  /** @type {?} */
  BoundaryDateFieldValidator.prototype.DATE_FORMAT_CLOUD;
  /** @type {?} */
  BoundaryDateFieldValidator.prototype.DATE_FORMAT;
  /** @type {?} */
  BoundaryDateFieldValidator.prototype.supportedTypes;
  /**
   * @abstract
   * @param {?} field
   * @param {?} dateFormat
   * @return {?}
   */
  BoundaryDateFieldValidator.prototype.checkDate = function(
    field,
    dateFormat
  ) {};
  /**
   * @abstract
   * @param {?} field
   * @return {?}
   */
  BoundaryDateFieldValidator.prototype.isSupported = function(field) {};
}
export class MinDateFieldValidator extends BoundaryDateFieldValidator {
  /**
   * @param {?} field
   * @param {?} dateFormat
   * @return {?}
   */
  checkDate(field, dateFormat) {
    /** @type {?} */
    let isValid = true;
    // remove time and timezone info
    /** @type {?} */
    let fieldValueData;
    if (typeof field.value === 'string') {
      fieldValueData = moment(field.value.split('T')[0], dateFormat);
    } else {
      fieldValueData = field.value;
    }
    /** @type {?} */
    const minValueDateFormat = this.extractDateFormat(field.minValue);
    /** @type {?} */
    const min = moment(field.minValue, minValueDateFormat);
    if (fieldValueData.isBefore(min)) {
      field.validationSummary.message = `FORM.FIELD.VALIDATOR.NOT_LESS_THAN`;
      field.validationSummary.attributes.set(
        'minValue',
        min.format(field.dateDisplayFormat).toLocaleUpperCase()
      );
      isValid = false;
    }
    return isValid;
  }
  /**
   * @param {?} field
   * @return {?}
   */
  isSupported(field) {
    return (
      field && this.supportedTypes.indexOf(field.type) > -1 && !!field.minValue
    );
  }
}
export class MaxDateFieldValidator extends BoundaryDateFieldValidator {
  /**
   * @param {?} field
   * @param {?} dateFormat
   * @return {?}
   */
  checkDate(field, dateFormat) {
    /** @type {?} */
    let isValid = true;
    // remove time and timezone info
    /** @type {?} */
    let fieldValueData;
    if (typeof field.value === 'string') {
      fieldValueData = moment(field.value.split('T')[0], dateFormat);
    } else {
      fieldValueData = field.value;
    }
    /** @type {?} */
    const maxValueDateFormat = this.extractDateFormat(field.maxValue);
    /** @type {?} */
    const max = moment(field.maxValue, maxValueDateFormat);
    if (fieldValueData.isAfter(max)) {
      field.validationSummary.message = `FORM.FIELD.VALIDATOR.NOT_GREATER_THAN`;
      field.validationSummary.attributes.set(
        'maxValue',
        max.format(field.dateDisplayFormat).toLocaleUpperCase()
      );
      isValid = false;
    }
    return isValid;
  }
  /**
   * @param {?} field
   * @return {?}
   */
  isSupported(field) {
    return (
      field && this.supportedTypes.indexOf(field.type) > -1 && !!field.maxValue
    );
  }
}
export class MinDateTimeFieldValidator {
  constructor() {
    this.supportedTypes = [FormFieldTypes.DATETIME];
    this.MIN_DATETIME_FORMAT = 'YYYY-MM-DD hh:mm AZ';
  }
  /**
   * @param {?} field
   * @return {?}
   */
  isSupported(field) {
    return (
      field && this.supportedTypes.indexOf(field.type) > -1 && !!field.minValue
    );
  }
  /**
   * @param {?} field
   * @return {?}
   */
  validate(field) {
    /** @type {?} */
    let isValid = true;
    if (this.isSupported(field) && field.value && field.isVisible) {
      /** @type {?} */
      const dateFormat = field.dateDisplayFormat;
      if (!DateFieldValidator.isValidDate(field.value, dateFormat)) {
        field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_DATE';
        isValid = false;
      } else {
        isValid = this.checkDateTime(field, dateFormat);
      }
    }
    return isValid;
  }
  /**
   * @private
   * @param {?} field
   * @param {?} dateFormat
   * @return {?}
   */
  checkDateTime(field, dateFormat) {
    /** @type {?} */
    let isValid = true;
    /** @type {?} */
    let fieldValueDate;
    if (typeof field.value === 'string') {
      fieldValueDate = moment(field.value, dateFormat);
    } else {
      fieldValueDate = field.value;
    }
    /** @type {?} */
    const min = moment(field.minValue, this.MIN_DATETIME_FORMAT);
    if (fieldValueDate.isBefore(min)) {
      field.validationSummary.message = `FORM.FIELD.VALIDATOR.NOT_LESS_THAN`;
      field.validationSummary.attributes.set(
        'minValue',
        min.format(field.dateDisplayFormat).replace(':', '-')
      );
      isValid = false;
    }
    return isValid;
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  MinDateTimeFieldValidator.prototype.supportedTypes;
  /** @type {?} */
  MinDateTimeFieldValidator.prototype.MIN_DATETIME_FORMAT;
}
export class MaxDateTimeFieldValidator {
  constructor() {
    this.supportedTypes = [FormFieldTypes.DATETIME];
    this.MAX_DATETIME_FORMAT = 'YYYY-MM-DD hh:mm AZ';
  }
  /**
   * @param {?} field
   * @return {?}
   */
  isSupported(field) {
    return (
      field && this.supportedTypes.indexOf(field.type) > -1 && !!field.maxValue
    );
  }
  /**
   * @param {?} field
   * @return {?}
   */
  validate(field) {
    /** @type {?} */
    let isValid = true;
    if (this.isSupported(field) && field.value && field.isVisible) {
      /** @type {?} */
      const dateFormat = field.dateDisplayFormat;
      if (!DateFieldValidator.isValidDate(field.value, dateFormat)) {
        field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_DATE';
        isValid = false;
      } else {
        isValid = this.checkDateTime(field, dateFormat);
      }
    }
    return isValid;
  }
  /**
   * @private
   * @param {?} field
   * @param {?} dateFormat
   * @return {?}
   */
  checkDateTime(field, dateFormat) {
    /** @type {?} */
    let isValid = true;
    /** @type {?} */
    let fieldValueDate;
    if (typeof field.value === 'string') {
      fieldValueDate = moment(field.value, dateFormat);
    } else {
      fieldValueDate = field.value;
    }
    /** @type {?} */
    const max = moment(field.maxValue, this.MAX_DATETIME_FORMAT);
    if (fieldValueDate.isAfter(max)) {
      field.validationSummary.message = `FORM.FIELD.VALIDATOR.NOT_GREATER_THAN`;
      field.validationSummary.attributes.set(
        'maxValue',
        max.format(field.dateDisplayFormat).replace(':', '-')
      );
      isValid = false;
    }
    return isValid;
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  MaxDateTimeFieldValidator.prototype.supportedTypes;
  /** @type {?} */
  MaxDateTimeFieldValidator.prototype.MAX_DATETIME_FORMAT;
}
export class MinLengthFieldValidator {
  constructor() {
    this.supportedTypes = [FormFieldTypes.TEXT, FormFieldTypes.MULTILINE_TEXT];
  }
  /**
   * @param {?} field
   * @return {?}
   */
  isSupported(field) {
    return (
      field &&
      this.supportedTypes.indexOf(field.type) > -1 &&
      field.minLength > 0
    );
  }
  /**
   * @param {?} field
   * @return {?}
   */
  validate(field) {
    if (this.isSupported(field) && field.value && field.isVisible) {
      if (field.value.length >= field.minLength) {
        return true;
      }
      field.validationSummary.message = `FORM.FIELD.VALIDATOR.AT_LEAST_LONG`;
      field.validationSummary.attributes.set(
        'minLength',
        field.minLength.toLocaleString()
      );
      return false;
    }
    return true;
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  MinLengthFieldValidator.prototype.supportedTypes;
}
export class MaxLengthFieldValidator {
  constructor() {
    this.supportedTypes = [FormFieldTypes.TEXT, FormFieldTypes.MULTILINE_TEXT];
  }
  /**
   * @param {?} field
   * @return {?}
   */
  isSupported(field) {
    return (
      field &&
      this.supportedTypes.indexOf(field.type) > -1 &&
      field.maxLength > 0
    );
  }
  /**
   * @param {?} field
   * @return {?}
   */
  validate(field) {
    if (this.isSupported(field) && field.value && field.isVisible) {
      if (field.value.length <= field.maxLength) {
        return true;
      }
      field.validationSummary.message = `FORM.FIELD.VALIDATOR.NO_LONGER_THAN`;
      field.validationSummary.attributes.set(
        'maxLength',
        field.maxLength.toLocaleString()
      );
      return false;
    }
    return true;
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  MaxLengthFieldValidator.prototype.supportedTypes;
}
export class MinValueFieldValidator {
  constructor() {
    this.supportedTypes = [FormFieldTypes.NUMBER, FormFieldTypes.AMOUNT];
  }
  /**
   * @param {?} field
   * @return {?}
   */
  isSupported(field) {
    return (
      field &&
      this.supportedTypes.indexOf(field.type) > -1 &&
      NumberFieldValidator.isNumber(field.minValue)
    );
  }
  /**
   * @param {?} field
   * @return {?}
   */
  validate(field) {
    if (this.isSupported(field) && field.value && field.isVisible) {
      /** @type {?} */
      const value = +field.value;
      /** @type {?} */
      const minValue = +field.minValue;
      if (value >= minValue) {
        return true;
      }
      field.validationSummary.message = `FORM.FIELD.VALIDATOR.NOT_LESS_THAN`;
      field.validationSummary.attributes.set(
        'minValue',
        field.minValue.toLocaleString()
      );
      return false;
    }
    return true;
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  MinValueFieldValidator.prototype.supportedTypes;
}
export class MaxValueFieldValidator {
  constructor() {
    this.supportedTypes = [FormFieldTypes.NUMBER, FormFieldTypes.AMOUNT];
  }
  /**
   * @param {?} field
   * @return {?}
   */
  isSupported(field) {
    return (
      field &&
      this.supportedTypes.indexOf(field.type) > -1 &&
      NumberFieldValidator.isNumber(field.maxValue)
    );
  }
  /**
   * @param {?} field
   * @return {?}
   */
  validate(field) {
    if (this.isSupported(field) && field.value && field.isVisible) {
      /** @type {?} */
      const value = +field.value;
      /** @type {?} */
      const maxValue = +field.maxValue;
      if (value <= maxValue) {
        return true;
      }
      field.validationSummary.message = `FORM.FIELD.VALIDATOR.NOT_GREATER_THAN`;
      field.validationSummary.attributes.set(
        'maxValue',
        field.maxValue.toLocaleString()
      );
      return false;
    }
    return true;
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  MaxValueFieldValidator.prototype.supportedTypes;
}
export class RegExFieldValidator {
  constructor() {
    this.supportedTypes = [FormFieldTypes.TEXT, FormFieldTypes.MULTILINE_TEXT];
  }
  /**
   * @param {?} field
   * @return {?}
   */
  isSupported(field) {
    return (
      field &&
      this.supportedTypes.indexOf(field.type) > -1 &&
      !!field.regexPattern
    );
  }
  /**
   * @param {?} field
   * @return {?}
   */
  validate(field) {
    if (this.isSupported(field) && field.value && field.isVisible) {
      if (
        field.value.length > 0 &&
        field.value.match(new RegExp('^' + field.regexPattern + '$'))
      ) {
        return true;
      }
      field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_VALUE';
      return false;
    }
    return true;
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  RegExFieldValidator.prototype.supportedTypes;
}
export class FixedValueFieldValidator {
  constructor() {
    this.supportedTypes = [FormFieldTypes.TYPEAHEAD];
  }
  /**
   * @param {?} field
   * @return {?}
   */
  isSupported(field) {
    return field && this.supportedTypes.indexOf(field.type) > -1;
  }
  /**
   * @param {?} field
   * @return {?}
   */
  hasValidNameOrValidId(field) {
    return this.hasValidName(field) || this.hasValidId(field);
  }
  /**
   * @param {?} field
   * @return {?}
   */
  hasValidName(field) {
    return field.options.find(
      /**
       * @param {?} item
       * @return {?}
       */
      item =>
        item.name &&
        item.name.toLocaleLowerCase() === field.value.toLocaleLowerCase()
    )
      ? true
      : false;
  }
  /**
   * @param {?} field
   * @return {?}
   */
  hasValidId(field) {
    return field.options.find(
      /**
       * @param {?} item
       * @return {?}
       */
      item => item.id === field.value
    )
      ? true
      : false;
  }
  /**
   * @param {?} field
   * @return {?}
   */
  hasStringValue(field) {
    return field.value && typeof field.value === 'string';
  }
  /**
   * @param {?} field
   * @return {?}
   */
  hasOptions(field) {
    return field.options && field.options.length > 0;
  }
  /**
   * @param {?} field
   * @return {?}
   */
  validate(field) {
    if (this.isSupported(field) && field.isVisible) {
      if (
        this.hasStringValue(field) &&
        this.hasOptions(field) &&
        !this.hasValidNameOrValidId(field)
      ) {
        field.validationSummary.message = 'FORM.FIELD.VALIDATOR.INVALID_VALUE';
        return false;
      }
    }
    return true;
  }
}
if (false) {
  /**
   * @type {?}
   * @private
   */
  FixedValueFieldValidator.prototype.supportedTypes;
}
/** @type {?} */
export const FORM_FIELD_VALIDATORS = [
  new RequiredFieldValidator(),
  new NumberFieldValidator(),
  new MinLengthFieldValidator(),
  new MaxLengthFieldValidator(),
  new MinValueFieldValidator(),
  new MaxValueFieldValidator(),
  new RegExFieldValidator(),
  new DateFieldValidator(),
  new MinDateFieldValidator(),
  new MaxDateFieldValidator(),
  new FixedValueFieldValidator(),
  new MinDateTimeFieldValidator(),
  new MaxDateTimeFieldValidator()
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC12YWxpZGF0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJmb3JtL2NvbXBvbmVudHMvd2lkZ2V0cy9jb3JlL2Zvcm0tZmllbGQtdmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxPQUFPLE1BQU0sTUFBTSxZQUFZLENBQUM7QUFDaEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDOzs7O0FBR3BELHdDQU1DOzs7Ozs7SUFKRyxnRUFBNEM7Ozs7O0lBRTVDLDZEQUF5Qzs7QUFJN0MsTUFBTSxPQUFPLHNCQUFzQjtJQUFuQztRQUVZLG1CQUFjLEdBQUc7WUFDckIsY0FBYyxDQUFDLElBQUk7WUFDbkIsY0FBYyxDQUFDLGNBQWM7WUFDN0IsY0FBYyxDQUFDLE1BQU07WUFDckIsY0FBYyxDQUFDLE9BQU87WUFDdEIsY0FBYyxDQUFDLFNBQVM7WUFDeEIsY0FBYyxDQUFDLFFBQVE7WUFDdkIsY0FBYyxDQUFDLE1BQU07WUFDckIsY0FBYyxDQUFDLGdCQUFnQjtZQUMvQixjQUFjLENBQUMsYUFBYTtZQUM1QixjQUFjLENBQUMsTUFBTTtZQUNyQixjQUFjLENBQUMsTUFBTTtZQUNyQixjQUFjLENBQUMsYUFBYTtZQUM1QixjQUFjLENBQUMsSUFBSTtZQUNuQixjQUFjLENBQUMsUUFBUTtZQUN2QixjQUFjLENBQUMsYUFBYTtTQUMvQixDQUFDO0lBMkNOLENBQUM7Ozs7O0lBekNHLFdBQVcsQ0FBQyxLQUFxQjtRQUM3QixPQUFPLEtBQUs7WUFDUixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVDLEtBQUssQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQzs7Ozs7SUFFRCxRQUFRLENBQUMsS0FBcUI7UUFDMUIsSUFBSSxJQUFJLENBQUMs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QUssUUFBUSxDQUFDO0lBQzFELENBQUM7Ozs7O0lBRUQsVUFBVSxDQUFDLEtBQXFCO1FBQzVCLE9BQU8sS0FBSyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDckQsQ0FBQzs7Ozs7SUFFRCxRQUFRLENBQUMsS0FBcUI7UUFDMUIsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUU7WUFDNUMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzVGLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsb0NBQW9DLENBQUM7Z0JBQ3ZFLE9BQU8sS0FBSyxDQUFDO2FBQ2hCO1NBQ0o7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7Ozs7OztJQXJDRyxrREFFRTs7O0FBcUNOLE1BQU0sT0FBTyxxQkFBcUIsR0FBRztJQUNqQyxJQUFJLHNCQUFzQixFQUFFO0lBQzVCLElBQUksb0JBQW9CLEVBQUU7SUFDMUIsSUFBSSx1QkFBdUIsRUFBRTtJQUM3QixJQUFJLHVCQUF1QixFQUFFO0lBQzdCLElBQUksc0JBQXNCLEVBQUU7SUFDNUIsSUFBSSxzQkFBc0IsRUFBRTtJQUM1QixJQUFJLG1CQUFtQixFQUFFO0lBQ3pCLElBQUksa0JBQWtCLEVBQUU7SUFDeEIsSUFBSSxxQkFBcUIsRUFBRTtJQUMzQixJQUFJLHFCQUFxQixFQUFFO0lBQzNCLElBQUksd0JBQXdCLEVBQUU7SUFDOUIsSUFBSSx5QkFBeUIsRUFBRTtJQUMvQixJQUFJLHlCQUF5QixFQUFFO0NBQ2xDIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuLyogdHNsaW50OmRpc2FibGU6Y29tcG9uZW50LXNlbGVjdG9yICAqL1xuXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudC1lczYnO1xuaW1wb3J0IHsgRm9ybUZpZWxkVHlwZXMgfSBmcm9tICcuL2Zvcm0tZmllbGQtdHlwZXMnO1xuaW1wb3J0IHsgRm9ybUZpZWxkTW9kZWwgfSBmcm9tICcuL2Zvcm0tZmllbGQubW9kZWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZvcm1GaWVsZFZhbGlkYXRvciB7XG5cbiAgICBpc1N1cHBvcnRlZChmaWVsZDogRm9ybUZpZWxkTW9kZWwpOiBib29sZWFuO1xuXG4gICAgdmFsaWRhdGUoZmllbGQ6IEZvcm1GaWVsZE1vZGVsKTogYm9vbGVhbjtcblxufVxuXG5leHBvcnQgY2xhc3MgUmVxdWlyZWRGaWVsZFZhbGlkYXRvciBpbXBsZW1lbnRzIEZvcm1GaWVsZFZhbGlkYXRvciB7XG5cbiAgICBwcml2YXRlIHN1cHBvcnRlZFR5cGVzID0gW1xuICAgICAgICBGb3JtRmllbGRUeXBlcy5URVhULFxuICAgICAgICBGb3JtRmllbGRUeXBlcy5NVUxUSUxJTkVfVEVYVCxcbiAgICAgICAgRm9ybUZpZWxkVHlwZXMuTlVNQkVSLFxuICAgICAgICBGb3JtRmllbGRUeXBlcy5CT09MRUFOLFxuICAgICAgICBGb3JtRmllbGRUeXBlcy5UWVBFQUhFQUQsXG4gICAgICAgIEZvcm1GaWVsZFR5cGVzLkRST1BET1dOLFxuICAgICAgICBGb3JtRmllbGRUeXBlcy5QRU9QTEUsXG4gICAgICAgIEZvcm1GaWVsZFR5cGVzLkZVTkNUSU9OQUxfR1JPVVAsXG4gICAgICAgIEZvcm1GaWVsZFR5cGVzLlJBRElPX0JVVFRPTlMsXG4gICAgICAgIEZvcm1GaWVsZFR5cGVzLlVQTE9BRCxcbiAgICAgICAgRm9ybUZpZWxkVHlwZXMuQU1PVU5ULFxuICAgICAgICBGb3JtRmllbGRUeXBlcy5EWU5BTUlDX1RBQkxFLFxuICAgICAgICBGb3JtRmllbGRUeXBlcy5EQVRFLFxuICAgICAgICBGb3JtRmllbGRUeXBlcy5EQVRFVElNRSxcbiAgICAgICAgRm9ybUZpZWxkVHlwZXMuQVRUQUNIX0ZPTERFUlxuICAgIF07XG5cbiAgICBpc1N1cHBvcnRlZChmaWVsZDogRm9ybUZpZWxkTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkICYmXG4gICAgICAgICAgICB0aGlzLnN1cHBvcnRlZFR5cGVzLmluZGV4T2YoZmllbGQudHlwZSkgPiAtMSAmJlxuICAgICAgICAgICAgZmllbGQucmVxdWlyZWQ7XG4gICAgfVxuXG4gICAgdmFsaWRhdGUoZmllbGQ6IEZvcm1GaWVsZE1vZGVsKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmlzU3VwcG9ydGVkKGZpZWxkKSAmJiBmaWVsZC5pc1Zpc2libGUpIHtcblxuICAgICAgICAgICAgaWYgKGZpZWxkLnR5cGUgPT09IEZvcm1GaWVsZFR5cGVzLkRST1BET1dOKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkLmhhc0VtcHR5VmFsdWUgJiYgZmllbGQuZW1wdHlPcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkLnZhbHVlID09PSBmaWVsZC5lbXB0eU9wdGlvbi5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZmllbGQudHlwZSA9PT0gRm9ybUZpZWxkVHlwZXMuUkFESU9fQlVUVE9OUykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbiA9IGZpZWxkLm9wdGlvbnMuZmluZCgob3B0KSA9PiBvcHQuaWQgPT09IGZpZWxkLnZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFvcHRpb247XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmaWVsZC50eXBlID09PSBGb3JtRmllbGRUeXBlcy5VUExPQUQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmllbGQudmFsdWUgJiYgZmllbGQudmFsdWUubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGZpZWxkLnR5cGUgPT09IEZvcm1GaWVsZFR5cGVzLkRZTkFNSUNfVEFCTEUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmllbGQudmFsdWUgJiYgZmllbGQudmFsdWUgaW5zdGFuY2VvZiBBcnJheSAmJiBmaWVsZC52YWx1ZS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZmllbGQudHlwZSA9PT0gRm9ybUZpZWxkVHlwZXMuQk9PTEVBTikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmaWVsZC52YWx1ZSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGZpZWxkLnZhbHVlID09PSBudWxsIHx8IGZpZWxkLnZhbHVlID09PSB1bmRlZmluZWQgfHwgZmllbGQudmFsdWUgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgTnVtYmVyRmllbGRWYWxpZGF0b3IgaW1wbGVtZW50cyBGb3JtRmllbGRWYWxpZGF0b3Ige1xuXG4gICAgcHJpdmF0ZSBzdXBwb3J0ZWRUeXBlcyA9IFtcbiAgICAgICAgRm9ybUZpZWxkVHlwZXMuTlVNQkVSLFxuICAgICAgICBGb3JtRmllbGRUeXBlcy5BTU9VTlRcbiAgICBdO1xuXG4gICAgc3RhdGljIGlzTnVtYmVyKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gIWlzTmFOKCt2YWx1ZSk7XG4gICAgfVxuXG4gICAgaXNTdXBwb3J0ZWQoZmllbGQ6IEZvcm1GaWVsZE1vZGVsKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBmaWVsZCAmJiB0aGlzLnN1cHBvcnRlZFR5cGVzLmluZGV4T2YoZmllbGQudHlwZSkgPiAtMTtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZShmaWVsZDogRm9ybUZpZWxkTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdXBwb3J0ZWQoZmllbGQpICYmIGZpZWxkLmlzVmlzaWJsZSkge1xuICAgICAgICAgICAgaWYgKGZpZWxkLnZhbHVlID09PSBudWxsIHx8XG4gICAgICAgICAgICAgICAgZmllbGQudmFsdWUgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICAgIGZpZWxkLnZhbHVlID09PSAnJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdmFsdWVTdHIgPSAnJyArIGZpZWxkLnZhbHVlO1xuICAgICAgICAgICAgbGV0IHBhdHRlcm4gPSBuZXcgUmVnRXhwKC9eLT9cXGQrJC8pO1xuICAgICAgICAgICAgaWYgKGZpZWxkLmVuYWJsZUZyYWN0aW9ucykge1xuICAgICAgICAgICAgICAgIHBhdHRlcm4gPSBuZXcgUmVnRXhwKC9eLT9bMC05XSsoXFwuWzAtOV17MSwyfSk/JC8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHZhbHVlU3RyLm1hdGNoKHBhdHRlcm4pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWVsZC52YWxpZGF0aW9uU3VtbWFyeS5tZXNzYWdlID0gJ0ZPUk0uRklFTEQuVkFMSURBVE9SLklOVkFMSURfTlVNQkVSJztcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEYXRlRmllbGRWYWxpZGF0b3IgaW1wbGVtZW50cyBGb3JtRmllbGRWYWxpZGF0b3Ige1xuXG4gICAgcHJpdmF0ZSBzdXBwb3J0ZWRUeXBlcyA9IFtcbiAgICAgICAgRm9ybUZpZWxkVHlwZXMuREFURVxuICAgIF07XG5cbiAgICAvLyBWYWxpZGF0ZXMgdGhhdCB0aGUgaW5wdXQgc3RyaW5nIGlzIGEgdmFsaWQgZGF0ZSBmb3JtYXR0ZWQgYXMgPGRhdGVGb3JtYXQ+IChkZWZhdWx0IEQtTS1ZWVlZKVxuICAgIHN0YXRpYyBpc1ZhbGlkRGF0ZShpbnB1dERhdGU6IHN0cmluZywgZGF0ZUZvcm1hdDogc3RyaW5nID0gJ0QtTS1ZWVlZJyk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoaW5wdXREYXRlKSB7XG4gICAgICAgICAgICBjb25zdCBkID0gbW9tZW50KGlucHV0RGF0ZSwgZGF0ZUZvcm1hdCwgdHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm4gZC5pc1ZhbGlkKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaXNTdXBwb3J0ZWQoZmllbGQ6IEZvcm1GaWVsZE1vZGVsKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBmaWVsZCAmJiB0aGlzLnN1cHBvcnRlZFR5cGVzLmluZGV4T2YoZmllbGQudHlwZSkgPiAtMTtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZShmaWVsZDogRm9ybUZpZWxkTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdXBwb3J0ZWQoZmllbGQpICYmIGZpZWxkLnZhbHVlICYmIGZpZWxkLmlzVmlzaWJsZSkge1xuICAgICAgICAgICAgaWYgKERhdGVGaWVsZFZhbGlkYXRvci5pc1ZhbGlkRGF0ZShmaWVsZC52YWx1ZSwgZmllbGQuZGF0ZURpc3BsYXlGb3JtYXQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWVsZC52YWxpZGF0aW9uU3VtbWFyeS5tZXNzYWdlID0gZmllbGQuZGF0ZURpc3BsYXlGb3JtYXQ7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQm91bmRhcnlEYXRlRmllbGRWYWxpZGF0b3IgaW1wbGVtZW50cyBGb3JtRmllbGRWYWxpZGF0b3Ige1xuXG4gICAgREFURV9GT1JNQVRfQ0xPVUQgPSAnWVlZWS1NTS1ERCc7XG4gICAgREFURV9GT1JNQVQgPSAnREQtTU0tWVlZWSc7XG5cbiAgICBzdXBwb3J0ZWRUeXBlcyA9IFtcbiAgICAgICAgRm9ybUZpZWxkVHlwZXMuREFURVxuICAgIF07XG5cbiAgICB2YWxpZGF0ZShmaWVsZDogRm9ybUZpZWxkTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGlzVmFsaWQgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5pc1N1cHBvcnRlZChmaWVsZCkgJiYgZmllbGQudmFsdWUgJiYgZmllbGQuaXNWaXNpYmxlKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRlRm9ybWF0ID0gZmllbGQuZGF0ZURpc3BsYXlGb3JtYXQ7XG5cbiAgICAgICAgICAgIGlmICghRGF0ZUZpZWxkVmFsaWRhdG9yLmlzVmFsaWREYXRlKGZpZWxkLnZhbHVlLCBkYXRlRm9ybWF0KSkge1xuICAgICAgICAgICAgICAgIGZpZWxkLnZhbGlkYXRpb25TdW1tYXJ5Lm1lc3NhZ2UgPSAnRk9STS5GSUVMRC5WQUxJREFUT1IuSU5WQUxJRF9EQVRFJztcbiAgICAgICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlzVmFsaWQgPSB0aGlzLmNoZWNrRGF0ZShmaWVsZCwgZGF0ZUZvcm1hdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgfVxuXG4gICAgZXh0cmFjdERhdGVGb3JtYXQoZGF0ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgYnJva2VuRG93bkRhdGUgPSBkYXRlLnNwbGl0KCctJyk7XG4gICAgICAgIHJldHVybiBicm9rZW5Eb3duRGF0ZVswXS5sZW5ndGggPT09IDQgPyB0aGlzLkRBVEVfRk9STUFUX0NMT1VEIDogdGhpcy5EQVRFX0ZPUk1BVDtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBjaGVja0RhdGUoZmllbGQ6IEZvcm1GaWVsZE1vZGVsLCBkYXRlRm9ybWF0OiBzdHJpbmcpO1xuICAgIGFic3RyYWN0IGlzU3VwcG9ydGVkKGZpZWxkOiBGb3JtRmllbGRNb2RlbCk7XG5cbn1cblxuZXhwb3J0IGNsYXNzIE1pbkRhdGVGaWVsZFZhbGlkYXRvciBleHRlbmRzIEJvdW5kYXJ5RGF0ZUZpZWxkVmFsaWRhdG9yIHtcblxuICAgIGNoZWNrRGF0ZShmaWVsZDogRm9ybUZpZWxkTW9kZWwsIGRhdGVGb3JtYXQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuXG4gICAgICAgIGxldCBpc1ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgLy8gcmVtb3ZlIHRpbWUgYW5kIHRpbWV6b25lIGluZm9cbiAgICAgICAgbGV0IGZpZWxkVmFsdWVEYXRhO1xuICAgICAgICBpZiAodHlwZW9mIGZpZWxkLnZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZmllbGRWYWx1ZURhdGEgPSBtb21lbnQoZmllbGQudmFsdWUuc3BsaXQoJ1QnKVswXSwgZGF0ZUZvcm1hdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWVsZFZhbHVlRGF0YSA9IGZpZWxkLnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWluVmFsdWVEYXRlRm9ybWF0ID0gdGhpcy5leHRyYWN0RGF0ZUZvcm1hdChmaWVsZC5taW5WYWx1ZSk7XG4gICAgICAgIGNvbnN0IG1pbiA9IG1vbWVudChmaWVsZC5taW5WYWx1ZSwgbWluVmFsdWVEYXRlRm9ybWF0KTtcblxuICAgICAgICBpZiAoZmllbGRWYWx1ZURhdGEuaXNCZWZvcmUobWluKSkge1xuICAgICAgICAgICAgZmllbGQudmFsaWRhdGlvblN1bW1hcnkubWVzc2FnZSA9IGBGT1JNLkZJRUxELlZBTElEQVRPUi5OT1RfTEVTU19USEFOYDtcbiAgICAgICAgICAgIGZpZWxkLnZhbGlkYXRpb25TdW1tYXJ5LmF0dHJpYnV0ZXMuc2V0KCdtaW5WYWx1ZScsIG1pbi5mb3JtYXQoZmllbGQuZGF0ZURpc3BsYXlGb3JtYXQpLnRvTG9jYWxlVXBwZXJDYXNlKCkpO1xuICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgIH1cblxuICAgIGlzU3VwcG9ydGVkKGZpZWxkOiBGb3JtRmllbGRNb2RlbCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZmllbGQgJiZcbiAgICAgICAgICAgIHRoaXMuc3VwcG9ydGVkVHlwZXMuaW5kZXhPZihmaWVsZC50eXBlKSA+IC0xICYmICEhZmllbGQubWluVmFsdWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTWF4RGF0ZUZpZWxkVmFsaWRhdG9yIGV4dGVuZHMgQm91bmRhcnlEYXRlRmllbGRWYWxpZGF0b3Ige1xuXG4gICAgY2hlY2tEYXRlKGZpZWxkOiBGb3JtRmllbGRNb2RlbCwgZGF0ZUZvcm1hdDogc3RyaW5nKTogYm9vbGVhbiB7XG5cbiAgICAgICAgbGV0IGlzVmFsaWQgPSB0cnVlO1xuICAgICAgICAvLyByZW1vdmUgdGltZSBhbmQgdGltZXpvbmUgaW5mb1xuICAgICAgICBsZXQgZmllbGRWYWx1ZURhdGE7XG4gICAgICAgIGlmICh0eXBlb2YgZmllbGQudmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBmaWVsZFZhbHVlRGF0YSA9IG1vbWVudChmaWVsZC52YWx1ZS5zcGxpdCgnVCcpWzBdLCBkYXRlRm9ybWF0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpZWxkVmFsdWVEYXRhID0gZmllbGQudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYXhWYWx1ZURhdGVGb3JtYXQgPSB0aGlzLmV4dHJhY3REYXRlRm9ybWF0KGZpZWxkLm1heFZhbHVlKTtcbiAgICAgICAgY29uc3QgbWF4ID0gbW9tZW50KGZpZWxkLm1heFZhbHVlLCBtYXhWYWx1ZURhdGVGb3JtYXQpO1xuXG4gICAgICAgIGlmIChmaWVsZFZhbHVlRGF0YS5pc0FmdGVyKG1heCkpIHtcbiAgICAgICAgICAgIGZpZWxkLnZhbGlkYXRpb25TdW1tYXJ5Lm1lc3NhZ2UgPSBgRk9STS5GSUVMRC5WQUxJREFUT1IuTk9UX0dSRUFURVJfVEhBTmA7XG4gICAgICAgICAgICBmaWVsZC52YWxpZGF0aW9uU3VtbWFyeS5hdHRyaWJ1dGVzLnNldCgnbWF4VmFsdWUnLCBtYXguZm9ybWF0KGZpZWxkLmRhdGVEaXNwbGF5Rm9ybWF0KS50b0xvY2FsZVVwcGVyQ2FzZSgpKTtcbiAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNWYWxpZDtcbiAgICB9XG5cbiAgICBpc1N1cHBvcnRlZChmaWVsZDogRm9ybUZpZWxkTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkICYmXG4gICAgICAgICAgICB0aGlzLnN1cHBvcnRlZFR5cGVzLmluZGV4T2YoZmllbGQudHlwZSkgPiAtMSAmJiAhIWZpZWxkLm1heFZhbHVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1pbkRhdGVUaW1lRmllbGRWYWxpZGF0b3IgaW1wbGVtZW50cyBGb3JtRmllbGRWYWxpZGF0b3Ige1xuXG4gICAgcHJpdmF0ZSBzdXBwb3J0ZWRUeXBlcyA9IFtcbiAgICAgICAgRm9ybUZpZWxkVHlwZXMuREFURVRJTUVcbiAgICBdO1xuICAgIE1JTl9EQVRFVElNRV9GT1JNQVQgPSAnWVlZWS1NTS1ERCBoaDptbSBBWic7XG5cbiAgICBpc1N1cHBvcnRlZChmaWVsZDogRm9ybUZpZWxkTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkICYmXG4gICAgICAgICAgICB0aGlzLnN1cHBvcnRlZFR5cGVzLmluZGV4T2YoZmllbGQudHlwZSkgPiAtMSAmJiAhIWZpZWxkLm1pblZhbHVlO1xuICAgIH1cblxuICAgIHZhbGlkYXRlKGZpZWxkOiBGb3JtRmllbGRNb2RlbCk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgaXNWYWxpZCA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLmlzU3VwcG9ydGVkKGZpZWxkKSAmJiBmaWVsZC52YWx1ZSAmJiBmaWVsZC5pc1Zpc2libGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGVGb3JtYXQgPSBmaWVsZC5kYXRlRGlzcGxheUZvcm1hdDtcblxuICAgICAgICAgICAgaWYgKCFEYXRlRmllbGRWYWxpZGF0b3IuaXNWYWxpZERhdGUoZmllbGQudmFsdWUsIGRhdGVGb3JtYXQpKSB7XG4gICAgICAgICAgICAgICAgZmllbGQudmFsaWRhdGlvblN1bW1hcnkubWVzc2FnZSA9ICdGT1JNLkZJRUxELlZBTElEQVRPUi5JTlZBTElEX0RBVEUnO1xuICAgICAgICAgICAgICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXNWYWxpZCA9IHRoaXMuY2hlY2tEYXRlVGltZShmaWVsZCwgZGF0ZUZvcm1hdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja0RhdGVUaW1lKGZpZWxkOiBGb3JtRmllbGRNb2RlbCwgZGF0ZUZvcm1hdDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBpc1ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgbGV0IGZpZWxkVmFsdWVEYXRlO1xuICAgICAgICBpZiAodHlwZW9mIGZpZWxkLnZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZmllbGRWYWx1ZURhdGUgPSBtb21lbnQoZmllbGQudmFsdWUsIGRhdGVGb3JtYXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmllbGRWYWx1ZURhdGUgPSBmaWVsZC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtaW4gPSBtb21lbnQoZmllbGQubWluVmFsdWUsIHRoaXMuTUlOX0RBVEVUSU1FX0ZPUk1BVCk7XG5cbiAgICAgICAgaWYgKGZpZWxkVmFsdWVEYXRlLmlzQmVmb3JlKG1pbikpIHtcbiAgICAgICAgICAgIGZpZWxkLnZhbGlkYXRpb25TdW1tYXJ5Lm1lc3NhZ2UgPSBgRk9STS5GSUVMRC5WQUxJREFUT1IuTk9UX0xFU1NfVEhBTmA7XG4gICAgICAgICAgICBmaWVsZC52YWxpZGF0aW9uU3VtbWFyeS5hdHRyaWJ1dGVzLnNldCgnbWluVmFsdWUnLCBtaW4uZm9ybWF0KGZpZWxkLmRhdGVEaXNwbGF5Rm9ybWF0KS5yZXBsYWNlKCc6JywgJy0nKSk7XG4gICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTWF4RGF0ZVRpbWVGaWVsZFZhbGlkYXRvciBpbXBsZW1lbnRzIEZvcm1GaWVsZFZhbGlkYXRvciB7XG5cbiAgICBwcml2YXRlIHN1cHBvcnRlZFR5cGVzID0gW1xuICAgICAgICBGb3JtRmllbGRUeXBlcy5EQVRFVElNRVxuICAgIF07XG4gICAgTUFYX0RBVEVUSU1FX0ZPUk1BVCA9ICdZWVlZLU1NLUREIGhoOm1tIEFaJztcblxuICAgIGlzU3VwcG9ydGVkKGZpZWxkOiBGb3JtRmllbGRNb2RlbCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZmllbGQgJiZcbiAgICAgICAgICAgIHRoaXMuc3VwcG9ydGVkVHlwZXMuaW5kZXhPZihmaWVsZC50eXBlKSA+IC0xICYmICEhZmllbGQubWF4VmFsdWU7XG4gICAgfVxuXG4gICAgdmFsaWRhdGUoZmllbGQ6IEZvcm1GaWVsZE1vZGVsKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBpc1ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuaXNTdXBwb3J0ZWQoZmllbGQpICYmIGZpZWxkLnZhbHVlICYmIGZpZWxkLmlzVmlzaWJsZSkge1xuICAgICAgICAgICAgY29uc3QgZGF0ZUZvcm1hdCA9IGZpZWxkLmRhdGVEaXNwbGF5Rm9ybWF0O1xuXG4gICAgICAgICAgICBpZiAoIURhdGVGaWVsZFZhbGlkYXRvci5pc1ZhbGlkRGF0ZShmaWVsZC52YWx1ZSwgZGF0ZUZvcm1hdCkpIHtcbiAgICAgICAgICAgICAgICBmaWVsZC52YWxpZGF0aW9uU3VtbWFyeS5tZXNzYWdlID0gJ0ZPUk0uRklFTEQuVkFMSURBVE9SLklOVkFMSURfREFURSc7XG4gICAgICAgICAgICAgICAgaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpc1ZhbGlkID0gdGhpcy5jaGVja0RhdGVUaW1lKGZpZWxkLCBkYXRlRm9ybWF0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNWYWxpZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNoZWNrRGF0ZVRpbWUoZmllbGQ6IEZvcm1GaWVsZE1vZGVsLCBkYXRlRm9ybWF0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGlzVmFsaWQgPSB0cnVlO1xuICAgICAgICBsZXQgZmllbGRWYWx1ZURhdGU7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBmaWVsZC52YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGZpZWxkVmFsdWVEYXRlID0gbW9tZW50KGZpZWxkLnZhbHVlLCBkYXRlRm9ybWF0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpZWxkVmFsdWVEYXRlID0gZmllbGQudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWF4ID0gbW9tZW50KGZpZWxkLm1heFZhbHVlLCB0aGlzLk1BWF9EQVRFVElNRV9GT1JNQVQpO1xuXG4gICAgICAgIGlmIChmaWVsZFZhbHVlRGF0ZS5pc0FmdGVyKG1heCkpIHtcbiAgICAgICAgICAgIGZpZWxkLnZhbGlkYXRpb25TdW1tYXJ5Lm1lc3NhZ2UgPSBgRk9STS5GSUVMRC5WQUxJREFUT1IuTk9UX0dSRUFURVJfVEhBTmA7XG4gICAgICAgICAgICBmaWVsZC52YWxpZGF0aW9uU3VtbWFyeS5hdHRyaWJ1dGVzLnNldCgnbWF4VmFsdWUnLCBtYXguZm9ybWF0KGZpZWxkLmRhdGVEaXNwbGF5Rm9ybWF0KS5yZXBsYWNlKCc6JywgJy0nKSk7XG4gICAgICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTWluTGVuZ3RoRmllbGRWYWxpZGF0b3IgaW1wbGVtZW50cyBGb3JtRmllbGRWYWxpZGF0b3Ige1xuXG4gICAgcHJpdmF0ZSBzdXBwb3J0ZWRUeXBlcyA9IFtcbiAgICAgICAgRm9ybUZpZWxkVHlwZXMuVEVYVCxcbiAgICAgICAgRm9ybUZpZWxkVHlwZXMuTVVMVElMSU5FX1RFWFRcbiAgICBdO1xuXG4gICAgaXNTdXBwb3J0ZWQoZmllbGQ6IEZvcm1GaWVsZE1vZGVsKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBmaWVsZCAmJlxuICAgICAgICAgICAgdGhpcy5zdXBwb3J0ZWRUeXBlcy5pbmRleE9mKGZpZWxkLnR5cGUpID4gLTEgJiZcbiAgICAgICAgICAgIGZpZWxkLm1pbkxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgdmFsaWRhdGUoZmllbGQ6IEZvcm1GaWVsZE1vZGVsKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmlzU3VwcG9ydGVkKGZpZWxkKSAmJiBmaWVsZC52YWx1ZSAmJiBmaWVsZC5pc1Zpc2libGUpIHtcbiAgICAgICAgICAgIGlmIChmaWVsZC52YWx1ZS5sZW5ndGggPj0gZmllbGQubWluTGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWVsZC52YWxpZGF0aW9uU3VtbWFyeS5tZXNzYWdlID0gYEZPUk0uRklFTEQuVkFMSURBVE9SLkFUX0xFQVNUX0xPTkdgO1xuICAgICAgICAgICAgZmllbGQudmFsaWRhdGlvblN1bW1hcnkuYXR0cmlidXRlcy5zZXQoJ21pbkxlbmd0aCcsIGZpZWxkLm1pbkxlbmd0aC50b0xvY2FsZVN0cmluZygpKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNYXhMZW5ndGhGaWVsZFZhbGlkYXRvciBpbXBsZW1lbnRzIEZvcm1GaWVsZFZhbGlkYXRvciB7XG5cbiAgICBwcml2YXRlIHN1cHBvcnRlZFR5cGVzID0gW1xuICAgICAgICBGb3JtRmllbGRUeXBlcy5URVhULFxuICAgICAgICBGb3JtRmllbGRUeXBlcy5NVUxUSUxJTkVfVEVYVFxuICAgIF07XG5cbiAgICBpc1N1cHBvcnRlZChmaWVsZDogRm9ybUZpZWxkTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkICYmXG4gICAgICAgICAgICB0aGlzLnN1cHBvcnRlZFR5cGVzLmluZGV4T2YoZmllbGQudHlwZSkgPiAtMSAmJlxuICAgICAgICAgICAgZmllbGQubWF4TGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZShmaWVsZDogRm9ybUZpZWxkTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdXBwb3J0ZWQoZmllbGQpICYmIGZpZWxkLnZhbHVlICYmIGZpZWxkLmlzVmlzaWJsZSkge1xuICAgICAgICAgICAgaWYgKGZpZWxkLnZhbHVlLmxlbmd0aCA8PSBmaWVsZC5tYXhMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpZWxkLnZhbGlkYXRpb25TdW1tYXJ5Lm1lc3NhZ2UgPSBgRk9STS5GSUVMRC5WQUxJREFUT1IuTk9fTE9OR0VSX1RIQU5gO1xuICAgICAgICAgICAgZmllbGQudmFsaWRhdGlvblN1bW1hcnkuYXR0cmlidXRlcy5zZXQoJ21heExlbmd0aCcsIGZpZWxkLm1heExlbmd0aC50b0xvY2FsZVN0cmluZygpKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNaW5WYWx1ZUZpZWxkVmFsaWRhdG9yIGltcGxlbWVudHMgRm9ybUZpZWxkVmFsaWRhdG9yIHtcblxuICAgIHByaXZhdGUgc3VwcG9ydGVkVHlwZXMgPSBbXG4gICAgICAgIEZvcm1GaWVsZFR5cGVzLk5VTUJFUixcbiAgICAgICAgRm9ybUZpZWxkVHlwZXMuQU1PVU5UXG4gICAgXTtcblxuICAgIGlzU3VwcG9ydGVkKGZpZWxkOiBGb3JtRmllbGRNb2RlbCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZmllbGQgJiZcbiAgICAgICAgICAgIHRoaXMuc3VwcG9ydGVkVHlwZXMuaW5kZXhPZihmaWVsZC50eXBlKSA+IC0xICYmXG4gICAgICAgICAgICBOdW1iZXJGaWVsZFZhbGlkYXRvci5pc051bWJlcihmaWVsZC5taW5WYWx1ZSk7XG4gICAgfVxuXG4gICAgdmFsaWRhdGUoZmllbGQ6IEZvcm1GaWVsZE1vZGVsKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmlzU3VwcG9ydGVkKGZpZWxkKSAmJiBmaWVsZC52YWx1ZSAmJiBmaWVsZC5pc1Zpc2libGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlOiBudW1iZXIgPSArZmllbGQudmFsdWU7XG4gICAgICAgICAgICBjb25zdCBtaW5WYWx1ZTogbnVtYmVyID0gK2ZpZWxkLm1pblZhbHVlO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgPj0gbWluVmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpZWxkLnZhbGlkYXRpb25TdW1tYXJ5Lm1lc3NhZ2UgPSBgRk9STS5GSUVMRC5WQUxJREFUT1IuTk9UX0xFU1NfVEhBTmA7XG4gICAgICAgICAgICBmaWVsZC52YWxpZGF0aW9uU3VtbWFyeS5hdHRyaWJ1dGVzLnNldCgnbWluVmFsdWUnLCBmaWVsZC5taW5WYWx1ZS50b0xvY2FsZVN0cmluZygpKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1heFZhbHVlRmllbGRWYWxpZGF0b3IgaW1wbGVtZW50cyBGb3JtRmllbGRWYWxpZGF0b3Ige1xuXG4gICAgcHJpdmF0ZSBzdXBwb3J0ZWRUeXBlcyA9IFtcbiAgICAgICAgRm9ybUZpZWxkVHlwZXMuTlVNQkVSLFxuICAgICAgICBGb3JtRmllbGRUeXBlcy5BTU9VTlRcbiAgICBdO1xuXG4gICAgaXNTdXBwb3J0ZWQoZmllbGQ6IEZvcm1GaWVsZE1vZGVsKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBmaWVsZCAmJlxuICAgICAgICAgICAgdGhpcy5zdXBwb3J0ZWRUeXBlcy5pbmRleE9mKGZpZWxkLnR5cGUpID4gLTEgJiZcbiAgICAgICAgICAgIE51bWJlckZpZWxkVmFsaWRhdG9yLmlzTnVtYmVyKGZpZWxkLm1heFZhbHVlKTtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZShmaWVsZDogRm9ybUZpZWxkTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdXBwb3J0ZWQoZmllbGQpICYmIGZpZWxkLnZhbHVlICYmIGZpZWxkLmlzVmlzaWJsZSkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWU6IG51bWJlciA9ICtmaWVsZC52YWx1ZTtcbiAgICAgICAgICAgIGNvbnN0IG1heFZhbHVlOiBudW1iZXIgPSArZmllbGQubWF4VmFsdWU7XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSA8PSBtYXhWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmllbGQudmFsaWRhdGlvblN1bW1hcnkubWVzc2FnZSA9IGBGT1JNLkZJRUxELlZBTElEQVRPUi5OT1RfR1JFQVRFUl9USEFOYDtcbiAgICAgICAgICAgIGZpZWxkLnZhbGlkYXRpb25TdW1tYXJ5LmF0dHJpYnV0ZXMuc2V0KCdtYXhWYWx1ZScsIGZpZWxkLm1heFZhbHVlLnRvTG9jYWxlU3RyaW5nKCkpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUmVnRXhGaWVsZFZhbGlkYXRvciBpbXBsZW1lbnRzIEZvcm1GaWVsZFZhbGlkYXRvciB7XG5cbiAgICBwcml2YXRlIHN1cHBvcnRlZFR5cGVzID0gW1xuICAgICAgICBGb3JtRmllbGRUeXBlcy5URVhULFxuICAgICAgICBGb3JtRmllbGRUeXBlcy5NVUxUSUxJTkVfVEVYVFxuICAgIF07XG5cbiAgICBpc1N1cHBvcnRlZChmaWVsZDogRm9ybUZpZWxkTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkICYmXG4gICAgICAgICAgICB0aGlzLnN1cHBvcnRlZFR5cGVzLmluZGV4T2YoZmllbGQudHlwZSkgPiAtMSAmJiAhIWZpZWxkLnJlZ2V4UGF0dGVybjtcbiAgICB9XG5cbiAgICB2YWxpZGF0ZShmaWVsZDogRm9ybUZpZWxkTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdXBwb3J0ZWQoZmllbGQpICYmIGZpZWxkLnZhbHVlICYmIGZpZWxkLmlzVmlzaWJsZSkge1xuICAgICAgICAgICAgaWYgKGZpZWxkLnZhbHVlLmxlbmd0aCA+IDAgJiYgZmllbGQudmFsdWUubWF0Y2gobmV3IFJlZ0V4cCgnXicgKyBmaWVsZC5yZWdleFBhdHRlcm4gKyAnJCcpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmllbGQudmFsaWRhdGlvblN1bW1hcnkubWVzc2FnZSA9ICdGT1JNLkZJRUxELlZBTElEQVRPUi5JTlZBTElEX1ZBTFVFJztcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIEZpeGVkVmFsdWVGaWVsZFZhbGlkYXRvciBpbXBsZW1lbnRzIEZvcm1GaWVsZFZhbGlkYXRvciB7XG5cbiAgICBwcml2YXRlIHN1cHBvcnRlZFR5cGVzID0gW1xuICAgICAgICBGb3JtRmllbGRUeXBlcy5UWVBFQUhFQURcbiAgICBdO1xuXG4gICAgaXNTdXBwb3J0ZWQoZmllbGQ6IEZvcm1GaWVsZE1vZGVsKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBmaWVsZCAmJiB0aGlzLnN1cHBvcnRlZFR5cGVzLmluZGV4T2YoZmllbGQudHlwZSkgPiAtMTtcbiAgICB9XG5cbiAgICBoYXNWYWxpZE5hbWVPclZhbGlkSWQoZmllbGQ6IEZvcm1GaWVsZE1vZGVsKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc1ZhbGlkTmFtZShmaWVsZCkgfHwgdGhpcy5oYXNWYWxpZElkKGZpZWxkKTtcbiAgICB9XG5cbiAgICBoYXNWYWxpZE5hbWUoZmllbGQ6IEZvcm1GaWVsZE1vZGVsKSB7XG4gICAgICAgIHJldHVybiBmaWVsZC5vcHRpb25zLmZpbmQoKGl0ZW0pID0+IGl0ZW0ubmFtZSAmJiBpdGVtLm5hbWUudG9Mb2NhbGVMb3dlckNhc2UoKSA9PT0gZmllbGQudmFsdWUudG9Mb2NhbGVMb3dlckNhc2UoKSkgPyB0cnVlIDogZmFsc2U7XG4gICAgfVxuXG4gICAgaGFzVmFsaWRJZChmaWVsZDogRm9ybUZpZWxkTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkLm9wdGlvbnMuZmluZCgoaXRlbSkgPT4gaXRlbS5pZCA9PT0gZmllbGQudmFsdWUpID8gdHJ1ZSA6IGZhbHNlO1xuICAgIH1cblxuICAgIGhhc1N0cmluZ1ZhbHVlKGZpZWxkOiBGb3JtRmllbGRNb2RlbCkge1xuICAgICAgICByZXR1cm4gZmllbGQudmFsdWUgJiYgdHlwZW9mIGZpZWxkLnZhbHVlID09PSAnc3RyaW5nJztcbiAgICB9XG5cbiAgICBoYXNPcHRpb25zKGZpZWxkOiBGb3JtRmllbGRNb2RlbCkge1xuICAgICAgICByZXR1cm4gZmllbGQub3B0aW9ucyAmJiBmaWVsZC5vcHRpb25zLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgdmFsaWRhdGUoZmllbGQ6IEZvcm1GaWVsZE1vZGVsKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmlzU3VwcG9ydGVkKGZpZWxkKSAmJiBmaWVsZC5pc1Zpc2libGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc1N0cmluZ1ZhbHVlKGZpZWxkKSAmJiB0aGlzLmhhc09wdGlvbnMoZmllbGQpICYmICF0aGlzLmhhc1ZhbGlkTmFtZU9yVmFsaWRJZChmaWVsZCkpIHtcbiAgICAgICAgICAgICAgICBmaWVsZC52YWxpZGF0aW9uU3VtbWFyeS5tZXNzYWdlID0gJ0ZPUk0uRklFTEQuVkFMSURBVE9SLklOVkFMSURfVkFMVUUnO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBGT1JNX0ZJRUxEX1ZBTElEQVRPUlMgPSBbXG4gICAgbmV3IFJlcXVpcmVkRmllbGRWYWxpZGF0b3IoKSxcbiAgICBuZXcgTnVtYmVyRmllbGRWYWxpZGF0b3IoKSxcbiAgICBuZXcgTWluTGVuZ3RoRmllbGRWYWxpZGF0b3IoKSxcbiAgICBuZXcgTWF4TGVuZ3RoRmllbGRWYWxpZGF0b3IoKSxcbiAgICBuZXcgTWluVmFsdWVGaWVsZFZhbGlkYXRvcigpLFxuICAgIG5ldyBNYXhWYWx1ZUZpZWxkVmFsaWRhdG9yKCksXG4gICAgbmV3IFJlZ0V4RmllbGRWYWxpZGF0b3IoKSxcbiAgICBuZXcgRGF0ZUZpZWxkVmFsaWRhdG9yKCksXG4gICAgbmV3IE1pbkRhdGVGaWVsZFZhbGlkYXRvcigpLFxuICAgIG5ldyBNYXhEYXRlRmllbGRWYWxpZGF0b3IoKSxcbiAgICBuZXcgRml4ZWRWYWx1ZUZpZWxkVmFsaWRhdG9yKCksXG4gICAgbmV3IE1pbkRhdGVUaW1lRmllbGRWYWxpZGF0b3IoKSxcbiAgICBuZXcgTWF4RGF0ZVRpbWVGaWVsZFZhbGlkYXRvcigpXG5dO1xuIl19
