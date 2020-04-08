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
export class IdentityRoleModel {
  /**
   * @param {?=} obj
   */
  constructor(obj) {
    if (obj) {
      this.id = obj.id || null;
      this.name = obj.name || null;
      this.description = obj.description || null;
      this.clientRole = obj.clientRole || null;
      this.composite = obj.composite || null;
      this.containerId = obj.containerId || null;
      this.scopeParamRequired = obj.scopeParamRequired || null;
    }
  }
}
if (false) {
  /** @type {?} */
  IdentityRoleModel.prototype.id;
  /** @type {?} */
  IdentityRoleModel.prototype.name;
  /** @type {?} */
  IdentityRoleModel.prototype.description;
  /** @type {?} */
  IdentityRoleModel.prototype.clientRole;
  /** @type {?} */
  IdentityRoleModel.prototype.composite;
  /** @type {?} */
  IdentityRoleModel.prototype.containerId;
  /** @type {?} */
  IdentityRoleModel.prototype.scopeParamRequired;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlbnRpdHktcm9sZS5tb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BhbGZyZXNjby9hZGYtY29yZS8iLCJzb3VyY2VzIjpbIm1vZGVscy9pZGVudGl0eS1yb2xlLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBLE1BQU0sT0FBTyxpQkFBaUI7Ozs7SUFTMUIsWUFBWSxHQUFTO1FBQ2pCLElBQUksR0FBRyxFQUFFO1lBQ0wsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQztZQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO1lBQzdCLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUM7WUFDM0MsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQztZQUN6QyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUM7WUFDM0MsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLENBQUM7U0FDNUQ7SUFDTCxDQUFDO0NBQ0o7OztJQW5CRywrQkFBVzs7SUFDWCxpQ0FBYTs7SUFDYix3Q0FBcUI7O0lBQ3JCLHVDQUFxQjs7SUFDckIsc0NBQW9COztJQUNwQix3Q0FBcUI7O0lBQ3JCLCtDQUE2QiIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE5IEFsZnJlc2NvIFNvZnR3YXJlLCBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICovXG5leHBvcnQgY2xhc3MgSWRlbnRpdHlSb2xlTW9kZWwge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICAgIGNsaWVudFJvbGU/OiBib29sZWFuO1xuICAgIGNvbXBvc2l0ZT86IGJvb2xlYW47XG4gICAgY29udGFpbmVySWQ/OiBzdHJpbmc7XG4gICAgc2NvcGVQYXJhbVJlcXVpcmVkPzogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKG9iaj86IGFueSkge1xuICAgICAgICBpZiAob2JqKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gb2JqLmlkIHx8IG51bGw7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBvYmoubmFtZSB8fCBudWxsO1xuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IG9iai5kZXNjcmlwdGlvbiB8fCBudWxsO1xuICAgICAgICAgICAgdGhpcy5jbGllbnRSb2xlID0gb2JqLmNsaWVudFJvbGUgfHwgbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY29tcG9zaXRlID0gb2JqLmNvbXBvc2l0ZSB8fCBudWxsO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJJZCA9IG9iai5jb250YWluZXJJZCB8fCBudWxsO1xuICAgICAgICAgICAgdGhpcy5zY29wZVBhcmFtUmVxdWlyZWQgPSBvYmouc2NvcGVQYXJhbVJlcXVpcmVkIHx8IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
