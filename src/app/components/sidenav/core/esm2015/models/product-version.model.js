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
export class BpmProductVersionModel {
  /**
   * @param {?=} obj
   */
  constructor(obj) {
    if (obj) {
      this.edition = obj.edition || null;
      this.majorVersion = obj.majorVersion || null;
      this.revisionVersion = obj.revisionVersion || null;
      this.minorVersion = obj.minorVersion || null;
      this.type = obj.type || null;
    }
  }
}
if (false) {
  /** @type {?} */
  BpmProductVersionModel.prototype.edition;
  /** @type {?} */
  BpmProductVersionModel.prototype.majorVersion;
  /** @type {?} */
  BpmProductVersionModel.prototype.revisionVersion;
  /** @type {?} */
  BpmProductVersionModel.prototype.minorVersion;
  /** @type {?} */
  BpmProductVersionModel.prototype.type;
}
export class VersionModel {
  /**
   * @param {?=} obj
   */
  constructor(obj) {
    if (obj) {
      this.major = obj.major || null;
      this.minor = obj.minor || null;
      this.patch = obj.patch || null;
      this.hotfix = obj.hotfix || null;
      this.schema = obj.schema || null;
      this.label = obj.label || null;
      this.display = obj.display || null;
    }
  }
}
if (false) {
  /** @type {?} */
  VersionModel.prototype.major;
  /** @type {?} */
  VersionModel.prototype.minor;
  /** @type {?} */
  VersionModel.prototype.patch;
  /** @type {?} */
  VersionModel.prototype.hotfix;
  /** @type {?} */
  VersionModel.prototype.schema;
  /** @type {?} */
  VersionModel.prototype.label;
  /** @type {?} */
  VersionModel.prototype.display;
}
export class LicenseModel {
  /**
   * @param {?=} obj
   */
  constructor(obj) {
    if (obj) {
      this.issuedAt = obj.issuedAt || null;
      this.expiresAt = obj.expiresAt || null;
      this.remainingDays = obj.remainingDays || null;
      this.holder = obj.holder || null;
      this.mode = obj.mode || null;
      this.isClusterEnabled = obj.isClusterEnabled ? true : false;
      this.isCryptodocEnabled = obj.isCryptodocEnabled ? true : false;
    }
  }
}
if (false) {
  /** @type {?} */
  LicenseModel.prototype.issuedAt;
  /** @type {?} */
  LicenseModel.prototype.expiresAt;
  /** @type {?} */
  LicenseModel.prototype.remainingDays;
  /** @type {?} */
  LicenseModel.prototype.holder;
  /** @type {?} */
  LicenseModel.prototype.mode;
  /** @type {?} */
  LicenseModel.prototype.isClusterEnabled;
  /** @type {?} */
  LicenseModel.prototype.isCryptodocEnabled;
}
export class VersionStatusModel {
  /**
   * @param {?=} obj
   */
  constructor(obj) {
    if (obj) {
      this.isReadOnly = obj.isReadOnly ? true : false;
      this.isAuditEnabled = obj.isAuditEnabled ? true : false;
      this.isQuickShareEnabled = obj.isQuickShareEnabled ? true : false;
      this.isThumbnailGenerationEnabled = obj.isThumbnailGenerationEnabled
        ? true
        : false;
    }
  }
}
if (false) {
  /** @type {?} */
  VersionStatusModel.prototype.isReadOnly;
  /** @type {?} */
  VersionStatusModel.prototype.isAuditEnabled;
  /** @type {?} */
  VersionStatusModel.prototype.isQuickShareEnabled;
  /** @type {?} */
  VersionStatusModel.prototype.isThumbnailGenerationEnabled;
}
export class VersionModuleModel {
  /**
   * @param {?=} obj
   */
  constructor(obj) {
    if (obj) {
      this.id = obj.id || null;
      this.title = obj.title || null;
      this.description = obj.description || null;
      this.version = obj.version || null;
      this.installDate = obj.installDate || null;
      this.installState = obj.installState || null;
      this.versionMin = obj.versionMin || null;
      this.versionMax = obj.versionMax || null;
    }
  }
}
if (false) {
  /** @type {?} */
  VersionModuleModel.prototype.id;
  /** @type {?} */
  VersionModuleModel.prototype.title;
  /** @type {?} */
  VersionModuleModel.prototype.description;
  /** @type {?} */
  VersionModuleModel.prototype.version;
  /** @type {?} */
  VersionModuleModel.prototype.installDate;
  /** @type {?} */
  VersionModuleModel.prototype.installState;
  /** @type {?} */
  VersionModuleModel.prototype.versionMin;
  /** @type {?} */
  VersionModuleModel.prototype.versionMax;
}
export class EcmProductVersionModel {
  /**
   * @param {?=} obj
   */
  constructor(obj) {
    this.modules = [];
    if (obj && obj.entry && obj.entry.repository) {
      this.edition = obj.entry.repository.edition || null;
      this.version = new VersionModel(obj.entry.repository.version);
      this.license = new LicenseModel(obj.entry.repository.license);
      this.status = new VersionStatusModel(obj.entry.repository.status);
      if (obj.entry.repository.modules) {
        obj.entry.repository.modules.forEach(
          /**
           * @param {?} module
           * @return {?}
           */
          module => {
            this.modules.push(new VersionModuleModel(module));
          }
        );
      }
    }
  }
}
if (false) {
  /** @type {?} */
  EcmProductVersionModel.prototype.edition;
  /** @type {?} */
  EcmProductVersionModel.prototype.version;
  /** @type {?} */
  EcmProductVersionModel.prototype.license;
  /** @type {?} */
  EcmProductVersionModel.prototype.status;
  /** @type {?} */
  EcmProductVersionModel.prototype.modules;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC12ZXJzaW9uLm1vZGVsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFsZnJlc2NvL2FkZi1jb3JlLyIsInNvdXJjZXMiOlsibW9kZWxzL3Byb2R1Y3QtdmVyc2lvbi5tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxNQUFNLE9BQU8sc0JBQXNCOzs7O0lBTy9CLFlBQVksR0FBUztRQUNqQixJQUFJLEdBQUcsRUFBRTtZQUNMLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUM7WUFDbkMsSUFBSSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQztZQUM3QyxJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDO1lBQ25ELElBQUksQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUM7WUFDN0MsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztTQUNoQztJQUNMLENBQUM7Q0FDSjs7O0lBZkcseUNBQWdCOztJQUNoQiw4Q0FBcUI7O0lBQ3JCLGlEQUF3Qjs7SUFDeEIsOENBQXFCOztJQUNyQixzQ0FBYTs7QUFhakIsTUFBTSxPQUFPLFlBQVk7Ozs7SUFTckIsWUFBWSxHQUFTO1FBQ2pCLElBQUksR0FBRyxFQUFFO1lBQ0wsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztZQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO1lBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7WUFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQztZQUNqQyxJ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QUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDdEQsQ0FBQyxFQUFDLENBQUM7YUFDTjtTQUNKO0lBQ0wsQ0FBQztDQUVKOzs7SUFwQkcseUNBQWdCOztJQUNoQix5Q0FBc0I7O0lBQ3RCLHlDQUFzQjs7SUFDdEIsd0NBQTJCOztJQUMzQix5Q0FBbUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOSBBbGZyZXNjbyBTb2Z0d2FyZSwgTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5leHBvcnQgY2xhc3MgQnBtUHJvZHVjdFZlcnNpb25Nb2RlbCB7XG4gICAgZWRpdGlvbjogc3RyaW5nO1xuICAgIG1ham9yVmVyc2lvbjogc3RyaW5nO1xuICAgIHJldmlzaW9uVmVyc2lvbjogc3RyaW5nO1xuICAgIG1pbm9yVmVyc2lvbjogc3RyaW5nO1xuICAgIHR5cGU6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG9iaj86IGFueSkge1xuICAgICAgICBpZiAob2JqKSB7XG4gICAgICAgICAgICB0aGlzLmVkaXRpb24gPSBvYmouZWRpdGlvbiB8fCBudWxsO1xuICAgICAgICAgICAgdGhpcy5tYWpvclZlcnNpb24gPSBvYmoubWFqb3JWZXJzaW9uIHx8IG51bGw7XG4gICAgICAgICAgICB0aGlzLnJldmlzaW9uVmVyc2lvbiA9IG9iai5yZXZpc2lvblZlcnNpb24gfHwgbnVsbDtcbiAgICAgICAgICAgIHRoaXMubWlub3JWZXJzaW9uID0gb2JqLm1pbm9yVmVyc2lvbiB8fCBudWxsO1xuICAgICAgICAgICAgdGhpcy50eXBlID0gb2JqLnR5cGUgfHwgbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZlcnNpb25Nb2RlbCB7XG4gICAgbWFqb3I6IHN0cmluZztcbiAgICBtaW5vcjogc3RyaW5nO1xuICAgIHBhdGNoOiBzdHJpbmc7XG4gICAgaG90Zml4OiBzdHJpbmc7XG4gICAgc2NoZW1hOiBudW1iZXI7XG4gICAgbGFiZWw6IHN0cmluZztcbiAgICBkaXNwbGF5OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihvYmo/OiBhbnkpIHtcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgdGhpcy5tYWpvciA9IG9iai5tYWpvciB8fCBudWxsO1xuICAgICAgICAgICAgdGhpcy5taW5vciA9IG9iai5taW5vciB8fCBudWxsO1xuICAgICAgICAgICAgdGhpcy5wYXRjaCA9IG9iai5wYXRjaCB8fCBudWxsO1xuICAgICAgICAgICAgdGhpcy5ob3RmaXggPSBvYmouaG90Zml4IHx8IG51bGw7XG4gICAgICAgICAgICB0aGlzLnNjaGVtYSA9IG9iai5zY2hlbWEgfHwgbnVsbDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwgPSBvYmoubGFiZWwgfHwgbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheSA9IG9iai5kaXNwbGF5IHx8IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaWNlbnNlTW9kZWwge1xuICAgIGlzc3VlZEF0OiBzdHJpbmc7XG4gICAgZXhwaXJlc0F0OiBzdHJpbmc7XG4gICAgcmVtYWluaW5nRGF5czogbnVtYmVyO1xuICAgIGhvbGRlcjogc3RyaW5nO1xuICAgIG1vZGU6IHN0cmluZztcbiAgICBpc0NsdXN0ZXJFbmFibGVkOiBib29sZWFuO1xuICAgIGlzQ3J5cHRvZG9jRW5hYmxlZDogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKG9iaj86IGFueSkge1xuICAgICAgICBpZiAob2JqKSB7XG4gICAgICAgICAgICB0aGlzLmlzc3VlZEF0ID0gb2JqLmlzc3VlZEF0IHx8IG51bGw7XG4gICAgICAgICAgICB0aGlzLmV4cGlyZXNBdCA9IG9iai5leHBpcmVzQXQgfHwgbnVsbDtcbiAgICAgICAgICAgIHRoaXMucmVtYWluaW5nRGF5cyA9IG9iai5yZW1haW5pbmdEYXlzIHx8IG51bGw7XG4gICAgICAgICAgICB0aGlzLmhvbGRlciA9IG9iai5ob2xkZXIgfHwgbnVsbDtcbiAgICAgICAgICAgIHRoaXMubW9kZSA9IG9iai5tb2RlIHx8IG51bGw7XG4gICAgICAgICAgICB0aGlzLmlzQ2x1c3RlckVuYWJsZWQgPSBvYmouaXNDbHVzdGVyRW5hYmxlZCA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaXNDcnlwdG9kb2NFbmFibGVkID0gb2JqLmlzQ3J5cHRvZG9jRW5hYmxlZCA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZlcnNpb25TdGF0dXNNb2RlbCB7XG4gICAgaXNSZWFkT25seTogYm9vbGVhbjtcbiAgICBpc0F1ZGl0RW5hYmxlZDogYm9vbGVhbjtcbiAgICBpc1F1aWNrU2hhcmVFbmFibGVkOiBib29sZWFuO1xuICAgIGlzVGh1bWJuYWlsR2VuZXJhdGlvbkVuYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihvYmo/OiBhbnkpIHtcbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgdGhpcy5pc1JlYWRPbmx5ID0gb2JqLmlzUmVhZE9ubHkgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmlzQXVkaXRFbmFibGVkID0gb2JqLmlzQXVkaXRFbmFibGVkID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5pc1F1aWNrU2hhcmVFbmFibGVkID0gb2JqLmlzUXVpY2tTaGFyZUVuYWJsZWQgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmlzVGh1bWJuYWlsR2VuZXJhdGlvbkVuYWJsZWQgPSBvYmouaXNUaHVtYm5haWxHZW5lcmF0aW9uRW5hYmxlZCA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFZlcnNpb25Nb2R1bGVNb2RlbCB7XG4gICAgaWQ6IHN0cmluZztcbiAgICB0aXRsZTogc3RyaW5nO1xuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gICAgdmVyc2lvbjogc3RyaW5nO1xuICAgIGluc3RhbGxEYXRlOiBzdHJpbmc7XG4gICAgaW5zdGFsbFN0YXRlOiBzdHJpbmc7XG4gICAgdmVyc2lvbk1pbjogc3RyaW5nO1xuICAgIHZlcnNpb25NYXg6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKG9iaj86IGFueSkge1xuICAgICAgICBpZiAob2JqKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gb2JqLmlkIHx8IG51bGw7XG4gICAgICAgICAgICB0aGlzLnRpdGxlID0gb2JqLnRpdGxlIHx8IG51bGw7XG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gb2JqLmRlc2NyaXB0aW9uIHx8IG51bGw7XG4gICAgICAgICAgICB0aGlzLnZlcnNpb24gPSBvYmoudmVyc2lvbiB8fCBudWxsO1xuICAgICAgICAgICAgdGhpcy5pbnN0YWxsRGF0ZSA9IG9iai5pbnN0YWxsRGF0ZSB8fCBudWxsO1xuICAgICAgICAgICAgdGhpcy5pbnN0YWxsU3RhdGUgPSBvYmouaW5zdGFsbFN0YXRlIHx8IG51bGw7XG4gICAgICAgICAgICB0aGlzLnZlcnNpb25NaW4gPSBvYmoudmVyc2lvbk1pbiB8fCBudWxsO1xuICAgICAgICAgICAgdGhpcy52ZXJzaW9uTWF4ID0gb2JqLnZlcnNpb25NYXggfHwgbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEVjbVByb2R1Y3RWZXJzaW9uTW9kZWwge1xuICAgIGVkaXRpb246IHN0cmluZztcbiAgICB2ZXJzaW9uOiBWZXJzaW9uTW9kZWw7XG4gICAgbGljZW5zZTogTGljZW5zZU1vZGVsO1xuICAgIHN0YXR1czogVmVyc2lvblN0YXR1c01vZGVsO1xuICAgIG1vZHVsZXM6IFZlcnNpb25Nb2R1bGVNb2RlbFtdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcihvYmo/OiBhbnkpIHtcbiAgICAgICAgaWYgKG9iaiAmJiBvYmouZW50cnkgJiYgb2JqLmVudHJ5LnJlcG9zaXRvcnkpIHtcbiAgICAgICAgICAgIHRoaXMuZWRpdGlvbiA9IG9iai5lbnRyeS5yZXBvc2l0b3J5LmVkaXRpb24gfHwgbnVsbDtcbiAgICAgICAgICAgIHRoaXMudmVyc2lvbiA9IG5ldyBWZXJzaW9uTW9kZWwob2JqLmVudHJ5LnJlcG9zaXRvcnkudmVyc2lvbik7XG4gICAgICAgICAgICB0aGlzLmxpY2Vuc2UgPSBuZXcgTGljZW5zZU1vZGVsKG9iai5lbnRyeS5yZXBvc2l0b3J5LmxpY2Vuc2UpO1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBuZXcgVmVyc2lvblN0YXR1c01vZGVsKG9iai5lbnRyeS5yZXBvc2l0b3J5LnN0YXR1cyk7XG4gICAgICAgICAgICBpZiAob2JqLmVudHJ5LnJlcG9zaXRvcnkubW9kdWxlcykge1xuICAgICAgICAgICAgICAgIG9iai5lbnRyeS5yZXBvc2l0b3J5Lm1vZHVsZXMuZm9yRWFjaCgobW9kdWxlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kdWxlcy5wdXNoKG5ldyBWZXJzaW9uTW9kdWxlTW9kZWwobW9kdWxlKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiJdfQ==
