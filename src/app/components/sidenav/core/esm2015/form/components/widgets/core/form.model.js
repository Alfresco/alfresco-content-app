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
import { FormFieldEvent } from './../../../events/form-field.event';
import { ValidateFormFieldEvent } from './../../../events/validate-form-field.event';
import { ValidateFormEvent } from './../../../events/validate-form.event';
import { ContainerModel } from './container.model';
import { FormFieldTypes } from './form-field-types';
import { FormFieldModel } from './form-field.model';
import { TabModel } from './tab.model';
import { FormOutcomeModel } from './form-outcome.model';
import { FORM_FIELD_VALIDATORS } from './form-field-validator';
/**
 * @record
 */
export function FormRepresentationModel() {}
if (false) {
  /** @type {?|undefined} */
  FormRepresentationModel.prototype.id;
  /** @type {?|undefined} */
  FormRepresentationModel.prototype.name;
  /** @type {?|undefined} */
  FormRepresentationModel.prototype.taskId;
  /** @type {?|undefined} */
  FormRepresentationModel.prototype.taskName;
  /** @type {?|undefined} */
  FormRepresentationModel.prototype.processDefinitionId;
  /** @type {?|undefined} */
  FormRepresentationModel.prototype.customFieldTemplates;
  /** @type {?|undefined} */
  FormRepresentationModel.prototype.selectedOutcome;
  /** @type {?|undefined} */
  FormRepresentationModel.prototype.fields;
  /** @type {?|undefined} */
  FormRepresentationModel.prototype.tabs;
  /** @type {?|undefined} */
  FormRepresentationModel.prototype.outcomes;
  /** @type {?|undefined} */
  FormRepresentationModel.prototype.formDefinition;
  /* Skipping unhandled member: [key: string]: any;*/
}
export class FormModel {
  /**
   * @param {?=} json
   * @param {?=} formValues
   * @param {?=} readOnly
   * @param {?=} formService
   */
  constructor(json, formValues, readOnly = false, formService) {
    this.formService = formService;
    this.taskName = FormModel.UNSET_TASK_NAME;
    this.values = {};
    this.tabs = [];
    this.fields = [];
    this.outcomes = [];
    this.fieldValidators = [...FORM_FIELD_VALIDATORS];
    this.customFieldTemplates = {};
    this.readOnly = false;
    this.isValid = true;
    this.processVariables = [];
    this.variables = [];
    this.readOnly = readOnly;
    this.json = json;
    if (json) {
      this.id = json.id;
      this.name = json.name;
      this.taskId = json.taskId;
      this.taskName = json.taskName || json.name || FormModel.UNSET_TASK_NAME;
      this.processDefinitionId = json.processDefinitionId;
      this.customFieldTemplates = json.customFieldTemplates || {};
      this.selectedOutcome = json.selectedOutcome;
      this.className = json.className || '';
      this.variables = json.variables || [];
      this.processVariables = json.processVariables || [];
      /** @type {?} */
      const tabCache = {};
      this.tabs = (json.tabs || []).map(
        /**
         * @param {?} tabJson
         * @return {?}
         */
        tabJson => {
          /** @type {?} */
          const model = new TabModel(this, tabJson);
          tabCache[model.id] = model;
          return model;
        }
      );
      this.fields = this.parseRootFields(json);
      if (formValues) {
        this.loadData(formValues);
      }
      for (let i = 0; i < this.fields.length; i++) {
        /** @type {?} */
        const field = this.fields[i];
        if (field.tab) {
          /** @type {?} */
          const tab = tabCache[field.tab];
          if (tab) {
            tab.fields.push(field);
          }
        }
      }
      this.parseOutcomes();
    }
    this.validateForm();
  }
  /**
   * @param {?} field
   * @return {?}
   */
  onFormFieldChanged(field) {
    this.validateField(field);
    if (this.formService) {
      this.formService.formFieldValueChanged.next(
        new FormFieldEvent(this, field)
      );
    }
  }
  /**
   * Validates entire form and all form fields.
   *
   * \@memberof FormModel
   * @return {?}
   */
  validateForm() {
    /** @type {?} */
    const validateFormEvent = new ValidateFormEvent(this);
    /** @type {?} */
    const errorsField = [];
    /** @type {?} */
    const fields = this.getFormFields();
    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].validate()) {
        errorsField.push(fields[i]);
      }
    }
    this.isValid = errorsField.length > 0 ? false : true;
    if (this.formService) {
      validateFormEvent.isValid = this.isValid;
      validateFormEvent.errorsField = errorsField;
      this.formService.validateForm.next(validateFormEvent);
    }
  }
  /**
   * Validates a specific form field, triggers form validation.
   *
   * \@memberof FormModel
   * @param {?} field Form field to validate.
   * @return {?}
   */
  validateField(field) {
    if (!field) {
      return;
    }
    /** @type {?} */
    const validateFieldEvent = new ValidateFormFieldEvent(this, field);
    if (this.formService) {
      this.formService.validateFormField.next(validateFieldEvent);
    }
    if (!validateFieldEvent.isValid) {
      this.markAsInvalid();
      return;
    }
    if (validateFieldEvent.defaultPrevented) {
      return;
    }
    if (!field.validate()) {
      this.markAsInvalid();
    }
    this.validateForm();
  }
  // Activiti supports 3 types of root fields: container|group|dynamic-table
  /**
   * @private
   * @param {?} json
   * @return {?}
   */
  parseRootFields(json) {
    /** @type {?} */
    let fields = [];
    if (json.fields) {
      fields = json.fields;
    } else if (json.formDefinition && json.formDefinition.fields) {
      fields = json.formDefinition.fields;
    }
    /** @type {?} */
    const formWidgetModel = [];
    for (const field of fields) {
      if (field.type === FormFieldTypes.DISPLAY_VALUE) {
        // workaround for dynamic table on a completed/readonly form
        if (field.params) {
          /** @type {?} */
          const originalField = field.params['field'];
          if (originalField.type === FormFieldTypes.DYNAMIC_TABLE) {
            formWidgetModel.push(
              new ContainerModel(new FormFieldModel(this, field))
            );
          }
        }
      } else {
        formWidgetModel.push(
          new ContainerModel(new FormFieldModel(this, field))
        );
      }
    }
    return formWidgetModel;
  }
  // Loads external data and overrides field values
  // Typically used when form definition and form data coming from different sources
  /**
   * @private
   * @param {?} formValues
   * @return {?}
   */
  loadData(formValues) {
    for (const field of this.getFormFields()) {
      /** @type {?} */
      const variableId = `variables.${field.name}`;
      if (formValues[variableId] || formValues[field.id]) {
        field.json.value = formValues[variableId] || formValues[field.id];
        field.value = field.parseValue(field.json);
      }
    }
  }
  /**
   * Returns a form variable that matches the identifier.
   * @param {?} identifier The `name` or `id` value.
   * @return {?}
   */
  getFormVariable(identifier) {
    if (identifier) {
      return this.variables.find(
        /**
         * @param {?} variable
         * @return {?}
         */
        variable => variable.name === identifier || variable.id === identifier
      );
    }
    return undefined;
  }
  /**
   * Returns a value of the form variable that matches the identifier.
   * Provides additional conversion of types (date, boolean).
   * @param {?} identifier The `name` or `id` value
   * @return {?}
   */
  getFormVariableValue(identifier) {
    /** @type {?} */
    const variable = this.getFormVariable(identifier);
    if (variable && variable.hasOwnProperty('value')) {
      return this.parseValue(variable.type, variable.value);
    }
    return undefined;
  }
  /**
   * Returns a process variable value.
   * @param {?} name Variable name
   * @return {?}
   */
  getProcessVariableValue(name) {
    if (this.processVariables) {
      /** @type {?} */
      const names = [`variables.${name}`, name];
      /** @type {?} */
      const variable = this.processVariables.find(
        /**
         * @param {?} entry
         * @return {?}
         */
        (entry => names.includes(entry.name))
      );
      if (variable) {
        return this.parseValue(variable.type, variable.value);
      }
    }
    return undefined;
  }
  /**
   * @protected
   * @param {?} type
   * @param {?} value
   * @return {?}
   */
  parseValue(type, value) {
    if (type && value) {
      switch (type) {
        case 'date':
          return value ? `${value}T00:00:00.000Z` : undefined;
        case 'boolean':
          return typeof value === 'string' ? JSON.parse(value) : value;
        default:
          return value;
      }
    }
    return value;
  }
  /**
   * @return {?}
   */
  hasTabs() {
    return this.tabs && this.tabs.length > 0;
  }
  /**
   * @return {?}
   */
  hasFields() {
    return this.fields && this.fields.length > 0;
  }
  /**
   * @return {?}
   */
  hasOutcomes() {
    return this.outcomes && this.outcomes.length > 0;
  }
  /**
   * @param {?} fieldId
   * @return {?}
   */
  getFieldById(fieldId) {
    return this.getFormFields().find(
      /**
       * @param {?} field
       * @return {?}
       */
      field => field.id === fieldId
    );
  }
  /**
   * @return {?}
   */
  getFormFields() {
    /** @type {?} */
    const formFieldModel = [];
    for (let i = 0; i < this.fields.length; i++) {
      /** @type {?} */
      const field = this.fields[i];
      if (field instanceof ContainerModel) {
        /** @type {?} */
        const container = /** @type {?} */ (field);
        formFieldModel.push(container.field);
        container.field.columns.forEach(
          /**
           * @param {?} column
           * @return {?}
           */
          column => {
            formFieldModel.push(...column.fields);
          }
        );
      }
    }
    return formFieldModel;
  }
  /**
   * @return {?}
   */
  markAsInvalid() {
    this.isValid = false;
  }
  /**
   * @protected
   * @return {?}
   */
  parseOutcomes() {
    if (this.json.fields) {
      /** @type {?} */
      const saveOutcome = new FormOutcomeModel(/** @type {?} */ (this), {
        id: FormModel.SAVE_OUTCOME,
        name: 'SAVE',
        isSystem: true
      });
      /** @type {?} */
      const completeOutcome = new FormOutcomeModel(/** @type {?} */ (this), {
        id: FormModel.COMPLETE_OUTCOME,
        name: 'COMPLETE',
        isSystem: true
      });
      /** @type {?} */
      const startProcessOutcome = new FormOutcomeModel(
        /** @type {?} */ (this),
        {
          id: FormModel.START_PROCESS_OUTCOME,
          name: 'START PROCESS',
          isSystem: true
        }
      );
      /** @type {?} */
      const customOutcomes = (this.json.outcomes || []).map(
        /**
         * @param {?} obj
         * @return {?}
         */
        (obj => new FormOutcomeModel(/** @type {?} */ (this), obj))
      );
      this.outcomes = [saveOutcome].concat(
        customOutcomes.length > 0
          ? customOutcomes
          : [completeOutcome, startProcessOutcome]
      );
    }
  }
}
FormModel.UNSET_TASK_NAME = 'Nameless task';
FormModel.SAVE_OUTCOME = '$save';
FormModel.COMPLETE_OUTCOME = '$complete';
FormModel.START_PROCESS_OUTCOME = '$startProcess';
if (false) {
  /** @type {?} */
  FormModel.UNSET_TASK_NAME;
  /** @type {?} */
  FormModel.SAVE_OUTCOME;
  /** @type {?} */
  FormModel.COMPLETE_OUTCOME;
  /** @type {?} */
  FormModel.START_PROCESS_OUTCOME;
  /** @type {?} */
  FormModel.prototype.id;
  /** @type {?} */
  FormModel.prototype.name;
  /** @type {?} */
  FormModel.prototype.taskId;
  /** @type {?} */
  FormModel.prototype.taskName;
  /** @type {?} */
  FormModel.prototype.processDefinitionId;
  /** @type {?} */
  FormModel.prototype.selectedOutcome;
  /** @type {?} */
  FormModel.prototype.json;
  /** @type {?} */
  FormModel.prototype.nodeId;
  /** @type {?} */
  FormModel.prototype.contentHost;
  /** @type {?} */
  FormModel.prototype.values;
  /** @type {?} */
  FormModel.prototype.tabs;
  /** @type {?} */
  FormModel.prototype.fields;
  /** @type {?} */
  FormModel.prototype.outcomes;
  /** @type {?} */
  FormModel.prototype.fieldValidators;
  /** @type {?} */
  FormModel.prototype.customFieldTemplates;
  /** @type {?} */
  FormModel.prototype.className;
  /** @type {?} */
  FormModel.prototype.readOnly;
  /** @type {?} */
  FormModel.prototype.isValid;
  /** @type {?} */
  FormModel.prototype.processVariables;
  /** @type {?} */
  FormModel.prototype.variables;
  /**
   * @type {?}
   * @protected
   */
  FormModel.prototype.formService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImZvcm0vY29tcG9uZW50cy93aWRnZXRzL2NvcmUvZm9ybS5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDcEUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDckYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFFMUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFHcEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUl2QyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RCxPQUFPLEVBQXNCLHFCQUFxQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7Ozs7QUFHbkYsNkNBbUJDOzs7SUFoQkcscUNBQXFCOztJQUNyQix1Q0FBYzs7SUFDZCx5Q0FBZ0I7O0lBQ2hCLDJDQUFrQjs7SUFDbEIsc0RBQTZCOztJQUM3Qix1REFFRTs7SUFDRixrREFBeUI7O0lBQ3pCLHlDQUFlOztJQUNmLHVDQUFhOztJQUNiLDJDQUFpQjs7SUFDakIsaURBR0U7OztBQUdOLE1BQU0sT0FBTyxTQUFTOzs7Ozs7O0lBOEJsQixZQUFZLElBQVUsRUFBRSxVQUF1QixFQUFFLFdBQW9CLEtBQUssRUFBWSxXQUF5QjtRQUF6QixnQkFBVyxHQUFYLFdBQVcsQ0FBYztRQXBCdEcsYUFBUSxHQUFHLFNBQVMsQ0FBQyxlQUFlLENBQUM7UUFPOUMsV0FBTSxHQUFlLEVBQUUs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QUFXLGVBQWUsQ0FBQzs7O0lBSHZELDBCQUFpRDs7SUFDakQsdUJBQXNDOztJQUN0QywyQkFBOEM7O0lBQzlDLGdDQUF1RDs7SUFFdkQsdUJBQTZCOztJQUM3Qix5QkFBc0I7O0lBQ3RCLDJCQUF3Qjs7SUFDeEIsNkJBQThDOztJQUM5Qyx3Q0FBcUM7O0lBQ3JDLG9DQUFpQzs7SUFFakMseUJBQVU7O0lBQ1YsMkJBQWU7O0lBQ2YsZ0NBQW9COztJQUNwQiwyQkFBd0I7O0lBQ3hCLHlCQUFzQjs7SUFDdEIsMkJBQStCOztJQUMvQiw2QkFBa0M7O0lBQ2xDLG9DQUFtRTs7SUFDbkUseUNBQThDOztJQUU5Qyw4QkFBa0I7O0lBQ2xCLDZCQUFpQjs7SUFDakIsNEJBQWU7O0lBQ2YscUNBQThDOztJQUM5Qyw4QkFBb0M7Ozs7O0lBRXdDLGdDQUFtQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEZvcm1GaWVsZEV2ZW50IH0gZnJvbSAnLi8uLi8uLi8uLi9ldmVudHMvZm9ybS1maWVsZC5ldmVudCc7XG5pbXBvcnQgeyBWYWxpZGF0ZUZvcm1GaWVsZEV2ZW50IH0gZnJvbSAnLi8uLi8uLi8uLi9ldmVudHMvdmFsaWRhdGUtZm9ybS1maWVsZC5ldmVudCc7XG5pbXBvcnQgeyBWYWxpZGF0ZUZvcm1FdmVudCB9IGZyb20gJy4vLi4vLi4vLi4vZXZlbnRzL3ZhbGlkYXRlLWZvcm0uZXZlbnQnO1xuaW1wb3J0IHsgRm9ybVNlcnZpY2UgfSBmcm9tICcuLy4uLy4uLy4uL3NlcnZpY2VzL2Zvcm0uc2VydmljZSc7XG5pbXBvcnQgeyBDb250YWluZXJNb2RlbCB9IGZyb20gJy4vY29udGFpbmVyLm1vZGVsJztcbmltcG9ydCB7IEZvcm1GaWVsZFR5cGVzIH0gZnJvbSAnLi9mb3JtLWZpZWxkLXR5cGVzJztcbmltcG9ydCB7IEZvcm1GaWVsZE1vZGVsIH0gZnJvbSAnLi9mb3JtLWZpZWxkLm1vZGVsJztcbmltcG9ydCB7IEZvcm1WYWx1ZXMgfSBmcm9tICcuL2Zvcm0tdmFsdWVzJztcbmltcG9ydCB7IEZvcm1XaWRnZXRNb2RlbCwgRm9ybVdpZGdldE1vZGVsQ2FjaGUgfSBmcm9tICcuL2Zvcm0td2lkZ2V0Lm1vZGVsJztcbmltcG9ydCB7IFRhYk1vZGVsIH0gZnJvbSAnLi90YWIubW9kZWwnO1xuXG5pbXBvcnQgeyBGb3JtVmFyaWFibGVNb2RlbCB9IGZyb20gJy4vZm9ybS12YXJpYWJsZS5tb2RlbCc7XG5pbXBvcnQgeyBQcm9jZXNzVmFyaWFibGVNb2RlbCB9IGZyb20gJy4vcHJvY2Vzcy12YXJpYWJsZS5tb2RlbCc7XG5pbXBvcnQgeyBGb3JtT3V0Y29tZU1vZGVsIH0gZnJvbSAnLi9mb3JtLW91dGNvbWUubW9kZWwnO1xuaW1wb3J0IHsgRm9ybUZpZWxkVmFsaWRhdG9yLCBGT1JNX0ZJRUxEX1ZBTElEQVRPUlMgfSBmcm9tICcuL2Zvcm0tZmllbGQtdmFsaWRhdG9yJztcbmltcG9ydCB7IEZvcm1GaWVsZFRlbXBsYXRlcyB9IGZyb20gJy4vZm9ybS1maWVsZC10ZW1wbGF0ZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZvcm1SZXByZXNlbnRhdGlvbk1vZGVsIHtcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XG5cbiAgICBpZD86IHN0cmluZyB8IG51bWJlcjtcbiAgICBuYW1lPzogc3RyaW5nO1xuICAgIHRhc2tJZD86IHN0cmluZztcbiAgICB0YXNrTmFtZT86IHN0cmluZztcbiAgICBwcm9jZXNzRGVmaW5pdGlvbklkPzogc3RyaW5nO1xuICAgIGN1c3RvbUZpZWxkVGVtcGxhdGVzPzoge1xuICAgICAgICBba2V5OiBzdHJpbmddOiBzdHJpbmdcbiAgICB9O1xuICAgIHNlbGVjdGVkT3V0Y29tZT86IHN0cmluZztcbiAgICBmaWVsZHM/OiBhbnlbXTtcbiAgICB0YWJzPzogYW55W107XG4gICAgb3V0Y29tZXM/OiBhbnlbXTtcbiAgICBmb3JtRGVmaW5pdGlvbj86IHtcbiAgICAgICAgW2tleTogc3RyaW5nXTogYW55O1xuICAgICAgICBmaWVsZHM/OiBhbnlbXTtcbiAgICB9O1xufVxuXG5leHBvcnQgY2xhc3MgRm9ybU1vZGVsIHtcblxuICAgIHN0YXRpYyBVTlNFVF9UQVNLX05BTUU6IHN0cmluZyA9ICdOYW1lbGVzcyB0YXNrJztcbiAgICBzdGF0aWMgU0FWRV9PVVRDT01FOiBzdHJpbmcgPSAnJHNhdmUnO1xuICAgIHN0YXRpYyBDT01QTEVURV9PVVRDT01FOiBzdHJpbmcgPSAnJGNvbXBsZXRlJztcbiAgICBzdGF0aWMgU1RBUlRfUFJPQ0VTU19PVVRDT01FOiBzdHJpbmcgPSAnJHN0YXJ0UHJvY2Vzcyc7XG5cbiAgICByZWFkb25seSBpZDogc3RyaW5nIHwgbnVtYmVyO1xuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbiAgICByZWFkb25seSB0YXNrSWQ6IHN0cmluZztcbiAgICByZWFkb25seSB0YXNrTmFtZSA9IEZvcm1Nb2RlbC5VTlNFVF9UQVNLX05BTUU7XG4gICAgcmVhZG9ubHkgcHJvY2Vzc0RlZmluaXRpb25JZDogc3RyaW5nO1xuICAgIHJlYWRvbmx5IHNlbGVjdGVkT3V0Y29tZTogc3RyaW5nO1xuXG4gICAganNvbjogYW55O1xuICAgIG5vZGVJZDogc3RyaW5nO1xuICAgIGNvbnRlbnRIb3N0OiBzdHJpbmc7XG4gICAgdmFsdWVzOiBGb3JtVmFsdWVzID0ge307XG4gICAgdGFiczogVGFiTW9kZWxbXSA9IFtdO1xuICAgIGZpZWxkczogRm9ybVdpZGdldE1vZGVsW10gPSBbXTtcbiAgICBvdXRjb21lczogRm9ybU91dGNvbWVNb2RlbFtdID0gW107XG4gICAgZmllbGRWYWxpZGF0b3JzOiBGb3JtRmllbGRWYWxpZGF0b3JbXSA9IFsuLi5GT1JNX0ZJRUxEX1ZBTElEQVRPUlNdO1xuICAgIGN1c3RvbUZpZWxkVGVtcGxhdGVzOiBGb3JtRmllbGRUZW1wbGF0ZXMgPSB7fTtcblxuICAgIGNsYXNzTmFtZTogc3RyaW5nO1xuICAgIHJlYWRPbmx5ID0gZmFsc2U7XG4gICAgaXNWYWxpZCA9IHRydWU7XG4gICAgcHJvY2Vzc1ZhcmlhYmxlczogUHJvY2Vzc1ZhcmlhYmxlTW9kZWxbXSA9IFtdO1xuICAgIHZhcmlhYmxlczogRm9ybVZhcmlhYmxlTW9kZWxbXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoanNvbj86IGFueSwgZm9ybVZhbHVlcz86IEZvcm1WYWx1ZXMsIHJlYWRPbmx5OiBib29sZWFuID0gZmFsc2UsIHByb3RlY3RlZCBmb3JtU2VydmljZT86IEZvcm1TZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMucmVhZE9ubHkgPSByZWFkT25seTtcbiAgICAgICAgdGhpcy5qc29uID0ganNvbjtcblxuICAgICAgICBpZiAoanNvbikge1xuICAgICAgICAgICAgdGhpcy5pZCA9IGpzb24uaWQ7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBqc29uLm5hbWU7XG4gICAgICAgICAgICB0aGlzLnRhc2tJZCA9IGpzb24udGFza0lkO1xuICAgICAgICAgICAgdGhpcy50YXNrTmFtZSA9IGpzb24udGFza05hbWUgfHwganNvbi5uYW1lIHx8IEZvcm1Nb2RlbC5VTlNFVF9UQVNLX05BTUU7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NEZWZpbml0aW9uSWQgPSBqc29uLnByb2Nlc3NEZWZpbml0aW9uSWQ7XG4gICAgICAgICAgICB0aGlzLmN1c3RvbUZpZWxkVGVtcGxhdGVzID0ganNvbi5jdXN0b21GaWVsZFRlbXBsYXRlcyB8fCB7fTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRPdXRjb21lID0ganNvbi5zZWxlY3RlZE91dGNvbWU7XG4gICAgICAgICAgICB0aGlzLmNsYXNzTmFtZSA9IGpzb24uY2xhc3NOYW1lIHx8ICcnO1xuICAgICAgICAgICAgdGhpcy52YXJpYWJsZXMgPSBqc29uLnZhcmlhYmxlcyB8fCBbXTtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc1ZhcmlhYmxlcyA9IGpzb24ucHJvY2Vzc1ZhcmlhYmxlcyB8fCBbXTtcblxuICAgICAgICAgICAgY29uc3QgdGFiQ2FjaGU6IEZvcm1XaWRnZXRNb2RlbENhY2hlPFRhYk1vZGVsPiA9IHt9O1xuXG4gICAgICAgICAgICB0aGlzLnRhYnMgPSAoanNvbi50YWJzIHx8IFtdKS5tYXAoKHRhYkpzb24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBtb2RlbCA9IG5ldyBUYWJNb2RlbCh0aGlzLCB0YWJKc29uKTtcbiAgICAgICAgICAgICAgICB0YWJDYWNoZVttb2RlbC5pZF0gPSBtb2RlbDtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5maWVsZHMgPSB0aGlzLnBhcnNlUm9vdEZpZWxkcyhqc29uKTtcblxuICAgICAgICAgICAgaWYgKGZvcm1WYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWREYXRhKGZvcm1WYWx1ZXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZmllbGRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLmZpZWxkc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoZmllbGQudGFiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhYiA9IHRhYkNhY2hlW2ZpZWxkLnRhYl07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYi5maWVsZHMucHVzaChmaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucGFyc2VPdXRjb21lcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy52YWxpZGF0ZUZvcm0oKTtcbiAgICB9XG5cbiAgICBvbkZvcm1GaWVsZENoYW5nZWQoZmllbGQ6IEZvcm1GaWVsZE1vZGVsKSB7XG4gICAgICAgIHRoaXMudmFsaWRhdGVGaWVsZChmaWVsZCk7XG5cbiAgICAgICAgaWYgKHRoaXMuZm9ybVNlcnZpY2UpIHtcbiAgICAgICAgICAgIHRoaXMuZm9ybVNlcnZpY2UuZm9ybUZpZWxkVmFsdWVDaGFuZ2VkLm5leHQobmV3IEZvcm1GaWVsZEV2ZW50KHRoaXMsIGZpZWxkKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGF0ZXMgZW50aXJlIGZvcm0gYW5kIGFsbCBmb3JtIGZpZWxkcy5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJvZiBGb3JtTW9kZWxcbiAgICAgKi9cbiAgICB2YWxpZGF0ZUZvcm0oKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHZhbGlkYXRlRm9ybUV2ZW50OiBhbnkgPSBuZXcgVmFsaWRhdGVGb3JtRXZlbnQodGhpcyk7XG5cbiAgICAgICAgY29uc3QgZXJyb3JzRmllbGQ6IEZvcm1GaWVsZE1vZGVsW10gPSBbXTtcblxuICAgICAgICBjb25zdCBmaWVsZHMgPSB0aGlzLmdldEZvcm1GaWVsZHMoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICghZmllbGRzW2ldLnZhbGlkYXRlKCkpIHtcbiAgICAgICAgICAgICAgICBlcnJvcnNGaWVsZC5wdXNoKGZpZWxkc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlzVmFsaWQgPSBlcnJvcnNGaWVsZC5sZW5ndGggPiAwID8gZmFsc2UgOiB0cnVlO1xuXG4gICAgICAgIGlmICh0aGlzLmZvcm1TZXJ2aWNlKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZUZvcm1FdmVudC5pc1ZhbGlkID0gdGhpcy5pc1ZhbGlkO1xuICAgICAgICAgICAgdmFsaWRhdGVGb3JtRXZlbnQuZXJyb3JzRmllbGQgPSBlcnJvcnNGaWVsZDtcbiAgICAgICAgICAgIHRoaXMuZm9ybVNlcnZpY2UudmFsaWRhdGVGb3JtLm5leHQodmFsaWRhdGVGb3JtRXZlbnQpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGF0ZXMgYSBzcGVjaWZpYyBmb3JtIGZpZWxkLCB0cmlnZ2VycyBmb3JtIHZhbGlkYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZmllbGQgRm9ybSBmaWVsZCB0byB2YWxpZGF0ZS5cbiAgICAgKiBAbWVtYmVyb2YgRm9ybU1vZGVsXG4gICAgICovXG4gICAgdmFsaWRhdGVGaWVsZChmaWVsZDogRm9ybUZpZWxkTW9kZWwpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFmaWVsZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdmFsaWRhdGVGaWVsZEV2ZW50ID0gbmV3IFZhbGlkYXRlRm9ybUZpZWxkRXZlbnQodGhpcywgZmllbGQpO1xuXG4gICAgICAgIGlmICh0aGlzLmZvcm1TZXJ2aWNlKSB7XG4gICAgICAgICAgICB0aGlzLmZvcm1TZXJ2aWNlLnZhbGlkYXRlRm9ybUZpZWxkLm5leHQodmFsaWRhdGVGaWVsZEV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdmFsaWRhdGVGaWVsZEV2ZW50LmlzVmFsaWQpIHtcbiAgICAgICAgICAgIHRoaXMubWFya0FzSW52YWxpZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbGlkYXRlRmllbGRFdmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWZpZWxkLnZhbGlkYXRlKCkpIHtcbiAgICAgICAgICAgIHRoaXMubWFya0FzSW52YWxpZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy52YWxpZGF0ZUZvcm0oKTtcbiAgICB9XG5cbiAgICAvLyBBY3Rpdml0aSBzdXBwb3J0cyAzIHR5cGVzIG9mIHJvb3QgZmllbGRzOiBjb250YWluZXJ8Z3JvdXB8ZHluYW1pYy10YWJsZVxuICAgIHByaXZhdGUgcGFyc2VSb290RmllbGRzKGpzb246IGFueSk6IEZvcm1XaWRnZXRNb2RlbFtdIHtcbiAgICAgICAgbGV0IGZpZWxkcyA9IFtdO1xuXG4gICAgICAgIGlmIChqc29uLmZpZWxkcykge1xuICAgICAgICAgICAgZmllbGRzID0ganNvbi5maWVsZHM7XG4gICAgICAgIH0gZWxzZSBpZiAoanNvbi5mb3JtRGVmaW5pdGlvbiAmJiBqc29uLmZvcm1EZWZpbml0aW9uLmZpZWxkcykge1xuICAgICAgICAgICAgZmllbGRzID0ganNvbi5mb3JtRGVmaW5pdGlvbi5maWVsZHM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmb3JtV2lkZ2V0TW9kZWw6IEZvcm1XaWRnZXRNb2RlbFtdID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBmaWVsZHMpIHtcbiAgICAgICAgICAgIGlmIChmaWVsZC50eXBlID09PSBGb3JtRmllbGRUeXBlcy5ESVNQTEFZX1ZBTFVFKSB7XG4gICAgICAgICAgICAgICAgLy8gd29ya2Fyb3VuZCBmb3IgZHluYW1pYyB0YWJsZSBvbiBhIGNvbXBsZXRlZC9yZWFkb25seSBmb3JtXG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkLnBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbEZpZWxkID0gZmllbGQucGFyYW1zWydmaWVsZCddO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3JpZ2luYWxGaWVsZC50eXBlID09PSBGb3JtRmllbGRUeXBlcy5EWU5BTUlDX1RBQkxFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtV2lkZ2V0TW9kZWwucHVzaChuZXcgQ29udGFpbmVyTW9kZWwobmV3IEZvcm1GaWVsZE1vZGVsKHRoaXMsIGZpZWxkKSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtV2lkZ2V0TW9kZWwucHVzaChuZXcgQ29udGFpbmVyTW9kZWwobmV3IEZvcm1GaWVsZE1vZGVsKHRoaXMsIGZpZWxkKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1XaWRnZXRNb2RlbDtcbiAgICB9XG5cbiAgICAvLyBMb2FkcyBleHRlcm5hbCBkYXRhIGFuZCBvdmVycmlkZXMgZmllbGQgdmFsdWVzXG4gICAgLy8gVHlwaWNhbGx5IHVzZWQgd2hlbiBmb3JtIGRlZmluaXRpb24gYW5kIGZvcm0gZGF0YSBjb21pbmcgZnJvbSBkaWZmZXJlbnQgc291cmNlc1xuICAgIHByaXZhdGUgbG9hZERhdGEoZm9ybVZhbHVlczogRm9ybVZhbHVlcykge1xuICAgICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIHRoaXMuZ2V0Rm9ybUZpZWxkcygpKSB7XG4gICAgICAgICAgICBjb25zdCB2YXJpYWJsZUlkID0gYHZhcmlhYmxlcy4ke2ZpZWxkLm5hbWV9YDtcblxuICAgICAgICAgICAgaWYgKGZvcm1WYWx1ZXNbdmFyaWFibGVJZF0gfHwgZm9ybVZhbHVlc1tmaWVsZC5pZF0pIHtcbiAgICAgICAgICAgICAgICBmaWVsZC5qc29uLnZhbHVlID0gZm9ybVZhbHVlc1t2YXJpYWJsZUlkXSB8fCBmb3JtVmFsdWVzW2ZpZWxkLmlkXTtcbiAgICAgICAgICAgICAgICBmaWVsZC52YWx1ZSA9IGZpZWxkLnBhcnNlVmFsdWUoZmllbGQuanNvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgZm9ybSB2YXJpYWJsZSB0aGF0IG1hdGNoZXMgdGhlIGlkZW50aWZpZXIuXG4gICAgICogQHBhcmFtIGlkZW50aWZpZXIgVGhlIGBuYW1lYCBvciBgaWRgIHZhbHVlLlxuICAgICAqL1xuICAgIGdldEZvcm1WYXJpYWJsZShpZGVudGlmaWVyOiBzdHJpbmcpOiBGb3JtVmFyaWFibGVNb2RlbCB7XG4gICAgICAgIGlmIChpZGVudGlmaWVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YXJpYWJsZXMuZmluZChcbiAgICAgICAgICAgICAgICB2YXJpYWJsZSA9PlxuICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZS5uYW1lID09PSBpZGVudGlmaWVyIHx8XG4gICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlLmlkID09PSBpZGVudGlmaWVyXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHZhbHVlIG9mIHRoZSBmb3JtIHZhcmlhYmxlIHRoYXQgbWF0Y2hlcyB0aGUgaWRlbnRpZmllci5cbiAgICAgKiBQcm92aWRlcyBhZGRpdGlvbmFsIGNvbnZlcnNpb24gb2YgdHlwZXMgKGRhdGUsIGJvb2xlYW4pLlxuICAgICAqIEBwYXJhbSBpZGVudGlmaWVyIFRoZSBgbmFtZWAgb3IgYGlkYCB2YWx1ZVxuICAgICAqL1xuICAgIGdldEZvcm1WYXJpYWJsZVZhbHVlKGlkZW50aWZpZXI6IHN0cmluZyk6IGFueSB7XG4gICAgICAgIGNvbnN0IHZhcmlhYmxlID0gdGhpcy5nZXRGb3JtVmFyaWFibGUoaWRlbnRpZmllcik7XG5cbiAgICAgICAgaWYgKHZhcmlhYmxlICYmIHZhcmlhYmxlLmhhc093blByb3BlcnR5KCd2YWx1ZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVZhbHVlKHZhcmlhYmxlLnR5cGUsIHZhcmlhYmxlLnZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHByb2Nlc3MgdmFyaWFibGUgdmFsdWUuXG4gICAgICogQHBhcmFtIG5hbWUgVmFyaWFibGUgbmFtZVxuICAgICAqL1xuICAgIGdldFByb2Nlc3NWYXJpYWJsZVZhbHVlKG5hbWU6IHN0cmluZyk6IGFueSB7XG4gICAgICAgIGlmICh0aGlzLnByb2Nlc3NWYXJpYWJsZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWVzID0gW2B2YXJpYWJsZXMuJHtuYW1lfWAsIG5hbWVdO1xuXG4gICAgICAgICAgICBjb25zdCB2YXJpYWJsZSA9IHRoaXMucHJvY2Vzc1ZhcmlhYmxlcy5maW5kKFxuICAgICAgICAgICAgICAgIGVudHJ5ID0+IG5hbWVzLmluY2x1ZGVzKGVudHJ5Lm5hbWUpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVZhbHVlKHZhcmlhYmxlLnR5cGUsIHZhcmlhYmxlLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlVmFsdWUodHlwZTogc3RyaW5nLCB2YWx1ZTogYW55KTogYW55IHtcbiAgICAgICAgaWYgKHR5cGUgJiYgdmFsdWUpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgID8gYCR7dmFsdWV9VDAwOjAwOjAwLjAwMFpgXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZydcbiAgICAgICAgICAgICAgICAgICAgICAgID8gSlNPTi5wYXJzZSh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogdmFsdWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGhhc1RhYnMoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRhYnMgJiYgdGhpcy50YWJzLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgaGFzRmllbGRzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5maWVsZHMgJiYgdGhpcy5maWVsZHMubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICBoYXNPdXRjb21lcygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3V0Y29tZXMgJiYgdGhpcy5vdXRjb21lcy5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIGdldEZpZWxkQnlJZChmaWVsZElkOiBzdHJpbmcpOiBGb3JtRmllbGRNb2RlbCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEZvcm1GaWVsZHMoKS5maW5kKChmaWVsZCkgPT4gZmllbGQuaWQgPT09IGZpZWxkSWQpO1xuICAgIH1cblxuICAgIGdldEZvcm1GaWVsZHMoKTogRm9ybUZpZWxkTW9kZWxbXSB7XG4gICAgICAgIGNvbnN0IGZvcm1GaWVsZE1vZGVsOiBGb3JtRmllbGRNb2RlbFtdID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLmZpZWxkc1tpXTtcblxuICAgICAgICAgICAgaWYgKGZpZWxkIGluc3RhbmNlb2YgQ29udGFpbmVyTW9kZWwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSA8Q29udGFpbmVyTW9kZWw+IGZpZWxkO1xuICAgICAgICAgICAgICAgIGZvcm1GaWVsZE1vZGVsLnB1c2goY29udGFpbmVyLmZpZWxkKTtcblxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5maWVsZC5jb2x1bW5zLmZvckVhY2goKGNvbHVtbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBmb3JtRmllbGRNb2RlbC5wdXNoKC4uLmNvbHVtbi5maWVsZHMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1GaWVsZE1vZGVsO1xuICAgIH1cblxuICAgIG1hcmtBc0ludmFsaWQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaXNWYWxpZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU91dGNvbWVzKCkge1xuICAgICAgICBpZiAodGhpcy5qc29uLmZpZWxkcykge1xuICAgICAgICAgICAgY29uc3Qgc2F2ZU91dGNvbWUgPSBuZXcgRm9ybU91dGNvbWVNb2RlbCg8YW55PiB0aGlzLCB7XG4gICAgICAgICAgICAgICAgaWQ6IEZvcm1Nb2RlbC5TQVZFX09VVENPTUUsXG4gICAgICAgICAgICAgICAgbmFtZTogJ1NBVkUnLFxuICAgICAgICAgICAgICAgIGlzU3lzdGVtOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBsZXRlT3V0Y29tZSA9IG5ldyBGb3JtT3V0Y29tZU1vZGVsKDxhbnk+IHRoaXMsIHtcbiAgICAgICAgICAgICAgICBpZDogRm9ybU1vZGVsLkNPTVBMRVRFX09VVENPTUUsXG4gICAgICAgICAgICAgICAgbmFtZTogJ0NPTVBMRVRFJyxcbiAgICAgICAgICAgICAgICBpc1N5c3RlbTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBzdGFydFByb2Nlc3NPdXRjb21lID0gbmV3IEZvcm1PdXRjb21lTW9kZWwoPGFueT4gdGhpcywge1xuICAgICAgICAgICAgICAgIGlkOiBGb3JtTW9kZWwuU1RBUlRfUFJPQ0VTU19PVVRDT01FLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdTVEFSVCBQUk9DRVNTJyxcbiAgICAgICAgICAgICAgICBpc1N5c3RlbTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGN1c3RvbU91dGNvbWVzID0gKHRoaXMuanNvbi5vdXRjb21lcyB8fCBbXSkubWFwKFxuICAgICAgICAgICAgICAgIChvYmopID0+IG5ldyBGb3JtT3V0Y29tZU1vZGVsKDxhbnk+IHRoaXMsIG9iailcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRoaXMub3V0Y29tZXMgPSBbc2F2ZU91dGNvbWVdLmNvbmNhdChcbiAgICAgICAgICAgICAgICBjdXN0b21PdXRjb21lcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgID8gY3VzdG9tT3V0Y29tZXNcbiAgICAgICAgICAgICAgICAgICAgOiBbY29tcGxldGVPdXRjb21lLCBzdGFydFByb2Nlc3NPdXRjb21lXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
