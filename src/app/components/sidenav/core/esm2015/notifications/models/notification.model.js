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
/** @enum {string} */
const NOTIFICATION_TYPE = {
  INFO: 'info',
  WARN: 'warning',
  ERROR: 'error'
};
export { NOTIFICATION_TYPE };
/**
 * @record
 */
export function NotificationInitiator() {}
if (false) {
  /** @type {?} */
  NotificationInitiator.prototype.key;
  /** @type {?} */
  NotificationInitiator.prototype.displayName;
  /** @type {?|undefined} */
  NotificationInitiator.prototype.extra;
}
/**
 * @record
 */
export function NotificationModel() {}
if (false) {
  /** @type {?} */
  NotificationModel.prototype.type;
  /** @type {?} */
  NotificationModel.prototype.initiator;
  /** @type {?} */
  NotificationModel.prototype.datetime;
  /** @type {?} */
  NotificationModel.prototype.messages;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLm1vZGVsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsibm90aWZpY2F0aW9ucy9tb2RlbHMvbm90aWZpY2F0aW9uLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFrQkksTUFBTyxNQUFNO0lBQ2IsTUFBTyxTQUFTO0lBQ2hCLE9BQVEsT0FBTzs7Ozs7O0FBR25CLDJDQUlDOzs7SUFIRyxvQ0FBcUI7O0lBQ3JCLDRDQUFvQjs7SUFDcEIsc0NBQVk7Ozs7O0FBR2hCLHVDQUtDOzs7SUFKRyxpQ0FBd0I7O0lBQ3hCLHNDQUFpQzs7SUFDakMscUNBQWU7O0lBQ2YscUNBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgQWxmcmVzY28gU29mdHdhcmUsIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuZXhwb3J0IGVudW0gTk9USUZJQ0FUSU9OX1RZUEUge1xuICAgIElORk8gPSAnaW5mbycsXG4gICAgV0FSTiA9ICd3YXJuaW5nJyxcbiAgICBFUlJPUiA9ICdlcnJvcidcbn1cblxuZXhwb3J0IGludGVyZmFjZSBOb3RpZmljYXRpb25Jbml0aWF0b3Ige1xuICAgIGtleTogc3RyaW5nIHwgU3ltYm9sO1xuICAgIGRpc3BsYXlOYW1lOiBzdHJpbmc7XG4gICAgZXh0cmE/OiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTm90aWZpY2F0aW9uTW9kZWwge1xuICAgIHR5cGU6IE5PVElGSUNBVElPTl9UWVBFO1xuICAgIGluaXRpYXRvcjogTm90aWZpY2F0aW9uSW5pdGlhdG9yO1xuICAgIGRhdGV0aW1lOiBEYXRlO1xuICAgIG1lc3NhZ2VzOiBzdHJpbmdbXTtcbn1cbiJdfQ==
