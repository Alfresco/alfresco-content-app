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
/**
 * @record
 */
export function IdentityGroupModel() {}
if (false) {
  /** @type {?|undefined} */
  IdentityGroupModel.prototype.id;
  /** @type {?|undefined} */
  IdentityGroupModel.prototype.name;
  /** @type {?|undefined} */
  IdentityGroupModel.prototype.path;
  /** @type {?|undefined} */
  IdentityGroupModel.prototype.realmRoles;
  /** @type {?|undefined} */
  IdentityGroupModel.prototype.clientRoles;
  /** @type {?|undefined} */
  IdentityGroupModel.prototype.access;
  /** @type {?|undefined} */
  IdentityGroupModel.prototype.attributes;
  /** @type {?|undefined} */
  IdentityGroupModel.prototype.readonly;
}
/**
 * @record
 */
export function IdentityGroupSearchParam() {}
if (false) {
  /** @type {?|undefined} */
  IdentityGroupSearchParam.prototype.name;
}
/**
 * @record
 */
export function IdentityGroupQueryResponse() {}
if (false) {
  /** @type {?} */
  IdentityGroupQueryResponse.prototype.entries;
  /** @type {?} */
  IdentityGroupQueryResponse.prototype.pagination;
}
/**
 * @record
 */
export function IdentityGroupQueryCloudRequestModel() {}
if (false) {
  /** @type {?} */
  IdentityGroupQueryCloudRequestModel.prototype.first;
  /** @type {?} */
  IdentityGroupQueryCloudRequestModel.prototype.max;
}
/**
 * @record
 */
export function IdentityGroupCountModel() {}
if (false) {
  /** @type {?} */
  IdentityGroupCountModel.prototype.count;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpdHktZ3JvdXAubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJtb2RlbHMvaWRlbnRpdHktZ3JvdXAubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsd0NBU0M7OztJQVJHLGdDQUFZOztJQUNaLGtDQUFjOztJQUNkLGtDQUFjOztJQUNkLHdDQUFzQjs7SUFDdEIseUNBQWtCOztJQUNsQixvQ0FBYTs7SUFDYix3Q0FBaUI7O0lBQ2pCLHNDQUFtQjs7Ozs7QUFHdkIsOENBRUM7OztJQURHLHdDQUFjOzs7OztBQUdsQixnREFJQzs7O0lBRkcsNkNBQThCOztJQUM5QixnREFBdUI7Ozs7O0FBRzNCLHlEQUdDOzs7SUFGRyxvREFBYzs7SUFDZCxrREFBWTs7Ozs7QUFHaEIsNkNBRUM7OztJQURHLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHsgUGFnaW5hdGlvbiB9IGZyb20gJ0BhbGZyZXNjby9qcy1hcGknO1xuXG5leHBvcnQgaW50ZXJmYWNlIElkZW50aXR5R3JvdXBNb2RlbCB7XG4gICAgaWQ/OiBzdHJpbmc7XG4gICAgbmFtZT86IHN0cmluZztcbiAgICBwYXRoPzogc3RyaW5nO1xuICAgIHJlYWxtUm9sZXM/OiBzdHJpbmdbXTtcbiAgICBjbGllbnRSb2xlcz86IGFueTtcbiAgICBhY2Nlc3M/OiBhbnk7XG4gICAgYXR0cmlidXRlcz86IGFueTtcbiAgICByZWFkb25seT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSWRlbnRpdHlHcm91cFNlYXJjaFBhcmFtIHtcbiAgICBuYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElkZW50aXR5R3JvdXBRdWVyeVJlc3BvbnNlIHtcblxuICAgIGVudHJpZXM6IElkZW50aXR5R3JvdXBNb2RlbFtdO1xuICAgIHBhZ2luYXRpb246IFBhZ2luYXRpb247XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSWRlbnRpdHlHcm91cFF1ZXJ5Q2xvdWRSZXF1ZXN0TW9kZWwge1xuICAgIGZpcnN0OiBudW1iZXI7XG4gICAgbWF4OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSWRlbnRpdHlHcm91cENvdW50TW9kZWwge1xuICAgIGNvdW50OiBudW1iZXI7XG59XG4iXX0=
