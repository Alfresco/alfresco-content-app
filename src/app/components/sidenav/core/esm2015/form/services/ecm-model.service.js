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
import { LogService } from '../../services/log.service';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as i0 from '@angular/core';
import * as i1 from '../../services/alfresco-api.service';
import * as i2 from '../../services/log.service';
export class EcmModelService {
  /**
   * @param {?} apiService
   * @param {?} logService
   */
  constructor(apiService, logService) {
    this.apiService = apiService;
    this.logService = logService;
  }
  /**
   * @param {?} formName
   * @param {?} form
   * @return {?}
   */
  createEcmTypeForActivitiForm(formName, form) {
    return new Observable
    /**
     * @param {?} observer
     * @return {?}
     */(observer => {
      this.searchActivitiEcmModel().subscribe(
        /**
         * @param {?} model
         * @return {?}
         */
        model => {
          if (!model) {
            this.createActivitiEcmModel(formName, form).subscribe(
              /**
               * @param {?} typeForm
               * @return {?}
               */
              typeForm => {
                observer.next(typeForm);
                observer.complete();
              }
            );
          } else {
            this.saveFomType(formName, form).subscribe(
              /**
               * @param {?} typeForm
               * @return {?}
               */
              typeForm => {
                observer.next(typeForm);
                observer.complete();
              }
            );
          }
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
   * @return {?}
   */
  searchActivitiEcmModel() {
    return this.getEcmModels().pipe(
      map(
        /**
         * @param {?} ecmModels
         * @return {?}
         */
        function(ecmModels) {
          return ecmModels.list.entries.find(
            /**
             * @param {?} model
             * @return {?}
             */
            model => model.entry.name === EcmModelService.MODEL_NAME
          );
        }
      )
    );
  }
  /**
   * @param {?} formName
   * @param {?} form
   * @return {?}
   */
  createActivitiEcmModel(formName, form) {
    return new Observable
    /**
     * @param {?} observer
     * @return {?}
     */(observer => {
      this.createEcmModel(
        EcmModelService.MODEL_NAME,
        EcmModelService.MODEL_NAMESPACE
      ).subscribe(
        /**
         * @param {?} model
         * @return {?}
         */
        model => {
          this.logService.info('model created', model);
          this.activeEcmModel(EcmModelService.MODEL_NAME).subscribe(
            /**
             * @param {?} modelActive
             * @return {?}
             */
            modelActive => {
              this.logService.info('model active', modelActive);
              this.createEcmTypeWithProperties(formName, form).subscribe(
                /**
                 * @param {?} typeCreated
                 * @return {?}
                 */
                typeCreated => {
                  observer.next(typeCreated);
                  observer.complete();
                }
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
   * @param {?} formName
   * @param {?} form
   * @return {?}
   */
  saveFomType(formName, form) {
    return new Observable
    /**
     * @param {?} observer
     * @return {?}
     */(observer => {
      this.searchEcmType(formName, EcmModelService.MODEL_NAME).subscribe(
        /**
         * @param {?} ecmType
         * @return {?}
         */
        ecmType => {
          this.logService.info('custom types', ecmType);
          if (!ecmType) {
            this.createEcmTypeWithProperties(formName, form).subscribe(
              /**
               * @param {?} typeCreated
               * @return {?}
               */
              typeCreated => {
                observer.next(typeCreated);
                observer.complete();
              }
            );
          } else {
            observer.next(ecmType);
            observer.complete();
          }
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
   * @param {?} formName
   * @param {?} form
   * @return {?}
   */
  createEcmTypeWithProperties(formName, form) {
    return new Observable
    /**
     * @param {?} observer
     * @return {?}
     */(observer => {
      this.createEcmType(
        formName,
        EcmModelService.MODEL_NAME,
        EcmModelService.TYPE_MODEL
      ).subscribe(
        /**
         * @param {?} typeCreated
         * @return {?}
         */
        typeCreated => {
          this.logService.info('type Created', typeCreated);
          this.addPropertyToAType(
            EcmModelService.MODEL_NAME,
            formName,
            form
          ).subscribe(
            /**
             * @param {?} propertyAdded
             * @return {?}
             */
            propertyAdded => {
              this.logService.info('property Added', propertyAdded);
              observer.next(typeCreated);
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
    });
  }
  /**
   * @param {?} typeName
   * @param {?} modelName
   * @return {?}
   */
  searchEcmType(typeName, modelName) {
    return this.getEcmType(modelName).pipe(
      map(
        /**
         * @param {?} customTypes
         * @return {?}
         */
        function(customTypes) {
          return customTypes.list.entries.find(
            /**
             * @param {?} type
             * @return {?}
             */
            type =>
              type.entry.prefixedName === typeName ||
              type.entry.title === typeName
          );
        }
      )
    );
  }
  /**
   * @param {?} modelName
   * @return {?}
   */
  activeEcmModel(modelName) {
    return from(
      this.apiService
        .getInstance()
        .core.customModelApi.activateCustomModel(modelName)
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
   * @param {?} modelName
   * @param {?} nameSpace
   * @return {?}
   */
  createEcmModel(modelName, nameSpace) {
    return from(
      this.apiService
        .getInstance()
        .core.customModelApi.createCustomModel(
          'DRAFT',
          '',
          modelName,
          modelName,
          nameSpace
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
   * @return {?}
   */
  getEcmModels() {
    return from(
      this.apiService.getInstance().core.customModelApi.getAllCustomModel()
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
   * @param {?} modelName
   * @return {?}
   */
  getEcmType(modelName) {
    return from(
      this.apiService
        .getInstance()
        .core.customModelApi.getAllCustomType(modelName)
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
   * @param {?} typeName
   * @param {?} modelName
   * @param {?} parentType
   * @return {?}
   */
  createEcmType(typeName, modelName, parentType) {
    /** @type {?} */
    const name = this.cleanNameType(typeName);
    return from(
      this.apiService
        .getInstance()
        .core.customModelApi.createCustomType(
          modelName,
          name,
          parentType,
          typeName,
          ''
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
   * @param {?} modelName
   * @param {?} typeName
   * @param {?} formFields
   * @return {?}
   */
  addPropertyToAType(modelName, typeName, formFields) {
    /** @type {?} */
    const name = this.cleanNameType(typeName);
    /** @type {?} */
    const properties = [];
    if (formFields && formFields.values) {
      for (const key in formFields.values) {
        if (key) {
          properties.push({
            name: key,
            title: key,
            description: key,
            dataType: 'd:text',
            multiValued: false,
            mandatory: false,
            mandatoryEnforced: false
          });
        }
      }
    }
    return from(
      this.apiService
        .getInstance()
        .core.customModelApi.addPropertyToType(modelName, name, properties)
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
   * @param {?} name
   * @return {?}
   */
  cleanNameType(name) {
    /** @type {?} */
    let cleanName = name;
    if (name.indexOf(':') !== -1) {
      cleanName = name.split(':')[1];
    }
    return cleanName.replace(/[^a-zA-Z ]/g, '');
  }
  /**
   * @param {?} res
   * @return {?}
   */
  toJson(res) {
    if (res) {
      return res || {};
    }
    return {};
  }
  /**
   * @param {?} err
   * @return {?}
   */
  handleError(err) {
    this.logService.error(err);
  }
}
EcmModelService.MODEL_NAMESPACE = 'activitiForms';
EcmModelService.MODEL_NAME = 'activitiFormsModel';
EcmModelService.TYPE_MODEL = 'cm:folder';
EcmModelService.decorators = [
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
EcmModelService.ctorParameters = () => [
  { type: AlfrescoApiService },
  { type: LogService }
];
/** @nocollapse */ EcmModelService.ngInjectableDef = i0.defineInjectable({
  factory: function EcmModelService_Factory() {
    return new EcmModelService(
      i0.inject(i1.AlfrescoApiService),
      i0.inject(i2.LogService)
    );
  },
  token: EcmModelService,
  providedIn: 'root'
});
if (false) {
  /** @type {?} */
  EcmModelService.MODEL_NAMESPACE;
  /** @type {?} */
  EcmModelService.MODEL_NAME;
  /** @type {?} */
  EcmModelService.TYPE_MODEL;
  /**
   * @type {?}
   * @private
   */
  EcmModelService.prototype.apiService;
  /**
   * @type {?}
   * @private
   */
  EcmModelService.prototype.logService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNtLW1vZGVsLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJmb3JtL3NlcnZpY2VzL2VjbS1tb2RlbC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXhDLE9BQU8sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFLakQsTUFBTSxPQUFPLGVBQWU7Ozs7O0lBTXhCLFlBQW9CLFVBQThCLEVBQzlCLFVBQXNCO1FBRHRCLGVBQVUsR0FBVixVQUFVLENBQW9CO1FBQzlCLGVBQVUsR0FBVixVQUFVLENBQVk7SUFDMUMsQ0FBQzs7Ozs7O0lBRU0sNEJBQTRCLENBQUMsUUFBZ0IsRUFBRSxJQUFlO1FBQ2pFLE9BQU8sSUFBSSxVQUFVOzs7O1FBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUMvQixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxTQUFTOzs7O1lBQ25DLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ04sSUFBSSxDQUFDLEtBQUssRUFBRTtvQkFDUixJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLFNBQVM7Ozs7b0JBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTt3QkFDL0QsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDeEIsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUN4QixDQUFDLEVBQUMsQ0FBQztpQkFDTjtx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Q0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsQztRQUNELE9BQU8sU0FBUyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDaEQsQ0FBQzs7Ozs7SUFFRCxNQUFNLENBQUMsR0FBUTtRQUNYLElBQUksR0FBRyxFQUFFO1lBQ0wsT0FBTyxHQUFHLElBQUksRUFBRSxDQUFDO1NBQ3BCO1FBQ0QsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDOzs7OztJQUVELFdBQVcsQ0FBQyxHQUFRO1FBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7O0FBM0xhLCtCQUFlLEdBQVcsZUFBZSxDQUFDO0FBQzFDLDBCQUFVLEdBQVcsb0JBQW9CLENBQUM7QUFDMUMsMEJBQVUsR0FBVyxXQUFXLENBQUM7O1lBUGxELFVBQVUsU0FBQztnQkFDUixVQUFVLEVBQUUsTUFBTTthQUNyQjs7OztZQVJRLGtCQUFrQjtZQURsQixVQUFVOzs7OztJQVlmLGdDQUF3RDs7SUFDeEQsMkJBQXdEOztJQUN4RCwyQkFBK0M7Ozs7O0lBRW5DLHFDQUFzQzs7Ozs7SUFDdEMscUNBQThCIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgTG9nU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xvZy5zZXJ2aWNlJztcbmltcG9ydCB7IEFsZnJlc2NvQXBpU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2FsZnJlc2NvLWFwaS5zZXJ2aWNlJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIGZyb20gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEZvcm1Nb2RlbCB9IGZyb20gJy4uL2NvbXBvbmVudHMvd2lkZ2V0cy9jb3JlL2Zvcm0ubW9kZWwnO1xuaW1wb3J0IHsgbWFwLCBjYXRjaEVycm9yIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEVjbU1vZGVsU2VydmljZSB7XG5cbiAgICBwdWJsaWMgc3RhdGljIE1PREVMX05BTUVTUEFDRTogc3RyaW5nID0gJ2FjdGl2aXRpRm9ybXMnO1xuICAgIHB1YmxpYyBzdGF0aWMgTU9ERUxfTkFNRTogc3RyaW5nID0gJ2FjdGl2aXRpRm9ybXNNb2RlbCc7XG4gICAgcHVibGljIHN0YXRpYyBUWVBFX01PREVMOiBzdHJpbmcgPSAnY206Zm9sZGVyJztcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYXBpU2VydmljZTogQWxmcmVzY29BcGlTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgbG9nU2VydmljZTogTG9nU2VydmljZSkge1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGVFY21UeXBlRm9yQWN0aXZpdGlGb3JtKGZvcm1OYW1lOiBzdHJpbmcsIGZvcm06IEZvcm1Nb2RlbCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXIpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoQWN0aXZpdGlFY21Nb2RlbCgpLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAobW9kZWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVBY3Rpdml0aUVjbU1vZGVsKGZvcm1OYW1lLCBmb3JtKS5zdWJzY3JpYmUoKHR5cGVGb3JtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh0eXBlRm9ybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlRm9tVHlwZShmb3JtTmFtZSwgZm9ybSkuc3Vic2NyaWJlKCh0eXBlRm9ybSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQodHlwZUZvcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKGVycikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHNlYXJjaEFjdGl2aXRpRWNtTW9kZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEVjbU1vZGVscygpLnBpcGUobWFwKGZ1bmN0aW9uIChlY21Nb2RlbHM6IGFueSkge1xuICAgICAgICAgICAgcmV0dXJuIGVjbU1vZGVscy5saXN0LmVudHJpZXMuZmluZCgobW9kZWwpID0+IG1vZGVsLmVudHJ5Lm5hbWUgPT09IEVjbU1vZGVsU2VydmljZS5NT0RFTF9OQU1FKTtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIGNyZWF0ZUFjdGl2aXRpRWNtTW9kZWwoZm9ybU5hbWU6IHN0cmluZywgZm9ybTogRm9ybU1vZGVsKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcikgPT4ge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVFY21Nb2RlbChFY21Nb2RlbFNlcnZpY2UuTU9ERUxfTkFNRSwgRWNtTW9kZWxTZXJ2aWNlLk1PREVMX05BTUVTUEFDRSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgIChtb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ1NlcnZpY2UuaW5mbygnbW9kZWwgY3JlYXRlZCcsIG1vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVFY21Nb2RlbChFY21Nb2RlbFNlcnZpY2UuTU9ERUxfTkFNRSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgICAgICAgICAgKG1vZGVsQWN0aXZlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmluZm8oJ21vZGVsIGFjdGl2ZScsIG1vZGVsQWN0aXZlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUVjbVR5cGVXaXRoUHJvcGVydGllcyhmb3JtTmFtZSwgZm9ybSkuc3Vic2NyaWJlKCh0eXBlQ3JlYXRlZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHR5cGVDcmVhdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAoZXJyKSA9PiB0aGlzLmhhbmRsZUVycm9yKGVycilcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIChlcnIpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2F2ZUZvbVR5cGUoZm9ybU5hbWU6IHN0cmluZywgZm9ybTogRm9ybU1vZGVsKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcikgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZWFyY2hFY21UeXBlKGZvcm1OYW1lLCBFY21Nb2RlbFNlcnZpY2UuTU9ERUxfTkFNRSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgICAgIChlY21UeXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nU2VydmljZS5pbmZvKCdjdXN0b20gdHlwZXMnLCBlY21UeXBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlY21UeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUVjbVR5cGVXaXRoUHJvcGVydGllcyhmb3JtTmFtZSwgZm9ybSkuc3Vic2NyaWJlKCh0eXBlQ3JlYXRlZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQodHlwZUNyZWF0ZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQoZWNtVHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoZXJyKSA9PiB0aGlzLmhhbmRsZUVycm9yKGVycilcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGVFY21UeXBlV2l0aFByb3BlcnRpZXMoZm9ybU5hbWU6IHN0cmluZywgZm9ybTogRm9ybU1vZGVsKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcikgPT4ge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVFY21UeXBlKGZvcm1OYW1lLCBFY21Nb2RlbFNlcnZpY2UuTU9ERUxfTkFNRSwgRWNtTW9kZWxTZXJ2aWNlLlRZUEVfTU9ERUwpLnN1YnNjcmliZShcbiAgICAgICAgICAgICAgICAodHlwZUNyZWF0ZWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmluZm8oJ3R5cGUgQ3JlYXRlZCcsIHR5cGVDcmVhdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRQcm9wZXJ0eVRvQVR5cGUoRWNtTW9kZWxTZXJ2aWNlLk1PREVMX05BTUUsIGZvcm1OYW1lLCBmb3JtKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAocHJvcGVydHlBZGRlZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nU2VydmljZS5pbmZvKCdwcm9wZXJ0eSBBZGRlZCcsIHByb3BlcnR5QWRkZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQodHlwZUNyZWF0ZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgKGVycikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnIpKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIChlcnIpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZWFyY2hFY21UeXBlKHR5cGVOYW1lOiBzdHJpbmcsIG1vZGVsTmFtZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RWNtVHlwZShtb2RlbE5hbWUpLnBpcGUobWFwKGZ1bmN0aW9uIChjdXN0b21UeXBlczogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4gY3VzdG9tVHlwZXMubGlzdC5lbnRyaWVzLmZpbmQoKHR5cGUpID0+IHR5cGUuZW50cnkucHJlZml4ZWROYW1lID09PSB0eXBlTmFtZSB8fCB0eXBlLmVudHJ5LnRpdGxlID09PSB0eXBlTmFtZSk7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWN0aXZlRWNtTW9kZWwobW9kZWxOYW1lOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmFwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5jb3JlLmN1c3RvbU1vZGVsQXBpLmFjdGl2YXRlQ3VzdG9tTW9kZWwobW9kZWxOYW1lKSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCh0aGlzLnRvSnNvbiksXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB0aGlzLmhhbmRsZUVycm9yKGVycikpXG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGVFY21Nb2RlbChtb2RlbE5hbWU6IHN0cmluZywgbmFtZVNwYWNlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmFwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5jb3JlLmN1c3RvbU1vZGVsQXBpLmNyZWF0ZUN1c3RvbU1vZGVsKCdEUkFGVCcsICcnLCBtb2RlbE5hbWUsIG1vZGVsTmFtZSwgbmFtZVNwYWNlKSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCh0aGlzLnRvSnNvbiksXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB0aGlzLmhhbmRsZUVycm9yKGVycikpXG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRFY21Nb2RlbHMoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIGZyb20odGhpcy5hcGlTZXJ2aWNlLmdldEluc3RhbmNlKCkuY29yZS5jdXN0b21Nb2RlbEFwaS5nZXRBbGxDdXN0b21Nb2RlbCgpKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgbWFwKHRoaXMudG9Kc29uKSxcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyKSlcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEVjbVR5cGUobW9kZWxOYW1lOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmFwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5jb3JlLmN1c3RvbU1vZGVsQXBpLmdldEFsbEN1c3RvbVR5cGUobW9kZWxOYW1lKSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCh0aGlzLnRvSnNvbiksXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB0aGlzLmhhbmRsZUVycm9yKGVycikpXG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyBjcmVhdGVFY21UeXBlKHR5cGVOYW1lOiBzdHJpbmcsIG1vZGVsTmFtZTogc3RyaW5nLCBwYXJlbnRUeXBlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5jbGVhbk5hbWVUeXBlKHR5cGVOYW1lKTtcblxuICAgICAgICByZXR1cm4gZnJvbSh0aGlzLmFwaVNlcnZpY2UuZ2V0SW5zdGFuY2UoKS5jb3JlLmN1c3RvbU1vZGVsQXBpLmNyZWF0ZUN1c3RvbVR5cGUobW9kZWxOYW1lLCBuYW1lLCBwYXJlbnRUeXBlLCB0eXBlTmFtZSwgJycpKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgbWFwKHRoaXMudG9Kc29uKSxcbiAgICAgICAgICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyKSlcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZFByb3BlcnR5VG9BVHlwZShtb2RlbE5hbWU6IHN0cmluZywgdHlwZU5hbWU6IHN0cmluZywgZm9ybUZpZWxkczogYW55KSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmNsZWFuTmFtZVR5cGUodHlwZU5hbWUpO1xuXG4gICAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBbXTtcbiAgICAgICAgaWYgKGZvcm1GaWVsZHMgJiYgZm9ybUZpZWxkcy52YWx1ZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIGZvcm1GaWVsZHMudmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2Q6dGV4dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtdWx0aVZhbHVlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYW5kYXRvcnk6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFuZGF0b3J5RW5mb3JjZWQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmcm9tKHRoaXMuYXBpU2VydmljZS5nZXRJbnN0YW5jZSgpLmNvcmUuY3VzdG9tTW9kZWxBcGkuYWRkUHJvcGVydHlUb1R5cGUobW9kZWxOYW1lLCBuYW1lLCBwcm9wZXJ0aWVzKSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCh0aGlzLnRvSnNvbiksXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB0aGlzLmhhbmRsZUVycm9yKGVycikpXG4gICAgICAgICAgICApO1xuXG4gICAgfVxuXG4gICAgY2xlYW5OYW1lVHlwZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBsZXQgY2xlYW5OYW1lID0gbmFtZTtcbiAgICAgICAgaWYgKG5hbWUuaW5kZXhPZignOicpICE9PSAtMSkge1xuICAgICAgICAgICAgY2xlYW5OYW1lID0gbmFtZS5zcGxpdCgnOicpWzFdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbGVhbk5hbWUucmVwbGFjZSgvW15hLXpBLVogXS9nLCAnJyk7XG4gICAgfVxuXG4gICAgdG9Kc29uKHJlczogYW55KSB7XG4gICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMgfHwge307XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIGhhbmRsZUVycm9yKGVycjogYW55KTogYW55IHtcbiAgICAgICAgdGhpcy5sb2dTZXJ2aWNlLmVycm9yKGVycik7XG4gICAgfVxufVxuIl19
