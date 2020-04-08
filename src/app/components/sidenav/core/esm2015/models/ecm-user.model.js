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
export class EcmUserModel {
  /**
   * @param {?=} obj
   */
  constructor(obj) {
    this.id = (obj && obj.id) || null;
    this.firstName = obj && obj.firstName;
    this.lastName = obj && obj.lastName;
    this.description = (obj && obj.description) || null;
    this.avatarId = (obj && obj.avatarId) || null;
    this.email = (obj && obj.email) || null;
    this.skypeId = obj && obj.skypeId;
    this.googleId = obj && obj.googleId;
    this.instantMessageId = obj && obj.instantMessageId;
    this.jobTitle = (obj && obj.jobTitle) || null;
    this.location = (obj && obj.location) || null;
    this.company = obj && obj.company;
    this.mobile = obj && obj.mobile;
    this.telephone = obj && obj.telephone;
    this.statusUpdatedAt = obj && obj.statusUpdatedAt;
    this.userStatus = obj && obj.userStatus;
    this.enabled = obj && obj.enabled;
    this.emailNotificationsEnabled = obj && obj.emailNotificationsEnabled;
  }
}
if (false) {
  /** @type {?} */
  EcmUserModel.prototype.id;
  /** @type {?} */
  EcmUserModel.prototype.firstName;
  /** @type {?} */
  EcmUserModel.prototype.lastName;
  /** @type {?} */
  EcmUserModel.prototype.description;
  /** @type {?} */
  EcmUserModel.prototype.avatarId;
  /** @type {?} */
  EcmUserModel.prototype.email;
  /** @type {?} */
  EcmUserModel.prototype.skypeId;
  /** @type {?} */
  EcmUserModel.prototype.googleId;
  /** @type {?} */
  EcmUserModel.prototype.instantMessageId;
  /** @type {?} */
  EcmUserModel.prototype.jobTitle;
  /** @type {?} */
  EcmUserModel.prototype.location;
  /** @type {?} */
  EcmUserModel.prototype.company;
  /** @type {?} */
  EcmUserModel.prototype.mobile;
  /** @type {?} */
  EcmUserModel.prototype.telephone;
  /** @type {?} */
  EcmUserModel.prototype.statusUpdatedAt;
  /** @type {?} */
  EcmUserModel.prototype.userStatus;
  /** @type {?} */
  EcmUserModel.prototype.enabled;
  /** @type {?} */
  EcmUserModel.prototype.emailNotificationsEnabled;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNtLXVzZXIubW9kZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYWxmcmVzY28vYWRmLWNvcmUvIiwic291cmNlcyI6WyJtb2RlbHMvZWNtLXVzZXIubW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsTUFBTSxPQUFPLFlBQVk7Ozs7SUFvQnJCLFlBQVksR0FBUztRQUNqQixJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQztRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUM7UUFDbEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUM7UUFDNUMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7UUFDdEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQztRQUNsQyxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDO1FBQ3BELElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDO1FBQzVDLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDO1FBQzVDLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDbEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxlQUFlLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7UUFDbEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUN4QyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQ2xDLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLHlCQUF5QixDQUFDO0lBQzFFLENBQUM7Q0FDSjs7O0lBdkNHLDBCQUFXOztJQUNYLGlDQUFrQjs7SUFDbEIsZ0NBQWlCOztJQUNqQixtQ0FBb0I7O0lBQ3BCLGdDQUFpQjs7SUFDakIsNkJBQWM7O0lBQ2QsK0JBQWdCOztJQUNoQixnQ0FBaUI7O0lBQ2pCLHdDQUF5Qjs7SUFDekIsZ0NBQWlCOztJQUNqQixnQ0FBaUI7O0lBQ2pCLCtCQUF5Qjs7SUFDekIsOEJBQWU7O0lBQ2YsaUNBQWtCOztJQUNsQix1Q0FBc0I7O0lBQ3RCLGtDQUFtQjs7SUFDbkIsK0JBQWlCOztJQUNqQixpREFBbUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBQZXJzb24gfSBmcm9tICdAYWxmcmVzY28vanMtYXBpJztcbmltcG9ydCB7IEVjbUNvbXBhbnlNb2RlbCB9IGZyb20gJy4vZWNtLWNvbXBhbnkubW9kZWwnO1xuXG5leHBvcnQgY2xhc3MgRWNtVXNlck1vZGVsIGltcGxlbWVudHMgUGVyc29uIHtcbiAgICBpZDogc3RyaW5nO1xuICAgIGZpcnN0TmFtZTogc3RyaW5nO1xuICAgIGxhc3ROYW1lOiBzdHJpbmc7XG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgICBhdmF0YXJJZDogc3RyaW5nO1xuICAgIGVtYWlsOiBzdHJpbmc7XG4gICAgc2t5cGVJZDogc3RyaW5nO1xuICAgIGdvb2dsZUlkOiBzdHJpbmc7XG4gICAgaW5zdGFudE1lc3NhZ2VJZDogc3RyaW5nO1xuICAgIGpvYlRpdGxlOiBzdHJpbmc7XG4gICAgbG9jYXRpb246IHN0cmluZztcbiAgICBjb21wYW55OiBFY21Db21wYW55TW9kZWw7XG4gICAgbW9iaWxlOiBzdHJpbmc7XG4gICAgdGVsZXBob25lOiBzdHJpbmc7XG4gICAgc3RhdHVzVXBkYXRlZEF0OiBEYXRlO1xuICAgIHVzZXJTdGF0dXM6IHN0cmluZztcbiAgICBlbmFibGVkOiBib29sZWFuO1xuICAgIGVtYWlsTm90aWZpY2F0aW9uc0VuYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihvYmo/OiBhbnkpIHtcbiAgICAgICAgdGhpcy5pZCA9IG9iaiAmJiBvYmouaWQgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5maXJzdE5hbWUgPSBvYmogJiYgb2JqLmZpcnN0TmFtZTtcbiAgICAgICAgdGhpcy5sYXN0TmFtZSA9IG9iaiAmJiBvYmoubGFzdE5hbWU7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBvYmogJiYgb2JqLmRlc2NyaXB0aW9uIHx8IG51bGw7XG4gICAgICAgIHRoaXMuYXZhdGFySWQgPSBvYmogJiYgb2JqLmF2YXRhcklkIHx8IG51bGw7XG4gICAgICAgIHRoaXMuZW1haWwgPSBvYmogJiYgb2JqLmVtYWlsIHx8IG51bGw7XG4gICAgICAgIHRoaXMuc2t5cGVJZCA9IG9iaiAmJiBvYmouc2t5cGVJZDtcbiAgICAgICAgdGhpcy5nb29nbGVJZCA9IG9iaiAmJiBvYmouZ29vZ2xlSWQ7XG4gICAgICAgIHRoaXMuaW5zdGFudE1lc3NhZ2VJZCA9IG9iaiAmJiBvYmouaW5zdGFudE1lc3NhZ2VJZDtcbiAgICAgICAgdGhpcy5qb2JUaXRsZSA9IG9iaiAmJiBvYmouam9iVGl0bGUgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5sb2NhdGlvbiA9IG9iaiAmJiBvYmoubG9jYXRpb24gfHwgbnVsbDtcbiAgICAgICAgdGhpcy5jb21wYW55ID0gb2JqICYmIG9iai5jb21wYW55O1xuICAgICAgICB0aGlzLm1vYmlsZSA9IG9iaiAmJiBvYmoubW9iaWxlO1xuICAgICAgICB0aGlzLnRlbGVwaG9uZSA9IG9iaiAmJiBvYmoudGVsZXBob25lO1xuICAgICAgICB0aGlzLnN0YXR1c1VwZGF0ZWRBdCA9IG9iaiAmJiBvYmouc3RhdHVzVXBkYXRlZEF0O1xuICAgICAgICB0aGlzLnVzZXJTdGF0dXMgPSBvYmogJiYgb2JqLnVzZXJTdGF0dXM7XG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IG9iaiAmJiBvYmouZW5hYmxlZDtcbiAgICAgICAgdGhpcy5lbWFpbE5vdGlmaWNhdGlvbnNFbmFibGVkID0gb2JqICYmIG9iai5lbWFpbE5vdGlmaWNhdGlvbnNFbmFibGVkO1xuICAgIH1cbn1cbiJdfQ==
