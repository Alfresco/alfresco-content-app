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
import { NOTIFICATION_TYPE } from '../models/notification.model';
/** @type {?} */
export const rootInitiator = {
  key: '*',
  displayName: 'NOTIFICATIONS.SYSTEM'
};
/**
 * @param {?} messages
 * @param {?=} initiator
 * @return {?}
 */
export function info(messages, initiator = rootInitiator) {
  return {
    type: NOTIFICATION_TYPE.INFO,
    datetime: new Date(),
    initiator,
    messages: [].concat(messages)
  };
}
/**
 * @param {?} messages
 * @param {?=} initiator
 * @return {?}
 */
export function warning(messages, initiator = rootInitiator) {
  return {
    type: NOTIFICATION_TYPE.WARN,
    datetime: new Date(),
    initiator,
    messages: [].concat(messages)
  };
}
/**
 * @param {?} messages
 * @param {?=} initiator
 * @return {?}
 */
export function error(messages, initiator = rootInitiator) {
  return {
    type: NOTIFICATION_TYPE.ERROR,
    datetime: new Date(),
    initiator,
    messages: [].concat(messages)
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLmZhY3RvcnkuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJub3RpZmljYXRpb25zL2hlbHBlcnMvbm90aWZpY2F0aW9uLmZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsT0FBTyxFQUVILGlCQUFpQixFQUVwQixNQUFNLDhCQUE4QixDQUFDOztBQUV0QyxNQUFNLE9BQU8sYUFBYSxHQUEyQjtJQUNqRCxHQUFHLEVBQUUsR0FBRztJQUNSLFdBQVcsRUFBRSxzQkFBc0I7Q0FDdEM7Ozs7OztBQUVELE1BQU0sVUFBVSxJQUFJLENBQUMsUUFBMkIsRUFBRSxZQUFtQyxhQUFhO0lBQzlGLE9BQU87UUFDSCxJQUFJLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtRQUM1QixRQUFRLEVBQUUsSUFBSSxJQUFJLEVBQUU7UUFDcEIsU0FBUztRQUNULFFBQVEsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztLQUNoQyxDQUFDO0FBQ04sQ0FBQzs7Ozs7O0FBRUQsTUFBTSxVQUFVLE9BQU8sQ0FBQyxRQUEyQixFQUFFLFlBQW1DLGFBQWE7SUFDakcsT0FBTztRQUNILElBQUksRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO1FBQzVCLFFBQVEsRUFBRSxJQUFJLElBQUksRUFBRTtRQUNwQixTQUFTO1FBQ1QsUUFBUSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0tBQ2hDLENBQUM7QUFDTixDQUFDOzs7Ozs7QUFFRCxNQUFNLFVBQVUsS0FBSyxDQUFDLFFBQTJCLEVBQUUsWUFBbUMsYUFBYTtJQUMvRixPQUFPO1FBQ0gsSUFBSSxFQUFFLGlCQUFpQixDQUFDLEtBQUs7UUFDN0IsUUFBUSxFQUFFLElBQUksSUFBSSxFQUFFO1FBQ3BCLFNBQVM7UUFDVCxRQUFRLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7S0FDaEMsQ0FBQztBQUNOLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQge1xuICAgIE5vdGlmaWNhdGlvbkluaXRpYXRvcixcbiAgICBOT1RJRklDQVRJT05fVFlQRSxcbiAgICBOb3RpZmljYXRpb25Nb2RlbFxufSBmcm9tICcuLi9tb2RlbHMvbm90aWZpY2F0aW9uLm1vZGVsJztcblxuZXhwb3J0IGNvbnN0IHJvb3RJbml0aWF0b3I6IE5vdGlmaWNhdGlvbkluaXRpYXRvciAgPSB7XG4gICAga2V5OiAnKicsXG4gICAgZGlzcGxheU5hbWU6ICdOT1RJRklDQVRJT05TLlNZU1RFTSdcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmZvKG1lc3NhZ2VzOiBzdHJpbmcgfCBzdHJpbmdbXSwgaW5pdGlhdG9yOiBOb3RpZmljYXRpb25Jbml0aWF0b3IgPSByb290SW5pdGlhdG9yKTogTm90aWZpY2F0aW9uTW9kZWwge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IE5PVElGSUNBVElPTl9UWVBFLklORk8sXG4gICAgICAgIGRhdGV0aW1lOiBuZXcgRGF0ZSgpLFxuICAgICAgICBpbml0aWF0b3IsXG4gICAgICAgIG1lc3NhZ2VzOiBbXS5jb25jYXQobWVzc2FnZXMpXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdhcm5pbmcobWVzc2FnZXM6IHN0cmluZyB8IHN0cmluZ1tdLCBpbml0aWF0b3I6IE5vdGlmaWNhdGlvbkluaXRpYXRvciA9IHJvb3RJbml0aWF0b3IpOiBOb3RpZmljYXRpb25Nb2RlbCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogTk9USUZJQ0FUSU9OX1RZUEUuV0FSTixcbiAgICAgICAgZGF0ZXRpbWU6IG5ldyBEYXRlKCksXG4gICAgICAgIGluaXRpYXRvcixcbiAgICAgICAgbWVzc2FnZXM6IFtdLmNvbmNhdChtZXNzYWdlcylcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXJyb3IobWVzc2FnZXM6IHN0cmluZyB8IHN0cmluZ1tdLCBpbml0aWF0b3I6IE5vdGlmaWNhdGlvbkluaXRpYXRvciA9IHJvb3RJbml0aWF0b3IpOiBOb3RpZmljYXRpb25Nb2RlbCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogTk9USUZJQ0FUSU9OX1RZUEUuRVJST1IsXG4gICAgICAgIGRhdGV0aW1lOiBuZXcgRGF0ZSgpLFxuICAgICAgICBpbml0aWF0b3IsXG4gICAgICAgIG1lc3NhZ2VzOiBbXS5jb25jYXQobWVzc2FnZXMpXG4gICAgfTtcbn1cbiJdfQ==
