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
import { FormSaveRepresentation } from '@alfresco/js-api';
export class FormDefinitionModel extends FormSaveRepresentation {
  /**
   * @param {?} id
   * @param {?} name
   * @param {?} lastUpdatedByFullName
   * @param {?} lastUpdated
   * @param {?} metadata
   */
  constructor(id, name, lastUpdatedByFullName, lastUpdated, metadata) {
    super();
    this.reusable = false;
    this.newVersion = false;
    this.formImageBase64 = '';
    this.formRepresentation = {
      id: id,
      name: name,
      description: '',
      version: 1,
      lastUpdatedBy: 1,
      lastUpdatedByFullName: lastUpdatedByFullName,
      lastUpdated: lastUpdated,
      stencilSetId: 0,
      referenceId: null,
      formDefinition: {
        fields: [
          {
            name: 'Label',
            type: 'container',
            fieldType: 'ContainerRepresentation',
            numberOfColumns: 2,
            required: false,
            readOnly: false,
            sizeX: 2,
            sizeY: 1,
            row: -1,
            col: -1,
            fields: { '1': this.metadataToFields(metadata) }
          }
        ],
        gridsterForm: false,
        javascriptEvents: [],
        metadata: {},
        outcomes: [],
        className: '',
        style: '',
        tabs: [],
        variables: []
      }
    };
  }
  /**
   * @private
   * @param {?} metadata
   * @return {?}
   */
  metadataToFields(metadata) {
    /** @type {?} */
    const fields = [];
    if (metadata) {
      metadata.forEach(
        /**
         * @param {?} property
         * @return {?}
         */
        function(property) {
          if (property) {
            /** @type {?} */
            const field = {
              type: 'text',
              id: property.name,
              name: property.name,
              required: false,
              readOnly: false,
              sizeX: 1,
              sizeY: 1,
              row: -1,
              col: -1,
              colspan: 1,
              params: {
                existingColspan: 1,
                maxColspan: 2
              },
              layout: {
                colspan: 1,
                row: -1,
                column: -1
              }
            };
            fields.push(field);
          }
        }
      );
    }
    return fields;
  }
}
if (false) {
  /** @type {?} */
  FormDefinitionModel.prototype.reusable;
  /** @type {?} */
  FormDefinitionModel.prototype.newVersion;
  /** @type {?} */
  FormDefinitionModel.prototype.formRepresentation;
  /** @type {?} */
  FormDefinitionModel.prototype.formImageBase64;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1kZWZpbml0aW9uLm1vZGVsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsiZm9ybS9tb2RlbHMvZm9ybS1kZWZpbml0aW9uLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRTFELE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxzQkFBc0I7Ozs7Ozs7O0lBTTNELFlBQVksRUFBVSxFQUFFLElBQVMsRUFBRSxxQkFBNkIsRUFBRSxXQUFtQixFQUFFLFFBQWE7UUFDaEcsS0FBSyxFQUFFLENBQUM7UUFOWixhQUFRLEdBQVksS0FBSyxDQUFDO1FBQzFCLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFFNUIsb0JBQWUsR0FBVyxFQUFFLENBQUM7UUFJekIsSUFBSSxDQUFDLGtCQUFrQixHQUFHO1lBQ3RCLEVBQUUsRUFBRSxFQUFFO1lBQ04sSUFBSSxFQUFFLElBQUk7WUFDVixXQUFXLEVBQUUsRUFBRTtZQUNmLE9BQU8sRUFBRSxDQUFDO1lBQ1YsYUFBYSxFQUFFLENBQUM7WUFDaEIscUJBQXFCLEVBQUUscUJBQXFCO1lBQzVDLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLFlBQVksRUFBRSxDQUFDO1lBQ2YsV0FBVyxFQUFFLElBQUk7WUFDakIsY0FBYyxFQUFFO2dCQUNaLE1BQU0sRUFBRSxDQUFDO3dCQUNMLElBQUksRUFBRSxPQUFPO3dCQUNiLElBQUksRUFBRSxXQUFXO3dCQUNqQixTQUFTLEVBQUUseUJBQXlCO3dCQUNwQyxlQUFlLEVBQUUsQ0FBQzt3QkFDbEIsUUFBUSxFQUFFLEtBQUs7d0JBQ2YsUUFBUSxFQUFFLEtBQUs7d0JBQ2YsS0FBSyxFQUFFLENBQUM7d0JBQ1IsS0FBSyxFQUFFLENBQUM7d0JBQ1IsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFDUCxHQUFHLEVBQUUsQ0FBQyxDQUFDO3dCQUNQLE1BQU0sRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEVBQUM7cUJBQ2pELENBQUM7Z0JBQ0YsWUFBWSxFQUFFLEtBQUs7Z0JBQ25CLGdCQUFnQixFQUFFLEVBQUU7Z0JBQ3BCLFFBQVEsRUFBRSxFQUFFO2dCQUNaLFFBQVEsRUFBRSxFQUFFO2dCQUNaLFNBQVMsRUFBRSxFQUFFO2dCQUNiLEtBQUssRUFBRSxFQUFFO2dCQUNULElBQUksRUFBRSxFQUFFO2dCQUNSLFNBQVMsRUFBRSxFQUFFO2FBQ2hCO1NBQ0osQ0FBQztJQUNOLENBQUM7Ozs7OztJQUVPLGdCQUFnQixDQUFDLFFBQWE7O2NBQzVCLE1BQU0sR0FBRyxFQUFFO1FBQ2pCLElBQUksUUFBUSxFQUFFO1lBQ1YsUUFBUSxDQUFDLE9BQU87Ozs7WUFBQyxVQUFTLFFBQVE7Z0JBQzlCLElBQUksUUFBUSxFQUFFOzswQkFDSixLQUFLLEdBQUc7d0JBQ1YsSUFBSSxFQUFFLE1BQU07d0JBQ1osRUFBRSxFQUFFLFFBQVEsQ0FBQyxJQUFJO3dCQUNqQixJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7d0JBQ25CLFFBQVEsRUFBRSxLQUFLO3dCQUNmLFFBQVEsRUFBRSxLQUFLO3dCQUNmLEtBQUssRUFBRSxDQUFDO3dCQUNSLEtBQUssRUFBRSxDQUFDO3dCQUNSLEdBQUcsRUFBRSxDQUFDLENBQUM7d0JBQ1AsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFDUCxPQUFPLEVBQUUsQ0FBQzt3QkFDVixNQUFNLEVBQUU7NEJBQ0osZUFBZSxFQUFFLENBQUM7NEJBQ2xCLFVBQVUsRUFBRSxDQUFDO3lCQUNoQjt3QkFDRCxNQUFNLEVBQUU7NEJBQ0osT0FBTyxFQUFFLENBQUM7NEJBQ1YsR0FBRyxFQUFFLENBQUMsQ0FBQzs0QkFDUCxNQUFNLEVBQUUsQ0FBQyxDQUFDO3lCQUNiO3FCQUNKO29CQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3RCO1lBQ0wsQ0FBQyxFQUFDLENBQUM7U0FDTjtRQUVELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7Q0FDSjs7O0lBNUVHLHVDQUEwQjs7SUFDMUIseUNBQTRCOztJQUM1QixpREFBd0I7O0lBQ3hCLDhDQUE2QiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5cbmltcG9ydCB7IEZvcm1TYXZlUmVwcmVzZW50YXRpb24gfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcblxuZXhwb3J0IGNsYXNzIEZvcm1EZWZpbml0aW9uTW9kZWwgZXh0ZW5kcyBGb3JtU2F2ZVJlcHJlc2VudGF0aW9uIHtcbiAgICByZXVzYWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIG5ld1ZlcnNpb246IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBmb3JtUmVwcmVzZW50YXRpb246IGFueTtcbiAgICBmb3JtSW1hZ2VCYXNlNjQ6IHN0cmluZyA9ICcnO1xuXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgbmFtZTogYW55LCBsYXN0VXBkYXRlZEJ5RnVsbE5hbWU6IHN0cmluZywgbGFzdFVwZGF0ZWQ6IHN0cmluZywgbWV0YWRhdGE6IGFueSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmZvcm1SZXByZXNlbnRhdGlvbiA9IHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICB2ZXJzaW9uOiAxLFxuICAgICAgICAgICAgbGFzdFVwZGF0ZWRCeTogMSxcbiAgICAgICAgICAgIGxhc3RVcGRhdGVkQnlGdWxsTmFtZTogbGFzdFVwZGF0ZWRCeUZ1bGxOYW1lLFxuICAgICAgICAgICAgbGFzdFVwZGF0ZWQ6IGxhc3RVcGRhdGVkLFxuICAgICAgICAgICAgc3RlbmNpbFNldElkOiAwLFxuICAgICAgICAgICAgcmVmZXJlbmNlSWQ6IG51bGwsXG4gICAgICAgICAgICBmb3JtRGVmaW5pdGlvbjoge1xuICAgICAgICAgICAgICAgIGZpZWxkczogW3tcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0xhYmVsJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkVHlwZTogJ0NvbnRhaW5lclJlcHJlc2VudGF0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyT2ZDb2x1bW5zOiAyLFxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHJlYWRPbmx5OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgc2l6ZVg6IDIsXG4gICAgICAgICAgICAgICAgICAgIHNpemVZOiAxLFxuICAgICAgICAgICAgICAgICAgICByb3c6IC0xLFxuICAgICAgICAgICAgICAgICAgICBjb2w6IC0xLFxuICAgICAgICAgICAgICAgICAgICBmaWVsZHM6IHsnMSc6IHRoaXMubWV0YWRhdGFUb0ZpZWxkcyhtZXRhZGF0YSl9XG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgZ3JpZHN0ZXJGb3JtOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBqYXZhc2NyaXB0RXZlbnRzOiBbXSxcbiAgICAgICAgICAgICAgICBtZXRhZGF0YToge30sXG4gICAgICAgICAgICAgICAgb3V0Y29tZXM6IFtdLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJycsXG4gICAgICAgICAgICAgICAgc3R5bGU6ICcnLFxuICAgICAgICAgICAgICAgIHRhYnM6IFtdLFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlczogW11cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1ldGFkYXRhVG9GaWVsZHMobWV0YWRhdGE6IGFueSk6IGFueVtdIHtcbiAgICAgICAgY29uc3QgZmllbGRzID0gW107XG4gICAgICAgIGlmIChtZXRhZGF0YSkge1xuICAgICAgICAgICAgbWV0YWRhdGEuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWVsZCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBwcm9wZXJ0eS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogcHJvcGVydHkubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRPbmx5OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemVYOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZVk6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICByb3c6IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sOiAtMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGlzdGluZ0NvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4Q29sc3BhbjogMlxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheW91dDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHNwYW46IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93OiAtMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IC0xXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgfVxufVxuIl19
