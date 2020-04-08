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
export class FormFieldTypes {
  /**
   * @param {?} type
   * @return {?}
   */
  static isReadOnlyType(type) {
    return FormFieldTypes.READONLY_TYPES.includes(type);
  }
  /**
   * @param {?} type
   * @return {?}
   */
  static isContainerType(type) {
    return type === FormFieldTypes.CONTAINER || type === FormFieldTypes.GROUP;
  }
}
FormFieldTypes.CONTAINER = 'container';
FormFieldTypes.GROUP = 'group';
FormFieldTypes.DYNAMIC_TABLE = 'dynamic-table';
FormFieldTypes.TEXT = 'text';
FormFieldTypes.MULTILINE_TEXT = 'multi-line-text';
FormFieldTypes.DROPDOWN = 'dropdown';
FormFieldTypes.HYPERLINK = 'hyperlink';
FormFieldTypes.RADIO_BUTTONS = 'radio-buttons';
FormFieldTypes.DISPLAY_VALUE = 'readonly';
FormFieldTypes.READONLY_TEXT = 'readonly-text';
FormFieldTypes.UPLOAD = 'upload';
FormFieldTypes.TYPEAHEAD = 'typeahead';
FormFieldTypes.FUNCTIONAL_GROUP = 'functional-group';
FormFieldTypes.PEOPLE = 'people';
FormFieldTypes.BOOLEAN = 'boolean';
FormFieldTypes.NUMBER = 'integer';
FormFieldTypes.DATE = 'date';
FormFieldTypes.AMOUNT = 'amount';
FormFieldTypes.DOCUMENT = 'document';
FormFieldTypes.DATETIME = 'datetime';
FormFieldTypes.ATTACH_FOLDER = 'select-folder';
FormFieldTypes.READONLY_TYPES = [
  FormFieldTypes.HYPERLINK,
  FormFieldTypes.DISPLAY_VALUE,
  FormFieldTypes.READONLY_TEXT,
  FormFieldTypes.GROUP
];
if (false) {
  /** @type {?} */
  FormFieldTypes.CONTAINER;
  /** @type {?} */
  FormFieldTypes.GROUP;
  /** @type {?} */
  FormFieldTypes.DYNAMIC_TABLE;
  /** @type {?} */
  FormFieldTypes.TEXT;
  /** @type {?} */
  FormFieldTypes.MULTILINE_TEXT;
  /** @type {?} */
  FormFieldTypes.DROPDOWN;
  /** @type {?} */
  FormFieldTypes.HYPERLINK;
  /** @type {?} */
  FormFieldTypes.RADIO_BUTTONS;
  /** @type {?} */
  FormFieldTypes.DISPLAY_VALUE;
  /** @type {?} */
  FormFieldTypes.READONLY_TEXT;
  /** @type {?} */
  FormFieldTypes.UPLOAD;
  /** @type {?} */
  FormFieldTypes.TYPEAHEAD;
  /** @type {?} */
  FormFieldTypes.FUNCTIONAL_GROUP;
  /** @type {?} */
  FormFieldTypes.PEOPLE;
  /** @type {?} */
  FormFieldTypes.BOOLEAN;
  /** @type {?} */
  FormFieldTypes.NUMBER;
  /** @type {?} */
  FormFieldTypes.DATE;
  /** @type {?} */
  FormFieldTypes.AMOUNT;
  /** @type {?} */
  FormFieldTypes.DOCUMENT;
  /** @type {?} */
  FormFieldTypes.DATETIME;
  /** @type {?} */
  FormFieldTypes.ATTACH_FOLDER;
  /** @type {?} */
  FormFieldTypes.READONLY_TYPES;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC10eXBlcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbImZvcm0vY29tcG9uZW50cy93aWRnZXRzL2NvcmUvZm9ybS1maWVsZC10eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsTUFBTSxPQUFPLGNBQWM7Ozs7O0lBOEJ2QixNQUFNLENBQUMsY0FBYyxDQUFDLElBQVk7UUFDOUIsT0FBTyxjQUFjLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4RCxDQUFDOzs7OztJQUVELE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBWTtRQUMvQixPQUFPLElBQUksS0FBSyxjQUFjLENBQUMsU0FBUyxJQUFJLElBQUksS0FBSyxjQUFjLENBQUMsS0FBSyxDQUFDO0lBQzlFLENBQUM7O0FBbkNNLHdCQUFTLEdBQVcsV0FBVyxDQUFDO0FBQ2hDLG9CQUFLLEdBQVcsT0FBTyxDQUFDO0FBQ3hCLDRCQUFhLEdBQVcsZUFBZSxDQUFDO0FBQ3hDLG1CQUFJLEdBQVcsTUFBTSxDQUFDO0FBQ3RCLDZCQUFjLEdBQVcsaUJBQWlCLENBQUM7QUFDM0MsdUJBQVEsR0FBVyxVQUFVLENBQUM7QUFDOUIsd0JBQVMsR0FBVyxXQUFXLENBQUM7QUFDaEMsNEJBQWEsR0FBVyxlQUFlLENBQUM7QUFDeEMsNEJBQWEsR0FBVyxVQUFVLENBQUM7QUFDbkMsNEJBQWEsR0FBVyxlQUFlLENBQUM7QUFDeEMscUJBQU0sR0FBVyxRQUFRLENBQUM7QUFDMUIsd0JBQVMsR0FBVyxXQUFXLENBQUM7QUFDaEMsK0JBQWdCLEdBQVcsa0JBQWtCLENBQUM7QUFDOUMscUJBQU0sR0FBVyxRQUFRLENBQUM7QUFDMUIsc0JBQU8sR0FBVyxTQUFTLENBQUM7QUFDNUIscUJBQU0sR0FBVyxTQUFTLENBQUM7QUFDM0IsbUJBQUksR0FBVyxNQUFNLENBQUM7QUFDdEIscUJBQU0sR0FBVyxRQUFRLENBQUM7QUFDMUIsdUJBQVEsR0FBVyxVQUFVLENBQUM7QUFDOUIsdUJBQVEsR0FBVyxVQUFVLENBQUM7QUFDOUIsNEJBQWEsR0FBVyxlQUFlLENBQUM7QUFFeEMsNkJBQWMsR0FBYTtJQUM5QixjQUFjLENBQUMsU0FBUztJQUN4QixjQUFjLENBQUMsYUFBYTtJQUM1QixjQUFjLENBQUMsYUFBYTtJQUM1QixjQUFjLENBQUMsS0FBSztDQUN2QixDQUFDOzs7SUEzQkYseUJBQXVDOztJQUN2QyxxQkFBK0I7O0lBQy9CLDZCQUErQzs7SUFDL0Msb0JBQTZCOztJQUM3Qiw4QkFBa0Q7O0lBQ2xELHdCQUFxQzs7SUFDckMseUJBQXVDOztJQUN2Qyw2QkFBK0M7O0lBQy9DLDZCQUEwQzs7SUFDMUMsNkJBQStDOztJQUMvQyxzQkFBaUM7O0lBQ2pDLHlCQUF1Qzs7SUFDdkMsZ0NBQXFEOztJQUNyRCxzQkFBaUM7O0lBQ2pDLHVCQUFtQzs7SUFDbkMsc0JBQWtDOztJQUNsQyxvQkFBNkI7O0lBQzdCLHNCQUFpQzs7SUFDakMsd0JBQXFDOztJQUNyQyx3QkFBcUM7O0lBQ3JDLDZCQUErQzs7SUFFL0MsOEJBS0UiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG4gLyogdHNsaW50OmRpc2FibGU6Y29tcG9uZW50LXNlbGVjdG9yICAqL1xuXG5leHBvcnQgY2xhc3MgRm9ybUZpZWxkVHlwZXMge1xuICAgIHN0YXRpYyBDT05UQUlORVI6IHN0cmluZyA9ICdjb250YWluZXInO1xuICAgIHN0YXRpYyBHUk9VUDogc3RyaW5nID0gJ2dyb3VwJztcbiAgICBzdGF0aWMgRFlOQU1JQ19UQUJMRTogc3RyaW5nID0gJ2R5bmFtaWMtdGFibGUnO1xuICAgIHN0YXRpYyBURVhUOiBzdHJpbmcgPSAndGV4dCc7XG4gICAgc3RhdGljIE1VTFRJTElORV9URVhUOiBzdHJpbmcgPSAnbXVsdGktbGluZS10ZXh0JztcbiAgICBzdGF0aWMgRFJPUERPV046IHN0cmluZyA9ICdkcm9wZG93bic7XG4gICAgc3RhdGljIEhZUEVSTElOSzogc3RyaW5nID0gJ2h5cGVybGluayc7XG4gICAgc3RhdGljIFJBRElPX0JVVFRPTlM6IHN0cmluZyA9ICdyYWRpby1idXR0b25zJztcbiAgICBzdGF0aWMgRElTUExBWV9WQUxVRTogc3RyaW5nID0gJ3JlYWRvbmx5JztcbiAgICBzdGF0aWMgUkVBRE9OTFlfVEVYVDogc3RyaW5nID0gJ3JlYWRvbmx5LXRleHQnO1xuICAgIHN0YXRpYyBVUExPQUQ6IHN0cmluZyA9ICd1cGxvYWQnO1xuICAgIHN0YXRpYyBUWVBFQUhFQUQ6IHN0cmluZyA9ICd0eXBlYWhlYWQnO1xuICAgIHN0YXRpYyBGVU5DVElPTkFMX0dST1VQOiBzdHJpbmcgPSAnZnVuY3Rpb25hbC1ncm91cCc7XG4gICAgc3RhdGljIFBFT1BMRTogc3RyaW5nID0gJ3Blb3BsZSc7XG4gICAgc3RhdGljIEJPT0xFQU46IHN0cmluZyA9ICdib29sZWFuJztcbiAgICBzdGF0aWMgTlVNQkVSOiBzdHJpbmcgPSAnaW50ZWdlcic7XG4gICAgc3RhdGljIERBVEU6IHN0cmluZyA9ICdkYXRlJztcbiAgICBzdGF0aWMgQU1PVU5UOiBzdHJpbmcgPSAnYW1vdW50JztcbiAgICBzdGF0aWMgRE9DVU1FTlQ6IHN0cmluZyA9ICdkb2N1bWVudCc7XG4gICAgc3RhdGljIERBVEVUSU1FOiBzdHJpbmcgPSAnZGF0ZXRpbWUnO1xuICAgIHN0YXRpYyBBVFRBQ0hfRk9MREVSOiBzdHJpbmcgPSAnc2VsZWN0LWZvbGRlcic7XG5cbiAgICBzdGF0aWMgUkVBRE9OTFlfVFlQRVM6IHN0cmluZ1tdID0gW1xuICAgICAgICBGb3JtRmllbGRUeXBlcy5IWVBFUkxJTkssXG4gICAgICAgIEZvcm1GaWVsZFR5cGVzLkRJU1BMQVlfVkFMVUUsXG4gICAgICAgIEZvcm1GaWVsZFR5cGVzLlJFQURPTkxZX1RFWFQsXG4gICAgICAgIEZvcm1GaWVsZFR5cGVzLkdST1VQXG4gICAgXTtcblxuICAgIHN0YXRpYyBpc1JlYWRPbmx5VHlwZSh0eXBlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIEZvcm1GaWVsZFR5cGVzLlJFQURPTkxZX1RZUEVTLmluY2x1ZGVzKHR5cGUpO1xuICAgIH1cblxuICAgIHN0YXRpYyBpc0NvbnRhaW5lclR5cGUodHlwZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0eXBlID09PSBGb3JtRmllbGRUeXBlcy5DT05UQUlORVIgfHwgdHlwZSA9PT0gRm9ybUZpZWxkVHlwZXMuR1JPVVA7XG4gICAgfVxufVxuIl19
