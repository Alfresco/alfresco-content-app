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
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { LogService } from '../../services/log.service';
import { Injectable } from '@angular/core';
import { Observable, Subject, from, of, throwError } from 'rxjs';
import { FormDefinitionModel } from '../models/form-definition.model';
import {
  FormModel,
  FormOutcomeModel
} from './../components/widgets/core/index';
import { EcmModelService } from './ecm-model.service';
import {
  map,
  catchError,
  switchMap,
  combineAll,
  defaultIfEmpty
} from 'rxjs/operators';
import * as i0 from '@angular/core';
import * as i1 from './ecm-model.service';
import * as i2 from '../../services/alfresco-api.service';
import * as i3 from '../../services/log.service';
export class FormService {
  /**
   * @param {?} ecmModelService
   * @param {?} apiService
   * @param {?} logService
   */
  constructor(ecmModelService, apiService, logService) {
    this.ecmModelService = ecmModelService;
    this.apiService = apiService;
    this.logService = logService;
    this.formLoaded = new Subject();
    this.formDataRefreshed = new Subject();
    this.formFieldValueChanged = new Subject();
    this.formEvents = new Subject();
    this.taskCompleted = new Subject();
    this.taskCompletedError = new Subject();
    this.taskSaved = new Subject();
    this.taskSavedError = new Subject();
    this.formContentClicked = new Subject();
    this.validateForm = new Subject();
    this.validateFormField = new Subject();
    this.validateDynamicTableRow = new Subject();
    this.executeOutcome = new Subject();
  }
  /**
   * @private
   * @return {?}
   */
  get taskApi() {
    return this.apiService.getInstance().activiti.taskApi;
  }
  /**
   * @private
   * @return {?}
   */
  get modelsApi() {
    return this.apiService.getInstance().activiti.modelsApi;
  }
  /**
   * @private
   * @return {?}
   */
  get editorApi() {
    return this.apiService.getInstance().activiti.editorApi;
  }
  /**
   * @private
   * @return {?}
   */
  get processApi() {
    return this.apiService.getInstance().activiti.processApi;
  }
  /**
   * @private
   * @return {?}
   */
  get processInstanceVariablesApi() {
    return this.apiService.getInstance().activiti.processInstanceVariablesApi;
  }
  /**
   * @private
   * @return {?}
   */
  get usersWorkflowApi() {
    return this.apiService.getInstance().activiti.usersWorkflowApi;
  }
  /**
   * @private
   * @return {?}
   */
  get groupsApi() {
    return this.apiService.getInstance().activiti.groupsApi;
  }
  /**
   * Parses JSON data to create a corresponding Form model.
   * @param {?} json JSON to create the form
   * @param {?=} data Values for the form fields
   * @param {?=} readOnly Should the form fields be read-only?
   * @return {?} Form model created from input data
   */
  parseForm(json, data, readOnly = false) {
    if (json) {
      /** @type {?} */
      const form = new FormModel(json, data, readOnly, this);
      if (!json.fields) {
        form.outcomes = [
          new FormOutcomeModel(/** @type {?} */ (form), {
            id: '$save',
            name: FormOutcomeModel.SAVE_ACTION,
            isSystem: true
          })
        ];
      }
      return form;
    }
    return null;
  }
  /**
   * Creates a Form with a field for each metadata property.
   * @param {?} formName Name of the new form
   * @return {?} The new form
   */
  createFormFromANode(formName) {
    return new Observable
    /**
     * @param {?} observer
     * @return {?}
     */(observer => {
      this.createForm(formName).subscribe(
        /**
         * @param {?} form
         * @return {?}
         */
        form => {
          this.ecmModelService
            .searchEcmType(formName, EcmModelService.MODEL_NAME)
            .subscribe(
              /**
               * @param {?} customType
               * @return {?}
               */
              customType => {
                /** @type {?} */
                const formDefinitionModel = new FormDefinitionModel(
                  form.id,
                  form.name,
                  form.lastUpdatedByFullName,
                  form.lastUpdated,
                  customType.entry.properties
                );
                from(
                  this.editorApi.saveForm(form.id, formDefinitionModel)
                ).subscribe(
                  /**
                   * @param {?} formData
                   * @return {?}
                   */
                  formData => {
                    observer.next(formData);
                    observer.complete();
                  }
                  /**
                   * @param {?} err
                   * @return {?}
                   */,
                  err => this.handleError(err)
                );
              }
              /**
               * @param {?} err
               * @return {?}
               */,
              err => this.handleError(err)
            );
        }
        /**
         * @param {?} err
         * @return {?}
         */,
        err => this.handleError(err)
      );
    });
  }
  /**
   * Create a Form.
   * @param {?} formName Name of the new form
   * @return {?} The new form
   */
  createForm(formName) {
    /** @type {?} */
    const dataModel = {
      name: formName,
      description: '',
      modelType: 2,
      stencilSet: 0
    };
    return from(this.modelsApi.createModel(dataModel));
  }
  /**
   * Saves a form.
   * @param {?} formId ID of the form to save
   * @param {?} formModel Model data for the form
   * @return {?} Data for the saved form
   */
  saveForm(formId, formModel) {
    return from(this.editorApi.saveForm(formId, formModel));
  }
  /**
   * Searches for a form by name.
   * @param {?} name The form name to search for
   * @return {?} Form model(s) matching the search name
   */
  searchFrom(name) {
    /** @type {?} */
    const opts = {
      modelType: 2
    };
    return from(this.modelsApi.getModels(opts)).pipe(
      map(
        /**
         * @param {?} forms
         * @return {?}
         */
        function(forms) {
          return forms.data.find(
            /**
             * @param {?} formData
             * @return {?}
             */
            formData => formData.name === name
          );
        }
      ),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets all the forms.
   * @return {?} List of form models
   */
  getForms() {
    /** @type {?} */
    const opts = {
      modelType: 2
    };
    return from(this.modelsApi.getModels(opts)).pipe(
      map(this.toJsonArray),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets process definitions.
   * @return {?} List of process definitions
   */
  getProcessDefinitions() {
    return from(this.processApi.getProcessDefinitions({})).pipe(
      map(this.toJsonArray),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets instance variables for a process.
   * @param {?} processInstanceId ID of the target process
   * @return {?} List of instance variable information
   */
  getProcessVariablesById(processInstanceId) {
    return from(
      this.processInstanceVariablesApi.getProcessInstanceVariables(
        processInstanceId
      )
    ).pipe(
      map(this.toJson),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets all the tasks.
   * @return {?} List of tasks
   */
  getTasks() {
    return from(this.taskApi.listTasks({})).pipe(
      map(this.toJsonArray),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets a task.
   * @param {?} taskId Task Id
   * @return {?} Task info
   */
  getTask(taskId) {
    return from(this.taskApi.getTask(taskId)).pipe(
      map(this.toJson),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Saves a task form.
   * @param {?} taskId Task Id
   * @param {?} formValues Form Values
   * @return {?} Null response when the operation is complete
   */
  saveTaskForm(taskId, formValues) {
    /** @type {?} */
    const saveFormRepresentation = /** @type {?} */ ({ values: formValues });
    return from(this.taskApi.saveTaskForm(taskId, saveFormRepresentation)).pipe(
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Completes a Task Form.
   * @param {?} taskId Task Id
   * @param {?} formValues Form Values
   * @param {?=} outcome Form Outcome
   * @return {?} Null response when the operation is complete
   */
  completeTaskForm(taskId, formValues, outcome) {
    /** @type {?} */
    const completeFormRepresentation = /** @type {?} */ ({
      values: formValues
    });
    if (outcome) {
      completeFormRepresentation.outcome = outcome;
    }
    return from(
      this.taskApi.completeTaskForm(taskId, completeFormRepresentation)
    ).pipe(
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets a form related to a task.
   * @param {?} taskId ID of the target task
   * @return {?} Form definition
   */
  getTaskForm(taskId) {
    return from(this.taskApi.getTaskForm(taskId)).pipe(
      map(this.toJson),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets a form definition.
   * @param {?} formId ID of the target form
   * @return {?} Form definition
   */
  getFormDefinitionById(formId) {
    return from(this.editorApi.getForm(formId)).pipe(
      map(this.toJson),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets the form definition with a given name.
   * @param {?} name The form name
   * @return {?} Form definition
   */
  getFormDefinitionByName(name) {
    /** @type {?} */
    const opts = {
      filter: 'myReusableForms',
      filterText: name,
      modelType: 2
    };
    return from(this.modelsApi.getModels(opts)).pipe(
      map(this.getFormId),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets the start form instance for a given process.
   * @param {?} processId Process definition ID
   * @return {?} Form definition
   */
  getStartFormInstance(processId) {
    return from(this.processApi.getProcessInstanceStartForm(processId)).pipe(
      map(this.toJson),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets a process instance.
   * @param {?} processId ID of the process to get
   * @return {?} Process instance
   */
  getProcessInstance(processId) {
    return from(this.processApi.getProcessInstance(processId)).pipe(
      map(this.toJson),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets the start form definition for a given process.
   * @param {?} processId Process definition ID
   * @return {?} Form definition
   */
  getStartFormDefinition(processId) {
    return from(this.processApi.getProcessDefinitionStartForm(processId)).pipe(
      map(this.toJson),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets values of fields populated by a REST backend.
   * @param {?} taskId Task identifier
   * @param {?} field Field identifier
   * @return {?} Field values
   */
  getRestFieldValues(taskId, field) {
    return from(this.taskApi.getRestFieldValues(taskId, field)).pipe(
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets values of fields populated by a REST backend using a process ID.
   * @param {?} processDefinitionId Process identifier
   * @param {?} field Field identifier
   * @return {?} Field values
   */
  getRestFieldValuesByProcessId(processDefinitionId, field) {
    return from(
      this.processApi.getRestFieldValues(processDefinitionId, field)
    ).pipe(
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets column values of fields populated by a REST backend using a process ID.
   * @param {?} processDefinitionId Process identifier
   * @param {?} field Field identifier
   * @param {?=} column Column identifier
   * @return {?} Field values
   */
  getRestFieldValuesColumnByProcessId(processDefinitionId, field, column) {
    return from(
      this.processApi.getRestTableFieldValues(
        processDefinitionId,
        field,
        column
      )
    ).pipe(
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets column values of fields populated by a REST backend.
   * @param {?} taskId Task identifier
   * @param {?} field Field identifier
   * @param {?=} column Column identifier
   * @return {?} Field values
   */
  getRestFieldValuesColumn(taskId, field, column) {
    return from(
      this.taskApi.getRestFieldValuesColumn(taskId, field, column)
    ).pipe(
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Returns a URL for the profile picture of a user.
   * @param {?} userId ID of the target user
   * @return {?} URL string
   */
  getUserProfileImageApi(userId) {
    return this.apiService
      .getInstance()
      .activiti.userApi.getUserProfilePictureUrl(userId);
  }
  /**
   * Gets a list of workflow users.
   * @param {?} filter Filter to select specific users
   * @param {?=} groupId Group ID for the search
   * @return {?} Array of users
   */
  getWorkflowUsers(filter, groupId) {
    /** @type {?} */
    const option = { filter: filter };
    if (groupId) {
      option.groupId = groupId;
    }
    return from(this.usersWorkflowApi.getUsers(option)).pipe(
      switchMap(
        /**
         * @param {?} response
         * @return {?}
         */
        response => /** @type {?} */ (response.data) || []
      ),
      map(
        /**
         * @param {?} user
         * @return {?}
         */
        user => {
          user.userImage = this.getUserProfileImageApi(user.id.toString());
          return of(user);
        }
      ),
      combineAll(),
      defaultIfEmpty([]),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets a list of groups in a workflow.
   * @param {?} filter Filter to select specific groups
   * @param {?=} groupId Group ID for the search
   * @return {?} Array of groups
   */
  getWorkflowGroups(filter, groupId) {
    /** @type {?} */
    const option = { filter: filter };
    if (groupId) {
      option.groupId = groupId;
    }
    return from(this.groupsApi.getGroups(option)).pipe(
      map(
        /**
         * @param {?} response
         * @return {?}
         */
        response => /** @type {?} */ (response.data) || []
      ),
      catchError(
        /**
         * @param {?} err
         * @return {?}
         */
        err => this.handleError(err)
      )
    );
  }
  /**
   * Gets the ID of a form.
   * @param {?} form Object representing a form
   * @return {?} ID string
   */
  getFormId(form) {
    /** @type {?} */
    let result = null;
    if (form && form.data && form.data.length > 0) {
      result = form.data[0].id;
    }
    return result;
  }
  /**
   * Creates a JSON representation of form data.
   * @param {?} res Object representing form data
   * @return {?} JSON data
   */
  toJson(res) {
    if (res) {
      return res || {};
    }
    return {};
  }
  /**
   * Creates a JSON array representation of form data.
   * @param {?} res Object representing form data
   * @return {?} JSON data
   */
  toJsonArray(res) {
    if (res) {
      return res.data || [];
    }
    return [];
  }
  /**
   * Reports an error message.
   * @param {?} error Data object with optional `message` and `status` fields for the error
   * @return {?} Error message
   */
  handleError(error) {
    /** @type {?} */
    let errMsg = FormService.UNKNOWN_ERROR_MESSAGE;
    if (error) {
      errMsg = error.message
        ? error.message
        : error.status
        ? `${error.status} - ${error.statusText}`
        : FormService.GENERIC_ERROR_MESSAGE;
    }
    this.logService.error(errMsg);
    return throwError(errMsg);
  }
}
FormService.UNKNOWN_ERROR_MESSAGE = 'Unknown error';
FormService.GENERIC_ERROR_MESSAGE = 'Server error';
FormService.decorators = [
  {
    type: Injectable,
    args: [
      {
        providedIn: 'root'
      }
    ]
  }
];
/** @nocollapse */
FormService.ctorParameters = () => [
  { type: EcmModelService },
  { type: AlfrescoApiService },
  { type: LogService }
];
/** @nocollapse */ FormService.ngInjectableDef = i0.defineInjectable({
  factory: function FormService_Factory() {
    return new FormService(
      i0.inject(i1.EcmModelService),
      i0.inject(i2.AlfrescoApiService),
      i0.inject(i3.LogService)
    );
  },
  token: FormService,
  providedIn: 'root'
});
if (false) {
  /** @type {?} */
  FormService.UNKNOWN_ERROR_MESSAGE;
  /** @type {?} */
  FormService.GENERIC_ERROR_MESSAGE;
  /** @type {?} */
  FormService.prototype.formLoaded;
  /** @type {?} */
  FormService.prototype.formDataRefreshed;
  /** @type {?} */
  FormService.prototype.formFieldValueChanged;
  /** @type {?} */
  FormService.prototype.formEvents;
  /** @type {?} */
  FormService.prototype.taskCompleted;
  /** @type {?} */
  FormService.prototype.taskCompletedError;
  /** @type {?} */
  FormService.prototype.taskSaved;
  /** @type {?} */
  FormService.prototype.taskSavedError;
  /** @type {?} */
  FormService.prototype.formContentClicked;
  /** @type {?} */
  FormService.prototype.validateForm;
  /** @type {?} */
  FormService.prototype.validateFormField;
  /** @type {?} */
  FormService.prototype.validateDynamicTableRow;
  /** @type {?} */
  FormService.prototype.executeOutcome;
  /**
   * @type {?}
   * @private
   */
  FormService.prototype.ecmModelService;
  /**
   * @type {?}
   * @private
   */
  FormService.prototype.apiService;
  /**
   * @type {?}
   * @protected
   */
  FormService.prototype.logService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiZm9ybS9zZXJ2aWNlcy9mb3JtLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDekUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRXhELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDakUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFHdEUsT0FBTyxFQUFFLFNBQVMsRUFBb0IsZ0JBQWdCLEVBQWMsTUFBTSxvQ0FBb0MsQ0FBQztBQUsvRyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdEQsT0FBTyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFVeEYsTUFBTSxPQUFPLFdBQVc7Ozs7OztJQXFCcEIsWUFBb0IsZUFBZ0MsRUFDaEMsVUFBOEIsRUFDNUIsVUFBc0I7UUFGeEIsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLGVBQVUsR0FBVixVQUFVLENBQW9CO1FBQzVCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFsQjVDLGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBYSxDQUFDO1FBQ3RDLHNCQUFpQixHQUFHLElBQUksT0FBTyxFQUFhLENBQUM7UUFDN0MsMEJBQXFCLEdBQUcsSUFBSSxPQUFPLEVBQWtCLENBQUM7UUFDdEQsZUFBVSxHQUFHLElBQUksT0FBTyxFQUFT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QztJQUNkLENBQUM7Ozs7OztJQU9ELFdBQVcsQ0FBQyxLQUFVOztZQUNkLE1BQU0sR0FBRyxXQUFXLENBQUMscUJBQXFCO1FBQzlDLElBQUksS0FBSyxFQUFFO1lBQ1AsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3RDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sTUFBTSxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQztTQUNsRztRQUNELElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLENBQUM7O0FBN2VNLGlDQUFxQixHQUFXLGVBQWUsQ0FBQztBQUNoRCxpQ0FBcUIsR0FBVyxjQUFjLENBQUM7O1lBTnpELFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7OztZQVZRLGVBQWU7WUFiZixrQkFBa0I7WUFDbEIsVUFBVTs7Ozs7SUF5QmYsa0NBQXVEOztJQUN2RCxrQ0FBc0Q7O0lBRXRELGlDQUFzQzs7SUFDdEMsd0NBQTZDOztJQUM3Qyw0Q0FBc0Q7O0lBQ3RELGlDQUFrQzs7SUFDbEMsb0NBQXlDOztJQUN6Qyx5Q0FBbUQ7O0lBQ25ELGdDQUFxQzs7SUFDckMscUNBQStDOztJQUMvQyx5Q0FBcUQ7O0lBRXJELG1DQUFnRDs7SUFDaEQsd0NBQTBEOztJQUMxRCw4Q0FBc0U7O0lBRXRFLHFDQUFpRDs7Ozs7SUFFckMsc0NBQXdDOzs7OztJQUN4QyxpQ0FBc0M7Ozs7O0lBQ3RDLGlDQUFnQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEFsZnJlc2NvQXBpU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2FsZnJlc2NvLWFwaS5zZXJ2aWNlJztcbmltcG9ydCB7IExvZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sb2cuc2VydmljZSc7XG5pbXBvcnQgeyBVc2VyUHJvY2Vzc01vZGVsIH0gZnJvbSAnLi4vLi4vbW9kZWxzJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIGZyb20sIG9mLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBGb3JtRGVmaW5pdGlvbk1vZGVsIH0gZnJvbSAnLi4vbW9kZWxzL2Zvcm0tZGVmaW5pdGlvbi5tb2RlbCc7XG5pbXBvcnQgeyBDb250ZW50TGlua01vZGVsIH0gZnJvbSAnLi8uLi9jb21wb25lbnRzL3dpZGdldHMvY29yZS9jb250ZW50LWxpbmsubW9kZWwnO1xuaW1wb3J0IHsgR3JvdXBNb2RlbCB9IGZyb20gJy4vLi4vY29tcG9uZW50cy93aWRnZXRzL2NvcmUvZ3JvdXAubW9kZWwnO1xuaW1wb3J0IHsgRm9ybU1vZGVsLCBGb3JtT3V0Y29tZUV2ZW50LCBGb3JtT3V0Y29tZU1vZGVsLCBGb3JtVmFsdWVzIH0gZnJvbSAnLi8uLi9jb21wb25lbnRzL3dpZGdldHMvY29yZS9pbmRleCc7XG5pbXBvcnQge1xuICAgIEZvcm1FcnJvckV2ZW50LCBGb3JtRXZlbnQsIEZvcm1GaWVsZEV2ZW50LFxuICAgIFZhbGlkYXRlRHluYW1pY1RhYmxlUm93RXZlbnQsIFZhbGlkYXRlRm9ybUV2ZW50LCBWYWxpZGF0ZUZvcm1GaWVsZEV2ZW50XG59IGZyb20gJy4vLi4vZXZlbnRzL2luZGV4JztcbmltcG9ydCB7IEVjbU1vZGVsU2VydmljZSB9IGZyb20gJy4vZWNtLW1vZGVsLnNlcnZpY2UnO1xuaW1wb3J0IHsgbWFwLCBjYXRjaEVycm9yLCBzd2l0Y2hNYXAsIGNvbWJpbmVBbGwsIGRlZmF1bHRJZkVtcHR5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtcbiAgICBBY3Rpdml0aSxcbiAgICBDb21wbGV0ZUZvcm1SZXByZXNlbnRhdGlvbixcbiAgICBTYXZlRm9ybVJlcHJlc2VudGF0aW9uXG59IGZyb20gJ0BhbGZyZXNjby9qcy1hcGknO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEZvcm1TZXJ2aWNlIHtcblxuICAgIHN0YXRpYyBVTktOT1dOX0VSUk9SX01FU1NBR0U6IHN0cmluZyA9ICdVbmtub3duIGVycm9yJztcbiAgICBzdGF0aWMgR0VORVJJQ19FUlJPUl9NRVNTQUdFOiBzdHJpbmcgPSAnU2VydmVyIGVycm9yJztcblxuICAgIGZvcm1Mb2FkZWQgPSBuZXcgU3ViamVjdDxGb3JtRXZlbnQ+KCk7XG4gICAgZm9ybURhdGFSZWZyZXNoZWQgPSBuZXcgU3ViamVjdDxGb3JtRXZlbnQ+KCk7XG4gICAgZm9ybUZpZWxkVmFsdWVDaGFuZ2VkID0gbmV3IFN1YmplY3Q8Rm9ybUZpZWxkRXZlbnQ+KCk7XG4gICAgZm9ybUV2ZW50cyA9IG5ldyBTdWJqZWN0PEV2ZW50PigpO1xuICAgIHRhc2tDb21wbGV0ZWQgPSBuZXcgU3ViamVjdDxGb3JtRXZlbnQ+KCk7XG4gICAgdGFza0NvbXBsZXRlZEVycm9yID0gbmV3IFN1YmplY3Q8Rm9ybUVycm9yRXZlbnQ+KCk7XG4gICAgdGFza1NhdmVkID0gbmV3IFN1YmplY3Q8Rm9ybUV2ZW50PigpO1xuICAgIHRhc2tTYXZlZEVycm9yID0gbmV3IFN1YmplY3Q8Rm9ybUVycm9yRXZlbnQ+KCk7XG4gICAgZm9ybUNvbnRlbnRDbGlja2VkID0gbmV3IFN1YmplY3Q8Q29udGVudExpbmtNb2RlbD4oKTtcblxuICAgIHZhbGlkYXRlRm9ybSA9IG5ldyBTdWJqZWN0PFZhbGlkYXRlRm9ybUV2ZW50PigpO1xuICAgIHZhbGlkYXRlRm9ybUZpZWxkID0gbmV3IFN1YmplY3Q8VmFsaWRhdGVGb3JtRmllbGRFdmVudD4oKTtcbiAgICB2YWxpZGF0ZUR5bmFtaWNUYWJsZVJvdyA9IG5ldyBTdWJqZWN0PFZhbGlkYXRlRHluYW1pY1RhYmxlUm93RXZlbnQ+KCk7XG5cbiAgICBleGVjdXRlT3V0Y29tZSA9IG5ldyBTdWJqZWN0PEZvcm1PdXRjb21lRXZlbnQ+KCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVjbU1vZGVsU2VydmljZTogRWNtTW9kZWxTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgYXBpU2VydmljZTogQWxmcmVzY29BcGlTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByb3RlY3RlZCBsb2dTZXJ2aWNlOiBMb2dTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgdGFza0FwaSgpOiBBY3Rpdml0aS5UYXNrQXBpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLmFjdGl2aXRpLnRhc2tBcGk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgbW9kZWxzQXBpKCk6IEFjdGl2aXRpLk1vZGVsc0FwaSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5hY3Rpdml0aS5tb2RlbHNBcGk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgZWRpdG9yQXBpKCk6IEFjdGl2aXRpLkVkaXRvckFwaSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5hY3Rpdml0aS5lZGl0b3JBcGk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgcHJvY2Vzc0FwaSgpOiBBY3Rpdml0aS5Qcm9jZXNzQXBpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLmFjdGl2aXRpLnByb2Nlc3NBcGk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgcHJvY2Vzc0luc3RhbmNlVmFyaWFibGVzQXBpKCk6IEFjdGl2aXRpLlByb2Nlc3NJbnN0YW5jZVZhcmlhYmxlc0FwaSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5hY3Rpdml0aS5wcm9jZXNzSW5zdGFuY2VWYXJpYWJsZXNBcGk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgdXNlcnNXb3JrZmxvd0FwaSgpOiBBY3Rpdml0aS5Vc2Vyc1dvcmtmbG93QXBpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLmFjdGl2aXRpLnVzZXJzV29ya2Zsb3dBcGk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgZ3JvdXBzQXBpKCk6IEFjdGl2aXRpLkdyb3Vwc0FwaSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5hY3Rpdml0aS5ncm91cHNBcGk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2VzIEpTT04gZGF0YSB0byBjcmVhdGUgYSBjb3JyZXNwb25kaW5nIEZvcm0gbW9kZWwuXG4gICAgICogQHBhcmFtIGpzb24gSlNPTiB0byBjcmVhdGUgdGhlIGZvcm1cbiAgICAgKiBAcGFyYW0gZGF0YSBWYWx1ZXMgZm9yIHRoZSBmb3JtIGZpZWxkc1xuICAgICAqIEBwYXJhbSByZWFkT25seSBTaG91bGQgdGhlIGZvcm0gZmllbGRzIGJlIHJlYWQtb25seT9cbiAgICAgKiBAcmV0dXJucyBGb3JtIG1vZGVsIGNyZWF0ZWQgZnJvbSBpbnB1dCBkYXRhXG4gICAgICovXG4gICAgcGFyc2VGb3JtKGpzb246IGFueSwgZGF0YT86IEZvcm1WYWx1ZXMsIHJlYWRPbmx5OiBib29sZWFuID0gZmFsc2UpOiBGb3JtTW9kZWwge1xuICAgICAgICBpZiAoanNvbikge1xuICAgICAgICAgICAgY29uc3QgZm9ybSA9IG5ldyBGb3JtTW9kZWwoanNvbiwgZGF0YSwgcmVhZE9ubHksIHRoaXMpO1xuICAgICAgICAgICAgaWYgKCFqc29uLmZpZWxkcykge1xuICAgICAgICAgICAgICAgIGZvcm0ub3V0Y29tZXMgPSBbXG4gICAgICAgICAgICAgICAgICAgIG5ldyBGb3JtT3V0Y29tZU1vZGVsKDxhbnk+IGZvcm0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAnJHNhdmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogRm9ybU91dGNvbWVNb2RlbC5TQVZFX0FDVElPTixcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzU3lzdGVtOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmb3JtO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBGb3JtIHdpdGggYSBmaWVsZCBmb3IgZWFjaCBtZXRhZGF0YSBwcm9wZXJ0eS5cbiAgICAgKiBAcGFyYW0gZm9ybU5hbWUgTmFtZSBvZiB0aGUgbmV3IGZvcm1cbiAgICAgKiBAcmV0dXJucyBUaGUgbmV3IGZvcm1cbiAgICAgKi9cbiAgICBjcmVhdGVGb3JtRnJvbUFOb2RlKGZvcm1OYW1lOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUZvcm0oZm9ybU5hbWUpLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAoZm9ybSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVjbU1vZGVsU2VydmljZS5zZWFyY2hFY21UeXBlKGZvcm1OYW1lLCBFY21Nb2RlbFNlcnZpY2UuTU9ERUxfTkFNRSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGN1c3RvbVR5cGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JtRGVmaW5pdGlvbk1vZGVsID0gbmV3IEZvcm1EZWZpbml0aW9uTW9kZWwoZm9ybS5pZCwgZm9ybS5uYW1lLCBmb3JtLmxhc3RVcGRhdGVkQnlGdWxsTmFtZSwgZm9ybS5sYXN0VXBkYXRlZCwgY3VzdG9tVHlwZS5lbnRyeS5wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVkaXRvckFwaS5zYXZlRm9ybShmb3JtLmlkLCBmb3JtRGVmaW5pdGlvbk1vZGVsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkuc3Vic2NyaWJlKChmb3JtRGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KGZvcm1EYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAoZXJyKSA9PiB0aGlzLmhhbmRsZUVycm9yKGVycikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIChlcnIpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoZXJyKSA9PiB0aGlzLmhhbmRsZUVycm9yKGVycikpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBGb3JtLlxuICAgICAqIEBwYXJhbSBmb3JtTmFtZSBOYW1lIG9mIHRoZSBuZXcgZm9ybVxuICAgICAqIEByZXR1cm5zIFRoZSBuZXcgZm9ybVxuICAgICAqL1xuICAgIGNyZWF0ZUZvcm0oZm9ybU5hbWU6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIGNvbnN0IGRhdGFNb2RlbCA9IHtcbiAgICAgICAgICAgIG5hbWU6IGZvcm1OYW1lLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgICAgbW9kZWxUeXBlOiAyLFxuICAgICAgICAgICAgc3RlbmNpbFNldDogMFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBmcm9tKFxuICAgICAgICAgICAgdGhpcy5tb2RlbHNBcGkuY3JlYXRlTW9kZWwoZGF0YU1vZGVsKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNhdmVzIGEgZm9ybS5cbiAgICAgKiBAcGFyYW0gZm9ybUlkIElEIG9mIHRoZSBmb3JtIHRvIHNhdmVcbiAgICAgKiBAcGFyYW0gZm9ybU1vZGVsIE1vZGVsIGRhdGEgZm9yIHRoZSBmb3JtXG4gICAgICogQHJldHVybnMgRGF0YSBmb3IgdGhlIHNhdmVkIGZvcm1cbiAgICAgKi9cbiAgICBzYXZlRm9ybShmb3JtSWQ6IG51bWJlciwgZm9ybU1vZGVsOiBGb3JtRGVmaW5pdGlvbk1vZGVsKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIGZyb20oXG4gICAgICAgICAgICB0aGlzLmVkaXRvckFwaS5zYXZlRm9ybShmb3JtSWQsIGZvcm1Nb2RlbClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWFyY2hlcyBmb3IgYSBmb3JtIGJ5IG5hbWUuXG4gICAgICogQHBhcmFtIG5hbWUgVGhlIGZvcm0gbmFtZSB0byBzZWFyY2ggZm9yXG4gICAgICogQHJldHVybnMgRm9ybSBtb2RlbChzKSBtYXRjaGluZyB0aGUgc2VhcmNoIG5hbWVcbiAgICAgKi9cbiAgICBzZWFyY2hGcm9tKG5hbWU6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICAgICAgICAnbW9kZWxUeXBlJzogMlxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBmcm9tKFxuICAgICAgICAgICAgdGhpcy5tb2RlbHNBcGkuZ2V0TW9kZWxzKG9wdHMpXG4gICAgICAgIClcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcChmdW5jdGlvbiAoZm9ybXM6IGFueSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm9ybXMuZGF0YS5maW5kKChmb3JtRGF0YSkgPT4gZm9ybURhdGEubmFtZSA9PT0gbmFtZSk7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB0aGlzLmhhbmRsZUVycm9yKGVycikpXG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYWxsIHRoZSBmb3Jtcy5cbiAgICAgKiBAcmV0dXJucyBMaXN0IG9mIGZvcm0gbW9kZWxzXG4gICAgICovXG4gICAgZ2V0Rm9ybXMoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgICAgICAgICdtb2RlbFR5cGUnOiAyXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5tb2RlbHNBcGkuZ2V0TW9kZWxzKG9wdHMpKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgbWFwKHRoaXMudG9Kc29uQXJyYXkpLFxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnIpKVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHByb2Nlc3MgZGVmaW5pdGlvbnMuXG4gICAgICogQHJldHVybnMgTGlzdCBvZiBwcm9jZXNzIGRlZmluaXRpb25zXG4gICAgICovXG4gICAgZ2V0UHJvY2Vzc0RlZmluaXRpb25zKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMucHJvY2Vzc0FwaS5nZXRQcm9jZXNzRGVmaW5pdGlvbnMoe30pKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgbWFwKHRoaXMudG9Kc29uQXJyYXkpLFxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnIpKVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGluc3RhbmNlIHZhcmlhYmxlcyBmb3IgYSBwcm9jZXNzLlxuICAgICAqIEBwYXJhbSBwcm9jZXNzSW5zdGFuY2VJZCBJRCBvZiB0aGUgdGFyZ2V0IHByb2Nlc3NcbiAgICAgKiBAcmV0dXJucyBMaXN0IG9mIGluc3RhbmNlIHZhcmlhYmxlIGluZm9ybWF0aW9uXG4gICAgICovXG4gICAgZ2V0UHJvY2Vzc1ZhcmlhYmxlc0J5SWQocHJvY2Vzc0luc3RhbmNlSWQ6IHN0cmluZyk6IE9ic2VydmFibGU8YW55W10+IHtcbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5wcm9jZXNzSW5zdGFuY2VWYXJpYWJsZXNBcGkuZ2V0UHJvY2Vzc0luc3RhbmNlVmFyaWFibGVzKHByb2Nlc3NJbnN0YW5jZUlkKSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCh0aGlzLnRvSnNvbiksXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB0aGlzLmhhbmRsZUVycm9yKGVycikpXG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYWxsIHRoZSB0YXNrcy5cbiAgICAgKiBAcmV0dXJucyBMaXN0IG9mIHRhc2tzXG4gICAgICovXG4gICAgZ2V0VGFza3MoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy50YXNrQXBpLmxpc3RUYXNrcyh7fSkpXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBtYXAodGhpcy50b0pzb25BcnJheSksXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB0aGlzLmhhbmRsZUVycm9yKGVycikpXG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSB0YXNrLlxuICAgICAqIEBwYXJhbSB0YXNrSWQgVGFzayBJZFxuICAgICAqIEByZXR1cm5zIFRhc2sgaW5mb1xuICAgICAqL1xuICAgIGdldFRhc2sodGFza0lkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLnRhc2tBcGkuZ2V0VGFzayh0YXNrSWQpKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgbWFwKHRoaXMudG9Kc29uKSxcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyKSlcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2F2ZXMgYSB0YXNrIGZvcm0uXG4gICAgICogQHBhcmFtIHRhc2tJZCBUYXNrIElkXG4gICAgICogQHBhcmFtIGZvcm1WYWx1ZXMgRm9ybSBWYWx1ZXNcbiAgICAgKiBAcmV0dXJucyBOdWxsIHJlc3BvbnNlIHdoZW4gdGhlIG9wZXJhdGlvbiBpcyBjb21wbGV0ZVxuICAgICAqL1xuICAgIHNhdmVUYXNrRm9ybSh0YXNrSWQ6IHN0cmluZywgZm9ybVZhbHVlczogRm9ybVZhbHVlcyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIGNvbnN0IHNhdmVGb3JtUmVwcmVzZW50YXRpb24gPSA8U2F2ZUZvcm1SZXByZXNlbnRhdGlvbj4geyB2YWx1ZXM6IGZvcm1WYWx1ZXMgfTtcblxuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLnRhc2tBcGkuc2F2ZVRhc2tGb3JtKHRhc2tJZCwgc2F2ZUZvcm1SZXByZXNlbnRhdGlvbikpXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyKSlcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29tcGxldGVzIGEgVGFzayBGb3JtLlxuICAgICAqIEBwYXJhbSB0YXNrSWQgVGFzayBJZFxuICAgICAqIEBwYXJhbSBmb3JtVmFsdWVzIEZvcm0gVmFsdWVzXG4gICAgICogQHBhcmFtIG91dGNvbWUgRm9ybSBPdXRjb21lXG4gICAgICogQHJldHVybnMgTnVsbCByZXNwb25zZSB3aGVuIHRoZSBvcGVyYXRpb24gaXMgY29tcGxldGVcbiAgICAgKi9cbiAgICBjb21wbGV0ZVRhc2tGb3JtKHRhc2tJZDogc3RyaW5nLCBmb3JtVmFsdWVzOiBGb3JtVmFsdWVzLCBvdXRjb21lPzogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgY29uc3QgY29tcGxldGVGb3JtUmVwcmVzZW50YXRpb246IGFueSA9IDxDb21wbGV0ZUZvcm1SZXByZXNlbnRhdGlvbj4geyB2YWx1ZXM6IGZvcm1WYWx1ZXMgfTtcbiAgICAgICAgaWYgKG91dGNvbWUpIHtcbiAgICAgICAgICAgIGNvbXBsZXRlRm9ybVJlcHJlc2VudGF0aW9uLm91dGNvbWUgPSBvdXRjb21lO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy50YXNrQXBpLmNvbXBsZXRlVGFza0Zvcm0odGFza0lkLCBjb21wbGV0ZUZvcm1SZXByZXNlbnRhdGlvbikpXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyKSlcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIGZvcm0gcmVsYXRlZCB0byBhIHRhc2suXG4gICAgICogQHBhcmFtIHRhc2tJZCBJRCBvZiB0aGUgdGFyZ2V0IHRhc2tcbiAgICAgKiBAcmV0dXJucyBGb3JtIGRlZmluaXRpb25cbiAgICAgKi9cbiAgICBnZXRUYXNrRm9ybSh0YXNrSWQ6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMudGFza0FwaS5nZXRUYXNrRm9ybSh0YXNrSWQpKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgbWFwKHRoaXMudG9Kc29uKSxcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyKSlcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIGZvcm0gZGVmaW5pdGlvbi5cbiAgICAgKiBAcGFyYW0gZm9ybUlkIElEIG9mIHRoZSB0YXJnZXQgZm9ybVxuICAgICAqIEByZXR1cm5zIEZvcm0gZGVmaW5pdGlvblxuICAgICAqL1xuICAgIGdldEZvcm1EZWZpbml0aW9uQnlJZChmb3JtSWQ6IG51bWJlcik6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMuZWRpdG9yQXBpLmdldEZvcm0oZm9ybUlkKSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCh0aGlzLnRvSnNvbiksXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB0aGlzLmhhbmRsZUVycm9yKGVycikpXG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGZvcm0gZGVmaW5pdGlvbiB3aXRoIGEgZ2l2ZW4gbmFtZS5cbiAgICAgKiBAcGFyYW0gbmFtZSBUaGUgZm9ybSBuYW1lXG4gICAgICogQHJldHVybnMgRm9ybSBkZWZpbml0aW9uXG4gICAgICovXG4gICAgZ2V0Rm9ybURlZmluaXRpb25CeU5hbWUobmFtZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgICAgICAgICdmaWx0ZXInOiAnbXlSZXVzYWJsZUZvcm1zJyxcbiAgICAgICAgICAgICdmaWx0ZXJUZXh0JzogbmFtZSxcbiAgICAgICAgICAgICdtb2RlbFR5cGUnOiAyXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5tb2RlbHNBcGkuZ2V0TW9kZWxzKG9wdHMpKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgbWFwKHRoaXMuZ2V0Rm9ybUlkKSxcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyKSlcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgc3RhcnQgZm9ybSBpbnN0YW5jZSBmb3IgYSBnaXZlbiBwcm9jZXNzLlxuICAgICAqIEBwYXJhbSBwcm9jZXNzSWQgUHJvY2VzcyBkZWZpbml0aW9uIElEXG4gICAgICogQHJldHVybnMgRm9ybSBkZWZpbml0aW9uXG4gICAgICovXG4gICAgZ2V0U3RhcnRGb3JtSW5zdGFuY2UocHJvY2Vzc0lkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLnByb2Nlc3NBcGkuZ2V0UHJvY2Vzc0luc3RhbmNlU3RhcnRGb3JtKHByb2Nlc3NJZCkpXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBtYXAodGhpcy50b0pzb24pLFxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnIpKVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgcHJvY2VzcyBpbnN0YW5jZS5cbiAgICAgKiBAcGFyYW0gcHJvY2Vzc0lkIElEIG9mIHRoZSBwcm9jZXNzIHRvIGdldFxuICAgICAqIEByZXR1cm5zIFByb2Nlc3MgaW5zdGFuY2VcbiAgICAgKi9cbiAgICBnZXRQcm9jZXNzSW5zdGFuY2UocHJvY2Vzc0lkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLnByb2Nlc3NBcGkuZ2V0UHJvY2Vzc0luc3RhbmNlKHByb2Nlc3NJZCkpXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBtYXAodGhpcy50b0pzb24pLFxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnIpKVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzdGFydCBmb3JtIGRlZmluaXRpb24gZm9yIGEgZ2l2ZW4gcHJvY2Vzcy5cbiAgICAgKiBAcGFyYW0gcHJvY2Vzc0lkIFByb2Nlc3MgZGVmaW5pdGlvbiBJRFxuICAgICAqIEByZXR1cm5zIEZvcm0gZGVmaW5pdGlvblxuICAgICAqL1xuICAgIGdldFN0YXJ0Rm9ybURlZmluaXRpb24ocHJvY2Vzc0lkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLnByb2Nlc3NBcGkuZ2V0UHJvY2Vzc0RlZmluaXRpb25TdGFydEZvcm0ocHJvY2Vzc0lkKSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCh0aGlzLnRvSnNvbiksXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB0aGlzLmhhbmRsZUVycm9yKGVycikpXG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdmFsdWVzIG9mIGZpZWxkcyBwb3B1bGF0ZWQgYnkgYSBSRVNUIGJhY2tlbmQuXG4gICAgICogQHBhcmFtIHRhc2tJZCBUYXNrIGlkZW50aWZpZXJcbiAgICAgKiBAcGFyYW0gZmllbGQgRmllbGQgaWRlbnRpZmllclxuICAgICAqIEByZXR1cm5zIEZpZWxkIHZhbHVlc1xuICAgICAqL1xuICAgIGdldFJlc3RGaWVsZFZhbHVlcyh0YXNrSWQ6IHN0cmluZywgZmllbGQ6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMudGFza0FwaS5nZXRSZXN0RmllbGRWYWx1ZXModGFza0lkLCBmaWVsZCkpXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyKSlcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB2YWx1ZXMgb2YgZmllbGRzIHBvcHVsYXRlZCBieSBhIFJFU1QgYmFja2VuZCB1c2luZyBhIHByb2Nlc3MgSUQuXG4gICAgICogQHBhcmFtIHByb2Nlc3NEZWZpbml0aW9uSWQgUHJvY2VzcyBpZGVudGlmaWVyXG4gICAgICogQHBhcmFtIGZpZWxkIEZpZWxkIGlkZW50aWZpZXJcbiAgICAgKiBAcmV0dXJucyBGaWVsZCB2YWx1ZXNcbiAgICAgKi9cbiAgICBnZXRSZXN0RmllbGRWYWx1ZXNCeVByb2Nlc3NJZChwcm9jZXNzRGVmaW5pdGlvbklkOiBzdHJpbmcsIGZpZWxkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLnByb2Nlc3NBcGkuZ2V0UmVzdEZpZWxkVmFsdWVzKHByb2Nlc3NEZWZpbml0aW9uSWQsIGZpZWxkKSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnIpKVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGNvbHVtbiB2YWx1ZXMgb2YgZmllbGRzIHBvcHVsYXRlZCBieSBhIFJFU1QgYmFja2VuZCB1c2luZyBhIHByb2Nlc3MgSUQuXG4gICAgICogQHBhcmFtIHByb2Nlc3NEZWZpbml0aW9uSWQgUHJvY2VzcyBpZGVudGlmaWVyXG4gICAgICogQHBhcmFtIGZpZWxkIEZpZWxkIGlkZW50aWZpZXJcbiAgICAgKiBAcGFyYW0gY29sdW1uIENvbHVtbiBpZGVudGlmaWVyXG4gICAgICogQHJldHVybnMgRmllbGQgdmFsdWVzXG4gICAgICovXG4gICAgZ2V0UmVzdEZpZWxkVmFsdWVzQ29sdW1uQnlQcm9jZXNzSWQocHJvY2Vzc0RlZmluaXRpb25JZDogc3RyaW5nLCBmaWVsZDogc3RyaW5nLCBjb2x1bW4/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLnByb2Nlc3NBcGkuZ2V0UmVzdFRhYmxlRmllbGRWYWx1ZXMocHJvY2Vzc0RlZmluaXRpb25JZCwgZmllbGQsIGNvbHVtbikpXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyKSlcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBjb2x1bW4gdmFsdWVzIG9mIGZpZWxkcyBwb3B1bGF0ZWQgYnkgYSBSRVNUIGJhY2tlbmQuXG4gICAgICogQHBhcmFtIHRhc2tJZCBUYXNrIGlkZW50aWZpZXJcbiAgICAgKiBAcGFyYW0gZmllbGQgRmllbGQgaWRlbnRpZmllclxuICAgICAqIEBwYXJhbSBjb2x1bW4gQ29sdW1uIGlkZW50aWZpZXJcbiAgICAgKiBAcmV0dXJucyBGaWVsZCB2YWx1ZXNcbiAgICAgKi9cbiAgICBnZXRSZXN0RmllbGRWYWx1ZXNDb2x1bW4odGFza0lkOiBzdHJpbmcsIGZpZWxkOiBzdHJpbmcsIGNvbHVtbj86IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMudGFza0FwaS5nZXRSZXN0RmllbGRWYWx1ZXNDb2x1bW4odGFza0lkLCBmaWVsZCwgY29sdW1uKSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnIpKVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgVVJMIGZvciB0aGUgcHJvZmlsZSBwaWN0dXJlIG9mIGEgdXNlci5cbiAgICAgKiBAcGFyYW0gdXNlcklkIElEIG9mIHRoZSB0YXJnZXQgdXNlclxuICAgICAqIEByZXR1cm5zIFVSTCBzdHJpbmdcbiAgICAgKi9cbiAgICBnZXRVc2VyUHJvZmlsZUltYWdlQXBpKHVzZXJJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLmFjdGl2aXRpLnVzZXJBcGkuZ2V0VXNlclByb2ZpbGVQaWN0dXJlVXJsKHVzZXJJZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIGxpc3Qgb2Ygd29ya2Zsb3cgdXNlcnMuXG4gICAgICogQHBhcmFtIGZpbHRlciBGaWx0ZXIgdG8gc2VsZWN0IHNwZWNpZmljIHVzZXJzXG4gICAgICogQHBhcmFtIGdyb3VwSWQgR3JvdXAgSUQgZm9yIHRoZSBzZWFyY2hcbiAgICAgKiBAcmV0dXJucyBBcnJheSBvZiB1c2Vyc1xuICAgICAqL1xuICAgIGdldFdvcmtmbG93VXNlcnMoZmlsdGVyOiBzdHJpbmcsIGdyb3VwSWQ/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPFVzZXJQcm9jZXNzTW9kZWxbXT4ge1xuICAgICAgICBjb25zdCBvcHRpb246IGFueSA9IHsgZmlsdGVyOiBmaWx0ZXIgfTtcbiAgICAgICAgaWYgKGdyb3VwSWQpIHtcbiAgICAgICAgICAgIG9wdGlvbi5ncm91cElkID0gZ3JvdXBJZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLnVzZXJzV29ya2Zsb3dBcGkuZ2V0VXNlcnMob3B0aW9uKSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIHN3aXRjaE1hcChyZXNwb25zZSA9PiA8VXNlclByb2Nlc3NNb2RlbFtdPiByZXNwb25zZS5kYXRhIHx8IFtdKSxcbiAgICAgICAgICAgICAgICBtYXAoKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdXNlci51c2VySW1hZ2UgPSB0aGlzLmdldFVzZXJQcm9maWxlSW1hZ2VBcGkodXNlci5pZC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mKHVzZXIpO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGNvbWJpbmVBbGwoKSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0SWZFbXB0eShbXSksXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB0aGlzLmhhbmRsZUVycm9yKGVycikpXG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBsaXN0IG9mIGdyb3VwcyBpbiBhIHdvcmtmbG93LlxuICAgICAqIEBwYXJhbSBmaWx0ZXIgRmlsdGVyIHRvIHNlbGVjdCBzcGVjaWZpYyBncm91cHNcbiAgICAgKiBAcGFyYW0gZ3JvdXBJZCBHcm91cCBJRCBmb3IgdGhlIHNlYXJjaFxuICAgICAqIEByZXR1cm5zIEFycmF5IG9mIGdyb3Vwc1xuICAgICAqL1xuICAgIGdldFdvcmtmbG93R3JvdXBzKGZpbHRlcjogc3RyaW5nLCBncm91cElkPzogc3RyaW5nKTogT2JzZXJ2YWJsZTxHcm91cE1vZGVsW10+IHtcbiAgICAgICAgY29uc3Qgb3B0aW9uOiBhbnkgPSB7IGZpbHRlcjogZmlsdGVyIH07XG4gICAgICAgIGlmIChncm91cElkKSB7XG4gICAgICAgICAgICBvcHRpb24uZ3JvdXBJZCA9IGdyb3VwSWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5ncm91cHNBcGkuZ2V0R3JvdXBzKG9wdGlvbikpXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBtYXAoKHJlc3BvbnNlOiBhbnkpID0+IDxHcm91cE1vZGVsW10+IHJlc3BvbnNlLmRhdGEgfHwgW10pLFxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnIpKVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBJRCBvZiBhIGZvcm0uXG4gICAgICogQHBhcmFtIGZvcm0gT2JqZWN0IHJlcHJlc2VudGluZyBhIGZvcm1cbiAgICAgKiBAcmV0dXJucyBJRCBzdHJpbmdcbiAgICAgKi9cbiAgICBnZXRGb3JtSWQoZm9ybTogYW55KTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IG51bGw7XG5cbiAgICAgICAgaWYgKGZvcm0gJiYgZm9ybS5kYXRhICYmIGZvcm0uZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBmb3JtLmRhdGFbMF0uaWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIGZvcm0gZGF0YS5cbiAgICAgKiBAcGFyYW0gcmVzIE9iamVjdCByZXByZXNlbnRpbmcgZm9ybSBkYXRhXG4gICAgICogQHJldHVybnMgSlNPTiBkYXRhXG4gICAgICovXG4gICAgdG9Kc29uKHJlczogYW55KSB7XG4gICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMgfHwge307XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBKU09OIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIGZvcm0gZGF0YS5cbiAgICAgKiBAcGFyYW0gcmVzIE9iamVjdCByZXByZXNlbnRpbmcgZm9ybSBkYXRhXG4gICAgICogQHJldHVybnMgSlNPTiBkYXRhXG4gICAgICovXG4gICAgdG9Kc29uQXJyYXkocmVzOiBhbnkpIHtcbiAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhIHx8IFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXBvcnRzIGFuIGVycm9yIG1lc3NhZ2UuXG4gICAgICogQHBhcmFtIGVycm9yIERhdGEgb2JqZWN0IHdpdGggb3B0aW9uYWwgYG1lc3NhZ2VgIGFuZCBgc3RhdHVzYCBmaWVsZHMgZm9yIHRoZSBlcnJvclxuICAgICAqIEByZXR1cm5zIEVycm9yIG1lc3NhZ2VcbiAgICAgKi9cbiAgICBoYW5kbGVFcnJvcihlcnJvcjogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgbGV0IGVyck1zZyA9IEZvcm1TZXJ2aWNlLlVOS05PV05fRVJST1JfTUVTU0FHRTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBlcnJNc2cgPSAoZXJyb3IubWVzc2FnZSkgPyBlcnJvci5tZXNzYWdlIDpcbiAgICAgICAgICAgICAgICBlcnJvci5zdGF0dXMgPyBgJHtlcnJvci5zdGF0dXN9IC0gJHtlcnJvci5zdGF0dXNUZXh0fWAgOiBGb3JtU2VydmljZS5HRU5FUklDX0VSUk9SX01FU1NBR0U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmVycm9yKGVyck1zZyk7XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVyck1zZyk7XG4gICAgfVxufVxuIl19
